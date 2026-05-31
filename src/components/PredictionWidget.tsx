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
    <div className="featured-widget animate-fade-in-up">
      <div className="featured-widget__inner">

        {/* Left: Market Info */}
        <div className="featured-widget__main">
          <div className="featured-widget__meta">
            <span className="featured-widget__label">Featured · AI Signal</span>
            <span className={`featured-widget__status ${signal.isActionable ? 'featured-widget__status--active' : 'featured-widget__status--watching'}`}>
              <span className="featured-widget__status-dot" />
              {signal.isActionable ? 'Actionable' : 'Watching'}
            </span>
          </div>

          <h2 className="featured-widget__question">
            Will Bitcoin exceed $70,000?
          </h2>

          {/* Yes / No Outcome Cards */}
          <div className="featured-widget__outcomes">
            <button className={`featured-widget__outcome ${isYes ? 'featured-widget__outcome--picked-yes' : ''}`}>
              {isYes && <span className="featured-widget__ai-tag">AI PICK</span>}
              <span className="featured-widget__outcome-label">Yes</span>
              <span className="featured-widget__outcome-price">{convictionPct}¢</span>
            </button>
            <button className={`featured-widget__outcome ${!isYes ? 'featured-widget__outcome--picked-no' : ''}`}>
              {!isYes && <span className="featured-widget__ai-tag featured-widget__ai-tag--no">AI PICK</span>}
              <span className="featured-widget__outcome-label">No</span>
              <span className="featured-widget__outcome-price">{(100 - parseFloat(convictionPct)).toFixed(1)}¢</span>
            </button>
          </div>
        </div>

        {/* Right: Signal Decomposition */}
        <div className="featured-widget__sidebar">
          <p className="featured-widget__sidebar-label">Signal Decomposition</p>

          <div className="featured-widget__signals">
            <div className="featured-widget__signal">
              <div className="featured-widget__signal-header">
                <span className="featured-widget__signal-name">Momentum (60%)</span>
                <span className="featured-widget__signal-value">{momPct}%</span>
              </div>
              <div className="featured-widget__signal-track">
                <div className="featured-widget__signal-fill featured-widget__signal-fill--momentum" style={{ width: `${momPct}%` }} />
              </div>
            </div>
            <div className="featured-widget__signal">
              <div className="featured-widget__signal-header">
                <span className="featured-widget__signal-name">Reversion (40%)</span>
                <span className="featured-widget__signal-value">{revPct}%</span>
              </div>
              <div className="featured-widget__signal-track">
                <div className="featured-widget__signal-fill featured-widget__signal-fill--reversion" style={{ width: `${revPct}%` }} />
              </div>
            </div>
          </div>

          {/* Oracle Data Grid */}
          <div className="featured-widget__oracle-grid">
            {[
              { label: 'Spot', value: `$${marketData.spotPrice.toFixed(0)}` },
              { label: 'Forward', value: `$${marketData.forwardPrice.toFixed(0)}` },
              { label: 'Vol (σ)', value: `${(marketData.sigmaBps / 100).toFixed(1)}%` },
              { label: 'Implied', value: `${(marketData.oracleImpliedBps / 100).toFixed(1)}%` },
            ].map((d, i) => (
              <div key={i} className="featured-widget__oracle-item">
                <span className="featured-widget__oracle-label">{d.label}</span>
                <span className="featured-widget__oracle-value">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
