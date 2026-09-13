# Guide de test API - projet Flechette

## 1. Point de depart

Projet cible :

```txt
C:\Users\tetun\Desktop\flechette
```

`curl` est deja installe sur cette machine :

```powershell
curl.exe --version
```

Chemin detecte :

```txt
C:\Windows\System32\curl.exe
```

Tu n'as donc rien a installer pour utiliser `curl`.

## 2. Ce que ton API expose aujourd'hui

Le fichier API est :

```txt
API\joueur\server.js
```

Port utilise :

```txt
3010
```

Base URL :

```txt
http://localhost:3010
```

Routes disponibles :

- `GET /api/game301/joueurs`
- `POST /api/game301/joueurs`
- `DELETE /api/game301/joueurs/dernier`

## 3. Ouvrir le projet dans PowerShell

```powershell
cd C:\Users\tetun\Desktop\flechette
```

## 4. Verifier que curl marche

```powershell
curl.exe --version
```

Si tu vois la version de `curl`, c'est bon.

## 5. Demarrer l'application complete

Ton projet est concu pour demarrer l'API depuis Electron via `main.js`.

Commande :

```powershell
npm start
```

Effet attendu :

- Electron s'ouvre
- `main.js` lance `startServer()`
- l'API ecoute sur `http://localhost:3010`

## 6. Tester l'API avec curl

Laisse l'application ouverte, puis ouvre un second terminal PowerShell.

Replace-toi dans le projet :

```powershell
cd C:\Users\tetun\Desktop\flechette
```

### 6.1 Lire la liste des joueurs

```powershell
curl.exe -i http://localhost:3010/api/game301/joueurs
```

Resultat attendu :

- code HTTP `200`
- une liste JSON, par exemple `[]` au debut

### 6.2 Ajouter un joueur

```powershell
curl.exe -i -X POST http://localhost:3010/api/game301/joueurs ^
  -H "Content-Type: application/json" ^
  -d "{\"nom\":\"Lucas\"}"
```

Si tu preferes une version PowerShell sur une seule ligne :

```powershell
curl.exe -i -X POST http://localhost:3010/api/game301/joueurs -H "Content-Type: application/json" -d "{\"nom\":\"Lucas\"}"
```

Resultat attendu :

- code HTTP `201`
- JSON proche de :

```json
{
  "message": "Joueur ajoute",
  "joueur": {
    "id": 1,
    "nom": "Lucas"
  }
}
```

### 6.3 Relire la liste

```powershell
curl.exe -i http://localhost:3010/api/game301/joueurs
```

Tu dois voir le joueur ajoute dans la reponse.

### 6.4 Supprimer le dernier joueur

```powershell
curl.exe -i -X DELETE http://localhost:3010/api/game301/joueurs/dernier
```

## 14. Utiliser une base SQLite personnelle

Par defaut, l'application cree une base locale dans `API/joueur/darts.db`. Ce fichier est ignore par Git.
Pour utiliser une autre base, definir `GAME301_DB_PATH` avant le demarrage :

```powershell
$env:GAME301_DB_PATH="C:\chemin\vers\ma-base.db"
npm start
```

La base et ses tables sont creees automatiquement si elles n'existent pas.

Resultat attendu :

- code HTTP `200`
- JSON avec le joueur supprime

### 6.5 Tester une erreur volontaire

Commande :

```powershell
curl.exe -i -X POST http://localhost:3010/api/game301/joueurs -H "Content-Type: application/json" -d "{}"
```

Resultat attendu :

- code HTTP `400`
- message JSON :

```json
{
  "message": "Nom manquant"
}
```

## 7. Probleme reel constate sur ce projet

J'ai teste le lancement direct de l'API avec :

```powershell
node API\joueur\server.js
```

Etat constate le 4 mai 2026 :

- echec au demarrage
- cause : `better-sqlite3` compile pour une autre version de Node

Erreur observee :

```txt
NODE_MODULE_VERSION 119
This version of Node.js requires NODE_MODULE_VERSION 141
```

En clair :

- ton `node` local est `v25.1.0`
- le module natif `better-sqlite3` a ete compile pour une ancienne version
- l'API ne demarre pas en direct avec `node` tant que ce module n'est pas recompile

## 8. Comment corriger ce blocage

Dans le dossier du projet :

```powershell
cd C:\Users\tetun\Desktop\flechette
```

### Option A - Recompiler pour ton Node actuel

```powershell
npm rebuild better-sqlite3
```

Puis retester :

```powershell
node API\joueur\server.js
```

Si le serveur demarre, tu verras :

```txt
Serveur sur le port 3010
```

Et ensuite tu peux lancer les tests `curl` du chapitre 6 sans ouvrir Electron.

### Option B - Utiliser Electron comme point d'entree

```powershell
npm start
```

Cette option est souvent la plus simple si ton projet est pilote depuis Electron.

## 9. Sequence de test recommandee

Voici l'ordre le plus utile pour toi :

1. `cd C:\Users\tetun\Desktop\flechette`
2. `curl.exe --version`
3. `npm start`
4. Dans un deuxieme terminal : `curl.exe -i http://localhost:3010/api/game301/joueurs`
5. Tester un `POST` avec un joueur
6. Tester un deuxieme `GET`
7. Tester le `DELETE`
8. Tester un `POST` invalide avec `{}` pour verifier les erreurs

## 10. Exemples de reponses HTTP a surveiller

- `200 OK` : lecture ou suppression OK
- `201 Created` : creation OK
- `400 Bad Request` : donnees manquantes ou invalides
- `404 Not Found` : rien a supprimer
- `500 Internal Server Error` : erreur backend ou probleme BDD

## 11. Fichier du frontend qui appelle deja cette API

Le mode 301 consomme deja cette URL dans :

```txt
frontend\game301\game.html
```

URL utilisee dans le code :

```txt
http://localhost:3010/api/game301/joueurs
```

Donc si `curl` fonctionne sur cette URL, ton ecran `301` doit normalement pouvoir parler a l'API aussi.

## 12. Check-list rapide

- `curl.exe` existe : oui
- API cible : `http://localhost:3010`
- routes testables : oui
- frontend branche sur cette API : oui
- blocage actuel si lancement via `node` direct : `better-sqlite3` a recompiler

## 13. Commandes minimales a retenir

```powershell
cd C:\Users\tetun\Desktop\flechette
curl.exe --version
npm start
curl.exe -i http://localhost:3010/api/game301/joueurs
curl.exe -i -X POST http://localhost:3010/api/game301/joueurs -H "Content-Type: application/json" -d "{\"nom\":\"Lucas\"}"
curl.exe -i -X DELETE http://localhost:3010/api/game301/joueurs/dernier
```
