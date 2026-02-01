import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, BarChart3, PieChart } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path 
    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/50" 
    : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/50";

  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Leaf className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                CarbonValue AI
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/calculator" className={`px-3 py-2 rounded-md text-sm font-medium border border-dashed transition-all ${isActive('/calculator')}`}>
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  Emission Calculator
                </div>
              </Link>
              <Link to="/investment" className={`px-3 py-2 rounded-md text-sm font-medium border border-dashed transition-all ${isActive('/investment')}`}>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Investment Decision
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;