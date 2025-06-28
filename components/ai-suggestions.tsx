"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BudgetSuggestion,
  FinancialInsight,
  SpendingPattern,
  generateAISuggestions,
  generateFinancialInsights,
  analyzeSpendingPatterns,
} from "@/lib/ai-suggestions";
import { Transaction, Budget } from "@/lib/types";
import { storage } from "@/lib/storage";
import { formatCurrency } from "@/lib/utils";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  PieChart,
  BarChart3,
  Sparkles,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";

interface AISuggestionsProps {
  refresh: number;
}

export function AISuggestions({ refresh }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<BudgetSuggestion[]>([]);
  const [insights, setInsights] = useState<FinancialInsight | null>(null);
  const [patterns, setPatterns] = useState<SpendingPattern[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("suggestions");

  useEffect(() => {
    const loadAIData = async () => {
      setIsLoading(true);

      try {
        const transactions = storage.getTransactions();
        const budgets = storage.getBudgets();

        console.log("🤖 IA - Chargement des données:", {
          transactions: transactions.length,
          budgets: budgets.length,
        });

        // Générer les suggestions IA
        const aiSuggestions = generateAISuggestions(transactions, budgets);
        const financialInsights = generateFinancialInsights(
          transactions,
          budgets
        );
        const spendingPatterns = analyzeSpendingPatterns(transactions, budgets);

        setSuggestions(aiSuggestions);
        setInsights(financialInsights);
        setPatterns(spendingPatterns);

        console.log("🧠 IA - Suggestions générées:", aiSuggestions.length);
        console.log("📊 IA - Insights générés:", financialInsights);
      } catch (error) {
        console.error(
          "❌ Erreur lors de la génération des suggestions IA:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadAIData();
  }, [refresh]);

  const handleApplySuggestion = (suggestion: BudgetSuggestion) => {
    if (!suggestion.actionable) return;

    if (suggestion.type === "new_budget" && suggestion.suggestedAmount) {
      const newBudget: Budget = {
        id: crypto.randomUUID(),
        category: suggestion.category,
        limit: suggestion.suggestedAmount,
        period: "monthly",
        alertThreshold: 80,
      };

      storage.addBudget(newBudget);

      // Retirer la suggestion de la liste
      setSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));
    }

    if (
      (suggestion.type === "budget_increase" ||
        suggestion.type === "budget_decrease") &&
      suggestion.suggestedAmount
    ) {
      const budgets = storage.getBudgets();
      const budgetToUpdate = budgets.find(
        (b) => b.category === suggestion.category
      );

      if (budgetToUpdate) {
        storage.updateBudget(budgetToUpdate.id, {
          limit: suggestion.suggestedAmount,
        });
        setSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));
      }
    }
  };

  const getSuggestionIcon = (type: BudgetSuggestion["type"]) => {
    switch (type) {
      case "new_budget":
        return <Target className="h-4 w-4" />;
      case "budget_increase":
        return <TrendingUp className="h-4 w-4" />;
      case "budget_decrease":
        return <TrendingDown className="h-4 w-4" />;
      case "spending_alert":
        return <AlertTriangle className="h-4 w-4" />;
      case "savings_opportunity":
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getSuggestionColor = (type: BudgetSuggestion["type"]) => {
    switch (type) {
      case "new_budget":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "budget_increase":
        return "bg-orange-50 border-orange-200 text-orange-800";
      case "budget_decrease":
        return "bg-green-50 border-green-200 text-green-800";
      case "spending_alert":
        return "bg-red-50 border-red-200 text-red-800";
      case "savings_opportunity":
        return "bg-purple-50 border-purple-200 text-purple-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getPriorityColor = (priority: BudgetSuggestion["priority"]) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
    }
  };

  const getRiskLevelColor = (risk: FinancialInsight["riskLevel"]) => {
    switch (risk) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-orange-600 bg-orange-50";
      case "low":
        return "text-green-600 bg-green-50";
    }
  };

  const getTrendIcon = (trend: SpendingPattern["trend"]) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case "stable":
        return <BarChart3 className="h-4 w-4 text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Assistant IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                Analyse de vos données financières...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Assistant IA - Suggestions Budgétaires
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="suggestions"
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="patterns" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Patterns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="space-y-4 mt-6">
            {suggestions.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="font-medium text-lg mb-2">
                  Excellente gestion !
                </h3>
                <p className="text-muted-foreground">
                  Aucune suggestion d&apos;amélioration pour le moment. Vos
                  finances semblent bien équilibrées.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <Alert
                    key={suggestion.id}
                    className={getSuggestionColor(suggestion.type)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getSuggestionIcon(suggestion.type)}
                          <h4 className="font-medium">{suggestion.title}</h4>
                          <Badge
                            variant={getPriorityColor(suggestion.priority)}
                          >
                            {suggestion.priority === "high"
                              ? "Urgent"
                              : suggestion.priority === "medium"
                              ? "Important"
                              : "Optionnel"}
                          </Badge>
                          <Badge variant="outline">
                            {suggestion.confidence}% confiance
                          </Badge>
                        </div>
                        <AlertDescription className="mb-3">
                          {suggestion.description}
                        </AlertDescription>
                        <p className="text-sm opacity-75 mb-3">
                          <strong>Raisonnement :</strong> {suggestion.reasoning}
                        </p>
                        {suggestion.suggestedAmount && (
                          <div className="flex items-center gap-4 text-sm">
                            {suggestion.currentAmount && (
                              <span>
                                Actuel:{" "}
                                {formatCurrency(suggestion.currentAmount)}
                              </span>
                            )}
                            <span className="font-medium">
                              Suggéré:{" "}
                              {formatCurrency(suggestion.suggestedAmount)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        {suggestion.actionable ? (
                          <Button
                            size="sm"
                            onClick={() => handleApplySuggestion(suggestion)}
                            className="whitespace-nowrap"
                          >
                            Appliquer
                          </Button>
                        ) : (
                          <Badge variant="outline">
                            <Info className="h-3 w-3 mr-1" />
                            Info
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-4 mt-6">
            {insights && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Santé Financière</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Niveau de risque</span>
                      <Badge className={getRiskLevelColor(insights.riskLevel)}>
                        {insights.riskLevel === "high"
                          ? "Élevé"
                          : insights.riskLevel === "medium"
                          ? "Modéré"
                          : "Faible"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Taux d&apos;épargne</span>
                        <span
                          className={
                            insights.savingsRate >= 20
                              ? "text-green-600"
                              : insights.savingsRate >= 10
                              ? "text-orange-600"
                              : "text-red-600"
                          }
                        >
                          {insights.savingsRate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min(insights.savingsRate, 100)}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Utilisation budgets</span>
                        <span>{insights.budgetUtilization.toFixed(1)}%</span>
                      </div>
                      <Progress
                        value={insights.budgetUtilization}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Top Catégories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {insights.topCategories
                        .slice(0, 5)
                        .map((category, index) => (
                          <div
                            key={category.category}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                #{index + 1}
                              </span>
                              <span className="text-sm">
                                {category.category}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                {formatCurrency(category.amount)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {category.percentage.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      Tendance Générale
                      {insights.spendingTrend === "increasing" ? (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      ) : insights.spendingTrend === "decreasing" ? (
                        <TrendingDown className="h-4 w-4 text-green-500" />
                      ) : (
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Vos dépenses sont actuellement en{" "}
                      <span
                        className={
                          insights.spendingTrend === "increasing"
                            ? "text-red-600 font-medium"
                            : insights.spendingTrend === "decreasing"
                            ? "text-green-600 font-medium"
                            : "text-blue-600 font-medium"
                        }
                      >
                        {insights.spendingTrend === "increasing"
                          ? "hausse"
                          : insights.spendingTrend === "decreasing"
                          ? "baisse"
                          : "stabilité"}
                      </span>{" "}
                      par rapport aux mois précédents.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patterns.map((pattern) => (
                <Card key={pattern.category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      {pattern.category}
                      {getTrendIcon(pattern.trend)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Moyenne mensuelle</span>
                      <span className="font-medium">
                        {formatCurrency(pattern.averageMonthly)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Tendance</span>
                      <Badge variant="outline">
                        {pattern.trend === "increasing"
                          ? "En hausse"
                          : pattern.trend === "decreasing"
                          ? "En baisse"
                          : "Stable"}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Volatilité</span>
                        <span
                          className={
                            pattern.volatility > 50
                              ? "text-red-600"
                              : pattern.volatility > 25
                              ? "text-orange-600"
                              : "text-green-600"
                          }
                        >
                          {pattern.volatility.toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min(pattern.volatility, 100)}
                        className="h-2"
                      />
                    </div>

                    {pattern.seasonality && (
                      <Badge
                        variant="outline"
                        className="w-full justify-center"
                      >
                        Pattern saisonnier détecté
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
