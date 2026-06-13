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

  return (
    <div className="relative min-h-[calc(100vh-80px)] pt-12 md:pt-20 pb-20 px-4 md:px-8 max-w-[1440px] mx-auto w-full flex flex-col">
      {/* Background ambient glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 animate-fade-in-up">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
            Portfolio
          </h1>
          <p className="text-gray-400 font-medium">
            Track and manage your prediction market positions
          </p>
        </div>
        <button className="group mt-6 md:mt-0 relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-indigo-600/90 border border-indigo-500/50 rounded-xl hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] overflow-hidden">
          <span className="relative z-10 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14m-7-7h14"/></svg>
            Add Position
          </span>
        </button>
      </div>

      {/* Dashboard Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {/* Metric Card 1 */}
        <div className="relative overflow-hidden rounded-2xl bg-[#121212] border border-white/5 p-6 shadow-2xl animate-fade-in-up hover:border-indigo-500/30 transition-colors group" style={{ animationDelay: '0.05s' }}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50" />
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Portfolio Value</p>
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold font-mono text-white tracking-tight">${totalValue.toFixed(2)}</h2>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/20">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mr-0.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                7.4%
              </span>
              <span className="text-xs text-gray-500 font-medium">all time</span>
            </div>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="relative overflow-hidden rounded-2xl bg-[#121212] border border-white/5 p-6 shadow-2xl animate-fade-in-up hover:border-emerald-500/30 transition-colors group" style={{ animationDelay: '0.1s' }}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-50" />
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total P&L</p>
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <span className="font-mono text-base font-bold">$</span>
            </div>
          </div>
          <div>
            <h2 className={`text-3xl font-bold font-mono tracking-tight ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
            </h2>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-xs text-emerald-400/80 font-medium">Realized & Unrealized</span>
            </div>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="relative overflow-hidden rounded-2xl bg-[#121212] border border-white/5 p-6 shadow-2xl animate-fade-in-up hover:border-blue-500/30 transition-colors group" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Positions</p>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold font-mono text-white tracking-tight">{activeCount}</h2>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-xs text-gray-500 font-medium">Across 3 categories</span>
            </div>
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="relative overflow-hidden rounded-2xl bg-[#121212] border border-white/5 p-6 shadow-2xl animate-fade-in-up hover:border-amber-500/30 transition-colors group" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Win Rate</p>
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold font-mono text-white tracking-tight">60.2%</h2>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-xs text-gray-500 font-medium">Based on resolved markets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mb-8 rounded-2xl bg-[#121212] border border-white/5 overflow-hidden shadow-2xl animate-fade-in-up relative" style={{ animationDelay: '0.25s' }}>
        <div className="px-6 py-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <h2 className="text-base font-bold text-white tracking-wide">Performance History</h2>
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/5">
            {['1W', '1M', '3M', 'YTD', 'ALL'].map(t => (
              <button key={t} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${t === '1M' ? 'bg-indigo-500/20 text-indigo-400 shadow-sm border border-indigo-500/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 h-[280px] w-full relative">
          {/* SVG Chart Line */}
          <svg preserveAspectRatio="none" className="w-full h-full relative z-10" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 150 C 100 130, 200 170, 300 120 C 400 70, 500 140, 600 100 C 700 60, 800 80, 800 80 L 800 200 L 0 200 Z" fill="url(#chart_gradient)" fillOpacity="1"/>
            <path d="M0 150 C 100 130, 200 170, 300 120 C 400 70, 500 140, 600 100 C 700 60, 800 80, 800 80" stroke="#818cf8" strokeWidth="3" strokeLinecap="round"/>
            <defs>
              <linearGradient id="chart_gradient" x1="400" y1="0" x2="400" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818cf8" stopOpacity="0.25"/>
                <stop offset="1" stopColor="#818cf8" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-x-6 bottom-4 flex justify-between text-[10px] font-mono text-gray-500 tracking-widest uppercase z-10">
            <span>Feb 16</span><span>Feb 20</span><span>Feb 24</span><span>Feb 28</span><span>Mar 4</span><span>Mar 8</span><span>Mar 12</span><span>Mar 16</span>
          </div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="rounded-2xl bg-[#121212] border border-white/5 overflow-hidden shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="px-6 py-5 border-b border-white/5">
          <h2 className="text-base font-bold text-white tracking-wide">Current Positions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-black/20">
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Market</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Side</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Shares</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Avg Price</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Current</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Value</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Return</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {holdings.map((h) => {
                const pnl = h.currentValue - h.invested;
                const pnlPercent = (pnl / h.invested) * 100;
                const isUp = pnl >= 0;

                return (
                  <tr key={h.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white text-sm line-clamp-1 group-hover:text-indigo-400 transition-colors">
                        {h.question}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 capitalize">{h.category}</div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                        h.position === 'YES' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {h.position}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-sm text-gray-300">{h.shares}</td>
                    <td className="py-4 px-6 text-right font-mono text-sm text-gray-400">{h.avgCost.toFixed(2)}¢</td>
                    <td className="py-4 px-6 text-right font-mono text-sm text-white">{h.currentPrice.toFixed(2)}¢</td>
                    <td className="py-4 px-6 text-right">
                      <div className="font-mono font-bold text-sm text-white">${h.currentValue.toFixed(2)}</div>
                      <div className="font-mono text-[10px] text-gray-500 mt-1">Invested: ${h.invested.toFixed(2)}</div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className={`font-mono font-bold text-sm ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isUp ? '+' : ''}${pnl.toFixed(2)}
                      </div>
                      <div className={`font-mono text-[11px] mt-1 ${isUp ? 'text-emerald-400/80' : 'text-red-400/80'}`}>
                        {isUp ? '+' : ''}{pnlPercent.toFixed(1)}%
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white/5 border border-white/10 text-white hover:bg-indigo-500 hover:border-indigo-400 transition-all">
                        Trade
                      </button>
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
