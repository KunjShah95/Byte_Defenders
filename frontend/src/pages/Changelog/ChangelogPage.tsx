import React from 'react';
import { Card, CardContent } from '@/components/common/Card';
import {
    Sparkles,
    Bug,
    Zap,
    Shield,
    ArrowLeft,
    Tag
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';

interface ChangelogEntry {
    version: string;
    date: string;
    type: 'major' | 'minor' | 'patch';
    changes: {
        type: 'feature' | 'fix' | 'improvement' | 'security';
        title: string;
        description?: string;
    }[];
}

const CHANGELOG: ChangelogEntry[] = [
    {
        version: '1.2.0',
        date: 'December 20, 2024',
        type: 'minor',
        changes: [
            {
                type: 'feature',
                title: 'Command Palette (Cmd+K)',
                description: 'Quick access to all features through keyboard shortcuts',
            },
            {
                type: 'feature',
                title: 'Settings Page',
                description: 'Manage notifications, privacy, and preferences',
            },
            {
                type: 'feature',
                title: 'Light/Dark Theme Toggle',
                description: 'Switch between light, dark, and system themes',
            },
            {
                type: 'feature',
                title: 'Razorpay Integration',
                description: 'Accept payments in INR via UPI, cards, and more',
            },
            {
                type: 'improvement',
                title: 'Offline Support',
                description: 'Banner notification when network is unavailable',
            },
            {
                type: 'improvement',
                title: 'Onboarding Flow',
                description: 'Guided tour for first-time users',
            },
        ],
    },
    {
        version: '1.1.0',
        date: 'December 15, 2024',
        type: 'minor',
        changes: [
            {
                type: 'feature',
                title: 'Firebase Authentication',
                description: 'Sign up and login with email or Google',
            },
            {
                type: 'feature',
                title: 'Session History',
                description: 'View and manage past brainstorming sessions',
            },
            {
                type: 'feature',
                title: 'Explainability View',
                description: 'Detailed breakdown of each agent\'s reasoning',
            },
            {
                type: 'fix',
                title: 'Mobile Navigation',
                description: 'Fixed hamburger menu not closing on navigation',
            },
        ],
    },
    {
        version: '1.0.0',
        date: 'December 1, 2024',
        type: 'major',
        changes: [
            {
                type: 'feature',
                title: 'Initial Release',
                description: 'The Orchestra Studio public launch',
            },
            {
                type: 'feature',
                title: 'Four Specialized Agents',
                description: 'Idea, Critic, Refiner, and Presenter agents',
            },
            {
                type: 'feature',
                title: 'Real-time Execution',
                description: 'Watch agents collaborate in real-time',
            },
            {
                type: 'security',
                title: 'End-to-End Encryption',
                description: 'All session data encrypted at rest and in transit',
            },
        ],
    },
];

const CHANGE_ICONS = {
    feature: Sparkles,
    fix: Bug,
    improvement: Zap,
    security: Shield,
};

const CHANGE_COLORS = {
    feature: 'text-primary bg-primary/10',
    fix: 'text-amber-400 bg-amber-400/10',
    improvement: 'text-emerald-400 bg-emerald-400/10',
    security: 'text-blue-400 bg-blue-400/10',
};

export default function ChangelogPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen py-16 lg:py-24">
            <div className="container max-w-3xl">
                {/* Header */}
                <div className="mb-12">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div className="flex items-center gap-3 mb-2">
                        <Tag className="h-6 w-6 text-primary" />
                        <h1 className="text-3xl font-bold text-foreground">Changelog</h1>
                    </div>
                    <p className="text-muted-foreground">
                        All notable changes to The Orchestra Studio are documented here.
                    </p>
                </div>

                {/* Changelog Entries */}
                <div className="space-y-8">
                    {CHANGELOG.map((entry) => (
                        <Card key={entry.version} variant="glass">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 text-sm font-mono font-bold rounded ${entry.type === 'major'
                                            ? 'bg-primary/20 text-primary'
                                            : entry.type === 'minor'
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-muted text-muted-foreground'
                                            }`}>
                                            v{entry.version}
                                        </span>
                                        {entry.type === 'major' && (
                                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                Major Release
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm text-muted-foreground">{entry.date}</span>
                                </div>

                                <div className="space-y-3">
                                    {entry.changes.map((change, index) => {
                                        const Icon = CHANGE_ICONS[change.type];
                                        const colorClass = CHANGE_COLORS[change.type];

                                        return (
                                            <div key={index} className="flex items-start gap-3">
                                                <div className={`p-1.5 rounded ${colorClass}`}>
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{change.title}</p>
                                                    {change.description && (
                                                        <p className="text-sm text-muted-foreground">{change.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Subscribe to Updates */}
                <Card variant="elevated" className="mt-12 border-primary/20">
                    <CardContent className="p-6 text-center">
                        <h3 className="font-semibold text-foreground mb-2">Stay Updated</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Get notified when we release new features.
                        </p>
                        <Button onClick={() => navigate('/blog')}>
                            Subscribe to Newsletter
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
