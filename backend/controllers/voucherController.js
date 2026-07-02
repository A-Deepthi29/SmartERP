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

module.exports = router;