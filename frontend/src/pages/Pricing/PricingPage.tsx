import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card, CardContent } from '@/components/common/Card';
import { useAuth } from '@/store/auth.context';
import { toast } from 'sonner';
import {
    CheckCircle,
    Zap,
    Crown,
    Building2,
    ArrowRight,
    Shield,
    Clock,
    Users,
    Sparkles
} from 'lucide-react';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface PricingTier {
    id: string;
    name: string;
    price: number;
    priceUSD: number;
    period: string;
    description: string;
    features: string[];
    highlighted: boolean;
    icon: React.ElementType;
    razorpayPlanId?: string;
}

const PRICING_TIERS: PricingTier[] = [
    {
        id: 'starter',
        name: 'Starter',
        price: 0,
        priceUSD: 0,
        period: 'forever',
        description: 'Perfect for trying out multi-agent collaboration',
        features: [
            '5 sessions per month',
            'Basic agent pipeline',
            'Standard output formats',
            'Community support',
            'Session history (7 days)',
        ],
        highlighted: false,
        icon: Zap,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 2499,
        priceUSD: 29,
        period: '/month',
        description: 'For individuals and small teams who need more power',
        features: [
            'Unlimited sessions',
            'Priority processing',
            'Custom agent configurations',
            'API access',
            'Advanced analytics',
            'Email support',
            'Session history (unlimited)',
            'Export to PDF/Markdown',
        ],
        highlighted: true,
        icon: Crown,
        razorpayPlanId: 'plan_pro_monthly',
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 9999,
        priceUSD: 119,
        period: '/month',
        description: 'For organizations with advanced requirements',
        features: [
            'Everything in Pro',
            'Custom agent training',
            'On-premise deployment option',
            'SLA guarantees (99.9%)',
            'Dedicated account manager',
            'Custom integrations',
            'SSO/SAML support',
            'Audit logs',
            'Priority phone support',
        ],
        highlighted: false,
        icon: Building2,
        razorpayPlanId: 'plan_enterprise_monthly',
    },
];

const FAQS = [
    {
        question: 'Can I change plans anytime?',
        answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any charges.',
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit/debit cards, UPI, Net Banking, and wallets through Razorpay. Enterprise customers can also pay via invoice.',
    },
    {
        question: 'Is there a free trial for paid plans?',
        answer: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start.',
    },
    {
        question: 'What happens when I hit my session limit?',
        answer: 'On the Starter plan, you\'ll be prompted to upgrade. We\'ll never charge you unexpectedly.',
    },
];

