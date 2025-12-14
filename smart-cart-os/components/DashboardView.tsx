import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SystemLog, DatabaseTable, Product } from '../types';
import { ARCHITECTURE_STEPS } from '../constants';
import {
    Database, Activity, Server, Cpu, Wifi, ArrowRight,
    LayoutDashboard, FileText, Network, Search, Filter,
    AlertCircle, CheckCircle, Clock, Zap, DollarSign, ShoppingBag, Box,
    BarChart2, TrendingUp, Users, PieChart, Calendar, Download, Store, Plus
} from 'lucide-react';

interface DashboardViewProps {
    logs: SystemLog[];
    dbTables: DatabaseTable[];
    products: Product[];
    onRefresh: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ logs, dbTables, products, onRefresh }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'architecture' | 'database' | 'logs' | 'products'>('overview');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Handlers for Product CRUD
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        onRefresh();
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = Object.fromEntries(new FormData(form));
        // Convert types
        const payload = {
            ...data,
            price: parseFloat(data.price as string),
            weight_g: parseInt(data.weight_g as string),
            inStock: data.inStock === 'on'
        };

        if (editingProduct) {
            await fetch(`/api/products/${editingProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }
        setIsEditModalOpen(false);
        setEditingProduct(null);
        onRefresh();
    };
    const [logFilter, setLogFilter] = useState<'ALL' | 'ESP32' | 'GATEWAY' | 'CLOUD' | 'APP'>('ALL');
    const [logSearch, setLogSearch] = useState('');
    const logsEndRef = useRef<HTMLDivElement>(null);

    // Traffic Line Graph Data (Mock for System Health)
    const [trafficData, setTrafficData] = useState<number[]>(Array(20).fill(10));

    // Update Traffic Data Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setTrafficData(prev => {
                const newValue = Math.max(10, Math.min(90, prev[prev.length - 1] + (Math.random() - 0.5) * 30));
                return [...prev.slice(1), newValue];
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Generate SVG Path for Line Graph
    const getLinePath = (data: number[], width: number, height: number, maxVal = 100) => {
        if (data.length === 0) return "";
        const stepX = width / (data.length - 1);
        const points = data.map((val, i) => {
            const x = i * stepX;
            const y = height - (val / maxVal) * height;
            return `${x},${y}`;
        });
        return `M ${points.join(' L ')}`;
    };

    const getAreaPath = (data: number[], width: number, height: number, maxVal = 100) => {
        const line = getLinePath(data, width, height, maxVal);
        return `${line} L ${width},${height} L 0,${height} Z`;
    };

    // Auto-scroll logs
    useEffect(() => {
        if (activeTab === 'logs' && logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, activeTab]);

    // Derived Stats
    const stats = useMemo(() => {
        const productsTable = dbTables.find(t => t.name === 'products');
        const cartsTable = dbTables.find(t => t.name === 'active_carts');

        const totalProducts = productsTable?.data.length || 0;
        const activeCarts = cartsTable?.data.length || 0;
        const totalRevenue = cartsTable?.data.reduce((acc: number, row: any) => acc + parseFloat(row.total || '0'), 0) || 0;

        const errorCount = logs.filter(l => l.type === 'error').length;

        // Simulate system load based on recent log activity
        const recentActivity = logs.slice(0, 10).length;
        const systemLoad = Math.min(100, 10 + (recentActivity * 8));

        return { totalProducts, activeCarts, totalRevenue, errorCount, systemLoad };
    }, [dbTables, logs]);

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const matchesSource = logFilter === 'ALL' || log.source === logFilter;
            const matchesSearch = logSearch === '' ||
                log.event.toLowerCase().includes(logSearch.toLowerCase()) ||
                log.details.toLowerCase().includes(logSearch.toLowerCase());
            return matchesSource && matchesSearch;
        });
    }, [logs, logFilter, logSearch]);

    const MetricCard = ({ title, value, icon: Icon, color, trend }: any) => (
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
                <Icon size={64} />
            </div>
            <div className="relative z-10">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800 flex items-end gap-2">
                    {value}
                    {trend && <span className="text-xs text-green-500 font-medium mb-1">{trend}</span>}
                </h3>
            </div>
            <div className={`mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden`}>
                <div className={`h-full ${color.replace('text-', 'bg-')} w-2/3 opacity-75`}></div>
            </div>
        </div>
    );

    // --- ANALYTICS MOCK DATA ---
    const salesData = [30, 45, 42, 50, 65, 60, 70, 75, 85, 90, 88, 95]; // Smooth upward curve
    const cohortData = [
        { label: 'Jan', data: [100, 64.7, 56.8, 48.7, 35.6, 28.5, 28.5, 19.2] },
        { label: 'Feb', data: [100, 56.8, 48.7, 35.6, 28.5, 28.5, 19.2] },
        { label: 'Mar', data: [100, 48.7, 35.6, 28.5, 28.5, 19.2] },
        { label: 'Apr', data: [100, 35.6, 28.5, 28.5, 19.2] },
        { label: 'May', data: [100, 28.5, 28.5, 19.2] },
        { label: 'Jun', data: [100, 28.5, 19.2] },
        { label: 'Jul', data: [100, 19.2] },
        { label: 'Aug', data: [100] },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-50 text-slate-900 font-sans">

            {/* Header / Status Bar */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-20">
                <div className="flex items-center space-x-3">
                    <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
                        <Activity className="text-white" size={20} />
                    </div>
                    <div>
                        <h1 className="text-slate-900 font-bold text-lg leading-tight tracking-tight">Smart Cart OS <span className="text-indigo-600">Admin</span></h1>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
                            <span className="flex items-center text-green-600"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span> ONLINE</span>
                            <span>v2.4.0-stable</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-xs font-mono">
                    <div className="flex items-center gap-2">
                        <Cpu size={14} className="text-slate-400" />
                        <span className="text-slate-500">CPU:</span>
                        <span className={`${stats.systemLoad > 80 ? 'text-red-500' : 'text-green-600'} font-bold`}>{stats.systemLoad}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wifi size={14} className="text-slate-400" />
                        <span className="text-slate-500">LATENCY:</span>
                        <span className="text-blue-600 font-bold">24ms</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400" />
                        <span className="text-slate-500">UPTIME:</span>
                        <span className="text-slate-700 font-bold">14d 03h 22m</span>
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar Navigation */}
                <div className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 space-y-2">
                    {[
                        { id: 'OVERVIEW', icon: LayoutDashboard, label: 'System Health' },
                        { id: 'ANALYTICS', icon: BarChart2, label: 'Analytics' },
                        { id: 'ARCH', icon: Network, label: 'Architecture' },
                        { id: 'DB', icon: Database, label: 'Database' },
                        { id: 'LOGS', icon: FileText, label: 'System Logs' },
                        { id: 'PRODUCTS', icon: Store, label: 'Product Catalog' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id.toLowerCase() as any)}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === item.id.toLowerCase()
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                        >
                            <item.icon size={18} className={`transition-colors ${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                            <span className="font-medium text-sm">{item.label}</span>
                            {item.id.toLowerCase() === 'logs' && stats.errorCount > 0 && (
                                <span className="ml-auto bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">{stats.errorCount}</span>
                            )}
                        </button>
                    ))}

                    <div className="mt-auto pt-4 border-t border-slate-100">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <p className="text-xs text-slate-500 mb-2 font-bold uppercase">Storage Usage</p>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
                                <div className="bg-green-500 h-full w-[45%]"></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500">
                                <span>45.2 GB Used</span>
                                <span>1 TB Total</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto bg-slate-50 p-6 relative">

                    <div className="relative z-10 max-w-7xl mx-auto">

                        {activeTab === 'analytics' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-slate-800">Business Analytics</h2>
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50">
                                            <Calendar size={14} /> Last 6 months: Jan 1, 2024 - Jun 30, 2024
                                        </button>
                                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50">
                                            <Download size={14} /> Export
                                        </button>
                                    </div>
                                </div>

                                {/* Top Row: Sales Graph & Summary */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Sales Graph */}
                                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="font-bold text-slate-800">Total Sales</h3>
                                                <div className="flex items-baseline gap-2 mt-1">
                                                    <span className="text-3xl font-bold text-slate-900">₹895.39K</span>
                                                    <span className="text-xs font-bold text-green-500 flex items-center">
                                                        <TrendingUp size={12} className="mr-1" /> 9.2% vs 6 month before
                                                    </span>
                                                </div>
                                            </div>
                                            <button className="text-xs text-indigo-600 font-bold hover:underline">See all sales &gt;</button>
                                        </div>
                                        <div className="h-48 w-full relative">
                                            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                                                <defs>
                                                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#84cc16" stopOpacity="0.2" />
                                                        <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
                                                    </linearGradient>
                                                </defs>
                                                {/* Area */}
                                                <path
                                                    d={getAreaPath(salesData, 400, 100, 100)}
                                                    fill="url(#salesGradient)"
                                                />
                                                {/* Line */}
                                                <path
                                                    d={getLinePath(salesData, 400, 100, 100)}
                                                    fill="none"
                                                    stroke="#65a30d"
                                                    strokeWidth="2"
                                                    vectorEffect="non-scaling-stroke"
                                                />
                                                {/* Dots */}
                                                {salesData.map((val, i) => {
                                                    if (i % 2 !== 0 && i !== salesData.length - 1) return null;
                                                    const x = i * (400 / (salesData.length - 1));
                                                    const y = 100 - (val / 100) * 100;
                                                    return (
                                                        <circle key={i} cx={x} cy={y} r="3" fill="#fff" stroke="#65a30d" strokeWidth="2" />
                                                    );
                                                })}
                                            </svg>
                                            {/* X-Axis Labels */}
                                            <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                                                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Summary Stats */}
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                                        <h3 className="font-bold text-slate-800 mb-6">Summary <span className="text-slate-400 font-normal text-xs ml-1">Jan 1 - Jun 30, 2024</span></h3>

                                        <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                                            <div>
                                                <p className="text-3xl font-bold text-slate-900">₹320.4K</p>
                                                <p className="text-xs text-slate-500 font-bold uppercase mt-1">Revenue</p>
                                                <div className="w-12 h-1 bg-green-500 mt-2 rounded-full"></div>
                                            </div>
                                            <div>
                                                <p className="text-3xl font-bold text-slate-900">31.6K</p>
                                                <p className="text-xs text-slate-500 font-bold uppercase mt-1">Orders</p>
                                            </div>
                                            <div>
                                                <p className="text-3xl font-bold text-slate-900">₹4.2K</p>
                                                <p className="text-xs text-slate-500 font-bold uppercase mt-1">Avg. Order Value</p>
                                            </div>
                                            <div>
                                                <p className="text-3xl font-bold text-slate-900">12.6K</p>
                                                <p className="text-xs text-slate-500 font-bold uppercase mt-1">New Cust. Sign Up</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sales Funnel */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-slate-800 mb-6">Sales Funnel <span className="text-slate-400 font-normal text-xs ml-1">Jan 1, 2024 - Jun 30, 2024</span></h3>

                                    <div className="flex flex-col md:flex-row gap-4 items-end justify-between h-64 w-full">
                                        {[
                                            { label: 'Visitors', value: '256.2K', sub: 'No Shopping Activity', subVal: '57,583', drop: '19.23%', height: 'h-full', color: 'bg-lime-300' },
                                            { label: 'Product Views', value: '198.4K', sub: 'No Cart Addition', subVal: '52,394', drop: '17.23%', height: 'h-[80%]', color: 'bg-lime-400' },
                                            { label: 'Add to Cart', value: '139.2K', sub: 'Cart Abandonment', subVal: '129,239', drop: '86.57%', height: 'h-[65%]', color: 'bg-emerald-500' },
                                            { label: 'Check-Out', value: '9.4K', sub: 'Check-Out Abandon', subVal: '3,940', drop: '32.54%', height: 'h-[25%]', color: 'bg-emerald-700' },
                                            { label: 'Complete Order', value: '5.9K', sub: '', subVal: '', drop: '', height: 'h-[15%]', color: 'bg-slate-800' },
                                        ].map((step, idx) => (
                                            <div key={idx} className="flex-1 w-full flex flex-col justify-end group">
                                                <div className="mb-2">
                                                    <p className="font-bold text-xs text-slate-500 mb-1">{step.label}</p>
                                                    <p className="font-bold text-xl text-slate-900">{step.value}</p>
                                                    {step.sub && (
                                                        <div className="mt-2 text-[10px] text-slate-400">
                                                            <p>{step.sub}</p>
                                                            <div className="flex justify-between items-center mt-0.5">
                                                                <span className="font-mono text-slate-600">{step.subVal}</span>
                                                                <span className="text-red-400">{step.drop}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={`w-full ${step.height} ${step.color} rounded-t-lg relative transition-all duration-500 hover:opacity-90`}>
                                                    {/* Connector visual trick */}
                                                    {idx < 4 && (
                                                        <div className="absolute top-0 -right-4 w-8 h-full z-10 opacity-50 pointer-events-none hidden md:block"
                                                            style={{
                                                                background: `linear-gradient(to bottom right, transparent 50%, #f1f5f9 50%)`
                                                            }}
                                                        ></div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom Row: Lifetime Revenue & Retention */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Lifetime Revenue Line Chart */}
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                        <h3 className="font-bold text-slate-800 mb-6">Average Lifetime Revenue</h3>
                                        <div className="h-64 relative">
                                            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                                                {/* Grid Lines */}
                                                {[0, 50, 100, 150].map(y => (
                                                    <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                                                ))}
                                                {/* Lines */}
                                                <path d="M 0,200 Q 100,50 500,20" fill="none" stroke="#4f46e5" strokeWidth="2" />
                                                <path d="M 0,200 Q 100,80 500,40" fill="none" stroke="#9333ea" strokeWidth="2" />
                                                <path d="M 0,200 Q 100,120 400,80" fill="none" stroke="#db2777" strokeWidth="2" />
                                                <path d="M 0,200 Q 100,150 350,110" fill="none" stroke="#f43f5e" strokeWidth="2" />
                                                <path d="M 0,200 Q 80,180 250,150" fill="none" stroke="#f97316" strokeWidth="2" />
                                            </svg>
                                            {/* Legend */}
                                            <div className="flex gap-4 mt-4 justify-center text-[10px] text-slate-500">
                                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600"></span> Jan 2022</span>
                                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-600"></span> Feb 2022</span>
                                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-600"></span> Mar 2022</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cohort Heatmap */}
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                                        <h3 className="font-bold text-slate-800 mb-6">Customer Retention</h3>
                                        <div className="min-w-[500px]">
                                            <div className="grid grid-cols-9 gap-1 mb-2">
                                                <div className="col-span-1"></div>
                                                {Array.from({ length: 8 }).map((_, i) => (
                                                    <div key={i} className="text-[10px] text-center text-slate-400 font-bold uppercase">M + {i}</div>
                                                ))}
                                            </div>
                                            <div className="space-y-1">
                                                {cohortData.map((row, rIdx) => (
                                                    <div key={rIdx} className="grid grid-cols-9 gap-1">
                                                        <div className="col-span-1 text-[10px] font-bold text-slate-600 flex flex-col justify-center">
                                                            <span>{row.label}</span>
                                                            <span className="text-[9px] text-slate-400 font-normal">'24</span>
                                                        </div>
                                                        {row.data.map((val, cIdx) => (
                                                            <div
                                                                key={cIdx}
                                                                className="h-8 flex items-center justify-center text-[10px] text-white rounded font-medium transition-all hover:scale-105"
                                                                style={{
                                                                    backgroundColor: `rgba(124, 58, 237, ${val === 100 ? 1 : val < 20 ? 0.2 : val / 100})`,
                                                                    color: val < 30 ? '#4b5563' : 'white'
                                                                }}
                                                            >
                                                                {val}%
                                                            </div>
                                                        ))}
                                                        {/* Fill empty cells */}
                                                        {Array.from({ length: 8 - row.data.length }).map((_, i) => (
                                                            <div key={i} className="h-8 bg-slate-50 rounded"></div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'overview' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-2xl font-bold text-slate-800">System Health Monitor</h2>
                                    <button className="text-xs bg-white hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded border border-slate-200 shadow-sm transition-colors">
                                        Generate Report
                                    </button>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <MetricCard
                                        title="Total Revenue (Live)"
                                        value={`₹${stats.totalRevenue.toFixed(2)}`}
                                        icon={DollarSign}
                                        color="text-green-600"
                                    />
                                    <MetricCard
                                        title="Active Carts"
                                        value={stats.activeCarts}
                                        icon={ShoppingBag}
                                        color="text-blue-600"
                                    />
                                    <MetricCard
                                        title="Total Products"
                                        value={stats.totalProducts}
                                        icon={Box}
                                        color="text-purple-600"
                                    />
                                    <MetricCard
                                        title="System Health"
                                        value={`${100 - stats.errorCount}%`}
                                        icon={Activity}
                                        color={stats.errorCount > 0 ? "text-yellow-600" : "text-green-600"}
                                    />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Real-time Monitor (Line Graph) */}
                                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                                        <h3 className="font-bold text-slate-800 mb-6 flex items-center">
                                            <Zap size={16} className="text-indigo-500 mr-2" /> Real-time API Traffic
                                        </h3>
                                        <div className="h-48 w-full relative overflow-hidden">
                                            <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
                                                <defs>
                                                    <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                                                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                                                    </linearGradient>
                                                </defs>
                                                <path
                                                    d={getAreaPath(trafficData, 1000, 100)}
                                                    fill="url(#gradientArea)"
                                                />
                                                <path
                                                    d={getLinePath(trafficData, 1000, 100)}
                                                    fill="none"
                                                    stroke="#6366f1"
                                                    strokeWidth="3"
                                                    vectorEffect="non-scaling-stroke"
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Recent Alerts */}
                                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
                                        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                                            <AlertCircle size={16} className="text-red-500 mr-2" /> Recent Alerts
                                        </h3>
                                        <div className="flex-1 overflow-auto space-y-3 pr-2">
                                            {logs.filter(l => l.type !== 'info').length === 0 ? (
                                                <div className="text-center py-8 text-slate-400">
                                                    <CheckCircle size={32} className="mx-auto mb-2 opacity-20" />
                                                    <p className="text-sm">All systems nominal</p>
                                                </div>
                                            ) : (
                                                logs.filter(l => l.type !== 'info').slice(0, 5).map(log => (
                                                    <div key={log.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className={`font-bold ${log.type === 'error' ? 'text-red-500' : 'text-yellow-600'}`}>
                                                                {log.event}
                                                            </span>
                                                            <span className="text-slate-400 text-[10px]">{log.timestamp.split('T')[1].split('.')[0]}</span>
                                                        </div>
                                                        <p className="text-slate-600 truncate">{log.details}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'architecture' && (
                            <div className="space-y-8 animate-fadeIn">
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl font-bold text-slate-800 mb-2">System Architecture</h2>
                                    <p className="text-slate-500">Real-time data flow visualization</p>
                                </div>

                                <div className="relative max-w-4xl mx-auto">
                                    {/* Vertical Connecting Line */}
                                    <div className="absolute left-10 top-10 bottom-10 w-0.5 bg-gradient-to-b from-blue-200 via-indigo-200 to-purple-200 -z-10"></div>

                                    {ARCHITECTURE_STEPS.map((step, idx) => (
                                        <div key={step.id} className="flex items-start mb-12 group relative">
                                            {/* Icon Node */}
                                            <div className={`w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg mr-8 z-10 transition-transform duration-300 group-hover:scale-110 bg-white border-2 ${step.id === 'layer1' ? 'border-blue-500 text-blue-500' :
                                                step.id === 'layer2' ? 'border-purple-500 text-purple-500' : 'border-indigo-500 text-indigo-500'
                                                }`}>
                                                {step.icon === 'Cpu' && <Cpu size={32} />}
                                                {step.icon === 'Router' && <Wifi size={32} />}
                                                {step.icon === 'Cloud' && <Server size={32} />}

                                                {/* Pulse Effect */}
                                                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 animate-ping ${step.id === 'layer1' ? 'bg-blue-500' :
                                                    step.id === 'layer2' ? 'bg-purple-500' : 'bg-indigo-500'
                                                    }`}></div>
                                            </div>

                                            {/* Content Card */}
                                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-1 hover:border-indigo-200 transition-all hover:translate-x-2">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-slate-800 text-lg font-bold">
                                                        {step.title}
                                                    </h3>
                                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded border border-slate-200 font-mono">
                                                        LAYER 0{idx + 1}
                                                    </span>
                                                </div>
                                                <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${step.id === 'layer1' ? 'text-blue-500' :
                                                    step.id === 'layer2' ? 'text-purple-500' : 'text-indigo-500'
                                                    }`}>{step.subtitle}</p>
                                                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>

                                                {idx < ARCHITECTURE_STEPS.length - 1 && (
                                                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs text-slate-500 font-mono">
                                                        <div className="flex space-x-1 mr-2">
                                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></span>
                                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce delay-75"></span>
                                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce delay-150"></span>
                                                        </div>
                                                        <span>Data Flow: MQTT Payload via JSON</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'database' && (
                            <div className="space-y-8 animate-fadeIn">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800">Database Schema</h2>
                                    <div className="flex gap-2">
                                        <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded border border-indigo-100">
                                            3 Tables Active
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {dbTables.map((table) => (
                                        <div key={table.name} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-96">
                                            <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Database size={16} className="text-indigo-500" />
                                                    <span className="font-bold text-slate-700 font-mono text-sm">{table.name}</span>
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-mono">{table.data.length} records</span>
                                            </div>
                                            <div className="flex-1 overflow-auto custom-scrollbar">
                                                {table.data.length === 0 ? (
                                                    <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">No records found</div>
                                                ) : (
                                                    <table className="w-full text-xs text-left border-collapse">
                                                        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                                            <tr>
                                                                {table.columns.map(col => (
                                                                    <th key={col} className="p-3 text-slate-500 font-medium uppercase tracking-wider border-b border-slate-200 bg-slate-50">
                                                                        {col}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {table.data.map((row, i) => (
                                                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                                    {table.columns.map(col => (
                                                                        <td key={col} className="p-3 text-slate-600 whitespace-nowrap font-mono">
                                                                            {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col])}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'logs' && (
                            <div className="h-[calc(100vh-8rem)] flex flex-col animate-fadeIn">
                                {/* Logs Toolbar */}
                                <div className="bg-white p-4 rounded-t-xl border border-slate-200 border-b-0 flex flex-wrap gap-4 items-center justify-between shadow-sm z-10">
                                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-64">
                                        <Search size={14} className="text-slate-400 mr-2" />
                                        <input
                                            type="text"
                                            placeholder="Search logs..."
                                            className="bg-transparent border-none outline-none text-xs text-slate-700 w-full placeholder-slate-400"
                                            value={logSearch}
                                            onChange={(e) => setLogSearch(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                                        {['ALL', 'ESP32', 'GATEWAY', 'CLOUD', 'APP'].map((filter) => (
                                            <button
                                                key={filter}
                                                onClick={() => setLogFilter(filter as any)}
                                                className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${logFilter === filter
                                                    ? 'bg-indigo-600 text-white shadow-sm'
                                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white'
                                                    }`}
                                            >
                                                {filter}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Logs Console - Keeping Dark Mode for Terminal Feel */}
                                <div className="flex-1 bg-slate-900 rounded-b-xl border border-slate-800 overflow-hidden flex flex-col relative shadow-md">
                                    <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1 custom-scrollbar">
                                        {filteredLogs.length === 0 && (
                                            <div className="text-slate-500 italic p-4 text-center">No matching logs found.</div>
                                        )}
                                        {filteredLogs.map((log) => (
                                            <div key={log.id} className="flex items-start hover:bg-slate-800/50 p-1 rounded transition-colors group">
                                                <span className="text-slate-500 mr-3 select-none w-20 flex-shrink-0">
                                                    {log.timestamp.split('T')[1].split('.')[0]}
                                                </span>
                                                <span className={`mr-3 w-20 flex-shrink-0 font-bold ${log.source === 'ESP32' ? 'text-yellow-500' :
                                                    log.source === 'GATEWAY' ? 'text-purple-400' :
                                                        log.source === 'CLOUD' ? 'text-blue-400' : 'text-green-400'
                                                    }`}>
                                                    {log.source}
                                                </span>
                                                <div className="flex-1 flex flex-wrap gap-2">
                                                    <span className={`${log.type === 'error' ? 'text-red-400 font-bold' :
                                                        log.type === 'warning' ? 'text-orange-300' :
                                                            log.type === 'success' ? 'text-green-300' :
                                                                'text-slate-300'
                                                        }`}>
                                                        {log.event}
                                                    </span>
                                                    {log.details && (
                                                        <span className="text-slate-500 border-l border-slate-700 pl-2">
                                                            {log.details}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={logsEndRef} />
                                    </div>

                                    {/* StatusBar Footer */}
                                    <div className="bg-slate-950 border-t border-slate-800 px-4 py-2 text-[10px] text-slate-500 flex justify-between items-center">
                                        <span>{filteredLogs.length} events filtered</span>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${stats.activeCarts > 0 ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
                                            <span>System Listening</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;