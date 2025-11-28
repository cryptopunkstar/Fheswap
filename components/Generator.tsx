import React, { useState } from 'react';
import { generateSmartContract } from '../services/gemini';
import { GeneratedContract } from '../types';
import { Code, Copy, Check, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Generator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GeneratedContract | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setData(null);
    const result = await generateSmartContract('ETH', 'USDC');
    setData(result);
    setLoading(false);
  };

  const copyCode = () => {
    if (data?.code) {
      navigator.clipboard.writeText(data.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Control Panel */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <div className="bg-crypto-card border border-slate-700 p-6 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
             <Terminal size={24} className="text-fhe-400" /> Contract Config
          </h3>
          <div className="space-y-4">
            <div>
               <label className="block text-slate-400 text-sm mb-1">Pair</label>
               <div className="flex gap-2">
                 <input type="text" value="ETH" disabled className="bg-slate-800 text-white p-3 rounded w-full border border-slate-700" />
                 <span className="self-center text-slate-500">/</span>
                 <input type="text" value="USDC" disabled className="bg-slate-800 text-white p-3 rounded w-full border border-slate-700" />
               </div>
            </div>
            <div>
               <label className="block text-slate-400 text-sm mb-1">Library</label>
               <select className="bg-slate-800 text-white p-3 rounded w-full border border-slate-700 outline-none">
                 <option>Zama fhEVM (TFHE)</option>
               </select>
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all ${loading ? 'bg-slate-600 cursor-wait' : 'bg-fhe-600 hover:bg-fhe-500'}`}
            >
              {loading ? 'Generating...' : 'Generate Contract'}
            </button>
          </div>
        </div>

        {data && (
           <div className="bg-crypto-card border border-slate-700 p-6 rounded-xl flex-1 overflow-y-auto">
             <h4 className="text-lg font-bold text-fhe-300 mb-2">Explanation</h4>
             <div className="prose prose-invert prose-sm">
               <ReactMarkdown>{data.explanation}</ReactMarkdown>
             </div>
           </div>
        )}
      </div>

      {/* Code Viewer */}
      <div className="w-full lg:w-2/3 bg-[#0d1117] border border-slate-700 rounded-xl flex flex-col overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center px-4 py-3 bg-slate-800 border-b border-slate-700">
           <span className="text-sm font-mono text-slate-300">ConfidentialSwap.sol</span>
           <button 
             onClick={copyCode}
             className="text-slate-400 hover:text-white flex items-center gap-2 text-sm"
             disabled={!data}
           >
             {copied ? <Check size={16} /> : <Copy size={16} />}
             {copied ? 'Copied' : 'Copy'}
           </button>
        </div>
        <div className="flex-1 overflow-auto p-4 font-mono text-sm relative">
           {loading ? (
             <div className="absolute inset-0 flex items-center justify-center space-y-4 flex-col">
               <div className="w-12 h-12 border-4 border-fhe-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-fhe-400 animate-pulse">Consulting the AI Oracle...</p>
             </div>
           ) : data ? (
             <pre className="text-green-400">
               <code>{data.code}</code>
             </pre>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-500">
               <Code size={48} className="mb-4 opacity-50" />
               <p>No contract generated yet.</p>
               <p className="text-sm">Click "Generate Contract" to start.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Generator;
