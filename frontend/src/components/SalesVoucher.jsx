import React, { useState, useEffect } from 'react';

export default function SalesVoucher({ activeCompany, onBackToDashboard }) {
    const [invoiceNo, setInvoiceNo] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [customers, setCustomers] = useState([]);
    const [customerId, setCustomerId] = useState('');
    const [qty, setQty] = useState('');
    const [rate, setRate] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const loadFormData = async () => {
            try {
                const customerRes = await fetch('http://localhost:5000/api/companies');
                const customerData = await customerRes.json();
                setCustomers(customerData.companies || []);
                if (customerData.companies?.length > 0) setCustomerId(customerData.companies[0].id);
            } catch (err) {
                console.error('Error hydrating sales form masters:', err);
            }
        };
        loadFormData();
    }, []);

    useEffect(() => {
        const calculated = parseFloat(qty || 0) * parseFloat(rate || 0);
        setTotalAmount(calculated.toFixed(2));
    }, [qty, rate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        try {
            const response = await fetch('http://localhost:5000/api/vouchers/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    invoice_no: invoiceNo,
                    date,
                    customer_ledger_id: customerId,
                    stock_item_id: 1, // Static placeholder referencing our compiled item rows 
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
                setMessage(`⚠️ Verification Alert: ${data.message}`);
            }
        } catch (err) {
            setIsError(true);
            setMessage('⚠️ Fatal error routing pipeline packets.');
        }
    };

    return (
        <div style={{ backgroundColor: '#002b36', color: '#ffcc00', minHeight: '100vh', padding: '40px', fontFamily: 'monospace' }}>
            <button onClick={onBackToDashboard} style={{ background: '#b58900', color: '#fff', border: 'none', padding: '10px 15px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'monospace' }}>
                [ESC] Return to Dashboard
            </button>

            <h2 style={{ textAlign: 'center', borderBottom: '2px solid #ffcc00', paddingBottom: '10px', marginTop: '20px', color: '#ffcc00' }}>
                SALES INVOICING & OUTBOUND VOUCHER V1.0 — {activeCompany.name.toUpperCase()}
            </h2>

            {message && (
                <div style={{ padding: '15px', margin: '20px auto', maxWidth: '700px', backgroundColor: isError ? '#dc322f' : '#859900', color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ maxWidth: '700px', margin: '30px auto', border: '1px solid #ffcc00', padding: '30px', background: '#001f26' }}>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>SALES INVOICE NO:</label>
                        <input type="text" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} required placeholder="e.g., S-9921" style={{ width: '100%', padding: '10px', background: '#002b36', color: '#fff', border: '1px solid #ffcc00', fontFamily: 'monospace' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>BILLING DATE:</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ width: '100%', padding: '10px', background: '#002b36', color: '#fff', border: '1px solid #ffcc00', fontFamily: 'monospace' }} />
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>BUYER / CUSTOMER ACCOUNT LEDGER:</label>
                    <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} style={{ width: '100%', padding: '10px', background: '#002b36', color: '#ffcc00', border: '1px solid #ffcc00', fontFamily: 'monospace' }}>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
                    </select>
                </div>

                <div style={{ marginBottom: '20px', borderTop: '1px dashed #ffcc00', paddingTop: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>PRODUCT DISPATCH:</label>
                    <select style={{ width: '100%', padding: '10px', background: '#002b36', color: '#ffcc00', border: '1px solid #ffcc00', fontFamily: 'monospace' }}>
                        <option>LOGITECH KEYBOARD</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>QTY OUT:</label>
                        <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} required placeholder="0" style={{ width: '100%', padding: '10px', background: '#002b36', color: '#fff', border: '1px solid #ffcc00', fontFamily: 'monospace' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>SELLING PRICE (₹):</label>
                        <input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} required placeholder="0.00" style={{ width: '100%', padding: '10px', background: '#002b36', color: '#fff', border: '1px solid #ffcc00', fontFamily: 'monospace' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#cb4b16' }}>NET INVOICE TOTAL:</label>
                        <div style={{ width: '100%', padding: '12px 10px', background: '#001f26', color: '#fff', border: '1px dashed #cb4b16', fontWeight: 'bold', fontSize: '16px' }}>
                            ₹ {totalAmount}
                        </div>
                    </div>
                </div>

                <button type="submit" style={{ width: '100%', background: '#ffcc00', color: '#002b36', padding: '14px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace', fontSize: '16px' }}>
                    PRINT AND POST OUTBOUND SALES INVOICE [ENTER]
                </button>
            </form>
        </div>
    );
}