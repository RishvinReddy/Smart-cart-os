import React, { useState, useEffect } from 'react';
import MobileView from './components/MobileView';
import DashboardView from './components/DashboardView';
import LandingPage from './components/LandingPage';
import { CartItem, Product, SystemLog, DatabaseTable, WebsitePage } from './types';
import { MOCK_PRODUCTS } from './constants';
import { Smartphone, ShieldCheck, ShoppingCart, LogOut, Mail, Lock, User, ArrowRight, Loader2, ArrowLeft, Key, Store, LayoutDashboard, Menu, X } from 'lucide-react';

const App: React.FC = () => {
    // Website Navigation State
    const [currentPage, setCurrentPage] = useState<WebsitePage>('LANDING');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // App Logic State
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [logs, setLogs] = useState<SystemLog[]>([]);

    // Admin Auth State
    const [isLoading, setIsLoading] = useState(false);
    const [adminError, setAdminError] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPass, setAdminPass] = useState('');

    // Fetch Initial Data
    useEffect(() => {
        fetchData();
        // Poll for real-time updates (simulating websocket/mqtt)
        const interval = setInterval(fetchLogsAndCart, 2000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, cartRes, logsRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/cart'),
                fetch('/api/logs')
            ]);

            if (prodRes.ok) setProducts((await prodRes.json()).data);
            if (cartRes.ok) setCart((await cartRes.json()).data);
            if (logsRes.ok) setLogs((await logsRes.json()).data);
        } catch (e) {
            console.error("Failed to fetch data", e);
        }
    };

    const fetchLogsAndCart = async () => {
        try {
            const [cartRes, logsRes] = await Promise.all([
                fetch('/api/cart'),
                fetch('/api/logs')
            ]);
            if (cartRes.ok) setCart((await cartRes.json()).data);
            if (logsRes.ok) setLogs((await logsRes.json()).data);
        } catch (e) {
            console.error("Polling error", e);
        }
    };

    // Helper for optimistic log updates (optional, but good for UI responsiveness)
    // Real logs come from backend polling
    const addLog = async (source: SystemLog['source'], event: string, details: string = '', type: SystemLog['type'] = 'info') => {
        await fetch('/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source, event, details, type })
        });
        fetchLogsAndCart(); // Refresh immediately
    };

    const simulateScan = async () => {
        // In a real device, this would be an RFID read.
        // We simulate by picking a random product ID from the DB (known products)
        if (products.length === 0) return;

        const randomProduct = products[Math.floor(Math.random() * products.length)];

        try {
            const res = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rfid_uid: randomProduct.rfid_uid })
            });

            if (res.ok) {
                const data = await res.json();
                // UI feedback
                fetchLogsAndCart();
            }
        } catch (e) {
            console.error("Scan failed", e);
        }
    };

    const handleManualAdd = async (product: Product) => {
        try {
            await fetch('/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product.id })
            });
            fetchLogsAndCart();
        } catch (e) {
            console.error("Add failed", e);
        }
    };

    const updateQuantity = async (id: string, delta: number) => {
        const item = cart.find(c => c.id === id);
        if (!item) return;

        const newQty = item.quantity + delta;

        try {
            await fetch('/api/cart/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: id, quantity: newQty })
            });
            fetchLogsAndCart();
        } catch (e) {
            console.error("Update failed", e);
        }
    };

    const removeItem = async (id: string) => {
        try {
            await fetch('/api/cart/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: id, quantity: 0 })
            });
            fetchLogsAndCart();
        } catch (e) {
            console.error("Remove failed", e);
        }
    };

    const clearCart = async () => {
        try {
            await fetch('/api/cart/clear', { method: 'POST' });
            fetchLogsAndCart();
        } catch (e) {
            console.error("Clear failed", e);
        }
    };

    // Derived State: DB Tables (Adapted for Dashboard)
    const dbTables: DatabaseTable[] = [
        {
            name: 'products',
            columns: ['id', 'name', 'price', 'rfid_uid'],
            data: products.map(p => ({ id: p.id, name: p.name, price: p.price, rfid_uid: p.rfid_uid }))
        },
        {
            name: 'active_carts',
            columns: ['cart_id', 'status', 'items_count', 'total'],
            data: [{ cart_id: 'cart-04A2', status: 'active', items_count: cart.length, total: cart.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2) }]
        },
        {
            name: 'logs_stream',
            columns: ['timestamp', 'source', 'event'],
            data: logs.slice(0, 5).map(l => ({
                timestamp: l.timestamp ? l.timestamp.split('T')[1].split('.')[0] : '',
                source: l.source,
                event: l.event
            }))
        }
    ];

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setAdminError('');
        // Demo validation
        setTimeout(() => {
            if (adminEmail && adminPass) {
                setCurrentPage('ADMIN_DASHBOARD');
            } else {
                setAdminError('Invalid credentials');
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-slate-50 font-sans">

            {/* Global Navbar */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('LANDING')}>
                            <div className="bg-indigo-600 p-2 rounded-lg mr-2">
                                <ShoppingCart className="text-white" size={20} />
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">Smart Cart OS</span>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-8">
                            <button
                                onClick={() => setCurrentPage('LANDING')}
                                className={`text-sm font-medium transition-colors ${currentPage === 'LANDING' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Home
                            </button>
                            <button
                                onClick={() => setCurrentPage('SHOP')}
                                className={`text-sm font-medium transition-colors ${currentPage === 'SHOP' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Web Store
                            </button>
                            <button
                                onClick={() => setCurrentPage('ADMIN_LOGIN')}
                                className={`text-sm font-medium transition-colors ${currentPage.includes('ADMIN') ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Admin
                            </button>
                            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                                Get Started
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center md:hidden">
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-500">
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Nav Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <button onClick={() => { setCurrentPage('LANDING'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50">Home</button>
                            <button onClick={() => { setCurrentPage('SHOP'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50">Web Store</button>
                            <button onClick={() => { setCurrentPage('ADMIN_LOGIN'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50">Admin</button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 relative">

                {currentPage === 'LANDING' && (
                    <LandingPage onNavigate={(page) => setCurrentPage(page)} />
                )}

                {currentPage === 'SHOP' && (
                    <div className="h-[calc(100vh-64px)] w-full">
                        <MobileView
                            cart={cart}
                            onUpdateQuantity={updateQuantity}
                            onRemoveItem={removeItem}
                            onClearCart={clearCart}
                            onSimulateScan={simulateScan}
                            onAddProduct={handleManualAdd}
                            total={total}
                        />
                    </div>
                )}

                {currentPage === 'ADMIN_LOGIN' && (
                    <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-slate-100 p-4">
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheck size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">System Login</h2>
                                <p className="text-slate-500 text-sm mt-1">Restricted access for system administrators</p>
                            </div>

                            <form onSubmit={handleAdminLogin} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Admin ID</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-slate-50 text-sm"
                                        placeholder="admin@smartcart.os"
                                        value={adminEmail}
                                        onChange={e => setAdminEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">System Key</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-slate-50 text-sm"
                                        placeholder="••••••••"
                                        value={adminPass}
                                        onChange={e => setAdminPass(e.target.value)}
                                    />
                                </div>

                                {adminError && <p className="text-red-500 text-xs text-center">{adminError}</p>}

                                <button
                                    disabled={isLoading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Access Dashboard <ArrowRight size={18} /></>}
                                </button>
                            </form>
                            <div className="mt-6 text-center">
                                <p className="text-xs text-slate-400">Demo Credentials: Any email / Any password</p>
                            </div>
                        </div>
                    </div>
                )}

                {currentPage === 'ADMIN_DASHBOARD' && (
                    <div className="h-[calc(100vh-64px)] w-full">
                        <DashboardView
                            logs={logs}
                            dbTables={dbTables}
                            products={products}
                            onRefresh={fetchData}
                        />
                    </div>
                )}

            </main>
        </div>
    );
};

export default App;