import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Falbulous MiniMovie",
  description: "Bring your stories to life, scene by scene, and watch your movie unfold.",
  openGraph: {
    title: "Falbulous MiniMovie",
    description: "Bring your stories to life, scene by scene, and watch your movie unfold."
  }
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
          <main className="min-h-screen mx-auto max-w-4xl mb-10 px-4 py-10 md:py-20">
            {children}
          </main>
        <Footer />
      </body>
    </html>
  );
}
