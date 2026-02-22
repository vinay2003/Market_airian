import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface Vendor {
    id: string;
    businessName: string;
    email: string;
    phone: string;
    category?: string;
    city?: string;
    avatar?: string;
    logo?: string;
    description?: string;
    firstName?: string;
    lastName?: string;
    role?: 'vendor' | 'user';
    notificationPreferences?: any;
}

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
    const [vendor, setVendor] = useState<Vendor | null>(() => {
        const savedVendor = localStorage.getItem('vendor');
        return savedVendor ? JSON.parse(savedVendor) : null;
    });
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        if (accessToken) {
            // Future: verify token with /auth/me or similar endpoint
        }
    }, [accessToken]);

    const login = (newToken: string, newVendor: Vendor) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('vendor', JSON.stringify(newVendor));
        setAccessToken(newToken);
        setVendor(newVendor);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('vendor');
        setAccessToken(null);
        setVendor(null);
    };

    const updateVendor = (data: Partial<Vendor>) => {
        if (!vendor) return;
        const updatedVendor = { ...vendor, ...data };
        setVendor(updatedVendor);
        localStorage.setItem('vendor', JSON.stringify(updatedVendor));
    };

    return (
        <AuthContext.Provider
            value={{
                vendor,
                user: vendor,
                accessToken,
                isAuthenticated: !!accessToken,
                login,
                logout,
                updateVendor,
                updateUser: updateVendor
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
