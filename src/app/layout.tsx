import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlockRouter — Programmable Payments for AI Inference",
  description:
    "Turbin3 capstone presentation: Solana vaults and capped spending sessions that pay for AI inference.",
};

export const viewport: Viewport = {
  themeColor: "#06060a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
