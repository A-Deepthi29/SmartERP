import React, { useState } from 'react';

export default function CreateCompany({ onCompanyCreated }) {
    const [formData, setFormData] = useState({
        name: '',
        state: '',
        financial_year_start: '2026-04-01'
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/companies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            if (response.ok) {
                // Return smoothly back to the core startup grid state
                onCompanyCreated(); 
            } else {
                setError(data.message || 'Failed to initialize company profile.');
            }
        } catch (err) {
            setError('Server connection failure.');
        }
    };

    return (
        <div style={{ padding: '20px', color: '#00ffcc', fontFamily: 'monospace' }}>
            <h2>[ COMPANY CREATION PROFILE MODULE ]</h2>
            <hr style={{ borderColor: '#00ffcc' }} />
            
            {error && <p style={{ color: '#ff3333' }}>⚠️ {error}</p>}

            <form onSubmit={handleSubmit} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>COMPANY NAME:</label>
                    <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        style={{ width: '100%', background: '#001a1a', border: '1px solid #00ffcc', color: '#00ffcc', padding: '5px', fontFamily: 'monospace' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>STATE / REGION:</label>
                    <input 
                        type="text" 
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        style={{ width: '100%', background: '#001a1a', border: '1px solid #00ffcc', color: '#00ffcc', padding: '5px', fontFamily: 'monospace' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>FINANCIAL YEAR BEGINNING:</label>
                    <input 
                        type="date" 
                        required
                        value={formData.financial_year_start}
                        onChange={(e) => setFormData({...formData, financial_year_start: e.target.value})}
                        style={{ width: '100%', background: '#001a1a', border: '1px solid #00ffcc', color: '#00ffcc', padding: '5px', fontFamily: 'monospace' }}
                    />
                </div>

                <button 
                    type="submit" 
                    style={{ marginTop: '10px', padding: '10px', background: '#00ffcc', color: '#001a1a', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace' }}
                >
                    SAVE COMPANY LEDGER INDEX [ENTER]
                </button>
            </form>
        </div>
    );
}