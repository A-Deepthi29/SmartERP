import React, { useState } from 'react';
import StartupMenu from './components/StartupMenu';
import { useGlobalAccountingHotkeys } from './hooks/useGlobalAccountingHotkeys';

function App() {
    const [currentScreen, setCurrentScreen] = useState('STARTUP');
    const [activeCompany, setActiveCompany] = useState(null);

    // Mount background shortcut global engine hook listeners
    useGlobalAccountingHotkeys({
        activeCompany,
        isAlterScreen: currentScreen === 'ALTER',
        onShutCompany: () => {
            alert(`Shutting active environment footprint for context: ${activeCompany.name}`);
            setActiveCompany(null);
            setCurrentScreen('STARTUP');
        },
        onAlterCompany: () => {
            if (activeCompany) setCurrentScreen('ALTER');
        },
        onDeleteCompany: async (id) => {
            try {
                const res = await fetch(`http://localhost:5000/api/companies/${id}`, { method: 'DELETE' });
                const json = await res.json();
                if(json.success) {
                    alert(json.message);
                    setActiveCompany(null);
                    setCurrentScreen('STARTUP');
                } else {
                    alert(json.error);
                }
            } catch (err) {
                console.error("Deletion execution failure:", err);
            }
        }
    });

    return (
        <div>
            {currentScreen === 'STARTUP' && (
                <StartupMenu 
                    onCreateSelect={() => setCurrentScreen('CREATE_FORM')}
                    onSelectCompanyView={() => {
                        // Mock runtime choice context assignment to evaluate shortcut state changes
                        setActiveCompany({ id: 1, name: "Sample Enterprise Ltd" });
                        alert("Company mock loaded. Press [Alt + F3] to Alter setup parameters or [Alt + F1] to Shut context workspace.");
                    }}
                />
            )}
            {currentScreen === 'CREATE_FORM' && (
                <div style={{ backgroundColor: '#002b36', color: '#fff', height: '100vh', padding: '40px', fontFamily: 'monospace' }}>
                    <h2>[Company Creation Interface Workspace Mode]</h2>
                    <p>Press Esc key mapping route manually logic placeholder to get back into Startup interface console view panels.</p>
                    <button onClick={() => setCurrentScreen('STARTUP')} style={{ background: '#2aa198', color: '#fff', padding: '10px' }}>
                        Back to main panel
                    </button>
                </div>
            )}
            {currentScreen === 'ALTER' && (
                <div style={{ backgroundColor: '#002b36', color: '#fff', height: '100vh', padding: '40px', fontFamily: 'monospace' }}>
                    <h2 style={{ color: '#cb4b16' }}>[Alteration Interface Framework Mode: Altering - {activeCompany?.name}]</h2>
                    <p style={{ color: '#dc322f', fontWeight: 'bold' }}>⚠️ Hotkey Operational Target Active: Press [Alt + D] sequence directly on this screen to simulate schema resource deletion cascade.</p>
                    <button onClick={() => setCurrentScreen('STARTUP')} style={{ background: '#586e75', color: '#fff', padding: '10px', marginTop: '20px' }}>
                        Cancel Execution
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;