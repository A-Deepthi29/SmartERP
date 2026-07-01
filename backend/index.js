const express = require('express');
const cors = require('cors');
const companyRoutes = require('./controllers/companyController');
const ledgerRoutes = require('./controllers/ledgerController'); // <-- Import Day 2 Masters
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Endpoints Mounting Layout Map
app.use('/api/companies', companyRoutes);
app.use('/api/masters', ledgerRoutes); // <-- Register Masters Routes Middlewares

app.listen(PORT, () => {
    console.log(`SmartERP Gateway engine running natively on port ${PORT}`);
});