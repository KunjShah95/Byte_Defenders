import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '@/hooks/use-session';
import { FinalOutputView } from '@/components/output/FinalOutputView';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import { Sparkles, Eye } from 'lucide-react';

export default function ResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { currentSession, loadSession, isLoading, error } = useSession();
  const navigate = useNavigate();

  useEffect(() => { if (sessionId && (!currentSession || currentSession.id !== sessionId)) loadSession(sessionId); }, [sessionId]); // eslint-disable-line

  if (error) {
    const is404 = error.includes('404') || error.toLowerCase().includes('not found');
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 p-6">
        <div className="max-w-lg rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center backdrop-blur-sm">
          <h3 className="mb-2 font-semibold text-destructive">{is404 ? 'Session Expired' : 'Error Occurred'}</h3>
          <p className="text-sm text-muted-foreground">{is404 ? 'Session data is missing. Please start a new session.' : error}</p>
        </div>
        <Button onClick={() => navigate('/')} variant="outline">Start New Session</Button>
      </div>
    );
  }

  if (isLoading || !currentSession) return <PageLoader />;

  if (!currentSession.result) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-2xl border border-white/5 bg-card/30 p-12 text-center backdrop-blur-sm">
          <h2 className="mb-2 text-xl font-semibold text-foreground">Results Not Ready</h2>
          <p className="mb-4 text-muted-foreground">The session is still processing or hasn't been run yet.</p>
          <Button onClick={() => navigate(`/dashboard/${sessionId}`)}>View Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <BackgroundBeams className="opacity-10" />
      <div className="relative z-10 mx-auto max-w-4xl space-y-6 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground"><Sparkles className="h-6 w-6 text-primary" />Session Results</h1>
            <p className="font-mono text-xs text-muted-foreground">{currentSession.id}</p>
          </div>
          <Button variant="outline" onClick={() => navigate(`/explainability/${sessionId}`)} className="border-white/10 bg-white/5 hover:bg-white/10">
            <Eye className="mr-2 h-4 w-4" />View Agent Details
          </Button>
        </motion.div>

        <FinalOutputView result={currentSession.result} onStartNew={() => navigate('/')} />
      </div>
    </div>
  );
}
