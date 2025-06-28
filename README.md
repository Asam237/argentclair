# 💰 ArgentClair - Gestion Financière Intelligente

<div align="center">
  <img src="/assets/pictures/capture.png" alt="ArgentClair Banner" width="100%" height="400" style="object-fit: cover; border-radius: 10px;">
  
  [![Next.js](https://img.shields.io/badge/Next.js-13.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
</div>

## 🌟 Aperçu

**ArgentClair** est une application web moderne de gestion financière personnelle qui vous permet de prendre le contrôle total de vos finances. Suivez vos dépenses, gérez vos budgets, analysez vos habitudes financières et atteignez vos objectifs avec une interface élégante et intuitive.

### ✨ Fonctionnalités Principales

- 📊 **Tableau de Bord Intelligent** - Vue d'ensemble complète de vos finances
- 💸 **Suivi des Transactions** - Enregistrement facile des dépenses et revenus
- 🎯 **Gestion des Budgets** - Définition et suivi d'objectifs financiers
- 📈 **Analyses Visuelles** - Graphiques interactifs et statistiques détaillées
- 📱 **Design Responsive** - Interface optimisée pour tous les appareils
- 🌙 **Mode Sombre/Clair** - Thème adaptatif pour le confort visuel
- 📤 **Export CSV** - Exportation de vos données pour analyse externe
- 🔒 **Stockage Local** - Vos données restent privées sur votre appareil

## 🛠️ Technologies Utilisées

### Frontend

- **[Next.js 13.5](https://nextjs.org/)** - Framework React avec App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Typage statique pour JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitaire
- **[shadcn/ui](https://ui.shadcn.com/)** - Composants UI modernes et accessibles
- **[Recharts](https://recharts.org/)** - Bibliothèque de graphiques React
- **[Lucide React](https://lucide.dev/)** - Icônes SVG élégantes

### Outils de Développement

- **[ESLint](https://eslint.org/)** - Linting et qualité du code
- **[Prettier](https://prettier.io/)** - Formatage automatique du code
- **[PostCSS](https://postcss.org/)** - Transformation CSS

## 🏃‍♂️ Installation et Démarrage Rapide

### Prérequis

- Node.js 18.0 ou supérieur
- npm, yarn, ou pnpm

### Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/argentclair.git

# Naviguer dans le dossier
cd argentclair

# Installer les dépendances
npm install
# ou
yarn install
# ou
pnpm install
```

### Démarrage en Développement

```bash
# Lancer le serveur de développement
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir l'application.

### Build de Production

```bash
# Créer un build optimisé
npm run build
# ou
yarn build
# ou
pnpm build

# Démarrer en mode production
npm start
# ou
yarn start
# ou
pnpm start
```

## 📁 Structure du Projet

```
argentclair/
├── app/                    # App Router de Next.js
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React
│   ├── ui/               # Composants UI de base (shadcn/ui)
│   ├── dashboard-stats.tsx
│   ├── expense-charts.tsx
│   ├── transaction-form.tsx
│   ├── transaction-list.tsx
│   ├── budget-manager.tsx
│   ├── header.tsx
│   ├── footer.tsx
│   └── settings-dialog.tsx
├── lib/                   # Utilitaires et logique métier
│   ├── types.ts          # Définitions TypeScript
│   ├── storage.ts        # Gestion du localStorage
│   ├── fake-data.ts      # Données de démonstration
│   ├── export.ts         # Fonctions d'export
│   └── utils.ts          # Utilitaires généraux
├── public/               # Assets statiques
└── README.md            # Documentation
```

## 🎯 Fonctionnalités Détaillées

### 📊 Tableau de Bord

- **Statistiques en temps réel** : Dépenses, revenus, solde du mois
- **Graphiques interactifs** : Répartition par catégorie et évolution temporelle
- **Indicateurs visuels** : Cartes colorées avec icônes expressives

### 💳 Gestion des Transactions

- **Ajout rapide** : Formulaire intuitif pour dépenses et revenus
- **Catégorisation** : 8 catégories de dépenses et 4 de revenus prédéfinies
- **Historique complet** : Liste filtrable et exportable
- **Suppression sécurisée** : Confirmation avant suppression

### 🎯 Budgets Intelligents

- **Limites personnalisées** : Définition de budgets par catégorie
- **Alertes automatiques** : Notifications à 80% du budget
- **Suivi visuel** : Barres de progression colorées
- **Périodes flexibles** : Budgets mensuels ou hebdomadaires

### 📈 Analyses et Rapports

- **Graphiques en secteurs** : Répartition des dépenses par catégorie
- **Graphiques en barres** : Évolution sur 6 mois
- **Export CSV** : Données formatées pour Excel/Google Sheets
- **Statistiques détaillées** : Moyennes, totaux, tendances

## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Configuration Next.js
NEXT_PUBLIC_APP_NAME=ArgentClair
NEXT_PUBLIC_APP_VERSION=1.0.0

# Configuration de développement
NODE_ENV=development
```

### Personnalisation des Catégories

Modifiez le fichier `lib/types.ts` pour ajouter vos propres catégories :

```typescript
export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Alimentation",
    type: "expense",
    color: "#ef4444",
    icon: "UtensilsCrossed",
  },
  // Ajoutez vos catégories ici
];
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Fork** le projet
2. **Créez** une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

### Guidelines de Contribution

- Suivez les conventions de code existantes
- Ajoutez des tests pour les nouvelles fonctionnalités
- Mettez à jour la documentation si nécessaire
- Respectez le style de commit conventionnel

## 🐛 Signaler un Bug

Si vous trouvez un bug, veuillez [ouvrir une issue](https://github.com/Asam237/argentclair/issues) avec :

- Description détaillée du problème
- Étapes pour reproduire le bug
- Captures d'écran si applicable
- Informations sur votre environnement (OS, navigateur, version)

## 📋 Roadmap

### Version 1.1 (À venir)

- [ ] 🔐 Authentification utilisateur
- [ ] ☁️ Synchronisation cloud
- [ ] 📱 Application mobile (React Native)
- [ ] 🔔 Notifications push
- [ ] 🎨 Thèmes personnalisables

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Votre Nom**

- GitHub: [@Asam237](https://github.com/Asam237)
- LinkedIn: [Asam](https://www.linkedin.com/in/abba-sali-aboubakar-mamate/)
- Email: abbasaliaboubakar@gmail.com

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) pour le framework extraordinaire
- [shadcn/ui](https://ui.shadcn.com/) pour les composants UI élégants
- [Tailwind CSS](https://tailwindcss.com/) pour le système de design
- [Lucide](https://lucide.dev/) pour les icônes magnifiques
- [Recharts](https://recharts.org/) pour les graphiques interactifs
- [Pexels](https://pexels.com/) pour les images de qualité

## ⭐ Support

Si ce projet vous a aidé, n'hésitez pas à lui donner une ⭐ sur GitHub !

---
