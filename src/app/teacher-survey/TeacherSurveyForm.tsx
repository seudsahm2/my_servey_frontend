'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { FieldPath } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { submitTeacherSurvey, checkTeacherPhoneAvailability } from '@/lib/api';
import type { TeacherSurveyData, QuestionBank, DynamicQuestion } from '@/types/survey';
import { useLanguage } from '@/lib/LanguageContext';
import { languageNames, Language } from '@/lib/translations';
import { isAxiosError } from 'axios';
import { useSurveyQuestions } from '@/lib/useSurveyQuestions';


const TOTAL_STEPS = 6;

export default function TeacherSurveyForm() {
    const router = useRouter();
    const { language, setLanguage, t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isCheckingPhone, setIsCheckingPhone] = useState(false);
    const { register, handleSubmit, trigger, getValues, setError, clearErrors, formState: { errors } } = useForm<TeacherSurveyData>();

    const topics = [t.quranReading, t.tajweed, t.hadith, t.arabicLanguage, t.islamicArts];
    const topicValues = ['Quran Reading', 'Tajweed', 'Hadith', 'Arabic Language', 'Islamic Arts'];

    const { getQuestionsBySection, loading: questionsLoading } = useSurveyQuestions('teacher');

    const selectedTopics = getValues('confident_topics');
    const dynamicQuestions = useMemo(() => {
        if (!selectedTopics || selectedTopics.length === 0) return [];
        let questions: DynamicQuestion[] = [];
        selectedTopics.forEach(topic => {
            const sectionQuestions = getQuestionsBySection(topic);
            if (sectionQuestions.length > 0) {
                const limit = selectedTopics.length > 1 ? 1 : 2;
                questions = [...questions, ...sectionQuestions.slice(0, limit)];
            }
        });
        return questions;
    }, [selectedTopics, getQuestionsBySection]);
    const getFieldsForStep = (step: number): Array<FieldPath<TeacherSurveyData>> => {
        switch (step) {
            case 1:
                return ['full_name', 'age_range', 'phone_number'];
            case 2:
                return ['confident_topics'];
            case 3:
                // Dynamic questions
                return [];
            case 4:
                return ['teaching_background', 'tried_online_teaching', 'teaching_challenges'];
            case 5:
                return ['students_per_week', 'fair_rate_etb', 'preferred_session_length', 'would_join_platform', 'support_needed'];
            case 6:
                return ['feedback_preferences', 'wants_early_access'];
            default:
                return [];
        }
    };

    const nextStep = async () => {
        const fields = getFieldsForStep(currentStep);
        const isValid = await trigger(fields);

        if (!isValid) {
            return;
        }

        if (currentStep === 1) {
            // @ts-ignore
            clearErrors('phone_number');
            let canProceed = true;
            try {
                setIsCheckingPhone(true);
                const phone = getValues('phone_number');
                const { valid, exists } = await checkTeacherPhoneAvailability(phone);

                if (!valid) {
                    canProceed = false;
                    setError('phone_number', {
                        type: 'manual',
                        message: t.invalidPhoneNumber
                    });
                } else if (exists) {
                    canProceed = false;
                    setError('phone_number', {
                        type: 'manual',
                        message: t.duplicatePhoneNumber
                    });
                }
            } catch (error: unknown) {
                canProceed = false;
                if (isAxiosError(error) && error.response?.data?.error) {
                    const apiMessage = Array.isArray(error.response.data.error)
                        ? error.response.data.error.join(' ')
                        : String(error.response.data.error);
                    setError('phone_number', {
                        type: 'manual',
                        message: apiMessage
                    });
                } else {
                    alert(t.phoneCheckFailed);
                }
            } finally {
                setIsCheckingPhone(false);
            }

            if (!canProceed) {
                return;
            }
        }

        if (currentStep < TOTAL_STEPS) {
            setCurrentStep((step) => step + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((step) => step - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const onSubmit = async (data: TeacherSurveyData) => {
        setIsSubmitting(true);
        try {
            await submitTeacherSurvey(data);
            setIsSuccess(true);
            setTimeout(() => router.push('/'), 4000);
        } catch (error: unknown) {
            console.error('Error submitting teacher survey:', error);
            if (isAxiosError(error) && error.response?.data?.phone_number) {
                alert(t.duplicatePhoneNumber);
            } else {
                alert('Error submitting survey. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = (currentStep / TOTAL_STEPS) * 100;
    const isRTL = language === 'ar';

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md p-8 md:p-12 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 text-center animate-fade-in shadow-2xl">
                    <div className="relative mb-6">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-lg">
                            <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">{t.thankYou}</h2>
                    <p className="text-gray-400 text-sm md:text-base">{t.teacherSuccess}</p>
                    <div className="mt-6 flex items-center justify-center gap-2 text-purple-400">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        <p className="text-sm">{t.redirecting}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 py-6 md:py-8 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 group transition-all">
                            <svg className={`w-5 h-5 ${isRTL ? 'ml-2 group-hover:translate-x-1' : 'mr-2 group-hover:-translate-x-1'} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium text-sm md:text-base">{t.backToHome}</span>
                        </Link>

                        <div className="flex gap-2">
                            {(['en', 'ar', 'am'] as Language[]).map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium text-xs md:text-sm transition-all ${language === lang
                                        ? 'bg-purple-500 text-white shadow-lg'
                                        : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                                        }`}
                                >
                                    {languageNames[lang]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6 md:mb-8">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-xl md:text-2xl font-bold text-white">{t.teacherSurvey}</h2>
                            <span className="text-xs md:text-sm font-semibold text-purple-400 bg-purple-500/20 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-purple-500/30">
                                {currentStep}/{TOTAL_STEPS}
                            </span>
                        </div>
                        <div className="relative h-2 md:h-3 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-3 px-1">
                            {[1, 2, 3, 4, 5, 6].map((step) => (
                                <div key={step} className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold transition-all ${step < currentStep ? 'bg-purple-500 text-white' :
                                    step === currentStep ? 'bg-purple-500 text-white scale-110' :
                                        'bg-white/10 text-gray-500'
                                    }`}>
                                    {step < currentStep ? '✓' : step}
                                </div>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="p-6 md:p-8 lg:p-10 bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/10 min-h-[500px]">
                            {currentStep === 1 && (
                                <div className="space-y-6 md:space-y-8 animate-fade-in">
                                    <div className="text-center mb-6 md:mb-8">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                                            <span className="text-2xl md:text-3xl">📱</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.teacherStep1Title}</h3>
                                        <p className="text-gray-400 text-sm md:text-base">{t.teacherStep1Desc}</p>
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 block">{t.fullName}</label>
                                        <input
                                            type="text"
                                            {...register('full_name', { required: true, minLength: 3 })}
                                            placeholder={t.fullNamePlaceholder}
                                            className="w-full p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all text-base md:text-lg font-semibold"
                                        />
                                        {errors.full_name && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 block">{t.ageRange}</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {['8-15', '15-24', '24-32', '32-40', '40+'].map((age) => (
                                                <label key={age} className="cursor-pointer">
                                                    <input type="radio" value={age} {...register('age_range', { required: true })} className="peer sr-only" />
                                                    <div className="p-3 bg-white/5 border-2 border-white/10 rounded-xl transition-all peer-checked:border-purple-500 peer-checked:bg-purple-500/10 hover:bg-white/10 text-center">
                                                        <span className="font-medium text-white text-sm md:text-base">{age}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.age_range && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 block">{t.gender}</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['male', 'female'].map((g) => (
                                                <label key={g} className="cursor-pointer">
                                                    <input type="radio" value={g} {...register('gender', { required: true })} className="peer sr-only" />
                                                    <div className="p-3 bg-white/5 border-2 border-white/10 rounded-xl transition-all peer-checked:border-purple-500 peer-checked:bg-purple-500/10 hover:bg-white/10 text-center">
                                                        <span className="font-medium text-white text-sm md:text-base">
                                                            {g === 'male' ? t.male : t.female}
                                                        </span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.gender && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4 block">
                                            {t.phoneNumber}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                {...register('phone_number', {
                                                    required: true,
                                                    pattern: {
                                                        value: /^(09|07|9|7)\d{8}$/,
                                                        message: 'invalid'
                                                    }
                                                })}
                                                placeholder={t.phoneNumberPlaceholder}
                                                className="w-full p-3 md:p-4 pl-24 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all text-base md:text-lg font-semibold tracking-wide"
                                                dir="ltr"
                                            />
                                            <div className="pointer-events-none select-none absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-semibold border-r border-white/10 pr-4">
                                                +251
                                            </div>
                                        </div>
                                        {errors.phone_number?.type === 'required' && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                        {errors.phone_number?.type === 'pattern' && <p className="text-red-400 mt-2 text-sm">{t.invalidPhoneNumber}</p>}
                                        {errors.phone_number?.type === 'manual' && <p className="text-red-400 mt-2 text-sm">{errors.phone_number.message}</p>}
                                        {isCheckingPhone && (
                                            <div className="flex items-center gap-2 mt-2 text-purple-300 animate-pulse">
                                                <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-sm font-medium">{t.checkingPhone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-6 md:space-y-8 animate-fade-in">
                                    <div className="text-center mb-6 md:mb-8">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                                            <span className="text-2xl md:text-3xl">📚</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.teacherStep2Title}</h3>
                                        <p className="text-gray-400 text-sm md:text-base">{t.teacherStep2Desc}</p>
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 block">
                                            {t.t7} <span className="text-sm text-gray-400">({t.selectAll})</span>
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                                            {topics.map((topic, idx) => (
                                                <label key={topicValues[idx]} className="cursor-pointer">
                                                    <input type="checkbox" value={topicValues[idx]} {...register('confident_topics', { required: true })} className="peer sr-only" />
                                                    <div className="p-3 md:p-4 bg-white/5 border-2 border-white/10 rounded-xl transition-all peer-checked:border-purple-500 peer-checked:bg-purple-500/10 hover:bg-white/10 flex items-center gap-3">
                                                        <div className="w-5 h-5 border-2 border-white/30 rounded peer-checked:bg-purple-500 peer-checked:border-purple-500 flex items-center justify-center shrink-0">
                                                            <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-white font-medium text-sm md:text-base">{topic}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.confident_topics && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-6 md:space-y-8 animate-fade-in">
                                    <div className="text-center mb-6 md:mb-8">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                                            <span className="text-2xl md:text-3xl">🎯</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.teacherStep4Title}</h3>
                                        <p className="text-gray-400 text-sm md:text-base">{t.teacherStep4Desc}</p>
                                    </div>

                                    {dynamicQuestions.length > 0 ? (
                                        dynamicQuestions.map((q) => (
                                            <div key={q.id}>
                                                <label className="text-base md:text-lg font-semibold text-white mb-3 block">{q.text}</label>
                                                {q.type === 'choice' && q.options ? (
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        {q.options.map((option) => (
                                                            <label key={option} className="cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    value={option}
                                                                    {...register(`dynamic_responses.${q.id}` as any, { required: true })}
                                                                    className="peer sr-only"
                                                                />
                                                                <div className="p-4 bg-white/5 border-2 border-white/10 rounded-xl transition-all peer-checked:border-purple-500 peer-checked:bg-purple-500/10 hover:bg-white/10 text-center">
                                                                    <span className="font-medium text-white text-sm md:text-base">{option}</span>
                                                                </div>
                                                            </label>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <textarea
                                                        {...register(`dynamic_responses.${q.id}` as any, { required: true })}
                                                        className="w-full p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all text-sm md:text-base"
                                                        rows={3}
                                                        placeholder={t.t11placeholder}
                                                    />
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <p>No specific questions for your selection. Please proceed.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-6 md:space-y-8 animate-fade-in">
                                    <div className="text-center mb-6 md:mb-8">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                                            <span className="text-2xl md:text-3xl">🕌</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.teacherStep1Title}</h3>
                                        <p className="text-gray-400 text-sm md:text-base">{t.teacherStep1Desc}</p>
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4 block">{t.t1}</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                                            {[
                                                { value: 'madrasa', label: t.madrasa, icon: '🕌' },
                                                { value: 'mosque', label: t.mosque, icon: '🌙' },
                                                { value: 'private', label: t.private, icon: '👤' },
                                                { value: 'online', label: t.online, icon: '💻' },
                                                { value: 'mixed', label: t.mixed, icon: '🔄' }
                                            ].map((bg) => (
                                                <label key={bg.value} className="cursor-pointer">
                                                    <input type="radio" value={bg.value} {...register('teaching_background', { required: true })} className="peer sr-only" />
                                                    <div className="p-3 md:p-4 bg-white/5 border-2 border-white/10 rounded-xl transition-all peer-checked:border-purple-500 peer-checked:bg-purple-500/10 hover:bg-white/10">
                                                        <div className="text-center">
                                                            <span className="text-2xl md:text-3xl block mb-1">{bg.icon}</span>
                                                            <span className="text-white font-medium text-xs md:text-sm">{bg.label}</span>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.teaching_background && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                        <textarea {...register('teaching_background_details')} placeholder={t.t1placeholder} className="mt-3 w-full p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all text-sm md:text-base" rows={2} />
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4 block">{t.t2}</label>
                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            {[{ value: true, label: t.yes }, { value: false, label: t.no }].map((option) => (
                                                <label key={String(option.value)} className="cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        value={String(option.value)}
                                                        {...register('tried_online_teaching', {
                                                            required: true,
                                                            setValueAs: (value) => value === 'true'
                                                        })}
                                                        className="peer sr-only"
                                                    />
                                                    <div className="p-4 bg-white/5 border-2 border-white/10 rounded-xl transition-all peer-checked:border-purple-500 peer-checked:bg-purple-500/10 hover:bg-white/10 text-center">
                                                        <span className="font-medium text-white text-sm md:text-base">{option.label}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        <textarea {...register('online_teaching_reason')} placeholder={t.t2placeholder} className="w-full p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all text-sm md:text-base" rows={2} />
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 block">{t.t3}</label>
                                        <textarea
                                            {...register('teaching_challenges', { required: true })}
                                            className="w-full p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all text-sm md:text-base"
                                            rows={4}
                                            placeholder={t.t3placeholder}
                                        />
                                        {errors.teaching_challenges && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                    </div>
                                </div>
                            )}

                            {currentStep === 5 && (
                                <div className="space-y-6 md:space-y-8 animate-fade-in">
                                    <div className="text-center mb-6 md:mb-8">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                                            <span className="text-2xl md:text-3xl">🚀</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.teacherStep3Title}</h3>
                                        <p className="text-gray-400 text-sm md:text-base">{t.teacherStep3Desc}</p>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                                        <div>
                                            <label className="text-base md:text-lg font-semibold text-white mb-3 block">{t.t4}</label>
                                            <input
                                                type="number"
                                                {...register('students_per_week', { required: true, valueAsNumber: true, min: 0 })}
                                                className="w-full p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all text-base md:text-lg font-semibold"
                                                placeholder={t.t4placeholder}
                                            />
                                            {errors.students_per_week && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                        </div>

                                        <div>
                                            <label className="text-base md:text-lg font-semibold text-white mb-3 block">{t.t5}</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                {...register('fair_rate_etb', { required: true, valueAsNumber: true, min: 0 })}
                                                className="w-full p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all text-base md:text-lg font-semibold"
                                                placeholder={t.t5placeholder}
                                            />
                                            {errors.fair_rate_etb && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 block">{t.t6}</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {[20, 30, 45, 60].map((mins) => (
                                                <label key={mins} className="cursor-pointer">
                                                    <input type="radio" value={mins} {...register('preferred_session_length', { required: true, valueAsNumber: true })} className="peer sr-only" />
                                                    <div className="p-3 bg-white/5 border-2 border-white/10 rounded-xl transition-all peer-checked:border-purple-500 peer-checked:bg-purple-500/10 hover:bg-white/10 text-center">
                                                        <div className="font-bold text-lg md:text-xl text-white">{mins}</div>
                                                        <div className="text-xs text-gray-400">{t.minutes}</div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.preferred_session_length && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 block">{t.t8}</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { value: true, label: t.yesJoin, icon: '🎉' },
                                                { value: false, label: t.notSure, icon: '🤔' }
                                            ].map((option) => (
                                                <label key={String(option.value)} className="cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        value={String(option.value)}
                                                        {...register('would_join_platform', {
                                                            required: true,
                                                            setValueAs: (value) => value === 'true'
                                                        })}
                                                        className="peer sr-only"
                                                    />
                                                    <div className="p-4 md:p-5 bg-white/5 border-2 border-white/10 rounded-xl transition-all peer-checked:border-purple-500 peer-checked:bg-purple-500/10 hover:bg-white/10">
                                                        <div className="text-center">
                                                            <span className="text-3xl md:text-4xl block mb-2">{option.icon}</span>
                                                            <span className="text-white font-semibold text-sm md:text-base">{option.label}</span>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.would_join_platform && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 block">{t.t9}</label>
                                        <textarea
                                            {...register('support_needed', { required: true })}
                                            className="w-full p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all text-sm md:text-base"
                                            rows={4}
                                            placeholder={t.t9placeholder}
                                        />
                                        {errors.support_needed && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 block">
                                            {t.t10} <span className="text-sm text-gray-400">({t.optional})</span>
                                        </label>
                                        <textarea
                                            {...register('platform_concerns')}
                                            className="w-full p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all text-sm md:text-base"
                                            rows={3}
                                            placeholder={t.t10placeholder}
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 6 && (
                                <div className="space-y-6 md:space-y-8 animate-fade-in">
                                    <div className="text-center mb-6 md:mb-8">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                                            <span className="text-2xl md:text-3xl">✨</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.teacherStep4Title}</h3>
                                        <p className="text-gray-400 text-sm md:text-base">{t.teacherStep4Desc}</p>
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 block">{t.t11}</label>
                                        <textarea
                                            {...register('feedback_preferences', { required: true })}
                                            className="w-full p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all text-sm md:text-base"
                                            rows={4}
                                            placeholder={t.t11placeholder}
                                        />
                                        {errors.feedback_preferences && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 block">{t.t12}</label>
                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            {[
                                                { value: true, label: t.yesSignUp, icon: '🚀' },
                                                { value: false, label: t.maybeLater, icon: '⏰' }
                                            ].map((option) => (
                                                <label key={String(option.value)} className="cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        value={String(option.value)}
                                                        {...register('wants_early_access', {
                                                            required: true,
                                                            setValueAs: (value) => value === 'true'
                                                        })}
                                                        className="peer sr-only"
                                                    />
                                                    <div className="p-4 md:p-5 bg-white/5 border-2 border-white/10 rounded-xl transition-all peer-checked:border-purple-500 peer-checked:bg-purple-500/10 hover:bg-white/10">
                                                        <div className="text-center">
                                                            <span className="text-3xl md:text-4xl block mb-2">{option.icon}</span>
                                                            <span className="text-white font-semibold text-xs md:text-sm">{option.label}</span>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        <input
                                            type="email"
                                            {...register('early_access_contact')}
                                            placeholder={t.t12placeholder}
                                            className="w-full p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all text-sm md:text-base"
                                        />
                                        {errors.wants_early_access && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                    </div>
                                </div>
                            )}

                            <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/10`}>
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className="px-4 md:px-6 py-2.5 md:py-3 border-2 border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 text-sm md:text-base"
                                >
                                    <svg className={`w-4 h-4 md:w-5 md:h-5 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span className="hidden sm:inline">{t.previous}</span>
                                </button>

                                {currentStep < TOTAL_STEPS ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={isCheckingPhone}
                                        className="px-6 md:px-8 py-3 md:py-4 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span>{t.next}</span>
                                        <svg className={`w-4 h-4 md:w-5 md:h-5 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 md:px-8 py-3 md:py-4 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm md:text-base"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>{t.submitting}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>{t.submit}</span>
                                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
