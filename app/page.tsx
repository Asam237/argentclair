"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionList } from "@/components/transaction-list";
import { DashboardStats } from "@/components/dashboard-stats";
import { ExpenseCharts } from "@/components/expense-charts";
import { BudgetManager } from "@/components/budget-manager";
import { forceLoadFakeData } from "@/lib/fake-data";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);

  // Initialiser les données de démonstration au chargement
  useEffect(() => {
    console.log("🚀 Initialisation des données...");

    // Forcer le chargement des données de démonstration
    forceLoadFakeData();
    console.log("✅ Données de démonstration chargées");

    // Déclencher un refresh pour mettre à jour tous les composants
    setRefreshKey((prev) => prev + 1);

    console.log("🎉 Initialisation terminée");
  }, []);

  const handleTransactionAdded = () => {
    console.log("➕ Nouvelle transaction ajoutée, refresh...");
    setRefreshKey((prev) => prev + 1);
  };

  const handleDataCleared = () => {
    console.log("🗑️ Données supprimées, refresh...");
    setRefreshKey((prev) => prev + 1);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Tableau de Bord
              </h2>
              <p className="text-lg text-muted-foreground">
                Vue d&apos;ensemble de vos finances personnelles
              </p>
            </div>
            <DashboardStats refresh={refreshKey} />
            <ExpenseCharts refresh={refreshKey} />
          </div>
        );
      case "add":
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Nouvelle Transaction
              </h2>
              <p className="text-lg text-muted-foreground">
                Ajoutez vos dépenses et revenus
              </p>
            </div>
            <TransactionForm onTransactionAdded={handleTransactionAdded} />
          </div>
        );
      case "budget":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Gestion des Budgets
              </h2>
              <p className="text-lg text-muted-foreground">
                Définissez et suivez vos objectifs financiers
              </p>
            </div>
            <BudgetManager refresh={refreshKey} />
          </div>
        );
      case "ai":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                Assistant IA
                <span className="text-2xl">🤖</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Fonctionnalité en cours de développement
              </p>
            </div>
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-semibold mb-2">
                Assistant IA - Bientôt Disponible
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                L&apos;assistant IA pour les suggestions budgétaires
                intelligentes sera disponible dans une prochaine mise à jour.
              </p>
            </div>
          </div>
        );
      case "history":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Historique des Transactions
              </h2>
              <p className="text-lg text-muted-foreground">
                Consultez et gérez toutes vos transactions
              </p>
            </div>
            <TransactionList refresh={refreshKey} />
          </div>
        );
      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Page non trouvée</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onDataCleared={handleDataCleared}
      />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">{renderContent()}</div>
      </main>

      <Footer />
    </div>
  );
}
