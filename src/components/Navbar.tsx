import { useState } from 'react';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/app', label: 'Markets', abbr: 'MK' },
  { to: '/app/agent', label: 'Agent', abbr: 'AG' },
  { to: '/app/portfolio', label: 'Portfolio', abbr: 'PF' },
];

export default function Navbar() {
  const account = useCurrentAccount();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop: Vertical Sidebar ── */}
      <nav className="hidden md:flex flex-col items-center justify-between w-[56px] min-h-screen bg-bg-sidebar sticky top-0 py-6 z-50 border-r border-black/10">

        {/* Logo */}
        <NavLink to="/app" className="group mb-8">
          <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-sm group-hover:bg-black/10 transition-colors">
            <span className="text-text-primary font-serif font-bold text-base">I</span>
          </div>
        </NavLink>

        {/* Nav Links — vertical text */}
        <div className="flex flex-col items-center gap-1 flex-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/app'}
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? 'active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Bottom: Wallet indicator */}
        <div className="flex flex-col items-center gap-3">
          {account && (
            <div className="w-2 h-2 rounded-full bg-green" title={account.address} />
          )}
          <div className="connect-btn-wrapper [&_button]:!p-1.5 [&_button]:!text-[0px] [&_button]:!rounded-lg [&_button]:!w-8 [&_button]:!h-8">
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* ── Mobile: Top bar ── */}
      <div className="md:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-bg-primary/90 backdrop-blur-xl border-b border-border">
        <NavLink to="/app" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-bg-primary font-serif font-bold text-sm">I</span>
          </div>
          <span className="font-serif text-lg text-text-primary">Insuight</span>
        </NavLink>

        <div className="flex items-center gap-2">
          <div className="connect-btn-wrapper">
            <ConnectButton />
          </div>
          <button
            className="flex flex-col gap-1 p-2 rounded-lg hover:bg-accent-soft transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span className="w-4 h-0.5 bg-text-primary rounded-full" />
            <span className="w-3 h-0.5 bg-text-primary rounded-full" />
          </button>
        </div>
      </div>

      {/* ── Mobile: Slide-out menu ── */}
      {mobileOpen && (
        <>
          <div className="mobile-menu-backdrop" onClick={() => setMobileOpen(false)} />
          <div className="mobile-menu-panel">
            <div className="flex items-center justify-between mb-10">
              <span className="font-serif text-xl text-text-primary">Insuight</span>
              <button
                className="text-text-muted hover:text-text-primary text-lg p-1"
                onClick={() => setMobileOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/app'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-black/5 text-text-primary'
                        : 'text-text-muted hover:text-text-primary hover:bg-black/5'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
            {account && (
              <div className="mt-10 pt-6 border-t border-black/10">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Wallet</p>
                <p className="text-xs text-text-secondary font-mono break-all leading-relaxed">
                  {account.address}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
