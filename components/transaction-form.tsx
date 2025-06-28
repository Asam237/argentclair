"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Transaction,
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
} from "@/lib/types";
import { storage } from "@/lib/storage";
import {
  Plus,
  Wallet,
  TrendingDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface TransactionFormProps {
  onTransactionAdded: () => void;
}

export function TransactionForm({ onTransactionAdded }: TransactionFormProps) {
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const categories =
    type === "expense" ? DEFAULT_EXPENSE_CATEGORIES : DEFAULT_INCOME_CATEGORIES;

  const resetForm = () => {
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setSubmitStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!amount || !category || !description.trim()) {
      setSubmitStatus("error");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const transaction: Transaction = {
        id: crypto.randomUUID(),
        type,
        amount: numericAmount,
        category,
        description: description.trim(),
        date,
        createdAt: Date.now(),
      };

      console.log("📝 Tentative d'ajout de transaction:", transaction);

      // Sauvegarder dans localStorage
      const success = storage.addTransaction(transaction);

      if (success) {
        console.log("✅ Transaction sauvegardée avec succès");
        setSubmitStatus("success");

        // Reset form après un délai
        setTimeout(() => {
          resetForm();
        }, 1500);

        // Notifier le parent
        onTransactionAdded();
      } else {
        console.error("❌ Échec de la sauvegarde");
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubmitButtonText = () => {
    if (isSubmitting) return "Sauvegarde...";
    if (submitStatus === "success") return "Ajouté avec succès !";
    return `Ajouter ${type === "expense" ? "la dépense" : "le revenu"}`;
  };

  const getSubmitButtonVariant = () => {
    if (submitStatus === "success") return "default";
    if (submitStatus === "error") return "destructive";
    return "default";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nouvelle Transaction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={type}
          onValueChange={(value) => {
            setType(value as "expense" | "income");
            setCategory("");
            setSubmitStatus("idle");
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expense" className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Dépense
            </TabsTrigger>
            <TabsTrigger value="income" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Revenu
            </TabsTrigger>
          </TabsList>

          {submitStatus === "success" && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Transaction ajoutée avec succès ! Les données ont été
                sauvegardées localement.
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === "error" && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Erreur lors de l&apos;ajout. Vérifiez que tous les champs sont
                correctement remplis.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Montant (FCFA) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="1"
                  min="0"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setSubmitStatus("idle");
                  }}
                  placeholder="0"
                  required
                  className={
                    submitStatus === "error" && !amount ? "border-red-300" : ""
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setSubmitStatus("idle");
                  }}
                  required
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select
                value={category}
                onValueChange={(value) => {
                  setCategory(value);
                  setSubmitStatus("idle");
                }}
                required
              >
                <SelectTrigger
                  className={
                    submitStatus === "error" && !category
                      ? "border-red-300"
                      : ""
                  }
                >
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
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
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setSubmitStatus("idle");
                }}
                placeholder="Description de la transaction..."
                required
                className={
                  submitStatus === "error" && !description.trim()
                    ? "border-red-300"
                    : ""
                }
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || submitStatus === "success"}
              variant={getSubmitButtonVariant()}
            >
              {submitStatus === "success" && (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              {getSubmitButtonText()}
            </Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
