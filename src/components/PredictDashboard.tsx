import { useEffect, useState } from 'react';
import type { OracleState } from '../services/predictApi';
import * as predictApi from '../services/predictApi';
import MarketCard from './MarketCard';
import PredictionWidget from './PredictionWidget';
import TradeModal from './TradeModal';
import CreateMarketModal from './CreateMarketModal';

// Categories for the navigation bar
const CATEGORIES = ['crypto', 'politics', 'science', 'sports', 'education', 'weather'] as const;
type Category = (typeof CATEGORIES)[number];

// Demo markets with realistic prediction data
const DEMO_MARKETS = [
  {
    id: '1',
    title: 'Will Bitcoin reach $86,000 by July 2026?',
    category: 'crypto' as Category,
    yesPrice: 0.56,
    noPrice: 0.44,
    volume: 284500,
    liquidity: 125000,
    endDate: '2026-07-01',
    creator: '@insuight',
    isHot: true,
  },
  {
    id: '2',
    title: 'Will SUI reach $5 before August 2026?',
    category: 'crypto' as Category,
    yesPrice: 0.62,
    noPrice: 0.38,
    volume: 156200,
    liquidity: 89000,
    endDate: '2026-08-01',
    creator: '@insuight',
    isHot: false,
  },
  {
    id: '3',
    title: 'Will Ethereum dip below $2,500?',
    category: 'crypto' as Category,
    yesPrice: 0.23,
    noPrice: 0.77,
    volume: 312800,
    liquidity: 201000,
    endDate: '2026-09-15',
    creator: '@insuight',
    isHot: false,
  },
  {
    id: '4',
    title: 'Will the Fed cut rates before July?',
    category: 'politics' as Category,
    yesPrice: 0.28,
    noPrice: 0.72,
    volume: 89400,
    liquidity: 45000,
    endDate: '2026-07-01',
    creator: '@insuight',
    isHot: false,
  },
  {
    id: '5',
    title: 'Will DeepBook TVL surpass $100M?',
    category: 'crypto' as Category,
    yesPrice: 0.44,
    noPrice: 0.56,
    volume: 67300,
    liquidity: 32000,
    endDate: '2026-12-31',
    creator: '@insuight',
    isHot: false,
  },
  {
    id: '6',
    title: 'Will SOL flip ETH in daily DEX volume?',
    category: 'crypto' as Category,
    yesPrice: 0.33,
    noPrice: 0.67,
    volume: 198700,
    liquidity: 112000,
    endDate: '2026-10-01',
    creator: '@insuight',
    isHot: false,
  },
  {
    id: '7',
    title: 'Will a Category 5 hurricane hit the US in 2026?',
    category: 'weather' as Category,
    yesPrice: 0.41,
    noPrice: 0.59,
    volume: 42100,
    liquidity: 18000,
    endDate: '2026-11-30',
    creator: '@insuight',
    isHot: false,
  },
  {
    id: '8',
    title: 'Will GPT-5.6 be released by June 8, 2026?',
    category: 'science' as Category,
    yesPrice: 0.36,
    noPrice: 0.64,
    volume: 231500,
    liquidity: 98000,
    endDate: '2026-06-08',
    creator: '@insuight',
    isHot: false,
  },
];

function formatVolume(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

function daysLeft(endDate: string): string {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return 'Ended';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 30) return `${Math.floor(days / 30)}mo`;
  return `${days}d`;
}

