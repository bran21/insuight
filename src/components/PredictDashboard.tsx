import { useEffect, useState } from 'react';
import type { OracleState } from '../services/predictApi';
import * as predictApi from '../services/predictApi';
import MarketCard from './MarketCard';

import TradeModal from './TradeModal';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { ADMIN_ADDRESS } from '../constants';
import CreateMarketModal from './CreateMarketModal';
import { useCustomMarkets } from '../hooks/useCustomMarkets';

// Mock prediction market questions for on-chain oracles without names
const MOCK_MARKETS: { name: string; category: string }[] = [
  { name: 'Will Bitcoin reach $100,000 by end of 2026?', category: 'crypto' },
  { name: 'Will Ethereum surpass $5,000 before Q3 2026?', category: 'crypto' },
  { name: 'Will SUI reach $10 by December 2026?', category: 'crypto' },
  { name: 'Will the Fed cut interest rates before June 2026?', category: 'politics' },
  { name: 'Will SpaceX Starship complete an orbital flight in 2026?', category: 'tech' },
  { name: 'Will Apple release AR glasses in 2026?', category: 'tech' },
  { name: 'Will GPT-7 be released before March 2027?', category: 'tech' },
  { name: 'Will Bitcoin reach $150,000 by end of 2025?', category: 'crypto' },
  { name: 'Will the US enter a recession in 2026?', category: 'economy' },
  { name: 'Will Solana flip Ethereum in market cap?', category: 'crypto' },
  { name: 'Will there be a new COVID variant of concern in 2026?', category: 'science' },
  { name: 'Will the S&P 500 hit a new all-time high in Q3 2026?', category: 'economy' },
  { name: 'Will Tesla release a sub-$25,000 EV in 2026?', category: 'tech' },
  { name: 'Will a major country adopt Bitcoin as legal tender in 2026?', category: 'politics' },
  { name: 'Will the 2026 FIFA World Cup break viewership records?', category: 'sports' },
  { name: 'Will OpenAI reach $100B valuation by mid-2026?', category: 'tech' },
  { name: 'Will gold reach $3,000/oz in 2026?', category: 'economy' },
  { name: 'Will NVIDIA remain the top chipmaker by revenue?', category: 'tech' },
  { name: 'Will Dogecoin reach $1 by end of 2026?', category: 'crypto' },
  { name: 'Will the next iPhone include a foldable display?', category: 'tech' },
];

/** Deterministic hash from oracle ID to pick a mock market */
function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Enrich oracles that lack a human-readable name */
function enrichOracles(oracles: OracleState[]): OracleState[] {
  return oracles.map((o, idx) => {
    if (o.name && !o.name.startsWith('Market 0x') && !o.name.startsWith('Custom Market')) {
      return o;
    }
    const mock = MOCK_MARKETS[(hashId(o.oracle_id) + idx) % MOCK_MARKETS.length];
    return {
      ...o,
      name: mock.name,
      category: o.category || mock.category,
    };
  });
}

export default function PredictDashboard() {
  const [oracles, setOracles] = useState<OracleState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState<any | null>(null);
  const [isCreatingMarket, setIsCreatingMarket] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const account = useCurrentAccount();
  const isAdmin = account?.address === ADMIN_ADDRESS;
  const { customMarkets, isLoadingCustomMarkets } = useCustomMarkets();

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

  const allMarkets = [...enrichOracles(customMarkets), ...enrichOracles(oracles)];

  const now = Date.now();
  const closingSoonMarkets = [...allMarkets]
    .filter(o => (o.expiry || 0) > now)
    .sort((a, b) => (a.expiry || Infinity) - (b.expiry || Infinity));
    
  const freshMarkets = [...allMarkets].reverse();
  
  const hotTopicMarkets = [...allMarkets].filter(o => 
    o.category?.toLowerCase() === 'crypto' || o.category?.toLowerCase() === 'politics' || o.category?.toLowerCase() === 'trending'
  );
  if (hotTopicMarkets.length === 0) {
    hotTopicMarkets.push(...allMarkets.slice(0, 5));
  }

  const filteredOracles = allMarkets.filter(o => {
    const matchesSearch = (o.name || o.oracle_id).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || 
                            activeCategory === 'trending' || 
                            activeCategory === 'new' || 
                            activeCategory === 'breakouts' ||
                            (o.category && o.category.toLowerCase() === activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

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

      {/* ── Top Control Bar (Polymarket-style) ── */}
      <div className="market-control-bar animate-fade-in-up">
        {/* Row 1: Active tab + Search + Admin */}
        <div className="market-control-bar__top">
          <button
            className={`market-control-bar__active-tab ${
              activeCategory === 'all' || activeCategory === 'trending' ? 'market-control-bar__active-tab--on' : ''
            }`}
            onClick={() => setActiveCategory('all')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            Top
          </button>

          <div className="market-control-bar__search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="market-control-bar__search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search by markets"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="market-control-bar__search-input"
            />
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsCreatingMarket(true)}
              className="market-control-bar__create-btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create Market
            </button>
          )}
        </div>

        {/* Row 2: Scrollable category tags */}
        <div className="market-control-bar__tags">
          {DISPLAY_CATEGORIES.filter(c => c.id !== 'trending').map((cat) => (
            <button
              key={cat.id}
              className={`market-control-bar__tag ${activeCategory === cat.id ? 'market-control-bar__tag--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>


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

      {/* ── Markets Content ── */}
      {activeCategory === 'all' && !searchQuery ? (
        <div className="predict-carousels">
          {/* Closing Soon */}
          {closingSoonMarkets.length > 0 && (
            <section className="predict-carousel-section">
              <div className="predict-carousel-header">
                <h2 className="predict-carousel-title">⏳ Closing Soon</h2>
              </div>
              <div className="predict-carousel-track-wrapper">
                <div className="predict-carousel-track">
                  {closingSoonMarkets.slice(0, 10).map((oracle, i) => (
                    <div className="predict-carousel-item" key={`closing-${oracle.oracle_id}`}>
                      <MarketCard oracle={oracle} index={i} onClick={() => handleMarketSelect(oracle)} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Fresh Markets */}
          {freshMarkets.length > 0 && (
            <section className="predict-carousel-section">
              <div className="predict-carousel-header">
                <h2 className="predict-carousel-title">✨ Fresh</h2>
              </div>
              <div className="predict-carousel-track-wrapper">
                <div className="predict-carousel-track">
                  {freshMarkets.slice(0, 10).map((oracle, i) => (
                    <div className="predict-carousel-item" key={`fresh-${oracle.oracle_id}`}>
                      <MarketCard oracle={oracle} index={i} onClick={() => handleMarketSelect(oracle)} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Hot Topics */}
          {hotTopicMarkets.length > 0 && (
            <section className="predict-carousel-section">
              <div className="predict-carousel-header">
                <h2 className="predict-carousel-title">🔥 Hot Topic</h2>
              </div>
              <div className="predict-carousel-track-wrapper">
                <div className="predict-carousel-track">
                  {hotTopicMarkets.slice(0, 10).map((oracle, i) => (
                    <div className="predict-carousel-item" key={`hot-${oracle.oracle_id}`}>
                      <MarketCard oracle={oracle} index={i} onClick={() => handleMarketSelect(oracle)} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      ) : (
        <section className="predict-grid-section">
          <div className="predict-grid-header">
            <h2 className="predict-grid-title">Prediction Markets</h2>
            <span className="predict-grid-count">{filteredOracles.length} markets</span>
          </div>

          <div className="predict-grid">
            {loading && customMarkets.length === 0 && oracles.length === 0 ? (
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
      )}

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
