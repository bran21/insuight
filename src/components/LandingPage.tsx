import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

/* ── Static data ── */
const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="16" height="4" rx="2" fill="#2563eb" />
        <rect x="6" y="13" width="16" height="4" rx="2" fill="#2563eb" />
      </svg>
    ),
    title: 'Institutional Liquidity',
    desc: "DeepBook V3 powers sub-second settlement on Sui's network.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="10" width="20" height="10" rx="2" />
        <path d="M12 2v8" />
        <circle cx="12" cy="2" r="2" />
        <path d="M6 14h.01" />
        <path d="M10 14h.01" />
        <path d="M14 14h.01" />
        <path d="M18 14h.01" />
      </svg>
    ),
    title: 'Autonomous AI Agents',
    desc: 'On-chain signal engine with momentum & mean-reversion models.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: 'Unmatched Security',
    desc: 'Non-custodial. On-chain. Verifiable. Your keys, your funds.',
  },
];

const STEPS = [
  { n: '01', icon: '🔑', title: 'Plug In', desc: 'Securely connect your Sui wallet in seconds.' },
  { n: '02', icon: '🧠', title: 'Find the Alpha', desc: 'Explore AI-curated markets.' },
  { n: '03', icon: '🎯', title: 'Make Your Move', desc: 'Lock SUI and take your position (YES or NO).' },
  { n: '04', icon: '💰', title: 'Reap Rewards', desc: 'Claim your SUI payout when you win.' },
];

const STATS = [
  { label: 'Total Volume', value: '$2.4M' },
  { label: 'Active Traders', value: '47,736' },
  { label: 'Weekly Volume', value: '$850K' },
];

/* ── Component ── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', minHeight: '100vh' }}>

      {/* ═══ NAV ═══ */}
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          height: 56,
          display: 'flex', alignItems: 'center',
          background: scrolled ? 'rgba(245, 240, 235, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(26,26,26,0.1)',
            }}>
              <span style={{ color: 'var(--color-text-inverse)', fontFamily: "'DM Serif Display', serif", fontWeight: 700, fontSize: 14 }}>I</span>
            </div>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: 'var(--color-text-primary)' }}>Insuight</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {['Features', 'How it works'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                style={{ padding: '6px 14px', fontSize: 13, color: 'var(--color-text-secondary)', textDecoration: 'none', borderRadius: 8, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
              >
                {item}
              </a>
            ))}
            <Link to="/app" style={{
              padding: '6px 16px', borderRadius: 8,
              background: 'var(--color-accent)', color: 'var(--color-text-inverse)', fontSize: 13, fontWeight: 600,
              textDecoration: 'none', marginLeft: 8,
              boxShadow: '0 2px 12px rgba(26,26,26,0.1)',
            }}>
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', paddingTop: 130, paddingBottom: 60, textAlign: 'center', overflow: 'hidden' }}>
        {/* Gradient backdrop */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
            width: 800, height: 420, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(217,119,6,0.08) 0%, rgba(217,119,6,0.02) 60%, transparent 100%)',
          }} />
          <div style={{
            position: 'absolute', top: 80, left: '25%',
            width: 240, height: 240, borderRadius: '50%',
            background: 'rgba(22,163,74,0.06)', filter: 'blur(60px)',
          }} />
          <div style={{
            position: 'absolute', top: 80, right: '25%',
            width: 240, height: 240, borderRadius: '50%',
            background: 'rgba(99,102,241,0.04)', filter: 'blur(60px)',
          }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto', padding: '0 24px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 16px', borderRadius: 999,
            background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
            fontSize: 13, marginBottom: 28,
          }}>
            <span style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Trade Smarter,</span>
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Predict With Power</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'DM Serif Display', serif", fontWeight: 400,
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', lineHeight: 1.06,
            letterSpacing: '-0.02em', color: 'var(--color-text-primary)', marginBottom: 20,
          }}>
            Predict Market<br />Outcomes
          </h1>

          {/* Sub */}
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.6 }}>
            High-stakes prediction markets for traders who know something.
            Powered by AI and the Sui network.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/app" style={{
              padding: '10px 28px', borderRadius: 999,
              background: 'var(--color-accent)', color: 'var(--color-text-inverse)', fontWeight: 600, fontSize: 14,
              textDecoration: 'none', boxShadow: '0 4px 20px rgba(26,26,26,0.15)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(26,26,26,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,26,26,0.15)'; }}
            >
              Explore Markets
            </Link>
            <a href="#how-it-works" style={{
              padding: '10px 28px', borderRadius: 999,
              background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)', fontWeight: 600, fontSize: 14,
              textDecoration: 'none', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-card-hover)'; e.currentTarget.style.borderColor = 'var(--color-border-active)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-bg-card)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            >
              Learn more
            </a>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{
          position: 'relative', zIndex: 1,
          maxWidth: 720, margin: '56px auto 0', padding: '0 24px',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
        }}>
          {STATS.map((s) => (
            <div key={s.label} style={{
              background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
              borderRadius: 16, padding: '20px 20px 18px', textAlign: 'left',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <p style={{ color: 'var(--color-text-muted)', fontSize: 11, fontWeight: 500, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--color-text-secondary)', marginBottom: 12 }}>Why Insuight</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--color-text-primary)' }}>
            Real Design, Real Gains
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{
              background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
              borderRadius: 16, padding: 24,
              transition: 'border-color 0.3s, box-shadow 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, marginBottom: 16,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--color-text-secondary)', marginBottom: 12 }}>The Flow</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--color-text-primary)' }}>How It Works</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, position: 'relative' }}>
          {STEPS.map((s) => (
            <div key={s.n} style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
              background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
              borderRadius: 24, padding: '36px 24px', position: 'relative',
              transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{
                position: 'absolute', top: 16, right: 16,
                fontSize: 11, fontWeight: 800, color: 'var(--color-text-muted)',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {s.n}
              </div>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-card) 100%)', 
                border: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 24, fontSize: 32,
                boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.03)',
              }}>
                {s.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 12 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{
          position: 'relative', overflow: 'hidden',
          borderRadius: 24, border: '1px solid var(--color-border)',
          padding: '64px 32px', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(250,248,246,1) 50%, rgba(255,255,255,0.7) 100%)',
        }}>
          {/* Top glow */}
          <div style={{
            position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
            width: 300, height: 60, borderRadius: '50%',
            background: 'rgba(217,119,6,0.06)', filter: 'blur(40px)', pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 460, margin: '0 auto' }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--color-text-secondary)', marginBottom: 16 }}>Get Started Today</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--color-text-primary)', marginBottom: 16, lineHeight: 1.1 }}>
              Ready to make your prediction?
            </h2>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>
              Join the decentralized frontier of AI-powered prediction markets. Your edge starts here.
            </p>
            <Link to="/app" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 999,
              background: 'var(--color-accent)', color: 'var(--color-text-inverse)', fontWeight: 700, fontSize: 14,
              textDecoration: 'none', boxShadow: '0 4px 20px rgba(26,26,26,0.1)',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = '')}
            >
              Launch Insuight Now
              <span style={{ fontSize: 16 }}>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: '1px solid var(--color-border)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--color-text-inverse)', fontFamily: "'DM Serif Display', serif", fontWeight: 700, fontSize: 10 }}>I</span>
            </div>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 13, color: 'var(--color-text-secondary)' }}>Insuight</span>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 4 }}>© 2026</span>
          </div>
          <div style={{ display: 'flex', gap: 20, fontSize: 11 }}>
            {['Twitter', 'Discord', 'GitHub'].map(s => (
              <a key={s} href="#" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