export default function PredictDashboard() {
  const [oracles, setOracles] = useState<OracleState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [selectedMarket, setSelectedMarket] = useState<any | null>(null);
  const [isCreatingMarket, setIsCreatingMarket] = useState(false);

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

  const filteredMarkets = activeCategory === 'all'
    ? DEMO_MARKETS
    : DEMO_MARKETS.filter((m) => m.category === activeCategory);

  const hotMarket = DEMO_MARKETS.find((m) => m.isHot) || DEMO_MARKETS[0];

  return (
    <div className="predict-dashboard">

      {/* ── Header: INSUIGHT title ── */}
      <header className="predict-header" style={{ position: 'relative' }}>
        <h1 className="predict-title">INSUIGHT</h1>
        <button
          onClick={() => setIsCreatingMarket(true)}
          className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-sm font-semibold transition-colors"
        >
          + Create Market
        </button>
      </header>

      {/* ── Navigation Bar: Categories + Hot Topic ── */}
      <div className="predict-nav-row">
        <nav className="predict-categories">
          <button
            className={`predict-cat-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            all
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`predict-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>

        <div className="predict-hot-topic">
          <div className="predict-hot-badge">
            <span className="predict-hot-dot" />
            TRENDING
          </div>
          <p className="predict-hot-title">{hotMarket.title}</p>
          <div className="predict-hot-odds">
            <span className="predict-hot-yes">Yes {(hotMarket.yesPrice * 100).toFixed(0)}¢</span>
            <span className="predict-hot-divider">·</span>
            <span className="predict-hot-no">No {(hotMarket.noPrice * 100).toFixed(0)}¢</span>
          </div>
        </div>
      </div>

      {/* ── Featured AI Signal ── */}
      <section className="predict-featured">
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
          <span className="predict-grid-count">{filteredMarkets.length} markets</span>
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
          ) : oracles.length > 0 ? (
            oracles.map((oracle, i) => (
              <MarketCard key={oracle.oracle_id} oracle={oracle} index={i} />
            ))
          ) : (
            filteredMarkets.map((market, i) => (
              <div
                key={market.id}
                className="market-card"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Header: category + timer */}
                <div className="market-card__header">
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <span className={`market-card__category market-card__category--${market.category}`}>
                      {market.category}
                    </span>
                    {market.isHot && (
                      <span className="market-card__category" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
                        🔥 Hot
                      </span>
                    )}
                  </div>
                  <span className="market-card__timer">{daysLeft(market.endDate)}</span>
                </div>

                {/* Question */}
                <h3 className="market-card__question">{market.title}</h3>

                {/* Split probability bar */}
                <div className="market-card__prob-bar-container">
                  <div className="market-card__prob-bar">
                    <div
                      className="market-card__prob-fill market-card__prob-fill--yes"
                      style={{ width: `${market.yesPrice * 100}%` }}
                    />
                  </div>
                </div>
                <div className="market-card__prob-labels">
                  <span className="market-card__prob-yes">{(market.yesPrice * 100).toFixed(0)}% Yes</span>
                  <span className="market-card__prob-no">{(market.noPrice * 100).toFixed(0)}% No</span>
                </div>

                {/* Volume row */}
                <div className="market-card__volume-row">
                  <div className="market-card__vol-cell">
                    <p className="market-card__vol-label">Volume</p>
                    <p className="market-card__vol-value">{formatVolume(market.volume)}</p>
                  </div>
                  <div className="market-card__vol-cell">
                    <p className="market-card__vol-label">Liquidity</p>
                    <p className="market-card__vol-value">{formatVolume(market.liquidity)}</p>
                  </div>
                </div>

                {/* Yes / No Buttons */}
                <div className="market-card__actions">
                  <button
                    className="market-card__btn market-card__btn--yes"
                    onClick={(e) => { e.stopPropagation(); setSelectedMarket(market); }}
                  >
                    <span className="market-card__btn-label">Yes</span>
                    <span className="market-card__btn-price">{(market.yesPrice * 100).toFixed(0)}¢</span>
                  </button>
                  <button
                    className="market-card__btn market-card__btn--no"
                    onClick={(e) => { e.stopPropagation(); setSelectedMarket(market); }}
                  >
                    <span className="market-card__btn-label">No</span>
                    <span className="market-card__btn-price">{(market.noPrice * 100).toFixed(0)}¢</span>
                  </button>
                </div>

                {/* Footer */}
                <div className="market-card__footer">
                  <div className="market-card__stat">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                    <span>Total {formatVolume(market.volume + market.liquidity)}</span>
                  </div>
                  <div className="market-card__stat">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    <span>{Math.floor(Math.random() * 900 + 100)}</span>
                  </div>
                </div>
              </div>
            ))

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
