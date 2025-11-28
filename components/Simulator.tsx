import React, { useState, useEffect } from 'react';
import { Lock, Unlock, ArrowRight, RefreshCw, ShieldCheck, EyeOff, Wallet, Fuel, Zap } from 'lucide-react';
import { SwapStep } from '../types';

const Simulator: React.FC = () => {
  const [amount, setAmount] = useState<string>('1.5');
  const [step, setStep] = useState<SwapStep>(SwapStep.IDLE);
  const [encryptedData, setEncryptedData] = useState<string>('');
  const [decryptedResult, setDecryptedResult] = useState<string>('');
  
  // Wallet & Gas State
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [gasFee, setGasFee] = useState<string | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);

  const connectWallet = () => {
    // Simulate connection delay
    setTimeout(() => {
      setWalletConnected(true);
      setWalletAddress('0x71C...9A21');
    }, 500);
  };

  const estimateGas = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setIsEstimating(true);
    // Simulate API call to estimate gas
    setTimeout(() => {
      // FHE operations are gas heavy, simulating a realistic fee for Sepolia FHE
      setGasFee('0.0154 ETH');
      setIsEstimating(false);
    }, 1200);
  };

  const handleSwap = () => {
    if (step !== SwapStep.IDLE) return;
    if (!walletConnected) return;
    
    setStep(SwapStep.ENCRYPTING);
    
    // Simulation sequence
    setTimeout(() => {
      setEncryptedData('0x7f8a9...b3c1 (Encrypted Input)');
      setStep(SwapStep.SUBMITTING);
    }, 1500);

    setTimeout(() => {
      setStep(SwapStep.PROCESSING);
    }, 3000);

    setTimeout(() => {
      setStep(SwapStep.DECRYPTING);
    }, 5500);

    setTimeout(() => {
      // Mock calculation: 1 ETH = 3000 USDC
      const val = parseFloat(amount || '0') * 3000;
      setDecryptedResult(`${val.toLocaleString()} USDC`);
      setStep(SwapStep.COMPLETED);
    }, 7000);
  };

  const reset = () => {
    setStep(SwapStep.IDLE);
    setEncryptedData('');
    setDecryptedResult('');
    setGasFee(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-crypto-card border border-slate-700 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-fhe-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-crypto-accent rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

        {/* Header with Wallet & Network */}
        <div className="relative z-20 flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-slate-800 pb-6">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <EyeOff className="text-crypto-accent" size={28} />
              FHE Swap Simulator
            </h2>
            <p className="text-slate-400 text-sm">Sepolia Testnet Environment</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full bg-slate-800 border border-slate-600 flex items-center gap-2 text-xs font-mono text-slate-300">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Sepolia
            </div>
            
            {!walletConnected ? (
              <button 
                onClick={connectWallet}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-indigo-500/20 text-sm"
              >
                <Wallet size={16} />
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-slate-800 border border-indigo-500/50 text-indigo-100 px-4 py-2 rounded-lg font-mono text-sm">
                <Wallet size={16} className="text-indigo-400" />
                {walletAddress}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
          {/* Input Card */}
          <div className={`p-6 rounded-xl border-2 transition-all duration-500 ${step === SwapStep.ENCRYPTING ? 'border-crypto-accent shadow-[0_0_20px_rgba(139,92,246,0.5)]' : 'border-slate-700 bg-slate-800/50'}`}>
            <div className="flex justify-between mb-4">
              <span className="text-sm text-slate-400">You Pay</span>
              <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Public</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <input 
                type="number" 
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setGasFee(null); // Reset gas when amount changes
                }}
                disabled={step !== SwapStep.IDLE}
                className="w-full bg-transparent text-2xl font-mono text-white outline-none"
              />
              <span className="font-bold text-xl text-slate-300">ETH</span>
            </div>
            <div className="h-1 w-full bg-slate-700 rounded overflow-hidden">
              <div className={`h-full bg-crypto-accent transition-all duration-[1500ms] ${step !== SwapStep.IDLE ? 'w-full' : 'w-0'}`}></div>
            </div>
            
            {/* Gas Estimation Section */}
            <div className="mt-4 pt-4 border-t border-slate-700/50">
               <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-400 flex items-center gap-1">
                   <Fuel size={12} /> Gas Fee
                 </span>
                 {gasFee ? (
                   <span className="text-indigo-300 font-mono">{gasFee}</span>
                 ) : walletConnected ? (
                   <button 
                    onClick={estimateGas}
                    disabled={isEstimating || !amount}
                    className="text-fhe-400 hover:text-fhe-300 hover:underline flex items-center gap-1"
                   >
                     {isEstimating ? 'Estimating...' : 'Estimate'} <Zap size={10} />
                   </button>
                 ) : (
                   <span className="text-slate-600">--</span>
                 )}
               </div>
            </div>
          </div>

          {/* FHE Black Box */}
          <div className="flex flex-col items-center justify-center">
             <div className="relative">
               {step === SwapStep.PROCESSING && (
                 <div className="absolute inset-0 bg-crypto-accent blur-xl opacity-40 animate-pulse"></div>
               )}
               <div className="bg-black border border-slate-600 w-32 h-32 rounded-2xl flex flex-col items-center justify-center relative z-10">
                 {step === SwapStep.PROCESSING ? (
                   <RefreshCw className="text-crypto-accent animate-spin" size={40} />
                 ) : (
                   <ShieldCheck className={step === SwapStep.COMPLETED ? "text-green-400" : "text-slate-600"} size={40} />
                 )}
               </div>
             </div>
             <div className="mt-4 text-center h-16">
                <p className="text-sm font-mono text-crypto-accent">
                  {step === SwapStep.IDLE && (walletConnected ? "Ready to Swap" : "Connect Wallet")}
                  {step === SwapStep.ENCRYPTING && "Encrypting Inputs"}
                  {step === SwapStep.SUBMITTING && "Submitting to Chain"}
                  {step === SwapStep.PROCESSING && "Computing on Encrypted Data"}
                  {step === SwapStep.DECRYPTING && "Decrypting Result"}
                  {step === SwapStep.COMPLETED && "Swap Complete"}
                </p>
                {encryptedData && step !== SwapStep.COMPLETED && step !== SwapStep.DECRYPTING && (
                  <p className="text-[10px] text-slate-500 mt-1 font-mono break-all max-w-[200px]">{encryptedData}</p>
                )}
             </div>
          </div>

          {/* Output Card */}
          <div className={`p-6 rounded-xl border-2 transition-all duration-500 ${step === SwapStep.DECRYPTING || step === SwapStep.COMPLETED ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'border-slate-700 bg-slate-800/50'}`}>
            <div className="flex justify-between mb-4">
              <span className="text-sm text-slate-400">You Receive</span>
               <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Private</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-full text-2xl font-mono text-white min-h-[32px]">
                {step === SwapStep.COMPLETED ? decryptedResult : step === SwapStep.DECRYPTING ? 'Decrypting...' : '???'}
              </div>
            </div>
            {step === SwapStep.COMPLETED ? (
               <div className="flex items-center gap-2 text-green-400 text-sm">
                 <Unlock size={14} />
                 <span>Decrypted for you</span>
               </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                 <Lock size={14} />
                 <span>Encrypted output</span>
               </div>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          {step === SwapStep.IDLE ? (
             <button 
               onClick={handleSwap}
               disabled={!walletConnected}
               className={`font-bold py-3 px-8 rounded-full shadow-lg transform transition flex items-center gap-2 ${
                 walletConnected 
                   ? 'bg-crypto-accent hover:bg-violet-600 text-white hover:scale-105' 
                   : 'bg-slate-700 text-slate-500 cursor-not-allowed'
               }`}
             >
               {!walletConnected ? 'Connect Wallet to Swap' : 'Swap Privately'} 
               <ArrowRight size={20} />
             </button>
          ) : step === SwapStep.COMPLETED ? (
            <button 
               onClick={reset}
               className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 flex items-center gap-2"
             >
               Start Over <RefreshCw size={20} />
             </button>
          ) : (
            <button disabled className="bg-slate-700 text-slate-400 cursor-not-allowed font-bold py-3 px-8 rounded-full flex items-center gap-2">
              Processing...
            </button>
          )}

          {!gasFee && walletConnected && step === SwapStep.IDLE && (
            <p className="text-xs text-amber-500/80 animate-pulse">
              * Estimate gas fees before swapping for better accuracy
            </p>
          )}
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-700 text-center">
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            <strong>How it works:</strong> In a real FHE dApp on Sepolia, you would use a browser wallet (like MetaMask) to sign a transaction containing your encrypted inputs. The gas fee covers the computation on the FHE coprocessor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Simulator;