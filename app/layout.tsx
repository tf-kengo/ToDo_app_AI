import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo App AI",
  description: "AI-powered Todo application built with Next.js",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <main>
          {children}
          {modal}
        </main>
      </body>
    </html>
  );
}
