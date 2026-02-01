import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine } from 'recharts';
import { Briefcase, TrendingUp, AlertTriangle, ShieldCheck, DollarSign, Activity, FileText } from 'lucide-react';
import { Persona, FinancialReport } from '../types';
import { LONDON_CARBON_TAX_TRENDS } from '../constants';
import { generateFinancialReport } from '../services/geminiService';

const InvestmentTool: React.FC = () => {
  const [formData, setFormData] = useState({
    lifespan: 60,
    holdingPeriod: 15,
    totalCarbon: 500000,
    area: 2500,
    location: 'London, UK'
  });
  const [persona, setPersona] = useState<Persona>(Persona.INVESTMENT_MANAGER);
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await generateFinancialReport(formData, persona);
      setReport(result);
    } catch (e) {
      console.error(e);
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Carbon-Value Prediction Engine</h1>
            <p className="text-slate-400">Deep genetic algorithm analysis of asset valuation under climate risk.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
            {Object.values(Persona).map((p) => (
              <button
                key={p}
                onClick={() => setPersona(p)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${persona === p ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                {p.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Form */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-500" />
                Asset Parameters
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Building Lifespan (Years)</label>
                  <input 
                    type="number" 
                    value={formData.lifespan}
                    onChange={(e) => setFormData({...formData, lifespan: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Holding Period (Years)</label>
                  <input 
                    type="number" 
                    value={formData.holdingPeriod}
                    onChange={(e) => setFormData({...formData, holdingPeriod: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Total Implicit Carbon (kgCO2e)</label>
                  <input 
                    type="number" 
                    value={formData.totalCarbon}
                    onChange={(e) => setFormData({...formData, totalCarbon: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Gross Area (m²)</label>
                  <input 
                    type="number" 
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 outline-none" 
                  />
                </div>
                 <div>
                  <label className="block text-xs text-slate-500 mb-1">Regulatory Context</label>
                   <p className="text-xs text-slate-400 bg-slate-800/50 p-2 rounded border border-slate-700">
                     {LONDON_CARBON_TAX_TRENDS}
                   </p>
                </div>
                
                <button 
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full py-3 mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-emerald-900/20 disabled:opacity-50"
                >
                  {loading ? <Activity className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
                  Run Simulation
                </button>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-9 space-y-6">
            {!report ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl min-h-[400px]">
                <Activity className="w-12 h-12 mb-4 opacity-50" />
                <p>Enter parameters and run simulation to view financial impact.</p>
              </div>
            ) : (
              <>
                {/* Key Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className={`p-6 rounded-2xl border ${report.riskRating === 'Low' ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                      <h4 className="text-sm text-slate-400 mb-1">Carbon Risk Rating</h4>
                      <div className="flex items-center gap-3">
                         <ShieldCheck className={`w-8 h-8 ${report.riskRating === 'Low' ? 'text-emerald-500' : 'text-red-500'}`} />
                         <span className="text-2xl font-bold text-white">{report.riskRating}</span>
                      </div>
                   </div>

                   <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                      <h4 className="text-sm text-slate-400 mb-1">Stranded Asset Warning</h4>
                      <div className="flex items-center gap-3">
                         <AlertTriangle className="w-8 h-8 text-yellow-500" />
                         <span className="text-2xl font-bold text-white">{report.strandedYear ? `Year ${report.strandedYear}` : 'Safe Horizon'}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {report.strandedYear ? 'Projected valuation collapse due to carbon tax.' : 'Asset remains viable through holding period.'}
                      </p>
                   </div>

                   <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                      <h4 className="text-sm text-slate-400 mb-1">
                        {persona === Persona.REAL_ESTATE_DEVELOPER ? 'Liquidity Velocity' : 'Value at Risk'}
                      </h4>
                      <div className="flex items-center gap-3">
                         <DollarSign className="w-8 h-8 text-blue-500" />
                         <span className="text-2xl font-bold text-white">
                           {persona === Persona.REAL_ESTATE_DEVELOPER ? `+${report.liquidityBoost}% Speed` : '-12.5%'}
                         </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                         {persona === Persona.REAL_ESTATE_DEVELOPER ? 'Faster market exit due to green premium.' : 'Potential loss if carbon price doubles.'}
                      </p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Chart: NPV Trajectory */}
                  <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 min-h-[350px]">
                    <h3 className="text-lg font-semibold text-white mb-4">NPV Forecast (Adjusted for Carbon Tax)</h3>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={report.npvData}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="year" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                          <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" />
                          {report.strandedYear && (
                            <ReferenceLine x={report.strandedYear} stroke="red" label="Stranded" strokeDasharray="3 3" />
                          )}
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart: Sensitivity Analysis */}
                  <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 min-h-[350px]">
                    <h3 className="text-lg font-semibold text-white mb-4">Sensitivity Analysis: Carbon Price Shock</h3>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={report.sensitivityData} layout="vertical">
                          <XAxis type="number" stroke="#94a3b8" hide />
                          <YAxis dataKey="carbonPriceIncrease" type="category" stroke="#94a3b8" width={120} style={{fontSize: '12px'}} />
                          <RechartsTooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                          <Bar dataKey="valuationDrop" fill="#ef4444" radius={[0, 4, 4, 0]}>
                            {report.sensitivityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={`rgba(239, 68, 68, ${(index + 1) * 0.2 + 0.2})`} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* AI generated Advice / Report */}
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                   <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                     <FileText className="w-5 h-5 text-emerald-500" />
                     Strategic Recommendations for {persona}
                   </h3>
                   <ul className="space-y-3">
                     {report.advice.map((item, i) => (
                       <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                         {item}
                       </li>
                     ))}
                   </ul>
                   {persona === Persona.COMPLIANCE_OFFICER && (
                     <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                       <h4 className="text-sm font-bold text-white mb-2">TCFD Disclosure Ready</h4>
                       <p className="text-xs text-slate-400">This data package is formatted for TCFD Pillar 2 (Strategy) reporting requirements regarding transition risks.</p>
                     </div>
                   )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentTool;