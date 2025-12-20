import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card, CardContent } from '@/components/common/Card';
import {
    Target,
    Users,
    Lightbulb,
    Heart,
    ArrowRight,
    Linkedin,
    Twitter,
    Github
} from 'lucide-react';

const VALUES = [
    {
        icon: Lightbulb,
        title: 'Innovation First',
        description: 'We push the boundaries of what\'s possible with multi-agent AI systems.',
    },
    {
        icon: Target,
        title: 'Transparency',
        description: 'Every AI decision is explainable. No black boxes, just clear reasoning.',
    },
    {
        icon: Users,
        title: 'Collaboration',
        description: 'We believe the best ideas emerge from diverse perspectives working together.',
    },
    {
        icon: Heart,
        title: 'User-Centric',
        description: 'Everything we build starts with understanding and solving user problems.',
    },
];

const TEAM = [
    {
        name: 'Varad Kulkarni',
        role: 'Founder & CEO',
        bio: 'Former AI researcher at Google DeepMind. Passionate about making AI transparent and accessible.',
        avatar: 'VK',
        social: { linkedin: '#', twitter: '#' },
    },
    {
        name: 'Jatin Shah',
        role: 'CTO',
        bio: 'Ex-OpenAI engineer. 10+ years building scalable AI systems. Believer in agentic workflows.',
        avatar: 'JS',
        social: { linkedin: '#', github: '#' },
    },
    {
        name: 'Priya Sharma',
        role: 'Head of Product',
        bio: 'Product leader who has shipped to millions. Obsessed with intuitive user experiences.',
        avatar: 'PS',
        social: { linkedin: '#', twitter: '#' },
    },
    {
        name: 'Alex Chen',
        role: 'Lead Engineer',
        bio: 'Full-stack wizard. Previously built core infrastructure at Stripe.',
        avatar: 'AC',
        social: { linkedin: '#', github: '#' },
    },
];

const MILESTONES = [
    { year: '2023', title: 'Company Founded', description: 'Started with a vision to make AI collaboration accessible.' },
    { year: '2024 Q1', title: 'Seed Funding', description: 'Raised ₹5 Cr from top VCs to accelerate development.' },
    { year: '2024 Q2', title: 'Public Beta', description: 'Launched to 1,000+ early adopters with overwhelmingly positive feedback.' },
    { year: '2024 Q4', title: 'General Availability', description: 'Full platform launch with enterprise features.' },
];

export default function AboutPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen py-16 lg:py-24">
            <div className="container">
                {/* Hero */}
                <div className="text-center mb-16">
                    <span className="text-primary font-mono text-sm mb-2 block"> ABOUT US</span>
                    <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Building the Future of<br />
                        <span className="text-primary">AI Collaboration</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We're on a mission to make AI thinking transparent, collaborative, and accessible
                        to innovators everywhere.
                    </p>
                </div>

                {/* Mission */}
                <Card variant="elevated" className="mb-16 border-primary/20 overflow-hidden">
                    <CardContent className="p-0">
                        <div className="grid md:grid-cols-2">
                            <div className="p-8 lg:p-12">
                                <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                                <p className="text-muted-foreground mb-6">
                                    Traditional AI tools are black boxes. You type a prompt, get an output, and have no
                                    idea how it got there. We're changing that.
                                </p>
                                <p className="text-muted-foreground mb-6">
                                    The Orchestra Studio brings together specialized AI agents that think, debate, and
                                    refine ideas—just like a team of experts would. And you can see every step of
                                    their reasoning.
                                </p>
                                <p className="text-foreground font-medium">
                                    Because the best ideas deserve to be understood, not just generated.
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-8 lg:p-12 flex items-center justify-center">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="p-4 bg-background/50 rounded-lg backdrop-blur">
                                        <p className="text-3xl font-bold text-primary">10K+</p>
                                        <p className="text-sm text-muted-foreground">Sessions Created</p>
                                    </div>
                                    <div className="p-4 bg-background/50 rounded-lg backdrop-blur">
                                        <p className="text-3xl font-bold text-primary">1K+</p>
                                        <p className="text-sm text-muted-foreground">Active Users</p>
                                    </div>
                                    <div className="p-4 bg-background/50 rounded-lg backdrop-blur">
                                        <p className="text-3xl font-bold text-primary">4</p>
                                        <p className="text-sm text-muted-foreground">AI Agents</p>
                                    </div>
                                    <div className="p-4 bg-background/50 rounded-lg backdrop-blur">
                                        <p className="text-3xl font-bold text-primary">85%</p>
                                        <p className="text-sm text-muted-foreground">Idea Improvement</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Values */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <span className="text-primary font-mono text-sm mb-2 block">VALUES</span>
                        <h2 className="text-3xl font-bold text-foreground">What We Stand For</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {VALUES.map((value) => (
                            <Card key={value.title} variant="glass" className="text-center">
                                <CardContent className="pt-8 pb-6">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                                        <value.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                                    <p className="text-sm text-muted-foreground">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Timeline */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <span className="text-primary font-mono text-sm mb-2 block">JOURNEY</span>
                        <h2 className="text-3xl font-bold text-foreground">Our Story</h2>
                    </div>
                    <div className="max-w-3xl mx-auto">
                        <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                            <div className="space-y-8">
                                {MILESTONES.map((milestone, index) => (
                                    <div key={milestone.year} className="relative flex gap-6 pl-12">
                                        <div className="absolute left-0 w-8 h-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                        </div>
                                        <div>
                                            <span className="text-primary font-mono text-sm">{milestone.year}</span>
                                            <h3 className="font-semibold text-foreground mt-1">{milestone.title}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <span className="text-primary font-mono text-sm mb-2 block">TEAM</span>
                        <h2 className="text-3xl font-bold text-foreground">Meet the Team</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TEAM.map((member) => (
                            <Card key={member.name} variant="glass" className="text-center">
                                <CardContent className="pt-8 pb-6">
                                    <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold mx-auto mb-4">
                                        {member.avatar}
                                    </div>
                                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                                    <p className="text-sm text-primary mb-2">{member.role}</p>
                                    <p className="text-xs text-muted-foreground mb-4">{member.bio}</p>
                                    <div className="flex justify-center gap-3">
                                        {member.social.linkedin && (
                                            <a href={member.social.linkedin} className="text-muted-foreground hover:text-primary transition-colors">
                                                <Linkedin className="h-4 w-4" />
                                            </a>
                                        )}
                                        {member.social.twitter && (
                                            <a href={member.social.twitter} className="text-muted-foreground hover:text-primary transition-colors">
                                                <Twitter className="h-4 w-4" />
                                            </a>
                                        )}
                                        {member.social.github && (
                                            <a href={member.social.github} className="text-muted-foreground hover:text-primary transition-colors">
                                                <Github className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <Card variant="elevated" className="border-primary/20">
                    <CardContent className="p-8 lg:p-12 text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            Join Our Journey
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            We're building something special. Whether you want to try our product or join our team,
                            we'd love to hear from you.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button size="lg" onClick={() => navigate('/signup')}>
                                Start Creating
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button size="lg" variant="secondary" onClick={() => navigate('/careers')}>
                                View Careers
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
