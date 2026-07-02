import React, { useState, useEffect } from 'react';

export default function Dashboard({ 
    activeCompany, 
    onOpenLedgerForm, 
    onOpenGroupForm, 
    onOpenStockForm, 
    onOpenSalesForm, 
    onOpenReports, 
    onShutCompany 
}) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const menuOptions = [
        { label: 'Create Accounting Group', code: 'A' },
        { label: 'Chart of Accounts (Ledgers)', code: 'C' },
        { label: 'Voucher Entry (Purchase Entries)', code: 'V' },
        { label: 'Voucher Entry (Sales Invoices)', code: 'T' },
        { label: 'Profitability Analytics Reports', code: 'P' },
        { label: 'Shut Loaded Company Module', code: 'S' },
    ];

    // Centralised selection router to map options cleanly to parent handlers
    const executeAction = (option) => {
        if (option.code === 'A') onOpenGroupForm();
        if (option.code === 'C') onOpenLedgerForm();
        if (option.code === 'V') onOpenStockForm();
        if (option.code === 'T') onOpenSalesForm();
        if (option.code === 'P') onOpenReports();
        if (option.code === 'S') onShutCompany();
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : menuOptions.length - 1));
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev < menuOptions.length - 1 ? prev + 1 : 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                executeAction(menuOptions[selectedIndex]); // FIXED: No longer calls option.action()
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex]);

    return (
        <div style={{ padding: '20px', display: 'flex', gap: '20px', backgroundColor: '#002b36', color: '#839496', minHeight: '90vh' }}>
            {/* Left Sidebar Status Panel */}
            <div style={{ flex: 1, border: '1px solid #2aa198', padding: '20px' }}>
                <h3 style={{ color: '#b58900', borderBottom: '1px dashed #586e75', paddingBottom: '10px' }}>CURRENT WORKSPACE</h3>
                <p><strong>Company Name:</strong> <span style={{ color: '#fff', fontSize: '18px' }}>{activeCompany.name}</span></p>
                <p><strong>State Jurisdiction:</strong> {activeCompany.state_jurisdiction || 'Texas'}</p>
                <p><strong>Financial Year:</strong> 01/04/2026</p>
                <p><strong>Books Status:</strong> <span style={{ color: '#859900' }}>🟢 Operational & Active</span></p>
            </div>

            {/* Right Interactive Menu Console */}
            <div style={{ flex: 1.5, border: '1px solid #2aa198', padding: '20px' }}>
                <h3 style={{ textAlign: 'center', color: '#fff', borderBottom: '1px solid #2aa198', paddingBottom: '10px' }}>MAIN MENU</h3>
                
                <div style={{ marginTop: '20px' }}>
                    {menuOptions.map((opt, idx) => {
                        const isSelected = idx === selectedIndex;
                        return (
                            <div 
                                key={idx}
                                onClick={() => executeAction(opt)} // FIXED: No longer calls option.action()
                                style={{
                                    padding: '14px 20px',
                                    margin: '8px 0',
                                    backgroundColor: isSelected ? '#073642' : 'transparent',
                                    border: isSelected ? '2px solid #00ffcc' : '1px solid #586e75',
                                    color: isSelected ? '#00ffcc' : '#2aa198',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontWeight: isSelected ? 'bold' : 'normal',
                                    alignItems: 'center'
                                }}
                            >
                                <span>[{opt.code}] {opt.label}</span>
                                {isSelected && <span style={{ color: '#00ffcc' }}>◀</span>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}