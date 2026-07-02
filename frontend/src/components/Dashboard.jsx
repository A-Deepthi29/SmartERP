import React, { useState, useEffect } from 'react';

export default function Dashboard({ activeCompany, onShutCompany, onOpenLedgerForm, onOpenGroupForm }) {
    // Menu items designed to replicate classic accounting workflows
    const menuOptions = [
        { label: 'Select Company', code: 'S', action: () => onShutCompany() },
        // Update this line right here:
        { label: 'Create Accounting Group', code: 'A', action: () => onOpenGroupForm() },
        { label: 'Chart of Accounts (Ledgers)', code: 'C', action: () => onOpenLedgerForm() },
        { label: 'Voucher Entry (Transactions)', code: 'V', action: () => alert('Opening Voucher Engine...') },
        { label: 'Trial Balance', code: 'T', action: () => alert('Opening Trial Balance Reporting...') },
    ];

    const [selectedIndex, setSelectedIndex] = useState(0);

    // Keyboard controls for Arrow keys, Enter, and Retro function hotkeys
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % menuOptions.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + menuOptions.length) % menuOptions.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                menuOptions[selectedIndex].action();
            } else if (e.key === 'F3') {
                e.preventDefault();
                onShutCompany(); // Close company instantly via classic F3 shortcut
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, activeCompany]);

    return (
        <div style={{ backgroundColor: '#002b36', color: '#00ffcc', minHeight: '100vh', fontFamily: 'monospace', padding: '20px' }}>
            
            {/* Top Status Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #00ffcc', paddingBottom: '5px', fontSize: '14px' }}>
                <span>SmartERP v1.0.0</span>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>Gateway of SmartERP</span>
                <span>Press [F3] to Shut Company</span>
            </div>

            {/* Split Screen Columns Layout */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', height: 'calc(100vh - 100px)' }}>
                
                {/* Left Side: Corporate Meta Information Panel */}
                <div style={{ width: '50%', border: '1px solid #00ffcc', padding: '20px', background: '#001f26' }}>
                    <h3 style={{ color: '#b58900', borderBottom: '1px dashed #00ffcc', paddingBottom: '5px' }}>CURRENT WORKSPACE</h3>
                    <table style={{ width: '100%', color: '#00ffcc', borderCollapse: 'collapse', marginTop: '15px' }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: '8px 0', fontWeight: 'bold', width: '40%' }}>Company Name:</td>
                                <td style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>{activeCompany.name.toUpperCase()}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px 0', fontWeight: 'bold' }}>State Jurisdiction:</td>
                                <td style={{ color: '#2aa198' }}>{activeCompany.state || 'Not Specified'}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Financial Year:</td>
                                <td style={{ color: '#b58900' }}>
                                    {activeCompany.financial_year_start ? new Date(activeCompany.financial_year_start).toLocaleDateString('en-GB') : '01/04/2026'}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Books Status:</td>
                                <td style={{ color: '#859900' }}>🟢 Operational & Active</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Right Side: Keyboard Navigation Operational Menu */}
                <div style={{ width: '50%', border: '1px solid #00ffcc', padding: '20px', background: '#001f26', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ borderBottom: '1px solid #00ffcc', width: '100%', textAlign: 'center', paddingBottom: '10px', color: '#fff' }}>
                        MAIN MENU
                    </h3>
                    
                    <div style={{ width: '80%', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {menuOptions.map((option, index) => {
                            const isSelected = index === selectedIndex;
                            return (
                                <div
                                    key={index}
                                    onClick={() => option.action()}
                                    style={{
                                        padding: '12px 20px',
                                        background: isSelected ? '#00ffcc' : 'transparent',
                                        color: isSelected ? '#002b36' : '#00ffcc',
                                        border: isSelected ? '1px solid #fff' : '1px solid transparent',
                                        cursor: 'pointer',
                                        fontWeight: isSelected ? 'bold' : 'normal',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '16px'
                                    }}
                                >
                                    <span>
                                        <span style={{ color: isSelected ? '#dc322f' : '#fff', marginRight: '10px', fontWeight: 'bold' }}>
                                            [{option.code}]
                                        </span>
                                        {option.label}
                                    </span>
                                    {isSelected && <span>◀</span>}
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ marginTop: 'auto', color: '#93a1a1', fontSize: '12px', textAlign: 'center', borderTop: '1px dashed #2aa198', width: '100%', paddingTop: '10px' }}>
                        Use [↑ / ↓ Keys] to navigate, [Enter] to select option
                    </div>
                </div>

            </div>
        </div>
    );
}