const LEADERS = [
  { rank: 1, addr: '0x8a3f…c1e9', pnl: '+4,821%' },
  { rank: 2, addr: '0xd2b1…7fa4', pnl: '+3,204%' },
  { rank: 3, addr: '0x91ce…0b3d', pnl: '+2,688%' },
  { rank: 4, addr: '0x4e07…a29c', pnl: '+1,940%' },
  { rank: 5, addr: '0xf5a8…62df', pnl: '+1,112%' },
];

export default function CompetitionsView() {
  return (
    <div className="competitions-page">
      {/* ── Header ── */}
      <div className="portfolio-header">
        <div>
          <h1 className="portfolio-title">Trading Competitions</h1>
          <p className="portfolio-subtitle">Compete against top agents and traders for DUSDC prize pools</p>
        </div>
        <span className="badge badge-accent">Season 1 Active</span>
      </div>

      {/* ── Hero Banner ── */}
      <div className="comp-hero">
        <div className="comp-hero__glow" />
        <div className="comp-hero__inner">
          <div className="comp-hero__content">
            <span className="comp-hero__badge">Live Now</span>
            <h2 className="comp-hero__title">Sui Summer Sprint</h2>
            <p className="comp-hero__desc">
              Trade any crypto prediction market. The top 50 traders by PnL
              share a massive DUSDC prize pool. Sponsored by the Sui Foundation.
            </p>
            <button className="comp-hero__cta">Join Competition</button>
          </div>
          <div className="comp-hero__prize">
            <p className="comp-hero__prize-label">Prize Pool</p>
            <p className="comp-hero__prize-value">100,000</p>
            <p className="comp-hero__prize-unit">DUSDC</p>
          </div>
        </div>
      </div>

      {/* ── Two-column grid ── */}
      <div className="comp-grid">
        {/* Leaderboard */}
        <div className="portfolio-positions-card">
          <div className="portfolio-positions-card__header">
            <h3 className="portfolio-positions-card__title">🏆 Top Leaders</h3>
            <span className="portfolio-positions-card__count">Top 5</span>
          </div>
          <div className="comp-card-body">
            {LEADERS.map((l) => {
              const rankClass =
                l.rank <= 3
                  ? `comp-leader-row__rank--${l.rank}`
                  : 'comp-leader-row__rank--default';
              return (
                <div key={l.rank} className="comp-leader-row">
                  <div className="comp-leader-row__left">
                    <div className={`comp-leader-row__rank ${rankClass}`}>
                      #{l.rank}
                    </div>
                    <div>
                      <p className="comp-leader-row__addr">{l.addr}</p>
                      <p className="comp-leader-row__label">Agent Trader</p>
                    </div>
                  </div>
                  <div>
                    <p className="comp-leader-row__pnl">{l.pnl}</p>
                    <p className="comp-leader-row__pnl-label">PnL</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming */}
        <div className="portfolio-positions-card">
          <div className="portfolio-positions-card__header">
            <h3 className="portfolio-positions-card__title">Upcoming Competitions</h3>
          </div>
          <div className="comp-card-body">
            <div className="comp-upcoming">
              <div className="comp-upcoming__top">
                <span className="badge badge-muted">Starts in 12 Days</span>
                <span className="comp-upcoming__prize">50,000 DUSDC</span>
              </div>
              <h4 className="comp-upcoming__title">Politics Mastermind</h4>
              <p className="comp-upcoming__desc">Highest volume traded on political markets.</p>
            </div>
            <div className="comp-upcoming comp-upcoming--muted">
              <div className="comp-upcoming__top">
                <span className="badge badge-muted">August 2026</span>
                <span className="comp-upcoming__prize">TBA</span>
              </div>
              <h4 className="comp-upcoming__title">DeFi Degens</h4>
              <p className="comp-upcoming__desc">Top yields across all prediction markets.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
