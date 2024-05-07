import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import "./globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Dako Chatbot",
  description: "Ask me anything about Dako",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>{children}
      <Navbar/>
      </body>
    </html>
  );
}
