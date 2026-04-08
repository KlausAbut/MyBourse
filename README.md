# MyBourse

## Présentation

MyBourse est une application web développée en **TypeScript** permettant de comparer l’évolution de deux actions boursières à partir d’une API REST.

Le projet a été réalisé sans framework, en manipulant directement le **DOM**, conformément aux consignes du module.

---

## RUN

### Installation

```bash
git clone https://github.com/KlausAbut/MyBourse.git
cd MyBourse
npm install
```

### Lancer le projet

```bash
npm run dev
```

### Build de production

```bash
npm run build
npm run preview
```

---

## API utilisée

Les données proviennent de l’API suivante :

https://keligmartin.github.io/api/stocks.json

Cette API fournit pour chaque action :

- le symbole
- le nom
- le secteur
- le prix actuel
- un historique des prix

---

## Objectifs du projet

Ce projet a pour but de mettre en pratique :

- la consommation d’une API REST avec `fetch`
- la programmation asynchrone (`async/await`)
- le typage avec TypeScript
- la manipulation dynamique du DOM
- la gestion des erreurs
- l’affichage de données avec un graphique

---

## Fonctionnalités

L’application permet de :

- sélectionner deux actions boursières
- choisir une période d’affichage
- changer le type de graphique (ligne / barres)
- afficher les informations principales des actions
- comparer visuellement les prix avec un graphique
- gérer les erreurs utilisateur (sélection incorrecte)
- gérer les erreurs API
- mettre à jour dynamiquement l’interface

---

## Technologies utilisées

- **Vite**
- **TypeScript**
- **Chart.js**
- **HTML / CSS**
- **DOM natif (sans framework)**

---

## Structure du projet

```bash
src/
├── app/
│   └── initApp.ts
├── features/
│   └── stocks/
│       ├── api/
│       │   └── stockApi.ts
│       ├── charts/
│       │   └── stockChart.ts
│       ├── models/
│       │   └── stock.types.ts
│       └── ui/
│           ├── stockForm.ts
│           └── messages.ts
├── shared/
│   ├── config/
│   │   └── env.ts
│   └── errors/
│       └── AppError.ts
├── main.ts
└── style.css
```
