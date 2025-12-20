import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import {
    Search,
    Home,
    Plus,
    History,
    Settings,
    User,
    FileText,
    CreditCard,
    HelpCircle,
    LogOut,
    Moon,
    Sun,
    Command
} from 'lucide-react';

interface CommandItem {
    id: string;
    title: string;
    description?: string;
    icon: React.ElementType;
    action: () => void;
    keywords?: string[];
    category: 'navigation' | 'actions' | 'settings';
}

interface CommandPaletteProps {
    onSignOut?: () => void;
}

/**
 * Command Palette component (Cmd+K / Ctrl+K)
 * Provides quick access to all app features through keyboard.
 */
export function CommandPalette({ onSignOut }: CommandPaletteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();

    useKeyboardShortcut('k', () => setIsOpen(true), { ctrl: true });
    useKeyboardShortcut('k', () => setIsOpen(true), { meta: true });

    useKeyboardShortcut('Escape', () => {
        if (isOpen) {
            setIsOpen(false);
            setSearch('');
        }
    });

    const commands: CommandItem[] = useMemo(() => [
        {
            id: 'home',
            title: 'Go to Home',
            icon: Home,
            action: () => navigate('/'),
            keywords: ['landing', 'main'],
            category: 'navigation',
        },
        {
            id: 'create',
            title: 'Create New Session',
            description: 'Start a new AI brainstorming session',
            icon: Plus,
            action: () => navigate('/create'),
            keywords: ['new', 'start', 'session'],
            category: 'navigation',
        },
        {
            id: 'history',
            title: 'View Session History',
            icon: History,
            action: () => navigate('/history'),
            keywords: ['past', 'sessions', 'previous'],
            category: 'navigation',
        },
        {
            id: 'profile',
            title: 'My Profile',
            icon: User,
            action: () => navigate('/profile'),
            keywords: ['account', 'me'],
            category: 'navigation',
        },
        {
            id: 'pricing',
            title: 'View Pricing',
            icon: CreditCard,
            action: () => navigate('/pricing'),
            keywords: ['plans', 'subscribe', 'upgrade'],
            category: 'navigation',
        },
        {
            id: 'docs',
            title: 'Documentation',
            icon: FileText,
            action: () => navigate('/docs'),
            keywords: ['help', 'guide', 'api'],
            category: 'navigation',
        },
        {
            id: 'settings',
            title: 'Settings',
            icon: Settings,
            action: () => navigate('/settings'),
            keywords: ['preferences', 'config'],
            category: 'settings',
        },
        {
            id: 'help',
            title: 'Help & Support',
            icon: HelpCircle,
            action: () => navigate('/contact'),
            keywords: ['support', 'contact'],
            category: 'settings',
        },
        {
            id: 'signout',
            title: 'Sign Out',
            icon: LogOut,
            action: () => onSignOut?.(),
            keywords: ['logout', 'exit'],
            category: 'actions',
        },
    ], [navigate, onSignOut]);

    const filteredCommands = useMemo(() => {
        if (!search) return commands;

        const searchLower = search.toLowerCase();
        return commands.filter(cmd => {
            const matchesTitle = cmd.title.toLowerCase().includes(searchLower);
            const matchesKeywords = cmd.keywords?.some(kw => kw.toLowerCase().includes(searchLower));
            const matchesDescription = cmd.description?.toLowerCase().includes(searchLower);
            return matchesTitle || matchesKeywords || matchesDescription;
        });
    }, [commands, search]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(i => Math.max(i - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                    setIsOpen(false);
                    setSearch('');
                }
                break;
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                onClick={() => {
                    setIsOpen(false);
                    setSearch('');
                }}
            />

            {/* Command Palette */}
            <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-lg z-50">
                <div className="bg-popover border border-border rounded-xl shadow-2xl overflow-hidden">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                        <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Type a command or search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                            autoFocus
                        />
                        <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground bg-muted rounded">
                            ESC
                        </kbd>
                    </div>

                    {/* Commands List */}
                    <div className="max-h-80 overflow-y-auto p-2">
                        {filteredCommands.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground text-sm">
                                No commands found
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {filteredCommands.map((cmd, index) => (
                                    <button
                                        key={cmd.id}
                                        onClick={() => {
                                            cmd.action();
                                            setIsOpen(false);
                                            setSearch('');
                                        }}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${selectedIndex === index
                                                ? 'bg-secondary text-foreground'
                                                : 'text-muted-foreground hover:bg-secondary/50'
                                            }`}
                                    >
                                        <cmd.icon className="h-4 w-4 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{cmd.title}</p>
                                            {cmd.description && (
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {cmd.description}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/50">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↑↓</kbd>
                                Navigate
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↵</kbd>
                                Select
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Command className="h-3 w-3" />
                            <span>K to open</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CommandPalette;
