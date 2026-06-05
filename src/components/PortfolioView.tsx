import { useCurrentAccount } from '@mysten/dapp-kit';

export default function PortfolioView() {
  const account = useCurrentAccount();

  // Demo positions: prediction market holdings
  const holdings = [
    {
      id: '1',
      question: 'Will Bitcoin reach $86,000 by July 2026?',
      category: 'crypto',
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
      category: 'crypto',
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
      category: 'politics',
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
      category: 'crypto',
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
      category: 'science',
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
      category: 'weather',
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

  function daysLeft(endDate: string): string {
    const diff = new Date(endDate).getTime() - Date.now();
    if (diff <= 0) return 'Ended';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 30) return `${Math.floor(days / 30)}mo left`;
    return `${days}d left`;
  }

  return (
    <div className="p-5 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-xl border border-accent/10">
            💼
          </div>
          <h1 className="section-header">Portfolio</h1>
        </div>
        <p className="text-text-secondary text-sm md:text-base mt-1">
          {account
            ? <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green" />
                <span className="font-mono text-text-primary">{account.address.slice(0, 8)}…{account.address.slice(-6)}</span>
              </span>
            : 'Connect wallet to view live positions'
          }
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Invested', value: `$${totalInvested.toFixed(2)}` },
          { label: 'Current Value', value: `$${totalValue.toFixed(2)}` },
          { label: 'Total PnL', value: `${totalPnL >= 0 ? '+' : ''}$${totalPnL.toFixed(2)}`, color: totalPnL >= 0 ? 'text-green' : 'text-red' },
          { label: 'Active Positions', value: activeCount.toString() },
        ].map((stat, i) => (
          <div
            key={i}
            className="stat-card animate-fade-in-up"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <p className="text-[10px] text-text-muted mb-1 font-bold uppercase tracking-wider">{stat.label}</p>
            <p className={`text-xl md:text-2xl font-extrabold font-mono tracking-tight ${stat.color || 'text-text-primary'}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Holdings List */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
          <span>📊</span> Your Positions
        </h2>
        <span className="badge badge-muted">{holdings.length} positions</span>
      </div>

      <div className="flex flex-col gap-3">
        {holdings.map((h, i) => {
          const pnl = h.currentValue - h.invested;
          const pnlPercent = (pnl / h.invested) * 100;
          const isUp = pnl >= 0;

          return (
            <div
              key={h.id}
              className="glass-card p-4 md:p-5 animate-fade-in-up"
              style={{ animationDelay: `${0.2 + i * 0.06}s` }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Left: Market info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`badge ${h.position === 'YES' ? 'badge-green' : 'badge-red'}`}>
                      {h.position}
                    </span>
                    <span className={`market-card__category market-card__category--${h.category}`} style={{ fontSize: '8px' }}>
                      {h.category}
                    </span>
                    <span className={`badge ${h.status === 'active' ? 'badge-accent' : 'badge-muted'}`} style={{ fontSize: '8px' }}>
                      {h.status === 'active' ? daysLeft(h.endDate) : 'Settled'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-text-primary leading-snug truncate">
                    {h.question}
                  </p>
                </div>

                {/* Right: Position details */}
                <div className="flex items-center gap-6 md:gap-8 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Shares</p>
                    <p className="text-sm font-bold font-mono">{h.shares}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Avg Cost</p>
                    <p className="text-sm font-mono text-text-secondary">{h.avgCost.toFixed(2)}¢</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Current</p>
                    <p className="text-sm font-mono text-text-primary font-semibold">{h.currentPrice.toFixed(2)}¢</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Value</p>
                    <p className="text-sm font-mono text-text-primary font-bold">${h.currentValue.toFixed(2)}</p>
                  </div>
                  <div className="text-right min-w-[70px]">
                    <p className="text-[9px] text-text-muted font-bold uppercase tracking-wider">PnL</p>
                    <p className={`text-sm font-mono font-bold ${isUp ? 'text-green' : 'text-red'}`}>
                      {isUp ? '+' : ''}${pnl.toFixed(2)}
                    </p>
                    <p className={`text-[10px] font-mono ${isUp ? 'text-green' : 'text-red'}`}>
                      {isUp ? '+' : ''}{pnlPercent.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress bar showing position price */}
              <div className="mt-3 h-1 rounded-full bg-bg-secondary overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${h.position === 'YES' ? 'bg-green' : 'bg-red'}`}
                  style={{ width: `${h.currentPrice * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Potential Payout Summary */}
      <div className="glass-card p-5 md:p-6 mt-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-1">
              🎯 Payout Summary
            </h3>
            <p className="text-xs text-text-secondary">
              If all your active positions resolve in your favor
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Total Invested</p>
              <p className="text-lg font-bold font-mono">${totalInvested.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Max Payout</p>
              <p className="text-lg font-bold font-mono text-green">
                ${holdings.filter(h => h.status === 'active').reduce((sum, h) => sum + h.potentialPayout, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
