import { Transaction, Budget } from "./types";
import { storage } from "./storage";

// Données de démonstration pour les transactions
export const FAKE_TRANSACTIONS: Transaction[] = [
  // Transactions du mois actuel (Décembre 2024)
  {
    id: "1",
    type: "income",
    amount: 450000,
    category: "Salaire",
    description: "Salaire mensuel - Développeur Senior",
    date: new Date(2024, 11, 1).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: "2",
    type: "expense",
    amount: 85000,
    category: "Logement",
    description: "Loyer appartement 3 pièces",
    date: new Date(2024, 11, 2).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 29,
  },
  {
    id: "3",
    type: "expense",
    amount: 25000,
    category: "Alimentation",
    description: "Courses au supermarché Carrefour",
    date: new Date(2024, 11, 3).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 28,
  },
  {
    id: "4",
    type: "expense",
    amount: 15000,
    category: "Transport",
    description: "Plein d'essence voiture",
    date: new Date(2024, 11, 4).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 27,
  },
  {
    id: "5",
    type: "expense",
    amount: 12000,
    category: "Loisirs",
    description: "Cinéma et restaurant avec amis",
    date: new Date(2024, 11, 5).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 26,
  },
  {
    id: "6",
    type: "expense",
    amount: 35000,
    category: "Shopping",
    description: "Vêtements d'hiver et chaussures",
    date: new Date(2024, 11, 6).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 25,
  },
  {
    id: "7",
    type: "expense",
    amount: 8000,
    category: "Santé",
    description: "Consultation médecin généraliste",
    date: new Date(2024, 11, 7).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 24,
  },
  {
    id: "8",
    type: "income",
    amount: 75000,
    category: "Freelance",
    description: "Projet développement site e-commerce",
    date: new Date(2024, 11, 8).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 23,
  },
  {
    id: "9",
    type: "expense",
    amount: 18000,
    category: "Alimentation",
    description: "Dîner en famille au restaurant",
    date: new Date(2024, 11, 9).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 22,
  },
  {
    id: "10",
    type: "expense",
    amount: 22000,
    category: "Transport",
    description: "Réparation freins voiture",
    date: new Date(2024, 11, 10).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 21,
  },
  {
    id: "11",
    type: "expense",
    amount: 45000,
    category: "Éducation",
    description: "Formation React Advanced en ligne",
    date: new Date(2024, 11, 11).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: "12",
    type: "expense",
    amount: 30000,
    category: "Alimentation",
    description: "Courses hebdomadaires + produits bio",
    date: new Date(2024, 11, 12).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 19,
  },
  {
    id: "13",
    type: "expense",
    amount: 20000,
    category: "Loisirs",
    description: "Weekend spa et détente",
    date: new Date(2024, 11, 13).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 18,
  },
  {
    id: "14",
    type: "expense",
    amount: 10000,
    category: "Autres",
    description: "Cadeau anniversaire maman",
    date: new Date(2024, 11, 14).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 17,
  },
  {
    id: "15",
    type: "income",
    amount: 25000,
    category: "Investissements",
    description: "Dividendes portefeuille actions",
    date: new Date(2024, 11, 15).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 16,
  },
  {
    id: "16",
    type: "expense",
    amount: 28000,
    category: "Alimentation",
    description: "Courses de Noël et produits festifs",
    date: new Date(2024, 11, 16).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: "17",
    type: "expense",
    amount: 50000,
    category: "Shopping",
    description: "Cadeaux de Noël famille",
    date: new Date(2024, 11, 17).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 14,
  },
  {
    id: "18",
    type: "expense",
    amount: 16000,
    category: "Transport",
    description: "Billets train pour les fêtes",
    date: new Date(2024, 11, 18).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 13,
  },
  {
    id: "19",
    type: "expense",
    amount: 14000,
    category: "Loisirs",
    description: "Concert de musique classique",
    date: new Date(2024, 11, 19).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 12,
  },
  {
    id: "20",
    type: "income",
    amount: 40000,
    category: "Autres",
    description: "Prime de fin d'année",
    date: new Date(2024, 11, 20).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 11,
  },

  // Transactions de Novembre 2024
  {
    id: "21",
    type: "income",
    amount: 450000,
    category: "Salaire",
    description: "Salaire mensuel - Novembre",
    date: new Date(2024, 10, 1).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 60,
  },
  {
    id: "22",
    type: "expense",
    amount: 85000,
    category: "Logement",
    description: "Loyer novembre + charges",
    date: new Date(2024, 10, 2).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 59,
  },
  {
    id: "23",
    type: "expense",
    amount: 65000,
    category: "Alimentation",
    description: "Courses du mois + restaurants",
    date: new Date(2024, 10, 15).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 45,
  },
  {
    id: "24",
    type: "expense",
    amount: 40000,
    category: "Transport",
    description: "Essence + contrôle technique",
    date: new Date(2024, 10, 20).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 40,
  },
  {
    id: "25",
    type: "expense",
    amount: 32000,
    category: "Loisirs",
    description: "Abonnement salle de sport + sorties",
    date: new Date(2024, 10, 25).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 35,
  },
  {
    id: "26",
    type: "income",
    amount: 60000,
    category: "Freelance",
    description: "Maintenance site web client",
    date: new Date(2024, 10, 28).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 32,
  },

  // Transactions d'Octobre 2024
  {
    id: "27",
    type: "income",
    amount: 450000,
    category: "Salaire",
    description: "Salaire mensuel - Octobre",
    date: new Date(2024, 9, 1).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 90,
  },
  {
    id: "28",
    type: "expense",
    amount: 85000,
    category: "Logement",
    description: "Loyer octobre",
    date: new Date(2024, 9, 2).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 89,
  },
  {
    id: "29",
    type: "expense",
    amount: 70000,
    category: "Alimentation",
    description: "Courses + restaurants + livraisons",
    date: new Date(2024, 9, 15).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 75,
  },
  {
    id: "30",
    type: "expense",
    amount: 55000,
    category: "Shopping",
    description: "Équipement informatique (écran)",
    date: new Date(2024, 9, 18).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 72,
  },
  {
    id: "31",
    type: "expense",
    amount: 25000,
    category: "Santé",
    description: "Dentiste + pharmacie",
    date: new Date(2024, 9, 22).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 68,
  },

  // Transactions de Septembre 2024
  {
    id: "32",
    type: "income",
    amount: 450000,
    category: "Salaire",
    description: "Salaire mensuel - Septembre",
    date: new Date(2024, 8, 1).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 120,
  },
  {
    id: "33",
    type: "expense",
    amount: 85000,
    category: "Logement",
    description: "Loyer septembre",
    date: new Date(2024, 8, 2).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 119,
  },
  {
    id: "34",
    type: "expense",
    amount: 80000,
    category: "Éducation",
    description: "Inscription formation certifiante",
    date: new Date(2024, 8, 10).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 111,
  },
  {
    id: "35",
    type: "expense",
    amount: 45000,
    category: "Transport",
    description: "Assurance auto annuelle",
    date: new Date(2024, 8, 15).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 106,
  },
  {
    id: "36",
    type: "income",
    amount: 90000,
    category: "Freelance",
    description: "Projet application mobile",
    date: new Date(2024, 8, 25).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 96,
  },

  // Transactions d'Août 2024
  {
    id: "37",
    type: "income",
    amount: 450000,
    category: "Salaire",
    description: "Salaire mensuel - Août",
    date: new Date(2024, 7, 1).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 150,
  },
  {
    id: "38",
    type: "expense",
    amount: 85000,
    category: "Logement",
    description: "Loyer août",
    date: new Date(2024, 7, 2).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 149,
  },
  {
    id: "39",
    type: "expense",
    amount: 120000,
    category: "Loisirs",
    description: "Vacances d'été - Côte d'Azur",
    date: new Date(2024, 7, 15).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 135,
  },
  {
    id: "40",
    type: "expense",
    amount: 35000,
    category: "Transport",
    description: "Location voiture vacances",
    date: new Date(2024, 7, 16).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 134,
  },
  {
    id: "41",
    type: "expense",
    amount: 60000,
    category: "Alimentation",
    description: "Restaurants et sorties vacances",
    date: new Date(2024, 7, 20).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 130,
  },

  // Transactions de Juillet 2024
  {
    id: "42",
    type: "income",
    amount: 450000,
    category: "Salaire",
    description: "Salaire mensuel - Juillet",
    date: new Date(2024, 6, 1).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 180,
  },
  {
    id: "43",
    type: "expense",
    amount: 85000,
    category: "Logement",
    description: "Loyer juillet",
    date: new Date(2024, 6, 2).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 179,
  },
  {
    id: "44",
    type: "expense",
    amount: 75000,
    category: "Shopping",
    description: "Équipement été + vêtements",
    date: new Date(2024, 6, 10).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 171,
  },
  {
    id: "45",
    type: "income",
    amount: 35000,
    category: "Investissements",
    description: "Plus-value vente actions",
    date: new Date(2024, 6, 20).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 161,
  },

  // Transactions de Juin 2024
  {
    id: "46",
    type: "income",
    amount: 450000,
    category: "Salaire",
    description: "Salaire mensuel - Juin",
    date: new Date(2024, 5, 1).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 210,
  },
  {
    id: "47",
    type: "expense",
    amount: 85000,
    category: "Logement",
    description: "Loyer juin",
    date: new Date(2024, 5, 2).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 209,
  },
  {
    id: "48",
    type: "expense",
    amount: 95000,
    category: "Autres",
    description: "Réparations appartement",
    date: new Date(2024, 5, 15).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 196,
  },
  {
    id: "49",
    type: "income",
    amount: 120000,
    category: "Freelance",
    description: "Gros projet développement",
    date: new Date(2024, 5, 25).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 186,
  },
  {
    id: "50",
    type: "expense",
    amount: 42000,
    category: "Loisirs",
    description: "Festival de musique + sorties",
    date: new Date(2024, 5, 28).toISOString().split("T")[0],
    createdAt: Date.now() - 86400000 * 183,
  },
];

