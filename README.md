# DARTS Project

Application connectée de scoring de fléchettes (variante 301) utilisant la vision par ordinateur pour détecter automatiquement les points marqués.

## Fonctionnalités

- Détection automatique des fléchettes via vision par ordinateur (C++)
- Calcul et suivi du score en temps réel (variante 301)
- Interface de bureau via Electron.js
- API backend Node.js/Express
- Persistance des données avec SQLite

## Architecture

Le projet est divisé en trois modules développés en équipe :

- **Backend** (Node.js/Express, port 3010) — API et logique métier
- **Base de données** (SQLite) — stockage des scores et parties
- **Frontend** (Electron.js) — interface utilisateur desktop
- **Module de détection** (C++) — traitement d'image et reconnaissance des impacts
- **Module réseau** — communication entre les composants

> Un schéma d'architecture sera ajouté prochainement.

## Équipe

Projet réalisé en collaboration avec 2 coéquipiers :
- Backend & Frontend : [ton nom]
- Vision par ordinateur (C++) : [nom coéquipier]
- Réseau : [nom coéquipier]

## Installation

\`\`\`bash
git clone https://github.com/scorp984/DARTS-project.git
cd DARTS-project
npm install
npm start
\`\`\`

## Stack technique

| Composant | Technologie |
|---|---|
| Backend | Node.js, Express |
| Base de données | SQLite |
| Frontend | Electron.js |
| Vision par ordinateur | C++ |

## Statut

Projet réalisé dans le cadre du BTS CIEL.
