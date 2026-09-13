# Documentation du projet Flechette

## 1. But de cette documentation

Cette doc est faite pour t'apprendre a comprendre ton projet Electron actuel et a le faire evoluer vers une application de flechettes connectee avec :

- un frontend
- un backend
- une API
- une base de donnees
- des donnees JSON

L'objectif est que tu comprennes le lien entre toutes les parties, meme si tu n'as jamais fait d'API.

## 2. Ce que ton projet contient aujourd'hui

Dans ton dossier `flechette`, on voit deja une petite base Electron :

- `main.js` : point d'entree Electron
- `package.json` : configuration du projet Node/Electron
- `home/home.html` : page d'accueil
- `game/game.html` : choix du mode de jeu
- `game301/game.html` : ajout de joueurs pour le mode 301

Ton application fonctionne aujourd'hui surtout comme un site HTML/CSS charge dans Electron.

En clair :

- Electron ouvre une fenetre
- cette fenetre charge un fichier HTML
- le HTML affiche les boutons et l'interface
- le JavaScript dans les pages gere les interactions

## 3. Comment Electron fonctionne

Electron repose sur 2 parties principales :

### Processus principal

C'est le fichier `main.js`.

Son role :

- demarrer l'application
- creer la fenetre
- charger les pages HTML
- parler au systeme

### Processus de rendu

Ce sont tes pages HTML, CSS et JavaScript cote interface.

Exemples chez toi :

- `home/home.html`
- `game/game.html`
- `game301/game.html`

Le renderer sert a :

- afficher l'interface
- recuperer les clics utilisateur
- afficher les scores, joueurs, parties

## 4. Ce que fait ton `main.js`

Ton `main.js` cree une fenetre Electron puis essaye de charger plusieurs pages.

Le probleme important est que ce code a quelques erreurs :

1. `Win.loadFile(...)` utilise `Win` avec un W majuscule alors que ta variable s'appelle `win`.
2. Tu appelles plusieurs fois `loadFile(...)` de suite dans la meme fenetre.
3. Une fenetre ne peut afficher qu'une page a la fois.
4. Tu references `game501` et `game1001`, mais ces dossiers ne semblent pas exister dans le projet actuel.

Consequence :

- la page finale chargee remplace la precedente
- certaines lignes peuvent faire planter l'application

Donc, dans l'etat actuel, Electron sert surtout a charger `home/home.html`, puis la navigation se fait avec `window.location.href`.

## 5. Frontend, backend, API, base de donnees : la difference

### Frontend

Le frontend, c'est ce que voit l'utilisateur.

Dans ton projet :

- HTML
- CSS
- JavaScript dans les pages

Exemples de frontend pour ton application :

- ecran d'accueil
- choix du mode 301 / 501 / 1001
- saisie des joueurs
- affichage des scores
- historique des parties

### Backend

Le backend, c'est la partie qui traite les donnees.

Son role :

- recevoir les demandes du frontend
- verifier les donnees
- enregistrer en base
- renvoyer une reponse JSON

Exemples :

- creer une partie
- ajouter un joueur
- enregistrer un lancer
- calculer le score restant

### API

Une API, c'est la porte d'entree du backend.

Le frontend envoie une requete a une URL, par exemple :

```txt
POST /api/parties
GET /api/joueurs
POST /api/lancers
```

Le backend repond souvent en JSON.

### Base de donnees

La base de donnees sert a conserver les informations.

Exemples de donnees a stocker :

- joueurs
- parties
- tours
- lancers
- scores
- date de partie

## 6. Le chemin complet d'une donnee

Voici le trajet complet le plus important a comprendre :

1. L'utilisateur clique sur "Ajouter joueur" dans le frontend.
2. Le frontend construit un objet JavaScript.
3. Cet objet est envoye au backend via une API.
4. Le backend valide les donnees.
5. Le backend enregistre dans la base de donnees.
6. Le backend renvoie une reponse JSON.
7. Le frontend lit cette reponse et met l'ecran a jour.

