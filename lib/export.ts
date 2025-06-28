import { Transaction } from "./types";

export const exportToCSV = (transactions: Transaction[], filename?: string) => {
  if (transactions.length === 0) {
    alert("Aucune transaction à exporter");
    return;
  }

  const headers = [
    "Date",
    "Type",
    "Catégorie",
    "Description",
    "Montant (FCFA)",
  ];

  const csvContent = [
    headers.join(","),
    ...transactions.map((transaction) =>
      [
        new Date(transaction.date).toLocaleDateString("fr-FR"),
        transaction.type === "expense" ? "Dépense" : "Revenu",
        transaction.category,
        `"${transaction.description.replace(/"/g, '""')}"`,
        transaction.type === "expense"
          ? `-${transaction.amount}`
          : transaction.amount,
      ].join(",")
    ),
  ].join("\n");

  // Ajouter le BOM UTF-8 pour assurer un encodage correct
  const BOM = "\uFEFF";
  const csvWithBOM = BOM + csvContent;

  const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      filename || `transactions-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const calculateStats = (transactions: Transaction[]) => {
  console.log(
    "🔢 calculateStats - Début du calcul avec",
    transactions.length,
    "transactions"
  );

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  console.log(
    "📅 calculateStats - Mois/Année actuels:",
    currentMonth + 1,
    "/",
    currentYear
  );

  const currentMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    const isCurrentMonth =
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear;

    if (isCurrentMonth) {
      console.log("✅ Transaction du mois actuel:", {
        date: t.date,
        type: t.type,
        amount: t.amount,
        category: t.category,
      });
    }

    return isCurrentMonth;
  });

  console.log(
    "📊 calculateStats - Transactions du mois actuel:",
    currentMonthTransactions.length
  );

  const totalExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => {
      console.log("💸 Dépense:", t.amount, t.category);
      return sum + t.amount;
    }, 0);

  const totalIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => {
      console.log("💰 Revenu:", t.amount, t.category);
      return sum + t.amount;
    }, 0);

  const balance = totalIncome - totalExpenses;

  const expensesByCategory = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const result = {
    totalExpenses,
    totalIncome,
    balance,
    expensesByCategory,
    transactionCount: currentMonthTransactions.length,
  };

  console.log("📈 calculateStats - Résultat final:", result);

  return result;
};
