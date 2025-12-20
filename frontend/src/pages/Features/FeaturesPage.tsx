import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import {
    Brain,
    Eye,
    RefreshCw,
    Target,
    GitBranch,
    Clock,
    Zap,
    Shield,
    BarChart3,
    Layers,
    Cpu,
    Network,
    Sparkles,
    ArrowRight,
    CheckCircle
} from 'lucide-react';

const FEATURES = [
    {
        icon: Brain,
        title: 'Idea Generation Agent',
        description: 'Our AI-powered Idea Agent analyzes your brief and generates multiple creative concepts, exploring novel directions you might not have considered.',
        details: [
            'Context-aware ideation',
            'Multiple concept variations',
            'Industry-specific insights',
            'Creative exploration modes'
        ],
        color: 'from-blue-500/20 to-cyan-500/20',
        iconColor: 'text-blue-400'
    },
    {
        icon: Eye,
        title: 'Critical Analysis Agent',
        description: 'The Critic Agent provides structured feedback using SWOT analysis, identifying strengths, weaknesses, and areas for improvement.',
        details: [
            'SWOT analysis framework',
            'Market viability assessment',
            'Risk identification',
            'Constructive feedback loops'
        ],
        color: 'from-amber-500/20 to-orange-500/20',
        iconColor: 'text-amber-400'
    },
    {
        icon: RefreshCw,
        title: 'Iterative Refinement Agent',
        description: 'The Refiner Agent takes feedback and systematically improves your ideas, tracking changes and maintaining version history.',
        details: [
            'Automated improvement cycles',
            'Version comparison',
            'Score tracking',
            'Progressive enhancement'
        ],
        color: 'from-emerald-500/20 to-teal-500/20',
        iconColor: 'text-emerald-400'
    },
    {
        icon: Target,
        title: 'Presentation Agent',
        description: 'The Presenter Agent formats your refined ideas into polished, actionable deliverables ready for stakeholders.',
        details: [
            'Multiple output formats',
            'Executive summaries',
            'Action item extraction',
            'Stakeholder-ready reports'
        ],
        color: 'from-purple-500/20 to-pink-500/20',
        iconColor: 'text-purple-400'
    },
    {
        icon: GitBranch,
        title: 'Full Traceability',
        description: 'Every decision, every iteration, every score is logged. Complete transparency into the AI reasoning process.',
        details: [
            'Decision audit trails',
            'Reasoning explanations',
            'Score justifications',
            'Iteration history'
        ],
        color: 'from-rose-500/20 to-red-500/20',
        iconColor: 'text-rose-400'
    },
    {
        icon: Clock,
        title: 'Real-time Execution',
        description: 'Watch agents work in real-time with live logs, progress indicators, and instant feedback.',
        details: [
            'Live execution logs',
            'Progress visualization',
            'SSE event streaming',
            'Instant notifications'
        ],
        color: 'from-indigo-500/20 to-violet-500/20',
        iconColor: 'text-indigo-400'
    },
];

const PLATFORM_FEATURES = [
    { icon: Zap, title: 'Lightning Fast', description: 'Complete sessions in under 60 seconds' },
    { icon: Shield, title: 'Enterprise Security', description: 'SOC 2 compliant with data encryption' },
    { icon: BarChart3, title: 'Analytics Dashboard', description: 'Track performance across sessions' },
    { icon: Layers, title: 'Custom Workflows', description: 'Build your own agent pipelines' },
    { icon: Cpu, title: 'API Access', description: 'Integrate with your existing tools' },
    { icon: Network, title: 'Team Collaboration', description: 'Share sessions with your team' },
];

export default function FeaturesPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen py-16 lg:py-24">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-primary font-mono text-sm mb-2 block">FEATURES</span>
                    <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Powerful AI Agent System
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Four specialized agents work together to transform your raw ideas into polished,
                        actionable concepts with complete transparency.
                    </p>
                </div>

                {/* Agent Features */}
                <div className="space-y-8 mb-24">
                    {FEATURES.map((feature, index) => (
                        <Card key={feature.title} variant="glass" className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                                    <div className={`p-8 lg:p-12 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                                        <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} mb-6`}>
                                            <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-foreground mb-4">{feature.title}</h2>
                                        <p className="text-muted-foreground mb-6">{feature.description}</p>
                                        <ul className="space-y-3">
                                            {feature.details.map((detail) => (
                                                <li key={detail} className="flex items-center gap-3 text-sm">
                                                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                                                    <span className="text-foreground">{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className={`bg-gradient-to-br ${feature.color} p-8 lg:p-12 flex items-center justify-center ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                                        <feature.icon className={`h-32 w-32 ${feature.iconColor} opacity-50`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Platform Features */}
                <div className="text-center mb-12">
                    <span className="text-primary font-mono text-sm mb-2 block"> PLATFORM</span>
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                        Built for Scale
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Enterprise-grade infrastructure designed for teams of all sizes.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {PLATFORM_FEATURES.map((feature) => (
                        <Card key={feature.title} variant="glass" className="group hover:border-primary/30 transition-all">
                            <CardContent className="pt-6">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                                    <feature.icon className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* CTA */}
                <Card variant="elevated" className="border-primary/20">
                    <CardContent className="p-8 lg:p-12 text-center">
                        <Sparkles className="h-12 w-12 text-primary mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            Ready to Experience Multi-Agent AI?
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            Start with 5 free sessions and see how our agents can transform your ideas.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" onClick={() => navigate('/signup')}>
                                Get Started Free
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button size="lg" variant="secondary" onClick={() => navigate('/pricing')}>
                                View Pricing
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
