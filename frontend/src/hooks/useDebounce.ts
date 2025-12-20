import { useCallback, useRef } from 'react';

interface DebounceOptions {
    delay?: number;
    leading?: boolean;
}

export function useDebounce<T extends (...args: any[]) => any>(
    callback: T,
    options: DebounceOptions = {}
): (...args: Parameters<T>) => void {
    const { delay = 300, leading = false } = options;
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastCallRef = useRef<number>(0);

    return useCallback(
        (...args: Parameters<T>) => {
            const now = Date.now();

            if (leading && now - lastCallRef.current > delay) {
                callback(...args);
                lastCallRef.current = now;
                return;
            }

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
                lastCallRef.current = Date.now();
            }, delay);
        },
        [callback, delay, leading]
    );
}

export default useDebounce;
