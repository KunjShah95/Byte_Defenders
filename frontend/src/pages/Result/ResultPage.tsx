import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/use-session';
import { FinalOutputView } from '@/components/output/FinalOutputView';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Card, CardContent } from '@/components/common/Card';

export default function ResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { currentSession, loadSession, isLoading } = useSession();

  useEffect(() => {
    if (sessionId && (!currentSession || currentSession.id !== sessionId)) {
      loadSession(sessionId);
    }
  }, [sessionId]);

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
