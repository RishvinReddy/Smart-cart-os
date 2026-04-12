import React from 'react';
import { ShoppingCart, Activity, ShieldCheck, Zap, Smartphone, Database, ArrowRight, Store, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: 'SHOP' | 'ADMIN_LOGIN') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-2/3">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
                <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold tracking-wide uppercase text-indigo-100">Next Gen Retail OS</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              The Future of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Smart Shopping</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
              Experience a seamless blend of physical and digital retail. 
              Smart Cart OS integrates RFID precision, real-time inventory, and AI-powered recommendations into one unified platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigate('SHOP')}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-900/50 transition-all flex items-center justify-center gap-2 group"
              >
                <Store size={20} />
                Launch Web Store
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate('ADMIN_LOGIN')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-lg backdrop-blur-sm transition-all flex items-center justify-center gap-2"
              >
                <Activity size={20} />
                System Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Powered by Advanced Technology</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Our architecture connects embedded IoT devices with cloud-scale analytics to deliver zero-latency shopping experiences.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Smartphone size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Consumer App</h3>
              <p className="text-slate-600 leading-relaxed">
                A responsive mobile interface that allows customers to scan, track, and pay for items instantly. Features AI recipe suggestions and real-time budget tracking.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                <Database size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Inventory</h3>
              <p className="text-slate-600 leading-relaxed">
                Syncs physical shelf stock with the digital catalog in milliseconds using MQTT brokers and Edge Gateway processing.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Admin Dashboard</h3>
              <p className="text-slate-600 leading-relaxed">
                Comprehensive oversight of system health, active carts, and revenue streams. Monitor ESP32 logs and API latency in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Strip */}
      <div className="border-y border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-bold text-xl text-slate-800"><Zap size={24}/> React 19</div>
            <div className="flex items-center gap-2 font-bold text-xl text-slate-800"><Database size={24}/> PostgreSQL</div>
            <div className="flex items-center gap-2 font-bold text-xl text-slate-800"><Activity size={24}/> MQTT</div>
            <div className="flex items-center gap-2 font-bold text-xl text-slate-800"><ShieldCheck size={24}/> Google Gemini</div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;