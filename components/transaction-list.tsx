"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Transaction,
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
} from "@/lib/types";
import { storage } from "@/lib/storage";
import { exportToCSV } from "@/lib/export";
import { formatCurrency } from "@/lib/utils";
import { Trash2, Download, Calendar, DollarSign } from "lucide-react";

interface TransactionListProps {
  refresh: number;
}

export function TransactionList({ refresh }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"all" | "expense" | "income">("all");

  const allCategories = [
    ...DEFAULT_EXPENSE_CATEGORIES,
    ...DEFAULT_INCOME_CATEGORIES,
  ];

  useEffect(() => {
    setTransactions(storage.getTransactions());
  }, [refresh]);

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette transaction ?")) {
      storage.deleteTransaction(id);
      setTransactions(storage.getTransactions());
    }
  };

  const handleExport = () => {
    const filteredTransactions =
      filter === "all"
        ? transactions
        : transactions.filter((t) => t.type === filter);
    exportToCSV(filteredTransactions);
  };

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  const getCategoryColor = (
    categoryName: string,
    type: "expense" | "income"
  ) => {
    const category = allCategories.find(
      (c) => c.name === categoryName && c.type === type
    );
    return category?.color || "#6b7280";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Historique des Transactions
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Toutes
            </Button>
            <Button
              variant={filter === "expense" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("expense")}
            >
              Dépenses
            </Button>
            <Button
              variant={filter === "income" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("income")}
            >
              Revenus
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune transaction trouvée</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: getCategoryColor(
                          transaction.category,
                          transaction.type
                        ),
                      }}
                    />
                    <Badge
                      variant={
                        transaction.type === "expense"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {transaction.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <p className="font-medium">{transaction.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold text-lg ${
                      transaction.type === "expense"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {transaction.type === "expense" ? "-" : "+"}
                    {formatCurrency(transaction.amount)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(transaction.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
