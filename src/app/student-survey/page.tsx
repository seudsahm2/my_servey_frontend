'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { submitStudentSurvey } from '@/lib/api';
import type { StudentSurveyData } from '@/types/survey';
import { useLanguage } from '@/lib/LanguageContext';
import { languageNames, Language } from '@/lib/translations';

const TOTAL_STEPS = 5;

export default function StudentSurvey() {
    const router = useRouter();
    const { language, setLanguage, t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { register, handleSubmit, trigger, formState: { errors } } = useForm<StudentSurveyData>();

    const subjects = [t.quranReading, t.tajweed, t.hadith, t.arabicLanguage, t.islamicArts];
    const subjectValues = ['Quran Reading', 'Tajweed', 'Hadith', 'Arabic Language', 'Islamic Arts'];

    const nextStep = async () => {
        const fields = getFieldsForStep(currentStep);
        const isValid = await trigger(fields as any);
        if (isValid && currentStep < TOTAL_STEPS) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getFieldsForStep = (step: number) => {
        switch (step) {
            case 1: return ['phone_number'];
            case 2: return ['quran_experience', 'taken_online_lessons', 'online_lessons_reason'];
            case 3: return ['teacher_challenges', 'time_preference', 'preferred_session_length', 'preferred_frequency'];
            case 4: return ['fair_price_etb', 'subjects_of_interest', 'trust_factors'];
            case 5: return ['willing_to_try', 'willing_to_try_reason', 'desired_features'];
            default: return [];
        }
    };

    const onSubmit = async (data: StudentSurveyData) => {
        setIsSubmitting(true);
        try {
            await submitStudentSurvey(data);
            setIsSuccess(true);
            setTimeout(() => router.push('/'), 4000);
        } catch (error: any) {
            console.error('Error submitting survey:', error);
            if (error.response?.data?.phone_number) {
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
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md p-8 md:p-12 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 text-center animate-fade-in shadow-2xl">
                    <div className="relative mb-6">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-lg">
                            <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">{t.thankYou}</h2>
                    <p className="text-gray-400 text-sm md:text-base">{t.studentSuccess}</p>
                    <div className="mt-6 flex items-center justify-center gap-2 text-blue-400">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <p className="text-sm">{t.redirecting}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 py-6 md:py-8 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Header with Language Selector */}
                    <div className="flex justify-between items-center mb-6">
                        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 group transition-all">
                            <svg className={`w-5 h-5 ${isRTL ? 'ml-2 group-hover:translate-x-1' : 'mr-2 group-hover:-translate-x-1'} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium text-sm md:text-base">{t.backToHome}</span>
                        </Link>

                        {/* Language Selector */}
                        <div className="flex gap-2">
                            {(['en', 'ar', 'am'] as Language[]).map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium text-xs md:text-sm transition-all ${language === lang
                                        ? 'bg-blue-500 text-white shadow-lg'
                                        : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                                        }`}
                                >
                                    {languageNames[lang]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Progress Section */}
                    <div className="mb-6 md:mb-8">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-xl md:text-2xl font-bold text-white">{t.studentSurvey}</h2>
                            <span className="text-xs md:text-sm font-semibold text-blue-400 bg-blue-500/20 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-blue-500/30">
                                {currentStep}/{TOTAL_STEPS}
                            </span>
                        </div>
                        <div className="relative h-2 md:h-3 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-3 px-1">
                            {[1, 2, 3, 4, 5].map((step) => (
                                <div key={step} className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold transition-all ${step < currentStep ? 'bg-blue-500 text-white' :
                                    step === currentStep ? 'bg-blue-500 text-white scale-110' :
                                        'bg-white/10 text-gray-500'
                                    }`}>
                                    {step < currentStep ? '✓' : step}
                                </div>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="p-6 md:p-8 lg:p-10 bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/10 min-h-[500px]">

                            {/* Step 1: Identity Verification */}
                            {currentStep === 1 && (
                                <div className="space-y-6 md:space-y-8 animate-fade-in">
                                    <div className="text-center mb-6 md:mb-8">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                                            <span className="text-2xl md:text-3xl">📱</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.identityVerification}</h3>
                                        <p className="text-gray-400 text-sm md:text-base">{t.identityVerificationDesc}</p>
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
                                                className="w-full p-3 md:p-4 pl-16 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all text-base md:text-lg font-semibold tracking-wide"
                                                dir="ltr"
                                            />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold border-r border-white/10 pr-3">
                                                +251
                                            </div>
                                        </div>
                                        {errors.phone_number?.type === 'required' && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                        {errors.phone_number?.type === 'pattern' && <p className="text-red-400 mt-2 text-sm">{t.invalidPhoneNumber}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: About You */}
                            {currentStep === 2 && (
                                <div className="space-y-6 md:space-y-8 animate-fade-in">
                                    <div className="text-center mb-6 md:mb-8">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                                            <span className="text-2xl md:text-3xl">📖</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.studentStep1Title}</h3>
                                        <p className="text-gray-400 text-sm md:text-base">{t.studentStep1Desc}</p>
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4 block">{t.q1}</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {['beginner', 'intermediate', 'advanced'].map((level) => (
                                                <label key={level} className="relative cursor-pointer">
                                                    <input type="radio" value={level} {...register('quran_experience', { required: true })} className="peer sr-only" />
                                                    <div className="p-4 md:p-5 bg-white/5 border-2 border-white/10 rounded-xl md:rounded-2xl transition-all peer-checked:border-blue-500 peer-checked:bg-blue-500/10 hover:bg-white/10">
                                                        <div className="text-center">
                                                            <span className="text-3xl md:text-4xl mb-2 block">{level === 'beginner' ? '🌱' : level === 'intermediate' ? '📖' : '⭐'}</span>
                                                            <span className="font-medium text-white capitalize text-sm md:text-base">{t[level as keyof typeof t]}</span>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.quran_experience && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4 block">{t.q2}</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[{ value: true, label: t.yes }, { value: false, label: t.no }].map((option) => (
                                                <label key={String(option.value)} className="cursor-pointer">
                                                    <input type="radio" value={String(option.value)} {...register('taken_online_lessons', { required: true })} className="peer sr-only" />
                                                    <div className="p-4 bg-white/5 border-2 border-white/10 rounded-xl transition-all peer-checked:border-blue-500 peer-checked:bg-blue-500/10 hover:bg-white/10 text-center">
                                                        <span className="font-medium text-white text-sm md:text-base">{option.label}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        <textarea
                                            {...register('online_lessons_reason')}
                                            placeholder={t.q2placeholder}
                                            className="mt-3 w-full p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all text-sm md:text-base"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Preferences */}
                            {currentStep === 3 && (
                                <div className="space-y-6 md:space-y-8 animate-fade-in">
                                    <div className="text-center mb-6 md:mb-8">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                                            <span className="text-2xl md:text-3xl">⏰</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.studentStep2Title}</h3>
                                        <p className="text-gray-400 text-sm md:text-base">{t.studentStep2Desc}</p>
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 block">{t.q3}</label>
                                        <textarea
                                            {...register('teacher_challenges', { required: true })}
                                            className="w-full p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all text-sm md:text-base"
                                            rows={4}
                                            placeholder={t.q3placeholder}
                                        />
                                        {errors.teacher_challenges && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 block">{t.q4}</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                                            {[
                                                { value: 'mornings', label: t.mornings, icon: '🌅' },
                                                { value: 'evenings', label: t.evenings, icon: '🌆' },
                                                { value: 'weekends', label: t.weekends, icon: '📅' },
                                                { value: 'flexible', label: t.flexible, icon: '✨' }
                                            ].map((time) => (
                                                <label key={time.value} className="cursor-pointer">
                                                    <input type="radio" value={time.value} {...register('time_preference', { required: true })} className="peer sr-only" />
                                                    <div className="p-3 md:p-4 bg-white/5 border-2 border-white/10 rounded-xl transition-all peer-checked:border-blue-500 peer-checked:bg-blue-500/10 hover:bg-white/10">
                                                        <div className="text-center">
                                                            <span className="text-2xl md:text-3xl block mb-1">{time.icon}</span>
                                                            <span className="text-white font-medium text-xs md:text-sm">{time.label}</span>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.time_preference && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                                        <div>
                                            <label className="text-base md:text-lg font-semibold text-white mb-3 block">{t.q5}</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[20, 30, 45, 60].map((mins) => (
                                                    <label key={mins} className="cursor-pointer">
                                                        <input type="radio" value={mins} {...register('preferred_session_length', { required: true, valueAsNumber: true })} className="peer sr-only" />
                                                        <div className="p-3 bg-white/5 border-2 border-white/10 rounded-xl transition-all peer-checked:border-blue-500 peer-checked:bg-blue-500/10 hover:bg-white/10 text-center">
                                                            <div className="font-bold text-lg md:text-xl text-white">{mins}</div>
                                                            <div className="text-xs text-gray-400">{t.minutes}</div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.preferred_session_length && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                        </div>

                                        <div>
                                            <label className="text-base md:text-lg font-semibold text-white mb-3 block">{t.q6}</label>
                                            <div className="space-y-2">
                                                {[
                                                    { value: 'once_week', label: t.onceWeek },
                                                    { value: 'twice_week', label: t.twiceWeek },
                                                    { value: 'more', label: t.moreOften }
                                                ].map((option) => (
                                                    <label key={option.value} className="cursor-pointer block">
                                                        <input type="radio" value={option.value} {...register('preferred_frequency', { required: true })} className="peer sr-only" />
                                                        <div className="p-3 bg-white/5 border-2 border-white/10 rounded-xl transition-all peer-checked:border-blue-500 peer-checked:bg-blue-500/10 hover:bg-white/10">
                                                            <span className="text-white font-medium text-sm md:text-base">{option.label}</span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.preferred_frequency && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Topics & Budget */}
                            {currentStep === 4 && (
                                <div className="space-y-6 md:space-y-8 animate-fade-in">
                                    <div className="text-center mb-6 md:mb-8">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                                            <span className="text-2xl md:text-3xl">💰</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.studentStep3Title}</h3>
                                        <p className="text-gray-400 text-sm md:text-base">{t.studentStep3Desc}</p>
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 block">{t.q7}</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register('fair_price_etb', { required: true, valueAsNumber: true, min: 0 })}
                                            className="w-full p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all text-base md:text-lg font-semibold"
                                            placeholder={t.q7placeholder}
                                        />
                                        {errors.fair_price_etb && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 block">
                                            {t.q8} <span className="text-sm text-gray-400">({t.selectAll})</span>
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                                            {subjects.map((subject, idx) => (
                                                <label key={subjectValues[idx]} className="cursor-pointer">
                                                    <input type="checkbox" value={subjectValues[idx]} {...register('subjects_of_interest', { required: true })} className="peer sr-only" />
                                                    <div className="p-3 md:p-4 bg-white/5 border-2 border-white/10 rounded-xl transition-all peer-checked:border-blue-500 peer-checked:bg-blue-500/10 hover:bg-white/10 flex items-center gap-3">
                                                        <div className="w-5 h-5 border-2 border-white/30 rounded peer-checked:bg-blue-500 peer-checked:border-blue-500 flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-white font-medium text-sm md:text-base">{subject}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.subjects_of_interest && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 block">{t.q9}</label>
                                        <textarea
                                            {...register('trust_factors', { required: true })}
                                            className="w-full p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all text-sm md:text-base"
                                            rows={3}
                                            placeholder={t.q9placeholder}
                                        />
                                        {errors.trust_factors && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Step 5: Final Thoughts */}
                            {currentStep === 5 && (
                                <div className="space-y-6 md:space-y-8 animate-fade-in">
                                    <div className="text-center mb-6 md:mb-8">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                                            <span className="text-2xl md:text-3xl">✨</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.studentStep4Title}</h3>
                                        <p className="text-gray-400 text-sm md:text-base">{t.studentStep4Desc}</p>
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 block">{t.q10}</label>
                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            {[
                                                { value: true, label: t.yesWould, icon: '😊' },
                                                { value: false, label: t.notSure, icon: '🤔' }
                                            ].map((option) => (
                                                <label key={String(option.value)} className="cursor-pointer">
                                                    <input type="radio" value={String(option.value)} {...register('willing_to_try', { required: true })} className="peer sr-only" />
                                                    <div className="p-4 md:p-5 bg-white/5 border-2 border-white/10 rounded-xl transition-all peer-checked:border-blue-500 peer-checked:bg-blue-500/10 hover:bg-white/10">
                                                        <div className="text-center">
                                                            <span className="text-3xl md:text-4xl block mb-2">{option.icon}</span>
                                                            <span className="text-white font-semibold text-sm md:text-base">{option.label}</span>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        <textarea
                                            {...register('willing_to_try_reason')}
                                            placeholder={t.q10placeholder}
                                            className="w-full p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all text-sm md:text-base"
                                            rows={2}
                                        />
                                        {errors.willing_to_try && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                    </div>

                                    <div>
                                        <label className="text-base md:text-lg font-semibold text-white mb-3 block">{t.q11}</label>
                                        <textarea
                                            {...register('desired_features', { required: true })}
                                            className="w-full p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all text-sm md:text-base"
                                            rows={4}
                                            placeholder={t.q11placeholder}
                                        />
                                        {errors.desired_features && <p className="text-red-400 mt-2 text-sm">{t.required}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Navigation */}
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
                                        className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2 text-sm md:text-base"
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
                                        className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm md:text-base"
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
