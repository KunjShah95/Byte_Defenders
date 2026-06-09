import { Zap, Crown, Building2 } from 'lucide-react';
import type { ElementType } from 'react';

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  priceUSD: number;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  icon: ElementType;
  razorpayPlanId?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export const PRICING_TIERS: PricingTier[] = [
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

export const FAQS: FAQ[] = [
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
