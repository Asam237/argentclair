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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { forceLoadFakeData } from "@/lib/fake-data";
import { storage, diagnoseStorage } from "@/lib/storage";
import {
  Trash2,
  AlertTriangle,
  RefreshCw,
  Database,
  Download,
  Info,
  HardDrive,
} from "lucide-react";

interface SettingsDialogProps {
  onDataCleared: () => void;
}

export function SettingsDialog({ onDataCleared }: SettingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storageInfo, setStorageInfo] = useState(storage.getStorageInfo());

  const updateStorageInfo = () => {
    setStorageInfo(storage.getStorageInfo());
  };

  const handleClearData = async () => {
    setIsClearing(true);

    try {
      console.log("🗑️ Début de la suppression des données...");

      // Supprimer toutes les données
      const success = storage.clearAllData();

      if (success) {
        console.log("✅ Données supprimées avec succès");

        // Attendre un peu pour l'effet visuel
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mettre à jour les informations de stockage
        updateStorageInfo();

        // Notifier le parent que les données ont été supprimées
        onDataCleared();

        // Fermer le dialog
        setIsOpen(false);

        // Recharger la page pour réinitialiser l'état
        window.location.reload();
      } else {
        console.error("❌ Échec de la suppression des données");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la suppression des données:", error);
    } finally {
      setIsClearing(false);
    }
  };

  const handleLoadDemoData = async () => {
    setIsLoading(true);

    try {
      console.log("📥 Début du chargement des données de démonstration...");

      // Charger les données de démonstration
      forceLoadFakeData();

      console.log("✅ Données de démonstration chargées");

      // Attendre un peu pour l'effet visuel
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mettre à jour les informations de stockage
      updateStorageInfo();

      // Notifier le parent que les données ont été rechargées
      onDataCleared();

      // Fermer le dialog
      setIsOpen(false);

      // Recharger la page pour afficher les nouvelles données
      window.location.reload();
    } catch (error) {
      console.error(
        "❌ Erreur lors du chargement des données de démonstration:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiagnose = () => {
    diagnoseStorage();
    updateStorageInfo();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          Paramètres
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
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
          {/* Informations de stockage */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                État du Stockage Local
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {storageInfo.available ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span>Transactions:</span>
                    <span className="font-medium">
                      {storageInfo.transactions}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Budgets:</span>
                    <span className="font-medium">{storageInfo.budgets}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taille totale:</span>
                    <span className="font-medium">
                      {formatBytes(storageInfo.totalSize)}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDiagnose}
                    className="w-full mt-2"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Diagnostic Complet
                  </Button>
                </>
              ) : (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    LocalStorage non disponible dans ce navigateur.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Alertes */}
          <Alert className="border-blue-200 bg-blue-50">
            <Download className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Données de démonstration :</strong> Chargez des exemples
              de transactions et budgets pour tester l&apos;application.
            </AlertDescription>
          </Alert>

          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Attention :</strong> La suppression des données est
              définitive et irréversible. Vos données sont stockées uniquement
              sur cet appareil.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium">Actions disponibles :</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Charger des données de démonstration (50 transactions)</li>
              <li>• Supprimer toutes les transactions</li>
              <li>• Supprimer tous les budgets</li>
              <li>• Réinitialiser complètement l&apos;application</li>
              <li>• Diagnostic du système de stockage</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isClearing || isLoading}
          >
            Annuler
          </Button>

          <Button
            variant="default"
            onClick={handleLoadDemoData}
            disabled={isClearing || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Charger les données de démo
              </>
            )}
          </Button>

          <Button
            variant="destructive"
            onClick={handleClearData}
            disabled={isClearing || isLoading}
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
