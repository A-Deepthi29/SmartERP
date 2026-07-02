const express = require('express');
const router = express.Router();
const path = require('path');

// Absolute resolution mapping to database config pool 
const dbPath = path.join(__dirname, '..', 'config', 'db.js');
const pool = require(dbPath);

// 📂 ROUTE 1: FETCH ALL PREDEFINED GROUPS (GET /api/masters/groups)
router.get('/groups', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ledger_groups ORDER BY name ASC');
        res.status(200).json({
            success: true,
            groups: result.rows || []
        });
    } catch (error) {
        console.error('❌ Error fetching ledger groups:', error.message);
        res.status(500).json({ success: false, message: 'Failed to extract account groups.' });
    }
});

// ➕ ROUTE 2: CREATE A NEW LEDGER ACCOUNT (POST /api/masters/ledgers)
router.post('/ledgers', async (req, res) => {
    try {
        const { name, group_id, opening_balance, company_id } = req.body;

        if (!name || !group_id || !company_id) {
            return res.status(400).json({ success: false, message: 'Missing required parameters.' });
        }

        const result = await pool.query(
            'INSERT INTO ledgers (name, group_id, opening_balance, company_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, group_id, opening_balance || 0.00, company_id]
        );

        res.status(201).json({
            success: true,
            message: 'Ledger account synchronized successfully!',
            ledger: result.rows[0]
        });
    } catch (error) {
        console.error('❌ Error creating ledger account:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;