const { Pool } = require("pg");
require("dotenv").config(); // Forces variables to load instantly

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER || "postgres",
  // This fallback ensures the password is never undefined, resolving the string error:
  password: String(process.env.DB_PASSWORD || "postgres"), 
  database: process.env.DB_NAME || "smarterp",
});

// Test connection logs inside terminal
pool.connect((err, client, release) => {
  if (err) {
    return console.error("❌ Database Connection Error:", err.stack);
  }
  console.log("✅ PostgreSQL Connected successfully via Pool Mapping.");
  release();
});

module.exports = pool;