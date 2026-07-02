const pool = require('./config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedAdminUser() {
    try {
        console.log("Connecting to database to register user...");
        
        // Salt and hash 'admin123' just to be absolutely sure it handles perfectly
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('admin123', salt);

        const queryText = `
            INSERT INTO users (username, email, password_hash) 
            VALUES ($1, $2, $3)
            ON CONFLICT (username) DO NOTHING
            RETURNING id, username;
        `;

        const res = await pool.query(queryText, ['admin', 'admin@smarterp.com', passwordHash]);
        
        if (res.rowCount > 0) {
            console.log(`✅ Success! User created: ${res.rows[0].username} (ID: ${res.rows[0].id})`);
        } else {
            console.log("ℹ️ User 'admin' already exists in the database.");
        }
    } catch (err) {
        console.error("❌ Database insertion error:", err.message);
    } finally {
        await pool.end();
        process.exit();
    }
}

seedAdminUser();