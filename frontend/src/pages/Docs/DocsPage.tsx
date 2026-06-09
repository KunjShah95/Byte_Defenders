import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import { Spotlight } from '@/components/aceternity/Spotlight';
import { BookOpen, Code2, Zap, Layers, Terminal, ArrowRight, ExternalLink, Search, Check, Copy } from 'lucide-react';

const DOC_SECTIONS = [
  {
    title: 'Getting Started',
    icon: Zap,
    items: [
      { id: 'intro', label: 'Introduction' },
      { id: 'quickstart', label: 'Quick Start' },
      { id: 'auth', label: 'Authentication' },
      { id: 'first-session', label: 'Your First Session' }
    ]
  },
  {
    title: 'Core Concepts',
    icon: Layers,
    items: [
      { id: 'sessions', label: 'Sessions & Threads' },
      { id: 'agents', label: 'Agent Topologies' },
      { id: 'workflows', label: 'Debate Workflows' },
      { id: 'explainability', label: 'Explainability Logs' }
    ]
  },
  {
    title: 'API Reference',
    icon: Code2,
    items: [
      { id: 'api-sessions', label: 'Sessions API' },
      { id: 'api-workflows', label: 'Workflows API' },
      { id: 'api-events', label: 'SSE Events Stream' }
    ]
  },
  {
    title: 'SDKs & Tools',
    icon: Terminal,
    items: [
      { id: 'sdk-js', label: 'JavaScript SDK' },
      { id: 'sdk-py', label: 'Python SDK' },
      { id: 'cli', label: 'CLI Tooling' }
    ]
  }
];

const CODE_EXAMPLES = {
  javascript: `import { Orchestra } from '@theorchestrastudio/sdk';

const orchestra = new Orchestra({
  apiKey: process.env.ORCHESTRA_API_KEY
});

// Run an adversarial debate session
const session = await orchestra.sessions.create({
  topic: 'A local-first offline workspace database',
  agentCount: 4,
  mode: 'adversarial'
});

// Stream the live SSE logs of the critique debate
session.logs.on('entry', (log) => {
  console.log(\`[\${log.tag}] \${log.message}\`);
});`,
  python: `from orchestra import Orchestra

orchestra = Orchestra(
    api_key="your_api_key_here"
)

# Run an adversarial debate session
session = orchestra.sessions.create(
    topic="A local-first offline workspace database",
    agent_count=4,
    mode="adversarial"
)

# Stream the live SSE logs of the critique debate
for log in session.stream_logs():
    print(f"[{log.tag}] {log.message}")`,
  curl: `curl -X POST "https://api.theorchestrastudio.com/v1/sessions" \\
  -H "Authorization: Bearer $ORCHESTRA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "topic": "A local-first offline workspace database",
    "agentCount": 4,
    "mode": "adversarial"
  }'`
};

