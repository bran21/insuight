import { useState } from 'react';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/app', label: 'Markets' },
  { to: '/app/agent', label: 'AI Agent' },
  { to: '/app/portfolio', label: 'Portfolio' },
  { to: '/app/leaderboard', label: 'Leaderboard' },
  { to: '/app/competitions', label: 'Competitions' },
  { to: '/app/earn', label: 'Earn' }
];

export default function Navbar() {
  const account = useCurrentAccount();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop Top Navbar ── */}
      <nav className="hidden md:flex items-center justify-between mx-4 mt-4 px-6 py-3 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl sticky top-4 z-50 shadow-2xl transition-all duration-300 hover:bg-white/[0.04] hover:border-white/20">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <NavLink to="/app" className="flex items-center gap-2 text-white group hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <span className="font-sans text-xl font-bold tracking-tight">Insuight</span>
          </NavLink>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/app'}
                className={({ isActive }) =>
                  `text-sm font-medium transition-all duration-200 relative py-1 ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-full shadow-[0_-2px_10px_rgba(99,102,241,0.5)]"></span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Balances */}
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/40 border border-white/5 shadow-inner">
            <div className="text-sm text-green-400 font-mono font-bold tracking-tight">$21,417</div>
            <div className="w-px h-4 bg-white/10"></div>
            <div className="text-sm text-white font-mono font-bold tracking-tight flex items-center gap-1.5">
              5,342,782 <span className="opacity-80 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">🪙</span>
            </div>
          </div>
          
          {/* Notifications */}
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </button>
          

          
          {/* User Profile / Wallet */}
          <div className="connect-btn-wrapper">
            <ConnectButton />
          </div>
        </div>
      </nav>

      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <NavLink to="/app" className="flex items-center gap-2 text-white">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
          </div>
          <span className="font-sans text-lg font-bold tracking-tight">Insuight</span>
        </NavLink>

        <div className="mobile-topbar__actions">
          <button
            className="mobile-topbar__hamburger"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <>
          <div className="mobile-drawer-backdrop" onClick={() => setMobileOpen(false)} />
          <div className="mobile-drawer">
            <div className="mobile-drawer__header">
              <span className="mobile-drawer__title">Menu</span>
              <button
                className="mobile-drawer__close"
                onClick={() => setMobileOpen(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="mobile-drawer__nav">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/app'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `mobile-drawer__link${isActive ? ' active' : ''}`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>

            <div className="mobile-drawer__wallet mt-auto pt-5 border-t border-white/10">
               <div className="connect-btn-wrapper w-full">
                 <ConnectButton />
               </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
