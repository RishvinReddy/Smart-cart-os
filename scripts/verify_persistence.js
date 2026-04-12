const http = require('http');
const fs = require('fs');
const path = require('path');

// Helper wrapper for http request
const request = (method, path, body = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: '/api' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(data) });
                } catch (e) {
                    console.log("Error parsing JSON:", data);
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
};

const STATE_FILE = path.join(__dirname, 'persistence_state.json');

const run = async () => {
    const mode = process.argv[2];

    try {
        if (mode === 'setup') {
            console.log("--- SETUP PHASE ---");

            // 1. Clear Cart
            console.log("1. Clearing cart...");
            await request('POST', '/cart/clear');

            // 2. Fetch Products to get a valid ID
            console.log("2. Fetching products...");
            const prods = await request('GET', '/products');
            if (!prods.body.data || prods.body.data.length === 0) throw new Error("No products found");

            const product = prods.body.data[0];
            console.log(`   Selected product: ${product.name} (${product.id})`);

            // 3. Add to Cart
            console.log("3. Adding to cart...");
            await request('POST', '/cart/add', { productId: product.id });

            // 4. Verify added
            const cartRes = await request('GET', '/cart');
            const item = cartRes.body.data.find(i => i.product_id === product.id);
            if (!item) throw new Error("Failed to add item to cart");
            console.log(`   Cart now has ${cartRes.body.data.length} items.`);

            // 5. Save state
            fs.writeFileSync(STATE_FILE, JSON.stringify({ productId: product.id, timestamp: Date.now() }));
            console.log("State saved. READY FOR SERVER RESTART.");
            console.log("Please restart the server content, then run: node scripts/verify_persistence.js verify");

        } else if (mode === 'verify') {
            console.log("--- VERIFY PHASE ---");

            if (!fs.existsSync(STATE_FILE)) {
                throw new Error("No state file found. Run setup first.");
            }
            const state = JSON.parse(fs.readFileSync(STATE_FILE));

            // 1. Fetch Cart
            console.log("1. Fetching cart...");
            const cartRes = await request('GET', '/cart');

            // 2. Verify Item Persisted
            const item = cartRes.body.data.find(i => i.product_id === state.productId);
            if (!item) {
                throw new Error(`PERSISTENCE FAILED: Item ${state.productId} not found in cart after restart.`);
            }
            console.log("   SUCCESS: Item found in cart.");

            // 3. Cleanup (Remove item)
            console.log("2. Cleaning up (Removing item)...");
            await request('POST', '/cart/update', { productId: state.productId, quantity: 0 });

            // 4. Verify Empty
            const finalCart = await request('GET', '/cart');
            if (finalCart.body.data.some(i => i.product_id === state.productId)) {
                throw new Error("Failed to remove item.");
            }
            console.log("   Item removed.");

            // Clean state file
            fs.unlinkSync(STATE_FILE);

            console.log("PERSISTENCE VERIFICATION PASSED!");

        } else {
            console.log("Usage: node verify_persistence.js [setup|verify]");
        }
    } catch (e) {
        console.error("ERROR:", e.message);
        process.exit(1);
    }
};

run();
