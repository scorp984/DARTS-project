# Guide pour apprendre a structurer les fichiers du projet Flechette

## But du document

Ce document sert a t'apprendre a organiser proprement les fichiers de ton projet `flechette`.

Cette version est plus complete et ajoute les notions de :

- frontend
- backend
- api
- fichiers partages
- documentation

Le but n'est pas de coder ici.
Le but est de comprendre ou ranger les fichiers pour ne pas se perdre dans le projet.

## Idee generale a retenir

Quand un projet grandit, il faut separer les roles.

Tu dois distinguer :

- ce que voit l'utilisateur
- ce qui gere la logique
- ce qui communique entre les deux

La regle simple est :

- `frontend` = ce que l'utilisateur voit
- `backend` = ce que le serveur ou la logique gere
- `api` = le lien entre le frontend et le backend

## Definitions simples

### Frontend

Le frontend est la partie visible.

C'est ce que l'utilisateur utilise directement :

- pages
- boutons
- formulaires
- menus
- affichage des scores
- interface du jeu

Dans ton projet Electron, les fichiers HTML, CSS et JavaScript de tes pages appartiennent surtout au frontend.

### Backend

Le backend est la partie qui gere la logique "derriere".

C'est lui qui peut s'occuper de :

- calculs
- sauvegarde des donnees
- joueurs
- scores
- base de donnees
- authentification
- regles du jeu

Le backend n'est pas fait pour l'affichage.
Il sert a traiter les donnees.

### API

L'API est le passage entre le frontend et le backend.

Le frontend demande quelque chose.
Le backend repond.

Exemple simple :

1. le frontend demande la liste des joueurs
2. l'API transmet la demande
3. le backend recupere les donnees
4. l'API renvoie la reponse au frontend

Tu peux imaginer l'API comme une porte bien rangee entre les deux parties.

## Structure globale conseillee

Voici une structure claire pour un projet `flechette` avec frontend, backend et api :

```txt
flechette/
├─ frontend/
├─ backend/
├─ shared/
├─ docs/
├─ package.json
├─ package-lock.json
└─ node_modules/
```

Cette structure est tres importante car elle separe clairement les responsabilites.

## A quoi sert chaque grand dossier

### `frontend/`

Ce dossier contient tout ce qui concerne l'interface utilisateur.

Tu y ranges :

- les pages
- les styles
- les scripts lies a l'affichage
- les images
- les sons utilises dans l'interface

### `backend/`

Ce dossier contient tout ce qui concerne la logique metier et les traitements.

Tu y ranges :

- la logique serveur
- les routes de l'api
- les traitements des scores
- la gestion des joueurs
- la sauvegarde des donnees

### `shared/`

Ce dossier contient ce qui peut etre partage entre frontend et backend.

Exemples :

- constantes
- noms de modes de jeu
- regles communes
- fichiers de configuration partages

### `docs/`

Ce dossier contient la documentation.

Tu peux y mettre :

- des guides
- des notes
- des schemas
- des explications sur l'organisation du projet

## Structure detaillee conseillee

Voici une structure plus complete et plus facile a suivre :

```txt
flechette/
├─ frontend/
│  ├─ pages/
│  │  ├─ home/
│  │  │  ├─ home.html
│  │  │  ├─ home.css
│  │  │  └─ home.js
│  │  ├─ game/
│  │  │  ├─ game.html
│  │  │  ├─ game.css
│  │  │  └─ game.js
│  │  ├─ game301/
│  │  │  ├─ game301.html
│  │  │  ├─ game301.css
│  │  │  └─ game301.js
│  │  ├─ game501/
│  │  └─ game1001/
│  ├─ components/
│  ├─ assets/
│  │  ├─ images/
│  │  ├─ sounds/
│  │  └─ icons/
│  ├─ styles/
│  │  └─ global.css
│  └─ scripts/
│     └─ common/
│
├─ backend/
│  ├─ api/
│  │  ├─ routes/
│  │  ├─ controllers/
│  │  └─ middlewares/
│  ├─ services/
│  ├─ models/
│  ├─ database/
│  ├─ config/
│  └─ utils/
│
├─ shared/
│  ├─ constants/
│  ├─ rules/
│  └─ utils/
│
├─ docs/
│  └─ GUIDE_STRUCTURE_FICHIERS_FLECHETTE.md
│
├─ electron/
│  └─ main.js
│
├─ package.json
├─ package-lock.json
└─ node_modules/
```

## Partie frontend en detail

Le dossier `frontend/` doit contenir uniquement ce qui sert a afficher et a interagir avec l'utilisateur.

### `frontend/pages/`

Ce dossier contient les ecrans de l'application.

La bonne methode est :

`une page = un dossier`

Exemple :

