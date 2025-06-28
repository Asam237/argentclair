"use client";

import { Button } from "@/components/ui/button";
import { Coins, Heart, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Brand Section */}
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
              <Coins className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ArgentClair
              </h3>
              <p className="text-xs text-muted-foreground">
                Gestion financière intelligente
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Social & Copyright */}
          <div className="flex flex-col items-center md:items-end space-y-3">
            <div className="text-xs text-muted-foreground text-center md:text-right">
              <p>© {currentYear} ArgentClair</p>
              <p className="flex items-center justify-center md:justify-end gap-1 mt-1">
                Fait avec <Heart className="h-3 w-3 text-red-500" /> en France
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