export default function PricingPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const loadRazorpay = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleSubscribe = async (tier: PricingTier) => {
        if (tier.price === 0) {
            navigate('/signup');
            return;
        }

        if (!user) {
            toast.error('Please sign in to subscribe');
            navigate('/login');
            return;
        }

        setIsLoading(tier.id);

        try {
            const loaded = await loadRazorpay();
            if (!loaded) {
                toast.error('Failed to load payment gateway');
                return;
            }

            // Calculate price (yearly gets 2 months free)
            const finalPrice = billingCycle === 'yearly'
                ? tier.price * 10 * 100 // 10 months for yearly (2 months free), in paise
                : tier.price * 100; // in paise

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_demo',
                amount: finalPrice,
                currency: 'INR',
                name: 'The Orchestra Studio',
                description: `${tier.name} Plan - ${billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}`,
                image: '/logo.png',
                handler: function (response: any) {
                    toast.success('Payment successful! Welcome to ' + tier.name);
                    console.log('Payment ID:', response.razorpay_payment_id);
                    // Here you would call your backend to verify and activate the subscription
                    navigate('/create');
                },
                prefill: {
                    name: user.displayName || '',
                    email: user.email || '',
                },
                notes: {
                    plan_id: tier.id,
                    billing_cycle: billingCycle,
                },
                theme: {
                    color: '#0d9488',
                    backdrop_color: '#0a0e1a',
                },
                modal: {
                    ondismiss: function () {
                        setIsLoading(null);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Failed to initiate payment');
        } finally {
            setIsLoading(null);
        }
    };

    const getYearlyPrice = (monthlyPrice: number) => {
        return monthlyPrice * 10; // 2 months free
    };

    return (
        <div className="min-h-screen py-16 lg:py-24">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-primary font-mono text-sm mb-2 block">// PRICING</span>
                    <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Start free and scale as you grow. No hidden fees. Cancel anytime.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center gap-3 p-1 bg-secondary/50 rounded-lg">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${billingCycle === 'monthly'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${billingCycle === 'yearly'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Yearly
                            <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">
                                Save 17%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
                    {PRICING_TIERS.map((tier) => (
                        <Card
                            key={tier.id}
                            variant={tier.highlighted ? 'elevated' : 'glass'}
                            className={`relative ${tier.highlighted ? 'border-primary ring-1 ring-primary/20 scale-105' : ''}`}
                        >
                            {tier.highlighted && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                                    Most Popular
                                </div>
                            )}
                            <CardContent className="pt-8 pb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${tier.highlighted ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
                                        }`}>
                                        <tier.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground">{tier.name}</h3>
                                </div>

                                <div className="mb-4">
                                    {tier.price === 0 ? (
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-bold text-foreground">Free</span>
                                            <span className="text-muted-foreground">/{tier.period}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg text-muted-foreground">₹</span>
                                            <span className="text-4xl font-bold text-foreground">
                                                {billingCycle === 'yearly'
                                                    ? getYearlyPrice(tier.price).toLocaleString('en-IN')
                                                    : tier.price.toLocaleString('en-IN')}
                                            </span>
                                            <span className="text-muted-foreground">
                                                /{billingCycle === 'yearly' ? 'year' : 'month'}
                                            </span>
                                        </div>
                                    )}
                                    {tier.price > 0 && billingCycle === 'yearly' && (
                                        <p className="text-xs text-success mt-1">
                                            ₹{(tier.price * 2).toLocaleString('en-IN')} saved per year
                                        </p>
                                    )}
                                </div>

                                <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>

                                <ul className="space-y-3 mb-6">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                                            <span className="text-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className="w-full"
                                    variant={tier.highlighted ? 'primary' : 'secondary'}
                                    onClick={() => handleSubscribe(tier)}
                                    disabled={isLoading === tier.id}
                                >
                                    {isLoading === tier.id ? 'Processing...' : (
                                        tier.price === 0 ? 'Get Started' : 'Subscribe Now'
                                    )}
                                    {tier.price > 0 && <ArrowRight className="ml-2 h-4 w-4" />}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-8 mb-16">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="h-5 w-5 text-success" />
                        <span>Secure payments via Razorpay</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-5 w-5 text-primary" />
                        <span>14-day free trial on paid plans</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-5 w-5 text-amber-400" />
                        <span>Trusted by 1,000+ teams</span>
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-foreground text-center mb-8">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {FAQS.map((faq) => (
                            <Card key={faq.question} variant="glass">
                                <CardContent className="pt-6">
                                    <h3 className="font-medium text-foreground mb-2">{faq.question}</h3>
                                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Enterprise CTA */}
                <Card variant="elevated" className="mt-16 border-primary/20">
                    <CardContent className="p-8 lg:p-12">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-4">
                                    Need a Custom Solution?
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    Our enterprise team can help you with custom agent training,
                                    on-premise deployment, and dedicated support.
                                </p>
                                <Button size="lg" onClick={() => navigate('/contact')}>
                                    Contact Sales
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 rounded-lg bg-secondary/30">
                                    <p className="text-3xl font-bold text-primary">99.9%</p>
                                    <p className="text-sm text-muted-foreground">Uptime SLA</p>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-secondary/30">
                                    <p className="text-3xl font-bold text-primary">24/7</p>
                                    <p className="text-sm text-muted-foreground">Support</p>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-secondary/30">
                                    <p className="text-3xl font-bold text-primary">SOC 2</p>
                                    <p className="text-sm text-muted-foreground">Compliant</p>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-secondary/30">
                                    <p className="text-3xl font-bold text-primary">GDPR</p>
                                    <p className="text-sm text-muted-foreground">Ready</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
