import { Transaction, Budget, DEFAULT_EXPENSE_CATEGORIES } from "./types";

export interface BudgetSuggestion {
  id: string;
  type:
    | "budget_increase"
    | "budget_decrease"
    | "new_budget"
    | "spending_alert"
    | "savings_opportunity";
  category: string;
  title: string;
  description: string;
  suggestedAmount?: number;
  currentAmount?: number;
  confidence: number; // 0-100
  priority: "low" | "medium" | "high";
  reasoning: string;
  actionable: boolean;
}

export interface SpendingPattern {
  category: string;
  averageMonthly: number;
  trend: "increasing" | "decreasing" | "stable";
  volatility: number; // 0-100
  seasonality: boolean;
}

export interface FinancialInsight {
  totalSpending: number;
  spendingTrend: "increasing" | "decreasing" | "stable";
  topCategories: { category: string; amount: number; percentage: number }[];
  budgetUtilization: number; // 0-100
  savingsRate: number; // percentage
  riskLevel: "low" | "medium" | "high";
}

export class AIBudgetAdvisor {
  private transactions: Transaction[];
  private budgets: Budget[];

  constructor(transactions: Transaction[], budgets: Budget[]) {
    this.transactions = transactions;
    this.budgets = budgets;
  }

  // Analyser les patterns de dépenses
  analyzeSpendingPatterns(): SpendingPattern[] {
    const patterns: SpendingPattern[] = [];
    const categories = DEFAULT_EXPENSE_CATEGORIES.map((c) => c.name);

    categories.forEach((category) => {
      const categoryTransactions = this.transactions.filter(
        (t) => t.type === "expense" && t.category === category
      );

      if (categoryTransactions.length === 0) return;

      // Calculer la moyenne mensuelle
      const monthlySpending = this.getMonthlySpending(categoryTransactions);
      const averageMonthly =
        monthlySpending.reduce((sum, amount) => sum + amount, 0) /
        monthlySpending.length;

      // Analyser la tendance
      const trend = this.calculateTrend(monthlySpending);

      // Calculer la volatilité
      const volatility = this.calculateVolatility(
        monthlySpending,
        averageMonthly
      );

      // Détecter la saisonnalité
      const seasonality = this.detectSeasonality(monthlySpending);

      patterns.push({
        category,
        averageMonthly,
        trend,
        volatility,
        seasonality,
      });
    });

    return patterns;
  }

