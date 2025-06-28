export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: number;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  period: 'monthly' | 'weekly';
  alertThreshold: number; // Percentage (e.g., 80 for 80%)
}

export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income';
  color: string;
  icon: string;
}

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: '1', name: 'Alimentation', type: 'expense', color: '#ef4444', icon: 'UtensilsCrossed' },
  { id: '2', name: 'Transport', type: 'expense', color: '#f97316', icon: 'Car' },
  { id: '3', name: 'Logement', type: 'expense', color: '#eab308', icon: 'Home' },
  { id: '4', name: 'Santé', type: 'expense', color: '#84cc16', icon: 'Heart' },
  { id: '5', name: 'Loisirs', type: 'expense', color: '#06b6d4', icon: 'Gamepad2' },
  { id: '6', name: 'Shopping', type: 'expense', color: '#8b5cf6', icon: 'ShoppingBag' },
  { id: '7', name: 'Éducation', type: 'expense', color: '#ec4899', icon: 'GraduationCap' },
  { id: '8', name: 'Autres', type: 'expense', color: '#6b7280', icon: 'MoreHorizontal' },
];

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: '1', name: 'Salaire', type: 'income', color: '#10b981', icon: 'Briefcase' },
  { id: '2', name: 'Freelance', type: 'income', color: '#059669', icon: 'Laptop' },
  { id: '3', name: 'Investissements', type: 'income', color: '#047857', icon: 'TrendingUp' },
  { id: '4', name: 'Autres', type: 'income', color: '#065f46', icon: 'Plus' },
];