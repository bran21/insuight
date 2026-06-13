import { Outlet } from 'react-router-dom';
import { Sidebar, TopBar, MobileNav } from './Navbar';

export default function AppLayout() {
  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Nav (hamburger + drawer) */}
      <MobileNav />

      {/* Main Content Area */}
      <div className="app-content">
        {/* Desktop Top Bar */}
        <TopBar />

        {/* Page Content */}
        <main className="app-main">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <span className="app-footer__brand">
            <span className="app-footer__logo">Insuight</span>
            <span>·</span>
            <span className="app-footer__links">
              Built on{' '}
              <a href="https://docs.sui.io/onchain-finance/deepbook-predict/" target="_blank" rel="noopener noreferrer">
                DeepBook
              </a>
              {' × '}
              <a href="https://sui.io" target="_blank" rel="noopener noreferrer">
                Sui
              </a>
            </span>
          </span>
          <span className="app-footer__copyright">© 2026</span>
        </footer>
      </div>
    </div>
  );
}
