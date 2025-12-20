import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth.context';
import { useSession } from '@/store/session.context';
import { Button } from '@/components/common/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { PageLoader } from '@/components/common/Loader';
import {
    User,
    Mail,
    Calendar,
    Crown,
    BarChart3,
    LogOut,
    Settings,
    CreditCard,
    History
} from 'lucide-react';

export default function ProfilePage() {
    const { user, loading, signOut } = useAuth();
    const { sessions } = useSession();
    const navigate = useNavigate();

    if (loading) {
        return <PageLoader />;
    }

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Sign out failed:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;

    const stats = [
        {
            label: 'Total Sessions',
            value: totalSessions,
            icon: History,
            color: 'text-primary'
        },
        {
            label: 'Completed',
            value: completedSessions,
            icon: BarChart3,
            color: 'text-success'
        },
        {
            label: 'Current Plan',
            value: 'Starter',
            icon: Crown,
            color: 'text-amber-400'
        },
    ];

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
                        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
                    </div>
                    <Button variant="outline" onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>

                {/* Profile Card */}
                <Card variant="glass">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-6">
                            <div className="h-20 w-20 rounded-2xl bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold flex-shrink-0">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.displayName || 'Profile'}
                                        className="h-20 w-20 rounded-2xl object-cover"
                                    />
                                ) : (
                                    user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl font-bold text-foreground truncate">
                                    {user.displayName || 'User'}
                                </h2>
                                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                    <Mail className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                {user.metadata?.creationTime && (
                                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                        <Calendar className="h-4 w-4 flex-shrink-0" />
                                        <span>Joined {formatDate(user.metadata.creationTime)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.map((stat) => (
                        <Card key={stat.label} variant="glass">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                        <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center ${stat.color}`}>
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                        <CardDescription>Common tasks and settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <button
                            onClick={() => navigate('/history')}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors text-left"
                        >
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <History className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-foreground">View Session History</p>
                                <p className="text-sm text-muted-foreground">Browse your past creative sessions</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/create')}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors text-left"
                        >
                            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-foreground">Create New Session</p>
                                <p className="text-sm text-muted-foreground">Start a new AI-powered creative session</p>
                            </div>
                        </button>

                        <button
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors text-left opacity-60"
                            disabled
                        >
                            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-foreground">Upgrade Plan</p>
                                <p className="text-sm text-muted-foreground">Get unlimited sessions with Pro</p>
                            </div>
                            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">Coming Soon</span>
                        </button>

                        <button
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors text-left opacity-60"
                            disabled
                        >
                            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                                <Settings className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-foreground">Account Settings</p>
                                <p className="text-sm text-muted-foreground">Manage your account preferences</p>
                            </div>
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">Coming Soon</span>
                        </button>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card variant="glass" className="border-destructive/20">
                    <CardHeader>
                        <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
                        <CardDescription>Irreversible account actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/5">
                            <div>
                                <p className="font-medium text-foreground">Delete Account</p>
                                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                            </div>
                            <Button variant="destructive" size="sm" disabled>
                                Delete
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
