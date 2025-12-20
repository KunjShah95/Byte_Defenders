import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card, CardContent } from '@/components/common/Card';
import {
    BookOpen,
    Code2,
    Zap,
    Layers,
    Terminal,
    ArrowRight,
    ExternalLink,
    Search
} from 'lucide-react';

const DOC_SECTIONS = [
    {
        title: 'Getting Started',
        icon: Zap,
        items: [
            { title: 'Introduction', href: '#intro' },
            { title: 'Quick Start', href: '#quickstart' },
            { title: 'Authentication', href: '#auth' },
            { title: 'Your First Session', href: '#first-session' },
        ],
    },
    {
        title: 'Core Concepts',
        icon: Layers,
        items: [
            { title: 'Sessions', href: '#sessions' },
            { title: 'Agents', href: '#agents' },
            { title: 'Workflows', href: '#workflows' },
            { title: 'Explainability', href: '#explainability' },
        ],
    },
    {
        title: 'API Reference',
        icon: Code2,
        items: [
            { title: 'Sessions API', href: '#sessions-api' },
            { title: 'Workflows API', href: '#workflows-api' },
            { title: 'Results API', href: '#results-api' },
            { title: 'Events API', href: '#events-api' },
        ],
    },
    {
        title: 'SDKs & Tools',
        icon: Terminal,
        items: [
            { title: 'JavaScript SDK', href: '#js-sdk' },
            { title: 'Python SDK', href: '#python-sdk' },
            { title: 'CLI Tool', href: '#cli' },
            { title: 'Webhooks', href: '#webhooks' },
        ],
    },
];

const GUIDES = [
    {
        title: 'Building a Brainstorming App',
        description: 'Learn how to create an app that uses multi-agent collaboration for idea generation.',
        readTime: '10 min read',
        level: 'Beginner',
    },
    {
        title: 'Custom Agent Configurations',
        description: 'Customize agent behavior with system prompts and configuration options.',
        readTime: '15 min read',
        level: 'Intermediate',
    },
    {
        title: 'Real-time Updates with SSE',
        description: 'Subscribe to server-sent events for live workflow progress updates.',
        readTime: '8 min read',
        level: 'Intermediate',
    },
    {
        title: 'Enterprise Integration Guide',
        description: 'Best practices for integrating The Orchestra Studio into your enterprise workflow.',
        readTime: '20 min read',
        level: 'Advanced',
    },
];

export default function DocsPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState('');

    return (
        <div className="min-h-screen py-16 lg:py-24">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-primary font-mono text-sm mb-2 block">// DOCUMENTATION</span>
                    <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Documentation
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Everything you need to integrate and use The Orchestra Studio effectively.
                    </p>

                    {/* Search */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search documentation..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid md:grid-cols-4 gap-4 mb-12">
                    {DOC_SECTIONS.map((section) => (
                        <Card key={section.title} variant="glass" className="hover:border-primary/30 transition-all">
                            <CardContent className="pt-6">
                                <section.icon className="h-6 w-6 text-primary mb-3" />
                                <h3 className="font-semibold text-foreground mb-3">{section.title}</h3>
                                <ul className="space-y-2">
                                    {section.items.map((item) => (
                                        <li key={item.title}>
                                            <a
                                                href={item.href}
                                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                {item.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Guides */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Popular Guides</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {GUIDES.map((guide) => (
                            <Card key={guide.title} variant="glass" className="group cursor-pointer hover:border-primary/30 transition-all">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${guide.level === 'Beginner'
                                                    ? 'bg-success/20 text-success'
                                                    : guide.level === 'Intermediate'
                                                        ? 'bg-primary/20 text-primary'
                                                        : 'bg-amber-500/20 text-amber-400'
                                                    }`}>
                                                    {guide.level}
                                                </span>
                                                <span className="text-xs text-muted-foreground">{guide.readTime}</span>
                                            </div>
                                            <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                                {guide.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">{guide.description}</p>
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sample Content */}
                <Card variant="glass" className="mb-12">
                    <CardContent className="p-8">
                        <h2 id="intro" className="text-2xl font-bold text-foreground mb-4">Introduction</h2>
                        <p className="text-muted-foreground mb-6">
                            The Orchestra Studio is a platform that enables collaborative AI workflows using
                            specialized agents. Each agent has a specific role in refining and improving your ideas.
                        </p>

                        <h3 className="text-xl font-semibold text-foreground mb-3">The Agent Pipeline</h3>
                        <div className="grid md:grid-cols-4 gap-4 mb-6">
                            {[
                                { emoji: '💡', name: 'Idea Agent', desc: 'Generates creative concepts' },
                                { emoji: '🔍', name: 'Critic Agent', desc: 'Provides structured feedback' },
                                { emoji: '✨', name: 'Refiner Agent', desc: 'Improves based on critique' },
                                { emoji: '📊', name: 'Presenter Agent', desc: 'Formats final output' },
                            ].map((agent) => (
                                <div key={agent.name} className="text-center p-4 bg-secondary/30 rounded-lg">
                                    <span className="text-2xl mb-2 block">{agent.emoji}</span>
                                    <p className="font-medium text-foreground text-sm">{agent.name}</p>
                                    <p className="text-xs text-muted-foreground">{agent.desc}</p>
                                </div>
                            ))}
                        </div>

                        <h3 id="quickstart" className="text-xl font-semibold text-foreground mb-3">Quick Start</h3>
                        <pre className="bg-background border border-border rounded-lg p-4 overflow-x-auto text-sm mb-6">
                            <code className="text-foreground font-mono">{`# Install the SDK
npm install @theorchestrastudio/sdk

# Set your API key
export ORCHESTRA_STUDIO_API_KEY=your_key_here

# Run your first session
npx @theorchestrastudio/cli run --topic "My startup idea"`}</code>
                        </pre>

                        <div className="flex gap-4">
                            <Button onClick={() => navigate('/api')}>
                                API Reference
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button variant="secondary" onClick={() => window.open('https://github.com/theorchestrastudio/sdk', '_blank')}>
                                GitHub
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Help */}
                <Card variant="elevated" className="border-primary/20">
                    <CardContent className="p-8 text-center">
                        <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            Need Help?
                        </h2>
                        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                            Can't find what you're looking for? Our team is here to help.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button onClick={() => navigate('/contact')}>
                                Contact Support
                            </Button>
                            <Button variant="secondary" onClick={() => window.open('https://discord.gg/theorchestrastudio', '_blank')}>
                                Join Discord
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
