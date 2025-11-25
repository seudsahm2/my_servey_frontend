import axios from 'axios';
import type { StudentSurveyData, TeacherSurveyData, StudentAnalytics, TeacherAnalytics, AnalyticsSummary } from '@/types/survey';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Survey Submission APIs
export const submitStudentSurvey = async (data: StudentSurveyData) => {
    const response = await api.post('/surveys/student/', data);
    return response.data;
};

export const submitTeacherSurvey = async (data: TeacherSurveyData) => {
    const response = await api.post('/surveys/teacher/', data);
    return response.data;
};

// Analytics APIs
export const getStudentAnalytics = async (): Promise<StudentAnalytics> => {
    const response = await api.get('/analytics/students/');
    return response.data;
};

export const getTeacherAnalytics = async (): Promise<TeacherAnalytics> => {
    const response = await api.get('/analytics/teachers/');
    return response.data;
};

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
    const response = await api.get('/analytics/summary/');
    return response.data;
};

export default api;
