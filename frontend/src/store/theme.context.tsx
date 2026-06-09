import React, { createContext, useContext, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    resolvedTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme Provider for managing light/dark mode with system preference support.
 * Persists user preference to localStorage and applies theme classes.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light');
        root.classList.add('dark');
        root.style.colorScheme = 'dark';

        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', '#0a0e1a');
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ theme: 'dark', resolvedTheme: 'dark', setTheme: () => {} }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export default ThemeProvider;
