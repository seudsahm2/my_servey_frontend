// Loading skeleton component for better perceived performance
'use client';

export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Header Skeleton */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 animate-pulse">
                    <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-4 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>

                {/* Content Skeleton */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 animate-pulse">
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                        <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                    </div>

                    <div className="h-12 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-xl mt-6"></div>
                </div>
            </div>
        </div>
    );
}