  // Générer des insights financiers
  generateFinancialInsights(): FinancialInsight {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Transactions du mois actuel
    const currentMonthTransactions = this.transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });

    const totalSpending = currentMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = currentMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    // Analyser les tendances de dépenses (3 derniers mois)
    const recentMonths = this.getRecentMonthsSpending(3);
    const spendingTrend = this.calculateTrend(recentMonths);

    // Top catégories
    const categorySpending = this.getCategorySpending(currentMonthTransactions);
    const topCategories = Object.entries(categorySpending)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalSpending) * 100,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Utilisation des budgets
    const budgetUtilization = this.calculateBudgetUtilization();

    // Taux d'épargne
    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalSpending) / totalIncome) * 100 : 0;

    // Niveau de risque
    const riskLevel = this.assessRiskLevel(
      savingsRate,
      budgetUtilization,
      spendingTrend
    );

    return {
      totalSpending,
      spendingTrend,
      topCategories,
      budgetUtilization,
      savingsRate,
      riskLevel,
    };
  }

  // Générer des suggestions budgétaires intelligentes
  generateBudgetSuggestions(): BudgetSuggestion[] {
    const suggestions: BudgetSuggestion[] = [];
    const patterns = this.analyzeSpendingPatterns();
    const insights = this.generateFinancialInsights();

    // 1. Suggestions pour nouvelles catégories sans budget
    patterns.forEach((pattern) => {
      const existingBudget = this.budgets.find(
        (b) => b.category === pattern.category
      );

      if (!existingBudget && pattern.averageMonthly > 10000) {
        suggestions.push({
          id: `new-budget-${pattern.category}`,
          type: "new_budget",
          category: pattern.category,
          title: `Créer un budget pour ${pattern.category}`,
          description: `Vous dépensez en moyenne ${this.formatCurrency(
            pattern.averageMonthly
          )} par mois dans cette catégorie.`,
          suggestedAmount: Math.ceil(pattern.averageMonthly * 1.1), // 10% de marge
          confidence: pattern.volatility < 30 ? 85 : 65,
          priority: pattern.averageMonthly > 50000 ? "high" : "medium",
          reasoning: `Basé sur vos dépenses moyennes des derniers mois avec une marge de sécurité de 10%.`,
          actionable: true,
        });
      }
    });

    // 2. Suggestions d'ajustement de budgets existants
    this.budgets.forEach((budget) => {
      const pattern = patterns.find((p) => p.category === budget.category);
      if (!pattern) return;

      const currentUsage = this.getCurrentBudgetUsage(budget);

      // Budget trop serré (dépassement fréquent)
      if (currentUsage.percentage > 100 && pattern.trend === "increasing") {
        suggestions.push({
          id: `increase-budget-${budget.category}`,
          type: "budget_increase",
          category: budget.category,
          title: `Augmenter le budget ${budget.category}`,
          description: `Votre budget actuel est dépassé de ${(
            currentUsage.percentage - 100
          ).toFixed(1)}%.`,
          suggestedAmount: Math.ceil(pattern.averageMonthly * 1.15),
          currentAmount: budget.limit,
          confidence: 80,
          priority: "high",
          reasoning: `Vos dépenses dans cette catégorie sont en hausse et dépassent régulièrement le budget.`,
          actionable: true,
        });
      }

      // Budget trop large (sous-utilisation)
      if (currentUsage.percentage < 60 && pattern.trend === "decreasing") {
        suggestions.push({
          id: `decrease-budget-${budget.category}`,
          type: "budget_decrease",
          category: budget.category,
          title: `Réduire le budget ${budget.category}`,
          description: `Vous n'utilisez que ${currentUsage.percentage.toFixed(
            1
          )}% de ce budget.`,
          suggestedAmount: Math.ceil(pattern.averageMonthly * 1.05),
          currentAmount: budget.limit,
          confidence: 75,
          priority: "medium",
          reasoning: `Vos dépenses dans cette catégorie diminuent et vous pourriez réallouer ces fonds.`,
          actionable: true,
        });
      }
    });

    // 3. Alertes de dépenses inhabituelles
    patterns.forEach((pattern) => {
      if (pattern.volatility > 50) {
        const currentMonthSpending = this.getCurrentMonthSpending(
          pattern.category
        );
        if (currentMonthSpending > pattern.averageMonthly * 1.5) {
          suggestions.push({
            id: `spending-alert-${pattern.category}`,
            type: "spending_alert",
            category: pattern.category,
            title: `Dépenses élevées en ${pattern.category}`,
            description: `Vos dépenses ce mois (${this.formatCurrency(
              currentMonthSpending
            )}) sont 50% plus élevées que la moyenne.`,
            confidence: 90,
            priority: "high",
            reasoning: `Détection d'une anomalie dans vos habitudes de dépenses.`,
            actionable: false,
          });
        }
      }
    });

    // 4. Opportunités d'épargne
    if (insights.savingsRate < 10) {
      const topCategory = insights.topCategories[0];
      if (topCategory && topCategory.percentage > 30) {
        suggestions.push({
          id: `savings-opportunity-${topCategory.category}`,
          type: "savings_opportunity",
          category: topCategory.category,
          title: `Opportunité d'épargne en ${topCategory.category}`,
          description: `Cette catégorie représente ${topCategory.percentage.toFixed(
            1
          )}% de vos dépenses. Réduire de 10% pourrait vous faire économiser ${this.formatCurrency(
            topCategory.amount * 0.1
          )}.`,
          suggestedAmount: Math.ceil(topCategory.amount * 0.9),
          currentAmount: topCategory.amount,
          confidence: 70,
          priority: "medium",
          reasoning: `Votre taux d'épargne est faible (${insights.savingsRate.toFixed(
            1
          )}%). Optimiser vos plus grosses dépenses peut aider.`,
          actionable: true,
        });
      }
    }

    // Trier par priorité et confiance
    return suggestions.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const priorityDiff =
        priorityWeight[b.priority] - priorityWeight[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.confidence - a.confidence;
    });
  }

  // Méthodes utilitaires privées
  private getMonthlySpending(transactions: Transaction[]): number[] {
    const monthlyData: { [key: string]: number } = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + t.amount;
    });

    return Object.values(monthlyData);
  }

  private calculateTrend(
    values: number[]
  ): "increasing" | "decreasing" | "stable" {
    if (values.length < 2) return "stable";

    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const firstAvg =
      firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

    const change = (secondAvg - firstAvg) / firstAvg;

    if (change > 0.1) return "increasing";
    if (change < -0.1) return "decreasing";
    return "stable";
  }

  private calculateVolatility(values: number[], average: number): number {
    if (values.length < 2) return 0;

    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) /
      values.length;
    const standardDeviation = Math.sqrt(variance);

    return average > 0 ? (standardDeviation / average) * 100 : 0;
  }

  private detectSeasonality(values: number[]): boolean {
    // Simplification: détecter si les variations suivent un pattern
    if (values.length < 6) return false;

    const peaks = values.filter((val, i) => {
      const prev = values[i - 1] || 0;
      const next = values[i + 1] || 0;
      return val > prev && val > next;
    });

    return peaks.length >= 2;
  }

  private getRecentMonthsSpending(months: number): number[] {
    const result: number[] = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthSpending = this.transactions
        .filter((t) => {
          const tDate = new Date(t.date);
          return (
            t.type === "expense" &&
            tDate.getMonth() === targetDate.getMonth() &&
            tDate.getFullYear() === targetDate.getFullYear()
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);

      result.push(monthSpending);
    }

    return result;
  }

  private getCategorySpending(transactions: Transaction[]): {
    [category: string]: number;
  } {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as { [category: string]: number });
  }

  private calculateBudgetUtilization(): number {
    if (this.budgets.length === 0) return 0;

    const totalUtilization = this.budgets.reduce((sum, budget) => {
      const usage = this.getCurrentBudgetUsage(budget);
      return sum + Math.min(usage.percentage, 100);
    }, 0);

    return totalUtilization / this.budgets.length;
  }

  private getCurrentBudgetUsage(budget: Budget): {
    spent: number;
    percentage: number;
  } {
    const now = new Date();
    let startDate: Date;

    if (budget.period === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      const weekStart = now.getDate() - now.getDay();
      startDate = new Date(now.getFullYear(), now.getMonth(), weekStart);
    }

    const spent = this.transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category === budget.category &&
          new Date(t.date) >= startDate &&
          new Date(t.date) <= now
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      spent,
      percentage: (spent / budget.limit) * 100,
    };
  }

  private getCurrentMonthSpending(category: string): number {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return this.transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category === category &&
          new Date(t.date) >= startOfMonth &&
          new Date(t.date) <= now
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }

  private assessRiskLevel(
    savingsRate: number,
    budgetUtilization: number,
    spendingTrend: string
  ): "low" | "medium" | "high" {
    let riskScore = 0;

    // Taux d'épargne
    if (savingsRate < 5) riskScore += 3;
    else if (savingsRate < 15) riskScore += 2;
    else if (savingsRate < 25) riskScore += 1;

    // Utilisation des budgets
    if (budgetUtilization > 90) riskScore += 3;
    else if (budgetUtilization > 75) riskScore += 2;
    else if (budgetUtilization > 60) riskScore += 1;

    // Tendance des dépenses
    if (spendingTrend === "increasing") riskScore += 2;
    else if (spendingTrend === "stable") riskScore += 1;

    if (riskScore >= 6) return "high";
    if (riskScore >= 3) return "medium";
    return "low";
  }

  private formatCurrency(amount: number): string {
    return (
      new Intl.NumberFormat("fr-FR", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount) + " FCFA"
    );
  }
}

// Fonction utilitaire pour générer des suggestions
export const generateAISuggestions = (
  transactions: Transaction[],
  budgets: Budget[]
): BudgetSuggestion[] => {
  const advisor = new AIBudgetAdvisor(transactions, budgets);
  return advisor.generateBudgetSuggestions();
};

// Fonction utilitaire pour analyser les patterns
export const analyzeSpendingPatterns = (
  transactions: Transaction[],
  budgets: Budget[]
): SpendingPattern[] => {
  const advisor = new AIBudgetAdvisor(transactions, budgets);
  return advisor.analyzeSpendingPatterns();
};

// Fonction utilitaire pour les insights
export const generateFinancialInsights = (
  transactions: Transaction[],
  budgets: Budget[]
): FinancialInsight => {
  const advisor = new AIBudgetAdvisor(transactions, budgets);
  return advisor.generateFinancialInsights();
};
