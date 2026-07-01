import { useEffect } from 'react';

export const useGlobalAccountingHotkeys = ({ activeCompany, onShutCompany, onAlterCompany, onDeleteCompany, isAlterScreen }) => {
    useEffect(() => {
        const handleGlobalShortcuts = (e) => {
            // Alt + F1: Shut active workspace context
            if (e.altKey && e.key === 'F1') {
                e.preventDefault();
                if (activeCompany) onShutCompany();
            }

            // Alt + F3: Shift context into Alteration layout settings panel
            if (e.altKey && e.key === 'F3') {
                e.preventDefault();
                onAlterCompany();
            }

            // Alt + D: Trigger context layout instance removal
            if (e.altKey && e.key.toLowerCase() === 'd') {
                e.preventDefault();
                if (isAlterScreen && activeCompany) {
                    const confirmDeletion = window.confirm("Are you sure you want to delete this company entity permanently?");
                    if (confirmDeletion) onDeleteCompany(activeCompany.id);
                }
            }
        };

        window.addEventListener('keydown', handleGlobalShortcuts);
        return () => window.removeEventListener('keydown', handleGlobalShortcuts);
    }, [activeCompany, isAlterScreen]);
};