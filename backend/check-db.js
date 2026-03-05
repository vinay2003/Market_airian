const { Client } = require('pg');
require('dotenv').config();

async function checkDb() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database.');
        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('Tables found:', res.rows.map(r => r.table_name));

        // Also check User table structure if it exists
        if (res.rows.some(r => r.table_name === 'users')) {
            const columns = await client.query(`
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = 'users'
            `);
            console.log('Users columns:', columns.rows);
        }
    } catch (err) {
        console.error('Database connection failed:', err);
    } finally {
        await client.end();
    }
}

checkDb();
