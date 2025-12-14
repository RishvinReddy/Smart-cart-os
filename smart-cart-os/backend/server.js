const express = require('express');
const cors = require('cors');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Helper for Async Errors
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// --- Products API ---

app.get('/api/products', asyncHandler(async (req, res) => {
    // Note: Quoting "inStock" because postgres case sensitivity if created with quotes
    // But our adapter returns lowercase keys usually. 
    // Let's just select * and handle mappings.
    const result = await db.query("SELECT * FROM products");
    const products = result.rows.map(p => ({
        ...p,
        // Postgres returns boolean properly, SQLite returns 0/1.
        // We cast to boolean just in case.
        inStock: !!p.inStock
    }));
    res.json({ message: "success", data: products });
}));

app.get('/api/products/:id', asyncHandler(async (req, res) => {
    const result = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
    const row = result.rows[0];
    res.json({ message: "success", data: { ...row, inStock: !!row.inStock } });
}));

app.post('/api/products', asyncHandler(async (req, res) => {
    const { name, price, category, image, rfid_uid, weight_g, inStock } = req.body;
    const id = generateId();
    // Quote "inStock" for safety across DBs if mixed case
    const sql = `INSERT INTO products (id, name, price, category, image, rfid_uid, weight_g, "inStock") 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    // Pass boolean inStock, adapter handles SQLite conversion if needed (or we check adapter type)
    // Actually, our adapter logic for seeding handled it, but here we invoke query directly.
    // Let's rely on the DB adapter being smart or just pass 0/1 if sqlite.
    // Simpler: Just pass boolean, Postgres likes it. SQLite is chill with 'true'/'false' strings or 0/1?
    // SQLite stores booleans as NUMERIC usually 0/1. 
    // Let's manually convert to 0/1 if we want to be safe for SQLite without adapter overhead checking.
    // BUT Postgres MUST have true/false.
    // Best: Check db.type via hack or just try standard bool.
    // SQLite driver often maps bool to 1/0 automatically? No.
    // Let's stick to: if(db.type === 'sqlite') convert.

    let stockVal = inStock;
    if (db.type === 'sqlite') stockVal = inStock ? 1 : 0;

    await db.query(sql, [id, name, price, category, image, rfid_uid, weight_g, stockVal]);

    addLog('ADMIN', 'Product Added', `Added ${name}`, 'success');
    res.json({ message: "created", id, data: req.body });
}));

app.put('/api/products/:id', asyncHandler(async (req, res) => {
    const { name, price, category, image, rfid_uid, weight_g, inStock } = req.body;
    const sql = `UPDATE products SET name = ?, price = ?, category = ?, image = ?, rfid_uid = ?, weight_g = ?, "inStock" = ? 
                 WHERE id = ?`;

    let stockVal = inStock;
    if (db.type === 'sqlite') stockVal = inStock ? 1 : 0;

    const result = await db.query(sql, [name, price, category, image, rfid_uid, weight_g, stockVal, req.params.id]);

    if (result.rowCount === 0) return res.status(404).json({ error: "Product not found" });

    addLog('ADMIN', 'Product Updated', `Updated ${name}`, 'info');
    res.json({ message: "updated", changes: result.rowCount });
}));

app.delete('/api/products/:id', asyncHandler(async (req, res) => {
    const result = await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Product not found" });
    addLog('ADMIN', 'Product Deleted', `Deleted product ${req.params.id}`, 'warning');
    res.json({ message: "deleted", changes: result.rowCount });
}));

// --- Cart API ---

app.get('/api/cart', asyncHandler(async (req, res) => {
    // Join with products
    const sql = `
        SELECT c.id as cart_item_id, c.quantity, c.added_at, p.* 
        FROM cart_items c 
        JOIN products p ON c.product_id = p.id
    `;
    const result = await db.query(sql);
    const cart = result.rows.map(r => ({
        ...r,
        id: r.id,
        quantity: r.quantity,
        addedAt: r.added_at || parseInt(r.added_at), // BigInt handling
        inStock: !!r.inStock
    }));
    res.json({ message: "success", data: cart });
}));

app.post('/api/cart/add', asyncHandler(async (req, res) => {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: "productId is required" });

    const existing = await db.query("SELECT * FROM cart_items WHERE product_id = ?", [productId]);

    if (existing.rows.length > 0) {
        const newQty = existing.rows[0].quantity + 1;
        await db.query("UPDATE cart_items SET quantity = ? WHERE product_id = ?", [newQty, productId]);
        addLog('APP', 'Update Cart Quantity', `Item ${productId} qty: ${newQty}`, 'info');
        res.json({ message: "updated", productId, quantity: newQty });
    } else {
        const id = generateId();
        const addedAt = Date.now();
        await db.query("INSERT INTO cart_items (id, product_id, quantity, added_at) VALUES (?, ?, ?, ?)", [id, productId, 1, addedAt]);
        addLog('APP', 'New Item Added', `Product ${productId}`, 'success');
        res.json({ message: "added", productId, quantity: 1 });
    }
}));

app.post('/api/cart/update', asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    if (quantity <= 0) {
        await db.query("DELETE FROM cart_items WHERE product_id = ?", [productId]);
        addLog('APP', 'Remove Item', `Removed product ${productId}`, 'warning');
        res.json({ message: "removed", productId });
    } else {
        await db.query("UPDATE cart_items SET quantity = ? WHERE product_id = ?", [quantity, productId]);
        addLog('APP', 'Modify Quantity', `Product ${productId} -> ${quantity}`, 'info');
        res.json({ message: "updated", productId, quantity });
    }
}));

app.post('/api/cart/clear', asyncHandler(async (req, res) => {
    await db.query("DELETE FROM cart_items");
    addLog('APP', 'Clear Cart', 'User cleared all items', 'warning');
    res.json({ message: "cleared" });
}));

// --- Logs API ---

app.get('/api/logs', asyncHandler(async (req, res) => {
    const result = await db.query("SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT 50");
    res.json({ message: "success", data: result.rows });
}));

app.post('/api/logs', asyncHandler(async (req, res) => {
    const { source, event, details, type } = req.body;
    await addLog(source, event, details, type);
    res.json({ message: "logged" });
}));

async function addLog(source, event, details = '', type = 'info') {
    const id = generateId();
    const timestamp = new Date().toISOString();
    try {
        await db.query("INSERT INTO system_logs (id, timestamp, source, event, details, type) VALUES (?, ?, ?, ?, ?, ?)",
            [id, timestamp, source, event, details, type]);
    } catch (e) {
        console.error("Log error:", e);
    }
}

// --- IoT Simulation Endpoints ---

app.post('/api/scan', asyncHandler(async (req, res) => {
    const { rfid_uid, barcode } = req.body;
    let sql = "SELECT * FROM products WHERE rfid_uid = ?";
    let params = [rfid_uid];

    if (barcode) {
        sql = "SELECT * FROM products WHERE id = ?";
        params = [barcode];
    }

    const result = await db.query(sql, params);
    const row = result.rows[0];

    // Log the scan
    await addLog('ESP32', 'RFID/Barcode Scan', `Read: ${rfid_uid || barcode}`, 'info');

    if (row) {
        await addLog('CLOUD', 'Product Lookup Success', `Matched: ${row.name}`, 'success');

        const cartRes = await db.query("SELECT * FROM cart_items WHERE product_id = ?", [row.id]);
        if (cartRes.rows.length > 0) {
            const newQty = cartRes.rows[0].quantity + 1;
            await db.query("UPDATE cart_items SET quantity = ? WHERE product_id = ?", [newQty, row.id]);
        } else {
            const id = generateId();
            await db.query("INSERT INTO cart_items (id, product_id, quantity, added_at) VALUES (?, ?, ?, ?)", [id, row.id, 1, Date.now()]);
        }
        res.json({ message: "scanned", product: row });
    } else {
        await addLog('CLOUD', 'Product Lookup Failed', `Unknown UID: ${rfid_uid || barcode}`, 'error');
        res.status(404).json({ error: "Product not found" });
    }
}));

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