Exemple :

```json
{
  "nom": "Lucas"
}
```

Le backend peut repondre :

```json
{
  "success": true,
  "message": "Joueur cree",
  "joueur": {
    "id": 1,
    "nom": "Lucas"
  }
}
```

## 7. JSON : ce que tu dois retenir

JSON est juste un format texte pour transporter des donnees.

Exemple simple :

```json
{
  "id": 1,
  "nom": "Lucas",
  "score": 301
}
```

Tu vas l'utiliser partout :

- pour envoyer des donnees a l'API
- pour recevoir les reponses du backend
- parfois pour configurer l'application

## 8. Architecture conseillee pour ton appli de flechettes

Pour une application propre, je te conseille cette architecture :

```txt
flechette/
  main.js
  package.json
  home/
  game/
  game301/
  renderer/
  backend/
    server.js
    routes/
    controllers/
    db/
```

### Role de chaque partie

- `main.js` : lance Electron
- `renderer/` : code du frontend
- `backend/server.js` : serveur API
- `routes/` : definition des URLs API
- `controllers/` : logique metier
- `db/` : connexion a la base

## 9. Deux facons de relier Electron et les donnees

### Methode 1 : Electron + vrai backend API

Frontend Electron -> fetch HTTP -> Backend Express -> Base de donnees

C'est la methode la plus simple a comprendre pour apprendre.

### Methode 2 : Electron + IPC

Frontend Electron -> `ipcRenderer` -> `ipcMain` -> Node / BDD

C'est utile, mais un peu plus avance.

Pour toi, je recommande de commencer par la methode 1 :

- plus claire
- plus proche du web classique
- plus facile pour apprendre les API

## 10. Ce que tu peux construire pour ton jeu de flechettes

### Fonctionnalites minimales

- creer un joueur
- lister les joueurs
- creer une partie
- enregistrer un score
- calculer le score restant
- afficher l'historique

### Exemple de donnees utiles

#### Joueur

```json
{
  "id": 1,
  "nom": "Lucas"
}
```

#### Partie

```json
{
  "id": 12,
  "mode": 301,
  "date": "2026-03-27T10:00:00.000Z"
}
```

#### Lancer

```json
{
  "id": 55,
  "partieId": 12,
  "joueurId": 1,
  "score": 45,
  "tour": 1
}
```

## 11. Exemple concret d'API pour ton projet

Si tu utilises Express, tu peux imaginer ces routes :

### Joueurs

- `GET /api/joueurs`
- `POST /api/joueurs`

### Parties

- `GET /api/parties`
- `POST /api/parties`
- `GET /api/parties/:id`

### Lancers

- `POST /api/lancers`
- `GET /api/parties/:id/lancers`

## 12. Exemple simple de backend avec Express

Voici un mini exemple pedagogique.

### Installation

```bash
npm install express cors sqlite3
```

### Exemple `backend/server.js`

