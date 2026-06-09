import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import {
  Eye,
  ArrowRight, CheckCircle, Search, FileEdit
} from 'lucide-react';

const steps = [
  { title: 'Dump your raw idea', description: 'A messy paragraph, a voice memo transcript, some bullet points. Do not polish it. That is our job.', details: ['No templates needed', 'Write how you think', 'We handle structure'] },
  { title: 'We tear it apart', description: 'A skeptical reader goes through every line looking for weak spots: flawed logic, missing steps, hidden assumptions.', details: ['Finds logical gaps', 'Questions your assumptions', 'No polite filters'] },
  { title: 'We rebuild it', description: 'Your original, plus the critique, gets rewritten into something tighter. This repeats until the output holds up.', details: ['Iterative rewrites', 'Tracks what changed', 'Stops when it is solid'] },
  { title: 'You get the result', description: 'A clean document you can use. Product brief, feature spec, pitch draft — whatever you needed.', details: ['Markdown export', 'Plain text logs', 'Ready to share'] },
];

export default function FeaturesPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-background text-foreground py-24 font-sans overflow-x-hidden">
      <BackgroundBeams className="opacity-10 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 max-w-5xl">
        
        {/* ========== HERO SECTION ========== */}
        <div className="mb-24 max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded bg-muted border border-border px-3 py-1 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground"
          >
            HOW IT WORKS
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="mt-8 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl font-display select-none cursor-default group"
          >
            Put in a rough idea.<br />
            <span className="text-gradient-glow relative inline-block group-hover:scale-105 transition-transform duration-300">Get back something solid</span>
            <span className="text-white">.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="mt-6 max-w-2xl text-lg text-neutral-400 font-light leading-relaxed"
          >
            No setup. No training. You share what you are thinking, and a process kicks off that sharpens it into something you can actually use.
          </motion.p>
        </div>

        {/* ========== PROCESS STEPS ========== */}
        <div className="mb-32 space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-xl border border-border bg-card/60 p-8 hover:bg-card/80 transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted border border-border">
                  <span className="text-sm font-mono font-bold text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-foreground font-display mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-xl">{step.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {step.details.map((d) => (
                      <span key={d} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle className="h-3 w-3 text-primary" />
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ========== WHY IT IS DIFFERENT ========== */}
        <div className="mb-32">
          <h2 className="text-3xl font-bold text-foreground font-display mb-10">
            What makes this different<span className="text-primary">?</span>
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Search, title: 'It pushes back', description: 'Most AI tells you what you want to hear. This one is designed to find what is wrong with your idea so you can fix it before it costs you time.' },
              { icon: FileEdit, title: 'You see the work', description: 'Every draft, every critique, every rewrite is logged in plain text. No black box. No hidden system prompts.' },
              { icon: Eye, title: 'It is fast', description: 'A full cycle — draft, critique, rewrite — takes about a minute. You can iterate five times in the time it takes to schedule a call with a friend.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-xl border border-border bg-card/50 p-8 hover:border-muted transition-all duration-300"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-muted border border-border text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-foreground font-display">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ========== CTA ========== */}
        <div>
          <div className="relative overflow-hidden rounded-xl border border-border bg-card/50 p-12 max-w-4xl">
            <h2 className="mb-4 text-3xl font-bold text-foreground font-display">Ready to try it?</h2>
            <p className="mb-8 max-w-xl text-muted-foreground font-light text-base leading-relaxed">
              Five free sessions. No credit card. Just your raw ideas and a process that makes them better.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" onClick={() => navigate('/create')} className="bg-primary hover:bg-primary/95 text-primary-foreground text-base h-12">
                Start your first session <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/about')} className="border-border bg-muted/20 hover:bg-muted/40 text-foreground text-base h-12">
                Learn more
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
