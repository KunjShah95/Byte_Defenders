import { useCallback, useRef } from 'react';

interface DebounceOptions {
    delay?: number;
    leading?: boolean;
}

/**
 * Custom hook for debouncing function calls.
 * Useful for search inputs, resize handlers, and other frequent events.
 * 
 * @example
 * const debouncedSearch = useDebounce((query: string) => {
 *   searchApi(query);
 * }, { delay: 300 });
 */
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

            // Leading edge call
            if (leading && now - lastCallRef.current > delay) {
                callback(...args);
                lastCallRef.current = now;
                return;
            }

            // Clear previous timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Set new timeout
            timeoutRef.current = setTimeout(() => {
                callback(...args);
                lastCallRef.current = Date.now();
            }, delay);
        },
        [callback, delay, leading]
    );
}

export default useDebounce;
