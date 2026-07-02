import React, { useState, useEffect } from 'react';

export default function InvoicePrintView({ invoiceNo, activeCompany, onBackToDashboard }) {
    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoiceDetails = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/billing/invoice/${invoiceNo}?company_id=${activeCompany.id}`);
                const data = await res.json();
                if (data.success) {
                    setInvoiceData(data.invoice);
                }
            } catch (err) {
                console.error('Failed querying invoice print structures:', err);
            } finally {
                setLoading(false);
            }
        };
        if (invoiceNo) fetchInvoiceDetails();
    }, [invoiceNo, activeCompany]);

    if (loading) return <div style={{ color: '#00ffcc', padding: '20px', fontFamily: 'monospace' }}>Compiling Invoice Streams...</div>;
    if (!invoiceData) return <div style={{ color: '#dc322f', padding: '20px', fontFamily: 'monospace' }}>Invoice metadata mapping fault occurred.</div>;

    // Calculate billing math
    const subTotal = invoiceData.quantity * invoiceData.unit_rate;
    const cgst = subTotal * 0.09; // 9% CGST
    const sgst = subTotal * 0.09; // 9% SGST
    const grossInvoiceTotal = subTotal + cgst + sgst;

    return (
        <div style={{ backgroundColor: '#586e75', minHeight: '100vh', padding: '30px 10px', fontFamily: 'monospace' }}>
            {/* Screen Controls Toolbar (Invisible during hard-copy printout execution phases) */}
            <div className="no-print" style={{ maxWidth: '800px', margin: '0 auto 20px auto', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={onBackToDashboard} style={{ background: '#002b36', color: '#00ffcc', border: '1px solid #00ffcc', padding: '10px 15px', cursor: 'pointer', fontWeight: 'bold' }}>
                    [ESC] Return to Gateway Terminal
                </button>
                <button onClick={() => window.print()} style={{ background: '#859900', color: '#fff', border: 'none', padding: '10px 25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                    🖨️ PRINT / SAVE TO PDF INVOICE [P]
                </button>
            </div>

            {/* Traditional Tally Style Commercial Matrix Invoice Layout Box Container */}
            <div id="print-area" style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', color: '#000', padding: '30px', border: '3px solid #000', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
                
                {/* Print Helper CSS Overrides Injection */}
                <style>{`
                    @media print {
                        body { background: white !important; color: black !important; }
                        .no-print { display: none !important; }
                        #print-area { border: none !important; boxShadow: none !important; padding: 0 !important; }
                    }
                `}</style>

                {/* Header Grid Section */}
                <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '15px', marginBottom: '20px' }}>
                    <h1 style={{ margin: '0 0 5px 0', fontSize: '26px', fontWeight: 'bold', letterSpacing: '1px' }}>{activeCompany.name.toUpperCase()}</h1>
                    <p style={{ margin: '2px 0' }}>Commercial Trade Distribution Node - State Jurisdiction: {activeCompany.state_jurisdiction || 'Texas Branch'}</p>
                    <p style={{ margin: '2px 0', fontSize: '12px', fontWeight: 'bold' }}>TAX INVOICE / ORIGINAL FOR RECIPIENT</p>
                </div>

                {/* Metadata Tracking Split Panel Info Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #000', paddingBottom: '15px', marginBottom: '20px' }}>
                    <div>
                        <p style={{ margin: '3px 0' }}><strong>BUYER / CUSTOMER REFERENCE:</strong></p>
                        <p style={{ margin: '0', fontSize: '16px' }}>CASH / WALLET SETTLEMENT NODE</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: '3px 0' }}><strong>INVOICE NO:</strong> {invoiceData.invoice_no}</p>
                        <p style={{ margin: '3px 0' }}><strong>DATE OF DISTRIBUTION:</strong> {new Date(invoiceData.date).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Main Billing Ledger Grid Matrix Table Layout View */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000', background: '#f4f4f4' }}>
                            <th style={{ textAlign: 'left', padding: '10px', width: '5%' }}>SN</th>
                            <th style={{ textAlign: 'left', padding: '10px', width: '55%' }}>DESCRIPTION OF INVENTORY GOODS</th>
                            <th style={{ textAlign: 'right', padding: '10px', width: '10%' }}>QTY</th>
                            <th style={{ textAlign: 'right', padding: '10px', width: '15%' }}>RATE (₹)</th>
                            <th style={{ textAlign: 'right', padding: '10px', width: '15%' }}>AMOUNT (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid #000', height: '150px', verticalAlign: 'top' }}>
                            <td style={{ padding: '10px' }}>1</td>
                            <td style={{ padding: '10px', fontWeight: 'bold' }}>{invoiceData.item_description}</td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>{invoiceData.quantity} Nos</td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>{invoiceData.unit_rate.toFixed(2)}</td>
                            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>{subTotal.toFixed(2)}</td>
                        </tr>
                        
                        {/* Tax Valuation Footnotes Summary Stack */}
                        <tr>
                            <td colSpan="3"></td>
                            <td style={{ padding: '6px', textAlign: 'right', fontSize: '13px' }}>SUB-TOTAL:</td>
                            <td style={{ padding: '6px', textAlign: 'right', fontSize: '13px' }}>₹ {subTotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan="3"></td>
                            <td style={{ padding: '6px', textAlign: 'right', fontSize: '12px', color: '#555' }}>CENTRAL GST (9%):</td>
                            <td style={{ padding: '6px', textAlign: 'right', fontSize: '12px', color: '#555' }}>₹ {cgst.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan="3"></td>
                            <td style={{ padding: '6px', textAlign: 'right', fontSize: '12px', color: '#555' }}>STATE GST (9%):</td>
                            <td style={{ padding: '6px', textAlign: 'right', fontSize: '12px', color: '#555' }}>₹ {sgst.toFixed(2)}</td>
                        </tr>
                        <tr style={{ borderTop: '2px double #000', borderBottom: '2px solid #000' }}>
                            <td colSpan="3" style={{ padding: '10px', fontSize: '11px', italic: 'true' }}>Amounts represented in regional currency units. E.&O.E.</td>
                            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', fontSize: '15px' }}>GRAND TOTAL:</td>
                            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', fontSize: '15px', color: '#b58900' }}>₹ {grossInvoiceTotal.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Professional Sign-off Bottom Stamp Block */}
                <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: '12px', border: '1px dashed #aaa', padding: '10px', width: '45%' }}>
                        <strong>Terms & Declarations:</strong><br />
                        Certified that the particulars given above are accurate and true. Goods once processed cannot be returned.
                    </div>
                    <div style={{ textAlign: 'right', width: '45%' }}>
                        <p style={{ margin: '0 0 40px 0', fontSize: '13px' }}>For <strong>{activeCompany.name.toUpperCase()}</strong></p>
                        <p style={{ margin: '0', borderTop: '1px solid #000', display: 'inline-block', width: '180px', paddingTop: '5px', fontSize: '12px' }}>Authorized Signatory Signature</p>
                    </div>
                </div>
            </div>
        </div>
    );
}