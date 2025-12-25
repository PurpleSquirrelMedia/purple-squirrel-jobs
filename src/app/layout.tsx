import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Purple Squirrel | Find Your Unicorn Talent",
  description: "AI-powered recruiting platform that aggregates tech jobs and matches exceptional candidates with their perfect roles. Stop searching, start finding.",
  keywords: ["recruiting", "tech jobs", "AI matching", "job board", "talent acquisition"],
  openGraph: {
    title: "Purple Squirrel | Find Your Unicorn Talent",
    description: "AI-powered recruiting platform for exceptional tech talent",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