```js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let joueurs = [];

app.get("/api/joueurs", (req, res) => {
  res.json(joueurs);
});

app.post("/api/joueurs", (req, res) => {
  const { nom } = req.body;

  if (!nom) {
    return res.status(400).json({
      success: false,
      message: "Le nom est obligatoire"
    });
  }

  const joueur = {
    id: joueurs.length + 1,
    nom
  };

  joueurs.push(joueur);

  res.status(201).json({
    success: true,
    joueur
  });
});

app.listen(PORT, () => {
  console.log(`API demarree sur http://localhost:${PORT}`);
});
```

Ce code ne sauvegarde pas encore en vraie base de donnees, mais il t'apprend la logique d'une API.

## 13. Comment le frontend appelle l'API

Dans une page HTML ou un fichier JS frontend, tu peux faire :

```js
async function ajouterJoueur(nom) {
  const response = await fetch("http://localhost:3000/api/joueurs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nom })
  });

  const data = await response.json();
  console.log(data);
}
```

### Ce qui se passe ici

1. `fetch(...)` envoie une requete HTTP
2. `method: "POST"` dit qu'on cree une ressource
3. `Content-Type: application/json` indique que tu envoies du JSON
4. `JSON.stringify(...)` transforme l'objet JavaScript en texte JSON
5. `response.json()` lit la reponse JSON du backend

## 14. Exemple adapte a ton ecran `game301`

Aujourd'hui, dans `game301/game.html`, tu ajoutes les joueurs dans un tableau local :

```js
let joueurs = [];
```

Ca marche pour tester, mais ce n'est pas persistant :

- si tu fermes l'appli, tout disparait
- un autre ecran ne recupere pas automatiquement ces donnees

La bonne evolution est :

1. l'utilisateur tape le nom
2. le frontend envoie le nom a l'API
3. l'API cree le joueur
4. la BDD garde l'info
5. le frontend recharge la liste

Exemple de fonction frontend :

```js
async function ajouterJoueur() {
  const input = document.getElementById("team");
  const result = document.getElementById("result");
  const nom = input.value.trim();

  if (!nom) {
    result.textContent = "Veuillez rentrer un nom";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/joueurs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nom })
    });

    const data = await response.json();

    if (!response.ok) {
      result.textContent = data.message || "Erreur API";
      return;
    }

    result.textContent = `Joueur ajoute : ${data.joueur.nom}`;
    input.value = "";
    await chargerJoueurs();
  } catch (error) {
    result.textContent = "Impossible de contacter le serveur";
  }
}
```

Et pour relire la liste :

```js
async function chargerJoueurs() {
  const response = await fetch("http://localhost:3000/api/joueurs");
  const joueurs = await response.json();
  const liste = document.getElementById("liste-joueurs");

  liste.innerHTML = "";

  joueurs.forEach((joueur) => {
    const li = document.createElement("li");
    li.textContent = joueur.nom;
    liste.appendChild(li);
  });
}
```

## 15. La base de donnees : commencer simple

Pour debuter, SQLite est un bon choix.

Pourquoi :

- pas besoin d'installer un gros serveur
- un simple fichier `.db`
- parfait pour apprendre
- tres bien pour un projet Electron en local

### Tables conseillees

#### Table `joueurs`

- `id`
- `nom`

#### Table `parties`

- `id`
- `mode`
- `date_creation`

#### Table `lancers`

- `id`
- `partie_id`
- `joueur_id`
- `tour`
- `score`

## 16. Exemple logique de score pour un 301

Au debut d'une partie :

- chaque joueur commence a `301`

A chaque lancer :

- on enregistre le score du tour
- on soustrait au score restant

Exemple :

```json
{
  "joueurId": 1,
  "scoreRestant": 301,
  "lancer": 45
}
```

Apres traitement :

```json
{
  "joueurId": 1,
  "scoreRestant": 256
}
```

Cette logique peut etre geree :

- soit dans le frontend au debut pour tester
- soit dans le backend pour avoir une source fiable

Je te conseille le backend pour eviter les erreurs et centraliser les regles.

## 17. Difference entre page HTML locale et API

Dans ton projet actuel, tu navigues avec :

```js
window.location.href = "../game/game.html";
```

Ca change juste de page.

Une API, ce n'est pas une page a afficher.

Une API sert a demander ou envoyer des donnees, par exemple :

```js
fetch("http://localhost:3000/api/joueurs")
```

Donc :

- `window.location.href` = navigation
- `fetch(...)` = communication avec le backend

## 18. Ce que je te conseille de faire dans l'ordre

### Etape 1

Stabiliser Electron :

- garder un seul `loadFile(...)` au demarrage
- charger `home/home.html`
- laisser la navigation se faire ensuite dans le frontend

### Etape 2

Creer un backend Express separe avec :

- `GET /api/joueurs`
- `POST /api/joueurs`

### Etape 3

Modifier `game301` pour appeler l'API avec `fetch`

### Etape 4

Ajouter une base SQLite

### Etape 5

Creer les routes de parties et de scores

## 19. Exemple de flux complet pour ton futur projet

### Ajouter un joueur

1. l'utilisateur tape "Lucas"
2. clique sur "Ajouter"
3. le frontend envoie :

```json
{
  "nom": "Lucas"
}
```

4. le backend recoit la requete
5. il enregistre en base
6. il renvoie :

```json
{
  "success": true,
  "joueur": {
    "id": 1,
    "nom": "Lucas"
  }
}
```

7. le frontend affiche Lucas dans la liste

### Enregistrer un score

1. le joueur fait 60 points
2. le frontend envoie :

```json
{
  "partieId": 1,
  "joueurId": 1,
  "score": 60,
  "tour": 1
}
```

3. le backend sauvegarde
4. le backend recalcule le score restant
5. le frontend met l'ecran a jour

## 20. Erreurs classiques a eviter

### Confondre frontend et backend

Le frontend affiche.
Le backend traite.

### Stocker seulement en variable locale

`let joueurs = []` disparait quand tu fermes l'application.

### Faire toute la logique dans le HTML

Au debut c'est normal, mais rapidement il faut separer :

- le HTML pour la structure
- le CSS pour le style
- le JS pour la logique
- le backend pour les donnees

### Appeler directement la BDD depuis toutes les pages

Mieux vaut passer par une API centralisee.

## 21. Structure cible conseillee pour ton code

Exemple simple :

```txt
flechette/
  main.js
  package.json
  backend/
    server.js
    db.js
    routes/
      joueurs.js
      parties.js
      lancers.js
  home/
    home.html
    home.css
    home.js
  game/
    game.html
    game.css
    game.js
  game301/
    game.html
    game301.css
    game301.js
