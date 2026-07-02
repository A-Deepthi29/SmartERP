const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 🏢 API LAYER ROUTE IMPORTS
const authRoutes = require('./controllers/authController');
const ledgerRoutes = require('./controllers/ledgerController');
// point company requests to your dedicated router module
const companyRoutes = require('./routes/companyRoutes'); 
// Near your other route imports
const inventoryRoutes = require('./controllers/inventoryController');

const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE PIPELINES
app.use(cors());
app.use(express.json());

// API LAYER MOUNT ROUTERS
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes); // Handled safely by routes/companyRoutes.js
app.use('/api/masters', ledgerRoutes);
// Near your other app.use router mounting lines
app.use('/api/inventory', inventoryRoutes);

// ENGINE LISTENER ENTRY POINT
app.listen(PORT, () => {
    console.log(`SmartERP Gateway engine running natively on port ${PORT}`);
});