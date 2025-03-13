import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/components/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "تجديد الباقة",
  description: "تجديد الباقة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" dir="rtl">
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
