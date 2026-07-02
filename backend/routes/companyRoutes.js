// Example Express Backend Route structure
const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Your database pool configuration link

router.post('/companies', async (res, req) => {
    try {
        const { name, state, financial_year_start } = req.body;
        
        const newCompany = await pool.query(
            "INSERT INTO companies (name, state, financial_year_start) VALUES ($1, $2, $3) RETURNING *",
            [name, state, financial_year_start]
        );
        
        res.status(201).json({
            success: true,
            message: "Company created successfully!",
            company: newCompany.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error creating company table entry." });
    }
});

module.exports = router;