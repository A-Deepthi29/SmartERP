const express = require('express');
const cors = require('cors');
const companyRoutes = require('./controllers/companyController');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Workspace mounting path root
app.use('/api/companies', companyRoutes);

app.listen(PORT, () => {
    console.log(`SmartERP Gateway engine running natively on port ${PORT}`);
});