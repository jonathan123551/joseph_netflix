import type { Metadata } from "next";
import { Inter, Outfit, Cinzel } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Joseph Netflix | Christian Movies",
  description: "Premium Christian Streaming Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${outfit.variable} ${cinzel.variable} antialiased min-h-screen flex flex-col font-sans bg-[#050508] text-zinc-50`}
      >
        <AuthProvider>
          <SplashScreen />
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}


