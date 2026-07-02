import React, { useState, useEffect } from 'react';

export default function StockManagement({ activeCompany, onBackToDashboard }) {
    const [name, setName] = useState('');
    const [uom, setUom] = useState('Nos');
    const [openingQty, setOpeningQty] = useState('0');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        try {
            const response = await fetch('http://localhost:5000/api/inventory/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    uom,
                    opening_qty: parseInt(openingQty),
                    company_id: activeCompany.id
                })
            });
            const data = await response.json();

            if (response.ok) {
                setMessage(`✅ ${data.message}`);
                setName('');
                setOpeningQty('0');
            } else {
                setIsError(true);
                setMessage(`⚠️ Error: ${data.message}`);
            }
        } catch (err) {
            setIsError(true);
            setMessage('⚠️ Failed connecting to inventory API endpoint pipeline.');
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
                INVENTORY & STOCK ITEM MASTER — {activeCompany.name.toUpperCase()}
            </h2>

            {message && (
                <div style={{ padding: '15px', margin: '20px auto', maxWidth: '600px', backgroundColor: isError ? '#dc322f' : '#859900', color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '30px auto', border: '1px solid #00ffcc', padding: '30px', background: '#001f26' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>STOCK ITEM NAME:</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="e.g., Lenovo ThinkPad, Wireless Mouse"
                        style={{ width: '100%', padding: '10px', background: '#002b36', color: '#fff', border: '1px solid #00ffcc', fontFamily: 'monospace', fontSize: '16px' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>UNIT OF MEASURE (UOM):</label>
                    <select 
                        value={uom}
                        onChange={(e) => setUom(e.target.value)}
                        style={{ width: '100%', padding: '10px', background: '#002b36', color: '#00ffcc', border: '1px solid #00ffcc', fontFamily: 'monospace', fontSize: '16px' }}
                    >
                        <option value="Nos">Nos (Numbers)</option>
                        <option value="Kgs">Kgs (Kilograms)</option>
                        <option value="Pcs">Pcs (Pieces)</option>
                        <option value="Box">Box</option>
                    </select>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>INITIAL OPENING QUANTITY:</label>
                    <input 
                        type="number" 
                        value={openingQty}
                        onChange={(e) => setOpeningQty(e.target.value)}
                        style={{ width: '100%', padding: '10px', background: '#002b36', color: '#fff', border: '1px solid #00ffcc', fontFamily: 'monospace', fontSize: '16px' }}
                    />
                </div>

                <button 
                    type="submit"
                    style={{ width: '100%', background: '#00ffcc', color: '#002b36', padding: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace', fontSize: '16px' }}
                >
                    SAVE NEW INVENTORY ITEM [ENTER]
                </button>
            </form>
        </div>
    );
}