const path = require('path');
const Database = require('better-sqlite3');
const cors = require('cors');
const express = require('express');

const DB_PATH = process.env.GAME301_DB_PATH || path.join(__dirname, 'darts.db');
const PORT = Number(process.env.GAME301_API_PORT || 3010);
const VISION_SERVICE_URL = process.env.VISION_SERVICE_URL || 'http://127.0.0.1:8090';

const connection = new Database(DB_PATH);
const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

function initDatabase() {
    connection.exec(`
        CREATE TABLE IF NOT EXISTS joueurs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS parties (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mode INTEGER NOT NULL,
            statut TEXT NOT NULL DEFAULT 'active',
            joueur_courant_index INTEGER NOT NULL DEFAULT 0,
            tour INTEGER NOT NULL DEFAULT 1,
            gagnant_joueur_id INTEGER,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(gagnant_joueur_id) REFERENCES joueurs(id)
        );

        CREATE TABLE IF NOT EXISTS partie_joueurs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            partie_id INTEGER NOT NULL,
            joueur_id INTEGER NOT NULL,
            ordre INTEGER NOT NULL,
            score_restant INTEGER NOT NULL,
            FOREIGN KEY(partie_id) REFERENCES parties(id),
            FOREIGN KEY(joueur_id) REFERENCES joueurs(id)
        );

        CREATE TABLE IF NOT EXISTS lancers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            partie_id INTEGER NOT NULL,
            joueur_id INTEGER,
            shot_id TEXT,
            score INTEGER NOT NULL DEFAULT 0,
            segment TEXT,
            ring TEXT,
            multiplier INTEGER,
            status TEXT NOT NULL,
            score_avant INTEGER,
            score_apres INTEGER,
            bust INTEGER NOT NULL DEFAULT 0,
            payload_json TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(partie_id) REFERENCES parties(id),
            FOREIGN KEY(joueur_id) REFERENCES joueurs(id)
        );
    `);
}

initDatabase();

function getPartieState(partieId) {
    const partie = connection
        .prepare(`
            SELECT p.*, j.nom AS gagnant_nom
            FROM parties p
            LEFT JOIN joueurs j ON j.id = p.gagnant_joueur_id
            WHERE p.id = ?
        `)
        .get(partieId);

    if (!partie) {
        return null;
    }

    const joueurs = connection
        .prepare(`
            SELECT pj.joueur_id AS id, j.nom, pj.ordre, pj.score_restant
            FROM partie_joueurs pj
            JOIN joueurs j ON j.id = pj.joueur_id
            WHERE pj.partie_id = ?
            ORDER BY pj.ordre ASC
        `)
        .all(partieId);

    const lancers = connection
        .prepare(`
            SELECT id, joueur_id, shot_id, score, segment, ring, multiplier, status,
                   score_avant, score_apres, bust, created_at
            FROM lancers
            WHERE partie_id = ?
            ORDER BY id DESC
            LIMIT 20
        `)
        .all(partieId);

    return {
        id: partie.id,
        mode: partie.mode,
        statut: partie.statut,
        joueurCourantIndex: partie.joueur_courant_index,
        tour: partie.tour,
        gagnant: partie.gagnant_joueur_id
            ? { id: partie.gagnant_joueur_id, nom: partie.gagnant_nom }
            : null,
        joueurs,
        joueurCourant: joueurs[partie.joueur_courant_index] || null,
        lancers
    };
}

function getActivePartieId() {
    const partie = connection
        .prepare("SELECT id FROM parties WHERE statut = 'active' ORDER BY id DESC LIMIT 1")
        .get();

    return partie?.id || null;
}

function advanceTurn(partie, playersCount) {
    const nextIndex = (partie.joueur_courant_index + 1) % playersCount;
    const nextTour = nextIndex === 0 ? partie.tour + 1 : partie.tour;

    connection
        .prepare(`
            UPDATE parties
            SET joueur_courant_index = ?, tour = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `)
        .run(nextIndex, nextTour, partie.id);
}

