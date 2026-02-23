import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_MEASUREMENT_ID = 'G-6V6V4N23GF';

export const GoogleAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        // Only run in production
        if (import.meta.env.MODE !== 'production') return;

        const loadGA = () => {
            try {
                // Check if already loaded
                if (typeof window.gtag === 'function') return;

                const script = document.createElement('script');
                script.async = true;
                script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

                script.onerror = () => {
                    console.warn('Google Analytics failed to load (likely blocked by client)');
                };

                document.head.appendChild(script);

                window.dataLayer = window.dataLayer || [];
                window.gtag = function () {
                    window.dataLayer.push(arguments);
                };
                window.gtag('js', new Date());
                window.gtag('config', GA_MEASUREMENT_ID);
            } catch (error) {
                console.error('Error initializing Google Analytics:', error);
            }
        };

        loadGA();
    }, []);

    useEffect(() => {
        if (window.gtag) {
            window.gtag('config', GA_MEASUREMENT_ID, {
                page_path: location.pathname + location.search,
            });
        }
    }, [location]);

    return null;
};

// Add type definition for global window object
declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}
