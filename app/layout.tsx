import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: "ProspectAI — Plataforma Geoespacial de Inteligência de Vendas B2B",
  description:
    "Infraestrutura corporativa para mapeamento de empresas locais, detecção de déficit digital e prospecção direta com tomadores de decisão.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
