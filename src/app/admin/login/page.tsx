'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { loginUser } from '@/lib/api';
import { Lock, User, AlertCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

type AdminLoginForm = {
    username: string;
    password: string;
};

export default function AdminLogin() {
    const { t, language } = useLanguage();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const { register, handleSubmit } = useForm<AdminLoginForm>();

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const onSubmit = async (data: AdminLoginForm) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await loginUser(data);
            // Add a small delay for the success animation
            await new Promise(resolve => setTimeout(resolve, 800));
            login(response);
        } catch {
            setError(t.loginError);
        } finally {
            setIsLoading(false);
        }
    };

    const isRTL = language === 'ar';

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#050505]" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

                {/* Animated Orbs */}
                <motion.div
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        x: [0, -50, 0],
                        y: [0, -30, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-500/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -50, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[100px]"
                />
            </div>

            {/* Mouse Follower Effect */}
            <div
                className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.05), transparent 80%)`
                }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-40"
            >
                {/* Glass Card */}
                <div className="relative group">
                    {/* Gradient Border Effect */}
                    <div className="absolute -inset-0.5 bg-linear-to-r from-emerald-500 to-teal-500 rounded-3xl opacity-30 group-hover:opacity-50 blur transition duration-1000"></div>

                    <div className="relative p-8 md:p-10 bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                                className="w-20 h-20 bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 relative group-hover:scale-105 transition-transform duration-300"
                            >
                                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <ShieldCheck className="w-10 h-10 text-white relative z-10" />
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                    <Sparkles className="w-3 h-3 text-emerald-600" />
                                </div>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white via-emerald-100 to-white/80 mb-2"
                            >
                                {t.adminLogin}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-white/40 text-sm font-medium tracking-wide uppercase"
                            >
                                {t.brandName}
                            </motion.p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                        className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400 text-sm overflow-hidden"
                                    >
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <p className="font-medium">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-2 group/input"
                            >
                                <label className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wider ml-1 group-focus-within/input:text-emerald-400 transition-colors">
                                    {t.username}
                                </label>
                                <div className="relative">
                                    <User className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within/input:text-emerald-400 transition-colors duration-300 ${isRTL ? 'right-4' : 'left-4'}`} />
                                    <input
                                        {...register('username', { required: true })}
                                        type="text"
                                        className={`w-full bg-white/5 border border-white/10 rounded-xl py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
                                        placeholder={t.username}
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="space-y-2 group/input"
                            >
                                <label className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wider ml-1 group-focus-within/input:text-emerald-400 transition-colors">
                                    {t.password}
                                </label>
                                <div className="relative">
                                    <Lock className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within/input:text-emerald-400 transition-colors duration-300 ${isRTL ? 'right-4' : 'left-4'}`} />
                                    <input
                                        {...register('password', { required: true })}
                                        type="password"
                                        className={`w-full bg-white/5 border border-white/10 rounded-xl py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
                                        placeholder={t.password}
                                    />
                                </div>
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)" }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:via-teal-400 hover:to-emerald-500 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                                        <span className="relative z-10">{t.submitting}</span>
                                    </>
                                ) : (
                                    <span className="relative z-10 flex items-center gap-2">
                                        {t.login}
                                        <ShieldCheck className="w-5 h-5" />
                                    </span>
                                )}
                            </motion.button>
                        </form>
                    </div>
                </div>

                {/* Footer Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-center"
                >
                    <p className="text-white/20 text-xs">
                        &copy; {new Date().getFullYear()} {t.brandName}. {t.secureAccess}
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
