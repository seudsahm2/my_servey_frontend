// src/app/student-survey/page.tsx
import type { Metadata } from 'next';
import StudentSurveyForm from './StudentSurveyForm'; // ⬅️ IMPORT THE NEW CLIENT COMPONENT

// --- SEO Metadata Implementation (Server Side) ---
// ⚠️ No 'use client' needed here.
export const metadata: Metadata = {
    title: "Student Survey: Future of Online Islamic Learning (Quran, Hadith, Arabic)",
    description: "Participate in this short survey to help researchers understand the demand, pricing, and scheduling preferences for online Islamic education courses and Ustaz instructors.",
    keywords: [
        "online Quran course survey",
        "Arabic language learning demand",
        "Islamic studies student feedback",
        "Hadith lessons online research",
        "Islamic learning preferences",
        "online education market research"
    ],
    // Canonical link points to the survey page itself
    alternates: {
        canonical: '/student-survey',
    },
    // Ensure this page is indexed
    robots: 'index, follow',

};
// --- End of SEO Metadata ---


// This is the default export. It is a Server Component.
export default function StudentSurveyPage() {
    // This component simply renders the Client Component form
    return <StudentSurveyForm />;
}