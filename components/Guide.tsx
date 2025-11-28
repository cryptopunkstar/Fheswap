import React, { useState, useEffect } from 'react';
import { getDeploymentGuide, getLocalSetupGuide, chatWithExpert } from '../services/gemini';
import { DeploymentStep, ChatMessage } from '../types';
import { BookOpen, Send, User, Bot, Terminal, Server, Cloud } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Guide: React.FC = () => {
  const [steps, setSteps] = useState<DeploymentStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [mode, setMode] = useState<'deploy' | 'local'>('deploy');
  
  useEffect(() => {
    const fetchGuide = async () => {
      setLoading(true);
      const fetcher = mode === 'deploy' ? getDeploymentGuide : getLocalSetupGuide;
      const guideSteps = await fetcher();
      setSteps(guideSteps);
      setLoading(false);
      
      // Initial greeting logic update
      if (chatHistory.length === 0) {
        setChatHistory([{
          id: 'init',
          role: 'model',
          text: "Hi! I'm your FHE deployment assistant. Ask me anything about deploying to Sepolia or setting up your local Docker environment.",
          timestamp: Date.now()
        }]);
      }
    };
    fetchGuide();
  }, [mode]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: chatInput,
      timestamp: Date.now()
    };
    
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');

    // Prepare history for Gemini API
    const apiHistory = chatHistory.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await chatWithExpert(userMsg.text, apiHistory);
    
    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setChatHistory(prev => [...prev, modelMsg]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
       {/* Guide Section */}
       <div className="w-full lg:w-2/3 bg-crypto-card border border-slate-700 rounded-xl p-6 overflow-y-auto">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
           <h2 className="text-2xl font-bold text-white flex items-center gap-3">
             <BookOpen className="text-fhe-400" /> 
             {mode === 'deploy' ? 'Sepolia Deployment' : 'Local Environment Setup'}
           </h2>
           
           <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
             <button 
               onClick={() => setMode('deploy')}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${mode === 'deploy' ? 'bg-fhe-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
             >
               <Cloud size={14} /> Sepolia
             </button>
             <button 
               onClick={() => setMode('local')}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${mode === 'local' ? 'bg-fhe-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
             >
               <Server size={14} /> Local Dev
             </button>
           </div>
         </div>
         
         {loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse flex flex-col gap-2">
                   <div className="h-6 bg-slate-700 rounded w-1/3"></div>
                   <div className="h-24 bg-slate-800 rounded w-full"></div>
                </div>
              ))}
            </div>
         ) : (
           <div className="space-y-8">
             {steps.map((step, idx) => (
               <div key={idx} className="relative pl-8 border-l-2 border-slate-700 hover:border-fhe-500 transition-colors pb-2">
                 <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-800 border-2 border-fhe-500"></div>
                 <h3 className="text-xl font-semibold text-fhe-200 mb-2">{idx + 1}. {step.title}</h3>
                 <p className="text-slate-300 mb-4 leading-relaxed">{step.description}</p>
                 {step.command && (
                   <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400 border border-slate-800 flex items-start gap-2 overflow-x-auto">
                     <span className="text-slate-500 select-none">$</span>
                     {step.command}
                   </div>
                 )}
               </div>
             ))}
           </div>
         )}
       </div>

       {/* Chat Assistant */}
       <div className="w-full lg:w-1/3 bg-slate-900 border border-slate-700 rounded-xl flex flex-col shadow-xl">
         <div className="p-4 border-b border-slate-700 bg-slate-800 rounded-t-xl">
           <h3 className="font-bold text-white flex items-center gap-2">
             <Bot className="text-crypto-accent" /> AI Assistant
           </h3>
         </div>
         
         <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-fhe-600 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                }`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
         </div>

         <div className="p-4 border-t border-slate-700 bg-slate-800 rounded-b-xl">
           <div className="flex gap-2">
             <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={mode === 'local' ? "Ask about Docker or Hardhat..." : "Ask about Sepolia deployment..."}
                className="flex-1 bg-slate-900 text-white border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-fhe-500"
             />
             <button 
               onClick={handleSendMessage}
               className="bg-fhe-600 hover:bg-fhe-500 text-white p-2 rounded-lg transition-colors"
             >
               <Send size={18} />
             </button>
           </div>
         </div>
       </div>
    </div>
  );
};

export default Guide;