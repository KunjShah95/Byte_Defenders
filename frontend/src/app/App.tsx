import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SessionProvider } from '@/store/session.context';
import { AuthProvider, useAuth } from '@/store/auth.context';
import { ThemeProvider } from '@/store/theme.context';

import { Layout } from './Layout';
import { AppRoutes } from './routes';

import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { CommandPalette } from '@/components/common/CommandPalette';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { OnboardingModal } from '@/components/common/OnboardingModal';
import { RouteAnalytics } from '@/components/common/RouteAnalytics';

import { analytics } from '@/services/analytics';

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
