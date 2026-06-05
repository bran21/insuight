import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useMarketActions } from '../hooks/useMarketActions';

interface TradeModalProps {
  market: {
    id: string;
    title: string;
    yesPrice: number;
    noPrice: number;
  };
  onClose: () => void;
}

export default function TradeModal({ market, onClose }: TradeModalProps) {
  const account = useCurrentAccount();
  const { buyYes, buyNo } = useMarketActions();
  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'YES' | 'NO'>('YES');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      setError('Please connect your wallet first.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      // Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
      const mistAmount = Math.floor(parseFloat(amount) * 1_000_000_000);
      let digest;
      if (activeTab === 'YES') {
        digest = await buyYes(market.id, mistAmount, account.address);
      } else {
        digest = await buyNo(market.id, mistAmount, account.address);
      }
      setTxDigest(digest);
    } catch (err: any) {
      setError(err.message || 'Failed to execute transaction.');
    } finally {
      setIsLoading(false);
    }
  };

  const amountNum = parseFloat(amount) || 0;
  // Estimate payout based on current prices from the oracle data
  // If YES price is 60%, 1 SUI buys approximately (1 / 0.6) YES shares
  const price = activeTab === 'YES' ? market.yesPrice : market.noPrice;
  const estimatedShares = price > 0 ? (amountNum / (price / 100)).toFixed(2) : '0.00';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-white font-serif text-xl">Trade Market</h2>
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
          <p className="text-white/80 text-sm mb-6 leading-relaxed">
            {market.title}
          </p>

          {txDigest ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Transaction Successful</h3>
              <p className="text-white/40 text-sm mb-6">You have successfully bought {activeTab} shares.</p>
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
            <>
              {/* Tabs */}
              <div className="flex bg-white/[0.05] p-1 rounded-xl mb-6">
                <button
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                    activeTab === 'YES' ? 'bg-[#22c55e] text-white shadow-lg' : 'text-white/50 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('YES')}
                >
                  Buy YES ({market.yesPrice}%)
                </button>
                <button
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                    activeTab === 'NO' ? 'bg-[#ef4444] text-white shadow-lg' : 'text-white/50 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('NO')}
                >
                  Buy NO ({market.noPrice}%)
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
              {/* Amount Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                  Amount (SUI)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4DA2FF]/50 transition-colors"
                    placeholder="0.0"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white/40">
                    <span className="text-sm font-medium">SUI</span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Estimated Shares</span>
                  <span className="text-white font-mono">{estimatedShares} {activeTab}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Potential Payout</span>
                  <span className="text-[#4DA2FF] font-mono font-bold">{estimatedShares} SUI</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg p-3">
                  {error}
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={isLoading || amountNum <= 0}
                className={`w-full py-3.5 rounded-xl text-white font-bold transition-colors ${
                  activeTab === 'YES' ? 'bg-[#22c55e] hover:bg-[#1ea34d]' : 'bg-[#ef4444] hover:bg-[#dc2626]'
                } disabled:bg-white/10 disabled:text-white/30`}
              >
                {isLoading ? 'Confirming in Wallet...' : `Buy ${activeTab} Shares`}
              </button>
            </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
