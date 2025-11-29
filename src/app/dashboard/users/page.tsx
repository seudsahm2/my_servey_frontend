'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserList, type User, type UserFilterParams } from '@/lib/api';

export default function UsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(50);
    const [totalPages, setTotalPages] = useState(1);

    const [userType, setUserType] = useState<'all' | 'student' | 'teacher'>('all');
    const [filters, setFilters] = useState<UserFilterParams>({
        page: 1,
        page_size: 50
    });
    const [searchQuery, setSearchQuery] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/admin');
                return;
            }

            const data = await getUserList({ ...filters, user_type: userType, search: searchQuery, page, page_size: pageSize });
            setUsers(data.users);
            setTotal(data.total);
            setTotalPages(data.total_pages);
        } catch (error) {
            console.error('Error fetching users:', error);
            if ((error as any)?.response?.status === 401) {
                localStorage.removeItem('accessToken');
                router.push('/admin');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const handleFilterChange = (key: keyof UserFilterParams, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value || undefined }));
    };

    const applyFilters = () => {
        setPage(1);
        fetchUsers();
    };

    const clearFilters = () => {
        setFilters({ page: 1, page_size: pageSize });
        setSearchQuery('');
        setUserType('all');
        setPage(1);
        setTimeout(fetchUsers, 100);
    };

    const exportToCSV = () => {
        const csvHeaders = ['Name', 'Phone', 'Gender', 'Age Range', 'Session Length (min)', 'Frequency', 'Price (ETB)', 'Platform Interest', 'Submitted At'];
        const csvRows = users.map(user => [
            user.name,
            user.phone,
            user.gender,
            user.age_range,
            user.session_length,
            user.frequency || 'N/A',
            user.price,
            user.platform_interest ? 'Yes' : 'No',
            user.submitted_at || 'N/A'
        ]);

        const csvContent = [
            csvHeaders.join(','),
            ...csvRows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <Link href="/dashboard" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Dashboard
                            </Link>
                            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                                <span className="text-5xl">👥</span>
                                User Management
                            </h1>
                            <p className="text-gray-400 mt-2">Total Users: {total}</p>
                        </div>
                        <button
                            onClick={exportToCSV}
                            disabled={users.length === 0}
                            className="px-6 py-3 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            <span className="text-xl">📥</span>
                            Export CSV
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-2xl">🔍</span>
                            Filters
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            {/* User Type Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">User Type</label>
                                <select
                                    value={userType}
                                    onChange={(e) => setUserType(e.target.value as 'all' | 'student' | 'teacher')}
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="all">All Users</option>
                                    <option value="student">📚 Students Only</option>
                                    <option value="teacher">👨‍🏫 Teachers Only</option>
                                </select>
                            </div>

                            {/* Search */}
                            <div className="lg:col-span-1">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Search Name/Phone</label>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-all"
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                                <select
                                    value={filters.gender || ''}
                                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">All</option>
                                    <option value="male">👨 Male</option>
                                    <option value="female">👩 Female</option>
                                </select>
                            </div>

                            {/* Age Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Age Range</label>
                                <select
                                    value={filters.age_range || ''}
                                    onChange={(e) => handleFilterChange('age_range', e.target.value)}
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">All</option>
                                    <option value="8-15">8-15</option>
                                    <option value="15-24">15-24</option>
                                    <option value="24-32">24-32</option>
                                    <option value="32-40">32-40</option>
                                    <option value="40+">40+</option>
                                </select>
                            </div>

                            {/* Session Length */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Session Length</label>
                                <select
                                    value={filters.session_length || ''}
                                    onChange={(e) => handleFilterChange('session_length', e.target.value ? parseInt(e.target.value) : undefined)}
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">All</option>
                                    <option value="20">20 min</option>
                                    <option value="30">30 min</option>
                                    <option value="45">45 min</option>
                                    <option value="60">60 min</option>
                                </select>
                            </div>

                            {/* Frequency */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Frequency</label>
                                <select
                                    value={filters.frequency || ''}
                                    onChange={(e) => handleFilterChange('frequency', e.target.value)}
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">All</option>
                                    <option value="once_week">Once/week</option>
                                    <option value="twice_week">Twice/week</option>
                                    <option value="more">More often</option>
                                </select>
                            </div>

                            {/* Price Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Min Price (ETB)</label>
                                <input
                                    type="number"
                                    value={filters.min_price || ''}
                                    onChange={(e) => handleFilterChange('min_price', e.target.value ? parseFloat(e.target.value) : undefined)}
                                    placeholder="0"
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Max Price (ETB)</label>
                                <input
                                    type="number"
                                    value={filters.max_price || ''}
                                    onChange={(e) => handleFilterChange('max_price', e.target.value ? parseFloat(e.target.value) : undefined)}
                                    placeholder="1000"
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={applyFilters}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Loading...' : 'Apply Filters'}
                            </button>
                            <button
                                onClick={clearFilters}
                                className="px-6 py-3 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* User Table */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Phone</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Gender</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Age</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Session</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Frequency</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Price</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Interest</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                    Loading users...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                                                No users found matching your filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                                                <td className="px-6 py-4 text-gray-300">{user.phone}</td>
                                                <td className="px-6 py-4 text-gray-300">{user.gender === 'male' ? '👨 Male' : '👩 Female'}</td>
                                                <td className="px-6 py-4 text-gray-300">{user.age_range}</td>
                                                <td className="px-6 py-4 text-gray-300">{user.session_length} min</td>
                                                <td className="px-6 py-4 text-gray-300">{user.frequency || 'N/A'}</td>
                                                <td className="px-6 py-4 text-gray-300">{user.price} ETB</td>
                                                <td className="px-6 py-4">
                                                    {user.platform_interest ? (
                                                        <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">✅ Yes</span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">❌ No</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 bg-white/5 flex items-center justify-between border-t border-white/10">
                                <p className="text-gray-400 text-sm">
                                    Page {page} of {totalPages} ({total} total users)
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
