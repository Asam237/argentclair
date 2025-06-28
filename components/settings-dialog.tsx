"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, AlertTriangle, RefreshCw, Database } from "lucide-react";

interface SettingsDialogProps {
  onDataCleared: () => void;
}

export function SettingsDialog({ onDataCleared }: SettingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleClearData = async () => {
    setIsClearing(true);

    try {
      // Vider le localStorage
      localStorage.removeItem("personal-expenses-transactions");
      localStorage.removeItem("personal-expenses-budgets");

      // Attendre un peu pour l'effet visuel
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Notifier le parent que les données ont été supprimées
      onDataCleared();

      // Fermer le dialog
      setIsOpen(false);

      // Recharger la page pour réinitialiser l'état
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la suppression des données:", error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          Paramètres
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Gestion des Données
          </DialogTitle>
          <DialogDescription>
            Gérez vos données stockées localement dans l&apos;application.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Attention :</strong> Cette action supprimera
              définitivement toutes vos transactions et budgets. Cette action
              est irréversible.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium">Actions disponibles :</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Suppression de toutes les transactions</li>
              <li>• Suppression de tous les budgets</li>
              <li>• Réinitialisation complète de l&apos;application</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isClearing}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleClearData}
            disabled={isClearing}
            className="flex items-center gap-2"
          >
            {isClearing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Vider toutes les données
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
