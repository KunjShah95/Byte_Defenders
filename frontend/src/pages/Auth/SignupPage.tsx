import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth.context';
import { Button } from '@/components/common/Button';
import { Brain, Chrome, ArrowRight, Sparkles, CheckCircle, Rocket, Layers, BarChart } from 'lucide-react';

export default function SignupPage() {
    const { signInWithGoogle, user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);

    const handleGoogleSignup = async () => {
        try {
            setIsLoading(true);
            await signInWithGoogle();
        } catch (error) {
            console.error('Signup failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        { icon: Rocket, text: "5 free AI sessions per month", color: "text-primary" },
        { icon: Layers, text: "Access to 4 specialized agents", color: "text-accent" },
        { icon: BarChart, text: "Advanced analytics & history", color: "text-primary" },
    ];

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-background overflow-hidden font-sans">
            {/* Left Side: Brand Experience */}
            <div className="hidden md:flex md:w-1/2 relative mesh-gradient items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

                {/* Dynamic Shapes */}
                <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-accent/20 rounded-full blur-[100px] animate-pulse-slow animation-delay-2000" />

                <div className="relative z-10 max-w-lg space-y-12 animate-float">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wider">
                            <Rocket className="w-3 h-3" />
                            Accelerate Your Creativity
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                            Orchestra <br />
                            <span className="text-gradient">Studio</span>.
                        </h1>
                        <p className="text-xl text-muted-foreground/80 leading-relaxed font-light">
                            Experience the power of multi-agent collaboration. One prompt, infinite possibilities, refined by experts.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {features.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all duration-300">
                                    <item.icon className={`w-6 h-6 ${item.color}`} />
                                </div>
                                <span className="text-lg font-medium text-white/90">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold">
                                    <img src={`https://i.pravatar.cc/40?u=${i}`} className="w-full h-full rounded-full" alt="User" />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-white/60">Joined by 2,000+ visionaries</p>
                    </div>
                </div>

                {/* Footer Credits */}
                <div className="absolute bottom-8 left-12 right-12 flex items-center justify-between text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium border-t border-white/5 pt-4">
                    <span>The Orchestra Studio</span>
                    <div className="flex gap-6">
                        <span>Changelog</span>
                        <span>Community</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Signup Interface */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
                {/* Mobile Gradient */}
                <div className="md:hidden absolute inset-0 mesh-gradient -z-10" />

                <div className="w-full max-w-[420px] space-y-10 animate-in slide-in-from-bottom-4 duration-1000">
                    <div className="text-center md:text-left space-y-3">
                        <div className="md:hidden flex justify-center mb-6">
                            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 backdrop-blur-xl">
                                <Brain className="w-7 h-7 text-primary" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Create Account
                        </h2>
                        <p className="text-muted-foreground">
                            Start your free 14-day trial. No card needed.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <Button
                                variant="outline"
                                className="w-full h-14 text-base border-border/50 bg-secondary/30 hover:bg-secondary/50 hover:border-primary/50 transition-all duration-500 group relative overflow-hidden flex items-center justify-center gap-3"
                                onClick={handleGoogleSignup}
                                disabled={isLoading}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Chrome className="w-5 h-5 transition-transform group-hover:scale-110" />
                                <span>{isLoading ? "Connecting..." : "Continue with Google"}</span>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </Button>
                        </div>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/30" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-muted-foreground">
                                <span className="bg-background px-4">Instant Onboarding</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-4 rounded-2xl bg-secondary/10 border border-border/30 flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Unlimited Agent Interaction</p>
                                        <p className="text-xs text-muted-foreground">Chat, refine, and iterate without limits during trial.</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-center text-xs text-muted-foreground leading-relaxed">
                                Already have an account?{' '}
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-primary font-semibold hover:underline underline-offset-4 transition-all"
                                >
                                    Log in instead
                                </button>
                            </p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border/30">
                        <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest leading-loose">
                            Protected by industry-leading security standards. <br />
                            Your data remains yours. Always.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

