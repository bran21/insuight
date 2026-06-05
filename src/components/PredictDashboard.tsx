import { useEffect, useState } from 'react';
import type { OracleState } from '../services/predictApi';
import * as predictApi from '../services/predictApi';
import MarketCard from './MarketCard';
import PredictionWidget from './PredictionWidget';
import TradeModal from './TradeModal';
import CreateMarketModal from './CreateMarketModal';

export default function PredictDashboard() {
  const [oracles, setOracles] = useState<OracleState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState<any | null>(null);
  const [isCreatingMarket, setIsCreatingMarket] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [oracleData] = await Promise.allSettled([
          predictApi.getOracles(),
          predictApi.getVaultSummary(),
        ]);
        if (oracleData.status === 'fulfilled') setOracles(oracleData.value);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleMarketSelect = (oracle: OracleState) => {
    const impliedProb = oracle.spot && oracle.forward
      ? Math.min(0.95, Math.max(0.05, 0.5 + (oracle.forward - oracle.spot) / oracle.spot))
      : 0.5;
    const yesPrice = Math.round(impliedProb * 100);
    const noPrice = 100 - yesPrice;
    
    setSelectedMarket({
      id: oracle.oracle_id,
      title: oracle.name || `Market ${oracle.oracle_id.slice(0, 10)}...`,
      yesPrice,
      noPrice
    });
  };

  const filteredOracles = oracles.filter(o => 
    (o.name || o.oracle_id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const DISPLAY_CATEGORIES = [
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'breakouts', label: 'Breakouts', icon: '🚀' },
    { id: 'new', label: 'New', icon: '✨' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'politics', label: 'Politics' },
    { id: 'sports', label: 'Sports' },
    { id: 'tech', label: 'Tech' },
    { id: 'economy', label: 'Economy' },
    { id: 'culture', label: 'Culture' },
  ];

  return (
    <div className="predict-dashboard">

      {/* ── Header Row ── */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8 mt-2 animate-fade-in-up">
        
        {/* Left: Title & Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full lg:w-auto scrollbar-hide">
          <div className="flex items-center gap-2">
            {DISPLAY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                  activeCategory === cat.id || (activeCategory === 'all' && cat.id === 'trending')
                    ? 'bg-white text-black border-white' 
                    : 'bg-[#1a1a1a] text-gray-400 border-white/5 hover:bg-[#252525] hover:text-white'
                }`}
                onClick={() => setActiveCategory(cat.id as any)}
              >
                {cat.icon && <span>{cat.icon}</span>}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Search */}
        <div className="flex items-center w-full lg:w-auto lg:min-w-[280px]">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search markets or profiles" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ── Featured AI Signal ── */}
      <section className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <PredictionWidget />
      </section>


      {/* ── Error ── */}
      {error && (
        <div className="predict-error">
          <span>⚠</span>
          <div>
            <p className="predict-error-msg">{error}</p>
            <p className="predict-error-hint">Server may be unavailable. Showing demo markets.</p>
          </div>
        </div>
      )}

      {/* ── Markets Grid ── */}
      <section className="predict-grid-section">
        <div className="predict-grid-header">
          <h2 className="predict-grid-title">Prediction Markets</h2>
          <span className="predict-grid-count">{filteredOracles.length} markets</span>
        </div>

        <div className="predict-grid">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="market-card market-card--skeleton">
                <div className="market-card__skeleton-line w-4/5" />
                <div className="market-card__skeleton-line w-2/5" />
                <div className="market-card__skeleton-bar" />
                <div className="market-card__skeleton-bar" />
              </div>
            ))
          ) : filteredOracles.length > 0 ? (
            filteredOracles.map((oracle, i) => (
              <MarketCard 
                key={oracle.oracle_id} 
                oracle={oracle} 
                index={i} 
                onClick={() => handleMarketSelect(oracle)}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500">
               No markets found.
            </div>
          )}
        </div>
      </section>

      {/* ── Modals ── */}
      {selectedMarket && (
        <TradeModal
          market={selectedMarket}
          onClose={() => setSelectedMarket(null)}
        />
      )}

      {isCreatingMarket && (
        <CreateMarketModal
          onClose={() => setIsCreatingMarket(false)}
        />
      )}
    </div>
  );
}
