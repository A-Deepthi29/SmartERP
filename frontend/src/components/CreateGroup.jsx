import React, { useState, useEffect } from 'react';

export default function CreateGroup({ activeCompany, onBackToDashboard }) {
    const [name, setName] = useState('');
    const [parentId, setParentId] = useState('');
    const [parentOptions, setParentOptions] = useState([]);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Dynamic extraction of existing categories to handle nesting relationships
    useEffect(() => {
        const fetchParentOptions = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/masters/groups');
                const data = await response.json();
                if (response.ok) {
                    setParentOptions(data.groups || []);
                }
            } catch (err) {
                console.error('Failed parsing core master configurations.', err);
            }
        };
        fetchParentOptions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        try {
            const response = await fetch('http://localhost:5000/api/masters/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    parent_id: parentId || null,
                    company_id: activeCompany.id
                })
            });
            const data = await response.json();

            if (response.ok) {
                setMessage(`✅ Accounting Group "${name.toUpperCase()}" registered securely!`);
                setName('');
                setParentId('');
            } else {
                setIsError(true);
                setMessage(`⚠️ Engine Error: ${data.message}`);
            }
        } catch (err) {
            setIsError(true);
            setMessage('⚠️ Failed connecting to execution pipeline.');
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
                ACCOUNTING GROUP SYSTEM MASTER — {activeCompany.name.toUpperCase()}
            </h2>

            {message && (
                <div style={{ padding: '15px', margin: '20px auto', maxWidth: '600px', backgroundColor: isError ? '#dc322f' : '#859900', color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '30px auto', border: '1px solid #00ffcc', padding: '30px', background: '#001f26' }}>
                
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>GROUP NAME:</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="e.g., Delhi Debtors, South Region Sales"
                        style={{ width: '100%', padding: '10px', background: '#002b36', color: '#fff', border: '1px solid #00ffcc', fontFamily: 'monospace', fontSize: '16px' }}
                    />
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>UNDER PARENT PRIMARY CATEGORY:</label>
                    <select 
                        value={parentId}
                        onChange={(e) => setParentId(e.target.value)}
                        style={{ width: '100%', padding: '10px', background: '#002b36', color: '#00ffcc', border: '1px solid #00ffcc', fontFamily: 'monospace', fontSize: '16px' }}
                    >
                        <option value="">-- Primary Base Group --</option>
                        {parentOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                                {opt.name.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>

                <button 
                    type="submit"
                    style={{ width: '100%', background: '#00ffcc', color: '#002b36', padding: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace', fontSize: '16px' }}
                >
                    COMMIT NEW ACCOUNT NODE [ENTER]
                </button>
            </form>
        </div>
    );
}