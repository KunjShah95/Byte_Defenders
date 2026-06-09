import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/store/auth.context';
import { FloatingDock } from '@/components/aceternity/FloatingDock';
import { Button } from '@/components/common/Button';
import { PageTransition } from '@/components/common/PageTransition';
import {
  LogOut, User, ChevronDown, 
  Home, Sparkles, History, BarChart3, Menu, X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  React.useEffect(() => {
    const routeTitles: Record<string, string> = {
      '/': 'The Orchestra Studio | Next-Gen AI Spec Orchestration',
      '/features': 'Features | The Orchestra Studio',
      '/pricing': 'Pricing & Plans | The Orchestra Studio',
      '/about': 'About Us | The Orchestra Studio',
      '/blog': 'Blog & Dispatches | The Orchestra Studio',
      '/docs': 'Documentation | The Orchestra Studio',
      '/contact': 'Contact Us | The Orchestra Studio',
      '/create': 'New Session | The Orchestra Studio',
      '/history': 'Session History | The Orchestra Studio',
      '/audit': 'Audit Dashboard | The Orchestra Studio',
      '/login': 'Sign In | The Orchestra Studio',
      '/signup': 'Get Started | The Orchestra Studio',
    };

    let title = routeTitles[location.pathname];
    if (!title) {
      if (location.pathname.startsWith('/dashboard/')) {
        title = 'Session Dashboard | The Orchestra Studio';
      } else {
        title = 'The Orchestra Studio';
      }
    }
    document.title = title;
  }, [location.pathname]);

  const dockItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Home', href: '/' },
    { icon: <Sparkles className="h-5 w-5" />, label: 'New Session', href: '/create' },
    { icon: <History className="h-5 w-5" />, label: 'History', href: '/history' },
    { icon: <BarChart3 className="h-5 w-5" />, label: 'Audit', href: '/audit' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (isAuthPage) {
    return <main>{children}</main>;
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-white">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <span className="text-xs font-bold text-black">O</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                The Orchestra <span className="text-gradient">Studio</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { path: '/features', label: 'Features' },
                { path: '/pricing', label: 'Pricing' },
                { path: '/about', label: 'About' },
                { path: '/blog', label: 'Blog' },
                { path: '/docs', label: 'Docs' },
                { path: '/contact', label: 'Contact' },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200',
                    location.pathname === item.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-9 w-20 shimmer-line rounded-lg" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-white/5 transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-accent/30 text-primary text-sm font-medium">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-foreground max-w-[120px] truncate">
                      {user.displayName || user.email}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-white/10 bg-card/95 backdrop-blur-xl">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-foreground">{user.displayName || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/history')} className="cursor-pointer">
                    <History className="mr-2 h-4 w-4" />
                    My Sessions
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="text-sm">
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate('/signup')} className="bg-primary hover:bg-primary/90 text-sm">
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-card/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-1">
              {[
                { path: '/features', label: 'Features' },
                { path: '/pricing', label: 'Pricing' },
                { path: '/about', label: 'About' },
                { path: '/blog', label: 'Blog' },
                { path: '/docs', label: 'Docs' },
                { path: '/contact', label: 'Contact' },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-2.5 text-sm font-medium rounded-lg transition-all',
                    location.pathname === item.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="relative">
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Floating Dock - only show on authenticated pages */}
      {user && !isLandingPage && !isAuthPage && (
        <FloatingDock items={dockItems} />
      )}
    </div>
  );
}
