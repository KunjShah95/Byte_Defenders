import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/store/theme.context';
import { useAuth } from '@/store/auth.context';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/common/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { toast } from 'sonner';
import {
    Sun,
    Moon,
    Monitor,
    Bell,
    Globe,
    Lock,
    Eye,
    Trash2,
    Download,
    ArrowLeft,
    CheckCircle
} from 'lucide-react';

interface UserSettings {
    notifications: {
        email: boolean;
        browser: boolean;
        marketing: boolean;
    };
    privacy: {
        showProfile: boolean;
        shareAnalytics: boolean;
    };
    preferences: {
        language: string;
        autoSave: boolean;
        explainabilityMode: boolean;
    };
}

const DEFAULT_SETTINGS: UserSettings = {
    notifications: {
        email: true,
        browser: true,
        marketing: false,
    },
    privacy: {
        showProfile: true,
        shareAnalytics: true,
    },
    preferences: {
        language: 'en',
        autoSave: true,
        explainabilityMode: true,
    },
};

export default function SettingsPage() {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { user } = useAuth();
    const [settings, setSettings] = useLocalStorage<UserSettings>('user-settings', DEFAULT_SETTINGS);
    const [isSaving, setIsSaving] = React.useState(false);

    const updateSetting = <K extends keyof UserSettings>(
        category: K,
        key: keyof UserSettings[K],
        value: boolean | string
    ) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value,
            },
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Settings saved successfully');
        setIsSaving(false);
    };

    const handleExportData = () => {
        const data = {
            settings,
            exportDate: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'multi-agent-studio-data.json';
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Data exported successfully');
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                        <p className="text-muted-foreground">Manage your preferences and account settings</p>
                    </div>
                </div>

                {/* Appearance */}
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Sun className="h-5 w-5 text-primary" />
                            Appearance
                        </CardTitle>
                        <CardDescription>Customize the look and feel of the app</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-foreground mb-3 block">Theme</label>
                            <div className="flex gap-3">
                                {[
                                    { value: 'light', icon: Sun, label: 'Light' },
                                    { value: 'dark', icon: Moon, label: 'Dark' },
                                    { value: 'system', icon: Monitor, label: 'System' },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
                                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${theme === option.value
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border hover:border-primary/50 text-muted-foreground'
                                            }`}
                                    >
                                        <option.icon className="h-4 w-4" />
                                        <span className="text-sm font-medium">{option.label}</span>
                                        {theme === option.value && (
                                            <CheckCircle className="h-4 w-4 ml-auto" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            Notifications
                        </CardTitle>
                        <CardDescription>Choose what updates you want to receive</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { key: 'email', label: 'Email notifications', description: 'Receive session updates via email' },
                            { key: 'browser', label: 'Browser notifications', description: 'Get push notifications in your browser' },
                            { key: 'marketing', label: 'Marketing emails', description: 'Receive tips, updates, and offers' },
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                                <div>
                                    <p className="font-medium text-foreground">{item.label}</p>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                                <button
                                    onClick={() => updateSetting('notifications', item.key as keyof UserSettings['notifications'], !settings.notifications[item.key as keyof UserSettings['notifications']])}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${settings.notifications[item.key as keyof UserSettings['notifications']]
                                            ? 'bg-primary'
                                            : 'bg-muted'
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.notifications[item.key as keyof UserSettings['notifications']]
                                                ? 'translate-x-6'
                                                : 'translate-x-0'
                                            }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Privacy */}
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Lock className="h-5 w-5 text-primary" />
                            Privacy
                        </CardTitle>
                        <CardDescription>Control your data and visibility</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                            <div>
                                <p className="font-medium text-foreground">Public profile</p>
                                <p className="text-sm text-muted-foreground">Allow others to see your profile</p>
                            </div>
                            <button
                                onClick={() => updateSetting('privacy', 'showProfile', !settings.privacy.showProfile)}
                                className={`relative w-12 h-6 rounded-full transition-colors ${settings.privacy.showProfile ? 'bg-primary' : 'bg-muted'
                                    }`}
                            >
                                <span
                                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.privacy.showProfile ? 'translate-x-6' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                            <div>
                                <p className="font-medium text-foreground">Usage analytics</p>
                                <p className="text-sm text-muted-foreground">Help us improve by sharing anonymous usage data</p>
                            </div>
                            <button
                                onClick={() => updateSetting('privacy', 'shareAnalytics', !settings.privacy.shareAnalytics)}
                                className={`relative w-12 h-6 rounded-full transition-colors ${settings.privacy.shareAnalytics ? 'bg-primary' : 'bg-muted'
                                    }`}
                            >
                                <span
                                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.privacy.shareAnalytics ? 'translate-x-6' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Preferences */}
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Eye className="h-5 w-5 text-primary" />
                            Preferences
                        </CardTitle>
                        <CardDescription>Customize your experience</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">Language</label>
                            <select
                                value={settings.preferences.language}
                                onChange={(e) => updateSetting('preferences', 'language', e.target.value)}
                                className="w-full h-10 px-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="en">English</option>
                                <option value="hi">हिंदी (Hindi)</option>
                                <option value="ta">தமிழ் (Tamil)</option>
                                <option value="te">తెలుగు (Telugu)</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                            <div>
                                <p className="font-medium text-foreground">Auto-save sessions</p>
                                <p className="text-sm text-muted-foreground">Automatically save your work as you go</p>
                            </div>
                            <button
                                onClick={() => updateSetting('preferences', 'autoSave', !settings.preferences.autoSave)}
                                className={`relative w-12 h-6 rounded-full transition-colors ${settings.preferences.autoSave ? 'bg-primary' : 'bg-muted'
                                    }`}
                            >
                                <span
                                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.preferences.autoSave ? 'translate-x-6' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                            <div>
                                <p className="font-medium text-foreground">Explainability mode</p>
                                <p className="text-sm text-muted-foreground">Show detailed agent reasoning by default</p>
                            </div>
                            <button
                                onClick={() => updateSetting('preferences', 'explainabilityMode', !settings.preferences.explainabilityMode)}
                                className={`relative w-12 h-6 rounded-full transition-colors ${settings.preferences.explainabilityMode ? 'bg-primary' : 'bg-muted'
                                    }`}
                            >
                                <span
                                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.preferences.explainabilityMode ? 'translate-x-6' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Management */}
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Download className="h-5 w-5 text-primary" />
                            Data Management
                        </CardTitle>
                        <CardDescription>Download or delete your data</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                            <div>
                                <p className="font-medium text-foreground">Export data</p>
                                <p className="text-sm text-muted-foreground">Download all your data as JSON</p>
                            </div>
                            <Button variant="secondary" size="sm" onClick={handleExportData}>
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                            <div>
                                <p className="font-medium text-foreground">Delete account</p>
                                <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                            </div>
                            <Button variant="destructive" size="sm" disabled>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
