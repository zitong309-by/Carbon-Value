import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CarbonCalculator from './pages/CarbonCalculator';
import WhatIfAnalysis from './pages/WhatIfAnalysis';
import InvestmentTool from './pages/InvestmentTool';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<CarbonCalculator />} />
          <Route path="/what-if" element={<WhatIfAnalysis />} />
          <Route path="/investment" element={<InvestmentTool />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;