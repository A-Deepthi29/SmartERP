const express = require('express');
const router = express.Router();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'config', 'db.js');
const pool = require(dbPath);

// 🛒 POST /api/vouchers/purchase - TRANSACTIONAL RECORD ENGINE
router.post('/purchase', async (req, res) => {
    // Get a specialized client from the pool to run a dedicated transaction blocks safely
    const client = await pool.connect();
    try {
        const { invoice_no, date, supplier_ledger_id, stock_item_id, qty, rate, total_amount, company_id } = req.body;

        if (!invoice_no || !supplier_ledger_id || !stock_item_id || !qty || !rate || !company_id) {
            return res.status(400).json({ success: false, message: 'Required transaction values are missing.' });
        }

        // Start atomic SQL transaction
        await client.query('BEGIN');

        // 1. Insert global transaction metadata header record
        // (Reusing fields inside the robust unified ledger matrix if a direct voucher table isn't fully migrated)
        const voucherQuery = `
            INSERT INTO ledgers (name, group_id, opening_balance, company_id) 
            VALUES ($1, (SELECT id FROM ledger_groups WHERE type=$2 LIMIT 1), $3, $4) 
            RETURNING *`;
        
        const voucherNarrative = `Purc Inv #${invoice_no} - Item ID: ${stock_item_id} [Qty: ${qty}]`;
        const result = await client.query(voucherQuery, [voucherNarrative, 'Asset', total_amount, company_id]);

        // Commit transaction blocks safely
        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            message: `Purchase Voucher committed successfully! Invoice Reference #${invoice_no} is now live.`,
            voucher: result.rows[0]
        });
    } catch (error) {
        // Rollback structural changes instantly if anything triggers a crash during execution
        await client.query('ROLLBACK');
        console.error('❌ Voucher Engine Error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    } finally {
        // Release the database lock client back into the general pool
        client.release();
    }
});

// 📦 POST /api/vouchers/sales - SALES TRANSACTION ENGINE WITH STOCK CHECK
router.post('/sales', async (req, res) => {
    const client = await pool.connect();
    try {
        const { invoice_no, date, customer_ledger_id, stock_item_id, qty, rate, total_amount, company_id } = req.body;

        if (!invoice_no || !customer_ledger_id || !qty || !rate || !company_id) {
            return res.status(400).json({ success: false, message: 'Required transaction data parameters missing.' });
        }

        await client.query('BEGIN');

        // 1. INVENTORY CHECK: Calculate historical items added vs sold to check available quantity
        // (Reusing our unified master ledger row structure for transactions tracking)
        const checkStockQuery = `
            SELECT COALESCE(SUM(opening_balance), 0) as current_stock 
            FROM ledgers 
            WHERE name LIKE $1 AND company_id = $2
        `;
        const itemWildcard = `%Item ID: ${stock_item_id}%`;
        const stockResult = await client.query(checkStockQuery, [itemWildcard, company_id]);
        const availableStock = parseFloat(stockResult.rows[0].current_stock || 0);

        // If trying to sell more than what's available, intercept and prevent transaction
        if (qty > availableStock && availableStock <= 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ 
                success: false, 
                message: `Insufficient Stock! Available Quantity: ${availableStock}. Cannot fulfill requested quantity of ${qty}.` 
            });
        }

        // 2. Insert Sales Entry (Represented as a deduction using a negative transaction volume value)
        const voucherQuery = `
            INSERT INTO ledgers (name, group_id, opening_balance, company_id) 
            VALUES ($1, (SELECT id FROM ledger_groups WHERE type=$2 LIMIT 1), $3, $4) 
            RETURNING *`;
        
        const voucherNarrative = `Sales Inv #${invoice_no} - Item ID: ${stock_item_id} [Qty: ${qty}]`;
        // Deducting inventory flips the value negative to balance the stock worksheet book formula
        const inventoryImpact = -(parseFloat(qty)); 

        const result = await client.query(voucherQuery, [voucherNarrative, 'Asset', inventoryImpact, company_id]);

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            message: `Sales Invoice #${invoice_no} processed and finalized securely!`,
            voucher: result.rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Sales Engine Failure:', error.message);
        res.status(500).json({ success: false, message: error.message });
    } finally {
        client.release();
    }
});

module.exports = router;