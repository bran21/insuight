export default function EarnView() {
  const metrics = [
    {
      label: 'Total Value Locked',
      value: '$12.4M',
      sub: <span className="portfolio-metric__hint">Across all pools</span>,
      icon: <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>$</span>,
      accent: 'indigo',
    },
    {
      label: 'Average APY',
      value: '14.2%',
      sub: <><span className="portfolio-metric__badge portfolio-metric__badge--up">↑ 2.1%</span> <span className="portfolio-metric__hint">7d avg</span></>,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-6"/></svg>
      ),
      accent: 'green',
      valueColor: 'var(--color-green)',
    },
    {
      label: 'Your Liquidity',
      value: '$0.00',
      sub: <span className="portfolio-metric__hint">0 active positions</span>,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
      ),
      accent: 'blue',
    },
  ];

  const pools = [
    { name: 'Will Bitcoin reach $86,000 by July 2026?', cat: 'Crypto', tvl: '$2.1M', vol: '$450K', apy: '18.5%' },
    { name: 'Will SUI reach $5 before August 2026?', cat: 'Crypto', tvl: '$1.4M', vol: '$820K', apy: '24.2%' },
    { name: 'Will the Fed cut rates before July?', cat: 'Politics', tvl: '$800K', vol: '$120K', apy: '12.1%' },
  ];

  return (
    <div className="earn-page">
      {/* ── Header ── */}
      <div className="portfolio-header">
        <div>
          <h1 className="portfolio-title">Liquidity Provider</h1>
          <p className="portfolio-subtitle">Add liquidity to markets to earn trading fee rebates and DUSDC rewards</p>
        </div>
      </div>

      {/* ── Metrics ── */}
      <div className="earn-metrics">
        {metrics.map((m, i) => (
          <div key={m.label} className={`portfolio-metric portfolio-metric--${m.accent}`} style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="portfolio-metric__top">
              <span className="portfolio-metric__label">{m.label}</span>
              <div className={`portfolio-metric__icon portfolio-metric__icon--${m.accent}`}>{m.icon}</div>
            </div>
            <h2 className="portfolio-metric__value" style={m.valueColor ? { color: m.valueColor } : undefined}>{m.value}</h2>
            <div className="portfolio-metric__sub">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Pools Table ── */}
      <div className="portfolio-positions-card">
        <div className="portfolio-positions-card__header">
          <h3 className="portfolio-positions-card__title">Top Liquidity Pools</h3>
          <div className="portfolio-chart-card__tabs">
            <button className="portfolio-chart-card__tab portfolio-chart-card__tab--active">All Pools</button>
            <button className="portfolio-chart-card__tab">My Positions</button>
          </div>
        </div>

        <div className="portfolio-positions-card__table-wrap">
          <table className="portfolio-table">
            <thead>
              <tr>
                <th className="portfolio-table__th portfolio-table__th--market">Market</th>
                <th className="portfolio-table__th portfolio-table__th--right">TVL</th>
                <th className="portfolio-table__th portfolio-table__th--right">24h Volume</th>
                <th className="portfolio-table__th portfolio-table__th--right">Est. APY</th>
                <th className="portfolio-table__th portfolio-table__th--right"></th>
              </tr>
            </thead>
            <tbody>
              {pools.map((pool, i) => (
                <tr key={i} className="portfolio-table__row">
                  <td className="portfolio-table__td portfolio-table__td--market">
                    <div className="portfolio-table__question">{pool.name}</div>
                    <div className="portfolio-table__category">{pool.cat} • Yes/No</div>
                  </td>
                  <td className="portfolio-table__td portfolio-table__td--right portfolio-table__td--mono">{pool.tvl}</td>
                  <td className="portfolio-table__td portfolio-table__td--right portfolio-table__td--mono portfolio-table__td--muted">{pool.vol}</td>
                  <td className="portfolio-table__td portfolio-table__td--right earn-apy">{pool.apy}</td>
                  <td className="portfolio-table__td portfolio-table__td--right">
                    <button className="portfolio-table__trade-btn">Add Liquidity</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
