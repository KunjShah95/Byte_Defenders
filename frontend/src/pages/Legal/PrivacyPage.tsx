import React from 'react';
import { Card, CardContent } from '@/components/common/Card';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen py-16 lg:py-24">
            <div className="container max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-primary font-mono text-sm mb-2 block">Legal Protocol</span>
                    <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-muted-foreground">
                        Last updated: December 20, 2024
                    </p>
                </div>

                <Card variant="glass">
                    <CardContent className="p-8 prose prose-invert max-w-none">
                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-foreground mb-4">1. Introduction</h2>
                            <p className="text-muted-foreground mb-4">
                                The Orchestra Studio ("we", "our", or "us") is committed to protecting your privacy.
                                This Privacy Policy explains how we collect, use, disclose, and safeguard your
                                information when you use our service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-foreground mb-4">2. Information We Collect</h2>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Personal Information</h3>
                            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                                <li>Name and email address when you create an account</li>
                                <li>Payment information when you subscribe to paid plans</li>
                                <li>Profile information you choose to provide</li>
                            </ul>

                            <h3 className="text-lg font-semibold text-foreground mb-2">Usage Information</h3>
                            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                                <li>Session data and prompts you input into the system</li>
                                <li>Agent outputs and interaction history</li>
                                <li>Log data including IP address, browser type, and device information</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
                            <p className="text-muted-foreground mb-4">We use the collected information to:</p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                <li>Provide and maintain The Orchestra Studio service</li>
                                <li>Process transactions and send related information</li>
                                <li>Send you technical notices and support messages</li>
                                <li>Respond to your comments and questions</li>
                                <li>Improve and optimize our service</li>
                                <li>Monitor and analyze usage patterns</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-foreground mb-4">4. Data Retention</h2>
                            <p className="text-muted-foreground mb-4">
                                We retain your personal information for as long as your account is active or as
                                needed to provide you services. Session data is retained according to your plan:
                            </p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                <li><strong className="text-foreground">Starter:</strong> 7 days</li>
                                <li><strong className="text-foreground">Pro:</strong> Unlimited</li>
                                <li><strong className="text-foreground">Enterprise:</strong> Custom retention policies</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-foreground mb-4">5. Data Security</h2>
                            <p className="text-muted-foreground mb-4">
                                We implement appropriate technical and organizational security measures including:
                            </p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                <li>Encryption of data in transit (TLS 1.3) and at rest (AES-256)</li>
                                <li>Regular security audits and penetration testing</li>
                                <li>Access controls and authentication mechanisms</li>
                                <li>Employee security training and background checks</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-foreground mb-4">6. Your Rights</h2>
                            <p className="text-muted-foreground mb-4">You have the right to:</p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                <li>Access your personal data</li>
                                <li>Correct inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Export your data in a portable format</li>
                                <li>Opt-out of marketing communications</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-foreground mb-4">7. Contact Us</h2>
                            <p className="text-muted-foreground">
                                If you have questions about this Privacy Policy, please contact us at:
                            </p>
                            <p className="text-primary mt-2">privacy@theorchestrastudio.com</p>
                        </section>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
