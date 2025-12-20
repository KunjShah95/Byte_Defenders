import { useState, useEffect } from 'react';

interface NetworkState {
    online: boolean;
    downlink?: number;
    effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
    rtt?: number;
    saveData?: boolean;
}

/**
 * Custom hook for monitoring network status and connection quality.
 * Essential for offline-first applications and adaptive loading.
 */
export function useNetworkStatus(): NetworkState {
    const [state, setState] = useState<NetworkState>({
        online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    });

    useEffect(() => {
        const updateNetworkInfo = () => {
            const connection = (navigator as any).connection;

            setState({
                online: navigator.onLine,
                downlink: connection?.downlink,
                effectiveType: connection?.effectiveType,
                rtt: connection?.rtt,
                saveData: connection?.saveData,
            });
        };

        // Initial update
        updateNetworkInfo();

        // Listen for online/offline events
        window.addEventListener('online', updateNetworkInfo);
        window.addEventListener('offline', updateNetworkInfo);

        // Listen for connection changes
        const connection = (navigator as any).connection;
        if (connection) {
            connection.addEventListener('change', updateNetworkInfo);
        }

        return () => {
            window.removeEventListener('online', updateNetworkInfo);
            window.removeEventListener('offline', updateNetworkInfo);
            if (connection) {
                connection.removeEventListener('change', updateNetworkInfo);
            }
        };
    }, []);

    return state;
}

export default useNetworkStatus;
