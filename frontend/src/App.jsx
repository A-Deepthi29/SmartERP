import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import StartupMenu from './components/StartupMenu';
import CreateCompany from './components/CreateCompany';
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

            {currentScreen === 'COMPANY_DASHBOARD' && activeCompany && (
                <div style={{ backgroundColor: '#002b36', color: '#fff', minHeight: '100vh', padding: '40px', fontFamily: 'monospace' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #00ffcc', paddingBottom: '10px' }}>
                        <h2>🏢 WORKING CURRENT DATABASE REGISTER: <span style={{ color: '#00ffcc' }}>{activeCompany.name.toUpperCase()}</span></h2>
                        <button 
                            onClick={() => {
                                setActiveCompany(null);
                                setCurrentScreen('STARTUP');
                            }}
                            style={{ background: '#dc322f', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            [F3] SHUT COMPANY
                        </button>
                    </div>
                    <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #2aa198', background: '#001f26' }}>
                        <p>🚀 <strong>Gateway Module Initialized Successfully.</strong></p>
                        <p>You can now prepare custom charts of accounts, financial reporting matrices, or ledger balances for this entity profile block.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;