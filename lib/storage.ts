import { Transaction, Budget } from "./types";

const TRANSACTIONS_KEY = "personal-expenses-transactions";
const BUDGETS_KEY = "personal-expenses-budgets";

// Fonction utilitaire pour vérifier si localStorage est disponible
const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === "undefined") return false;
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Fonction pour sauvegarder avec gestion d'erreur
const safeSetItem = (key: string, value: string): boolean => {
  try {
    if (!isLocalStorageAvailable()) {
      console.warn("⚠️ localStorage non disponible");
      return false;
    }
    localStorage.setItem(key, value);
    console.log(`✅ Données sauvegardées: ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur sauvegarde ${key}:`, error);
    return false;
  }
};

// Fonction pour charger avec gestion d'erreur
const safeGetItem = (key: string): string | null => {
  try {
    if (!isLocalStorageAvailable()) {
      console.warn("⚠️ localStorage non disponible");
      return null;
    }
    const data = localStorage.getItem(key);
    if (data) {
      console.log(`📖 Données chargées: ${key}`);
    }
    return data;
  } catch (error) {
    console.error(`❌ Erreur chargement ${key}:`, error);
    return null;
  }
};

export const storage = {
  // Transactions
  getTransactions: (): Transaction[] => {
    const data = safeGetItem(TRANSACTIONS_KEY);
    if (!data) return [];

    try {
      const transactions = JSON.parse(data);
      console.log(
        `📊 ${transactions.length} transactions chargées depuis localStorage`
      );
      return transactions;
    } catch (error) {
      console.error("❌ Erreur parsing transactions:", error);
      return [];
    }
  },

  saveTransactions: (transactions: Transaction[]): boolean => {
    try {
      const success = safeSetItem(
        TRANSACTIONS_KEY,
        JSON.stringify(transactions)
      );
      if (success) {
        console.log(`💾 ${transactions.length} transactions sauvegardées`);
      }
      return success;
    } catch (error) {
      console.error("❌ Erreur sauvegarde transactions:", error);
      return false;
    }
  },

  addTransaction: (transaction: Transaction): boolean => {
    try {
      const transactions = storage.getTransactions();
      transactions.unshift(transaction); // Ajouter au début
      const success = storage.saveTransactions(transactions);

      if (success) {
        console.log("➕ Transaction ajoutée:", {
          id: transaction.id,
          type: transaction.type,
          amount: transaction.amount,
          category: transaction.category,
        });
      }

      return success;
    } catch (error) {
      console.error("❌ Erreur ajout transaction:", error);
      return false;
    }
  },

  updateTransaction: (
    id: string,
    updatedTransaction: Partial<Transaction>
  ): boolean => {
    try {
      const transactions = storage.getTransactions();
      const index = transactions.findIndex((t) => t.id === id);

      if (index === -1) {
        console.warn(`⚠️ Transaction non trouvée: ${id}`);
        return false;
      }

      transactions[index] = { ...transactions[index], ...updatedTransaction };
      const success = storage.saveTransactions(transactions);

      if (success) {
        console.log(`✏️ Transaction mise à jour: ${id}`);
      }

      return success;
    } catch (error) {
      console.error("❌ Erreur mise à jour transaction:", error);
      return false;
    }
  },

  deleteTransaction: (id: string): boolean => {
    try {
      const transactions = storage.getTransactions();
      const initialLength = transactions.length;
      const filteredTransactions = transactions.filter((t) => t.id !== id);

      if (filteredTransactions.length === initialLength) {
        console.warn(`⚠️ Transaction non trouvée pour suppression: ${id}`);
        return false;
      }

      const success = storage.saveTransactions(filteredTransactions);

      if (success) {
        console.log(`🗑️ Transaction supprimée: ${id}`);
      }

      return success;
    } catch (error) {
      console.error("❌ Erreur suppression transaction:", error);
      return false;
    }
  },

  // Budgets
  getBudgets: (): Budget[] => {
    const data = safeGetItem(BUDGETS_KEY);
    if (!data) return [];

    try {
      const budgets = JSON.parse(data);
      console.log(`🎯 ${budgets.length} budgets chargés depuis localStorage`);
      return budgets;
    } catch (error) {
      console.error("❌ Erreur parsing budgets:", error);
      return [];
    }
  },

  saveBudgets: (budgets: Budget[]): boolean => {
    try {
      const success = safeSetItem(BUDGETS_KEY, JSON.stringify(budgets));
      if (success) {
        console.log(`💾 ${budgets.length} budgets sauvegardés`);
      }
      return success;
    } catch (error) {
      console.error("❌ Erreur sauvegarde budgets:", error);
      return false;
    }
  },

  addBudget: (budget: Budget): boolean => {
    try {
      const budgets = storage.getBudgets();

      // Vérifier si un budget existe déjà pour cette catégorie
      const existingIndex = budgets.findIndex(
        (b) => b.category === budget.category
      );
      if (existingIndex !== -1) {
        console.warn(`⚠️ Budget déjà existant pour: ${budget.category}`);
        return false;
      }

      budgets.push(budget);
      const success = storage.saveBudgets(budgets);

      if (success) {
        console.log("➕ Budget ajouté:", {
          id: budget.id,
          category: budget.category,
          limit: budget.limit,
          period: budget.period,
        });
      }

      return success;
    } catch (error) {
      console.error("❌ Erreur ajout budget:", error);
      return false;
    }
  },

  updateBudget: (id: string, updatedBudget: Partial<Budget>): boolean => {
    try {
      const budgets = storage.getBudgets();
      const index = budgets.findIndex((b) => b.id === id);

      if (index === -1) {
        console.warn(`⚠️ Budget non trouvé: ${id}`);
        return false;
      }

      budgets[index] = { ...budgets[index], ...updatedBudget };
      const success = storage.saveBudgets(budgets);

      if (success) {
        console.log(`✏️ Budget mis à jour: ${id}`);
      }

      return success;
    } catch (error) {
      console.error("❌ Erreur mise à jour budget:", error);
      return false;
    }
  },

  deleteBudget: (id: string): boolean => {
    try {
      const budgets = storage.getBudgets();
      const initialLength = budgets.length;
      const filteredBudgets = budgets.filter((b) => b.id !== id);

      if (filteredBudgets.length === initialLength) {
        console.warn(`⚠️ Budget non trouvé pour suppression: ${id}`);
        return false;
      }

      const success = storage.saveBudgets(filteredBudgets);

      if (success) {
        console.log(`🗑️ Budget supprimé: ${id}`);
      }

      return success;
    } catch (error) {
      console.error("❌ Erreur suppression budget:", error);
      return false;
    }
  },

  // Utilitaires de diagnostic
  getStorageInfo: () => {
    if (!isLocalStorageAvailable()) {
      return {
        available: false,
        transactions: 0,
        budgets: 0,
        totalSize: 0,
      };
    }

    const transactions = storage.getTransactions();
    const budgets = storage.getBudgets();

    // Calculer la taille approximative en bytes
    const transactionsSize = JSON.stringify(transactions).length;
    const budgetsSize = JSON.stringify(budgets).length;
    const totalSize = transactionsSize + budgetsSize;

    return {
      available: true,
      transactions: transactions.length,
      budgets: budgets.length,
      totalSize,
      transactionsSize,
      budgetsSize,
    };
  },

  clearAllData: (): boolean => {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn("⚠️ localStorage non disponible pour suppression");
        return false;
      }

      localStorage.removeItem(TRANSACTIONS_KEY);
      localStorage.removeItem(BUDGETS_KEY);

      console.log("🗑️ Toutes les données supprimées du localStorage");
      return true;
    } catch (error) {
      console.error("❌ Erreur suppression données:", error);
      return false;
    }
  },
};

// Fonction pour diagnostiquer le stockage
export const diagnoseStorage = () => {
  console.log("🔍 DIAGNOSTIC LOCALSTORAGE");
  console.log("========================");

  const info = storage.getStorageInfo();
  console.log("📊 Informations:", info);

  if (info.available) {
    console.log(`📦 Transactions: ${info.transactions}`);
    console.log(`🎯 Budgets: ${info.budgets}`);
    console.log(`💾 Taille totale: ${info.totalSize} bytes`);

    // Test d'écriture
    const testKey = "__test_write__";
    const testValue = "test";

    try {
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      if (retrieved === testValue) {
        console.log("✅ Test écriture/lecture: OK");
      } else {
        console.log("❌ Test écriture/lecture: ÉCHEC");
      }
    } catch (error) {
      console.log("❌ Test écriture/lecture: ERREUR", error);
    }
  } else {
    console.log("❌ localStorage non disponible");
  }

  console.log("========================");
};
