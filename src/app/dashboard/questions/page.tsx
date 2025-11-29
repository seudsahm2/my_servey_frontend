'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface SurveyQuestion {
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

export default function QuestionsPage() {
    const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<'student' | 'teacher'>('student');
    const [editingQuestion, setEditingQuestion] = useState<SurveyQuestion | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const [formData, setFormData] = useState<Partial<SurveyQuestion>>({
        survey_type: 'student',
        question_type: 'choice',
        options_en: [],
        options_ar: [],
        is_active: true,
        order: 0
    });

    useEffect(() => {
        fetchQuestions();
    }, [filterType]);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/questions/?survey_type=${filterType}`);
            const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
            setQuestions(data);
        } catch (error) {
            console.error('Failed to fetch questions:', error);
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        if (!confirm(`Reset ${filterType} questions to defaults? This will delete all custom questions.`)) return;
        try {
            await axios.post('http://localhost:8000/api/questions/reset/', { survey_type: filterType });
            fetchQuestions();
        } catch (error) {
            console.error('Failed to reset questions:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this question?')) return;
        try {
            await axios.delete(`http://localhost:8000/api/questions/${id}/`);
            fetchQuestions();
        } catch (error) {
            console.error('Failed to delete question:', error);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dataToSave = {
                ...formData,
                survey_type: filterType,
                options_en: Array.isArray(formData.options_en) ? formData.options_en : [],
                options_ar: Array.isArray(formData.options_ar) ? formData.options_ar : []
            };

            if (editingQuestion) {
                await axios.patch(`http://localhost:8000/api/questions/${editingQuestion.id}/`, dataToSave);
            } else {
                await axios.post('http://localhost:8000/api/questions/', dataToSave);
            }

            setEditingQuestion(null);
            setIsCreating(false);
            setFormData({ survey_type: filterType, question_type: 'choice', options_en: [], options_ar: [], is_active: true, order: 0 });
            fetchQuestions();
        } catch (error) {
            console.error('Failed to save question:', error);
        }
    };

    const startEdit = (q: SurveyQuestion) => {
        setEditingQuestion(q);
        setFormData(q);
        setIsCreating(false);
    };

    const startCreate = () => {
        setEditingQuestion(null);
        setIsCreating(true);
        setFormData({
            survey_type: filterType,
            section: '',
            identifier: '',
            text_en: '',
            text_ar: '',
            question_type: 'choice',
            options_en: [],
            options_ar: [],
            order: questions.length + 1,
            is_active: true
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 sm:mb-12">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4 sm:mb-6 transition-all duration-300 hover:translate-x-1 group"
                        >
                            <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </Link>

                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                        Question Management
                                    </h1>
                                    <p className="text-gray-600 text-sm sm:text-base flex items-center gap-2">
                                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        Manage your dynamic survey questions
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-semibold shadow-lg">
                                        {questions.length} Questions
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="mb-6 sm:mb-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base">Survey Type:</label>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value as 'student' | 'teacher')}
                                    className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 font-medium text-sm sm:text-base"
                                >
                                    <option value="student">🎓 Student Survey</option>
                                    <option value="teacher">👨‍🏫 Teacher Survey</option>
                                </select>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={handleReset}
                                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                                >
                                    🔄 Reset Defaults
                                </button>
                                <button
                                    onClick={startCreate}
                                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                                >
                                    ✨ Add Question
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Editor Form */}
                    {(isCreating || editingQuestion) && (
                        <div className="mb-6 sm:mb-8 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border-2 border-indigo-200 animate-fadeIn">
                            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                                {isCreating ? '✨ Add New Question' : '✏️ Edit Question'}
                            </h2>
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Section</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                                            value={formData.section || ''}
                                            onChange={e => setFormData({ ...formData, section: e.target.value })}
                                            placeholder="e.g., Quran Reading"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Identifier (Unique ID)</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                                            value={formData.identifier || ''}
                                            onChange={e => setFormData({ ...formData, identifier: e.target.value })}
                                            placeholder="e.g., quran_goal"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Question Text (English)</label>
                                        <textarea
                                            required
                                            rows={3}
                                            className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none text-sm sm:text-base"
                                            value={formData.text_en || ''}
                                            onChange={e => setFormData({ ...formData, text_en: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Question Text (Arabic)</label>
                                        <textarea
                                            required
                                            rows={3}
                                            className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none text-right text-sm sm:text-base"
                                            dir="rtl"
                                            value={formData.text_ar || ''}
                                            onChange={e => setFormData({ ...formData, text_ar: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Type</label>
                                        <select
                                            className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                                            value={formData.question_type}
                                            onChange={e => setFormData({ ...formData, question_type: e.target.value as 'choice' | 'text' })}
                                        >
                                            <option value="choice">Multiple Choice</option>
                                            <option value="text">Text Input</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Order</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                                            value={formData.order || 0}
                                            onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-center pt-6">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                                                checked={formData.is_active}
                                                onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                            />
                                            <span className="font-semibold text-gray-700">Active</span>
                                        </label>
                                    </div>
                                </div>

                                {formData.question_type === 'choice' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">Options (English) - Comma separated</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                                                value={formData.options_en?.join(',') || ''}
                                                onChange={e => setFormData({ ...formData, options_en: e.target.value.split(',').map(s => s.trim()) })}
                                                placeholder="Option 1, Option 2, Option 3"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">Options (Arabic) - Comma separated</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-right text-sm sm:text-base"
                                                dir="rtl"
                                                value={formData.options_ar?.join(',') || ''}
                                                onChange={e => setFormData({ ...formData, options_ar: e.target.value.split(',').map(s => s.trim()) })}
                                                placeholder="خيار 1, خيار 2, خيار 3"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => { setIsCreating(false); setEditingQuestion(null); }}
                                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 text-sm sm:text-base"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                                    >
                                        💾 Save Question
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Questions List - Mobile: Cards, Desktop: Table */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-12 text-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
                                <p className="text-gray-600 font-semibold">Loading questions...</p>
                            </div>
                        ) : questions.length === 0 ? (
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-12 text-center">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">No Questions Yet</h3>
                                <p className="text-gray-500 mb-6">Click "Reset Defaults" to load default questions or "Add Question" to create new ones.</p>
                                <button
                                    onClick={handleReset}
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                                >
                                    🔄 Load Defaults
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Mobile Cards */}
                                <div className="block lg:hidden space-y-4">
                                    {questions.map((q) => (
                                        <div
                                            key={q.id}
                                            className={`bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-4 sm:p-6 border-2 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${!q.is_active ? 'border-gray-300 opacity-60' : 'border-indigo-200'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-xs font-bold">
                                                        #{q.order}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${q.question_type === 'choice'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {q.question_type === 'choice' ? '☑️ Choice' : '✍️ Text'}
                                                    </span>
                                                </div>
                                                {!q.is_active && (
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                                                        Inactive
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 mb-1">SECTION</p>
                                                    <p className="font-bold text-indigo-600">{q.section}</p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 mb-1">ID</p>
                                                    <p className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                                                        {q.identifier}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 mb-1">QUESTION</p>
                                                    <p className="text-sm text-gray-800">{q.text_en}</p>
                                                </div>

                                                {q.question_type === 'choice' && q.options_en.length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-500 mb-2">OPTIONS</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {q.options_en.map((opt, idx) => (
                                                                <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
                                                                    {opt}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                                                <button
                                                    onClick={() => startEdit(q)}
                                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(q.id)}
                                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table */}
                                <div className="hidden lg:block bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gradient-to-r from-indigo-500 to-purple-500">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">#</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Section</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">ID</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Question (EN)</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Type</th>
                                                    <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {questions.map((q, index) => (
                                                    <tr
                                                        key={q.id}
                                                        className={`transition-all duration-300 hover:bg-indigo-50 ${!q.is_active ? 'bg-gray-50 opacity-60' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                                            }`}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-xs font-bold">
                                                                {q.order}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="font-bold text-indigo-600">{q.section}</span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-700">
                                                                {q.identifier}
                                                            </code>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="max-w-md">
                                                                <p className="text-sm text-gray-800 line-clamp-2">{q.text_en}</p>
                                                                {q.question_type === 'choice' && q.options_en.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                                        {q.options_en.slice(0, 3).map((opt, idx) => (
                                                                            <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">
                                                                                {opt}
                                                                            </span>
                                                                        ))}
                                                                        {q.options_en.length > 3 && (
                                                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                                                                +{q.options_en.length - 3} more
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${q.question_type === 'choice'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-blue-100 text-blue-700'
                                                                }`}>
                                                                {q.question_type === 'choice' ? '☑️ Choice' : '✍️ Text'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => startEdit(q)}
                                                                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(q.id)}
                                                                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}
