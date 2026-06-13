import { useCurrentAccount } from '@mysten/dapp-kit';

export default function PortfolioView() {
  const account = useCurrentAccount();

  // Demo positions: prediction market holdings
  const holdings = [
    {
      id: '1',
      question: 'Will Bitcoin reach $86,000 by July 2026?',
      category: 'Crypto',
      position: 'YES' as const,
      shares: 120,
      avgCost: 0.52,
      currentPrice: 0.56,
      potentialPayout: 120,
      invested: 62.40,
      currentValue: 67.20,
      status: 'active' as const,
      endDate: '2026-07-01',
    },
    {
      id: '2',
      question: 'Will SUI reach $5 before August 2026?',
      category: 'Crypto',
      position: 'YES' as const,
      shares: 80,
      avgCost: 0.58,
      currentPrice: 0.62,
      potentialPayout: 80,
      invested: 46.40,
      currentValue: 49.60,
      status: 'active' as const,
      endDate: '2026-08-01',
    },
    {
      id: '3',
      question: 'Will the Fed cut rates before July?',
      category: 'Politics',
      position: 'NO' as const,
      shares: 200,
      avgCost: 0.68,
      currentPrice: 0.72,
      potentialPayout: 200,
      invested: 136.00,
      currentValue: 144.00,
      status: 'active' as const,
      endDate: '2026-07-01',
    },
    {
      id: '4',
      question: 'Will Ethereum dip below $2,500?',
      category: 'Crypto',
      position: 'NO' as const,
      shares: 150,
      avgCost: 0.74,
      currentPrice: 0.77,
      potentialPayout: 150,
      invested: 111.00,
      currentValue: 115.50,
      status: 'active' as const,
      endDate: '2026-09-15',
    },
    {
      id: '5',
      question: 'Will GPT-5.6 be released by June 8, 2026?',
      category: 'Science',
      position: 'YES' as const,
      shares: 50,
      avgCost: 0.40,
      currentPrice: 0.36,
      potentialPayout: 50,
      invested: 20.00,
      currentValue: 18.00,
      status: 'active' as const,
      endDate: '2026-06-08',
    },
    {
      id: '6',
      question: 'Will a Category 5 hurricane hit the US in 2026?',
      category: 'Weather',
      position: 'YES' as const,
      shares: 60,
      avgCost: 0.35,
      currentPrice: 0.41,
      potentialPayout: 60,
      invested: 21.00,
      currentValue: 24.60,
      status: 'settled' as const,
      endDate: '2026-05-15',
    },
  ];

  const totalInvested = holdings.reduce((sum, h) => sum + h.invested, 0);
  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalPnL = totalValue - totalInvested;
  const activeCount = holdings.filter(h => h.status === 'active').length;
  const pnlPercent = ((totalPnL / totalInvested) * 100).toFixed(1);

  const metrics = [
    {
      label: 'Portfolio Value',
      value: `$${totalValue.toFixed(0)}`,
      sub: <><span className="portfolio-metric__badge portfolio-metric__badge--up">↑ {pnlPercent}%</span> <span className="portfolio-metric__hint">all time</span></>,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
      ),
      accent: 'indigo',
    },
    {
      label: 'Total P&L',
      value: `${totalPnL >= 0 ? '+' : ''}$${totalPnL.toFixed(2)}`,
      sub: <span className="portfolio-metric__hint" style={{ color: 'var(--color-green)' }}>Realized + Unrealized</span>,
      icon: <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>$</span>,
      accent: 'green',
      valueColor: totalPnL >= 0 ? 'var(--color-green)' : 'var(--color-red)',
    },
    {
      label: 'Open Positions',
      value: `${activeCount}`,
      sub: <span className="portfolio-metric__hint">Across 3 categories</span>,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
      ),
      accent: 'blue',
    },
    {
      label: 'Win Rate',
      value: '60.2%',
      sub: <span className="portfolio-metric__hint">Based on resolved markets</span>,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      ),
      accent: 'amber',
    },
  ];

  return (
    <div className="portfolio-page">
      {/* Header */}
      <div className="portfolio-header">
        <div>
          <h1 className="portfolio-title">Portfolio</h1>
          <p className="portfolio-subtitle">Your open positions and performance</p>
        </div>
        <button className="portfolio-add-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14m-7-7h14"/></svg>
          Add Position
        </button>
      </div>

      {/* Metric Cards */}
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

      {/* Chart */}
      <div className="portfolio-chart-card">
        <div className="portfolio-chart-card__header">
          <h3 className="portfolio-chart-card__title">Portfolio Value Over Time</h3>
          <div className="portfolio-chart-card__tabs">
            {['1W', '1M', '3M', 'All'].map(t => (
              <button key={t} className={`portfolio-chart-card__tab${t === '1M' ? ' portfolio-chart-card__tab--active' : ''}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="portfolio-chart-card__body">
          {/* Y-axis labels */}
          <div className="portfolio-chart-card__yaxis">
            <span>100¢</span><span>75¢</span><span>50¢</span><span>25¢</span>
          </div>
          {/* Chart area */}
          <div className="portfolio-chart-card__canvas">
            <svg preserveAspectRatio="none" className="portfolio-chart-card__svg" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Subtle horizontal grid lines */}
              <line x1="0" y1="50" x2="800" y2="50" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
              <line x1="0" y1="100" x2="800" y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
              <line x1="0" y1="150" x2="800" y2="150" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
              {/* Green line (portfolio) */}
              <path d="M0 120 C 50 115, 100 110, 150 105 C 200 100, 250 95, 300 90 C 350 88, 400 85, 450 82 C 500 78, 550 80, 600 75 C 650 70, 700 65, 750 60 C 775 58, 800 55, 800 55" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M0 120 C 50 115, 100 110, 150 105 C 200 100, 250 95, 300 90 C 350 88, 400 85, 450 82 C 500 78, 550 80, 600 75 C 650 70, 700 65, 750 60 C 775 58, 800 55, 800 55 L 800 200 L 0 200 Z" fill="url(#portfolio_grad_green)" fillOpacity="1"/>
              {/* Red line (benchmark) */}
              <path d="M0 140 C 80 145, 160 150, 240 148 C 320 146, 400 142, 480 144 C 560 146, 640 140, 720 138 C 760 137, 800 135, 800 135" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" opacity="0.6"/>
              <defs>
                <linearGradient id="portfolio_grad_green" x1="400" y1="0" x2="400" y2="200" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#22c55e" stopOpacity="0.15"/>
                  <stop offset="1" stopColor="#22c55e" stopOpacity="0"/>
                </linearGradient>
              </defs>
            </svg>
            {/* X-axis dates */}
            <div className="portfolio-chart-card__xaxis">
              {['Feb 16', 'Feb 18', 'Feb 20', 'Feb 22', 'Feb 24', 'Feb 26', 'Feb 28', 'Mar 1', 'Mar 2', 'Mar 3', 'Mar 4', 'Mar 5', 'Mar 6', 'Mar 7', 'Mar 8', 'Mar 9', 'Mar 11', 'Mar 15', 'Mar 17'].filter((_, i) => i % 3 === 0).map(d => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="portfolio-positions-card">
        <div className="portfolio-positions-card__header">
          <h3 className="portfolio-positions-card__title">Open Positions</h3>
          <span className="portfolio-positions-card__count">{holdings.length} positions</span>
        </div>
        <div className="portfolio-positions-card__table-wrap">
          <table className="portfolio-table">
            <thead>
              <tr>
                <th className="portfolio-table__th portfolio-table__th--market">Market</th>
                <th className="portfolio-table__th portfolio-table__th--center">Side</th>
                <th className="portfolio-table__th portfolio-table__th--right">Shares</th>
                <th className="portfolio-table__th portfolio-table__th--right">Avg</th>
                <th className="portfolio-table__th portfolio-table__th--right">Current</th>
                <th className="portfolio-table__th portfolio-table__th--right">Value</th>
                <th className="portfolio-table__th portfolio-table__th--right">P&L</th>
                <th className="portfolio-table__th portfolio-table__th--right"></th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => {
                const pnl = h.currentValue - h.invested;
                const pnlPct = (pnl / h.invested) * 100;
                const isUp = pnl >= 0;

                return (
                  <tr key={h.id} className="portfolio-table__row">
                    <td className="portfolio-table__td portfolio-table__td--market">
                      <div className="portfolio-table__question">{h.question}</div>
                      <div className="portfolio-table__category">{h.category}</div>
                    </td>
                    <td className="portfolio-table__td portfolio-table__td--center">
                      <span className={`portfolio-table__side portfolio-table__side--${h.position.toLowerCase()}`}>
                        {h.position}
                      </span>
                    </td>
                    <td className="portfolio-table__td portfolio-table__td--right portfolio-table__td--mono">{h.shares}</td>
                    <td className="portfolio-table__td portfolio-table__td--right portfolio-table__td--mono portfolio-table__td--muted">{h.avgCost.toFixed(2)}¢</td>
                    <td className="portfolio-table__td portfolio-table__td--right portfolio-table__td--mono">{h.currentPrice.toFixed(2)}¢</td>
                    <td className="portfolio-table__td portfolio-table__td--right">
                      <div className="portfolio-table__td--mono portfolio-table__td--bold">${h.currentValue.toFixed(2)}</div>
                    </td>
                    <td className="portfolio-table__td portfolio-table__td--right">
                      <div className={`portfolio-table__pnl ${isUp ? 'portfolio-table__pnl--up' : 'portfolio-table__pnl--down'}`}>
                        {isUp ? '+' : ''}${pnl.toFixed(2)}
                      </div>
                      <div className={`portfolio-table__pnl-pct ${isUp ? 'portfolio-table__pnl--up' : 'portfolio-table__pnl--down'}`}>
                        {isUp ? '+' : ''}{pnlPct.toFixed(1)}%
                      </div>
                    </td>
                    <td className="portfolio-table__td portfolio-table__td--right">
                      <button className="portfolio-table__trade-btn">Trade</button>
                    </td>
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
