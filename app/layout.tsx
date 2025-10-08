import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Éditeur d'Images IA",
  description: "Transformez vos images avec l'intelligence artificielle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
