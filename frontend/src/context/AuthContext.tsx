import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/store/authStore';

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

type Vendor = User;

interface AuthContextType {
    vendor: Vendor | null;
    user: Vendor | null; // Alias for vendor
    accessToken: string | null;
    isAuthenticated: boolean;
    login: (token: string, vendor: Vendor) => void;
    logout: () => void;
    updateVendor: (data: Partial<Vendor>) => void;
    updateUser: (data: Partial<Vendor>) => void; // Alias for updateVendor
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { user, accessToken, isAuthenticated, login, logout, updateUser } = useAuthStore();

    useEffect(() => {
        // Keep localStorage in sync for axios interceptor in api.ts
        if (accessToken) {
            localStorage.setItem('token', accessToken);
        } else {
            localStorage.removeItem('token');
        }

        if (user) {
            localStorage.setItem('vendor', JSON.stringify(user));
        } else {
            localStorage.removeItem('vendor');
        }
    }, [accessToken, user]);

    return (
        <AuthContext.Provider
            value={{
                vendor: user,
                user,
                accessToken,
                isAuthenticated,
                login,
                logout,
                updateVendor: updateUser,
                updateUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
