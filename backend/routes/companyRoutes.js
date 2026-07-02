const express = require('express');
const router = express.Router();
const path = require('path');

// Safe absolute resolution to reach your db configuration pool
const dbPath = path.join(__dirname, '..', 'config', 'db.js');
const pool = require(dbPath);

// 🏢 ROUTE 1: FETCH ALL SAVED COMPANIES (GET /api/companies)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM companies ORDER BY name ASC');
        res.status(200).json({
            success: true,
            count: result.rowCount,
            companies: result.rows || []
        });
    } catch (error) {
        console.error('❌ Error inside GET companyRoutes:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ➕ ROUTE 2: CREATE A NEW COMPANY PROFILE (POST /api/companies)
router.post('/', async (req, res) => {
    try {
        const { name, state, financial_year_start } = req.body;
        const result = await pool.query(
            'INSERT INTO companies (name, state, financial_year_start) VALUES ($1, $2, $3) RETURNING *',
            [name, state, financial_year_start]
        );
        res.status(201).json({
            success: true,
            message: 'Company profile created successfully!',
            company: result.rows[0]
        });
    } catch (error) {
        console.error('❌ Error inside POST companyRoutes:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;