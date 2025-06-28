import { Transaction, Budget } from './types';

const TRANSACTIONS_KEY = 'personal-expenses-transactions';
const BUDGETS_KEY = 'personal-expenses-budgets';

export const storage = {
  // Transactions
  getTransactions: (): Transaction[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveTransactions: (transactions: Transaction[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  },

  addTransaction: (transaction: Transaction): void => {
    const transactions = storage.getTransactions();
    transactions.unshift(transaction);
    storage.saveTransactions(transactions);
  },

  updateTransaction: (id: string, updatedTransaction: Partial<Transaction>): void => {
    const transactions = storage.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updatedTransaction };
      storage.saveTransactions(transactions);
    }
  },

  deleteTransaction: (id: string): void => {
    const transactions = storage.getTransactions().filter(t => t.id !== id);
    storage.saveTransactions(transactions);
  },

  // Budgets
  getBudgets: (): Budget[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(BUDGETS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveBudgets: (budgets: Budget[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  },

  addBudget: (budget: Budget): void => {
    const budgets = storage.getBudgets();
    budgets.push(budget);
    storage.saveBudgets(budgets);
  },

  updateBudget: (id: string, updatedBudget: Partial<Budget>): void => {
    const budgets = storage.getBudgets();
    const index = budgets.findIndex(b => b.id === id);
    if (index !== -1) {
      budgets[index] = { ...budgets[index], ...updatedBudget };
      storage.saveBudgets(budgets);
    }
  },

  deleteBudget: (id: string): void => {
    const budgets = storage.getBudgets().filter(b => b.id !== id);
    storage.saveBudgets(budgets);
  },
};