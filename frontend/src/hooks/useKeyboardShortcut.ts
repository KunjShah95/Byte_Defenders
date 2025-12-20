import { useEffect, useCallback } from 'react';

type KeyCombo = string;
type Handler = (event: KeyboardEvent) => void;

interface ShortcutOptions {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
}

/**
 * Custom hook for registering keyboard shortcuts.
 * Supports modifier keys and follows accessibility best practices.
 * 
 * @example
 * useKeyboardShortcut('k', () => openSearch(), { ctrl: true });
 * useKeyboardShortcut('Escape', () => closeModal());
 */
export function useKeyboardShortcut(
    key: KeyCombo,
    handler: Handler,
    options: ShortcutOptions = {}
) {
    const { ctrl = false, alt = false, shift = false, meta = false } = options;

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            // Check if target is an input field
            const target = event.target as HTMLElement;
            const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
            const isEditable = target.isContentEditable;

            // Allow escape to work even in inputs
            if (key !== 'Escape' && (isInput || isEditable)) {
                return;
            }

            // Check modifier keys
            if (ctrl !== event.ctrlKey) return;
            if (alt !== event.altKey) return;
            if (shift !== event.shiftKey) return;
            if (meta !== event.metaKey) return;

            // Check the key
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
