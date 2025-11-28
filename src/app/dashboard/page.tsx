'use client';

import { useEffect, useState, Suspense, lazy } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { getStudentAnalytics, getTeacherAnalytics, getAnalyticsSummary } from '@/lib/api';
import type { StudentAnalytics, TeacherAnalytics, AnalyticsSummary } from '@/types/survey';
import { useLanguage } from '@/lib/LanguageContext';
import dynamic from 'next/dynamic';

// Dynamic imports for Recharts - lazy load heavy components
const BarChart = dynamic(() => import('recharts').then(mod => ({ default: mod.BarChart })), {
    loading: () => <div className="h-64 bg-white/5 rounded-xl animate-pulse" />,
    ssr: false
});
const Bar = dynamic(() => import('recharts').then(mod => ({ default: mod.Bar })), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => ({ default: mod.PieChart })), {
    loading: () => <div className="h-64 bg-white/5 rounded-xl animate-pulse" />,
    ssr: false
});
const Pie = dynamic(() => import('recharts').then(mod => ({ default: mod.Pie })), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => ({ default: mod.Cell })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.XAxis })), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => ({ default: mod.Tooltip })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })), { ssr: false });

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#f97316'];

export default function Dashboard() {
    const { language, t } = useLanguage();
    const isRTL = language === 'ar';
    const [studentData, setStudentData] = useState<StudentAnalytics | null>(null);
    const [teacherData, setTeacherData] = useState<TeacherAnalytics | null>(null);
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'teachers'>('overview');

    const { isAuthenticated, loading: authLoading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/admin/login');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchData = async () => {
                try {
                    const [students, teachers, summaryData] = await Promise.all([
                        getStudentAnalytics(),
                        getTeacherAnalytics(),
                        getAnalyticsSummary()
                    ]);
                    setStudentData(students);
                    setTeacherData(teachers);
                    setSummary(summaryData);
                } catch (error) {
                    console.error('Error fetching analytics:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [isAuthenticated]);

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-4 border-purple-500/30 rounded-full"></div>
                        <div className="absolute inset-2 border-4 border-t-purple-500 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{t.loadingAnalytics}</h3>
                    <p className="text-gray-400">{t.preparingDashboard}</p>
                </div>
            </div>
        );
    }

    const hasData = (summary?.total_responses || 0) > 0;
    const tabs: Array<{ id: 'overview' | 'students' | 'teachers'; label: string; icon: string }> = [
        { id: 'overview', label: t.overview, icon: '📊' },
        { id: 'students', label: t.students, icon: '📚' },
        { id: 'teachers', label: t.teachers, icon: '👨‍🏫' }
    ];

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Animated Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4 group transition-all">
                                <svg className={`w-5 h-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'} group-hover:-translate-x-1 transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span className="font-medium">{t.backToHome}</span>
                            </Link>
                            <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 animate-fade-in">
                                {t.analyticsDashboard}
                            </h1>
                            <p className="text-gray-400 text-lg">{t.realTimeInsights}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    logout();
                                    router.push('/admin/login');
                                }}
                                className="px-4 py-2 bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-all flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                {t.logout}
                            </button>
                            <button className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                {t.export}
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 mb-8 p-1 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 w-fit">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                                    ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/50'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className="text-xl">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {hasData ? (
                        <>
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6 animate-fade-in">
                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            {
                                                title: t.totalResponses,
                                                value: summary?.total_responses || 0,
                                                icon: '📈',
                                                gradient: 'from-blue-500 to-cyan-500',
                                                bg: 'from-blue-500/20 to-cyan-500/20'
                                            },
                                            {
                                                title: t.studentResponses,
                                                value: summary?.total_student_responses || 0,
                                                icon: '🎓',
                                                gradient: 'from-purple-500 to-pink-500',
                                                bg: 'from-purple-500/20 to-pink-500/20'
                                            },
                                            {
                                                title: t.teacherResponses,
                                                value: summary?.total_teacher_responses || 0,
                                                icon: '🏫',
                                                gradient: 'from-pink-500 to-orange-500',
                                                bg: 'from-pink-500/20 to-orange-500/20'
                                            }
                                        ].map((stat, index) => (
                                            <div
                                                key={index}
                                                className="relative group"
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                <div className="absolute inset-0 bg-linear-to-r from-white/10 to-white/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                                                <div className="relative p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${stat.bg} rounded-full blur-2xl opacity-50`}></div>
                                                    <div className="relative">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <span className="text-5xl">{stat.icon}</span>
                                                            <div className={`w-12 h-12 bg-linear-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <h3 className="text-gray-400 text-sm font-medium mb-2">{stat.title}</h3>
                                                        <p className={`text-5xl font-bold bg-linear-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                                                            {stat.value}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Quick Insights Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Student Willingness */}
                                        {studentData && studentData.total_responses > 0 && (
                                            <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                                    <span className="text-2xl">😊</span>
                                                    {t.studentPlatformInterest}
                                                </h3>
                                                <div className="flex items-center justify-center h-64">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Pie
                                                                data={[
                                                                    { name: t.willingToTry, value: studentData.willingness.willing, fill: '#10b981' },
                                                                    { name: t.notSure, value: studentData.willingness.not_willing, fill: '#6b7280' }
                                                                ]}
                                                                cx="50%"
                                                                cy="50%"
                                                                labelLine={false}
                                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                                outerRadius={100}
                                                                fill="#8884d8"
                                                                dataKey="value"
                                                            >
                                                                <Cell fill="#10b981" />
                                                                <Cell fill="#6b7280" />
                                                            </Pie>
                                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        )}

                                        {/* Teacher Platform Interest */}
                                        {teacherData && teacherData.total_responses > 0 && (
                                            <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                                    <span className="text-2xl">🎉</span>
                                                    {t.teacherPlatformInterest}
                                                </h3>
                                                <div className="flex items-center justify-center h-64">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Pie
                                                                data={[
                                                                    { name: t.wouldJoin, value: teacherData.platform_interest.would_join, fill: '#8b5cf6' },
                                                                    { name: t.notInterested, value: teacherData.platform_interest.would_not_join, fill: '#6b7280' }
                                                                ]}
                                                                cx="50%"
                                                                cy="50%"
                                                                labelLine={false}
                                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                                outerRadius={100}
                                                                fill="#8884d8"
                                                                dataKey="value"
                                                            >
                                                                <Cell fill="#8b5cf6" />
                                                                <Cell fill="#6b7280" />
                                                            </Pie>
                                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Students Tab */}
                            {activeTab === 'students' && studentData && studentData.total_responses > 0 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Experience Distribution */}
                                        <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                                <span className="text-2xl">📖</span>
                                                {t.quranExperienceLevel}
                                            </h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={studentData.experience_distribution}>
                                                    <defs>
                                                        <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                    <XAxis dataKey="quran_experience" stroke="#94a3b8" />
                                                    <YAxis stroke="#94a3b8" />
                                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
                                                    <Bar dataKey="count" fill="url(#colorExp)" radius={[8, 8, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Age Distribution */}
                                        <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                                <span className="text-2xl">🎂</span>
                                                {t.ageRange}
                                            </h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={studentData.age_distribution}>
                                                    <defs>
                                                        <linearGradient id="colorAge" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0.3} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                    <XAxis dataKey="age_range" stroke="#94a3b8" />
                                                    <YAxis stroke="#94a3b8" />
                                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
                                                    <Bar dataKey="count" fill="url(#colorAge)" radius={[8, 8, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Session Length */}
                                        <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                                <span className="text-2xl">⏰</span>
                                                {t.preferredSessionLength}
                                            </h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={studentData.session_length_distribution}>
                                                    <defs>
                                                        <linearGradient id="colorSession" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                    <XAxis dataKey="preferred_session_length" stroke="#94a3b8" />
                                                    <YAxis stroke="#94a3b8" />
                                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
                                                    <Bar dataKey="count" fill="url(#colorSession)" radius={[8, 8, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Time Preferences */}
                                        <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                                <span className="text-2xl">🌅</span>
                                                {t.availableTimeSlots}
                                            </h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={studentData.time_preference_distribution}>
                                                    <defs>
                                                        <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0.3} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                    <XAxis dataKey="time_preference" stroke="#94a3b8" />
                                                    <YAxis stroke="#94a3b8" />
                                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
                                                    <Bar dataKey="count" fill="url(#colorTime)" radius={[8, 8, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Average Price Card */}
                                        <div className="p-6 bg-linear-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-6xl mb-4">💰</div>
                                                <h3 className="text-gray-300 text-lg mb-4">{t.averageExpectedPrice}</h3>
                                                <p className="text-7xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                                    {studentData.average_price.toFixed(0)}
                                                </p>
                                                <p className="text-2xl text-gray-400">{t.etbPerSession}</p>
                                            </div>
                                        </div>

                                        {/* Subject Interests */}
                                        <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all lg:col-span-2">
                                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                                <span className="text-2xl">📚</span>
                                                {t.subjectInterests}
                                            </h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={studentData.subjects_interest}>
                                                    <defs>
                                                        <linearGradient id="colorSubjects" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                    <XAxis dataKey="subject" stroke="#94a3b8" />
                                                    <YAxis stroke="#94a3b8" />
                                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
                                                    <Bar dataKey="count" fill="url(#colorSubjects)" radius={[8, 8, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Teachers Tab */}
                            {activeTab === 'teachers' && teacherData && teacherData.total_responses > 0 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Teaching Background */}
                                        <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                                <span className="text-2xl">🕌</span>
                                                {t.teachingBackground}
                                            </h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <PieChart>
                                                    <Pie
                                                        data={teacherData.teaching_background_distribution}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={({ teaching_background, percent }) => `${teaching_background}: ${(percent * 100).toFixed(0)}%`}
                                                        outerRadius={100}
                                                        fill="#8884d8"
                                                        dataKey="count"
                                                    >
                                                        {teacherData.teaching_background_distribution.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Age Distribution */}
                                        <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                                <span className="text-2xl">🎂</span>
                                                {t.ageRange}
                                            </h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={teacherData.age_distribution}>
                                                    <defs>
                                                        <linearGradient id="colorTeacherAge" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.3} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                    <XAxis dataKey="age_range" stroke="#94a3b8" />
                                                    <YAxis stroke="#94a3b8" />
                                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
                                                    <Bar dataKey="count" fill="url(#colorTeacherAge)" radius={[8, 8, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Average Metrics */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-6 bg-linear-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col items-center justify-center">
                                                <div className="text-4xl mb-3">👥</div>
                                                <h3 className="text-gray-300 text-sm mb-2 text-center">{t.avgWeeklyCapacity}</h3>
                                                <p className="text-4xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                                    {teacherData.average_students_per_week.toFixed(0)}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">{t.studentsWeek}</p>
                                            </div>

                                            <div className="p-6 bg-linear-to-br from-pink-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col items-center justify-center">
                                                <div className="text-4xl mb-3">💵</div>
                                                <h3 className="text-gray-300 text-sm mb-2 text-center">{t.avgExpectedRate}</h3>
                                                <p className="text-4xl font-bold bg-linear-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                                                    {teacherData.average_rate.toFixed(0)}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">{t.etbPerSession}</p>
                                            </div>

                                            <div className="col-span-2 p-6 bg-linear-to-br from-green-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col items-center justify-center">
                                                <div className="text-5xl mb-3">🚀</div>
                                                <h3 className="text-gray-300 text-sm mb-2">{t.earlyAccessInterest}</h3>
                                                <p className="text-5xl font-bold bg-linear-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                                                    {teacherData.early_access_interest}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">{t.teachersInterested}</p>
                                            </div>
                                        </div>

                                        {/* Teaching Topics */}
                                        <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all lg:col-span-2">
                                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                                <span className="text-2xl">📖</span>
                                                {t.teachingTopicsConfidence}
                                            </h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={teacherData.confident_topics}>
                                                    <defs>
                                                        <linearGradient id="colorTopics" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.3} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                    <XAxis dataKey="topic" stroke="#94a3b8" />
                                                    <YAxis stroke="#94a3b8" />
                                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
                                                    <Bar dataKey="count" fill="url(#colorTopics)" radius={[8, 8, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        /* No Data State */
                        <div className="p-12 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 text-center animate-fade-in">
                            <div className="w-32 h-32 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-3">{t.noDataYet}</h3>
                            <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                {t.startCollecting}
                            </p>
                            <div className="flex gap-4 justify-center flex-wrap">
                                <Link href="/student-survey" className="px-8 py-4 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all font-semibold flex items-center gap-2">
                                    <span>📚</span>
                                    {t.studentSurvey}
                                </Link>
                                <Link href="/teacher-survey" className="px-8 py-4 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all font-semibold flex items-center gap-2">
                                    <span>👨‍🏫</span>
                                    {t.teacherSurvey}
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