```txt
pages/
├─ home/
├─ game/
├─ game301/
├─ game501/
└─ game1001/
```

Dans chaque page, tu ranges ce qui appartient a cette page :

- le fichier HTML
- le fichier CSS
- le fichier JavaScript

### `frontend/components/`

Ce dossier contient les elements reutilisables dans plusieurs pages.

Exemples :

- barre de navigation
- carte joueur
- tableau de score
- bouton reutilisable
- popup

Regle importante :

Si un element est utilise a plusieurs endroits, il ne doit pas etre range dans une seule page.
Il doit aller dans `components/`.

### `frontend/assets/`

Ce dossier contient les ressources visuelles et audio.

Exemples :

- logos
- fond d'ecran
- icones
- images des joueurs
- sons de touche
- sons de victoire

Sous-structure conseillee :

```txt
assets/
├─ images/
├─ sounds/
└─ icons/
```

### `frontend/styles/`

Ce dossier contient les styles communs.

Exemples :

- couleurs globales
- police
- taille des boutons
- structure de base

Ce dossier sert a eviter de recopier les memes styles dans toutes les pages.

### `frontend/scripts/common/`

Ce dossier contient les scripts partages entre plusieurs pages.

Exemples :

- fonctions utilitaires
- navigation entre ecrans
- formatage de score
- verification commune

## Partie backend en detail

Le dossier `backend/` contient la logique interne du projet.

Le backend n'est pas la pour afficher.
Il est la pour traiter.

### `backend/api/`

Ce dossier regroupe ce qui permet de construire l'API.

Il contient souvent :

- `routes/`
- `controllers/`
- `middlewares/`

### `backend/api/routes/`

Ce dossier contient les chemins de l'API.

Exemples d'idees :

- joueurs
- parties
- scores
- statistiques

Le role d'une route est de dire :

"si le frontend demande telle chose, on passe par ici"

### `backend/api/controllers/`

Ce dossier contient la gestion des requetes.

Le controller recoit une demande, appelle la logique utile, puis renvoie une reponse.

Tu peux retenir :

- route = chemin
- controller = gestion de la demande

### `backend/api/middlewares/`

Ce dossier contient les traitements intermediaires.

Exemples :

- verifier un token
- verifier les donnees
- gerer les erreurs
- journaliser les requetes

### `backend/services/`

Ce dossier contient la vraie logique metier.

Exemples :

- calculer un score
- verifier les regles d'une partie
- gerer un classement
- preparer les statistiques

Si quelque chose correspond a une vraie regle du projet, c'est souvent ici que ca doit aller.

### `backend/models/`

Ce dossier contient la structure des donnees.

Exemples :

- joueur
- partie
- manche
- score
- historique

Si tu utilises une base de donnees, les models representent souvent la forme des donnees.

### `backend/database/`

Ce dossier concerne le stockage des donnees.

Tu peux y mettre :

- connexion a la base
- fichiers de base locale
- scripts lies aux donnees

### `backend/config/`

Ce dossier contient la configuration du backend.

Exemples :

- port
- variables d'environnement
- configuration de base de donnees
- reglages du serveur

### `backend/utils/`

Ce dossier contient les petits outils utiles au backend.

Exemples :

- formatage de date
- aide pour les erreurs
- fonctions courtes reutilisables

## Partie API en detail

Beaucoup de personnes melangent backend et api.

Il faut bien distinguer les deux :

- le backend est toute la logique
- l'api est une partie du backend qui sert a communiquer avec le frontend

Tu peux voir ca comme ceci :

```txt
backend/
├─ api/          <- communication
├─ services/     <- logique
├─ models/       <- donnees
└─ database/     <- stockage
```

Donc :

- l'API ne remplace pas le backend
- l'API fait partie du backend

## Partie Electron

Comme ton projet ressemble a une application Electron, tu peux aussi isoler Electron dans son propre dossier.

Exemple :

```txt
electron/
└─ main.js
```

Ce dossier sert a :

- ouvrir la fenetre
- charger le frontend
- gerer le cycle de vie de l'application

C'est propre de separer Electron du frontend pur.

## Partie shared

Le dossier `shared/` est tres utile quand frontend et backend ont besoin des memes informations.

Exemples :

- liste des modes de jeu
- noms de statuts
- valeurs fixes
- regles communes
- petites fonctions reutilisables

Exemple de structure :

```txt
shared/
├─ constants/
├─ rules/
└─ utils/
```

Ce dossier evite les doublons.

## Exemple simple de circulation entre frontend, api et backend

Voici le principe de circulation :

1. le frontend affiche une page
2. l'utilisateur clique sur une action
3. le frontend envoie une demande a l'api
4. l'api transmet au backend
5. le backend traite la logique
6. le backend renvoie une reponse
7. le frontend met l'ecran a jour

