// src/app/page.tsx
import type { Metadata } from 'next';
import HomeForm from './HomeForm'; // ⬅️ IMPORT THE NEW CLIENT COMPONENT

// --- SEO Metadata and Google Verification ---
export const metadata: Metadata = {
  // Basic SEO
  title: 'Future of Online Islamic Learning Surveys', // Customize your main homepage title
  description: 'Participate in our student or teacher surveys to shape the next generation of online Quran, Hadith, and Arabic education platforms.',
  keywords: [
    "online Islamic education platform",
    "Quran lessons online",
    "Hadith courses",
    "Arabic learning platform",
    "Islamic studies market research"
  ],
  // 🔑 GOOGLE SEARCH CONSOLE VERIFICATION
  verification: {
    google: '07aEkZ5yV_f4TrJpsaGrtlL412CmCDy_ecJ7bEAO2V0',
  },
  // Optional: Add OpenGraph tags for social sharing if desired
  // openGraph: { ... }
};
// --- End of Metadata ---


// This component acts as the Server Component wrapper.
export default function Home() {
  return <HomeForm />;
}