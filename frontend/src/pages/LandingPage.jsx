import { useState } from 'react';

export default function LandingPage({ onGetStarted }) {
  const [showContact, setShowContact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: '#111', background: '#fff', overflowX: 'hidden' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 24px', borderBottom: '1px solid #f0f0f0',
        position: 'sticky', top: 0, background: '#fff', zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>🪙</span>
          <span style={{ fontWeight: 800, fontSize: 17 }}>Change Wallet</span>
        </div>

        {/* Desktop nav links */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }} className="desktop-nav">
          <a href="#how" style={{ fontSize: 14, color: '#666', textDecoration: 'none' }}>How it works</a>
          <a href="#features" style={{ fontSize: 14, color: '#666', textDecoration: 'none' }}>Features</a>
          <a href="#investors" style={{ fontSize: 14, color: '#666', textDecoration: 'none' }}>Investors</a>
          <button onClick={onGetStarted} style={{
            background: '#0F6E56', color: '#fff', border: 'none',
            padding: '10px 20px', borderRadius: 10, fontSize: 14,
            fontWeight: 700, cursor: 'pointer'
          }}>Open App</button>
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          display: 'none', background: 'none', border: 'none',
          fontSize: 24, cursor: 'pointer'
        }} className="mobile-menu-btn">☰</button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{
          background: '#fff', borderBottom: '1px solid #f0f0f0',
          padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16
        }}>
          <a href="#how" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, color: '#333', textDecoration: 'none' }}>How it works</a>
          <a href="#features" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, color: '#333', textDecoration: 'none' }}>Features</a>
          <a href="#investors" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, color: '#333', textDecoration: 'none' }}>Investors</a>
          <button onClick={() => { setMenuOpen(false); onGetStarted(); }} style={{
            background: '#0F6E56', color: '#fff', border: 'none',
            padding: '12px', borderRadius: 10, fontSize: 15,
            fontWeight: 700, cursor: 'pointer', textAlign: 'center'
          }}>Open App</button>
        </div>
      )}

      {/* Hero */}
      <section style={{
        textAlign: 'center', padding: '60px 20px 48px',
        background: 'linear-gradient(180deg, #f0faf6 0%, #fff 100%)'
      }}>
        <div style={{
          display: 'inline-block', background: '#e8f8f0', color: '#0F6E56',
          fontSize: 13, fontWeight: 600, padding: '6px 14px',
          borderRadius: 99, marginBottom: 20
        }}>
          Now live — try the demo today
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 8vw, 56px)', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.1, letterSpacing: -1 }}>
          Stop getting coins.<br />
          <span style={{ color: '#0F6E56' }}>Start building balance.</span>
        </h1>
        <p style={{ fontSize: 'clamp(15px, 3vw, 18px)', color: '#666', margin: '0 auto 32px', maxWidth: 520, lineHeight: 1.6 }}>
          Change Wallet automatically loads your coin change onto a digital gift card instead of your pocket. Works at any store, any register.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onGetStarted} style={{
            background: '#0F6E56', color: '#fff', border: 'none',
            padding: '14px 28px', borderRadius: 12, fontSize: 15,
            fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(15,110,86,0.3)'
          }}>
            Try the live demo
          </button>
          <a href="#how" style={{
            background: '#fff', color: '#111', border: '1.5px solid #e5e5e5',
            padding: '14px 28px', borderRadius: 12, fontSize: 15,
            fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
            display: 'inline-block'
          }}>
            See how it works
          </a>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          marginTop: 48, flexWrap: 'wrap', gap: 0
        }}>
          {[
            { value: '$62M', label: 'in coins lost annually' },
            { value: '150K+', label: 'gas stations in the US' },
            { value: '$700B', label: 'convenience store market' },
          ].map((s, i) => (
            <div key={s.label} style={{
              padding: '16px 24px',
              borderLeft: i > 0 ? '1px solid #e5e5e5' : 'none',
              textAlign: 'center', minWidth: 120
            }}>
              <p style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 800, margin: 0, color: '#0F6E56' }}>{s.value}</p>
              <p style={{ fontSize: 12, color: '#999', margin: '4px 0 0', maxWidth: 120 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '64px 20px', background: '#fff', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#0F6E56', fontWeight: 600, letterSpacing: 1, margin: '0 0 10px' }}>HOW IT WORKS</p>
        <h2 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 800, margin: '0 0 8px', letterSpacing: -1 }}>Three steps. Zero coins.</h2>
        <p style={{ fontSize: 15, color: '#666', margin: '0 auto 40px', maxWidth: 440, lineHeight: 1.6 }}>
          From your first visit to a growing balance — it all happens automatically.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, maxWidth: 800, margin: '0 auto' }}>
          {[
            { step: '01', icon: '📲', title: 'Sign up once', desc: 'Create your free Change Wallet account and get a digital card linked to your phone number.' },
            { step: '02', icon: '🏪', title: 'Pay cash at any store', desc: 'Give the cashier your phone number or tap your physical card. Buy anything with cash.' },
            { step: '03', icon: '💳', title: 'Coins go to your card', desc: 'Instead of coins, the change loads to your card. Spend it next time — at any store.' },
          ].map(s => (
            <div key={s.step} style={{
              background: '#f9f9f9', borderRadius: 20, padding: '28px 20px', textAlign: 'left'
            }}>
              <p style={{ fontSize: 11, color: '#0F6E56', fontWeight: 700, letterSpacing: 2, margin: '0 0 12px' }}>{s.step}</p>
              <p style={{ fontSize: 28, margin: '0 0 10px' }}>{s.icon}</p>
              <p style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px' }}>{s.title}</p>
              <p style={{ fontSize: 13, color: '#666', margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Transaction example */}
        <div style={{
          maxWidth: 440, margin: '40px auto 0',
          background: 'linear-gradient(135deg, #0F6E56, #1D9E75)',
          borderRadius: 20, padding: '24px 28px', textAlign: 'left', color: '#fff'
        }}>
          <p style={{ fontSize: 12, color: '#9FE1CB', margin: '0 0 14px', letterSpacing: 0.5 }}>EXAMPLE TRANSACTION</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Chips at gas station</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>$1.49</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Cash given</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>$20.00</span>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Cash back in bills</span>
            <span style={{ fontSize: 16, fontWeight: 700 }}>$18.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, color: '#9FE1CB' }}>Added to your card</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#9FE1CB' }}>+$0.51</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '64px 20px', background: '#f9f9f9', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#0F6E56', fontWeight: 600, letterSpacing: 1, margin: '0 0 10px' }}>FEATURES</p>
        <h2 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 800, margin: '0 0 8px', letterSpacing: -1 }}>Everything in one card</h2>
        <p style={{ fontSize: 15, color: '#666', margin: '0 auto 40px', maxWidth: 440 }}>
          One card. Works at every store. Earns rewards everywhere.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, maxWidth: 900, margin: '0 auto' }}>
          {[
            { icon: '💳', title: 'Digital card', desc: 'Custom card themes — Forest, Ocean, Midnight, Gold, Galaxy' },
            { icon: '🪙', title: 'Auto coin change', desc: 'Coin change loads automatically every time you pay cash' },
            { icon: '🎁', title: 'Rewards stamps', desc: 'Earn $0.10 every 10 visits at Shell, Mobil, BP, Chevron' },
            { icon: '📦', title: 'Physical card', desc: 'Order a physical card mailed to your home address' },
            { icon: '📊', title: 'Transaction history', desc: 'Full history with store name, date, and location' },
            { icon: '💬', title: 'Chat support', desc: 'AI-powered support built right into the app' },
            { icon: '🏪', title: 'Admin dashboard', desc: 'Real-time metrics and customer management for owners' },
            { icon: '📍', title: 'Location tracking', desc: 'Every transaction logged with store location' },
          ].map(f => (
            <div key={f.title} style={{
              background: '#fff', borderRadius: 14, padding: '20px 16px',
              textAlign: 'left', border: '1px solid #f0f0f0'
            }}>
              <p style={{ fontSize: 24, margin: '0 0 10px' }}>{f.icon}</p>
              <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>{f.title}</p>
              <p style={{ fontSize: 12, color: '#666', margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For store owners */}
      <section style={{ padding: '64px 20px', background: '#fff' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 12, color: '#0F6E56', fontWeight: 600, letterSpacing: 1, margin: '0 0 10px' }}>FOR STORE OWNERS</p>
              <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, margin: '0 0 14px', letterSpacing: -1 }}>Your customers come back</h2>
              <p style={{ fontSize: 15, color: '#666', margin: '0 0 20px', lineHeight: 1.7 }}>
                When coin change goes to a card instead of a pocket, customers have a reason to return. Their balance is waiting at your store.
              </p>
              {[
                'Reduce coin inventory management costs',
                'Increase repeat customer visits',
                'Real-time dashboard for all transactions',
                'Simple setup — works with any cash register',
              ].map(b => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#e8f8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: '#0F6E56' }}>✓</span>
                  </div>
                  <p style={{ fontSize: 14, margin: 0, color: '#333' }}>{b}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Total coins collected', value: '$312.47', sub: 'all time' },
                { label: 'Active cards', value: '184', sub: 'registered customers' },
                { label: 'Transactions today', value: '47', sub: 'avg $0.39 per txn' },
              ].map(s => (
                <div key={s.label} style={{
                  background: '#f9f9f9', borderRadius: 14, padding: '14px 18px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <p style={{ fontSize: 13, color: '#999', margin: 0 }}>{s.label}</p>
                    <p style={{ fontSize: 11, color: '#bbb', margin: '2px 0 0' }}>{s.sub}</p>
                  </div>
                  <p style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#0F6E56' }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Investors */}
      <section id="investors" style={{ padding: '64px 20px', background: '#f9f9f9', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#0F6E56', fontWeight: 600, letterSpacing: 1, margin: '0 0 10px' }}>FOR INVESTORS</p>
        <h2 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 800, margin: '0 0 14px', letterSpacing: -1 }}>A real problem. A working solution.</h2>
        <p style={{ fontSize: 15, color: '#666', margin: '0 auto 40px', maxWidth: 480, lineHeight: 1.7 }}>
          Change Wallet is a pre-seed fintech startup with a live product, real users, and a massive untapped market. We are looking for our first investor partners.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, maxWidth: 640, margin: '0 auto 40px' }}>
          {[
            { value: '$62M', label: 'coins lost annually' },
            { value: '$700B', label: 'convenience store market' },
            { value: '150K+', label: 'target locations in US' },
            { value: '$150K', label: 'pre-seed ask' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '18px 12px', border: '1px solid #f0f0f0' }}>
              <p style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, margin: '0 0 4px', color: '#0F6E56' }}>{s.value}</p>
              <p style={{ fontSize: 12, color: '#999', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setShowContact(true)} style={{
          background: '#0F6E56', color: '#fff', border: 'none',
          padding: '14px 36px', borderRadius: 12, fontSize: 16,
          fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(15,110,86,0.3)'
        }}>
          Contact us to invest
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '24px 20px', borderTop: '1px solid #f0f0f0',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🪙</span>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Change Wallet</span>
        </div>
        <p style={{ fontSize: 12, color: '#999', margin: 0 }}>Built by Sanketh Koritikanti · 2026</p>
        <div style={{ display: 'flex', gap: 16 }}>
          <a href="https://github.com/Sankethkoritikanti12/change-wallet" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>GitHub</a>
          <a href="#" onClick={e => { e.preventDefault(); onGetStarted(); }} style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>App</a>
          <a href="https://mail.google.com/mail/?view=cm&to=kortikantisanketh@gmail.com" target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>Contact</a>
        </div>
      </footer>

      {/* Contact popup */}
      {showContact && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 500, padding: 20
        }}>
          <div style={{
            background: '#fff', borderRadius: 20, padding: '28px 24px',
            width: '100%', maxWidth: 420,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <p style={{ fontWeight: 800, fontSize: 18, margin: 0 }}>Get in touch</p>
              <button onClick={() => setShowContact(false)} style={{
                background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#999'
              }}>✕</button>
            </div>
            <p style={{ fontSize: 13, color: '#999', margin: '0 0 16px' }}>
              Interested in investing in Change Wallet? Reach out directly:
            </p>
            {[
              { label: 'FOUNDER', value: 'Sanketh Koritikanti', sub: 'Full Stack Developer' },
              { label: 'EMAIL', value: 'kortikantisanketh@gmail.com', link: 'https://mail.google.com/mail/?view=cm&to=kortikantisanketh@gmail.com' },
              { label: 'GITHUB', value: 'github.com/Sankethkoritikanti12', link: 'https://github.com/Sankethkoritikanti12/change-wallet' },
              { label: 'LIVE DEMO', value: 'change-wallet.vercel.app', link: 'https://change-wallet.vercel.app' },
            ].map(item => (
              <div key={item.label} style={{ background: '#f9f9f9', borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
                <p style={{ fontSize: 11, color: '#999', margin: '0 0 4px' }}>{item.label}</p>
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noreferrer" style={{ fontWeight: 600, fontSize: 14, color: '#0F6E56', textDecoration: 'none' }}>
                    {item.value}
                  </a>
                ) : (
                  <>
                    <p style={{ fontWeight: 700, fontSize: 15, margin: '0 0 2px' }}>{item.value}</p>
                    {item.sub && <p style={{ fontSize: 13, color: '#666', margin: 0 }}>{item.sub}</p>}
                  </>
                )}
              </div>
            ))}
            <a href="https://mail.google.com/mail/?view=cm&to=kortikantisanketh@gmail.com&su=Change Wallet Investment Inquiry"
              target="_blank" rel="noreferrer" style={{
                display: 'block', textAlign: 'center',
                background: '#0F6E56', color: '#fff',
                padding: '14px', borderRadius: 12, fontSize: 15,
                fontWeight: 700, textDecoration: 'none', marginTop: 4
              }}>
              Send email now
            </a>
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 641px) {
          .mobile-menu-btn { display: none !important; }
        }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
      `}</style>

    </div>
  );
}