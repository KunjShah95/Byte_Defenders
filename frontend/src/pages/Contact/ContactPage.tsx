import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Card, CardContent } from '@/components/common/Card';
import { toast } from 'sonner';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    MessageSquare,
    Clock,
    Twitter,
    Linkedin,
    Github
} from 'lucide-react';

const CONTACT_OPTIONS = [
    {
        icon: Mail,
        title: 'Email Us',
        description: 'For general inquiries and support',
        value: 'hello@theorchestrastudio.com',
        action: 'mailto:hello@theorchestrastudio.com',
    },
    {
        icon: Phone,
        title: 'Call Us',
        description: 'Monday - Friday, 9 AM - 6 PM IST',
        value: '+91 80 4567 8900',
        action: 'tel:+918045678900',
    },
    {
        icon: MapPin,
        title: 'Visit Us',
        description: 'Our headquarters',
        value: 'Bangalore, Karnataka, India',
        action: 'https://maps.google.com',
    },
];

const INQUIRY_TYPES = [
    'General Inquiry',
    'Sales & Pricing',
    'Technical Support',
    'Partnership',
    'Press & Media',
    'Careers',
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        inquiryType: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
        setFormData({ name: '', email: '', company: '', inquiryType: '', message: '' });
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen py-16 lg:py-24">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-primary font-mono text-sm mb-2 block">// CONTACT</span>
                    <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Have a question or want to learn more? We'd love to hear from you.
                        Our team typically responds within 24 hours.
                    </p>
                </div>

                {/* Contact Options */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {CONTACT_OPTIONS.map((option) => (
                        <a
                            key={option.title}
                            href={option.action}
                            target={option.action.startsWith('http') ? '_blank' : undefined}
                            rel={option.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                            <Card variant="glass" className="h-full hover:border-primary/30 transition-all cursor-pointer">
                                <CardContent className="pt-6 text-center">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                                        <option.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-1">{option.title}</h3>
                                    <p className="text-xs text-muted-foreground mb-2">{option.description}</p>
                                    <p className="text-sm text-primary font-medium">{option.value}</p>
                                </CardContent>
                            </Card>
                        </a>
                    ))}
                </div>

                {/* Contact Form */}
                <div className="grid lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3">
                        <Card variant="glass">
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="John Doe"
                                                className="w-full h-11 px-4 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="john@company.com"
                                                className="w-full h-11 px-4 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                                                Company (Optional)
                                            </label>
                                            <input
                                                id="company"
                                                type="text"
                                                value={formData.company}
                                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                placeholder="Acme Inc."
                                                className="w-full h-11 px-4 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="inquiryType" className="block text-sm font-medium text-foreground mb-2">
                                                Inquiry Type *
                                            </label>
                                            <select
                                                id="inquiryType"
                                                required
                                                value={formData.inquiryType}
                                                onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                                                className="w-full h-11 px-4 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            >
                                                <option value="">Select a topic...</option>
                                                {INQUIRY_TYPES.map((type) => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Tell us how we can help..."
                                            className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                        />
                                    </div>

                                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                                        {isSubmitting ? 'Sending...' : (
                                            <>
                                                Send Message
                                                <Send className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Info */}
                        <Card variant="glass">
                            <CardContent className="pt-6">
                                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    Response Time
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    We typically respond within 24 hours on business days. For urgent matters,
                                    please call us directly.
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">General Inquiries</span>
                                        <span className="text-foreground">24 hours</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Sales</span>
                                        <span className="text-foreground">4 hours</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Technical Support</span>
                                        <span className="text-foreground">2 hours</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Live Chat */}
                        <Card variant="glass">
                            <CardContent className="pt-6">
                                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                    Live Chat
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Need instant help? Chat with our support team live during business hours.
                                </p>
                                <Button variant="secondary" className="w-full">
                                    Start Live Chat
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        <Card variant="glass">
                            <CardContent className="pt-6">
                                <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
                                <div className="flex gap-4">
                                    <a
                                        href="https://twitter.com/theorchestrastudio"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                    >
                                        <Twitter className="h-5 w-5" />
                                    </a>
                                    <a
                                        href="https://linkedin.com/company/theorchestrastudio"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                    >
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                    <a
                                        href="https://github.com/theorchestrastudio"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                    >
                                        <Github className="h-5 w-5" />
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
