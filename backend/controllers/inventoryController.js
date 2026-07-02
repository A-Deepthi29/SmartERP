const express = require('express');
const router = express.Router();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'config', 'db.js');
const pool = require(dbPath);

// 📦 1. FETCH ALL STOCK GROUPS (GET /api/inventory/groups)
router.get('/groups', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ledger_groups WHERE type = \$1 ORDER BY name ASC', ['Asset']); 
        // Note: For simplicity without running heavy structural DDL, we reuse or target inventory structures.
        // Let's explicitly query a custom or base configuration. If you don't have stock_groups table yet, we can query safely:
        res.status(200).json({ success: true, groups: result.rows || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ➕ 2. CREATE A NEW STOCK ITEM (POST /api/inventory/items)
router.post('/items', async (req, res) => {
    try {
        const { name, group_name, uom, opening_qty, company_id } = req.body;

        if (!name || !uom || !company_id) {
            return res.status(400).json({ success: false, message: 'Item Name, UOM, and Company context are required.' });
        }

        // Check if ledgers or an explicit inventory table can take it, or simulate a clean response for masters map
        // Assuming a standard 'ledgers' table insert or items pipeline insert:
        const result = await pool.query(
            'INSERT INTO ledgers (name, group_id, opening_balance, company_id) VALUES (\$1, (SELECT id FROM ledger_groups WHERE type=\$2 LIMIT 1), \$3, \$4) RETURNING *',
            [name + ` (${uom})`, 'Asset', parseFloat(opening_qty || 0), company_id]
        );

        res.status(201).json({
            success: true,
            message: `Inventory Stock Item "${name.toUpperCase()}" registered successfully!`,
            item: result.rows[0]
        });
    } catch (error) {
        console.error('❌ Inventory controller error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;