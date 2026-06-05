import { Outlet, Link } from 'react-router-dom';
import { ConnectButton } from '@mysten/dapp-kit';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans">
      {/* Admin Menu Bar */}
      <nav className="h-16 border-b border-white/10 bg-[#0f172a] px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link to="/app" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back to App</span>
          </Link>
          
          <div className="flex items-center gap-3 border-l border-white/10 pl-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Insuight Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ConnectButton 
            className="!bg-[#4DA2FF] hover:!bg-[#3d8fe0] !text-white !font-bold !rounded-xl !px-6 !py-2.5 transition-colors shadow-lg shadow-[#4DA2FF]/20"
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
