import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useCustomMarkets } from '../hooks/useCustomMarkets';
import { useAdminCaps } from '../hooks/useAdminCaps';
import { useMarketActions } from '../hooks/useMarketActions';

export default function AdminDashboard() {
  const account = useCurrentAccount();
  const { customMarkets, isLoadingCustomMarkets } = useCustomMarkets();
  const { adminCaps, isLoadingAdminCaps } = useAdminCaps();
  const { resolveMarket, delegateAdmin } = useMarketActions();

  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [delegatingId, setDelegatingId] = useState<string | null>(null);
  const [delegateAddress, setDelegateAddress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleResolve = async (marketId: string, adminCapId: string, winner: 1 | 2) => {
    try {
      setResolvingId(marketId);
      setError(null);
      await resolveMarket(marketId, adminCapId, winner);
      setTimeout(() => window.dispatchEvent(new Event('refreshMarkets')), 1500);
      // Let the hooks refresh data automatically
    } catch (err: any) {
      setError(err.message || 'Failed to resolve market');
    } finally {
      setResolvingId(null);
    }
  };

  const handleDelegate = async (marketId: string, adminCapId: string) => {
    if (!delegateAddress) {
      setError('Please enter a valid Sui address to delegate to.');
      return;
    }
    try {
      setResolvingId(marketId);
      setError(null);
      await delegateAdmin(adminCapId, delegateAddress);
      setTimeout(() => window.dispatchEvent(new Event('refreshMarkets')), 1500);
      setDelegateAddress('');
      setDelegatingId(null);
      setError('Successfully delegated admin capabilities to ' + delegateAddress);
      // Wait 3 seconds and clear success message
      setTimeout(() => setError(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delegate admin capabilities');
    } finally {
      setResolvingId(null);
    }
  };

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2 className="text-xl font-serif text-white mb-2">Connect Wallet</h2>
        <p className="text-white/40 max-w-sm">
          Please connect your wallet to access the admin dashboard and manage your deployed markets.
        </p>
      </div>
    );
  }

  const isLoading = isLoadingCustomMarkets || isLoadingAdminCaps;

  // Filter markets that have a corresponding admin cap owned by this user
  // Also only show unresolved active markets for administration
  const manageableMarkets = customMarkets.filter(
    (m) => adminCaps[m.oracle_id] && m.status !== 'settled'
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-white mb-2">Market Management</h1>
        <p className="text-white/40">Resolve prediction markets you have created.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-2 border-[#4DA2FF] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : manageableMarkets.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Manageable Markets</h3>
          <p className="text-white/40 text-sm">
            We couldn't find any active markets where you hold the Admin capability.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {manageableMarkets.map((market) => (
            <div key={market.oracle_id} className="relative">
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 flex items-center justify-between shadow-lg relative z-10">
              <div>
                <h3 className="text-white font-bold text-lg mb-1">{market.name}</h3>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-white/40 font-mono">ID: {market.oracle_id.slice(0, 10)}...</span>
                  <span className="bg-[#4DA2FF]/20 text-[#4DA2FF] px-2 py-0.5 rounded font-medium">
                    Admin Cap Active
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleResolve(market.oracle_id, adminCaps[market.oracle_id], 1)}
                  disabled={resolvingId !== null}
                  className="bg-[#22c55e]/10 hover:bg-[#22c55e]/20 border border-[#22c55e]/30 text-[#22c55e] font-bold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  {resolvingId === market.oracle_id ? 'Resolving...' : 'Resolve YES'}
                </button>
                <button
                  onClick={() => handleResolve(market.oracle_id, adminCaps[market.oracle_id], 2)}
                  disabled={resolvingId !== null}
                  className="bg-[#ef4444]/10 hover:bg-[#ef4444]/20 border border-[#ef4444]/30 text-[#ef4444] font-bold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  {resolvingId === market.oracle_id ? 'Resolving...' : 'Resolve NO'}
                </button>
                <button
                  onClick={() => setDelegatingId(delegatingId === market.oracle_id ? null : market.oracle_id)}
                  disabled={resolvingId !== null}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  Delegate
                </button>
              </div>
            </div>
            
            {delegatingId === market.oracle_id && (
              <div className="bg-[#0f172a]/50 border-x border-b border-white/5 rounded-b-2xl p-4 -mt-4 pt-8 flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Enter Sui Address (0x...)"
                  value={delegateAddress}
                  onChange={(e) => setDelegateAddress(e.target.value)}
                  className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#4DA2FF]/50"
                />
                <button
                  onClick={() => handleDelegate(market.oracle_id, adminCaps[market.oracle_id])}
                  disabled={resolvingId !== null || !delegateAddress}
                  className="bg-[#4DA2FF] hover:bg-[#3d8fe0] text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  Confirm Delegate
                </button>
              </div>
            )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
