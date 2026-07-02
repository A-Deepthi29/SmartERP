const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const protectRoute = require('../middleware/authMiddleware'); // <-- [Import Security Guard]

// 1. GET ALL COMPANIES (Now safely protected and isolated)
router.get('/', protectRoute, async (req, res) => {
    try {
        const companies = await pool.query(
            'SELECT id, name, state, financial_year_start FROM companies WHERE user_id = $1 ORDER BY name ASC',
            [req.user.id] // req.user.id is parsed dynamically right from token signatures
        );
        res.json({ success: true, data: companies.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 2. CREATE COMPANY (Enforces explicit multi-company account limits based on actual user)
router.post('/create', protectRoute, async (req, res) => {
    const { name, state, financial_year_start, books_beginning_from } = req.body;

    try {
        // Enforce max 5 companies per user constraint rule verified programmatically
        const countRes = await pool.query('SELECT COUNT(*) FROM companies WHERE user_id = $1', [req.user.id]);
        if (parseInt(countRes.rows[0].count) >= 5) {
            return res.status(400).json({ success: false, error: "Company limit reached. Max 5 companies allowed per user account." });
        }

        const newCompany = await pool.query(
            `INSERT INTO companies (user_id, name, state, financial_year_start, books_beginning_from) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [req.user.id, name, state, financial_year_start, books_beginning_from]
        );
        res.status(201).json({ success: true, data: newCompany.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;