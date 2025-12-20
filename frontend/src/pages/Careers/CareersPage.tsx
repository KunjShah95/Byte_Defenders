import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card, CardContent } from '@/components/common/Card';
import {
    MapPin,
    Briefcase,
    Clock,
    Heart,
    ArrowRight,
    CheckCircle,
    Zap,
    Users,
    Globe
} from 'lucide-react';

const POSITIONS = [
    {
        id: 1,
        title: 'Senior Full Stack Engineer',
        department: 'Engineering',
        location: 'Bangalore / Remote',
        type: 'Full-time',
        salary: '₹25L - ₹45L',
        description: 'Build and scale our core platform using TypeScript, React, and Node.js.',
        requirements: ['5+ years experience', 'React & Node.js', 'System design skills'],
    },
    {
        id: 2,
        title: 'ML/AI Engineer',
        department: 'AI Research',
        location: 'Bangalore / Remote',
        type: 'Full-time',
        salary: '₹30L - ₹55L',
        description: 'Work on our multi-agent orchestration and prompt engineering systems.',
        requirements: ['3+ years in ML', 'LLM experience', 'Python proficiency'],
    },
    {
        id: 3,
        title: 'Product Designer',
        department: 'Design',
        location: 'Remote',
        type: 'Full-time',
        salary: '₹18L - ₹35L',
        description: 'Design beautiful, intuitive interfaces for our AI collaboration platform.',
        requirements: ['4+ years product design', 'Figma expertise', 'Design systems'],
    },
    {
        id: 4,
        title: 'DevOps Engineer',
        department: 'Infrastructure',
        location: 'Bangalore / Remote',
        type: 'Full-time',
        salary: '₹20L - ₹40L',
        description: 'Build and maintain our cloud infrastructure on AWS/GCP.',
        requirements: ['Kubernetes', 'Terraform', 'CI/CD pipelines'],
    },
];

const BENEFITS = [
    { icon: Heart, title: 'Health Insurance', description: 'Comprehensive coverage for you and family' },
    { icon: Zap, title: 'Learning Budget', description: '₹1L annual budget for courses and conferences' },
    { icon: Clock, title: 'Flexible Hours', description: 'Work when you\'re most productive' },
    { icon: Globe, title: 'Remote First', description: 'Work from anywhere in India' },
    { icon: Users, title: 'Team Retreats', description: 'Quarterly offsites to amazing destinations' },
    { icon: Briefcase, title: 'Equity', description: 'Own a piece of what you build' },
];

export default function CareersPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen py-16 lg:py-24">
            <div className="container">
                {/* Hero */}
                <div className="text-center mb-16">
                    <span className="text-primary font-mono text-sm mb-2 block">// CAREERS</span>
                    <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Build the Future of AI<br />With Us
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Join a team of passionate builders creating transparent, collaborative AI systems.
                        We're remote-first and believe in work-life balance.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 text-primary" />
                            Remote First (India)
                        </span>
                        <span className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4 text-primary" />
                            15+ Team Members
                        </span>
                        <span className="flex items-center gap-2 text-muted-foreground">
                            <Zap className="h-4 w-4 text-primary" />
                            Well Funded
                        </span>
                    </div>
                </div>

                {/* Open Positions */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Open Positions</h2>
                    <div className="space-y-4">
                        {POSITIONS.map((position) => (
                            <Card key={position.id} variant="glass" className="group hover:border-primary/30 transition-all cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                                    {position.title}
                                                </h3>
                                                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                                    {position.department}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-3">{position.description}</p>
                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {position.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {position.type}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Briefcase className="h-4 w-4" />
                                                    {position.salary}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Button onClick={() => navigate('/contact')}>
                                                Apply Now
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                            <div className="flex flex-wrap gap-1">
                                                {position.requirements.slice(0, 2).map((req) => (
                                                    <span key={req} className="text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                                                        {req}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Benefits */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <span className="text-primary font-mono text-sm mb-2 block">// PERKS</span>
                        <h2 className="text-3xl font-bold text-foreground">Why Join Us?</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {BENEFITS.map((benefit) => (
                            <Card key={benefit.title} variant="glass">
                                <CardContent className="pt-6">
                                    <benefit.icon className="h-8 w-8 text-primary mb-4" />
                                    <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Culture */}
                <Card variant="elevated" className="mb-16 border-primary/20">
                    <CardContent className="p-8 lg:p-12">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <span className="text-primary font-mono text-sm mb-2 block">// CULTURE</span>
                                <h2 className="text-2xl font-bold text-foreground mb-4">How We Work</h2>
                                <ul className="space-y-4">
                                    {[
                                        'Async-first communication with deep focus time',
                                        'Bi-weekly sprints with clear ownership',
                                        'Direct access to leadership and quick decisions',
                                        'Ship fast, learn faster, iterate continuously',
                                        'Celebrate wins and learn from failures openly',
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-secondary/30 rounded-xl text-center">
                                    <p className="text-3xl font-bold text-primary mb-1">4.8/5</p>
                                    <p className="text-sm text-muted-foreground">Glassdoor Rating</p>
                                </div>
                                <div className="p-6 bg-secondary/30 rounded-xl text-center">
                                    <p className="text-3xl font-bold text-primary mb-1">95%</p>
                                    <p className="text-sm text-muted-foreground">Would Recommend</p>
                                </div>
                                <div className="p-6 bg-secondary/30 rounded-xl text-center col-span-2">
                                    <p className="text-3xl font-bold text-primary mb-1">∞</p>
                                    <p className="text-sm text-muted-foreground">Growth Opportunities</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* CTA */}
                <Card variant="glass">
                    <CardContent className="p-8 text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            Don't See Your Role?
                        </h2>
                        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                            We're always looking for exceptional talent. Send us your resume and tell us
                            how you can contribute to our mission.
                        </p>
                        <Button size="lg" onClick={() => navigate('/contact')}>
                            Send Open Application
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
