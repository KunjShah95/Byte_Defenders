import { useEffect, useCallback } from 'react';

type KeyCombo = string;
type Handler = (event: KeyboardEvent) => void;

interface ShortcutOptions {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
}

export function useKeyboardShortcut(
    key: KeyCombo,
    handler: Handler,
    options: ShortcutOptions = {}
) {
    const { ctrl = false, alt = false, shift = false, meta = false } = options;

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;
            const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
            const isEditable = target.isContentEditable;

            if (key !== 'Escape' && (isInput || isEditable)) {
                return;
            }

            if (ctrl !== event.ctrlKey) return;
            if (alt !== event.altKey) return;
            if (shift !== event.shiftKey) return;
            if (meta !== event.metaKey) return;

            if (event.key.toLowerCase() === key.toLowerCase()) {
                event.preventDefault();
                handler(event);
            }
        },
        [key, handler, ctrl, alt, shift, meta]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}

export default useKeyboardShortcut;
