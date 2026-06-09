import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import { Spotlight } from '@/components/aceternity/Spotlight';
import { Target, Users, Lightbulb, Heart, ArrowRight, Linkedin, Twitter, Github } from 'lucide-react';

const fadeInUp = { 
  hidden: { opacity: 0, y: 20 }, 
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" } 
  }) 
};

const values = [
  { icon: Lightbulb, title: 'Debate Over Flattery', description: 'Agreeable AI outputs are useless. We design our agents to explicitly challenge and stress-test your spec boundaries.' },
  { icon: Target, title: 'Total Log Visibility', description: 'You should be able to audit every draft iteration, critic comment, and rewrite path in plain text.' },
  { icon: Users, title: 'Designed for Builders', description: 'We configure modular, task-specific utilities that integrate cleanly into a developer\'s flow.' },
  { icon: Heart, title: 'Zero AI Slop', description: 'No empty templates, no robotic summary wrappers, and no generic card-grid boilerplate.' },
];

const team = [
  { name: 'Varad Kulkarni', role: 'Founder & CEO', bio: 'Former AI researcher at Google DeepMind. Obsessed with workflow protocols.', avatar: 'VK', social: { linkedin: '#', twitter: '#' } },
  { name: 'Jatin Shah', role: 'CTO', bio: 'Ex-OpenAI engineer. Built core distributed agent runtimes.', avatar: 'JS', social: { linkedin: '#', github: '#' } },
  { name: 'Priya Sharma', role: 'Head of Product', bio: 'Product leader focused on removing friction from engineering specs.', avatar: 'PS', social: { linkedin: '#', twitter: '#' } },
  { name: 'Alex Chen', role: 'Lead Engineer', bio: 'Full-stack infrastructure architect. Previously at Stripe.', avatar: 'AC', social: { linkedin: '#', github: '#' } },
];

