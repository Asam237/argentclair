import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ArgentClair - Gestion Financière Intelligente",
  description:
    "Prenez le contrôle de vos finances avec ArgentClair. Suivez vos dépenses, gérez vos budgets et atteignez vos objectifs financiers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
