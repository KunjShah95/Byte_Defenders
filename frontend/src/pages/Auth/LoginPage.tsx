import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth.context';
import { Button } from '@/components/common/Button';
import { Brain, Chrome, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

export default function LoginPage() {
    const { signInWithGoogle, user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-background overflow-hidden">
            {/* Left Side: Visual Experience */}
            <div className="hidden md:flex md:w-1/2 relative aurora-bg items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

                {/* Floating Elements */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse-glow" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-[100px] animate-pulse-glow" />

                <div className="relative z-10 max-w-lg space-y-8 animate-float">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wider">
                            <Sparkles className="w-3 h-3" />
                            Next-Gen AI Collaboration
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                            Orchestra <br />
                            <span className="text-gradient">Studio</span>.
                        </h1>
                        <p className="text-xl text-muted-foreground/80 leading-relaxed font-light">
                            Join thousands of creators using The Orchestra Studio to refine, critique, and perfect their next big breakthrough.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-8">
                        <div className="space-y-2">
                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-sm font-semibold text-white">Secure by Default</h3>
                            <p className="text-xs text-muted-foreground">Your intellectual property is protected by enterprise-grade security.</p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-accent" />
                            </div>
                            <h3 className="text-sm font-semibold text-white">Instant Results</h3>
                            <p className="text-xs text-muted-foreground">Get structured feedback and refinements in seconds, not hours.</p>
                        </div>
                    </div>
                </div>

                {/* Decorative Bottom Bar */}
                <div className="absolute bottom-8 left-12 right-12 flex items-center justify-between text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium border-t border-white/5 pt-4">
                    <span>© 2024 The Orchestra Studio</span>
                    <span className="flex items-center gap-4">
                        <span>Privacy</span>
                        <span>Terms</span>
                        <span>Security</span>
                    </span>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
                {/* Mobile Background Elements */}
                <div className="md:hidden absolute inset-0 aurora-bg -z-10" />

                <div className="w-full max-w-[400px] space-y-10">
                    <div className="text-center md:text-left space-y-3">
                        <div className="md:hidden flex justify-center mb-6">
                            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 backdrop-blur-xl">
                                <Brain className="w-7 h-7 text-primary" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Sign In
                        </h2>
                        <p className="text-muted-foreground">
                            Welcome back. Please enter your details.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <Button
                                variant="outline"
                                className="w-full h-14 text-base border-border/50 bg-secondary/30 hover:bg-secondary/50 hover:border-primary/50 transition-all duration-500 group relative overflow-hidden flex items-center justify-center gap-3"
                                onClick={handleGoogleLogin}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Chrome className="w-5 h-5 transition-transform group-hover:scale-110" />
                                <span>Continue with Google</span>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </Button>
                        </div>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/30" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-muted-foreground">
                                <span className="bg-background px-4">Secure Authentication</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-center text-xs text-muted-foreground leading-relaxed">
                                Don't have an account?{' '}
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="text-primary font-semibold hover:underline underline-offset-4 transition-all"
                                >
                                    Sign up for free
                                </button>
                            </p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border/30">
                        <div className="p-4 rounded-2xl bg-secondary/20 border border-border/50 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-foreground">Creator Spotlight</h4>
                                <p className="text-xs text-muted-foreground">"The collaboration between agents is mind-blowing."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

