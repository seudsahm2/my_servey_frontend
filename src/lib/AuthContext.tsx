'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from './api';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (tokens: { access: string; refresh: string }) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        if (typeof window === 'undefined') {
            return false;
        }
        const token = localStorage.getItem('accessToken');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return true;
        }
        delete api.defaults.headers.common['Authorization'];
        return false;
    });
    const loading = false;
    const router = useRouter();

    const login = (tokens: { access: string; refresh: string }) => {
        localStorage.setItem('accessToken', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);
        api.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
        setIsAuthenticated(true);
        router.push('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete api.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
        router.push('/admin/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
