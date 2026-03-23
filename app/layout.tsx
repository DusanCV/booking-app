import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "Booking App",
  description: "Booking web za 4 jedinice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}