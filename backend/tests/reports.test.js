const request = require('supertest');
const express = require('express');
const reportRouter = require('../controllers/reportController');

// Mock a lightweight application instance for clean route isolation testing
const app = express();
app.use(express.json());
app.use('/api/reports', reportRouter);

// Mock our database configuration pool connection safely
jest.mock('../config/db.js', () => ({
    query: jest.fn((queryText, params) => {
        // Return dummy database rows when scanning company ledger entries
        if (queryText.includes('LIKE \'%Sales Inv #%\'')) {
            return Promise.resolve({ rows: [{ total_qty: '20' }], rowCount: 1 });
        }
        return Promise.resolve({ rows: [], rowCount: 0 });
    })
}));

describe('📊 DAY 14: Financial Report Endpoints Structural Sanity Suite', () => {
    
    it('FAIL-SAFE: Reject metrics access requests when company context is omitted', async () => {
        const res = await request(app).get('/api/reports/profitability');
        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
    });

    it('SUCCESS-PATH: Securely calculate COGS & revenue vectors against mock company ID contexts', async () => {
        const res = await request(app)
            .get('/api/reports/profitability')
            .query({ company_id: '1' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.metrics.units_sold).toEqual(20);
        expect(res.body.metrics.gross_revenue).toEqual(15000); // 20 units * ₹750
        expect(res.body.metrics.cost_of_goods_sold).toEqual(10000); // 20 units * ₹500
        expect(res.body.metrics.gross_profit).toEqual(5000);
        expect(res.body.metrics.net_margin_percentage).toEqual(33.3);
    });
});