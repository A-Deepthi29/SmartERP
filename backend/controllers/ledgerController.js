const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Middleware to catch context headers (simulating a Tally active workspace session)
const getActiveCompanyContext = (req, res, next) => {
    const companyId = req.headers['x-company-id'];
    if (!companyId) {
        return res.status(400).json({ success: false, error: "No active company context specified in request headers." });
    }
    req.active_company_id = companyId;
    next();
};

/**
 * @route   POST /api/masters/ledger
 * @desc    Create an isolated Supplier or Customer Ledger record
 */
router.post('/ledger', getActiveCompanyContext, async (req, res) => {
    const { name, ledger_type, phone, email, gstin, opening_balance } = req.body;

    if (!name || !ledger_type) {
        return res.status(400).json({ success: false, error: "Ledger name and type are strictly required." });
    }

    try {
        const result = await pool.query(
            `INSERT INTO ledgers (company_id, name, ledger_type, phone, email, gstin, opening_balance)
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING id, name, ledger_type, gstin, opening_balance`,
            [req.active_company_id, name, ledger_type.toUpperCase(), phone, email, gstin, opening_balance || 0.00]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') { // Database Unique constraint error code
            return res.status(400).json({ success: false, error: "A ledger with this exact name already exists in this company context." });
        }
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @route   GET /api/masters/ledgers
 * @desc    Fetch ledgers filtered by type (SUPPLIER/CUSTOMER) for keyboard auto-completes
 */
router.get('/ledgers', getActiveCompanyContext, async (req, res) => {
    const { type } = req.query;
    try {
        let queryStr = 'SELECT * FROM ledgers WHERE company_id = $1';
        const params = [req.active_company_id];

        if (type) {
            queryStr += ' AND ledger_type = $2';
            params.push(type.toUpperCase());
        }
        queryStr += ' ORDER BY name ASC';

        const result = await pool.query(queryStr, params);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @route   POST /api/masters/stock
 * @desc    Create a new isolated physical Inventory Item
 */
router.post('/stock', getActiveCompanyContext, async (req, res) => {
    const { name, sku, unit, purchase_rate, sales_rate, opening_qty } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, error: "Stock item name specification is mandatory." });
    }

    try {
        const result = await pool.query(
            `INSERT INTO stock_items (company_id, name, sku, unit, purchase_rate, sales_rate, opening_qty)
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING id, name, unit, purchase_rate, sales_rate, opening_qty`,
            [req.active_company_id, name, sku, unit || 'PCS', purchase_rate || 0.00, sales_rate || 0.00, opening_qty || 0]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ success: false, error: "An item matching this designation already exists inside this inventory group." });
        }
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @route   GET /api/masters/stock
 * @desc    Retrieve all active items in inventory for the active company
 */
router.get('/stock', getActiveCompanyContext, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM stock_items WHERE company_id = $1 ORDER BY name ASC',
            [req.active_company_id]
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;