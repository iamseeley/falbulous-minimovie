import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Falbalous MiniMovie",
  description: "Generate MiniMovies from text, scene by scene.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
          <main className="min-h-screen mx-auto  max-w-4xl mb-10">
            {children}
          </main>
        <Footer />
      </body>
    </html>
  );
}
