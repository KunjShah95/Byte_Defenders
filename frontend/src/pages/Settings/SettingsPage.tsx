import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/common/Button';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import { toast } from 'sonner';
import { Bell, Lock, Eye, Trash2, Download, ArrowLeft, Shield } from 'lucide-react';

interface UserSettings {
    notifications: { email: boolean; browser: boolean; marketing: boolean };
    privacy: { showProfile: boolean; shareAnalytics: boolean };
    preferences: { language: string; autoSave: boolean; explainabilityMode: boolean };
}

const DEFAULT_SETTINGS: UserSettings = {
    notifications: { email: true, browser: true, marketing: false },
    privacy: { showProfile: true, shareAnalytics: true },
    preferences: { language: 'en', autoSave: true, explainabilityMode: true },
};

export default function SettingsPage() {
    const navigate = useNavigate();
    const [settings, setSettings] = useLocalStorage<UserSettings>('user-settings', DEFAULT_SETTINGS);
    const [isSaving, setIsSaving] = React.useState(false);

    const updateSetting = <K extends keyof UserSettings>(category: K, key: keyof UserSettings[K], value: boolean | string) => {
        setSettings(prev => ({ ...prev, [category]: { ...prev[category], [key]: value } }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Settings saved successfully');
        setIsSaving(false);
    };

    const handleExportData = () => {
        const blob = new Blob([JSON.stringify({ settings, exportDate: new Date().toISOString() }, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'multi-agent-studio-data.json';
        a.click();
        URL.revokeObjectURL(a.href);
        toast.success('Data exported successfully');
    };

    const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
        <button onClick={onChange} className={`relative h-6 w-12 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-white/10'}`}>
            <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
    );

    const settingsSections = [
        {
            icon: Bell, title: 'Notifications', desc: 'Choose what updates you receive',
            content: (
                <div className="space-y-3">
                    {[
                        { key: 'email', label: 'Email notifications', desc: 'Receive session updates via email' },
                        { key: 'browser', label: 'Browser notifications', desc: 'Get push notifications in your browser' },
                        { key: 'marketing', label: 'Marketing emails', desc: 'Receive tips, updates, and offers' },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                            <div>
                                <p className="font-medium text-foreground">{item.label}</p>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                            <ToggleSwitch checked={settings.notifications[item.key as keyof UserSettings['notifications']]} onChange={() => updateSetting('notifications', item.key as keyof UserSettings['notifications'], !settings.notifications[item.key as keyof UserSettings['notifications']])} />
                        </div>
                    ))}
                </div>
            )
        },
        {
            icon: Lock, title: 'Privacy', desc: 'Control your data and visibility',
            content: (
                <div className="space-y-3">
                    {[
                        { key: 'showProfile', label: 'Public profile', desc: 'Allow others to see your profile' },
                        { key: 'shareAnalytics', label: 'Usage analytics', desc: 'Help us improve by sharing anonymous usage data' },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                            <div>
                                <p className="font-medium text-foreground">{item.label}</p>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                            <ToggleSwitch checked={settings.privacy[item.key as keyof UserSettings['privacy']]} onChange={() => updateSetting('privacy', item.key as keyof UserSettings['privacy'], !settings.privacy[item.key as keyof UserSettings['privacy']])} />
                        </div>
                    ))}
                </div>
            )
        },
        {
            icon: Eye, title: 'Preferences', desc: 'Customize your experience',
            content: (
                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">Language</label>
                        <select value={settings.preferences.language} onChange={(e) => updateSetting('preferences', 'language', e.target.value)}
                            className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring backdrop-blur-sm">
                            <option value="en">English</option><option value="hi">हिंदी (Hindi)</option><option value="ta">தமிழ் (Tamil)</option><option value="te">తెలుగు (Telugu)</option>
                        </select>
                    </div>
                    {[
                        { key: 'autoSave', label: 'Auto-save sessions', desc: 'Automatically save your work as you go' },
                        { key: 'explainabilityMode', label: 'Explainability mode', desc: 'Show detailed agent reasoning by default' },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                            <div>
                                <p className="font-medium text-foreground">{item.label}</p>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                            <ToggleSwitch checked={settings.preferences[item.key as keyof UserSettings['preferences']]} onChange={() => updateSetting('preferences', item.key as keyof UserSettings['preferences'], !settings.preferences[item.key as keyof UserSettings['preferences']])} />
                        </div>
                    ))}
                </div>
            )
        },
        {
            icon: Shield, title: 'Data Management', desc: 'Download or delete your data',
            content: (
                <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                        <div>
                            <p className="font-medium text-foreground">Export data</p>
                            <p className="text-sm text-muted-foreground">Download all your data as JSON</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleExportData} className="border-white/10 bg-white/5 hover:bg-white/10"><Download className="mr-2 h-4 w-4" />Export</Button>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-destructive/5 p-3 border border-destructive/20">
                        <div>
                            <p className="font-medium text-foreground">Delete account</p>
                            <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                        </div>
                        <Button variant="destructive" size="sm" disabled><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
                    </div>
                </div>
            )
        },
    ];

    return (
        <div className="relative min-h-screen bg-background">
            <BackgroundBeams className="opacity-10" />
            <div className="relative z-10 mx-auto max-w-3xl space-y-6 p-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /></Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                        <p className="text-muted-foreground">Manage your preferences and account settings</p>
                    </div>
                </motion.div>

                {settingsSections.map((section, i) => (
                    <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                        className="rounded-2xl border border-white/5 bg-card/30 p-6 backdrop-blur-sm">
                        <div className="mb-6 flex items-center gap-2">
                            <section.icon className="h-5 w-5 text-primary" />
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                                <p className="text-sm text-muted-foreground">{section.desc}</p>
                            </div>
                        </div>
                        {section.content}
                    </motion.div>
                ))}

                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
