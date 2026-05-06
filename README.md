# MyBourse

## Présentation

MyBourse est une application web développée en **TypeScript** permettant de comparer l'évolution de deux actions boursières à partir d'une API REST.

Le projet a été réalisé sans framework, en manipulant directement le **DOM**, conformément aux consignes du module.

---

## Installation & Lancement

### Installation

```bash
git clone https://github.com/KlausAbut/MyBourse.git
cd MyBourse
npm install
```

### Lancer en développement

```bash
npm run dev
```

### Build de production

```bash
npm run build
npm run preview
```

---

## Fonctionnalités

### Fonctionnalités principales

- Sélection de deux actions boursières à comparer
- Choix d'une période d'affichage (7 jours, 1 mois, 3 mois, 6 mois, tout)
- Affichage des informations principales de chaque action (nom, secteur, prix actuel)
- Statistiques de période : haut, bas, variation absolue et en pourcentage
- Graphique interactif avec deux types de rendu (courbe / barres)
- Mise à jour dynamique de l'interface sans rechargement
- Gestion des erreurs utilisateur et API avec affichage clair dans l'interface

### Fonctionnalités bonus

- **Ticker défilant** : barre en haut de page affichant toutes les actions en temps réel avec variation colorée (vert/rouge), pausable au survol
- **Mode sombre / clair** : bouton flottant avec persistance dans le `localStorage` et détection automatique via `prefers-color-scheme`
- **Header de graphique** : affiche les deux actions comparées avec leur prix et variation directement au-dessus du graphique

---

## Choix techniques

- **Vite** comme bundler pour sa rapidité et son support natif de TypeScript/ES modules
- **Chart.js** pour l'affichage graphique : bibliothèque légère, bien documentée, compatible TypeScript
- **Architecture par feature** (`stocks/`, `ticker/`, `theme/`) : chaque fonctionnalité est isolée avec ses propres dossiers `api/`, `models/`, `ui/`, `charts/` pour faciliter la lisibilité et la maintenance
- **Typage strict** : interfaces TypeScript pour toutes les données API, type guards pour valider les réponses, `noImplicitAny` activé
- **Pas de framework** : manipulation directe du DOM via TypeScript, conformément aux contraintes du projet
- **localStorage** pour la persistance du thème sans dépendance externe

---

## API utilisée

Les données proviennent de l'API suivante :

```
https://keligmartin.github.io/api/stocks.json
```

Elle fournit pour chaque action : symbole, nom, secteur, prix actuel, devise et historique des prix.

---

## Technologies

| Outil | Usage |
|---|---|
| TypeScript | Langage principal, typage strict |
| Vite | Bundler et serveur de développement |
| Chart.js | Rendu graphique |
| HTML / CSS | Structure et styles (variables CSS, animations) |
| DOM natif | Interactions sans framework |

---

## Structure du projet

```
src/
├── app/
│   └── initApp.ts            # Initialisation et orchestration
├── features/
│   ├── stocks/
│   │   ├── api/
│   │   │   └── stockApi.ts   # Appels API et validation des données
│   │   ├── charts/
│   │   │   └── stockChart.ts # Rendu Chart.js
│   │   ├── models/
│   │   │   └── stock.types.ts # Interfaces TypeScript
│   │   └── ui/
│   │       ├── stockForm.ts  # Génération du formulaire
│   │       └── messages.ts   # Affichage des messages
│   ├── ticker/
│   │   └── stockTicker.ts    # Barre défilante des actions
│   └── theme/
│       └── themeToggle.ts    # Gestion dark/light mode
├── shared/
│   ├── config/
│   │   └── env.ts            # URL de l'API
│   └── errors/
│       └── AppError.ts       # Classe d'erreur personnalisée
├── main.ts
└── style.css
```
