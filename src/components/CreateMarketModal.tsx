import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useMarketActions } from '../hooks/useMarketActions';
import { YES_TREASURY_CAP, NO_TREASURY_CAP, ADMIN_ADDRESS } from '../constants';


interface CreateMarketModalProps {
  onClose: () => void;
}

export default function CreateMarketModal({ onClose }: CreateMarketModalProps) {
  const account = useCurrentAccount();
  const { createMarket } = useMarketActions();
  
  const [description, setDescription] = useState('');
  const [initialLiquidity, setInitialLiquidity] = useState('');
  const [endTime, setEndTime] = useState('');
  const [resolver, setResolver] = useState(ADMIN_ADDRESS);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      setError('Please connect your wallet first.');
      return;
    }
    if (!description || !initialLiquidity || !endTime || !resolver) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const endTimestamp = new Date(endTime).getTime();
      const mistAmount = Math.floor(parseFloat(initialLiquidity) * 1_000_000_000);
      const digest = await createMarket(description, endTimestamp, resolver, YES_TREASURY_CAP, NO_TREASURY_CAP, mistAmount);
      setTxDigest(digest);
      // Wait a moment for RPC to index, then trigger a refresh of markets
      setTimeout(() => {
        window.dispatchEvent(new Event('refreshMarkets'));
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create market.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-white font-serif text-xl">Create Prediction Market</h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {txDigest ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Market Created!</h3>
              <p className="text-white/40 text-sm mb-6">The prediction pool has been initialized on-chain.</p>
              <a
                href={`https://suiscan.xyz/testnet/tx/${txDigest}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-semibold transition-colors"
              >
                View on Explorer
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                  Market Question / Description
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4DA2FF]/50 transition-colors resize-none h-24"
                  placeholder="Will Bitcoin reach $100k by 2026?"
                />
              </div>


              {/* Initial Liquidity Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                  Initial Liquidity (SUI)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={initialLiquidity}
                  onChange={(e) => setInitialLiquidity(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4DA2FF]/50 transition-colors"
                  placeholder="e.g. 10.0"
                />
                <p className="text-white/30 text-xs mt-1">
                  Required to bootstrap the AMM pool.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                  End Time (Expiry)
                </label>
                <input
                  type="datetime-local"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4DA2FF]/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                  Resolver Address
                </label>
                <input
                  type="text"
                  required
                  value={resolver}
                  onChange={(e) => setResolver(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4DA2FF]/50 transition-colors"
                  placeholder="0x..."
                />
                <p className="text-white/30 text-xs mt-1">
                  The AI Agent or wallet address authorized to resolve this market.
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg p-3 mt-2">
                  {error}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-[#4DA2FF] hover:bg-[#3d8fe0] disabled:bg-white/10 disabled:text-white/30 text-white font-bold transition-colors"
                >
                  {isLoading ? 'Confirming in Wallet...' : 'Create Market Pool'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
