const express = require('express');
const cors = require('cors');
const authRoutes = require('./controllers/authController'); // <-- [Import Auth Routing Middleware]
const companyRoutes = require('./controllers/companyController');
const ledgerRoutes = require('./controllers/ledgerController');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Layer Mount Configuration Assignments Map
app.use('/api/auth', authRoutes); // <-- [Mount Auth Paths]
app.use('/api/companies', companyRoutes);
app.use('/api/masters', ledgerRoutes);

// COMPANY MANAGEMENT ROUTE DISPATCHER
// SELF-CONTAINED COMPANY MANAGEMENT ROUTE
app.post('/api/companies', async (req, res) => {
    try {
        const { name, state, financial_year_start } = req.body;
        
        // Use path resolution to safely pull the database configuration pool
        const path = require('path');
        const dbPath = path.join(__dirname, 'config', 'db.js');
        const pool = require(dbPath); 

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
        console.error('❌ Detailed Company Error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Database execution error writing profile.' 
        });
    }
});
app.listen(PORT, () => {
    console.log(`SmartERP Gateway engine running natively on port ${PORT}`);
});
