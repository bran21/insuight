import type { OracleState } from '../services/predictApi';

interface MarketCardProps {
  oracle: OracleState;
  index: number;
}

export default function MarketCard({ oracle, index }: MarketCardProps) {
  const isActive = oracle.status === 'active';

  const impliedProb = oracle.spot && oracle.forward
    ? Math.min(0.95, Math.max(0.05, 0.5 + (oracle.forward - oracle.spot) / oracle.spot))
    : 0.5;

  const yesPrice = Math.round(impliedProb * 100);
  const noPrice = 100 - yesPrice;

  function daysLeft(): string {
    if (!oracle.expiry) return '—';
    const diff = oracle.expiry * 1000 - Date.now();
    if (diff <= 0) return 'Ended';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 30) return `${Math.floor(days / 30)}mo`;
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  }

  return (
    <div
      className="market-card"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Header */}
      <div className="market-card__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="market-card__category market-card__category--crypto">
            CRYPTO
          </span>
          {isActive && (
            <span className="badge badge-green">
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-green)', display: 'inline-block' }} />
              Live
            </span>
          )}
        </div>
        <span className="market-card__timer">{daysLeft()}</span>
      </div>

      {/* Question */}
      <h3 className="market-card__question">
        {oracle.name || `Market ${oracle.oracle_id.slice(0, 10)}...`}
      </h3>

      {/* Probability Bar */}
      <div className="market-card__prob-bar-container">
        <div className="market-card__prob-bar">
          <div
            className="market-card__prob-fill market-card__prob-fill--yes"
            style={{ width: `${yesPrice}%` }}
          />
        </div>
      </div>

      {/* Yes / No Buttons */}
      <div className="market-card__actions">
        <button className="market-card__btn market-card__btn--yes">
          <span className="market-card__btn-label">Yes</span>
          <span className="market-card__btn-price">{yesPrice}¢</span>
        </button>
        <button className="market-card__btn market-card__btn--no">
          <span className="market-card__btn-label">No</span>
          <span className="market-card__btn-price">{noPrice}¢</span>
        </button>
      </div>

      {/* Footer */}
      <div className="market-card__footer">
        <div className="market-card__stat">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{oracle.spot?.toFixed(2) || '—'}</span>
        </div>
        <div className="market-card__stat">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>@insuight</span>
        </div>
      </div>
    </div>
  );
}
