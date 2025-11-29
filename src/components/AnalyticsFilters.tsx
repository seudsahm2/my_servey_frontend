'use client';

import { useState } from 'react';
import type { FilterParams } from '@/lib/api';

interface AnalyticsFiltersProps {
    onFilterChange: (filters: FilterParams) => void;
    loading?: boolean;
}

export default function AnalyticsFilters({ onFilterChange, loading }: AnalyticsFiltersProps) {
    const [filters, setFilters] = useState<FilterParams>({});

    const handleFilterUpdate = (key: keyof FilterParams, value: any) => {
        const newFilters = { ...filters, [key]: value || undefined };
        setFilters(newFilters);
    };

    const applyFilters = () => {
        onFilterChange(filters);
    };

    const clearFilters = () => {
        setFilters({});
        onFilterChange({});
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-2xl">🔍</span>
                    Advanced Filters
                </h3>
                <button
                    onClick={clearFilters}
                    disabled={loading}
                    className="px-4 py-2 text-sm bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
                >
                    Clear All
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Gender Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                    <select
                        value={filters.gender || ''}
                        onChange={(e) => handleFilterUpdate('gender', e.target.value)}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-all"
                    >
                        <option value="">All</option>
                        <option value="male">👨 Male</option>
                        <option value="female">👩 Female</option>
                    </select>
                </div>

                {/* Age Range Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Age Range</label>
                    <select
                        value={filters.age_range || ''}
                        onChange={(e) => handleFilterUpdate('age_range', e.target.value)}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-all"
                    >
                        <option value="">All</option>
                        <option value="8-15">8-15</option>
                        <option value="15-24">15-24</option>
                        <option value="24-32">24-32</option>
                        <option value="32-40">32-40</option>
                        <option value="40+">40+</option>
                    </select>
                </div>

                {/* Session Length Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Session Length</label>
                    <select
                        value={filters.session_length || ''}
                        onChange={(e) => handleFilterUpdate('session_length', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-all"
                    >
                        <option value="">All</option>
                        <option value="20">20 min</option>
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">60 min</option>
                    </select>
                </div>

                {/* Frequency Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Frequency</label>
                    <select
                        value={filters.frequency || ''}
                        onChange={(e) => handleFilterUpdate('frequency', e.target.value)}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-all"
                    >
                        <option value="">All</option>
                        <option value="once_week">Once/week</option>
                        <option value="twice_week">Twice/week</option>
                        <option value="more">More often</option>
                    </select>
                </div>

                {/* Min Price Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Min Price (ETB)</label>
                    <input
                        type="number"
                        value={filters.min_price || ''}
                        onChange={(e) => handleFilterUpdate('min_price', e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="0"
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-all"
                    />
                </div>

                {/* Max Price Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Price (ETB)</label>
                    <input
                        type="number"
                        value={filters.max_price || ''}
                        onChange={(e) => handleFilterUpdate('max_price', e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="1000"
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-all"
                    />
                </div>

                {/* Platform Interest Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Platform Interest</label>
                    <select
                        value={filters.platform_interest || ''}
                        onChange={(e) => handleFilterUpdate('platform_interest', e.target.value)}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-all"
                    >
                        <option value="">All</option>
                        <option value="willing">✅ Willing</option>
                        <option value="not_willing">❌ Not Willing</option>
                    </select>
                </div>
            </div>

            <button
                onClick={applyFilters}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Loading...
                    </>
                ) : (
                    <>
                        <span className="text-xl">📊</span>
                        Apply Filters
                    </>
                )}
            </button>
        </div>
    );
}
