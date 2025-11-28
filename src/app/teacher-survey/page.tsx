// src/app/teacher-survey/page.tsx
import type { Metadata } from 'next';
import TeacherSurveyForm from './TeacherSurveyForm'; // ⬅️ IMPORT THE CLIENT COMPONENT

// --- SEO Metadata Implementation (Server Side) ---
// ⚠️ This MUST be outside of the default function and NOT have a 'use client' above it.
export const metadata: Metadata = {
    // Title: Targeting teachers and their topics (Quran, Tajweed, Hadith)
    title: "Teacher Survey: Shape the Future of Online Islamic Education",

    // Description: Explaining the survey's goal for teachers
    description: "Are you an Ustaz/teacher of Islamic subjects? Share your experience, challenges, and compensation expectations to help us build a dedicated online teaching platform.",

    // Keywords: Targeting teacher-specific search terms
    keywords: [
        "online Quran teacher survey",
        "Islamic studies teacher platform",
        "Ustaz teaching online",
        "online Tajweed teaching compensation",
        "Hadith teacher challenges",
        "online Arabic teaching jobs",
        "teacher recruitment survey"
    ],

    // Canonical link pointing to the teacher survey page
    alternates: {
        canonical: '/teacher-survey',
    },

    // Ensure this page is indexed
    robots: 'index, follow',
    // You can add back the 'openGraph' section here too if you like:
    // openGraph: { /* ... */ }
};
// --- End of SEO Metadata ---


// This is the default export. It is a Server Component.
export default function TeacherSurveyPage() {
    // This component simply renders the Client Component form
    return <TeacherSurveyForm />;
}