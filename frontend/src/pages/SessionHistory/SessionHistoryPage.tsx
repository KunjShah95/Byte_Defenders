import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/use-session';
import { SessionList } from '@/components/session/SessionList';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';

export default function SessionHistoryPage() {
  const navigate = useNavigate();
  const { sessions, loadAllSessions, isLoading } = useSession();

  useEffect(() => {
    loadAllSessions();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Session History</h1>
          <p className="text-sm text-muted-foreground">
            View and manage your past creative sessions
          </p>
        </div>
        <Button onClick={() => navigate('/')}>
          New Session
        </Button>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : (
        <SessionList sessions={sessions} />
      )}
    </div>
  );
}
