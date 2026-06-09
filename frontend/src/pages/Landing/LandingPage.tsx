import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { AuroraBackground } from '@/components/aceternity/AuroraBackground';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import { Spotlight } from '@/components/aceternity/Spotlight';
import { TextGenerateEffect } from '@/components/aceternity/TextGenerateEffect';
import {
  ArrowRight, Eye, Play, CheckCircle,
  MessageSquare, Shield,
  ChevronDown, Lightbulb, Heart, Quote, Coffee
} from 'lucide-react';

const painPoints = [
  { icon: Lightbulb, title: 'That 2 AM idea', description: 'You wake up with something that feels electric. By morning, you are second-guessing whether it is actually good.' },
  { icon: MessageSquare, title: 'The friend test', description: 'You pitch it to a friend. They say "sounds cool" because they are nice. You still have no idea if it works.' },
  { icon: Heart, title: 'The lonely build', description: 'You start coding or writing alone. Three weeks in, you hit a wall you could have seen coming if someone had just asked the right questions.' },
];

const howItWorks = [
  { title: 'You share your raw thought', description: 'A messy paragraph, a voice note, a half-baked diagram. No need to dress it up.' },
  { title: 'We argue about it', description: 'One model plays editor. One plays skeptic. They go back and forth, sharpening what you actually mean.' },
  { title: 'You get back something real', description: 'A structured brief. A cleaned-up spec. A pitch that does not sound like it was written by a robot.' },
];

const testimonials = [
  { quote: "I used to sit alone at my desk for hours staring at a blank screen. Having someone—even an AI system—push back on my ideas made me feel like I was not building in a vacuum anymore.", author: "Sarah Chen", role: "Solo Founder", avatar: "SC" },
  { quote: "ChatGPT told me my billing logic was great. The critic here found three holes in ten seconds. I almost did not ship that feature.", author: "Marcus Johnson", role: "Indie Hacker", avatar: "MJ" },
  { quote: "Watching the debate logs feels like standing outside a room where two smart people are arguing about your work. It is uncomfortable and exactly what I needed.", author: "Priya Sharma", role: "Product Designer", avatar: "PS" },
];

