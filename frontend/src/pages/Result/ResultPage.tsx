import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/use-session';
import { FinalOutputView } from '@/components/output/FinalOutputView';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Card, CardContent } from '@/components/common/Card';

export default function ResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { currentSession, loadSession, isLoading, error } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId && (!currentSession || currentSession.id !== sessionId)) {
      loadSession(sessionId);
    }
  }, [sessionId]);

  if (error) {
    const is404 = error.includes('404') || error.toLowerCase().includes('not found');

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 max-w-lg text-center">
          <h3 className="font-semibold mb-2">{is404 ? 'Session Expired / Not Found' : 'Error Occurred'}</h3>
          <p>{is404 ? 'The session data is missing. This occurs because the backend uses in-memory storage, which is cleared on every restart. Please start a new session.' : error}</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => navigate('/')} variant="outline">Start New Session</Button>
        </div>
      </div>
    );
  }

  if (isLoading || !currentSession) {
    return <PageLoader />;
  }

  if (!currentSession.result) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card variant="glass">
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">Results Not Ready</h2>
            <p className="text-muted-foreground mb-4">
              The session is still processing or hasn't been run yet.
            </p>
            <Button onClick={() => navigate(`/dashboard/${sessionId}`)}>
              View Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Session Results</h1>
          <p className="text-sm text-muted-foreground font-mono">{currentSession.id}</p>
        </div>
        <Button variant="secondary" onClick={() => navigate(`/explainability/${sessionId}`)}>
          View Agent Details
        </Button>
      </div>

      <FinalOutputView result={currentSession.result} onStartNew={() => navigate('/')} />
    </div>
  );
}
