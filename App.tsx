import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Simulator from './components/Simulator';
import Generator from './components/Generator';
import Guide from './components/Guide';
import { AppTab } from './types';
import { Layout, Cpu, Book, Activity, Shield } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.SIMULATOR);

  return (
    <div className="min-h-screen bg-crypto-dark text-slate-200 font-sans selection:bg-fhe-500 selection:text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-fhe-600 to-crypto-accent rounded-lg flex items-center justify-center shadow-lg shadow-fhe-500/20">
              <Shield size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              CipherSwap <span className="text-fhe-400 font-light">Academy</span>
            </span>
          </div>
          
          <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab(AppTab.SIMULATOR)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === AppTab.SIMULATOR 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity size={16} /> Simulator
            </button>
            <button
              onClick={() => setActiveTab(AppTab.GENERATOR)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === AppTab.GENERATOR 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu size={16} /> Code Generator
            </button>
            <button
              onClick={() => setActiveTab(AppTab.GUIDE)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === AppTab.GUIDE 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Book size={16} /> Deployment Guide
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8 animate-fade-in">
        {activeTab === AppTab.SIMULATOR && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-white">Understand FHE Swaps</h1>
              <p className="text-slate-400">Before deploying, visualize how encrypted state works.</p>
            </div>
            <Simulator />
          </div>
        )}
        
        {activeTab === AppTab.GENERATOR && (
          <div className="space-y-4">
             <div className="text-center">
              <h1 className="text-3xl font-bold text-white">Smart Contract Studio</h1>
              <p className="text-slate-400">Generate production-ready fhEVM solidity code.</p>
            </div>
            <Generator />
          </div>
        )}
        
        {activeTab === AppTab.GUIDE && (
          <div className="space-y-4">
             <div className="text-center">
              <h1 className="text-3xl font-bold text-white">Deployment Masterclass</h1>
              <p className="text-slate-400">Step-by-step guide to Sepolia deployment with AI assistance.</p>
            </div>
            <Guide />
          </div>
        )}
      </main>

    </div>
  );
};

export default App;
