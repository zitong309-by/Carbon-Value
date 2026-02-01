import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, ReferenceLine } from 'recharts';
import { Upload, ArrowRight, AlertTriangle, CheckCircle, Sliders } from 'lucide-react';
import { MaterialData } from '../types';
import { INITIAL_MATERIALS, RIBA_2030_TARGET, RIBA_CURRENT_AVG } from '../constants';

const CarbonCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<MaterialData[]>(INITIAL_MATERIALS);
  const [buildingArea, setBuildingArea] = useState<number>(1000); // m2
  const [isDragging, setIsDragging] = useState(false);

  // Derived calculations
  const totalCarbon = useMemo(() => {
    return materials.reduce((acc, curr) => acc + (curr.volume * curr.factor), 0);
  }, [materials]);

  const carbonPerSqm = totalCarbon / buildingArea;

  const chartData = useMemo(() => {
    return materials.map(m => ({
      name: m.name,
      value: Math.round(m.volume * m.factor), // Total Carbon for this material
      volume: m.volume
    })).sort((a, b) => b.value - a.value);
  }, [materials]);

  const comparisonData = [
    { name: 'Your Design', carbon: Math.round(carbonPerSqm) },
    { name: 'RIBA 2030 Target', carbon: RIBA_2030_TARGET },
    { name: 'Current Avg', carbon: RIBA_CURRENT_AVG },
  ];

  const handleSliderChange = (index: number, newVolume: number) => {
    const updated = [...materials];
    updated[index].volume = newVolume;
    setMaterials(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulation of OBJ parsing
      // In a real app, we would parse the mesh volume here.
      // For this demo, we randomize volumes to show "detection"
      const simulatedData = materials.map(m => ({
        ...m,
        volume: Math.floor(Math.random() * 500) + 50
      }));
      setMaterials(simulatedData);
      alert(`Parsed ${file.name}: Material volumes updated based on geometry analysis.`);
    }
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const getCarbonStatus = () => {
    if (carbonPerSqm <= RIBA_2030_TARGET) return { color: 'text-emerald-400', icon: CheckCircle, text: 'Compliant (RIBA 2030)' };
    if (carbonPerSqm <= RIBA_CURRENT_AVG) return { color: 'text-yellow-400', icon: AlertTriangle, text: 'Average Performance' };
    return { color: 'text-red-400', icon: AlertTriangle, text: 'High Carbon Risk' };
  };

  const status = getCarbonStatus();

  return (
    <div className="min-h-screen bg-slate-950 p-6 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Implicit Carbon Calculator</h1>
            <p className="text-slate-400">Analyze material volumes and embodied carbon footprint.</p>
          </div>
          <div className={`flex items-center gap-3 px-4 py-3 bg-slate-900 rounded-xl border border-slate-800 ${status.color}`}>
            <status.icon className="w-6 h-6" />
            <span className="font-bold text-lg">{Math.round(carbonPerSqm)} kgCO₂e/m²</span>
            <span className="text-sm opacity-80">({status.text})</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-500" />
                Import Model
              </h3>
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 hover:border-slate-500'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  // Simulate drop logic
                  const simulatedData = materials.map(m => ({ ...m, volume: Math.floor(Math.random() * 500) + 50 }));
                  setMaterials(simulatedData);
                }}
              >
                <input type="file" accept=".obj" onChange={handleFileUpload} className="hidden" id="obj-upload" />
                <label htmlFor="obj-upload" className="cursor-pointer">
                  <p className="text-slate-300 font-medium">Click to upload .OBJ</p>
                  <p className="text-slate-500 text-sm mt-1">or drag and drop 3D model</p>
                </label>
              </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-500" />
                  Material Volumes (m³)
                </h3>
                <div className="text-xs text-slate-500">Gross Area: 
                  <input 
                    type="number" 
                    value={buildingArea} 
                    onChange={(e) => setBuildingArea(Number(e.target.value))}
                    className="w-20 ml-2 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white"
                  /> m²
                </div>
              </div>

              <div className="space-y-6">
                {materials.map((m, idx) => (
                  <div key={m.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">{m.name}</span>
                      <span className="text-emerald-400 font-mono">{m.volume} m³</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={m.volume}
                      onChange={(e) => handleSliderChange(idx, Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Donut Chart: Structural Decomposition */}
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 min-h-[400px]">
                <h3 className="text-lg font-semibold text-white mb-2">Structural Decomposition</h3>
                <p className="text-sm text-slate-500 mb-4">Total Embodied Carbon by Material</p>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                        formatter={(value: number) => [`${(value / 1000).toFixed(1)} tCO₂e`, 'Carbon']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-4">
                  <p className="text-slate-400 text-sm">Carbon King identified:</p>
                  <p className="text-xl font-bold text-white">{chartData[0].name}</p>
                </div>
              </div>

              {/* Bar Chart: RIBA Comparison */}
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 min-h-[400px]">
                <h3 className="text-lg font-semibold text-white mb-2">Benchmark Warning</h3>
                <p className="text-sm text-slate-500 mb-4">Project vs. RIBA 2030 Target</p>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <RechartsTooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                      <ReferenceLine y={RIBA_2030_TARGET} stroke="#10b981" strokeDasharray="3 3" />
                      <Bar dataKey="carbon" radius={[4, 4, 0, 0]}>
                        {comparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name === 'Your Design' ? (entry.carbon > RIBA_2030_TARGET ? '#ef4444' : '#10b981') : '#475569'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-6 bg-gradient-to-r from-emerald-900/20 to-slate-900 border border-emerald-500/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">AI Optimization Available</h3>
                <p className="text-slate-400 text-sm">Analyze material substitution scenarios to reduce carbon.</p>
              </div>
              <button 
                onClick={() => navigate('/what-if', { state: { materials, buildingArea, totalCarbon, carbonPerSqm } })}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20"
              >
                Launch What-If Analysis
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonCalculator;