const http = require('http');

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

const run = async () => {
    try {
        console.log("1. Fetching products...");
        const prods = await request('GET', '/products');
        if (prods.status !== 200 || !prods.body.data || prods.body.data.length === 0) {
            throw new Error("Failed to fetch products or empty");
        }
        const productId = prods.body.data[0].id;
        console.log(`   Found ${prods.body.data.length} products. Picking ${productId}`);

        console.log("2. Adding to cart...");
        const addRes = await request('POST', '/cart/add', { productId });
        if (addRes.status !== 200) throw new Error("Failed to add to cart");
        console.log("   Added.");

        console.log("3. Verifying cart...");
        const cartRes = await request('GET', '/cart');
        const cartItem = cartRes.body.data.find(i => i.product_id === productId);
        if (!cartItem) throw new Error("Item not in cart");
        console.log(`   Cart has ${cartRes.body.data.length} items.`);

        console.log("4. Checking out...");
        const checkoutRes = await request('POST', '/checkout');
        if (checkoutRes.status !== 200) throw new Error("Checkout failed: " + JSON.stringify(checkoutRes.body));
        console.log("   Checkout successful.");

        console.log("5. Verifying cart empty...");
        const emptyCart = await request('GET', '/cart');
        if (emptyCart.body.data.length !== 0) throw new Error("Cart not empty after checkout");
        console.log("   Cart is empty.");

        console.log("6. Verifying analytics...");
        const analytics = await request('GET', '/analytics');
        console.log("   Analytics:", analytics.body.data);
        if (analytics.body.data.totalOrders === 0) throw new Error("Analytics totalOrders is 0");
        if (analytics.body.data.recentOrders.length === 0) throw new Error("Analytics recentOrders is empty");

        console.log("VERIFICATION PASSED!");
    } catch (e) {
        console.error("VERIFICATION FAILED:", e.message);
        process.exit(1);
    }
};

run();
