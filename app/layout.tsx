import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BrandProvider } from "@/contexts/BrandContext";
import { SimulationProvider } from "@/contexts/SimulationContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SwapOS Fleet Manager",
  description: "Battery Swap Operations Management Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <BrandProvider>
          <SimulationProvider>
            {children}
          </SimulationProvider>
        </BrandProvider>
      </body>
    </html>
  );
}
