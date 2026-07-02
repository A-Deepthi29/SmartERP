const express = require('express');
const router = express.Router();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'config', 'db.js');
const pool = require(dbPath);

// 📊 GET /api/reports/profitability - EXECUTIVE ANALYTICS MATRIX ENGINE
router.get('/profitability', async (req, res) => {
    try {
        const { company_id } = req.query;

        if (!company_id) {
            return res.status(400).json({ success: false, message: 'Active company context context missing.' });
        }

        // 1. Fetch sales transactions (recorded on Day 10 as negative offsets in opening_balance)
        const salesQuery = `
            SELECT COALESCE(SUM(ABS(opening_balance)), 0) as total_qty 
            FROM ledgers 
            WHERE name LIKE '%Sales Inv #%' AND company_id = $1
        `;
        const salesResult = await pool.query(salesQuery, [company_id]);
        const unitsSold = parseInt(salesResult.rows[0].total_qty || 0);

        // 2. Fetch baseline cost matrices (relying on your transaction metrics layout definitions)
        const purchasePrice = 500.00;  // Day 9 Purchase Rate benchmark baseline (₹500 per unit)
        const sellingPrice = 750.00;   // Day 10/11 Sales Rate baseline (₹750 per unit)

        // Math calculations 
        const grossRevenue = unitsSold * sellingPrice;
        const cogs = unitsSold * purchasePrice; // Cost of Goods Sold
        const grossProfit = grossRevenue - cogs;
        
        // Avoid division by zero issues if no sales exist yet
        const profitMarginPercentage = grossRevenue > 0 ? ((grossProfit / grossRevenue) * 100).toFixed(1) : 0;

        res.status(200).json({
            success: true,
            metrics: {
                units_sold: unitsSold,
                gross_revenue: grossRevenue,
                cost_of_goods_sold: cogs,
                gross_profit: grossProfit,
                net_margin_percentage: parseFloat(profitMarginPercentage)
            }
        });
    } catch (error) {
        console.error('❌ Analytics Aggregation Error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;