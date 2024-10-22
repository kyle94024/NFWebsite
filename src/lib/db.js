// lib/db.js
const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: parseInt(process.env.PGPORT || "5432"),
    ssl: {
        rejectUnauthorized: false,
        require: true,
    },
});

// Helper to execute SQL queries
async function query(text, params) {
    try {
        const start = Date.now();
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log("Executed query", { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error("Error executing query", error);
        throw error;
    }
}

module.exports = {
    query,
    pool,
};
