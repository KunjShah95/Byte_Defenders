import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import { Spotlight } from '@/components/aceternity/Spotlight';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Twitter, Linkedin, Github, Terminal } from 'lucide-react';

const CONTACT_OPTIONS = [
  { icon: Mail, title: 'Email Channel', description: 'For general inquiries and specs auditing', value: 'hello@theorchestrastudio.com', action: 'mailto:hello@theorchestrastudio.com' },
  { icon: Phone, title: 'Direct Phone', description: 'Available Monday - Friday, 9 AM - 6 PM IST', value: '+91 80 4567 8900', action: 'tel:+918045678900' },
  { icon: MapPin, title: 'Headquarters', description: 'Our engineering lab office coordinates', value: 'Bangalore, Karnataka, India', action: 'https://maps.google.com' },
];

const INQUIRY_TYPES = ['General Inquiry', 'Sales & Pricing', 'Technical Support', 'Partnership', 'Careers'];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', inquiryType: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Terminal Console State
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleLogs, setConsoleLogs] = useState<Array<{ type: 'input' | 'sys', text: string }>>([
    { type: 'sys', text: 'The Orchestra Studio Console v2.0.4. Type a message or command.' },
    { type: 'sys', text: 'Type /help to view list of available console commands.' }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    toast.success('Message sent! Our team will get back to you within 24 hours.');
    setFormData({ name: '', email: '', company: '', inquiryType: '', message: '' });
    setIsSubmitting(false);
  };

  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;

    const inputVal = consoleInput.trim();
    const newLogs = [...consoleLogs, { type: 'input' as const, text: inputVal }];

    // Processing mock terminal commands
    if (inputVal === '/help') {
      newLogs.push(
        { type: 'sys', text: 'Available commands: /ping, /info, /pricing, /clear' },
        { type: 'sys', text: 'Or type a direct message to instantly notify our slack gateway.' }
      );
    } else if (inputVal === '/ping') {
      newLogs.push({ type: 'sys', text: 'SYS // PONG. Latency to cluster-south-1: 14ms.' });
    } else if (inputVal === '/clear') {
      setConsoleLogs([]);
      setConsoleInput('');
      return;
    } else if (inputVal === '/info') {
      newLogs.push(
        { type: 'sys', text: 'SYS // Built by Varad & Jatin in Bangalore, India.' },
        { type: 'sys', text: 'Chaining 4 LLM models in an adversarial loop: Architect, Adversary, Refiner, Packager.' }
      );
    } else if (inputVal === '/pricing') {
      newLogs.push(
        { type: 'sys', text: 'Starter: Free (5 sessions/mo).' },
        { type: 'sys', text: 'Pro: ₹2,499/mo (Unlimited sessions).' },
        { type: 'sys', text: 'Enterprise: ₹9,999/mo (SLA + Custom models).' }
      );
    } else {
      newLogs.push(
        { type: 'sys', text: `SYS // Packet received: "${inputVal}"` },
        { type: 'sys', text: 'SYS // Message queued under Ticket #' + Math.floor(1000 + Math.random() * 9000) },
        { type: 'sys', text: 'SYS // Dispatched to team channel. We will reply via email.' }
      );
    }

    setConsoleLogs(newLogs);
    setConsoleInput('');
  };

  return (
    <div className="relative min-h-screen bg-black text-white py-24 selection:bg-primary/20 font-sans overflow-x-hidden">
      
      {/* Background Layout lines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="mx-auto h-full max-w-7xl w-full grid-layout-lines" />
      </div>

      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
      <BackgroundBeams className="opacity-10 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 max-w-5xl">
        
        {/* ========== CONTACT HEADER ========== */}
        <div className="mb-20 text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mt-4 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl font-display select-none cursor-default group"
          >
            Ping our team<br />
            <span className="text-gradient-glow relative inline-block group-hover:scale-105 transition-transform duration-300">in real-time</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400 font-light leading-relaxed"
          >
            Have a question, feedback, or need a custom SLA integration? Drop a message below.
          </motion.p>
        </div>

        {/* ========== CO-ORDINATES CARDS ========== */}
        <div className="mb-20 grid gap-4 md:grid-cols-3">
          {CONTACT_OPTIONS.map((option, i) => (
            <motion.a 
              key={option.title} 
              href={option.action} 
              target={option.action.startsWith('http') ? '_blank' : undefined}
              rel={option.action.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.08 }}
              className="group rounded-xl border border-white/5 bg-neutral-950/20 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-neutral-950/40"
            >
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 border border-white/5 text-primary transition-colors group-hover:bg-primary/10">
                <option.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1 text-sm font-bold text-white font-display">{option.title}</h3>
              <p className="mb-2 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">{option.description}</p>
              <p className="text-xs font-mono text-primary font-semibold">{option.value}</p>
            </motion.a>
          ))}
        </div>

        {/* ========== MAIN FORM + SIDEBAR GRID ========== */}
        <div className="grid gap-10 lg:grid-cols-12">
          
          {/* Email Form */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-white/5 bg-neutral-950/20 p-8 backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-bold text-white font-display">Get in Touch</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-mono text-neutral-500 uppercase tracking-widest">Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jatin Shah"
                      className="w-full h-11 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-mono text-neutral-500 uppercase tracking-widest">Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      value={formData.email} 
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jatin@workspace.com"
                      className="w-full h-11 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" 
                    />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-mono text-neutral-500 uppercase tracking-widest">Company Name</label>
                    <input 
                      type="text" 
                      value={formData.company} 
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Acme Labs"
                      className="w-full h-11 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-mono text-neutral-500 uppercase tracking-widest">Topic *</label>
                    <select 
                      required 
                      value={formData.inquiryType} 
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full h-11 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-xs font-mono text-neutral-400 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    >
                      <option value="" className="bg-neutral-950 text-neutral-650">Select topic...</option>
                      {INQUIRY_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-neutral-950 text-white">{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-mono text-neutral-500 uppercase tracking-widest">Message Spec *</label>
                  <textarea 
                    required 
                    rows={5} 
                    value={formData.message} 
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe how we can help configure your workspace..."
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none" 
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSubmitting} 
                  className="w-full bg-primary hover:bg-primary/95 text-black font-mono text-xs uppercase tracking-widest h-11 font-bold"
                >
                  {isSubmitting ? 'Transmitting...' : <><Send className="mr-2 h-4 w-4" />Transmit Message</>}
                </Button>
              </form>
            </div>
          </div>

          {/* Interactive Console Shell */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Command widget */}
            <div className="rounded-xl border border-white/10 bg-neutral-950/80 overflow-hidden shadow-2xl relative">
              <div className="absolute -inset-1 rounded-xl bg-primary/5 blur-2xl opacity-20 pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-white/5 bg-neutral-900/60 p-4">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-800" />
                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-800" />
                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-800" />
                </div>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-primary" /> ping_gateway.sh
                </div>
                <div className="w-6" />
              </div>

              {/* Console Logs */}
              <div className="p-5 h-[240px] overflow-y-auto font-mono text-xs space-y-2.5 scrollbar-thin">
                {consoleLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    {log.type === 'input' ? (
                      <>
                        <span className="text-primary select-none">$</span>
                        <span className="text-white">{log.text}</span>
                      </>
                    ) : (
                      <span className="text-neutral-400">{log.text}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Console Input Bar */}
              <form onSubmit={handleConsoleSubmit} className="border-t border-white/5 p-3.5 bg-black/60 flex gap-2">
                <span className="text-primary font-mono select-none self-center">$</span>
                <input 
                  type="text" 
                  value={consoleInput}
                  onChange={(e) => setConsoleInput(e.target.value)}
                  placeholder="Type a command or quick message..."
                  className="flex-1 bg-transparent border-0 font-mono text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:ring-0"
                />
                <button type="submit" className="text-xs text-primary font-mono hover:text-white transition-colors px-1.5 uppercase font-bold">
                  Send
                </button>
              </form>
            </div>

            {/* General coordinates */}
            <div className="space-y-4">
              {[
                { icon: Clock, title: 'Operational Hours', children: <p className="text-xs text-neutral-400 font-mono">Our agents run 24/7. Engineering team support operates Monday - Friday, 9 AM - 6 PM IST.</p> },
                { icon: MessageSquare, title: 'Slack Community Channel', children: <><p className="mb-3 text-xs text-neutral-400 font-mono">Join our active group of technical specs builders.</p><Button variant="outline" onClick={() => window.open('https://discord.com', '_blank')} className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider h-9">Join Discord Channel</Button></> },
              ].map((section, i) => (
                <div key={i} className="rounded-xl border border-white/5 bg-neutral-950/20 p-5 backdrop-blur-sm">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold font-display text-white">
                    <section.icon className="h-4 w-4 text-primary" />
                    <span>{section.title}</span>
                  </div>
                  {section.children}
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