const milestones = [
  { year: '2023 • Q1', title: 'The Terminal Prototype', description: 'Built a simple command-line script to pipe LLM prompts together to automate spec drafting.' },
  { year: '2023 • Q3', title: 'Injecting The Adversary', description: 'Discovered that polite models overlook critical flaws. Created a dedicated agent to systematically critique inputs.' },
  { year: '2024 • Q2', title: 'Workbench Release', description: 'Launched the collaborative workbench UI to 1,000+ technical founders and product leads.' },
  { year: '2025 • Q4', title: 'Distributed Clusters', description: 'Scaled execution to support team workspaces, processing over 100,000 sessions with full audit compliance.' },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-black text-white py-24 selection:bg-primary/20 font-sans overflow-x-hidden">
      
      {/* Background global layout gridlines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="mx-auto h-full max-w-7xl w-full grid-layout-lines" />
      </div>

      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
      <BackgroundBeams className="opacity-10 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 max-w-6xl">
        
        {/* ========== HERO SECTION ========== */}
        <div className="mb-24 text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mt-4 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl font-display select-none cursor-default group"
          >
            We Hate AI<br />
            <span className="text-gradient-glow relative inline-block group-hover:scale-105 transition-transform duration-300">
              Black Boxes Too
            </span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400 font-light leading-relaxed"
          >
            We built The Orchestra Studio because we grew tired of polite, generic chat templates that agree with everything. We wanted raw criticism, structured reasoning, and plain text logs.
          </motion.p>
        </div>

        {/* ========== BOLD PHILOSOPHY SECTION ========== */}
        <div className="mb-32">
          <div className="overflow-hidden rounded-xl border border-white/5 bg-neutral-950/20 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold mb-3">Core Philosophy</span>
                <h2 className="text-3xl font-bold text-white font-display mb-6">Polite is Useless</h2>
                <p className="mb-4 text-sm text-neutral-400 font-light leading-relaxed">
                  Generalist AI assistants are trained to satisfy the user. If you describe a weak product concept, they tell you it is a "fantastic idea." This flattery prevents real progress.
                </p>
                <p className="mb-6 text-sm text-neutral-400 font-light leading-relaxed">
                  Our system runs on constructive friction. One agent drafts a spec, a second roasts it to pieces, a third revises based on that feedback, and a fourth formats the final package.
                </p>
                <p className="font-mono text-xs text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Real collaboration requires critical friction.
                </p>
              </div>

              <div className="bg-neutral-950/40 p-8 lg:p-12 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full">
                  {[
                    ['100k+', 'Sessions Logged'], 
                    ['2,500+', 'Active Workspaces'], 
                    ['4', 'Specialist Agents'], 
                    ['94%', 'Code Compiles']
                  ].map(([val, label]) => (
                    <div key={label} className="rounded-lg border border-white/5 bg-black/60 p-6 text-center">
                      <p className="text-3xl font-extrabold text-primary font-display">{val}</p>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== CORE VALUES MATRIX ========== */}
        <div className="mb-32">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white font-display">Core Protocols</h2>
            <p className="mt-3 text-neutral-400 font-light text-sm">Our guidelines for building a high-fidelity workspace.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div 
                key={v.title} 
                custom={i} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }} 
                variants={fadeInUp}
                className="rounded-xl border border-white/5 bg-neutral-950/30 p-8 hover:border-neutral-800 transition-all duration-300"
              >
                <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-neutral-900 border border-white/5 text-primary">
                  <v.icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-white font-display">{v.title}</h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed font-mono">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ========== TIMELINE JOURNAL ========== */}
        <div className="mb-32 max-w-4xl mx-auto">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white font-display">How We Got Here</h2>
            <p className="mt-3 text-neutral-400 font-light text-sm">From simple terminal triggers to a globally scaled workspace.</p>
          </div>

          <div className="relative border-l border-white/5 pl-8 py-2 max-w-2xl mx-auto">
            <div className="space-y-12">
              {milestones.map((m, i) => (
                <motion.div 
                  key={m.year} 
                  custom={i} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true }} 
                  variants={fadeInUp}
                  className="relative group"
                >
                  {/* Timeline bullet indicator */}
                  <div className="absolute -left-[41px] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/5 bg-black text-primary transition-all duration-300 group-hover:border-primary/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-primary font-semibold tracking-wider">{m.year}</span>
                    <h3 className="mt-1.5 text-lg font-bold text-white font-display">{m.title}</h3>
                    <p className="mt-2 text-xs text-neutral-400 font-light leading-relaxed font-mono">{m.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ========== TEAM BUILDERS ========== */}
        <div className="mb-32">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white font-display">The Builders</h2>
            <p className="mt-3 text-neutral-400 font-light text-sm">We are engineers, researchers, and tools developers.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <motion.div 
                key={member.name} 
                custom={i} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }} 
                variants={fadeInUp}
                className="group rounded-xl border border-white/5 bg-neutral-950/20 p-8 text-center hover:border-neutral-800 hover:bg-neutral-950/40 transition-all duration-300"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-900 border border-white/5 text-2xl font-bold font-mono text-primary group-hover:border-primary/50 transition-all duration-300">
                  {member.avatar}
                </div>
                <h3 className="font-bold text-white text-base font-display">{member.name}</h3>
                <p className="mb-3.5 text-xs font-mono text-primary uppercase tracking-wider">{member.role}</p>
                <p className="mb-6 text-xs text-neutral-400 font-light leading-relaxed h-12 overflow-hidden font-mono">{member.bio}</p>
                <div className="flex justify-center gap-4 border-t border-white/5 pt-4">
                  {member.social.linkedin && <a href={member.social.linkedin} className="text-neutral-500 hover:text-primary transition-colors"><Linkedin className="h-4 w-4" /></a>}
                  {member.social.twitter && <a href={member.social.twitter} className="text-neutral-500 hover:text-primary transition-colors"><Twitter className="h-4 w-4" /></a>}
                  {member.social.github && <a href={member.social.github} className="text-neutral-500 hover:text-primary transition-colors"><Github className="h-4 w-4" /></a>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ========== JOIN THE PROTOCOL CTA ========== */}
        <div>
          <div className="relative overflow-hidden rounded-xl border border-white/5 bg-neutral-950/20 p-12 text-center max-w-4xl mx-auto">
            <h2 className="mb-4 text-3xl font-bold text-white font-display">Join the Spec Protocol</h2>
            <p className="mx-auto mb-8 max-w-xl text-neutral-400 font-light text-base leading-relaxed">
              Experience the power of adversarial critique loops. Test your next product brief with us.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/signup')} className="bg-primary hover:bg-primary/95 text-black font-mono uppercase tracking-widest text-xs h-12">
                Start Creating <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/contact')} className="border-white/10 bg-white/[0.02] hover:bg-white/[0.08] text-white font-mono uppercase tracking-widest text-xs h-12">
                Get in Touch
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
