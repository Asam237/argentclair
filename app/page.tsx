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
import { storage, diagnoseStorage } from "@/lib/storage";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialiser les données de démonstration au chargement
  useEffect(() => {
    console.log("🚀 Initialisation de l'application...");

    // Diagnostic du localStorage
    diagnoseStorage();

    // Vérifier si des données existent déjà
    const existingTransactions = storage.getTransactions();
    const existingBudgets = storage.getBudgets();

    console.log(
      `📊 Données existantes: ${existingTransactions.length} transactions, ${existingBudgets.length} budgets`
    );

    // Si aucune donnée n'existe, charger les données de démonstration
    if (existingTransactions.length === 0) {
      console.log("📥 Chargement des données de démonstration...");
      forceLoadFakeData();
      console.log("✅ Données de démonstration chargées");
    } else {
      console.log("📋 Utilisation des données existantes");
    }

    // Marquer comme initialisé
    setIsInitialized(true);

    // Déclencher un refresh pour mettre à jour tous les composants
    setRefreshKey((prev) => prev + 1);

    console.log("🎉 Initialisation terminée");
  }, []);

  const handleTransactionAdded = () => {
    console.log("➕ Nouvelle transaction ajoutée, refresh des composants...");
    setRefreshKey((prev) => prev + 1);

    // Diagnostic après ajout
    const info = storage.getStorageInfo();
    console.log("📊 État après ajout:", info);
  };

  const handleDataCleared = () => {
    console.log("🗑️ Données supprimées, refresh des composants...");
    setRefreshKey((prev) => prev + 1);

    // Diagnostic après suppression
    const info = storage.getStorageInfo();
    console.log("📊 État après suppression:", info);
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

  // Afficher un loader pendant l'initialisation
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Initialisation de l&apos;application...
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Chargement des données depuis le localStorage
          </p>
        </div>
      </div>
    );
  }

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
