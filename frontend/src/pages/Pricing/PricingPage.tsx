import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import { Spotlight } from '@/components/aceternity/Spotlight';
import { useAuth } from '@/store/auth.context';
import { toast } from 'sonner';
import { CheckCircle, ArrowRight, Shield, Clock, Users, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { PRICING_TIERS, FAQS } from '@/constants/pricing';
import type { PricingTier } from '@/constants/pricing';

type RazorpayOptions = Record<string, unknown>;

interface RazorpayConstructor {
  new(options: RazorpayOptions): {
    open: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

const COMPARISON_FEATURES = [
  { name: 'Sessions / month', starter: '5 sessions', pro: 'Unlimited', enterprise: 'Unlimited + Dedicated clusters' },
  { name: 'Agent Pipeline', starter: 'Standard (3 agents)', pro: 'Adversarial (4 agents)', enterprise: 'Custom configurable pipelines' },
  { name: 'Priority Queue', starter: '❌ No', pro: '✅ Yes', enterprise: '✅ Dedicated queue (Instant execution)' },
  { name: 'API Integration', starter: '❌ No', pro: '✅ Direct API key', enterprise: '✅ Custom SDKs & Webhooks' },
  { name: 'Export Formats', starter: 'Markdown only', pro: 'PDF, MD, Docx, Slides', enterprise: 'All formats + JSON schema export' },
  { name: 'SLA Guarantee', starter: '❌ No', pro: '❌ No', enterprise: '✅ 99.9% Uptime guarantee' },
  { name: 'Support Channel', starter: 'Community forums', pro: 'Priority Email support', enterprise: 'Dedicated account lead + Slack' },
];

export default function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [showMatrix, setShowMatrix] = useState(false);

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (tier: PricingTier) => {
    if (tier.price === 0) { navigate('/signup'); return; }
    if (!user) { toast.error('Please sign in to subscribe'); navigate('/login'); return; }
    setIsLoading(tier.id);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { toast.error('Failed to load payment gateway'); return; }

      const amountInRupees = currency === 'INR' 
        ? (billingCycle === 'yearly' ? tier.price * 10 : tier.price)
        : (billingCycle === 'yearly' ? tier.priceUSD * 10 * 85 : tier.priceUSD * 85); // Convert USD to INR approximate for Razorpay

      const finalPrice = Math.round(amountInRupees * 100);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_demo',
        amount: finalPrice, 
        currency: 'INR', 
        name: 'The Orchestra Studio',
        description: `${tier.name} Plan - ${billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}`,
        image: '/logo.png',
        handler: function () {
          toast.success('Payment successful! Welcome to ' + tier.name);
          navigate('/create');
        },
        prefill: { name: user.displayName || '', email: user.email || '' },
        notes: { plan_id: tier.id, billing_cycle: billingCycle, currency: currency },
        theme: { color: '#22c55e', backdrop_color: '#09090b' },
        modal: { ondismiss: function () { setIsLoading(null); } }
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) { 
      toast.error('Failed to initiate payment'); 
    } finally { 
      setIsLoading(null); 
    }
  };

  const formatPrice = (tier: PricingTier) => {
    if (tier.price === 0) return 'Free';
    const amount = currency === 'INR' 
      ? (billingCycle === 'yearly' ? tier.price * 10 : tier.price)
      : (billingCycle === 'yearly' ? tier.priceUSD * 10 : tier.priceUSD);
    
    const prefix = currency === 'INR' ? '₹' : '$';
    return `${prefix}${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="relative min-h-screen bg-black text-white py-24 selection:bg-primary/20 font-sans overflow-x-hidden">
      
      {/* Background Layout lines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="mx-auto h-full max-w-7xl w-full grid-layout-lines" />
      </div>

      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
      <BackgroundBeams className="opacity-10 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 max-w-6xl">
        
        {/* ========== HEADER ========== */}
        <div className="mb-20 text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mt-4 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl font-display select-none cursor-default group"
          >
            Clear pricing for<br />
            <span className="text-gradient-glow relative inline-block group-hover:scale-105 transition-transform duration-300">scalable workspaces</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400 font-light leading-relaxed"
          >
            Choose a plan that fits your execution pace. Upgrade or downgrade at any time.
          </motion.p>

          {/* Controls Panel */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* Billing cycle toggle */}
            <div className="inline-flex items-center gap-1 rounded-full border border-white/5 bg-neutral-950/40 p-1 backdrop-blur-sm">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-full px-5 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                  billingCycle === 'monthly' ? 'bg-primary text-black font-bold' : 'text-neutral-500 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={`rounded-full px-5 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                  billingCycle === 'yearly' ? 'bg-primary text-black font-bold' : 'text-neutral-500 hover:text-white'
                }`}
              >
                Yearly
                <span className="rounded-full bg-success/20 px-2 py-0.5 text-[9px] text-success font-semibold tracking-normal lowercase">save 17%</span>
              </button>
            </div>

            {/* Currency selector toggle */}
            <div className="inline-flex items-center gap-1 rounded-full border border-white/5 bg-neutral-950/40 p-1 backdrop-blur-sm">
              <button 
                onClick={() => setCurrency('INR')}
                className={`rounded-full px-4 py-1.5 text-xs font-mono transition-all duration-300 ${
                  currency === 'INR' ? 'bg-white/10 text-white font-bold' : 'text-neutral-600 hover:text-neutral-300'
                }`}
              >
                INR (₹)
              </button>
              <button 
                onClick={() => setCurrency('USD')}
                className={`rounded-full px-4 py-1.5 text-xs font-mono transition-all duration-300 ${
                  currency === 'USD' ? 'bg-white/10 text-white font-bold' : 'text-neutral-600 hover:text-neutral-300'
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>

        {/* ========== PRICING CARDS ========== */}
        <div className="grid gap-6 md:grid-cols-3 mb-20 max-w-5xl mx-auto">
          {PRICING_TIERS.map((tier) => {
            const isHighlighted = tier.highlighted;
            return (
              <div 
                key={tier.id}
                className={`relative rounded-xl border p-8 flex flex-col justify-between backdrop-blur-sm transition-all duration-300 ${
                  isHighlighted 
                    ? 'border-primary/30 bg-neutral-950/40 shadow-lg shadow-primary/5' 
                    : 'border-white/5 bg-neutral-950/10 hover:border-neutral-800'
                }`}
              >
                {/* Conic beam border glow for pro highlighted tier */}
                {isHighlighted && (
                  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                    <div className="absolute -inset-[500%] animate-[spin_12s_linear_infinite] opacity-30 conic-beam bg-[conic-gradient(from_0deg,transparent,hsl(var(--primary)),transparent_70%)]" />
                    <div className="absolute inset-px rounded-[11px] bg-black/95 z-0" />
                  </div>
                )}

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white font-display">{tier.name}</h3>
                    {isHighlighted && (
                      <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-[9px] font-mono uppercase tracking-widest text-primary font-semibold">
                        Recommended
                      </span>
                    )}
                  </div>

                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white font-display">{formatPrice(tier)}</span>
                    <span className="text-neutral-500 text-xs font-mono uppercase tracking-wider">
                      {tier.price === 0 ? '' : (billingCycle === 'yearly' ? '/ year' : '/ month')}
                    </span>
                  </div>

                  <p className="text-sm text-neutral-400 font-light leading-relaxed mb-8">{tier.description}</p>

                  <ul className="space-y-3.5 mb-8">
                    {tier.features.slice(0, 5).map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-xs">
                        <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <span className="text-neutral-300 font-light font-mono">{f}</span>
                      </li>
                    ))}
                    {tier.features.length > 5 && (
                      <li className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider pt-1">
                        + {tier.features.length - 5} additional advantages
                      </li>
                    )}
                  </ul>
                </div>

                <div className="relative z-10 pt-4">
                  <Button 
                    className={`w-full h-11 text-xs font-mono uppercase tracking-widest ${
                      isHighlighted 
                        ? 'bg-primary text-black font-bold hover:bg-primary/95' 
                        : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                    }`}
                    onClick={() => handleSubscribe(tier)}
                    disabled={isLoading === tier.id}
                  >
                    {isLoading === tier.id ? 'Processing...' : (tier.price === 0 ? 'Start Free' : 'Initiate Checkout')}
                    {tier.price > 0 && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========== EXPANDABLE COMPARISON TABLE ========== */}
        <div className="mb-24 max-w-4xl mx-auto border border-white/5 rounded-xl overflow-hidden bg-neutral-950/20">
          <button
            onClick={() => setShowMatrix(!showMatrix)}
            className="w-full flex items-center justify-between p-6 hover:bg-neutral-900/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-white font-display">Expand Detailed Feature Comparison</span>
            </div>
            {showMatrix ? <ChevronUp className="h-5 w-5 text-neutral-400" /> : <ChevronDown className="h-5 w-5 text-neutral-400" />}
          </button>

          <AnimatePresence>
            {showMatrix && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="border-t border-white/5 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-neutral-950/40 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                        <th className="p-4 pl-6">Feature Specs</th>
                        <th className="p-4">Starter</th>
                        <th className="p-4">Pro</th>
                        <th className="p-4 pr-6">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-mono divide-y divide-white/[0.02]">
                      {COMPARISON_FEATURES.map((row) => (
                        <tr key={row.name} className="hover:bg-neutral-950/30 transition-colors">
                          <td className="p-4 pl-6 font-display font-medium text-neutral-300">{row.name}</td>
                          <td className="p-4 text-neutral-500 font-light">{row.starter}</td>
                          <td className="p-4 text-neutral-300 font-medium">{row.pro}</td>
                          <td className="p-4 pr-6 text-primary">{row.enterprise}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========== TRUST / SUPPORT BADGES ========== */}
        <div className="mb-24 flex flex-wrap justify-center gap-10 border-t border-b border-white/5 py-8 max-w-4xl mx-auto">
          {[
            { icon: Shield, text: 'Secure payments via Razorpay token keys', color: 'text-primary' },
            { icon: Clock, text: 'Cancel or prorate subscription instantly', color: 'text-cyan-400' },
            { icon: Users, text: 'Used by tech leads and product architects', color: 'text-purple-400' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 text-xs font-mono tracking-wider text-neutral-400">
              <item.icon className={`h-4.5 w-4.5 ${item.color}`} />
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* ========== FAQS SECTION ========== */}
        <div className="mx-auto mb-24 max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white font-display">Common Queries</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.question} className="rounded-xl border border-white/5 bg-neutral-950/20 p-6 backdrop-blur-sm">
                <h3 className="mb-2 text-sm font-semibold text-white font-display">{faq.question}</h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed font-mono">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ========== ENTERPRISE CTA ========== */}
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-neutral-950/20 p-8 lg:p-12 max-w-5xl mx-auto">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-white font-display">Require Custom Models or Self-Sync?</h2>
              <p className="mb-6 text-sm text-neutral-400 font-light leading-relaxed">
                We design dedicated agent loops trained on your proprietary codebase, with full options for on-premise execution or end-to-end audit replication.
              </p>
              <Button size="lg" onClick={() => navigate('/contact')} className="bg-primary hover:bg-primary/90 text-black font-mono uppercase tracking-widest text-xs h-11">
                Contact Sales <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['99.9%', 'Uptime SLA'], 
                ['24/7/365', 'Slack Bridge'], 
                ['SOC 2 Type II', 'Data Compliance'], 
                ['Local', 'Sync Protocols']
              ].map(([val, label]) => (
                <div key={label} className="rounded-lg border border-white/5 bg-black/60 p-5 text-center">
                  <p className="text-2xl font-extrabold text-primary font-display">{val}</p>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