// Données de démonstration pour les budgets
export const FAKE_BUDGETS: Budget[] = [
  {
    id: "budget-1",
    category: "Alimentation",
    limit: 80000,
    period: "monthly",
    alertThreshold: 80,
  },
  {
    id: "budget-2",
    category: "Transport",
    limit: 50000,
    period: "monthly",
    alertThreshold: 75,
  },
  {
    id: "budget-3",
    category: "Loisirs",
    limit: 60000,
    period: "monthly",
    alertThreshold: 85,
  },
  {
    id: "budget-4",
    category: "Shopping",
    limit: 100000,
    period: "monthly",
    alertThreshold: 70,
  },
  {
    id: "budget-5",
    category: "Santé",
    limit: 30000,
    period: "monthly",
    alertThreshold: 90,
  },
];

// Fonction pour forcer l'initialisation des données de démonstration
export const initializeFakeData = () => {
  if (typeof window === "undefined") return;

  // Vérifier si des données existent déjà
  const existingTransactions = localStorage.getItem(
    "personal-expenses-transactions"
  );
  const existingBudgets = localStorage.getItem("personal-expenses-budgets");

  // Si aucune donnée n'existe, initialiser avec les données de démonstration
  if (!existingTransactions || JSON.parse(existingTransactions).length === 0) {
    localStorage.setItem(
      "personal-expenses-transactions",
      JSON.stringify(FAKE_TRANSACTIONS)
    );
    console.log(
      "✅ Transactions de démonstration initialisées:",
      FAKE_TRANSACTIONS.length
    );
  }

  if (!existingBudgets || JSON.parse(existingBudgets).length === 0) {
    localStorage.setItem(
      "personal-expenses-budgets",
      JSON.stringify(FAKE_BUDGETS)
    );
    console.log(
      "✅ Budgets de démonstration initialisés:",
      FAKE_BUDGETS.length
    );
  }
};

// Fonction pour forcer le rechargement des données de démonstration
export const forceLoadFakeData = () => {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    "personal-expenses-transactions",
    JSON.stringify(FAKE_TRANSACTIONS)
  );
  localStorage.setItem(
    "personal-expenses-budgets",
    JSON.stringify(FAKE_BUDGETS)
  );

  console.log("🔄 Données de démonstration rechargées:", {
    transactions: FAKE_TRANSACTIONS.length,
    budgets: FAKE_BUDGETS.length,
  });
};

// Fonction pour vider toutes les données
export const clearAllData = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("personal-expenses-transactions");
  localStorage.removeItem("personal-expenses-budgets");

  console.log("🗑️ Toutes les données ont été supprimées");
};
