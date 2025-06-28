"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Budget, Transaction, DEFAULT_EXPENSE_CATEGORIES } from "@/lib/types";
import { storage } from "@/lib/storage";
import { Target, AlertTriangle, Plus, Trash2 } from "lucide-react";

interface BudgetManagerProps {
  refresh: number;
}

export function BudgetManager({ refresh }: BudgetManagerProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: "",
    limit: "",
    period: "monthly" as "monthly" | "weekly",
    alertThreshold: "80",
  });

  useEffect(() => {
    setBudgets(storage.getBudgets());
    setTransactions(storage.getTransactions());
  }, [refresh]);

  const handleAddBudget = () => {
    if (!newBudget.category || !newBudget.limit) return;

    const budget: Budget = {
      id: crypto.randomUUID(),
      category: newBudget.category,
      limit: parseFloat(newBudget.limit),
      period: newBudget.period,
      alertThreshold: parseFloat(newBudget.alertThreshold),
    };

    storage.addBudget(budget);
    setBudgets(storage.getBudgets());
    setNewBudget({
      category: "",
      limit: "",
      period: "monthly",
      alertThreshold: "80",
    });
    setShowForm(false);
  };

  const handleDeleteBudget = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce budget ?")) {
      storage.deleteBudget(id);
      setBudgets(storage.getBudgets());
    }
  };

  const calculateBudgetUsage = (budget: Budget) => {
    const now = new Date();
    let startDate: Date;

    if (budget.period === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      const weekStart = now.getDate() - now.getDay();
      startDate = new Date(now.getFullYear(), now.getMonth(), weekStart);
    }

    const spent = transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category === budget.category &&
          new Date(t.date) >= startDate &&
          new Date(t.date) <= now
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const percentage = (spent / budget.limit) * 100;
    const isOverBudget = spent > budget.limit;
    const isNearLimit = percentage >= budget.alertThreshold;

    return { spent, percentage, isOverBudget, isNearLimit };
  };

  const getBudgetColor = (percentage: number, isOverBudget: boolean) => {
    if (isOverBudget || percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-orange-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const availableCategories = DEFAULT_EXPENSE_CATEGORIES.filter(
    (cat) => !budgets.some((budget) => budget.category === cat.name)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Gestion des Budgets
          </CardTitle>
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Budget
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select
                    value={newBudget.category}
                    onValueChange={(value) =>
                      setNewBudget((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Limite (FCFA)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newBudget.limit}
                    onChange={(e) =>
                      setNewBudget((prev) => ({
                        ...prev,
                        limit: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Période</Label>
                  <Select
                    value={newBudget.period}
                    onValueChange={(value: "monthly" | "weekly") =>
                      setNewBudget((prev) => ({ ...prev, period: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Seuil d&apos;alerte (%)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={newBudget.alertThreshold}
                    onChange={(e) =>
                      setNewBudget((prev) => ({
                        ...prev,
                        alertThreshold: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleAddBudget}
                  disabled={!newBudget.category || !newBudget.limit}
                >
                  Créer le Budget
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {budgets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun budget configuré</p>
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const usage = calculateBudgetUsage(budget);
              const category = DEFAULT_EXPENSE_CATEGORIES.find(
                (c) => c.name === budget.category
              );

              return (
                <div key={budget.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: category?.color || "#6b7280",
                        }}
                      />
                      <div>
                        <h4 className="font-medium">{budget.category}</h4>
                        <p className="text-sm text-muted-foreground">
                          {budget.period === "monthly"
                            ? "Mensuel"
                            : "Hebdomadaire"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-medium">
                          {usage.spent.toFixed(2)} FCFA /{" "}
                          {budget.limit.toFixed(2)} FCFA
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {usage.percentage.toFixed(1)}% utilisé
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBudget(budget.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Progress
                    value={Math.min(usage.percentage, 100)}
                    className={`h-2 ${getBudgetColor(
                      usage.percentage,
                      usage.isOverBudget
                    )}`}
                  />

                  {usage.isOverBudget && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        Budget dépassé ! Vous avez dépensé{" "}
                        {(usage.spent - budget.limit).toFixed(2)} FCFA de plus
                        que prévu.
                      </AlertDescription>
                    </Alert>
                  )}

                  {usage.isNearLimit && !usage.isOverBudget && (
                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800">
                        Attention ! Vous approchez de votre limite de budget (
                        {usage.percentage.toFixed(1)}% utilisé).
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
