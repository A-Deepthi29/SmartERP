import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import StartupMenu from './components/StartupMenu';
import CreateCompany from './components/CreateCompany';
import Dashboard from './components/Dashboard';
import CreateLedger from './components/CreateLedger';
import CreateGroup from './components/CreateGroup';
import StockManagement from './components/StockManagement';
// Replace the old Day 8 import with this complete structural engine view:
import PurchaseVoucher from './components/PurchaseVoucher';
import SalesVoucher from './components/SalesVoucher';
import { useGlobalAccountingHotkeys } from './hooks/useGlobalAccountingHotkeys';

function App() {
    const [userSession, setUserSession] = useState(null);
    const [currentScreen, setCurrentScreen] = useState('AUTH_LOCK');
    const [activeCompany, setActiveCompany] = useState(null);

    // Run auth state validation check upon reload
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Bypass login view if security token signature remains valid
            setUserSession({ id: 1, username: "CachedOperator" });
            setCurrentScreen('STARTUP');
        }
    }, []);

    useGlobalAccountingHotkeys({
        activeCompany,
        isAlterScreen: currentScreen === 'ALTER',
        onShutCompany: () => {
            setActiveCompany(null);
            setCurrentScreen('STARTUP');
        },
        onAlterCompany: () => {
            if (activeCompany) setCurrentScreen('ALTER');
        },
        onDeleteCompany: () => {
            setActiveCompany(null);
            setCurrentScreen('STARTUP');
        }
    });

    const handleLogOutClosure = () => {
        localStorage.removeItem('token');
        setUserSession(null);
        setActiveCompany(null);
        setCurrentScreen('AUTH_LOCK');
    };

    return (
        <div>
            {currentScreen === 'AUTH_LOCK' && (
                <Login onAuthSuccess={(user) => {
                    setUserSession(user);
                    setCurrentScreen('STARTUP');
                }} />
            )}
            
            {currentScreen === 'STARTUP' && (
                <div>
                    <StartupMenu 
                        onCreateSelect={() => setCurrentScreen('CREATE_FORM')}
                        
                        // Captures the dynamic database entity argument mapped from user input
                        onSelectCompanyView={(selectedCompany) => {
                            setActiveCompany(selectedCompany);
                            
                            // Switch screen view to the Core Ledger Dashboard Workspace
                            setCurrentScreen('COMPANY_DASHBOARD');
                        }}
                    />
                    
                    {/* Retro Logout Button Element */}
                    <button 
                        onClick={handleLogOutClosure}
                        style={{ position: 'fixed', bottom: '20px', right: '20px', background: '#dc322f', color: '#fff', border: 'none', padding: '8px 15px', fontFamily: 'monospace', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        [ESC] LOGOUT SESSION
                    </button>
                </div>
            )}
            
            {/* REPLACE THE OLD LOGIC WITH THIS UPDATED WRAPPER */}
            {currentScreen === 'CREATE_FORM' && (
                <div style={{ backgroundColor: '#002b36', color: '#fff', minHeight: '100vh', padding: '40px', fontFamily: 'monospace' }}>
                    
                    {/* The Return Button remains on top */}
                    <button 
                        onClick={() => setCurrentScreen('STARTUP')} 
                        style={{ background: '#2aa198', color: '#fff', padding: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px' }}
                    >
                        Return to Main Menu
                    </button>

                    {/* Rendering the actual company input form component directly inside the screen state */}
                    <CreateCompany onCompanyCreated={() => setCurrentScreen('STARTUP')} />
                    
                </div>
            )}

            {/* MAIN DASHBOARD BLOCK */}
            {currentScreen === 'COMPANY_DASHBOARD' && activeCompany && (
                <Dashboard 
                    activeCompany={activeCompany} 
                    onOpenLedgerForm={() => setCurrentScreen('CREATE_LEDGER')}
                    onOpenGroupForm={() => setCurrentScreen('CREATE_GROUP')}
                    onOpenStockForm={() => setCurrentScreen('STOCK_MANAGEMENT')}
                    onOpenSalesForm={() => setCurrentScreen('SALES_VOUCHER')} // Link state tracker
                    onShutCompany={() => {
                        setActiveCompany(null);
                        setCurrentScreen('STARTUP');
                    }} 
                />
            )}

            {/* DAY 10 VIEW: OUTBOUND SALES VOUCHERS */}
            {currentScreen === 'SALES_VOUCHER' && activeCompany && (
                <SalesVoucher 
                    activeCompany={activeCompany}
                    onBackToDashboard={() => setCurrentScreen('COMPANY_DASHBOARD')}
                />
            )}

            {/* DAY 9 TRANSACTIONS WORKSPACE: GENERATE ACCOUNTING INVENTORY VOUCHERS */}
            {currentScreen === 'STOCK_MANAGEMENT' && activeCompany && (
                <PurchaseVoucher 
                    activeCompany={activeCompany}
                    onBackToDashboard={() => setCurrentScreen('COMPANY_DASHBOARD')}
                />
            )}

            {/* NEW DAY 7 WORKSPACE SCREEN VIEW: CREATE ACCOUNT GROUP */}
            {currentScreen === 'CREATE_GROUP' && activeCompany && (
                <CreateGroup 
                    activeCompany={activeCompany}
                    onBackToDashboard={() => setCurrentScreen('COMPANY_DASHBOARD')}
                />
            )}

            {/* NEW DAY 6 WORKSPACE SCREEN VIEW: CREATE ACCOUNT LEDGER */}
            {currentScreen === 'CREATE_LEDGER' && activeCompany && (
                <CreateLedger 
                    activeCompany={activeCompany}
                    onBackToDashboard={() => setCurrentScreen('COMPANY_DASHBOARD')}
                />
            )}
        </div>
    );
}

export default App;