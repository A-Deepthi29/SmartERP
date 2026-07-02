import { useEffect } from 'react';

/**
 * Reusable Global Keyboard Shortcut Listener Hook
 * @param {string} targetKey - The character or code key to look out for (case-insensitive)
 * @param {Function} callback - The execution block to fire when key is triggered
 */
export default function useKeyPress(targetKey, callback) {
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Check if user is currently typing inside form input fields or select lists
            // If they are, bypass firing shortcuts so typing data doesn't trigger screen switches!
            if (
                document.activeElement.tagName === 'INPUT' || 
                document.activeElement.tagName === 'SELECT' || 
                document.activeElement.tagName === 'TEXTAREA'
            ) {
                return;
            }

            // Convert keys to uppercase strings to support case-insensitive typing
            if (event.key.toUpperCase() === targetKey.toUpperCase()) {
                event.preventDefault(); // Stop standard default browser operations
                callback();
            }
        };

        // Attach global listener to the window object
        window.addEventListener('keydown', handleKeyDown);

        // 🧽 Cleanup function: Unmounts listener when screen view updates
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [targetKey, callback]);
}