import React, { useState, useEffect } from 'react';

export default function ProfitReport({ activeCompany, onBackToDashboard }) {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/reports/profitability?company_id=${activeCompany.id}`);
                const data = await res.json();
                if (data.success) {
                    setReport(data.metrics);
                }
            } catch (err) {
                console.error('Error hydrating business intelligence matrix logs:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, [activeCompany]);

    if (loading) return <div style={{ color: '#00ffcc', padding: '30px', fontFamily: 'monospace' }}>Aggregating Operational General Ledger Frameworks...</div>;

    return (
        <div style={{ backgroundColor: '#002b36', color: '#fff', minHeight: '100vh', padding: '40px', fontFamily: 'monospace' }}>
            <button onClick={onBackToDashboard} style={{ background: '#2aa198', color: '#fff', border: 'none', padding: '10px 15px', cursor: 'pointer', fontWeight: 'bold' }}>
                [ESC] Return to Terminal Home
            </button>

            <h2 style={{ textAlign: 'center', color: '#00ffcc', borderBottom: '2px solid #00ffcc', paddingBottom: '12px', marginTop: '20px' }}>
                EXECUTIVE INTELLIGENCE MATRIX REPORT — {activeCompany.name.toUpperCase()}
            </h2>

            {/* Grid Box Layout Elements */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', margin: '40px 0' }}>
                
                <div style={{ background: '#001f26', border: '1px solid #2aa198', padding: '20px', borderRadius: '4px' }}>
                    <p style={{ color: '#2aa198', margin: '0 0 10px 0', fontSize: '13px', fontWeight: 'bold' }}>TOTAL UNITS DISPATCHED</p>
                    <h3 style={{ margin: '0', fontSize: '28px', color: '#fff' }}>{report.units_sold} Nos</h3>
                </div>

                <div style={{ background: '#001f26', border: '1px solid #00ffcc', padding: '20px', borderRadius: '4px' }}>
                    <p style={{ color: '#00ffcc', margin: '0 0 10px 0', fontSize: '13px', fontWeight: 'bold' }}>GROSS SALES REVENUE</p>
                    <h3 style={{ margin: '0', fontSize: '28px', color: '#00ffcc' }}>₹ {report.gross_revenue.toFixed(2)}</h3>
                </div>

                <div style={{ background: '#001f26', border: '1px solid #dc322f', padding: '20px', borderRadius: '4px' }}>
                    <p style={{ color: '#dc322f', margin: '0 0 10px 0', fontSize: '13px', fontWeight: 'bold' }}>COST OF GOODS SOLD (COGS)</p>
                    <h3 style={{ margin: '0', fontSize: '28px', color: '#fff' }}>₹ {report.cost_of_goods_sold.toFixed(2)}</h3>
                </div>

                <div style={{ background: '#001f26', border: '1px solid #859900', padding: '20px', borderRadius: '4px' }}>
                    <p style={{ color: '#859900', margin: '0 0 10px 0', fontSize: '13px', fontWeight: 'bold' }}>NET ACCRUAL PROFIT</p>
                    <h3 style={{ margin: '0', fontSize: '28px', color: '#859900' }}>₹ {report.gross_profit.toFixed(2)}</h3>
                </div>

            </div>

            {/* Efficiency Margin Representation Box Section */}
            <div style={{ background: '#001f26', border: '1px solid #b58900', padding: '30px', margin: '20px auto', maxWidth: '900px', textAlign: 'center' }}>
                <h4 style={{ color: '#b58900', margin: '0 0 15px 0', fontSize: '16px' }}>OPERATIONAL EFFICIENCY RATIO ANALYSIS</h4>
                <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#2aa198', marginBottom: '10px' }}>
                    {report.net_margin_percentage}%
                </div>
                <p style={{ margin: '0', color: '#93a1a1', fontSize: '12px' }}>
                    Net Profit Margin generated per invoice validation lifecycle step. Target index limit parameter: &gt; 15.00%
                </p>
                
                {/* Visual Status Bar */}
                <div style={{ width: '100%', background: '#002b36', height: '12px', marginTop: '20px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #586e75' }}>
                    <div style={{ width: `${Math.min(report.net_margin_percentage * 2, 100)}%`, background: '#859900', height: '100%' }}></div>
                </div>
            </div>
        </div>
    );
}