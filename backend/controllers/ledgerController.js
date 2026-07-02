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

// ================================================================
// 📁 FIXED DAY 7 ROUTE: CREATE CUSTOM ACCOUNT GROUP WITH AUTO-TYPE
// ================================================================
router.post('/groups', async (req, res) => {
    try {
        const { name, parent_id, company_id } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Group designation name required.' });
        }

        let inheritedType = 'Asset'; // Fallback default

        // If a parent group is selected, look up its type to satisfy the NOT NULL constraint
        if (parent_id) {
            const parentResult = await pool.query('SELECT type FROM ledger_groups WHERE id = $1', [parent_id]);
            if (parentResult.rowCount > 0) {
                inheritedType = parentResult.rows[0].type;
            }
        }

        // Insert custom user group into ledger_groups matrix table with resolved type
        const result = await pool.query(
            'INSERT INTO ledger_groups (name, parent_id, company_id, type) VALUES ($1, $2, $3, $4) RETURNING *',
            [name.toLowerCase(), parent_id || null, company_id || null, inheritedType]
        );

        res.status(201).json({
            success: true,
            message: 'Accounting node synchronized successfully!',
            group: result.rows[0]
        });
    } catch (error) {
        console.error('❌ Error creating ledger group:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;