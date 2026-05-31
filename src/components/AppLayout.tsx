import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex bg-bg-primary text-text-primary">
      {/* Vertical Sidebar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 relative z-10">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="px-8 py-5 flex flex-col sm:flex-row justify-between items-center text-xs text-text-muted gap-3 relative z-10 bg-bg-primary/50 backdrop-blur-sm border-t border-border mt-auto">
          <span className="flex items-center gap-2">
            <span className="font-serif text-sm text-text-primary font-normal">Insuight</span>
            <span className="text-text-muted">·</span>
            <span>
              Built on{' '}
              <a href="https://docs.sui.io/onchain-finance/deepbook-predict/" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text-primary transition-colors font-medium underline underline-offset-2 decoration-text-muted/30">
                DeepBook
              </a>
              {' × '}
              <a href="https://sui.io" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text-primary transition-colors font-medium underline underline-offset-2 decoration-text-muted/30">
                Sui
              </a>
            </span>
          </span>
          <span className="text-[11px]">© 2026</span>
        </footer>
      </div>
    </div>
  );
}
