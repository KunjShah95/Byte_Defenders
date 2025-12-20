import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card, CardContent } from '@/components/common/Card';
import {
  ArrowRight,
  Zap,
  Brain,
  RefreshCw,
  Eye,
  GitBranch,
  Layers,
  Target,
  Clock,
  Sparkles,
  Shield,
  BarChart3,
  Users,
  Star,
  ChevronRight,
  Play,
  CheckCircle,
  MessageSquare,
  TrendingUp,
  Cpu,
  Network,
  Workflow,
  Lightbulb
} from 'lucide-react';

const MARQUEE_ITEMS = [
  'Advanced Reasoning',
  'Autonomous Orchestration',
  'Zero-Shot Refinement',
  'Chain-of-Thought Logs',
  'Deterministic Output',
  'Multi-Agent Synthesis',
  'Contextual Memory',
];

function Marquee({ items, direction = 'left' }: { items: string[]; direction?: 'left' | 'right' }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden whitespace-nowrap py-4">
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
      <div
        className={`inline-flex gap-12 ${direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse'}`}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground/50"
          >
            <span className="h-1 w-1 rounded-full bg-primary/30" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

const STATS = [
  { value: '4', label: 'Specialized Agents', icon: Cpu },
  { value: '2-3', label: 'Avg Iterations', icon: RefreshCw },
  { value: '85%', label: 'Improvement Rate', icon: TrendingUp },
  { value: '<60s', label: 'Total Runtime', icon: Clock },
];

const USE_CASES = [
  {
    icon: Lightbulb,
    title: 'Startup Ideas',
    description: 'Transform raw startup concepts into validated business propositions with market analysis.',
    color: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-400',
  },
  {
    icon: MessageSquare,
    title: 'Content Creation',
    description: 'Generate compelling marketing copy, blog posts, and social media content at scale.',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: Workflow,
    title: 'Product Design',
    description: 'Iterate on product features and UX flows with structured feedback loops.',
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: BarChart3,
    title: 'Strategy Planning',
    description: 'Develop comprehensive business strategies with SWOT analysis and action items.',
    color: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400',
  },
];

const TESTIMONIALS = [
  {
    quote: "This multi-agent system transformed our brainstorming sessions. Ideas that used to take days now get refined in minutes.",
    author: "Sarah Chen",
    role: "Product Lead, TechVentures",
    avatar: "SC",
  },
  {
    quote: "The explainability feature is a game-changer. We can see exactly how each agent contributed to the final output.",
    author: "Marcus Johnson",
    role: "AI Research Director, InnoLabs",
    avatar: "MJ",
  },
  {
    quote: "Finally, an AI tool that doesn't feel like a black box. The transparency builds trust with stakeholders.",
    author: "Priya Sharma",
    role: "Strategy Consultant, Deloitte",
    avatar: "PS",
  },
];

const PRICING_TIERS = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for trying out multi-agent collaboration',
    features: [
      '5 sessions per month',
      'Basic agent pipeline',
      'Standard output formats',
      'Community support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '₹2,499',
    period: '/month',
    description: 'For teams that need more power and flexibility',
    features: [
      'Unlimited sessions',
      'Priority processing',
      'Custom agent configs',
      'API access',
      'Advanced analytics',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For organizations with advanced requirements',
    features: [
      'Everything in Pro',
      'Custom agent training',
      'On-premise deployment',
      'SLA guarantees',
      'Dedicated account manager',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const FAQ_ITEMS = [
  {
    question: 'How do the AI agents collaborate?',
    answer: 'Our system uses a pipeline architecture where each specialized agent (Idea, Critic, Refiner, Presenter) processes the output sequentially. Each agent adds value through their unique perspective, creating a refined final output through structured collaboration.',
  },
  {
    question: 'What makes this different from ChatGPT?',
    answer: 'Unlike single-model systems, our multi-agent approach provides built-in quality control through the Critic agent, iterative refinement, and complete transparency. You can see exactly how each agent contributed to the final result.',
  },
  {
    question: 'Can I customize the agents?',
    answer: 'Pro and Enterprise plans include custom agent configurations. You can adjust critique criteria, refinement strategies, and output formats to match your specific use case and industry requirements.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take security seriously. All data is encrypted in transit and at rest. Enterprise plans include options for on-premise deployment and custom data retention policies.',
  },
];

function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    if (isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }

    let current = 0;
    const increment = numericValue / 30;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current).toString());
      }
    }, 50);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}{suffix}</span>;
}

