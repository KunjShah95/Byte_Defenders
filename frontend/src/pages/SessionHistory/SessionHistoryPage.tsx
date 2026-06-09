import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '@/hooks/use-session';
import { SessionList } from '@/components/session/SessionList';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import { cn } from '@/lib/utils';
import { History, Plus } from 'lucide-react';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export default function SessionHistoryPage() {
  const navigate = useNavigate();
  const { sessions, pagination, loadAllSessions, isLoading } = useSession();
  const [pageSize, setPageSize] = useState(20);
  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  const goToPage = useCallback((page: number) => { if (page < 1 || page > totalPages) return; loadAllSessions(page, pageSize); }, [loadAllSessions, pageSize, totalPages]);
  const changePageSize = useCallback((size: string) => { const newSize = parseInt(size, 10); setPageSize(newSize); loadAllSessions(1, newSize); }, [loadAllSessions]);

  useEffect(() => { loadAllSessions(1, pageSize); }, []); // eslint-disable-line

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="relative min-h-screen bg-background">
      <BackgroundBeams className="opacity-10" />
      <div className="relative z-10 mx-auto max-w-5xl space-y-6 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Session History</h1>
            <p className="text-sm text-muted-foreground">View and manage your past creative sessions</p>
          </div>
          <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90"><Plus className="mr-2 h-4 w-4" />New Session</Button>
        </motion.div>

        {isLoading ? <PageLoader /> : (
          <>
            <SessionList sessions={sessions} />

            {pagination && pagination.total > 0 && (
              <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-card/30 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">Showing {Math.min((currentPage - 1) * pageSize + 1, pagination.total)}–{Math.min(currentPage * pageSize, pagination.total)} of {pagination.total}</div>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" disabled={currentPage <= 1} onClick={() => goToPage(currentPage - 1)} className="px-2 text-muted-foreground hover:text-foreground">&larr; Prev</Button>
                  {getPageNumbers().map((p, i) => p === 'ellipsis' ? <span key={`e-${i}`} className="px-1 text-muted-foreground">…</span> : (
                    <Button key={p} variant={p === currentPage ? 'default' : 'ghost'} size="sm" onClick={() => goToPage(p)}
                      className={cn('min-w-[2rem]', p === currentPage ? 'bg-primary text-primary-foreground pointer-events-none' : 'text-muted-foreground hover:text-foreground')}>{p}</Button>
                  ))}
                  <Button variant="ghost" size="sm" disabled={currentPage >= totalPages} onClick={() => goToPage(currentPage + 1)} className="px-2 text-muted-foreground hover:text-foreground">Next &rarr;</Button>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Per page:</span>
                  <select value={pageSize} onChange={(e) => changePageSize(e.target.value)}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring backdrop-blur-sm">
                    {PAGE_SIZE_OPTIONS.map((size) => (<option key={size} value={size}>{size}</option>))}
                  </select>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
