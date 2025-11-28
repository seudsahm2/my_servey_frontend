import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { AuthProvider } from "@/lib/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#7c3aed', // Matches your purple theme
};

// REVISED METADATA: Focuses on research, future, and data collection
export const metadata: Metadata = {
  metadataBase: new URL('https://my-servey-frontend.vercel.app'),
  title: {
    default: "Islamic Education Research Survey | Shape the Future of Learning",
    template: "%s | Islamic Education Research"
  },
  description: "Participate in a critical survey to assess the demand and needs for online Islamic learning, covering Quran, Hadith, Arabic, and Islamic Arts. Your insights drive the future.",
  // Keywords capture both the research intent and the future topics
  keywords: ["Islamic education survey", "online learning research", "future of Madrasa", "Quran teaching data", "Hadith study needs", "Islamic arts curriculum"],
  authors: [{ name: "Islamic Learning Research Group" }],
  creator: "Islamic Learning Research Group",
  publisher: "Islamic Learning Research Group",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Participate in the Islamic Learning Survey",
    description: "Help us collect vital data on online demand for Quran, Hadith, and Islamic Arts instruction.",
    url: "https://my-servey-frontend.vercel.app/",
    siteName: "Islamic Education Research Platform",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Islamic Learning Survey - Join the Research",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Islamic Education Research Survey",
    description: "Contribute your experience to the future of online Islamic education.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE", // Add this after linking to Google Search Console
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // SCHEMA MARKUP: We use "Educational Organization" because the survey relates to the field of education.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Islamic Learning Research Group',
    url: 'https://my-servey-frontend.vercel.app',
    description: 'A research initiative gathering data on the demand for specialized online Islamic education teachers (Ustazs).',
    // Add social links if you have any accounts for this research project
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inject Schema for Search Engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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