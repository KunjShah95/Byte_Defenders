import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import { ArrowRight, Heart, Clock, Globe, Coffee } from 'lucide-react';

const POSITIONS = [
    { title: 'Full Stack Engineer', desc: 'Help us build the core platform. TypeScript, React, Node.js.', type: 'Full-time', location: 'Bangalore / Remote' },
    { title: 'Product Designer', desc: 'Design interfaces that make complex workflows feel simple.', type: 'Full-time', location: 'Remote' },
];

const perks = [
    { icon: Heart, title: 'Health insurance', desc: 'For you and your family.' },
    { icon: Clock, title: 'Flexible hours', desc: 'Work when you are most effective.' },
    { icon: Globe, title: 'Remote-friendly', desc: 'Work from anywhere in India.' },
    { icon: Coffee, title: 'Team meets', desc: 'We meet up quarterly.' },
];

export default function CareersPage() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-black py-16 lg:py-24">
            <BackgroundBeams className="opacity-20" />
            <div className="container relative z-10 mx-auto px-6 max-w-5xl">
                {/* Hero */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 max-w-3xl">
                    <span className="mb-4 block text-xs font-mono uppercase tracking-[0.3em] text-primary">CAREERS</span>
                    <h1 className="text-4xl font-bold text-white lg:text-5xl font-display">Work with <span className="text-primary">us</span>.</h1>
                    <p className="mt-4 text-lg text-neutral-400 font-light max-w-2xl">Small team. Big problems. We are building a tool that helps people think better, and we need help.</p>
                </motion.div>

                {/* Open Positions */}
                <div className="mb-16">
                    <h2 className="text-xl font-bold text-white font-display mb-6">Open roles</h2>
                    <div className="space-y-4">
                        {POSITIONS.map((pos, i) => (
                            <motion.div key={pos.title}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="rounded-xl border border-white/5 bg-neutral-950/20 p-6 hover:border-white/10 transition-all duration-300">
                                <div className="flex items-start justify-between gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white font-display mb-1">{pos.title}</h3>
                                        <p className="text-sm text-neutral-400 font-light mb-3">{pos.desc}</p>
                                        <div className="flex gap-4 text-xs text-neutral-500">
                                            <span>{pos.type}</span>
                                            <span>{pos.location}</span>
                                        </div>
                                    </div>
                                    <Button onClick={() => navigate('/contact')} className="bg-primary hover:bg-primary/95 text-black shrink-0">
                                        Apply <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Perks */}
                <div className="mb-16">
                    <h2 className="text-xl font-bold text-white font-display mb-6">Perks</h2>
                    <div className="grid gap-4 md:grid-cols-4">
                        {perks.map((perk) => (
                            <div key={perk.title} className="rounded-xl border border-white/5 bg-neutral-950/20 p-6">
                                <perk.icon className="mb-4 h-6 w-6 text-primary" />
                                <h3 className="font-semibold text-white font-display mb-1">{perk.title}</h3>
                                <p className="text-xs text-neutral-400 font-light">{perk.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="rounded-2xl border border-white/5 bg-neutral-950/20 p-10 max-w-3xl">
                    <h2 className="mb-3 text-2xl font-bold text-white font-display">Do not see the right role?</h2>
                    <p className="mb-6 text-neutral-400 font-light">We are always open to meeting interesting people.</p>
                    <Button size="lg" onClick={() => navigate('/contact')} className="bg-primary hover:bg-primary/95 text-black">Say hi <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
            </div>
        </div>
    );
}
