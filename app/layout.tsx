import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Cloud Kitchen Ordering",
  description: "Order delicious food from our cloud kitchen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`
          ${inter.className}
          bg-neutral-50
          text-gray-900
          antialiased
        `}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
