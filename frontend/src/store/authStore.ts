import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    businessName: string;
    email: string;
    phone: string;
    role: 'vendor' | 'user';
    firstName?: string;
    lastName?: string;
    city?: string;
    avatar?: string;
    logo?: string;
    description?: string;
    notificationPreferences?: any;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            login: (token, user) => set({
                accessToken: token,
                user,
                isAuthenticated: true
            }),
            logout: () => {
                localStorage.removeItem('token'); // Keep for axios interceptor
                set({ user: null, accessToken: null, isAuthenticated: false });
            },
            updateUser: (data) => set((state) => ({
                user: state.user ? { ...state.user, ...data } : null
            })),
        }),
        {
            name: 'auth-storage',
        }
    )
);
