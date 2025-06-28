"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/lib/types";
import { storage } from "@/lib/storage";
import { calculateStats } from "@/lib/export";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from "lucide-react";

interface DashboardStatsProps {
  refresh: number;
}

export function DashboardStats({ refresh }: DashboardStatsProps) {
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalIncome: 0,
    balance: 0,
    transactionCount: 0,
  });

  useEffect(() => {
    const loadStats = () => {
      try {
        const transactions = storage.getTransactions();
        console.log(
          "📊 Dashboard - Transactions chargées:",
          transactions.length
        );

        if (transactions.length > 0) {
          console.log("📊 Dashboard - Première transaction:", transactions[0]);
          console.log(
            "📊 Dashboard - Dernière transaction:",
            transactions[transactions.length - 1]
          );
        }

        const calculatedStats = calculateStats(transactions);
        console.log("📈 Dashboard - Stats calculées:", calculatedStats);

        setStats(calculatedStats);
      } catch (error) {
        console.error("❌ Dashboard - Erreur lors du calcul des stats:", error);
      }
    };

    loadStats();
  }, [refresh]);

  const isPositiveBalance = stats.balance >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-800">
            Dépenses ce mois
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-900">
            {formatCurrency(stats.totalExpenses)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">
            Revenus ce mois
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">
            {formatCurrency(stats.totalIncome)}
          </div>
        </CardContent>
      </Card>

      <Card
        className={`bg-gradient-to-br ${
          isPositiveBalance
            ? "from-blue-50 to-blue-100 border-blue-200"
            : "from-orange-50 to-orange-100 border-orange-200"
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle
            className={`text-sm font-medium ${
              isPositiveBalance ? "text-blue-800" : "text-orange-800"
            }`}
          >
            Solde
          </CardTitle>
          <Wallet
            className={`h-4 w-4 ${
              isPositiveBalance ? "text-blue-600" : "text-orange-600"
            }`}
          />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              isPositiveBalance ? "text-blue-900" : "text-orange-900"
            }`}
          >
            {formatCurrency(stats.balance)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">
            Transactions
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">
            {stats.transactionCount}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
