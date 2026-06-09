import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '@/hooks/use-session';
import { UseCase, USE_CASE_LABELS } from '@/types/session.types';
import { Button } from '@/components/common/Button';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import { Sparkles, ArrowRight, History, Brain } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { createSession, runSession, isLoading, error } = useSession();

  const [prompt, setPrompt] = useState('');
  const [useCase, setUseCase] = useState<UseCase>('startup');
  const [explainabilityMode, setExplainabilityMode] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    try {
      const sessionId = await createSession({ prompt: prompt.trim(), useCase, explainabilityMode });
      runSession(sessionId);
      navigate(`/dashboard/${sessionId}`);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-6">
      <BackgroundBeams className="opacity-20" />
      <div className="relative z-10 w-full max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 mb-6">
            <Brain className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Create New <span className="text-gradient">Session</span></h1>
          <p className="text-muted-foreground text-lg">Describe your idea and let our agents collaborate to enhance it</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/5 bg-card/30 backdrop-blur-sm p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Describe your idea or problem</label>
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Create a sustainable food delivery platform that reduces environmental impact..."
                className="w-full h-36 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring backdrop-blur-sm resize-none"
                required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Use Case</label>
              <select value={useCase} onChange={(e) => setUseCase(e.target.value as UseCase)}
                className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring backdrop-blur-sm appearance-none cursor-pointer">
                {Object.entries(USE_CASE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={explainabilityMode} onChange={(e) => setExplainabilityMode(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary" />
              <div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Enable Explainability Mode</span>
                <p className="text-xs text-muted-foreground mt-0.5">See detailed reasoning behind each agent's decisions</p>
              </div>
            </label>

            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive backdrop-blur-sm">{error}</div>
            )}

            <Button type="submit" size="lg" className="w-full h-14 bg-primary hover:bg-primary/90 text-base font-semibold" disabled={isLoading}>
              {isLoading ? 'Generating...' : <><Sparkles className="mr-2 h-5 w-5" /> Generate with AI Agents <ArrowRight className="ml-2 h-5 w-5" /></>}
            </Button>
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 flex justify-center">
          <Button variant="ghost" onClick={() => navigate('/history')} className="text-muted-foreground hover:text-foreground">
            <History className="mr-2 h-4 w-4" /> View Session History
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
