import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

// NODE_ENV'ye göre başlığı belirle
const title = process.env.NODE_ENV === "development" 
  ? "🔧 DEVELOPMENT - Product Request Platform" 
  : "Product Request Platform";

const description = process.env.NODE_ENV === "development"
  ? "Development version - A platform for managing product requests and brands"
  : "A platform for managing product requests and brands";

export const metadata: Metadata = {
  title,
  description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Development environment banner - sadece development modunda göster */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-yellow-500 text-black py-1 text-center font-bold">
              ⚠️ DEVELOPMENT ENVIRONMENT ⚠️
            </div>
          )}
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
