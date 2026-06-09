import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/store/auth.context';
import { useSession } from '@/hooks/use-session';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import { Mail, Calendar, Crown, LogOut, History, BarChart3, CreditCard, Settings as SettingsIcon, ChevronRight } from 'lucide-react';

export default function ProfilePage() {
    const { user, loading, signOut } = useAuth();
    const { sessions } = useSession();
    const navigate = useNavigate();

    if (loading) return <PageLoader />;

    if (!user) { navigate('/login'); return null; }

    const handleSignOut = async () => { try { await signOut(); navigate('/'); } catch (error) { console.error('Sign out failed:', error); } };
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const stats = [
        { label: 'Total Sessions', value: totalSessions, icon: History, color: 'text-primary' },
        { label: 'Completed', value: completedSessions, icon: BarChart3, color: 'text-success' },
        { label: 'Current Plan', value: 'Starter', icon: Crown, color: 'text-amber-400' },
    ];

    return (
        <div className="relative min-h-screen bg-background">
            <BackgroundBeams className="opacity-10" />
            <div className="relative z-10 mx-auto max-w-4xl space-y-6 p-6">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
                        <p className="mt-1 text-muted-foreground">Manage your account and preferences</p>
                    </div>
                    <Button variant="outline" onClick={handleSignOut} className="border-white/10 bg-white/5 hover:bg-white/10"><LogOut className="mr-2 h-4 w-4" />Sign Out</Button>
                </motion.div>

                {/* Profile Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="rounded-2xl border border-white/5 bg-card/30 p-6 backdrop-blur-sm">
                    <div className="flex items-start gap-6">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-3xl font-bold text-primary border border-primary/20">
                            {user.photoURL ? <img src={user.photoURL} alt={user.displayName || 'Profile'} className="h-20 w-20 rounded-2xl object-cover" /> : (user.displayName?.charAt(0) || user.email?.charAt(0) || 'U')}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="truncate text-2xl font-bold text-foreground">{user.displayName || 'User'}</h2>
                            <div className="mt-1 flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4 shrink-0" /><span className="truncate">{user.email}</span></div>
                            {user.metadata?.creationTime && (
                                <div className="mt-1 flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4 shrink-0" /><span>Joined {formatDate(user.metadata.creationTime)}</span></div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {stats.map((stat, i) => (
                        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                            className="rounded-2xl border border-white/5 bg-card/30 p-6 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                                </div>
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ${stat.color}`}><stat.icon className="h-5 w-5" /></div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="rounded-2xl border border-white/5 bg-card/30 p-6 backdrop-blur-sm">
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h3>
                    <div className="space-y-2">
                        {[
                            { icon: History, label: 'View Session History', desc: 'Browse your past creative sessions', onClick: () => navigate('/history'), color: 'text-primary' },
                            { icon: BarChart3, label: 'Create New Session', desc: 'Start a new AI-powered session', onClick: () => navigate('/'), color: 'text-success' },
                            { icon: CreditCard, label: 'Upgrade Plan', desc: 'Get unlimited sessions with Pro', color: 'text-amber-400', badge: 'Coming Soon' },
                            { icon: SettingsIcon, label: 'Account Settings', desc: 'Manage your preferences', color: 'text-muted-foreground', badge: 'Coming Soon' },
                        ].map((item, i) => (
                            <button key={item.label} onClick={item.onClick} disabled={!item.onClick}
                                className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60">
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 ${item.color}`}><item.icon className="h-5 w-5" /></div>
                                <div className="flex-1">
                                    <p className="font-medium text-foreground">{item.label}</p>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </div>
                                {item.badge ? <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{item.badge}</span> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Danger Zone */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="rounded-2xl border border-destructive/20 bg-card/30 p-6 backdrop-blur-sm">
                    <h3 className="mb-4 text-lg font-semibold text-destructive">Danger Zone</h3>
                    <div className="flex items-center justify-between rounded-xl bg-destructive/5 p-4">
                        <div>
                            <p className="font-medium text-foreground">Delete Account</p>
                            <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                        </div>
                        <Button variant="destructive" size="sm" disabled>Delete</Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