const applyVisionEvent = connection.transaction((eventPayload, forcedPartieId = null) => {
    const partieId = forcedPartieId || getActivePartieId();

    if (!partieId) {
        return { accepted: false, ignored: true, message: 'Aucune partie active' };
    }

    const partie = connection.prepare('SELECT * FROM parties WHERE id = ?').get(partieId);
    if (!partie || partie.statut !== 'active') {
        return { accepted: false, ignored: true, message: 'Partie inactive ou introuvable' };
    }

    const joueurs = connection
        .prepare('SELECT * FROM partie_joueurs WHERE partie_id = ? ORDER BY ordre ASC')
        .all(partieId);

    if (joueurs.length === 0) {
        return { accepted: false, ignored: true, message: 'Aucun joueur dans la partie' };
    }

    const joueurPartie = joueurs[partie.joueur_courant_index] || joueurs[0];
    const eventName = String(eventPayload.event || '');
    const status = String(eventPayload.status || (eventName === 'shot_detected' ? 'valid' : 'invalid'));
    const scoreTir = Number(eventPayload.score || 0);
    const isValidShot = eventName === 'shot_detected' && status === 'valid' && scoreTir > 0;
    const scoreAvant = joueurPartie.score_restant;
    let scoreApres = scoreAvant;
    let bust = false;
    let partieTerminee = false;

    if (isValidShot) {
        const tentativeScore = scoreAvant - scoreTir;

        if (tentativeScore === 0) {
            scoreApres = 0;
            partieTerminee = true;
            connection
                .prepare('UPDATE partie_joueurs SET score_restant = ? WHERE id = ?')
                .run(scoreApres, joueurPartie.id);
            connection
                .prepare(`
                    UPDATE parties
                    SET statut = 'terminee',
                        gagnant_joueur_id = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                `)
                .run(joueurPartie.joueur_id, partieId);
        } else if (tentativeScore > 0) {
            scoreApres = tentativeScore;
            connection
                .prepare('UPDATE partie_joueurs SET score_restant = ? WHERE id = ?')
                .run(scoreApres, joueurPartie.id);
            advanceTurn(partie, joueurs.length);
        } else {
            bust = true;
            advanceTurn(partie, joueurs.length);
        }
    }

    const insert = connection
        .prepare(`
            INSERT INTO lancers (
                partie_id, joueur_id, shot_id, score, segment, ring, multiplier, status,
                score_avant, score_apres, bust, payload_json
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .run(
            partieId,
            joueurPartie.joueur_id,
            eventPayload.shot_id || null,
            scoreTir,
            eventPayload.segment || null,
            eventPayload.ring || null,
            eventPayload.multiplier ?? null,
            status,
            scoreAvant,
            scoreApres,
            bust ? 1 : 0,
            JSON.stringify(eventPayload)
        );

    return {
        accepted: true,
        ignored: !isValidShot,
        lancerId: insert.lastInsertRowid,
        partieTerminee,
        partie: getPartieState(partieId)
    };
});

async function proxyVisionCommand(pathname, method = 'GET') {
    const response = await fetch(`${VISION_SERVICE_URL}${pathname}`, { method });
    const text = await response.text();
    let body;

    try {
        body = text ? JSON.parse(text) : {};
    } catch (_err) {
        body = { raw: text };
    }

    return { status: response.status, body };
}

app.get('/api/game301/joueurs', (_req, res) => {
    try {
        const joueurs = connection
            .prepare('SELECT id, nom FROM joueurs ORDER BY id ASC')
            .all();

        return res.json(joueurs);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.post('/api/game301/joueurs', (req, res) => {
    const nom = req.body?.nom?.trim();

    if (!nom) {
        return res.status(400).json({ message: 'Nom manquant' });
    }

    try {
        const result = connection
            .prepare('INSERT INTO joueurs (nom) VALUES (?)')
            .run(nom);

        return res.status(201).json({
            message: 'Joueur ajoute',
            joueur: {
                id: result.lastInsertRowid,
                nom
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.delete('/api/game301/joueurs/dernier', (_req, res) => {
    try {
        const dernierJoueur = connection
            .prepare('SELECT id, nom FROM joueurs ORDER BY id DESC LIMIT 1')
            .get();

        if (!dernierJoueur) {
            return res.status(404).json({ message: 'Aucun joueur a supprimer' });
        }

        connection.prepare('DELETE FROM joueurs WHERE id = ?').run(dernierJoueur.id);

        return res.json({
            message: 'Joueur supprime',
            joueur: dernierJoueur
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.post('/api/game301/parties', (req, res) => {
    const joueurIds = Array.isArray(req.body?.joueurIds) ? req.body.joueurIds : [];
    const ids = joueurIds.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0);

    if (ids.length < 1 || ids.length > 5) {
        return res.status(400).json({ message: 'La partie doit avoir entre 1 et 5 joueurs' });
    }

    try {
        const createPartie = connection.transaction(() => {
            connection
                .prepare("UPDATE parties SET statut = 'abandonnee', updated_at = CURRENT_TIMESTAMP WHERE statut = 'active'")
                .run();

            const existingPlayers = connection
                .prepare(`SELECT id FROM joueurs WHERE id IN (${ids.map(() => '?').join(',')})`)
                .all(...ids);

            if (existingPlayers.length !== ids.length) {
                throw new Error('Un ou plusieurs joueurs sont introuvables');
            }

            const partieResult = connection
                .prepare('INSERT INTO parties (mode, statut, joueur_courant_index, tour) VALUES (301, ?, 0, 1)')
                .run('active');

            const insertPartieJoueur = connection
                .prepare('INSERT INTO partie_joueurs (partie_id, joueur_id, ordre, score_restant) VALUES (?, ?, ?, 301)');

            ids.forEach((joueurId, index) => {
                insertPartieJoueur.run(partieResult.lastInsertRowid, joueurId, index);
            });

            return partieResult.lastInsertRowid;
        });

        const partieId = createPartie();
        return res.status(201).json({
            message: 'Partie creee',
            partie: getPartieState(partieId)
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: err.message || 'Erreur lors de la creation de la partie' });
    }
});

app.get('/api/game301/parties/active', (_req, res) => {
    const activePartieId = getActivePartieId();

    if (!activePartieId) {
        return res.status(404).json({ message: 'Aucune partie active' });
    }

    return res.json(getPartieState(activePartieId));
});

app.get('/api/game301/parties/:id', (req, res) => {
    const partie = getPartieState(Number(req.params.id));

    if (!partie) {
        return res.status(404).json({ message: 'Partie introuvable' });
    }

    return res.json(partie);
});

app.post('/api/game301/parties/:id/lancers', (req, res) => {
    try {
        const score = Number(req.body?.score);
        if (!Number.isFinite(score) || score < 0) {
            return res.status(400).json({ message: 'Score invalide' });
        }

        const result = applyVisionEvent({
            event: score > 0 ? 'shot_detected' : 'shot_invalid',
            schema_version: 1,
            shot_id: req.body?.shot_id || `manual-${Date.now()}`,
            status: score > 0 ? 'valid' : 'invalid',
            segment: req.body?.segment || 'MANUAL',
            score,
            ring: req.body?.ring || 'MANUAL',
            multiplier: req.body?.multiplier ?? null
        }, Number(req.params.id));

        return res.status(result.accepted ? 201 : 409).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.post('/vision/events', (req, res) => {
    try {
        const result = applyVisionEvent(req.body);
        return res.status(202).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ accepted: false, message: 'Erreur serveur' });
    }
});

app.get('/api/vision/health', async (_req, res) => {
    try {
        const result = await proxyVisionCommand('/healthcheck');
        return res.status(result.status).json(result.body);
    } catch (err) {
        return res.status(503).json({ status: 'unavailable', message: err.message });
    }
});

app.post('/api/vision/start', async (_req, res) => {
    try {
        const result = await proxyVisionCommand('/commands/start', 'POST');
        return res.status(result.status).json(result.body);
    } catch (err) {
        return res.status(503).json({ accepted: false, message: err.message });
    }
});

app.post('/api/vision/stop', async (_req, res) => {
    try {
        const result = await proxyVisionCommand('/commands/stop', 'POST');
        return res.status(result.status).json(result.body);
    } catch (err) {
        return res.status(503).json({ accepted: false, message: err.message });
    }
});

let server;

function startServer() {
    if (server) {
        return server;
    }

    server = app.listen(PORT, () => {
        console.log(`Serveur Flechette sur http://localhost:${PORT}`);
    });

    return server;
}

function stopServer() {
    if (server) {
        server.close();
        server = null;
    }
}

module.exports = {
    app,
    connection,
    startServer,
    stopServer
};

if (require.main === module) {
    startServer();
}
