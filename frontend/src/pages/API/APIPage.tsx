import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import { Code2, Terminal, ArrowRight, Copy } from 'lucide-react';
import { toast } from 'sonner';

const CODE_EXAMPLES = {
    javascript: `fetch("https://api.theorchestrastudio.com/v1/sessions", {\n  method: "POST",\n  headers: { "Authorization": "Bearer YOUR_KEY" },\n  body: JSON.stringify({ title: "My idea" })\n})`,
    curl: `curl -X POST https://api.theorchestrastudio.com/v1/sessions \\\n  -H "Authorization: Bearer YOUR_KEY" \\\n  -d '{"title": "My idea"}'`,
};

export default function APIPage() {
    const navigate = useNavigate();
    const [selectedLang, setSelectedLang] = React.useState<'javascript' | 'curl'>('javascript');

    const copyToClipboard = (text: string) => { navigator.clipboard.writeText(text); toast.success('Copied'); };

    return (
        <div className="relative min-h-screen bg-black py-16 lg:py-24">
            <BackgroundBeams className="opacity-20" />
            <div className="container relative z-10 mx-auto px-6 max-w-5xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 max-w-3xl">
                    <span className="mb-4 block text-xs font-mono uppercase tracking-[0.3em] text-primary">API</span>
                    <h1 className="text-4xl font-bold text-white lg:text-5xl font-display">Programmatic <span className="text-primary">access</span>.</h1>
                    <p className="mt-4 text-lg text-neutral-400 font-light max-w-2xl">Send prompts and get results from our API. Simple REST endpoints with JSON responses.</p>
                    <div className="mt-8 flex gap-4">
                        <Button size="lg" onClick={() => navigate('/signup')} className="bg-primary hover:bg-primary/95 text-black">Get an API key</Button>
                        <Button size="lg" variant="outline" onClick={() => navigate('/docs')} className="border-white/10 bg-white/5 hover:bg-white/10 text-white">Read docs</Button>
                    </div>
                </motion.div>

                {/* Quick Start */}
                <div className="mb-12 rounded-2xl border border-white/5 bg-neutral-950/30 p-8">
                    <h3 className="mb-6 text-xl font-bold text-white font-display">Quick start</h3>
                    <div className="mb-4 flex gap-2">
                        {(['javascript', 'curl'] as const).map((lang) => (
                            <button key={lang} onClick={() => setSelectedLang(lang)}
                                className={`rounded-lg px-4 py-2 text-sm transition-all ${selectedLang === lang ? 'bg-primary text-black' : 'border border-white/10 bg-white/5 text-neutral-400 hover:bg-white/10'}`}>
                                {lang === 'javascript' ? 'JavaScript' : 'cURL'}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/60 p-4 text-sm"><code className="font-mono text-neutral-300">{CODE_EXAMPLES[selectedLang]}</code></pre>
                        <button onClick={() => copyToClipboard(CODE_EXAMPLES[selectedLang])}
                            className="absolute right-3 top-3 rounded-lg border border-white/10 bg-white/5 p-2 text-neutral-500 hover:bg-white/10 transition-colors">
                            <Copy className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Endpoints */}
                <div className="mb-12 space-y-3">
                    <h3 className="text-xl font-bold text-white font-display mb-6">Endpoints</h3>
                    {[
                        { method: 'POST', path: '/v1/sessions', desc: 'Create a new session', body: '{ "title": "My idea" }' },
                        { method: 'POST', path: '/v1/sessions/:id/workflow', desc: 'Run the critique workflow', body: '{ "prompt": "Describe your idea..." }' },
                        { method: 'GET', path: '/v1/sessions/:id/result', desc: 'Get the final output', body: null },
                    ].map((ep) => (
                        <div key={ep.path} className="rounded-xl border border-white/5 bg-neutral-950/20 p-6 hover:border-white/10 transition-colors">
                            <div className="flex items-start gap-4">
                                <span className={`rounded-lg px-2.5 py-1 text-xs font-mono font-bold ${ep.method === 'GET' ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary'}`}>{ep.method}</span>
                                <div className="flex-1">
                                    <code className="text-sm font-mono text-white">{ep.path}</code>
                                    <p className="mt-1 text-sm text-neutral-400 font-light">{ep.desc}</p>
                                    {ep.body && (
                                        <pre className="mt-2 rounded-lg border border-white/5 bg-black/40 p-2 text-xs"><code className="text-neutral-500">{ep.body}</code></pre>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="rounded-2xl border border-white/5 bg-neutral-950/20 p-10 max-w-3xl">
                    <h2 className="mb-3 text-2xl font-bold text-white font-display">Try it out</h2>
                    <p className="mb-6 text-neutral-400 font-light">Sign up for a free account and get your API key.</p>
                    <Button size="lg" onClick={() => navigate('/signup')} className="bg-primary hover:bg-primary/95 text-black">Get started <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
            </div>
        </div>
    );
}
