import React, { useState, useEffect } from 'react';

export default function StartupMenu({ onCreateSelect, onSelectCompanyView }) {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Fetch live company records on mount
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/companies', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                
                if (response.ok) {
                    setCompanies(data.companies || []);
                } else {
                    setError(data.message || 'Error loading records.');
                }
            } catch (err) {
                setError('Failed to reach backend server.');
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    // Add keyboard up/down navigation for a genuine vintage terminal experience
    useEffect(() => {
        if (companies.length === 0) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                setSelectedIndex((prev) => (prev + 1) % companies.length);
            } else if (e.key === 'ArrowUp') {
                setSelectedIndex((prev) => (prev - 1 + companies.length) % companies.length);
            } else if (e.key === 'Enter') {
                onSelectCompanyView(companies[selectedIndex]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [companies, selectedIndex, onSelectCompanyView]);

    return (
        <div style={{ backgroundColor: '#002b36', color: '#00ffcc', minHeight: '100vh', padding: '40px', fontFamily: 'monospace' }}>
            <h1 style={{ textAlign: 'center', borderBottom: '2px solid #00ffcc', paddingBottom: '10px' }}>
                SmartERP v1.0.0 — COMPANY GATEWAY ARCHIVE
            </h1>

            <div style={{ display: 'flex', gap: '40px', marginTop: '30px' }}>
                {/* Left Side Options Panel */}
                <div style={{ width: '35%', borderRight: '1px solid #00ffcc', paddingRight: '20px' }}>
                    <button 
                        onClick={onCreateSelect}
                        style={{ width: '100%', background: '#2aa198', color: '#fff', border: 'none', padding: '12px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px', fontFamily: 'monospace' }}
                    >
                        [C] CREATE COMPANY PROFILE
                    </button>
                    <p style={{ color: '#93a1a1', fontSize: '12px' }}>Use hotkeys or keyboard arrows to parse indices cleanly.</p>
                </div>

                {/* Right Side Live Database Records Grid */}
                <div style={{ width: '65%' }}>
                    <h3>[ SELECT EXISTING LEGER INDEX ]</h3>
                    
                    {loading && <p style={{ color: '#b58900' }}>Scanning system registers...</p>}
                    {error && <p style={{ color: '#dc322f' }}>⚠️ {error}</p>}
                    
                    {!loading && companies.length === 0 && (
                        <p style={{ color: '#93a1a1', border: '1px dashed #93a1a1', padding: '15px' }}>
                            No active corporate profiles detected. Select 'Create Company' to initialize.
                        </p>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {companies.map((company, index) => {
                            const isSelected = index === selectedIndex;
                            return (
                                <div
                                    key={company.id}
                                    onClick={() => onSelectCompanyView(company)}
                                    style={{
                                        padding: '10px',
                                        background: isSelected ? '#00ffcc' : '#001f26',
                                        color: isSelected ? '#002b36' : '#00ffcc',
                                        border: '1px solid #00ffcc',
                                        cursor: 'pointer',
                                        fontWeight: isSelected ? 'bold' : 'normal',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <span>👉 {company.name.toUpperCase()}</span>
                                    <span style={{ fontSize: '12px', opacity: 0.8 }}>📍 {company.state || 'N/A'}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}