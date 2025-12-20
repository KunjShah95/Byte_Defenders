import React from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { WifiOff, RefreshCw } from 'lucide-react';

/**
 * Offline Banner component that appears when network is disconnected.
 * Provides user feedback and retry functionality.
 */
export function OfflineBanner() {
    const { online } = useNetworkStatus();

    if (online) return null;

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 px-4 py-3 bg-amber-500 text-amber-950 rounded-lg shadow-lg">
                <WifiOff className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">
                    You're offline. Some features may be unavailable.
                </span>
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-amber-600 hover:bg-amber-700 rounded transition-colors"
                >
                    <RefreshCw className="h-3 w-3" />
                    Retry
                </button>
            </div>
        </div>
    );
}

export default OfflineBanner;
