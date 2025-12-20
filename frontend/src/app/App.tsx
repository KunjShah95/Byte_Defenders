import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Providers
import { SessionProvider } from '@/store/session.context';
import { AuthProvider, useAuth } from '@/store/auth.context';
import { ThemeProvider } from '@/store/theme.context';

// Layout & Routes
import { Layout } from './Layout';
import { AppRoutes } from './routes';

// Global Components
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { CommandPalette } from '@/components/common/CommandPalette';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { OnboardingModal } from '@/components/common/OnboardingModal';
import { RouteAnalytics } from '@/components/common/RouteAnalytics';

// Analytics
import { analytics } from '@/services/analytics';

// Initialize analytics
analytics.init({
  enabled: import.meta.env.PROD,
  debug: import.meta.env.DEV,
  googleAnalyticsId: import.meta.env.VITE_GA_ID,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Inner App component that uses auth context for Command Palette
 */
function AppInner() {
  const { signOut } = useAuth();

  return (
    <BrowserRouter>
      <RouteAnalytics />
      <Layout>
        <AppRoutes />
      </Layout>
      <CommandPalette onSignOut={signOut} />
      <OnboardingModal />
      <OfflineBanner />
    </BrowserRouter>
  );
}

/**
 * Main App component with all providers and global features
 * 
 * Architecture:
 * - ErrorBoundary: Catches and reports JavaScript errors
 * - ThemeProvider: Light/Dark mode with system preference support
 * - QueryClientProvider: React Query for data fetching
 * - AuthProvider: Firebase authentication context
 * - SessionProvider: Session management context
 * - TooltipProvider: Shadcn UI tooltips
 * 
 * Global Features:
 * - Command Palette (Cmd+K)
 * - Offline Banner
 * - Onboarding Modal (first-time users)
 * - Route Analytics
 * - Error Boundary with fallback
 */
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SessionProvider>
              <TooltipProvider>
                <AppInner />
                <Toaster />
              </TooltipProvider>
            </SessionProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
