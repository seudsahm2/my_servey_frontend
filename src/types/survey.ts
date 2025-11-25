// Type definitions for survey data

export interface StudentSurveyData {
    phone_number: string;
    quran_experience: 'beginner' | 'intermediate' | 'advanced';
    taken_online_lessons: boolean;
    online_lessons_reason: string;
    teacher_challenges: string;
    time_preference: 'mornings' | 'evenings' | 'weekends' | 'flexible';
    preferred_session_length: 20 | 30 | 45 | 60;
    preferred_frequency: 'once_week' | 'twice_week' | 'more';
    fair_price_etb: number;
    subjects_of_interest: string[];
    trust_factors: string;
    willing_to_try: boolean;
    willing_to_try_reason: string;
    desired_features: string;
}

export interface TeacherSurveyData {
    phone_number: string;
    teaching_background: 'madrasa' | 'mosque' | 'private' | 'online' | 'mixed';
    teaching_background_details: string;
    tried_online_teaching: boolean;
    online_teaching_reason: string;
    teaching_challenges: string;
    students_per_week: number;
    preferred_session_length: 20 | 30 | 45 | 60;
    fair_rate_etb: number;
    confident_topics: string[];
    would_join_platform: boolean;
    support_needed: string;
    platform_concerns: string;
    feedback_preferences: string;
    wants_early_access: boolean;
    early_access_contact: string;
}

export interface StudentAnalytics {
    total_responses: number;
    experience_distribution: Array<{ quran_experience: string; count: number }>;
    session_length_distribution: Array<{ preferred_session_length: number; count: number }>;
    frequency_distribution: Array<{ preferred_frequency: string; count: number }>;
    time_preference_distribution: Array<{ time_preference: string; count: number }>;
    willingness: { willing: number; not_willing: number };
    online_experience: { yes: number; no: number };
    average_price: number;
    subjects_interest: Array<{ subject: string; count: number }>;
}

export interface TeacherAnalytics {
    total_responses: number;
    teaching_background_distribution: Array<{ teaching_background: string; count: number }>;
    session_length_distribution: Array<{ preferred_session_length: number; count: number }>;
    platform_interest: { would_join: number; would_not_join: number };
    online_experience: { tried: number; not_tried: number };
    early_access_interest: number;
    average_students_per_week: number;
    average_rate: number;
    confident_topics: Array<{ topic: string; count: number }>;
}

export interface AnalyticsSummary {
    total_student_responses: number;
    total_teacher_responses: number;
    total_responses: number;
    last_updated: string | null;
}
