import { useCurrentAccount } from '@mysten/dapp-kit';

export default function PortfolioView() {
  const account = useCurrentAccount();

  // Demo positions for display
  const demoPositions = [
    {
      id: '1',
      oracle: 'BTC/USD',
      direction: 'UP',
      strike: 68000,
      expiry: 'May 20, 2026',
      quantity: 50,
      entryPrice: 0.58,
      currentPrice: 0.72,
      pnl: 24.14,
      pnlPercent: 24.1,
      status: 'active' as const,
    },
    {
      id: '2',
      oracle: 'ETH/USD',
      direction: 'DOWN',
      strike: 3800,
      expiry: 'May 18, 2026',
      quantity: 30,
      entryPrice: 0.45,
      currentPrice: 0.38,
      pnl: -5.67,
      pnlPercent: -16.5,
      status: 'active' as const,
    },
    {
      id: '3',
      oracle: 'SUI/USD',
      direction: 'UP',
      strike: 1.20,
      expiry: 'May 15, 2026',
      quantity: 100,
      entryPrice: 0.62,
      currentPrice: 0.89,
      pnl: 43.55,
      pnlPercent: 43.5,
      status: 'settled' as const,
    },
  ];

  const totalValue = demoPositions.reduce((sum, p) => sum + p.quantity * p.currentPrice, 0);
  const totalPnL = demoPositions.reduce((sum, p) => sum + p.pnl, 0);
  const totalPnLPercent = (totalPnL / (totalValue - totalPnL)) * 100;

  return (
    <div className="p-5 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-xl border border-accent/10">
            💼
          </div>
          <h1 className="section-header">Portfolio</h1>
        </div>
        <p className="text-text-secondary text-sm md:text-base mt-2">
          {account
            ? <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green" />
                Positions for <span className="font-mono text-text-primary">{account.address.slice(0, 8)}…{account.address.slice(-6)}</span>
              </span>
            : 'Connect wallet to view your positions'
          }
        </p>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
        {[
          { label: 'Total Value', value: `$${totalValue.toFixed(2)}`, icon: '💰', color: '' },
          { label: 'Total PnL', value: `${totalPnL >= 0 ? '+' : ''}$${totalPnL.toFixed(2)}`, icon: totalPnL >= 0 ? '📈' : '📉', color: totalPnL >= 0 ? 'text-green' : 'text-red' },
          { label: 'PnL %', value: `${totalPnLPercent >= 0 ? '+' : ''}${totalPnLPercent.toFixed(1)}%`, icon: '📊', color: totalPnLPercent >= 0 ? 'text-green' : 'text-red' },
          { label: 'Positions', value: demoPositions.length.toString(), icon: '🎯', color: '' },
        ].map((stat, i) => (
          <div
            key={i}
            className="stat-card flex justify-between items-center group animate-fade-in-up"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div>
              <p className="text-[10px] text-text-muted mb-1.5 font-bold uppercase tracking-wider group-hover:text-accent transition-colors">
                {stat.label}
              </p>
              <p className={`text-2xl md:text-3xl font-extrabold font-mono tracking-tight ${stat.color || 'text-text-primary'}`}>
                {stat.value}
              </p>
            </div>
            <span className="text-3xl opacity-60 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
              {stat.icon}
            </span>
          </div>
        ))}
      </div>

      {/* Positions Table */}
      <div className="glass-card overflow-hidden shadow-xl mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="px-5 py-3.5 border-b border-border bg-bg-secondary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold flex items-center gap-2 text-text-secondary uppercase tracking-wider">
            <span>🎯</span> Open Positions
          </h3>
          <span className="badge badge-accent">
            📌 Demo data — connect wallet for live positions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table min-w-[800px]">
            <thead>
              <tr>
                {['Oracle', 'Direction', 'Strike', 'Expiry', 'Qty (DUSDC)', 'Entry', 'Current', 'PnL', 'Status'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {demoPositions.map((pos, i) => (
                <tr
                  key={pos.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${0.4 + i * 0.08}s` }}
                >
                  <td className="font-bold">{pos.oracle}</td>
                  <td>
                    <span className={`badge ${pos.direction === 'UP' ? 'badge-green' : 'badge-red'}`}>
                      {pos.direction === 'UP' ? '↑ UP' : '↓ DOWN'}
                    </span>
                  </td>
                  <td className="font-mono">${pos.strike.toLocaleString()}</td>
                  <td className="text-text-secondary">{pos.expiry}</td>
                  <td className="font-mono font-semibold">{pos.quantity}</td>
                  <td className="font-mono text-text-secondary">{pos.entryPrice.toFixed(2)}</td>
                  <td className="font-mono text-text-secondary">{pos.currentPrice.toFixed(2)}</td>
                  <td className={`font-mono font-bold ${pos.pnl >= 0 ? 'text-green' : 'text-red'}`}>
                    {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toFixed(2)}
                    <span className="text-text-muted font-normal ml-1 text-[11px]">
                      ({pos.pnlPercent >= 0 ? '+' : ''}{pos.pnlPercent.toFixed(1)}%)
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${pos.status === 'active' ? 'badge-green' : 'badge-accent'}`}>
                      {pos.status === 'active' ? 'ACTIVE' : 'SETTLED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vault LP Section */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden group animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-accent/8 transition-colors duration-700 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 relative z-10 gap-4">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2 mb-1">
              🏦 Vault <span className="text-text-muted font-normal text-sm">(Liquidity Provider)</span>
            </h3>
            <p className="text-xs text-text-secondary">Provide liquidity to prediction markets and earn yields</p>
          </div>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <span>+</span> Supply DUSDC
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
          {[
            { label: 'Your PLP Balance', value: '0.00', unit: 'PLP', color: '' },
            { label: 'PLP Price', value: '$1.0000', unit: '', color: '' },
            { label: 'LP Yield (est.)', value: '14.2%', unit: 'APY', color: 'text-green' },
          ].map((item, i) => (
            <div key={i} className="bg-bg-secondary/30 p-4 rounded-xl border border-border/30">
              <p className="text-[10px] text-text-muted mb-2 font-bold uppercase tracking-wider">{item.label}</p>
              <p className={`text-xl font-extrabold font-mono tracking-tight ${item.color}`}>
                {item.value}
                {item.unit && <span className="text-xs text-text-muted font-normal ml-1.5">{item.unit}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
