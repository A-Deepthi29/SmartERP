const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Mock Auth Middleware
const authenticateUser = (req, res, next) => {
    req.user = { id: 1 }; // Fixed mock user context for development session
    next();
};

// 1. GET ALL COMPANIES
router.get('/', authenticateUser, async (req, res) => {
    try {
        const companies = await pool.query(
            'SELECT id, name, state, financial_year_start FROM companies WHERE user_id = $1 ORDER BY name ASC',
            [req.user.id]
        );
        res.json({ success: true, data: companies.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 2. CREATE COMPANY (Enforces explicit limit constraint of max 5 companies per user)
router.post('/create', authenticateUser, async (req, res) => {
    const { 
        name, mailing_name, address, country, state, pin_code, 
        phone, mobile, email, website, financial_year_start, books_beginning_from,
        base_currency, formal_name 
    } = req.body;

    try {
        // Enforce max 5 companies per user account rule directly from requirement metrics
        const countRes = await pool.query('SELECT COUNT(*) FROM companies WHERE user_id = $1', [req.user.id]);
        if (parseInt(countRes.rows[0].count) >= 5) {
            return res.status(400).json({ success: false, error: "Company limit reached. Max 5 companies allowed per user account." });
        }

        const newCompany = await pool.query(
            `INSERT INTO companies 
            (user_id, name, mailing_name, address, country, state, pin_code, phone, mobile, email, website, financial_year_start, books_beginning_from, base_currency, formal_name) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
            [req.user.id, name, mailing_name || name, address, country || 'INDIA', state, pin_code, phone, mobile, email, website, financial_year_start, books_beginning_from || financial_year_start, base_currency || 'INR', formal_name || 'INR']
        );

        res.status(201).json({ success: true, data: newCompany.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 3. ALTER COMPANY
router.put('/:id', authenticateUser, async (req, res) => {
    const { id } = req.params;
    const fields = req.body;
    
    if (Object.keys(fields).length === 0) return res.status(400).json({ success: false, error: "No fields provided" });

    const setClause = Object.keys(fields).map((key, index) => `"${key}" = $${index + 1}`).join(', ');
    const values = Object.values(fields);

    try {
        const result = await pool.query(
            `UPDATE companies SET ${setClause} WHERE id = $${values.length + 1} AND user_id = $${values.length + 2} RETURNING *`,
            [...values, id, req.user.id]
        );
        
        if (result.rowCount === 0) return res.status(404).json({ success: false, error: "Company not found or unauthorized" });
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 4. DELETE COMPANY (Alt + D Context Action)
router.delete('/:id', authenticateUser, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM companies WHERE id = $1 AND user_id = $2', [id, req.user.id]);
        if (result.rowCount === 0) return res.status(404).json({ success: false, error: "Company not found or unauthorized" });
        res.json({ success: true, message: "Company deleted successfully." });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;