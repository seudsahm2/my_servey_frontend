import axios from 'axios';
import type {
    StudentSurveyData,
    TeacherSurveyData,
    StudentAnalytics,
    TeacherAnalytics,
    AnalyticsSummary,
    StudentAnalyticsResponse,
    TeacherAnalyticsResponse,
} from '@/types/survey';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export type AuthCredentials = {
    username: string;
    password: string;
};

export type AuthTokens = {
    access: string;
    refresh: string;
};

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        // Only add auth header for analytics and admin endpoints, NOT for survey submissions
        const isProtectedEndpoint = config.url?.includes('/analytics/') || config.url?.includes('/token');

        if (token && isProtectedEndpoint) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

const transformStudentAnalytics = (data: StudentAnalyticsResponse): StudentAnalytics => ({
    total_responses: data.total_responses ?? 0,
    experience_distribution: data.experience_distribution ?? [],
    session_length_distribution: data.session_length_preferences ?? [],
    time_preference_distribution: data.time_preferences ?? [],
    willingness: data.willingness_to_try ?? { willing: 0, not_willing: 0 },
    online_experience: data.online_experience ?? { yes: 0, no: 0 },
    average_price: data.average_price ?? 0,
    subjects_interest: Object.entries(data.subjects_interest ?? {}).map(([subject, count]) => ({
        subject,
        count: Number(count) || 0,
    })),
    age_distribution: data.age_distribution ?? [],
    age_subjects_interest: data.age_subjects_interest ?? {},
});

const transformTeacherAnalytics = (data: TeacherAnalyticsResponse): TeacherAnalytics => ({
    total_responses: data.total_responses ?? 0,
    teaching_background_distribution: data.background_distribution ?? [],
    session_length_distribution: data.session_length_preferences ?? [],
    platform_interest: data.platform_interest ?? { would_join: 0, would_not_join: 0 },
    online_teaching_experience: data.online_teaching_experience ?? { tried: 0, not_tried: 0 },
    early_access_interest: data.early_access_interest ?? 0,
    average_students_per_week: data.average_students_per_week ?? 0,
    average_rate: data.average_rate ?? 0,
    confident_topics: Object.entries(data.confident_topics ?? {}).map(([topic, count]) => ({
        topic,
        count: Number(count) || 0,
    })),
    age_distribution: data.age_distribution ?? [],
});

export const loginUser = async (credentials: AuthCredentials): Promise<AuthTokens> => {
    const response = await api.post<AuthTokens>('/token/', credentials);
    return response.data;
};

// Survey Submission APIs
export const submitStudentSurvey = async (data: StudentSurveyData) => {
    const response = await api.post('/surveys/student/', data);
    return response.data;
};

export const checkStudentPhoneAvailability = async (phone: string) => {
    const response = await api.get<{ valid: boolean; exists: boolean }>(
        '/surveys/student/check-phone/',
        { params: { phone } }
    );
    return response.data;
};

export const submitTeacherSurvey = async (data: TeacherSurveyData) => {
    const response = await api.post('/surveys/teacher/', data);
    return response.data;
};

export const checkTeacherPhoneAvailability = async (phone: string) => {
    const response = await api.get<{ valid: boolean; exists: boolean }>(
        '/surveys/teacher/check-phone/',
        { params: { phone } }
    );
    return response.data;
};

// Analytics APIs
export const getStudentAnalytics = async (): Promise<StudentAnalytics> => {
    const response = await api.get<StudentAnalyticsResponse>('/analytics/students/');
    return transformStudentAnalytics(response.data);
};

export const getTeacherAnalytics = async (): Promise<TeacherAnalytics> => {
    const response = await api.get<TeacherAnalyticsResponse>('/analytics/teachers/');
    return transformTeacherAnalytics(response.data);
};

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
    const response = await api.get('/analytics/summary/');
    return response.data;
};

// Filtered Analytics
export interface FilterParams {
    gender?: 'male' | 'female';
    age_range?: string;
    min_price?: number;
    max_price?: number;
    frequency?: string;
    session_length?: number;
    platform_interest?: 'willing' | 'not_willing';
}

export interface FilteredAnalyticsResponse {
    total_students: number;
    total_teachers: number;
    filters_applied: FilterParams;
    gender_distribution: Array<{ gender: string; count: number }>;
    age_distribution: Array<{ age_range: string; count: number }>;
    session_distribution: Array<{ preferred_session_length: number; count: number }>;
    frequency_distribution: Array<{ preferred_frequency: string; count: number }>;
    platform_interest: {
        students: { willing: number; not_willing: number };
        teachers: { willing: number; not_willing: number };
    };
    average_prices: {
        student_price: number;
        teacher_rate: number;
    };
    age_gender_matrix: Array<{ age_range: string; gender: string; count: number }>;
    price_session_matrix: Array<{ price_range: string; session_length: number; count: number }>;
}

export const getFilteredAnalytics = async (filters: FilterParams): Promise<FilteredAnalyticsResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
        }
    });
    const response = await api.get(`/analytics/filtered/?${params.toString()}`);
    return response.data;
};

// User Management
export interface User {
    id: number;
    type: 'student' | 'teacher';
    name: string;
    phone: string;
    gender: string;
    age_range: string;
    session_length: number;
    frequency?: string;
    price: number;
    platform_interest: boolean;
    subjects?: string[];
    submitted_at: string | null;
}

export interface UserListResponse {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    users: User[];
}

export interface UserFilterParams extends FilterParams {
    user_type?: 'all' | 'student' | 'teacher';
    search?: string;
    page?: number;
    page_size?: number;
}

export const getUserList = async (filters: UserFilterParams): Promise<UserListResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
        }
    });
    const response = await api.get(`/users/list/?${params.toString()}`);
    return response.data;
};

export default api;