const faqItems = [
  { question: 'Why not just use ChatGPT?', answer: 'ChatGPT is trained to be agreeable. It will tell you your idea has potential because that is what helpful assistants do. Our system is designed to push back, because the fastest way to improve an idea is to stress-test it while it is still cheap to change.' },
  { question: 'Who is this actually for?', answer: 'Solo founders who do not have a co-founder to argue with. Indie hackers who ship alone. Designers and writers who want a real editor, not a cheerleader. Basically anyone who has ever thought, "I wish someone would just tell me if this is stupid."' },
  { question: 'How does the back-and-forth work?', answer: 'You give us a raw thought. An agent drafts a first pass. A second agent reads it like a cynical product lead and lists everything wrong with it. A third rewrites based on that feedback. You see every step in plain text.' },
  { question: 'Is my idea safe?', answer: 'We do not train on your sessions. Your data is encrypted and we do not share it. We built this because we wanted a tool we could trust ourselves.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground font-sans">
      
      {/* Background global layout gridlines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="mx-auto h-full max-w-7xl w-full grid-layout-lines" />
      </div>

      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-screen flex items-center justify-center border-b border-border">
        <div className="absolute inset-0 z-0">
          <AuroraBackground className="h-full w-full opacity-60" />
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
          <BackgroundBeams className="opacity-10" />
        </div>

        <div className="container relative z-10 mx-auto px-6 py-32 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-10"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-neutral-400 tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Adversarial AI Spec Drafting Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl font-display"
          >
            Turn raw ideas into<br />
            <span className="text-gradient-glow relative inline-block group hover:scale-105 transition-transform duration-300">production-ready specs</span>
            <span className="text-white">.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="mt-10 max-w-2xl"
          >
            <TextGenerateEffect
              words="Draft, critique, and refine your product briefs in seconds. We chain four specialized AI agents in a continuous debate loop to stress-test your logic, catch edge cases, and compile robust, human-readable specifications."
              className="text-lg md:text-xl text-neutral-400 font-light leading-relaxed"
              filter={false}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="mt-12 flex flex-col gap-5 sm:flex-row"
          >
            <Button
              size="lg"
              onClick={() => navigate('/create')}
              className="group relative h-14 overflow-hidden rounded-xl bg-primary px-8 text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Try it free
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/about')}
              className="h-14 border-border bg-muted/20 hover:bg-muted/40 px-8 text-base font-medium text-foreground backdrop-blur-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="mr-2 h-4 w-4 fill-foreground" />
              How it works
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            className="mt-16 flex flex-wrap gap-8 text-xs font-mono uppercase tracking-widest text-muted-foreground"
          >
            {['No credit card required', '5 free sessions', 'Plain text logs — no black boxes'].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== THE PAIN POINT ========== */}
      <section className="py-24 border-b border-border bg-background/60">
        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <div className="mb-16">
            <h2 className="text-4xl font-extrabold text-foreground sm:text-5xl font-display tracking-tight">
              You know the feeling<span className="text-primary">.</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground font-light max-w-2xl">
              A raw idea hits you. It feels right. But you have no one to bounce it off. So you sit on it, or you build it wrong.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {painPoints.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-xl border border-border bg-background/80 p-8 hover:bg-card/90 transition-all duration-300"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted border border-border text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground font-display">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="py-28 border-b border-border relative bg-background/40">
        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <div className="mb-16">
            <h2 className="text-4xl font-extrabold text-foreground sm:text-5xl font-display tracking-tight">
              It is simpler than it sounds<span className="text-primary">.</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground font-light max-w-2xl">
              No dashboards. No setup. Just your idea and a conversation that sharpens it.
            </p>
          </div>

          <div className="space-y-16">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-6 items-start group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-sm font-mono font-bold text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="pt-1.5">
                  <h3 className="text-xl font-bold text-foreground font-display mb-2">{step.title}</h3>
                  <p className="text-muted-foreground font-light leading-relaxed max-w-xl">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHY IT WORKS ========== */}
      <section className="py-28 border-b border-border bg-background/70">
        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <div className="mb-16">
            <h2 className="text-4xl font-extrabold text-foreground sm:text-5xl font-display tracking-tight">
              Polite AI is useless<span className="text-primary">.</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground font-light max-w-2xl">
              Every chatbot tells you your idea is great. That is not helpful. What helps is someone who actually reads your work and tells you where it breaks.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-background/80 p-8">
              <h3 className="text-xl font-bold text-foreground font-display mb-3">One drafts</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">Takes your messy notes and builds a first version. It captures what you meant, even if you said it badly.</p>
            </div>
            <div className="rounded-xl border border-border bg-background/80 p-8">
              <h3 className="text-xl font-bold text-foreground font-display mb-3">One critiques</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">Reads it like an editor who has seen too many bad launches. It looks for weak logic, missing steps, and things that will break later.</p>
            </div>
            <div className="rounded-xl border border-border bg-background/80 p-8 md:col-span-2">
              <h3 className="text-xl font-bold text-foreground font-display mb-3">One rewrites</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-2xl">Takes the critique and fixes the original. This loop runs until the output is tight enough that even the skeptic has nothing left to say.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== LOGS ========== */}
      <section className="py-28 border-b border-border bg-background/90">
        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <div className="grid items-center gap-16 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-4xl font-extrabold leading-tight text-foreground sm:text-5xl font-display tracking-tight">
                You see everything.<br />
                No black boxes<span className="text-primary">.</span>
              </h2>
              <p className="text-muted-foreground text-lg font-light leading-relaxed">
                Every draft, every critique, every rewrite is logged in plain text. You can read the exact instructions each model received. No hidden prompts, no secret tweaks.
              </p>
              
              <div className="space-y-4 pt-4">
                {[
                  { icon: Eye, title: 'Full transcript', desc: 'Every message between agents, timestamped and readable.' },
                  { icon: Shield, title: 'No secrets', desc: 'You see the system prompts. You see the edits. Nothing is hidden.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-lg border border-border bg-card/70">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted border border-border text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-base font-display">{item.title}</h4>
                      <p className="text-sm text-muted-foreground/70 font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 relative">
              <div className="absolute -inset-2 rounded-2xl bg-primary/5 blur-2xl opacity-40 pointer-events-none" />
              <div className="relative overflow-hidden rounded-xl border border-border bg-card/90 shadow-2xl">
                <div className="flex items-center justify-between border-b border-border bg-muted/80 p-4">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-muted/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-muted/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-muted/70" />
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.2m] text-muted-foreground">session_log.txt</div>
                  <div className="w-8" />
                </div>
                <div className="max-h-[360px] space-y-4 overflow-y-auto p-6 font-mono text-xs leading-relaxed text-muted-foreground scrollbar-thin">
                  {[
                    { time: '06:04:12', tag: 'INPUT', tagColor: 'text-muted-foreground', msg: 'Received user prompt: "A food delivery app for elderly people..."', highlight: false },
                    { time: '06:04:14', tag: 'DRAFT', tagColor: 'text-primary', msg: 'Structured initial proposal with 3 core features', highlight: false },
                    { time: '06:04:19', tag: 'CRITIC', tagColor: 'text-red-400', msg: 'Found 2 issues: accessibility assumption in checkout flow is not validated.', highlight: false },
                    { time: '06:04:24', tag: 'REVISE', tagColor: 'text-cyan-400', msg: 'Rewrote checkout section with simplified text and larger tap targets.', highlight: true },
                    { time: '06:04:29', tag: 'DONE', tagColor: 'text-green-400', msg: 'Final brief ready. 12 sections, 3 revisions applied.', highlight: false },
                  ].map((entry, i) => (
                    <div key={i} className={`flex gap-4 ${entry.highlight ? 'rounded border border-primary/20 bg-primary/5 py-3 px-4' : ''}`}>
                      <span className="shrink-0 text-muted-foreground/70">{entry.time}</span>
                      <span className={`shrink-0 font-bold ${entry.tagColor}`}>[{entry.tag}]</span>
                      <span className={entry.highlight ? 'text-foreground font-medium' : 'text-foreground/80'}>{entry.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="py-28 border-b border-border bg-background/70">
        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <div className="mb-16">
            <h2 className="text-4xl font-extrabold text-foreground sm:text-5xl font-display tracking-tight">
              From people who use it<span className="text-primary">.</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card/50 p-8 backdrop-blur-sm hover:border-muted transition-colors"
              >
                <Quote className="mb-4 h-5 w-5 text-muted-foreground/50" />
                <p className="mb-8 text-base font-light leading-relaxed text-foreground/80">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted border border-border text-sm font-mono font-bold text-primary">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm font-display">{t.author}</p>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="py-32 border-b border-border bg-background/70">
        <div className="container mx-auto px-6 relative z-10">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12">
              <h2 className="text-3xl font-extrabold text-foreground font-display tracking-tight">Common Inquiries</h2>
            </div>

            <div className="border border-border rounded-xl overflow-hidden bg-card/50">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-border last:border-0">
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:text-primary group"
                  >
                    <span className="text-sm font-semibold text-foreground/90 group-hover:text-primary transition-colors font-display">{item.question}</span>
                    <ChevronDown className={`h-4.5 w-4.5 text-muted-foreground transition-transform duration-300 ${openFAQ === index ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 pb-5 text-xs leading-relaxed text-muted-foreground font-light border-t border-border/50 pt-4">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="relative py-40 bg-background/40">
        <AuroraBackground className="absolute inset-0 z-0 opacity-40 pointer-events-none" />
        <div className="container relative z-10 mx-auto px-6 max-w-5xl">
          <div className="max-w-3xl space-y-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted border border-border">
              <Coffee className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-5xl font-extrabold leading-none text-foreground sm:text-7xl lg:text-8xl font-display tracking-tight">
              Stop guessing.<br />
              Start building with feedback<span className="text-primary">.</span>
            </h2>
            <p className="max-w-xl text-muted-foreground font-light text-lg">
              The first session is free. No credit card. Just your idea and a system that actually pushes back.
            </p>
            <div className="flex flex-col gap-4 pt-6 sm:flex-row">
              <Button
                size="lg"
                onClick={() => navigate('/create')}
                className="group h-14 rounded-xl bg-primary px-8 text-base font-bold text-primary-foreground hover:bg-primary/95 transition-all"
              >
                Try it now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => navigate('/about')}
                className="h-14 px-8 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30"
              >
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-border py-16 bg-background relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-xs font-bold text-primary-foreground font-mono">O</span>
                </div>
                <span className="text-lg font-bold tracking-tight text-foreground font-display">The Orchestra Studio</span>
              </div>
              <p className="mb-6 max-w-sm text-sm font-light text-muted-foreground leading-relaxed">
                A thinking tool for people building alone. Put in a raw idea. Get back something that holds up.
              </p>
            </div>

            {[
              { title: 'Product', links: ['Features', 'Pricing', 'API', 'Docs'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Changelog'] },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="mb-5 text-xs font-mono uppercase tracking-widest text-muted-foreground">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono uppercase tracking-wider">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 md:flex-row">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">
              © 2026 The Orchestra Studio • Protocol v2.0.4
            </p>
            <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.2em] text-primary">
              <span className="live-dot" />
              All Systems Operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
