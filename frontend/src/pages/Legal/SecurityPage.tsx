import React from 'react';
import { Card, CardContent } from '@/components/common/Card';
import {
    Shield,
    Lock,
    Eye,
    Server,
    CheckCircle,
    FileText,
    AlertTriangle
} from 'lucide-react';

const SECURITY_FEATURES = [
    {
        icon: Lock,
        title: 'Encryption',
        items: [
            'TLS 1.3 for all data in transit',
            'AES-256 encryption for data at rest',
            'End-to-end encryption for sensitive data',
        ],
    },
    {
        icon: Shield,
        title: 'Access Control',
        items: [
            'Role-based access control (RBAC)',
            'SSO/SAML support for enterprises',
            'Multi-factor authentication (MFA)',
        ],
    },
    {
        icon: Eye,
        title: 'Monitoring',
        items: [
            '24/7 security monitoring',
            'Automated threat detection',
            'Real-time alerting system',
        ],
    },
    {
        icon: Server,
        title: 'Infrastructure',
        items: [
            'SOC 2 Type II certified cloud providers',
            'Regular penetration testing',
            'DDoS protection',
        ],
    },
];

const CERTIFICATIONS = [
    { name: 'SOC 2 Type II', status: 'Certified', date: 'In Progress' },
    { name: 'ISO 27001', status: 'In Progress', date: 'Q2 2025' },
    { name: 'GDPR', status: 'Compliant', date: 'Current' },
    { name: 'HIPAA', status: 'Available', date: 'Enterprise Only' },
];

export default function SecurityPage() {
    return (
        <div className="min-h-screen py-16 lg:py-24">
            <div className="container max-w-5xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-primary font-mono text-sm mb-2 block">// SECURITY</span>
                    <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Security First
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We take security seriously. Your data is protected by industry-leading
                        security practices and infrastructure.
                    </p>
                </div>

                {/* Trust Banner */}
                <Card variant="elevated" className="mb-12 border-success/20">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                                <Shield className="h-6 w-6 text-success" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Your Data is Protected</h3>
                                <p className="text-sm text-muted-foreground">
                                    The Orchestra Studio is built with enterprise-grade security from the ground up.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Features */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {SECURITY_FEATURES.map((feature) => (
                        <Card key={feature.title} variant="glass">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <feature.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-3">{feature.title}</h3>
                                        <ul className="space-y-2">
                                            {feature.items.map((item) => (
                                                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Certifications */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                        Compliance & Certifications
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {CERTIFICATIONS.map((cert) => (
                            <Card key={cert.name} variant="glass" className="text-center">
                                <CardContent className="pt-6">
                                    <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
                                    <h3 className="font-semibold text-foreground">{cert.name}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block ${cert.status === 'Certified' || cert.status === 'Compliant'
                                        ? 'bg-success/20 text-success'
                                        : cert.status === 'In Progress'
                                            ? 'bg-amber-500/20 text-amber-400'
                                            : 'bg-primary/20 text-primary'
                                        }`}>
                                        {cert.status}
                                    </span>
                                    <p className="text-xs text-muted-foreground mt-2">{cert.date}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Security Practices */}
                <Card variant="glass" className="mb-12">
                    <CardContent className="p-8">
                        <h2 className="text-xl font-bold text-foreground mb-6">Our Security Practices</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Regular Audits</h3>
                                <p className="text-sm text-muted-foreground">
                                    We conduct quarterly security audits and annual penetration tests by
                                    independent third-party security firms.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Employee Training</h3>
                                <p className="text-sm text-muted-foreground">
                                    All employees complete security awareness training upon hiring and
                                    annually thereafter. Access to production systems is strictly limited.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Incident Response</h3>
                                <p className="text-sm text-muted-foreground">
                                    We maintain a comprehensive incident response plan and will notify
                                    affected users within 72 hours of any security breach.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Secure Development</h3>
                                <p className="text-sm text-muted-foreground">
                                    Our development process includes code reviews, static analysis,
                                    dependency scanning, and pre-production security testing.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Report Vulnerability */}
                <Card variant="elevated" className="border-primary/20">
                    <CardContent className="p-8 text-center">
                        <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            Found a Vulnerability?
                        </h2>
                        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                            We appreciate responsible disclosure. If you've found a security issue,
                            please report it to our security team.
                        </p>
                        <a
                            href="mailto:security@orchestrastudio.com"
                            className="inline-flex items-center justify-center h-12 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            Report to security@orchestrastudio.com
                        </a>
                        <p className="text-xs text-muted-foreground mt-4">
                            We'll acknowledge your report within 24 hours and work to resolve valid issues promptly.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