Cette logique est importante a comprendre pour savoir ou ranger les fichiers.

## Comment savoir ou mettre un fichier

Avant de creer un fichier, pose-toi ces questions :

1. Est-ce que ce fichier sert a l'affichage ?
2. Est-ce que ce fichier sert a traiter des donnees ?
3. Est-ce que ce fichier sert a faire communiquer deux parties ?
4. Est-ce que ce fichier est partage entre plusieurs zones ?

Ensuite :

- si c'est de l'affichage, il va dans `frontend/`
- si c'est de la logique, il va dans `backend/`
- si c'est de la communication entre le front et le back, il va dans `backend/api/`
- si c'est commun, il va dans `shared/`

## Exemples concrets

### Exemple 1

Tu ajoutes une nouvelle page d'accueil.

Elle doit aller dans :

```txt
frontend/pages/home/
```

### Exemple 2

Tu ajoutes une logique pour calculer automatiquement un score.

Elle doit aller plutot dans :

```txt
backend/services/
```

### Exemple 3

Tu ajoutes un point d'entree pour recuperer les scores.

Il doit aller plutot dans :

```txt
backend/api/routes/
```

ou etre gere avec :

```txt
backend/api/controllers/
```

### Exemple 4

Tu ajoutes une liste commune des modes de jeu.

Elle peut aller dans :

```txt
shared/constants/
```

### Exemple 5

Tu ajoutes un logo.

Il doit aller dans :

```txt
frontend/assets/images/
```

## Ce qu'il faut eviter

### 1. Tout mettre a la racine

Mauvaise idee :

```txt
flechette/
├─ main.js
├─ home.html
├─ home.css
├─ score.js
├─ players.js
├─ api.js
├─ image1.png
├─ sound1.mp3
└─ game301.html
```

Problemes :

- tu ne sais plus ce qui est frontend
- tu ne sais plus ce qui est backend
- tu ne sais plus ce qui est commun
- le projet devient difficile a maintenir

### 2. Melanger l'API avec les pages

Par exemple, mettre des fichiers d'API dans `frontend/pages/` est une mauvaise habitude.

Les pages affichent.
L'API communique.
Le backend traite.

Il faut garder cette separation.

### 3. Melanger la logique metier avec l'affichage

Exemple a eviter :

- faire les gros calculs de score dans une page HTML
- mettre des regles de jeu complexes dans un simple fichier de style ou de page

La logique metier doit etre dans le backend si tu veux une structure propre.

### 4. Dupliquer partout les memes choses

Exemples :

- recopier les memes constantes dans plusieurs dossiers
- recopier les memes fonctions
- recopier les memes styles

Quand quelque chose est partage, il faut le mettre dans un dossier commun.

## Nommer correctement les fichiers

Il faut garder des noms simples et clairs.

Bons exemples :

- `home`
- `game301`
- `score-service.js`
- `player-controller.js`
- `scores-route.js`
- `global.css`

Moins bons exemples :

- `test2`
- `nouveau truc`
- `final-final`
- `page copie`

## Ce que tu peux garder a la racine

A la racine, tu gardes seulement ce qui concerne tout le projet :

- `frontend/`
- `backend/`
- `shared/`
- `docs/`
- `electron/`
- `package.json`
- `package-lock.json`
- `node_modules/`

La racine doit rester propre.

## Regles tres simples a memoriser

Tu peux retenir ces phrases :

`frontend = ce que l'utilisateur voit`

`backend = ce que le projet traite`

`api = la communication entre frontend et backend`

`shared = ce qui est commun`

`une page = un dossier`

## Structure finale conseillee pour apprendre

Si tu veux une base facile a memoriser, retiens celle-ci :

```txt
flechette/
├─ frontend/
│  ├─ pages/
│  ├─ components/
│  ├─ assets/
│  ├─ styles/
│  └─ scripts/
├─ backend/
│  ├─ api/
│  ├─ services/
│  ├─ models/
│  ├─ database/
│  ├─ config/
│  └─ utils/
├─ shared/
├─ docs/
├─ electron/
├─ package.json
└─ node_modules/
```

## Conclusion

Si ton besoin principal est de comprendre ou mettre le frontend, le backend et l'api, alors il faut surtout retenir ceci :

- le frontend affiche
- le backend gere la logique
- l'api fait la liaison
- les elements communs vont dans `shared`
- Electron peut etre range a part dans `electron`

Avec cette logique, ton projet sera plus propre, plus lisible, et plus facile a faire evoluer.

Si tu veux, je peux maintenant te faire un deuxieme document encore plus simple :

- version debutant tres facile
- version schema visuel avec fleches
- version specialement adaptee a ton projet `flechette`
