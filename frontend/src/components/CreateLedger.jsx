import React, { useState, useEffect } from 'react';

export default function CreateLedger({ activeCompany, onBackToDashboard }) {
    const [name, setName] = useState('');
    const [groupId, setGroupId] = useState('');
    const [openingBalance, setOpeningBalance] = useState('0.00');
    const [groups, setGroups] = useState([]);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Fetch account groups from backend database registers on load
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/masters/groups');
                const data = await response.json();
                if (response.ok) {
                    setGroups(data.groups || []);
                    if (data.groups.length > 0) setGroupId(data.groups[0].id);
                }
            } catch (err) {
                console.error('Failed to load parent groups matrix.', err);
            }
        };
        fetchGroups();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        try {
            const response = await fetch('http://localhost:5000/api/masters/ledgers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    group_id: groupId,
                    opening_balance: parseFloat(openingBalance),
                    company_id: activeCompany.id
                })
            });
            const data = await response.json();

            if (response.ok) {
                setMessage(`✅ Ledger "${name.toUpperCase()}" Saved Successfully under active ledger register!`);
                setName('');
                setOpeningBalance('0.00');
            } else {
                setIsError(true);
                setMessage(`⚠️ Error: ${data.message}`);
            }
        } catch (err) {
            setIsError(true);
            setMessage('⚠️ Failed to submit ledger transaction request to endpoint.');
        }
    };

    return (
        <div style={{ backgroundColor: '#002b36', color: '#00ffcc', minHeight: '100vh', padding: '40px', fontFamily: 'monospace' }}>
            <button 
                onClick={onBackToDashboard}
                style={{ background: '#2aa198', color: '#fff', border: 'none', padding: '10px 15px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'monospace' }}
            >
                [ESC] Return to Dashboard
            </button>

            <h2 style={{ textAlign: 'center', borderBottom: '2px solid #00ffcc', paddingBottom: '10px', marginTop: '20px' }}>
                LEDGER MASTER CREATION GATEWAY — {activeCompany.name.toUpperCase()}
            </h2>

            {message && (
                <div style={{ padding: '15px', margin: '20px auto', maxWidth: '600px', backgroundColor: isError ? '#dc322f' : '#859900', color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '30px auto', border: '1px solid #00ffcc', padding: '30px', background: '#001f26' }}>
                
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>LEDGER ACCOUNT NAME:</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="e.g., State Bank of India, Sales A/c"
                        style={{ width: '100%', padding: '10px', background: '#002b36', color: '#fff', border: '1px solid #00ffcc', fontFamily: 'monospace', fontSize: '16px' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>UNDER GROUP CATEGORY:</label>
                    <select 
                        value={groupId}
                        onChange={(e) => setGroupId(e.target.value)}
                        style={{ width: '100%', padding: '10px', background: '#002b36', color: '#00ffcc', border: '1px solid #00ffcc', fontFamily: 'monospace', fontSize: '16px' }}
                    >
                        {groups.map((g) => (
                            <option key={g.id} value={g.id} style={{ background: '#002b36' }}>
                                {g.name.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>OPENING BALANCE (DR/CR):</label>
                    <input 
                        type="number" 
                        step="0.01"
                        value={openingBalance}
                        onChange={(e) => setOpeningBalance(e.target.value)}
                        style={{ width: '100%', padding: '10px', background: '#002b36', color: '#fff', border: '1px solid #00ffcc', fontFamily: 'monospace', fontSize: '16px' }}
                    />
                </div>

                <button 
                    type="submit"
                    style={{ width: '100%', background: '#00ffcc', color: '#002b36', padding: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace', fontSize: '16px' }}
                >
                    POST AND COMMIT LEDGER ACCOUNT [ENTER]
                </button>
            </form>
        </div>
    );
}