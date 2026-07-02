import React, { useState } from 'react';

const Login = ({ onAuthSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();

            if (result.success) {
                // Store signature securely inside browser tracking contexts
                localStorage.setItem('token', result.token);
                onAuthSuccess(result.user);
            } else {
                setErrorMsg(result.error || 'Authentication failure.');
            }
        } catch (err) {
            setErrorMsg('Cannot communicate with authentication microservice engine.');
        }
    };

    return (
        <div style={{ backgroundColor: '#002b36', color: '#859900', height: '100vh', fontFamily: 'Courier New, monospace', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ border: '2px solid #2aa198', width: '380px', padding: '25px', backgroundColor: '#073642' }}>
                <h2 style={{ color: '#2aa198', margin: '0 0 20px 0', textAlign: 'center', textTransform: 'uppercase' }}>SmartERP Security Gateway</h2>
                
                {errorMsg && <div style={{ color: '#dc322f', marginBottom: '15px', fontWeight: 'bold' }}>⚠️ ERR: {errorMsg}</div>}
                
                <form onSubmit={handleFormSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', color: '#b58900', marginBottom: '5px' }}>OPERATOR USERNAME:</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '6px', background: '#002b36', border: '1px solid #2aa198', color: '#859900', outline: 'none', fontFamily: 'monospace' }}
                            required 
                            autoFocus
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: '#b58900', marginBottom: '5px' }}>SECURITY PASSWORD:</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '6px', background: '#002b36', border: '1px solid #2aa198', color: '#859900', outline: 'none', fontFamily: 'monospace' }}
                            required 
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '10px', background: '#2aa198', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '14px' }}>
                        Access Security Console [Enter]
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;