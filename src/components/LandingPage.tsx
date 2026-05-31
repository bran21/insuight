import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

/* ── Static data ── */
const FEATURES = [
  {
    icon: '\u{1F4B3}', // 💳
    title: 'Institutional Liquidity',
    desc: "DeepBook V3 powers sub-second settlement on Sui's network.",
  },
  {
    icon: '\u{1F916}', // 🤖
    title: 'Autonomous AI Agents',
    desc: 'On-chain signal engine with momentum & mean-reversion models.',
  },
  {
    icon: '\u{1F6E1}', // 🛡
    title: 'Unmatched Security',
    desc: 'Non-custodial. On-chain. Verifiable. Your keys, your funds.',
  },
];

const STEPS = [
  { n: '01', title: 'Connect Wallet', desc: 'Link your Sui wallet — no KYC.' },
  { n: '02', title: 'Browse Markets', desc: 'AI-scored predictions across categories.' },
  { n: '03', title: 'Mint YES / NO', desc: 'Lock SUI, receive outcome tokens.' },
  { n: '04', title: 'Collect Winnings', desc: 'Burn winning tokens for SUI payout.' },
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
    <div style={{ background: '#060a14', color: '#ffffff', minHeight: '100vh' }}>

      {/* ═══ NAV ═══ */}
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          height: 56,
          display: 'flex', alignItems: 'center',
          background: scrolled ? 'rgba(6,10,20,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: '#4DA2FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(77,162,255,0.3)',
            }}>
              <span style={{ color: '#fff', fontFamily: "'DM Serif Display', serif", fontWeight: 700, fontSize: 14 }}>I</span>
            </div>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: '#fff' }}>Insuight</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {['Features', 'How it works'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                style={{ padding: '6px 14px', fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', borderRadius: 8, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
              >
                {item}
              </a>
            ))}
            <Link to="/app" style={{
              padding: '6px 16px', borderRadius: 8,
              background: '#4DA2FF', color: '#fff', fontSize: 13, fontWeight: 600,
              textDecoration: 'none', marginLeft: 8,
              boxShadow: '0 2px 12px rgba(77,162,255,0.2)',
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
            background: 'radial-gradient(ellipse, rgba(77,162,255,0.18) 0%, rgba(77,162,255,0.04) 60%, transparent 100%)',
          }} />
          <div style={{
            position: 'absolute', top: 80, left: '25%',
            width: 240, height: 240, borderRadius: '50%',
            background: 'rgba(124,58,237,0.12)', filter: 'blur(60px)',
          }} />
          <div style={{
            position: 'absolute', top: 80, right: '25%',
            width: 240, height: 240, borderRadius: '50%',
            background: 'rgba(77,162,255,0.08)', filter: 'blur(60px)',
          }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto', padding: '0 24px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 16px', borderRadius: 999,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            fontSize: 13, marginBottom: 28,
          }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>Trade Smarter,</span>
            <span style={{ color: '#4DA2FF', fontWeight: 600 }}>Predict With Power</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'DM Serif Display', serif", fontWeight: 400,
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', lineHeight: 1.06,
            letterSpacing: '-0.02em', color: '#fff', marginBottom: 20,
          }}>
            Predict Market<br />Outcomes
          </h1>

          {/* Sub */}
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.6 }}>
            High-stakes prediction markets for traders who know something.
            Powered by AI and the Sui network.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/app" style={{
              padding: '10px 28px', borderRadius: 999,
              background: '#4DA2FF', color: '#fff', fontWeight: 600, fontSize: 14,
              textDecoration: 'none', boxShadow: '0 4px 20px rgba(77,162,255,0.25)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(77,162,255,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(77,162,255,0.25)'; }}
            >
              Explore Markets
            </Link>
            <a href="#how-it-works" style={{
              padding: '10px 28px', borderRadius: 999,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14,
              textDecoration: 'none', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
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
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: '20px 20px 18px', textAlign: 'left',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = '')}
            >
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 500, marginBottom: 4 }}>{s.label}</p>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#4DA2FF', marginBottom: 12 }}>Why Insuight</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#fff' }}>
            Real Design, Real Gains
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16, padding: 24,
              transition: 'border-color 0.3s, background 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(77,162,255,0.25)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, marginBottom: 16,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#4DA2FF', marginBottom: 12 }}>The Flow</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#fff' }}>How It Works</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, position: 'relative' }}>
          {STEPS.map((s) => (
            <div key={s.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14, position: 'relative', zIndex: 1,
              }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: '#4DA2FF' }}>{s.n}</span>
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{s.title}</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{
          position: 'relative', overflow: 'hidden',
          borderRadius: 24, border: '1px solid rgba(255,255,255,0.06)',
          padding: '64px 32px', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(77,162,255,0.06) 0%, rgba(6,10,20,1) 50%, rgba(124,58,237,0.04) 100%)',
        }}>
          {/* Top glow */}
          <div style={{
            position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
            width: 300, height: 60, borderRadius: '50%',
            background: 'rgba(77,162,255,0.12)', filter: 'blur(40px)', pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 460, margin: '0 auto' }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#4DA2FF', marginBottom: 16 }}>Get Started Today</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#fff', marginBottom: 16, lineHeight: 1.1 }}>
              Ready to make your prediction?
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 32, lineHeight: 1.6 }}>
              Join the decentralized frontier of AI-powered prediction markets. Your edge starts here.
            </p>
            <Link to="/app" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 999,
              background: '#4DA2FF', color: '#fff', fontWeight: 700, fontSize: 14,
              textDecoration: 'none', boxShadow: '0 4px 20px rgba(77,162,255,0.25)',
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
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: '#4DA2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontFamily: "'DM Serif Display', serif", fontWeight: 700, fontSize: 10 }}>I</span>
            </div>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Insuight</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)', marginLeft: 4 }}>© 2026</span>
          </div>
          <div style={{ display: 'flex', gap: 20, fontSize: 11 }}>
            {['Twitter', 'Discord', 'GitHub'].map(s => (
              <a key={s} href="#" style={{ color: 'rgba(255,255,255,0.2)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
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