export default function DocsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'javascript' | 'python' | 'curl'>('javascript');
  const [copied, setCopied] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('intro');

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredSections = DOC_SECTIONS.map(section => {
    const matchedItems = section.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...section, items: matchedItems };
  }).filter(section => section.items.length > 0);

  return (
    <div className="relative min-h-screen bg-black text-white py-24 selection:bg-primary/20 font-sans overflow-x-hidden">
      
      {/* Background Layout lines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="mx-auto h-full max-w-7xl w-full grid-layout-lines" />
      </div>

      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
      <BackgroundBeams className="opacity-10 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 max-w-6xl">
        
        {/* ========== DOCS HEADER ========== */}
        <div className="mb-16 border-b border-white/5 pb-12 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl font-display select-none cursor-default group"
          >
            <span className="text-gradient-glow relative inline-block group-hover:scale-105 transition-transform duration-300">The Spec Protocol</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="mt-4 text-neutral-400 font-light text-base leading-relaxed max-w-2xl"
          >
            Integrate virtual agent critique loops into your deployment flow. Read our API specifications and download our SDK wrappers.
          </motion.p>
          
          <div className="relative mt-8 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search specifications (e.g. auth, SSE)..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 rounded-lg border border-white/10 bg-white/[0.03] pl-11 pr-4 text-xs font-mono text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 backdrop-blur-sm transition-all" 
            />
          </div>
        </div>

        {/* ========== TWO COLUMN PORTAL ========== */}
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          
          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
            {filteredSections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-400 font-mono text-[10px] uppercase tracking-widest font-semibold pb-1.5 border-b border-white/[0.02]">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    <span>{section.title}</span>
                  </div>
                  <ul className="space-y-1 pl-5">
                    {section.items.map((item) => {
                      const isActive = selectedTopic === item.id;
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => setSelectedTopic(item.id)}
                            className={`text-left text-xs font-mono py-1.5 w-full transition-colors ${
                              isActive ? 'text-primary font-bold' : 'text-neutral-500 hover:text-neutral-200'
                            }`}
                          >
                            {item.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Right Document Content */}
          <div className="lg:col-span-9 space-y-10">
            
            {/* Guide Content Module */}
            <div className="rounded-xl border border-white/5 bg-neutral-950/20 p-8 backdrop-blur-sm space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="font-mono text-[10px] text-neutral-500">v2.0.4 SPEC</span>
              </div>
              
              <h2 className="text-2xl font-bold text-white font-display">Chaining Adversarial Agents</h2>
              <p className="text-sm text-neutral-400 font-light leading-relaxed font-mono">
                The Orchestra SDK allows developers to orchestrate a cluster of LLMs trained on distinct personas. Rather than issuing a prompt and accepting a single-shot completion, you trigger a multi-turn critique loop.
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
                {[
                  { name: 'Architect', role: 'Initial Specifications Draft' },
                  { name: 'Adversary', role: 'Vulnerability & Flaw Audit' },
                  { name: 'Refiner', role: 'Iterative Patch Application' },
                  { name: 'Packager', role: 'Markdown & Schema Build' }
                ].map((agent, idx) => (
                  <div key={agent.name} className="rounded-lg border border-white/5 bg-black/40 p-4 text-center">
                    <span className="font-mono text-xs text-primary font-semibold block mb-1">Agent 0{idx + 1} • {agent.name}</span>
                    <span className="text-[10px] font-mono text-neutral-500 leading-normal block">{agent.role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Code Playground Tabbed Box */}
            <div className="rounded-xl border border-white/5 bg-neutral-950/20 overflow-hidden">
              <div className="flex items-center justify-between bg-neutral-950/60 px-6 py-4 border-b border-white/5">
                <div className="flex gap-2">
                  {(['javascript', 'python', 'curl'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveTab(lang)}
                      className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all duration-300 ${
                        activeTab === lang 
                          ? 'bg-white/10 text-white font-bold' 
                          : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {lang === 'javascript' ? 'JS SDK' : lang === 'python' ? 'Python SDK' : 'cURL'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 hover:text-primary transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="p-6 bg-black overflow-x-auto">
                <pre className="text-xs text-neutral-300 font-mono leading-relaxed max-h-[300px]">
                  <code>
                    {CODE_EXAMPLES[activeTab].split('\n').map((line, idx) => (
                      <div key={idx} className="flex hover:bg-white/[0.02] px-2 rounded">
                        <span className="text-neutral-600 select-none w-8 text-right pr-4 font-mono">{idx + 1}</span>
                        <span className="whitespace-pre">{line}</span>
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>

            {/* API Help CTA */}
            <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-neutral-950/20 p-10 text-center max-w-3xl mx-auto">
              <BookOpen className="mx-auto mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-xl font-bold text-white font-display">Need Additional Integrations?</h3>
              <p className="mx-auto mb-6 max-w-lg text-xs text-neutral-400 font-light leading-relaxed font-mono">
                Explore our comprehensive endpoints reference, developer sandbox setup, or join our community Discord server for support.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => navigate('/api')} className="bg-primary hover:bg-primary/95 text-black font-mono text-xs uppercase tracking-widest h-10 px-5 font-bold">
                  API endpoints Reference
                </Button>
                <Button variant="outline" onClick={() => window.open('https://github.com', '_blank')} className="border-white/10 bg-white/[0.02] hover:bg-white/[0.08] text-white font-mono text-xs uppercase tracking-widest h-10 px-5">
                  GitHub SDK <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
