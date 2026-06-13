const TRADERS = [
  { rank: 1, addr: '0x8a3f…c1e9', name: 'CryptoWhale', volume: '$1.24M', roi: '+4,821%', pnl: '+$62,340', winRate: '78%', trades: 412 },
  { rank: 2, addr: '0xd2b1…7fa4', name: 'SuiMaxi', volume: '$890K', roi: '+3,204%', pnl: '+$28,516', winRate: '72%', trades: 287 },
  { rank: 3, addr: '0x91ce…0b3d', name: 'DegenAlpha', volume: '$742K', roi: '+2,688%', pnl: '+$19,950', winRate: '69%', trades: 356 },
  { rank: 4, addr: '0x4e07…a29c', name: 'PredictBot', volume: '$620K', roi: '+1,940%', pnl: '+$12,028', winRate: '66%', trades: 198 },
  { rank: 5, addr: '0xf5a8…62df', name: 'OracleHunter', volume: '$518K', roi: '+1,112%', pnl: '+$5,760', winRate: '64%', trades: 175 },
  { rank: 6, addr: '0xc3e9…41ab', name: 'MoonShot', volume: '$445K', roi: '+984%', pnl: '+$4,378', winRate: '61%', trades: 142 },
  { rank: 7, addr: '0x72fd…b8c0', name: 'SharpTrader', volume: '$392K', roi: '+876%', pnl: '+$3,435', winRate: '59%', trades: 231 },
  { rank: 8, addr: '0xab12…d5e3', name: 'VaultRunner', volume: '$310K', roi: '+721%', pnl: '+$2,236', winRate: '57%', trades: 164 },
  { rank: 9, addr: '0x5f4d…9a17', name: 'EdgeFinder', volume: '$268K', roi: '+634%', pnl: '+$1,699', winRate: '55%', trades: 119 },
  { rank: 10, addr: '0xe8c1…3f72', name: 'BullishBets', volume: '$215K', roi: '+520%', pnl: '+$1,118', winRate: '53%', trades: 98 },
];

export default function LeaderboardView() {
  const metrics = [
    {
      label: 'Total Traders',
      value: '47,736',
      sub: <><span className="portfolio-metric__badge portfolio-metric__badge--up">↑ 12%</span> <span className="portfolio-metric__hint">this week</span></>,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      ),
      accent: 'indigo',
    },
    {
      label: 'Platform Volume',
      value: '$248.3M',
      sub: <><span className="portfolio-metric__badge portfolio-metric__badge--up">↑ 18.6%</span> <span className="portfolio-metric__hint">30d</span></>,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-6"/></svg>
      ),
      accent: 'green',
    },
    {
      label: 'Avg. ROI (Top 50)',
      value: '+1,240%',
      sub: <span className="portfolio-metric__hint">All-time average</span>,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
      ),
      accent: 'amber',
      valueColor: 'var(--color-green)',
    },
    {
      label: 'Top Win Rate',
      value: '78%',
      sub: <span className="portfolio-metric__hint">CryptoWhale #1</span>,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
      ),
      accent: 'blue',
    },
  ];

  return (
    <div className="leaderboard-page">
      {/* ── Header ── */}
      <div className="portfolio-header">
        <div>
          <h1 className="portfolio-title">Leaderboard</h1>
          <p className="portfolio-subtitle">Top performers ranked by ROI and trading volume</p>
        </div>
        <div className="portfolio-chart-card__tabs">
          <button className="portfolio-chart-card__tab portfolio-chart-card__tab--active">All Time</button>
          <button className="portfolio-chart-card__tab">30 Days</button>
          <button className="portfolio-chart-card__tab">7 Days</button>
        </div>
      </div>

      {/* ── Metrics ── */}
      <div className="portfolio-metrics">
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

      {/* ── Leaderboard Table ── */}
      <div className="portfolio-positions-card">
        <div className="portfolio-positions-card__header">
          <h3 className="portfolio-positions-card__title">Top Traders</h3>
          <span className="portfolio-positions-card__count">{TRADERS.length} traders</span>
        </div>

        <div className="portfolio-positions-card__table-wrap">
          <table className="portfolio-table">
            <thead>
              <tr>
                <th className="portfolio-table__th lb-th--rank">Rank</th>
                <th className="portfolio-table__th portfolio-table__th--market">Trader</th>
                <th className="portfolio-table__th portfolio-table__th--right">Volume</th>
                <th className="portfolio-table__th portfolio-table__th--right">ROI</th>
                <th className="portfolio-table__th portfolio-table__th--right">PnL</th>
                <th className="portfolio-table__th portfolio-table__th--right">Win Rate</th>
                <th className="portfolio-table__th portfolio-table__th--right">Trades</th>
              </tr>
            </thead>
            <tbody>
              {TRADERS.map((t) => {
                const rankClass =
                  t.rank === 1 ? 'lb-rank--gold' :
                  t.rank === 2 ? 'lb-rank--silver' :
                  t.rank === 3 ? 'lb-rank--bronze' : 'lb-rank--default';

                return (
                  <tr key={t.rank} className="portfolio-table__row">
                    <td className="portfolio-table__td lb-td--rank">
                      <div className={`lb-rank ${rankClass}`}>
                        {t.rank <= 3 ? ['🥇', '🥈', '🥉'][t.rank - 1] : `#${t.rank}`}
                      </div>
                    </td>
                    <td className="portfolio-table__td portfolio-table__td--market">
                      <div className="lb-trader">
                        <div className="lb-trader__avatar">{t.name.charAt(0)}</div>
                        <div>
                          <div className="lb-trader__name">{t.name}</div>
                          <div className="lb-trader__addr">{t.addr}</div>
                        </div>
                      </div>
                    </td>
                    <td className="portfolio-table__td portfolio-table__td--right portfolio-table__td--mono">{t.volume}</td>
                    <td className="portfolio-table__td portfolio-table__td--right lb-roi">{t.roi}</td>
                    <td className="portfolio-table__td portfolio-table__td--right portfolio-table__td--mono lb-pnl">{t.pnl}</td>
                    <td className="portfolio-table__td portfolio-table__td--right">
                      <div className="lb-winrate">
                        <div className="lb-winrate__bar">
                          <div className="lb-winrate__fill" style={{ width: t.winRate }} />
                        </div>
                        <span className="lb-winrate__label">{t.winRate}</span>
                      </div>
                    </td>
                    <td className="portfolio-table__td portfolio-table__td--right portfolio-table__td--mono portfolio-table__td--muted">{t.trades}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
