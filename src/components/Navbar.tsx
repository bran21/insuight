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
      <nav className="app-navbar">
        <div className="app-navbar__left">
          {/* Logo */}
          <NavLink to="/app" className="navbar-logo group">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white group-hover:text-gray-300 transition-colors">
              <defs>
                <mask id="chart-cutout-desktop">
                  <rect width="32" height="32" fill="white" />
                  <path d="M3 23 L12 14 L16 18 L25 6.5" fill="none" stroke="black" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
                </mask>
              </defs>
              <path d="M8 7 h16 v3.5 h-6 v11 h6 v3.5 h-16 v-3.5 h6 v-11 h-6 z" fill="currentColor" mask="url(#chart-cutout-desktop)" />
              <path d="M3 23 L12 14 L16 18 L25 6.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              <polygon points="19.5,7.5 26.5,4.5 23.5,11.5" fill="currentColor" />
              <path d="M27.5 4.5 L29.5 2.5 M25 2.5 L25.5 0 M28.5 7 L31 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            <span className="navbar-logo__text ml-1">Insuight</span>
          </NavLink>

          {/* Nav Links */}
          <div className="navbar-nav">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/app'}
                className={({ isActive }) =>
                  `navbar-nav-link${isActive ? ' active' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="app-navbar__right">
          {/* Balances */}
          <div className="navbar-balances">
            <div className="balance-item text-green font-mono font-bold">$21,417</div>
            <div className="balance-item text-text-primary font-mono font-bold">5,342,782 <span className="text-text-muted">🪙</span></div>
          </div>
          
          {/* Notifications */}
          <button className="navbar-icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </button>
          
          {/* Deposit Button */}
          <button className="btn-primary py-1.5 px-4 text-sm bg-white text-black hover:bg-gray-200">
            Deposit
          </button>
          
          {/* User Profile / Wallet */}
          <div className="navbar-wallet connect-btn-wrapper">
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* ── Mobile Top Bar ── */}
      <div className="mobile-topbar">
        <NavLink to="/app" className="mobile-topbar__logo group">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white group-hover:text-gray-300 transition-colors">
            <defs>
              <mask id="chart-cutout-mobile">
                <rect width="32" height="32" fill="white" />
                <path d="M3 23 L12 14 L16 18 L25 6.5" fill="none" stroke="black" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
              </mask>
            </defs>
            <path d="M8 7 h16 v3.5 h-6 v11 h6 v3.5 h-16 v-3.5 h6 v-11 h-6 z" fill="currentColor" mask="url(#chart-cutout-mobile)" />
            <path d="M3 23 L12 14 L16 18 L25 6.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            <polygon points="19.5,7.5 26.5,4.5 23.5,11.5" fill="currentColor" />
            <path d="M27.5 4.5 L29.5 2.5 M25 2.5 L25.5 0 M28.5 7 L31 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <span className="mobile-topbar__logo-text ml-1">Insuight</span>
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
