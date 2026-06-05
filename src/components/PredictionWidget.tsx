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

      <div className="relative featured-widget bg-bg-card/80 backdrop-blur-md border border-border/50 shadow-sm shadow-indigo-500/5 hover:shadow-indigo-500/10 rounded-[24px]">
        <div className="featured-widget__inner">

          {/* Left: Market Info */}
          <div className="featured-widget__main relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="featured-widget__meta mb-6 relative z-10">
              <span className="featured-widget__label flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                AI Featured Market
              </span>
              <span className={`featured-widget__status ${signal.isActionable ? 'featured-widget__status--active bg-green/10 text-green-600' : 'featured-widget__status--watching bg-amber/10 text-amber-600'}`}>
                <span className="featured-widget__status-dot" />
                {signal.isActionable ? 'Actionable' : 'Watching'}
              </span>
            </div>

            <h2 className="featured-widget__question text-2xl lg:text-3xl font-serif text-text-primary tracking-tight mb-8 relative z-10">
              Will Bitcoin exceed $70,000?
            </h2>

            {/* Yes / No Outcome Cards */}
            <div className="featured-widget__outcomes relative z-10 gap-4">
              <button className={`featured-widget__outcome transition-all duration-300 ${isYes ? 'featured-widget__outcome--picked-yes bg-green/5 border-green/30 scale-[1.02] shadow-[0_4px_20px_rgba(34,197,94,0.15)]' : 'border-border/60 hover:bg-black/5 opacity-70 hover:opacity-100'}`}>
                {isYes && <span className="featured-widget__ai-tag flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse"></span> AI PICK</span>}
                <span className="featured-widget__outcome-label">Yes</span>
                <span className="featured-widget__outcome-price text-3xl">{convictionPct}¢</span>
              </button>
              <button className={`featured-widget__outcome transition-all duration-300 ${!isYes ? 'featured-widget__outcome--picked-no bg-red/5 border-red/30 scale-[1.02] shadow-[0_4px_20px_rgba(239,68,68,0.15)]' : 'border-border/60 hover:bg-black/5 opacity-70 hover:opacity-100'}`}>
                {!isYes && <span className="featured-widget__ai-tag featured-widget__ai-tag--no flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse"></span> AI PICK</span>}
                <span className="featured-widget__outcome-label">No</span>
                <span className="featured-widget__outcome-price text-3xl">{(100 - parseFloat(convictionPct)).toFixed(1)}¢</span>
              </button>
            </div>
          </div>

          {/* Right: Signal Decomposition */}
          <div className="featured-widget__sidebar bg-black/5 border-l border-border/50 backdrop-blur-md">
            <p className="featured-widget__sidebar-label text-text-primary/70">Signal Breakdown</p>

            <div className="featured-widget__signals space-y-5">
              <div className="featured-widget__signal">
                <div className="featured-widget__signal-header mb-1.5">
                  <span className="featured-widget__signal-name text-xs font-semibold">Momentum Engine</span>
                  <span className="featured-widget__signal-value font-mono text-xs font-bold text-indigo-600">{momPct}%</span>
                </div>
                <div className="featured-widget__signal-track h-2 bg-black/5 rounded-full overflow-hidden">
                  <div className="featured-widget__signal-fill bg-indigo-500 rounded-full transition-all duration-1000 ease-out h-full" style={{ width: `${momPct}%` }} />
                </div>
              </div>
              <div className="featured-widget__signal">
                <div className="featured-widget__signal-header mb-1.5">
                  <span className="featured-widget__signal-name text-xs font-semibold">Mean Reversion</span>
                  <span className="featured-widget__signal-value font-mono text-xs font-bold text-amber-600">{revPct}%</span>
                </div>
                <div className="featured-widget__signal-track h-2 bg-black/5 rounded-full overflow-hidden">
                  <div className="featured-widget__signal-fill bg-amber-500 rounded-full transition-all duration-1000 ease-out h-full" style={{ width: `${revPct}%` }} />
                </div>
              </div>
            </div>

            {/* Oracle Data Grid */}
            <div className="featured-widget__oracle-grid mt-8 grid grid-cols-2 gap-3">
              {[
                { label: 'Spot Price', value: `$${marketData.spotPrice.toFixed(0)}` },
                { label: 'Forward Px', value: `$${marketData.forwardPrice.toFixed(0)}` },
                { label: 'Volatility', value: `${(marketData.sigmaBps / 100).toFixed(1)}%` },
                { label: 'Implied Vol', value: `${(marketData.oracleImpliedBps / 100).toFixed(1)}%` },
              ].map((d, i) => (
                <div key={i} className="featured-widget__oracle-item p-3 bg-bg-card rounded-xl border border-border/50 shadow-sm flex flex-col justify-center">
                  <span className="featured-widget__oracle-label text-[9px] uppercase tracking-wider text-text-muted mb-1">{d.label}</span>
                  <span className="featured-widget__oracle-value font-mono text-xs font-bold text-text-primary">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