function FAQItem({ question, answer, isOpen, onClick }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left hover:text-primary transition-colors group"
      >
        <span className="font-medium text-white/90 group-hover:text-primary transition-colors">{question}</span>
        <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <div className="pb-6 text-muted-foreground text-sm animate-in fade-in slide-in-from-top-2 duration-300">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/30 selection:text-white overflow-x-hidden">
      {/* Vertical Grid Lines - Signature Design Element */}
      <div className="fixed inset-0 pointer-events-none -z-10 flex justify-center overflow-hidden">
        <div className="w-full max-w-7xl h-full border-x border-white/[0.03] relative">
          <div className="absolute left-1/4 h-full border-r border-white/[0.03]" />
          <div className="absolute left-1/2 h-full border-r border-white/[0.03]" />
          <div className="absolute left-3/4 h-full border-r border-white/[0.03]" />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden mesh-gradient">
        <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

        <div className="container relative z-10 px-4 mx-auto">
          <div className="mx-auto max-w-5xl text-center space-y-10 animate-in slide-in-from-bottom-4 duration-1000">


            <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white leading-[0.9]">
              The Orchestra <br />
              <span className="text-gradient">Studio</span>.
            </h1>

            <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground/80 leading-relaxed font-light">
              Don't just prompt. Orchestrate a team of specialized AI agents that think,
              critique, and refine your vision until it's flawless.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                size="lg"
                onClick={() => navigate('/create')}
                className="h-14 px-8 text-base bg-primary text-primary-foreground hover:scale-105 transition-transform group"
              >
                Launch New Workspace
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/history')}
                className="h-14 px-8 text-base border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all font-medium text-white"
              >
                <Play className="mr-2 h-4 w-4 fill-current" />
                Watch Runtime Demo
              </Button>
            </div>

            <div className="pt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>No credit card needed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>5 free sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Full explainability</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="border-y border-border bg-secondary/30 py-6">
        <Marquee items={MARQUEE_ITEMS} direction="left" />
      </section>

      {/* Stats Section */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative text-center p-8 border border-white/5 rounded-2xl bg-white/[0.02]">
                  <stat.icon className="h-8 w-8 text-primary/50 mx-auto mb-4 group-hover:text-primary transition-colors" />
                  <p className="text-4xl font-bold text-white mb-2 leading-none">
                    <AnimatedCounter value={stat.value} />
                  </p>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline Section */}
      <section className="py-24 lg:py-40 relative">
        <div className="container relative z-10 px-4 mx-auto">
          <div className="mb-24 flex flex-col md:flex-row items-end justify-between gap-12">
            <div className="max-w-xl">
              <div className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-6">01 // THE PIPELINE</div>
              <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                Deep Reasoning <br />By Design.
              </h2>
            </div>
            <p className="max-w-md text-muted-foreground text-lg md:text-xl font-light leading-relaxed mb-2">
              Every concept runs through our proprietary agent chain, ensuring every weakness is addressed before you ever see the output.
            </p>
          </div>

          <div className="grid gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden md:grid-cols-4">
            {[
              { icon: '💡', title: 'Context Engine', step: 'INITIALIZE', desc: 'Parses your prompt into structured agent instructions.' },
              { icon: '🔍', title: 'Adversarial Review', step: 'CRITIQUE', desc: 'Identifies logical gaps and edge-case failures.' },
              { icon: '✨', title: 'Optimization Loop', step: 'REFINE', desc: 'Iteratively solves for feedback to maximize quality.' },
              { icon: '📊', title: 'Synthesis', step: 'DELIVER', desc: 'Formats insights into production-ready deliverables.' },
            ].map((agent, index) => (
              <div key={agent.title} className="bg-background group p-12 hover:bg-white/[0.02] transition-colors relative">
                <div className="text-[10px] font-bold text-primary mb-10 tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">{agent.step}</div>
                <div className="text-5xl mb-8 grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">{agent.icon}</div>
                <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">{agent.title}</h3>
                <p className="text-muted-foreground/70 leading-relaxed font-light">{agent.desc}</p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 lg:py-32 bg-secondary/10">
        <div className="container px-4 mx-auto">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <div className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-4">// APPLICABILITY</div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Built for Every Creative Challenge
            </h2>
            <p className="text-lg text-muted-foreground font-light">
              From high-stakes startup pitches to complex technical architectures, our multi-agent system adapts to your specific requirements.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {USE_CASES.map((useCase) => (
              <Card
                key={useCase.title}
                variant="glass"
                className="group cursor-pointer border-white/5 hover:border-primary/50 transition-all duration-500"
                onClick={() => navigate('/create')}
              >
                <CardContent className="p-8">
                  <div className={`mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${useCase.color} group-hover:scale-110 transition-transform`}>
                    <useCase.icon className={`h-7 w-7 ${useCase.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">{useCase.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-light text-sm mb-6">{useCase.description}</p>
                  <div className="flex items-center text-primary text-sm font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
                    Initiate Session <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-24 lg:py-40 bg-background relative overflow-hidden">
        <div className="container px-4 mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="text-primary font-mono text-xs uppercase tracking-[0.3em]">02 // TRANSPARENCY</div>
              <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[1.1]">
                No Black Boxes, <br />Only <span className="text-gradient">Logic</span>.
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed font-light max-w-lg">
                We believe AI should be auditable. Every decision, modification, and critique is recorded in full, giving you a complete audit trail.
              </p>
              <div className="grid sm:grid-cols-2 gap-8 pt-4">
                {[
                  { icon: Eye, title: 'Full Traceability', desc: 'Every agent step is logged with nano-second precision.' },
                  { icon: Shield, title: 'Auditable Paths', desc: 'Check reasoning logic for every iterative refinement.' }
                ].map((item, i) => (
                  <div key={i} className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="text-lg text-white font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-[#020617] rounded-3xl border border-white/10 p-2 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/40" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                    <div className="w-3 h-3 rounded-full bg-green-500/40" />
                  </div>
                  <div className="text-[10px] text-white/40 font-mono uppercase tracking-[0.3em]">Execution_Stream.log</div>
                  <div className="w-8" />
                </div>
                <div className="p-10 space-y-6 font-mono text-xs leading-relaxed max-h-[400px] overflow-y-auto scrollbar-thin">
                  <div className="flex gap-4">
                    <span className="text-primary/60 shrink-0">12:04:22</span>
                    <span className="text-primary font-bold shrink-0">[SYS]</span>
                    <span className="text-white/80">Initializing Multi-Agent Pipeline... OK</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-white/20 shrink-0">12:04:23</span>
                    <span className="text-accent font-bold shrink-0">[IDEA]</span>
                    <span className="text-muted-foreground italic">"Generating conceptual framework for decentralized storage..."</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-white/20 shrink-0">12:04:25</span>
                    <span className="text-red-400 font-bold shrink-0">[CRITIC]</span>
                    <span className="text-white/90">Identifying potential latency bottleneck in Step 4. Recommending refinement.</span>
                  </div>
                  <div className="flex gap-4 border-l-2 border-primary/40 pl-6 py-4 bg-primary/5 rounded-r-lg">
                    <span className="text-white/20 shrink-0">12:04:28</span>
                    <span className="text-primary font-bold shrink-0">[REFINER]</span>
                    <span className="text-white font-medium">Recalculating shard distribution... Latency bottleneck resolved. Score: 9.4/10</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-white/20 shrink-0">12:04:30</span>
                    <span className="text-success font-bold shrink-0">[FINAL]</span>
                    <span className="text-white/80">Compiling deliverable artifact... Ready.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 lg:py-32 bg-background relative">
        <div className="container px-4 mx-auto">
          <div className="mb-20 text-center">
            <div className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-4">// ENDORSEMENTS</div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Trusted by Innovators</h2>
            <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">See how The Orchestra Studio is redefining the standard for AI-assisted creation.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <Card key={testimonial.author} variant="glass" className="border-white/5 hover:border-primary/20 transition-all p-2">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-white/80 mb-8 text-lg font-light leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold border border-primary/20">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest pt-1">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 lg:py-32 bg-secondary/5">
        <div className="container px-4 mx-auto">
          <div className="mb-20 text-center">
            <div className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-4">// INVESTMENT</div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Professional Plans</h2>
            <p className="text-lg text-muted-foreground font-light">Simple, scalable pricing for individuals and teams.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {PRICING_TIERS.map((tier) => (
              <Card
                key={tier.name}
                className={`relative overflow-hidden transition-all duration-500 hover:scale-[1.02] ${tier.highlighted ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-white/5 bg-white/[0.02]'}`}
              >
                {tier.highlighted && (
                  <div className="absolute top-0 right-0 p-4">
                    <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Recommended</span>
                  </div>
                )}
                <CardContent className="p-10">
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mt-4 mb-8">
                    <span className="text-5xl font-bold text-white tracking-tighter">{tier.price}</span>
                    {tier.period && <span className="text-muted-foreground font-light">{tier.period}</span>}
                  </div>
                  <p className="text-muted-foreground text-sm font-light mb-10 leading-relaxed h-12">{tier.description}</p>

                  <div className="space-y-4 mb-10">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-white/80 font-light">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full h-12 text-sm font-semibold tracking-wide"
                    variant={tier.highlighted ? 'primary' : 'outline'}
                    onClick={() => navigate('/create')}
                  >
                    {tier.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="mb-16 text-center">
              <div className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-4">// PERSISTENCE</div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Common Inquiries</h2>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden px-8">
              {FAQ_ITEMS.map((item, index) => (
                <FAQItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openFAQ === index}
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 lg:py-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="container px-4 mx-auto relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-10 border border-primary/20 transform rotate-12">
              <Layers className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-5xl md:text-8xl font-bold text-white tracking-tight leading-[0.9]">
              Start Orchestrating <br />Your Vision <span className="text-primary">Today</span>.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              Join the elite teams of builders who use The Orchestra Studio to stress-test their best ideas.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-6">
              <Button
                size="lg"
                onClick={() => navigate('/signup')}
                className="h-16 px-10 text-lg bg-primary text-primary-foreground hover:scale-105 transition-transform group"
              >
                Create Free Account
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => navigate('/history')}
                className="h-16 px-10 text-lg text-white hover:bg-white/5"
              >
                Browse Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-24 bg-background">
        <div className="container px-4 mx-auto">
          <div className="grid gap-12 md:grid-cols-4 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">The Orchestra Studio</span>
              </div>
              <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-sm mb-10">
                The world's most advanced multi-agent orchestration platform for serious creators and engineers.
              </p>
              <div className="flex items-center gap-6">
                {[
                  { icon: Network, href: '#' },
                  { icon: GitBranch, href: '#' },
                  { icon: MessageSquare, href: '#' }
                ].map((social, i) => (
                  <a key={i} href={social.href} className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-muted-foreground hover:text-white hover:border-white/20 transition-all">
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-8 tracking-wider uppercase text-xs">Architecture</h4>
              <ul className="space-y-4 text-sm font-light">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Orchestrator</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Agent SDK</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Execution Logs</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Context Memory</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-8 tracking-wider uppercase text-xs">Resources</h4>
              <ul className="space-y-4 text-sm font-light">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">API Keys</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Security Audit</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Status Page</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-8 tracking-wider uppercase text-xs">Legal</h4>
              <ul className="space-y-4 text-sm font-light">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-muted-foreground font-mono tracking-widest uppercase">
              © 2024 The Orchestra Studio Inc. // Protocol v2.0.4-LOCKED
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-primary/60 uppercase tracking-[0.2em]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              All Systems Operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
