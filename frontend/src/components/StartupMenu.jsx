import React, { useState, useEffect } from 'react';

const StartupMenu = ({ onCreateSelect, onSelectCompanyView }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    
    const menuOptions = [
        { label: 'Select Company', action: 'SELECT', key: 's' },
        { label: 'Create Company', action: 'CREATE', key: 'c' }
    ];

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowUp') {
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : menuOptions.length - 1));
            } else if (e.key === 'ArrowDown') {
                setActiveIndex((prev) => (prev < menuOptions.length - 1 ? prev + 1 : 0));
            } else if (e.key === 'Enter') {
                triggerAction(menuOptions[activeIndex].action);
            } else {
                // Tally-inspired alphanumeric instant hotkey processing logic
                const matchedOption = menuOptions.find(opt => opt.key === e.key.toLowerCase());
                if (matchedOption) {
                    e.preventDefault();
                    triggerAction(matchedOption.action);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex]);

    const triggerAction = (action) => {
        if (action === 'CREATE') onCreateSelect();
        if (action === 'SELECT') onSelectCompanyView();
    };

    return (
        <div style={{ backgroundColor: '#002b36', color: '#859900', height: '100vh', fontFamily: 'Courier New, monospace', padding: '40px' }}>
            <h1 style={{ color: '#2aa198' }}>SmartERP Gateway</h1>
            <div style={{ border: '2px solid #2aa198', width: '400px', padding: '15px', marginTop: '20px', backgroundColor: '#073642' }}>
                {menuOptions.map((opt, idx) => (
                    <div 
                        key={opt.action} 
                        style={{ 
                            backgroundColor: activeIndex === idx ? '#2aa198' : 'transparent', 
                            color: activeIndex === idx ? '#ffffff' : '#b58900',
                            padding: '8px 12px',
                            fontSize: '18px',
                            textTransform: 'uppercase'
                        }}
                    >
                        <span style={{ color: activeIndex === idx ? '#fff' : '#dc322f', fontWeight: 'bold', textDecoration: 'underline' }}>
                            {opt.label[0]}
                        </span>
                        {opt.label.substring(1)}
                    </div>
                ))}
            </div>
            <p style={{ color: '#93a1a1', marginTop: '30px', fontSize: '14px' }}>
                Navigation: [↑/↓ Arrows] Navigate | [Enter] Open | Underlined character executes immediate Hotkey shortcut.
            </p>
        </div>
    );
};

export default StartupMenu;