```

Ici, l'idee est importante :

- chaque page a son JS separe
- le backend est range a part
- le projet devient plus lisible

## 22. Ce que tu dois apprendre maintenant

Si tu veux avancer rapidement, concentre-toi sur ces notions dans cet ordre :

1. JavaScript de base
2. `fetch`
3. JSON
4. Express
5. SQLite
6. structure Electron

## 23. Petit resume ultra simple

Electron affiche ton application.

Le frontend recupere les actions utilisateur.

Le frontend appelle l'API avec `fetch`.

Le backend recoit les requetes.

Le backend lit ou ecrit dans la base de donnees.

Le backend renvoie du JSON.

Le frontend affiche le resultat.

## 24. Etat actuel de ton projet

Aujourd'hui, ton projet est surtout :

- une interface Electron
- des pages HTML/CSS
- un peu de logique JavaScript locale

Il manque encore :

- une vraie API
- une base de donnees
- une structure backend separee

Mais tu as deja une bonne base pour commencer.

## 25. Prochaine etape recommandee

La prochaine vraie etape utile est :

- creer un petit serveur Express
- connecter `game301` a `POST /api/joueurs`
- sauvegarder les joueurs en SQLite

Quand ca, c'est compris, tu auras compris le plus important de la liaison :

- frontend -> API -> backend -> BDD -> retour JSON -> frontend

## 26. Note importante sur ton code actuel

Ton fichier `main.js` devra etre corrige avant d'aller plus loin.

Les points a revoir en priorite :

- `Win` doit devenir `win`
- il ne faut pas charger 5 pages a la suite dans la meme fenetre
- les dossiers `game501` et `game1001` sont references mais absents

## 27. Si tu veux la suite

Je peux maintenant te faire la prochaine etape directement dans le projet :

- soit corriger `main.js`
- soit te creer un backend Express minimal
- soit connecter la page `game301` a une vraie API

Si on fait ca, tu apprendras en voyant le code fonctionner dans ton propre dossier.
