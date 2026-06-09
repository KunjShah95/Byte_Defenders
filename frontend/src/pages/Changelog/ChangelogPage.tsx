import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/common/Card';
import { Sparkles, Bug, Zap, Shield, ArrowLeft, Tag } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';

interface ChangelogEntry {
    version: string;
    date: string;
    type: 'major' | 'minor' | 'patch';
    changes: { type: 'feature' | 'fix' | 'improvement' | 'security'; title: string; description?: string }[];
}

const CHANGELOG: ChangelogEntry[] = [
    { version: '1.2.0', date: 'December 20, 2024', type: 'minor', changes: [
        { type: 'feature', title: 'Command Palette (Cmd+K)', description: 'Quick access to all features' },
        { type: 'feature', title: 'Settings Page', description: 'Manage notifications, privacy, and preferences' },
        { type: 'feature', title: 'Light/Dark Theme Toggle', description: 'Switch between themes' },
        { type: 'feature', title: 'Razorpay Integration', description: 'Accept payments in INR' },
        { type: 'improvement', title: 'Offline Support', description: 'Banner when network is unavailable' },
        { type: 'improvement', title: 'Onboarding Flow', description: 'Guided tour for first-time users' },
    ]},
    { version: '1.1.0', date: 'December 15, 2024', type: 'minor', changes: [
        { type: 'feature', title: 'Firebase Authentication', description: 'Sign up and login with email or Google' },
        { type: 'feature', title: 'Session History', description: 'View past brainstorming sessions' },
        { type: 'feature', title: 'Explainability View', description: 'Detailed agent reasoning breakdown' },
        { type: 'fix', title: 'Mobile Navigation', description: 'Fixed hamburger menu issues' },
    ]},
    { version: '1.0.0', date: 'December 1, 2024', type: 'major', changes: [
        { type: 'feature', title: 'Initial Release', description: 'Public launch' },
        { type: 'feature', title: 'Four Specialized Agents', description: 'Idea, Critic, Refiner, Presenter' },
        { type: 'feature', title: 'Real-time Execution', description: 'Watch agents collaborate in real-time' },
        { type: 'security', title: 'End-to-End Encryption', description: 'Data encrypted at rest and in transit' },
    ]},
];

const CHANGE_ICONS = { feature: Sparkles, fix: Bug, improvement: Zap, security: Shield };
const CHANGE_COLORS = { feature: 'text-primary bg-primary/10', fix: 'text-amber-400 bg-amber-400/10', improvement: 'text-emerald-400 bg-emerald-400/10', security: 'text-blue-400 bg-blue-400/10' };

export default function ChangelogPage() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-background py-16 lg:py-24">
            <div className="container mx-auto max-w-3xl px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />Back
                    </Button>
                    <div className="flex items-center gap-3 mb-2">
                        <Tag className="h-6 w-6 text-primary" />
                        <h1 className="text-3xl font-bold text-foreground">Changelog</h1>
                    </div>
                    <p className="text-muted-foreground">All notable changes are documented here.</p>
                </motion.div>

                <div className="space-y-6">
                    {CHANGELOG.map((entry, i) => (
                        <motion.div key={entry.version} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            className="rounded-2xl border border-white/5 bg-card/30 p-8 backdrop-blur-sm transition-all duration-500 hover:border-primary/20">
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className={`rounded-lg px-3 py-1 text-sm font-mono font-bold ${entry.type === 'major' ? 'bg-primary/20 text-primary' : entry.type === 'minor' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-muted-foreground'}`}>
                                        v{entry.version}
                                    </span>
                                    {entry.type === 'major' && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Major Release</span>}
                                </div>
                                <span className="text-sm text-muted-foreground">{entry.date}</span>
                            </div>
                            <div className="space-y-3">
                                {entry.changes.map((change, j) => {
                                    const Icon = CHANGE_ICONS[change.type];
                                    const colorClass = CHANGE_COLORS[change.type];
                                    return (
                                        <div key={j} className="flex items-start gap-3">
                                            <div className={`rounded-lg p-1.5 ${colorClass}`}><Icon className="h-4 w-4" /></div>
                                            <div>
                                                <p className="font-medium text-foreground">{change.title}</p>
                                                {change.description && <p className="text-sm text-muted-foreground">{change.description}</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.03] to-transparent p-8 text-center">
                    <h3 className="mb-2 font-semibold text-foreground">Stay Updated</h3>
                    <p className="mb-4 text-sm text-muted-foreground">Get notified when we release new features.</p>
                    <Button onClick={() => navigate('/blog')} className="bg-primary hover:bg-primary/90">Subscribe to Newsletter</Button>
                </div>
            </div>
        </div>
    );
}
