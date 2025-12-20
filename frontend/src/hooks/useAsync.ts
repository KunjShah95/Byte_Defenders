import { useState, useCallback } from 'react';

interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

/**
 * Custom hook for handling async operations with loading and error states.
 * Follows senior engineering patterns for clean async state management.
 */
export function useAsync<T>() {
    const [state, setState] = useState<AsyncState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const execute = useCallback(async (promise: Promise<T>) => {
        setState({ data: null, loading: true, error: null });
        try {
            const data = await promise;
            setState({ data, loading: false, error: null });
            return data;
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            setState({ data: null, loading: false, error: err });
            throw err;
        }
    }, []);

    const reset = useCallback(() => {
        setState({ data: null, loading: false, error: null });
    }, []);

    return { ...state, execute, reset };
}

export default useAsync;
