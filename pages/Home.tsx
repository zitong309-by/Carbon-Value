import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Building2, TrendingUp } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center bg-slate-950 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="text-center max-w-4xl px-4 z-10">
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-white">
          Decarbonize Assets. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
            Maximize Valuation.
          </span>
        </h1>
        
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          The first AI-driven platform integrating implicit carbon calculation with real estate financial modeling. Optimize your "Carbon King" structures and predict asset liquidity in a net-zero future.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link to="/calculator" className="group relative px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-3">
            <Building2 className="w-5 h-5" />
            <span>Start Carbon Calculation</span>
            <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all"></div>
          </Link>
          
          <Link to="/investment" className="group px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3">
            <TrendingUp className="w-5 h-5" />
            <span>Investment Prediction</span>
          </Link>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-6xl w-full z-10">
        {[
          { icon: Activity, title: "Real-time Sensitivity", desc: "Visualize how carbon price fluctuations impact your asset's Net Present Value instantly." },
          { icon: Building2, title: "What-If Analysis", desc: "Replace steel with timber digitally. See the carbon curve drop and costs adjust in real-time." },
          { icon: TrendingUp, title: "Green Premium", desc: "Unlock the 8-12% resale value potential by meeting RIBA 2030 targets early." }
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-emerald-500/30 transition-colors">
            <item.icon className="w-10 h-10 text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;