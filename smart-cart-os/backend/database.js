const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// Environment check
const isProduction = !!process.env.DATABASE_URL;

class DatabaseAdapter {
    constructor() {
        this.type = isProduction ? 'postgres' : 'sqlite';
        console.log(`Initializing Database Adapter for: ${this.type.toUpperCase()}`);

        if (this.type === 'sqlite') {
            const dbPath = path.resolve(__dirname, 'smartcart.sqlite');
            this.db = new sqlite3.Database(dbPath, (err) => {
                if (err) console.error('SQLite connection error:', err.message);
                else console.log('Connected to SQLite.');
            });
        } else {
            this.pool = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: { rejectUnauthorized: false } // Required for Render/Heroku
            });
        }
    }

    // Unified query method
    // Replaces ? with $1, $2, etc. for Postgres
    async query(sql, params = []) {
        if (this.type === 'sqlite') {
            return new Promise((resolve, reject) => {
                // Determine if it's a SELECT (all/get) or modification (run)
                const isSelect = sql.trim().toUpperCase().startsWith('SELECT');

                if (isSelect) {
                    this.db.all(sql, params, (err, rows) => {
                        if (err) reject(err);
                        else resolve({ rows, rowCount: rows.length });
                    });
                } else {
                    this.db.run(sql, params, function (err) {
                        if (err) reject(err);
                        else resolve({ rows: [], rowCount: this.changes, lastID: this.lastID });
                    });
                }
            });
        } else {
            // Postgres
            // Convert ? to $1, $2...
            let paramCount = 1;
            const pgSql = sql.replace(/\?/g, () => `$${paramCount++}`);

            try {
                const res = await this.pool.query(pgSql, params);
                return res; // returns { rows: [...], rowCount: n }
            } catch (err) {
                throw err;
            }
        }
    }

    // Initialize Schema
    async init() {
        // Schema definition compatible with both (mostly)
        // Note: SQLite uses INTEGER PRIMARY KEY for auto-increment usually, but here we use TEXT IDs generated in app.
        // Postgres needs specific types.

        const schema = [
            `CREATE TABLE IF NOT EXISTS products (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(255),
                price DECIMAL(10,2),
                category VARCHAR(100),
                image TEXT,
                rfid_uid VARCHAR(50) UNIQUE,
                weight_g INTEGER,
                "inStock" BOOLEAN
            );`,
            `CREATE TABLE IF NOT EXISTS cart_items (
                id VARCHAR(50) PRIMARY KEY,
                product_id VARCHAR(50) REFERENCES products(id),
                quantity INTEGER,
                added_at BIGINT
            );`,
            `CREATE TABLE IF NOT EXISTS system_logs (
                id VARCHAR(50) PRIMARY KEY,
                timestamp VARCHAR(100),
                source VARCHAR(50),
                event VARCHAR(100),
                details TEXT,
                type VARCHAR(20)
            );`
        ];

        // SQLite 'inStock' was INTEGER (0/1), Postgres is BOOLEAN. 
        // We handle this difference in the seeding.

        console.log("Initializing schema...");
        for (const query of schema) {
            // Slight adjustments for SQLite if needed (e.g. valid types)
            // SQLite is flexible with types, so VARCHAR/DECIMAL works fine (affinity).
            await this.query(query);
        }

        await this.seed();
    }

    async seed() {
        console.log("Seeding data...");
        const MOCK_PRODUCTS = require('./initial_data.json');

        // Upsert logic
        // SQLite: INSERT OR REPLACE
        // Postgres: INSERT ... ON CONFLICT

        for (const p of MOCK_PRODUCTS) {
            let sql;
            const params = [p.id, p.name, p.price, p.category, p.image, p.rfid_uid, p.weight_g, p.inStock];

            if (this.type === 'sqlite') {
                // SQLite uses 0/1 for boolean usually, but let's try to align.
                // Actually in previous code we sent p.inStock ? 1 : 0.
                // Our generic wrapper doesn't auto-convert.
                params[7] = p.inStock ? 1 : 0;
                sql = `INSERT OR REPLACE INTO products (id, name, price, category, image, rfid_uid, weight_g, "inStock") 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            } else {
                sql = `INSERT INTO products (id, name, price, category, image, rfid_uid, weight_g, "inStock") 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                       ON CONFLICT(id) DO UPDATE SET 
                       name=EXCLUDED.name, price=EXCLUDED.price, category=EXCLUDED.category, 
                       image=EXCLUDED.image, rfid_uid=EXCLUDED.rfid_uid, weight_g=EXCLUDED.weight_g, "inStock"=EXCLUDED."inStock"`;
            }

            await this.query(sql, params);
        }
        console.log("Seeding complete.");
    }
}

const dbAdapter = new DatabaseAdapter();
dbAdapter.init(); // Fire and forget init on require

module.exports = dbAdapter;
