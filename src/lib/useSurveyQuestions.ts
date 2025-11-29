import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useLanguage } from '@/lib/LanguageContext';
import { DynamicQuestion } from '@/types/survey';

const API_BASE_URL = 'http://localhost:8000/api';

export interface SurveyQuestion {
    id: number;
    survey_type: 'student' | 'teacher';
    section: string;
    identifier: string;
    text_en: string;
    text_ar: string;
    question_type: 'choice' | 'text';
    options_en: string[];
    options_ar: string[];
    order: number;
    is_active: boolean;
}

export const useSurveyQuestions = (surveyType: 'student' | 'teacher') => {
    const { language } = useLanguage();
    const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchQuestions = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/questions/`, {
                params: { survey_type: surveyType, is_active: true }
            });
            setQuestions(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch questions:', err);
            setError('Failed to load questions. Using defaults.');
        } finally {
            setLoading(false);
        }
    }, [surveyType]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const getQuestionsBySection = useCallback((section: string): DynamicQuestion[] => {
        const isAr = language === 'ar';
        return questions
            .filter(q => q.section === section)
            .sort((a, b) => a.order - b.order)
            .map(q => ({
                id: q.identifier,
                text: isAr ? q.text_ar : q.text_en,
                type: q.question_type,
                options: isAr ? q.options_ar : q.options_en
            }));
    }, [questions, language]);

    const resetQuestions = async () => {
        try {
            setLoading(true);
            await axios.post(`${API_BASE_URL}/questions/reset/`, { survey_type: surveyType });
            await fetchQuestions();
        } catch (err) {
            console.error('Failed to reset questions:', err);
            setError('Failed to reset questions.');
        } finally {
            setLoading(false);
        }
    };

    return {
        questions,
        loading,
        error,
        getQuestionsBySection,
        resetQuestions,
        refetch: fetchQuestions
    };
};
