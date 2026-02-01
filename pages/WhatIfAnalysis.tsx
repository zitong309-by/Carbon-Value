import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, TrendingDown, DollarSign, Send, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { MaterialData, WhatIfResponse } from '../types';
import { generateOptimization } from '../services/geminiService';

const WhatIfAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialState = location.state as { materials: MaterialData[], buildingArea: number, totalCarbon: number } | null;

  // Fallback if accessed directly
  const [currentMaterials, setCurrentMaterials] = useState<MaterialData[]>(initialState?.materials || []);
  const [history, setHistory] = useState<{ step: number, carbon: number, cost: number }[]>([
    { step: 0, carbon: initialState?.totalCarbon || 0, cost: 0 } // Base cost assumed 0 for relative chart
  ]);

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<WhatIfResponse | null>(null);

  const calculateTotalCost = (mats: MaterialData[]) => mats.reduce((acc, m) => acc + (m.volume * m.costPerUnit), 0);
  const baseCost = initialState ? calculateTotalCost(initialState.materials) : 0;

  const handleOptimization = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const response = await generateOptimization(currentMaterials, prompt);
      
      setLastResponse(response);
      setCurrentMaterials(response.materials);

      const newCarbon = response.materials.reduce((acc, m) => acc + (m.volume * m.factor), 0);
      const newCost = calculateTotalCost(response.materials);

      setHistory(prev => [
        ...prev,
        {
          step: prev.length,
          carbon: newCarbon,
          cost: newCost - baseCost // Delta
        }
      ]);
      setPrompt('');

    } catch (error) {
      console.error(error);
      alert("AI optimization failed. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!initialState) {
    return <div className="p-10 text-white text-center">Please start from the Calculator. <br/><button onClick={() => navigate('/calculator')} className="text-emerald-500 underline mt-4">Go Back</button></div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 pb-20">
      <div className="max-w-7xl mx-auto space-y-6">
        <button onClick={() => navigate('/calculator')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Calculator
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Chat & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 h-full flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-emerald-500" />
                AI Optimizer
              </h2>
              <p className="text-slate-400 text-sm mb-6">Ask to replace materials, change methods, or optimize for cost.</p>
              
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                 {/* Suggested Prompts */}
                 <div className="flex flex-wrap gap-2">
                    {["Replace 20% steel with timber", "Optimize for lowest carbon regardless of cost", "Reduce concrete volume by 10%"].map(txt => (
                      <button key={txt} onClick={() => setPrompt(txt)} className="text-xs px-3 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700">
                        {txt}
                      </button>
                    ))}
                 </div>

                 {lastResponse && (
                   <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl animate-fade-in">
                     <p className="text-emerald-100 text-sm leading-relaxed">{lastResponse.explanation}</p>
                     <div className="mt-3 flex gap-4">
                       <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                          <TrendingDown className="w-3 h-3" /> Carbon: {lastResponse.carbonReductionPercent}%
                       </div>
                       <div className={`flex items-center gap-1 text-xs font-bold ${lastResponse.costDeltaPercent > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                          <DollarSign className="w-3 h-3" /> Cost: {lastResponse.costDeltaPercent > 0 ? '+' : ''}{lastResponse.costDeltaPercent}%
                       </div>
                     </div>
                   </div>
                 )}
              </div>

              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'What if I use engineered timber for the floor slabs?'"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 pr-12 text-white focus:outline-none focus:border-emerald-500 min-h-[100px] resize-none"
                />
                <button 
                  onClick={handleOptimization}
                  disabled={loading}
                  className="absolute right-3 bottom-3 p-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white disabled:opacity-50 transition-colors"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Real-time Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 min-h-[400px]">
              <h3 className="text-lg font-semibold text-white mb-4">Carbon vs Cost Trade-off Curve</h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="step" stroke="#94a3b8" label={{ value: 'Optimization Steps', position: 'insideBottom', offset: -5 }} />
                    <YAxis yAxisId="left" stroke="#10b981" label={{ value: 'Total Carbon (kgCO2e)', angle: -90, position: 'insideLeft', fill: '#10b981' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" label={{ value: 'Cost Delta ($)', angle: 90, position: 'insideRight', fill: '#f59e0b' }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="carbon" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} name="Carbon Footprint" />
                    <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#f59e0b" strokeWidth={3} name="Cost Delta" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Material List comparison table */}
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
               <h3 className="text-lg font-semibold text-white mb-4">Current Material Composition</h3>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left text-slate-400">
                    <thead className="text-xs text-slate-200 uppercase bg-slate-800/50">
                      <tr>
                        <th className="px-4 py-3 rounded-l-lg">Material</th>
                        <th className="px-4 py-3">Volume (m³)</th>
                        <th className="px-4 py-3 rounded-r-lg">Factor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentMaterials.map((m, i) => (
                        <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/30">
                          <td className="px-4 py-3 font-medium text-white">{m.name}</td>
                          <td className="px-4 py-3">{m.volume}</td>
                          <td className="px-4 py-3">{m.factor.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIfAnalysis;