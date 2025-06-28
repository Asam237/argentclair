"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SettingsDialog } from "@/components/settings-dialog";
import {
  Coins,
  Menu,
  X,
  BarChart3,
  CreditCard,
  Target,
  History,
  Sparkles,
  Brain,
} from "lucide-react";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onDataCleared: () => void;
}

export function Header({ activeTab, onTabChange, onDataCleared }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { id: "dashboard", label: "Tableau de bord", icon: BarChart3 },
    { id: "add", label: "Ajouter", icon: CreditCard },
    { id: "budget", label: "Budgets", icon: Target },
    { id: "ai", label: "Assistant IA", icon: Brain },
    { id: "history", label: "Historique", icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                <Coins className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ArgentClair
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Gestion financière intelligente
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                      : "hover:bg-muted"
                  } ${item.id === "ai" ? "relative" : ""}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {item.id === "ai" && (
                    <Sparkles className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1" />
                  )}
                </Button>
              );
            })}
          </nav>

          {/* Status Badge & Settings */}
          <div className="hidden lg:flex items-center space-x-3">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              En ligne
            </Badge>
            <SettingsDialog onDataCleared={onDataCleared} />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur">
            <nav className="py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full justify-start gap-3 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : ""
                    } ${item.id === "ai" ? "relative" : ""}`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    {item.id === "ai" && (
                      <Sparkles className="h-3 w-3 text-yellow-400 ml-auto" />
                    )}
                  </Button>
                );
              })}

              {/* Settings for mobile */}
              <div className="pt-2 border-t">
                <SettingsDialog onDataCleared={onDataCleared} />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
