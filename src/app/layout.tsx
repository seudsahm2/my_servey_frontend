import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { AuthProvider } from "@/lib/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Islamic Learning Survey Platform",
  description: "Help shape the future of Islamic education by sharing your insights. Connect students with qualified teachers of Quran, Hadith, Arabic & Islamic arts.",
  metadataBase: new URL('https://my-servey-frontend.vercel.app'),

  openGraph: {
    title: "Islamic Learning Survey Platform",
    description: "Help shape the future of Islamic education by sharing your insights. Connect students with qualified teachers of Quran, Hadith, Arabic & Islamic arts.",
    url: "https://my-servey-frontend.vercel.app/",
    siteName: "Islamic Learning Survey Platform",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Islamic Learning Survey Platform - Building the Future of Islamic Education",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Islamic Learning Survey Platform",
    description: "Help shape the future of Islamic education by sharing your insights",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
