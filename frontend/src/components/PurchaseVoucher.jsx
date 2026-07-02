import React, { useState, useEffect } from 'react';

export default function PurchaseVoucher({ activeCompany, onBackToDashboard }) {
    const [invoiceNo, setInvoiceNo] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [ledgers, setLedgers] = useState([]);
    const [supplierId, setSupplierId] = useState('');
    const [items, setItems] = useState([]);
    const [itemId, setItemId] = useState('');
    const [qty, setQty] = useState('');
    const [rate, setRate] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Dynamic configuration fetcher to populate selection arrays automatically
    useEffect(() => {
        const loadFormData = async () => {
            try {
                // Pull active ledgers to trace accounting entities
                const ledgerRes = await fetch('http://localhost:5000/api/companies'); // Adjust if explicit ledger fetch endpoint exists
                const ledgerData = await ledgerRes.json();
                
                // Pull available stock items from Day 8 registers
                const itemRes = await fetch('http://localhost:5000/api/inventory/groups'); 
                const itemData = await itemRes.json();

                // Reusing safely maps to guarantee clean fallbacks 
                setLedgers(ledgerData.companies || []);
                if (ledgerData.companies?.length > 0) setSupplierId(ledgerData.companies[0].id);

                setItems(itemData.groups || []);
                if (itemData.groups?.length > 0) setItemId(itemData.groups[0].id);
            } catch (err) {
                console.error('Error hydrating master relational dropdown matrices:', err);
            }
        };
        loadFormData();
    }, []);

    // Auto calculate calculation field values cleanly
    useEffect(() => {
        const calculated = parseFloat(qty || 0) * parseFloat(rate || 0);
        setTotalAmount(calculated.toFixed(2));
    }, [qty, rate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        try {
            const response = await fetch('http://localhost:5000/api/vouchers/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    invoice_no: invoiceNo,
                    date,
                    supplier_ledger_id: supplierId,
                    stock_item_id: itemId,
                    qty: parseInt(qty),
                    rate: parseFloat(rate),
                    total_amount: parseFloat(totalAmount),
                    company_id: activeCompany.id
                })
            });
            const data = await response.json();

            if (response.ok) {
                setMessage(`✅ ${data.message}`);
                setInvoiceNo('');
                setQty('');
                setRate('');
            } else {
                setIsError(true);
                setMessage(`⚠️ Engine Error: ${data.message}`);
            }
        } catch (err) {
            setIsError(true);
            setMessage('⚠️ Failed communicating to voucher execution transaction engine.');
        }
    };

    return (
        <div style={{ backgroundColor: '#002b36', color: '#00ffcc', minHeight: '100vh', padding: '40px', fontFamily: 'monospace' }}>
            <button onClick={onBackToDashboard} style={{ background: '#2aa198', color: '#fff', border: 'none', padding: '10px 15px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'monospace' }}>
                [ESC] Return to Dashboard
            </button>

            <h2 style={{ textAlign: 'center', borderBottom: '2px solid #00ffcc', paddingBottom: '10px', marginTop: '20px' }}>
                PURCHASE VOUCHER ENGINE (INVENTORY ENTRY) — {activeCompany.name.toUpperCase()}
            </h2>

            {message && (
                <div style={{ padding: '15px', margin: '20px auto', maxWidth: '700px', backgroundColor: isError ? '#dc322f' : '#859900', color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ maxWidth: '700px', margin: '30px auto', border: '1px solid #00ffcc', padding: '30px', background: '#001f26' }}>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>SUPPLIER INVOICE NO:</label>
                        <input type="text" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} required placeholder="e.g., PUR-8891" style={{ width: '100%', padding: '10px', background: '#002b36', color: '#fff', border: '1px solid #00ffcc', fontFamily: 'monospace' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>DATE OF ENTRY:</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ width: '100%', padding: '10px', background: '#002b36', color: '#fff', border: '1px solid #00ffcc', fontFamily: 'monospace' }} />
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>PARTY / SUPPLIER ACCOUNT LEDGER:</label>
                    <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} style={{ width: '100%', padding: '10px', background: '#002b36', color: '#00ffcc', border: '1px solid #00ffcc', fontFamily: 'monospace' }}>
                        {ledgers.map(l => <option key={l.id} value={l.id}>{l.name.toUpperCase()}</option>)}
                    </select>
                </div>

                <div style={{ marginBottom: '20px', borderTop: '1px dashed #2aa198', paddingTop: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>SELECT INVENTORY ITEM:</label>
                    <select value={itemId} onChange={(e) => setItemId(e.target.value)} style={{ width: '100%', padding: '10px', background: '#002b36', color: '#00ffcc', border: '1px solid #00ffcc', fontFamily: 'monospace' }}>
                        <option value="1">LOGITECH KEYBOARD</option>
                        {items.map(i => <option key={i.id} value={i.id}>{i.name.toUpperCase()}</option>)}
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>QUANTITY:</label>
                        <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} required placeholder="0" style={{ width: '100%', padding: '10px', background: '#002b36', color: '#fff', border: '1px solid #00ffcc', fontFamily: 'monospace' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>UNIT RATE (₹):</label>
                        <input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} required placeholder="0.00" style={{ width: '100%', padding: '10px', background: '#002b36', color: '#fff', border: '1px solid #00ffcc', fontFamily: 'monospace' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#b58900' }}>GROSS TOTAL AMOUNT:</label>
                        <div style={{ width: '100%', padding: '12px 10px', background: '#001f26', color: '#fff', border: '1px dashed #b58900', fontWeight: 'bold', fontSize: '16px' }}>
                            ₹ {totalAmount}
                        </div>
                    </div>
                </div>

                <button type="submit" style={{ width: '100%', background: '#00ffcc', color: '#002b36', padding: '14px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace', fontSize: '16px' }}>
                    POST AND POST TRANSACTION VOUCHER [ENTER]
                </button>
            </form>
        </div>
    );
}