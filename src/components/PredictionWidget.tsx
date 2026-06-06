import { useState, useEffect } from 'react';
import { computeFinalSignal, DIRECTION_UP } from '../utils/predictionAlgorithm';

export default function PredictionWidget() {
  const [marketData, setMarketData] = useState({
    spotPrice: 68000,
    forwardPrice: 69000,
    sigmaBps: 4200,
    strikePrice: 68000,
    oracleImpliedBps: 5500,
  });

  const signal = computeFinalSignal(
    marketData.spotPrice,
    marketData.forwardPrice,
    marketData.sigmaBps,
    marketData.strikePrice,
    marketData.oracleImpliedBps,
    500
  );

  const isYes = signal.direction === DIRECTION_UP;
  const convictionPct = (signal.convictionBps / 100).toFixed(1);
  const momPct = (signal.momentumBps / 100).toFixed(1);
  const revPct = (signal.reversionBps / 100).toFixed(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData((prev) => ({
        ...prev,
        spotPrice: prev.spotPrice + (Math.random() * 60 - 30),
        forwardPrice: prev.forwardPrice + (Math.random() * 60 - 30),
        oracleImpliedBps: Math.min(9000, Math.max(1000, prev.oracleImpliedBps + (Math.random() * 120 - 60)))
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full group animate-fade-in-up">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-[24px] blur-xl group-hover:blur-2xl transition-all duration-700 opacity-60"></div>

      <div className="relative featured-widget bg-bg-card/80 backdrop-blur-md border border-border/50 shadow-sm shadow-indigo-500/5 hover:shadow-indigo-500/10 rounded-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between p-4 gap-6">

          {/* Left: Market Info */}
          <div className="flex-1 flex flex-col justify-center relative w-full">
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                AI Featured
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${signal.isActionable ? 'bg-green/10 text-green-500' : 'bg-amber/10 text-amber-500'}`}>
                {signal.isActionable ? 'Actionable' : 'Watching'}
              </span>
            </div>

            <h2 className="text-xl lg:text-2xl font-serif text-white tracking-tight mb-4">
              Will Bitcoin exceed $70,000?
            </h2>

            {/* Yes / No Outcome Cards */}
            <div className="flex gap-3">
              <button className={`flex-1 flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all duration-300 ${isYes ? 'bg-green/10 border-green/40 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-white">Yes</span>
                  {isYes && <span className="text-[9px] font-bold text-green-400 mt-0.5 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> AI PICK</span>}
                </div>
                <span className="text-xl font-bold font-mono text-white">{convictionPct}¢</span>
              </button>
              <button className={`flex-1 flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all duration-300 ${!isYes ? 'bg-red/10 border-red/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-white">No</span>
                  {!isYes && <span className="text-[9px] font-bold text-red-400 mt-0.5 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span> AI PICK</span>}
                </div>
                <span className="text-xl font-bold font-mono text-white">{(100 - parseFloat(convictionPct)).toFixed(1)}¢</span>
              </button>
            </div>
          </div>

          {/* Right: Signal & Data (Compact) */}
          <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
            <div className="bg-black/20 rounded-xl p-3 border border-white/5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Signal Strength</p>
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-300">Momentum</span>
                    <span className="text-xs font-mono font-bold text-indigo-400">{momPct}%</span>
                  </div>
                  <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${momPct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-300">Mean Reversion</span>
                    <span className="text-xs font-mono font-bold text-amber-400">{revPct}%</span>
                  </div>
                  <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${revPct}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between bg-black/20 rounded-xl p-3 border border-white/5">
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Spot Price</p>
                <p className="text-sm font-mono font-bold text-white">${marketData.spotPrice.toFixed(0)}</p>
              </div>
              <div className="w-px bg-white/10 mx-2"></div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Implied Vol</p>
                <p className="text-sm font-mono font-bold text-white">{(marketData.oracleImpliedBps / 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
