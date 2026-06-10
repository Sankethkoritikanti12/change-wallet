import { useState } from 'react';

export default function LandingPage({ onGetStarted }) {
  const [showContact, setShowContact] = useState(false);
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: '#111', background: '#fff' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 40px', borderBottom: '1px solid #f0f0f0',
        position: 'sticky', top: 0, background: '#fff', zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🪙</span>
          <span style={{ fontWeight: 800, fontSize: 18 }}>Change Wallet</span>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="#how" style={{ fontSize: 14, color: '#666', textDecoration: 'none' }}>How it works</a>
          <a href="#features" style={{ fontSize: 14, color: '#666', textDecoration: 'none' }}>Features</a>
          <a href="#investors" style={{ fontSize: 14, color: '#666', textDecoration: 'none' }}>Investors</a>
          <button onClick={onGetStarted} style={{
            background: '#0F6E56', color: '#fff', border: 'none',
            padding: '10px 20px', borderRadius: 10, fontSize: 14,
            fontWeight: 700, cursor: 'pointer'
          }}>
            Open App
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        textAlign: 'center', padding: '80px 24px 60px',
        background: 'linear-gradient(180deg, #f0faf6 0%, #fff 100%)'
      }}>
        <div style={{
          display: 'inline-block', background: '#e8f8f0', color: '#0F6E56',
          fontSize: 13, fontWeight: 600, padding: '6px 14px',
          borderRadius: 99, marginBottom: 20
        }}>
          Now live — try the demo today
        </div>
        <h1 style={{ fontSize: 56, fontWeight: 800, margin: '0 0 20px', lineHeight: 1.1, letterSpacing: -2 }}>
          Stop getting coins.<br />
          <span style={{ color: '#0F6E56' }}>Start building balance.</span>
        </h1>
        <p style={{ fontSize: 20, color: '#666', margin: '0 auto 36px', maxWidth: 560, lineHeight: 1.6 }}>
          Change Wallet automatically loads your coin change onto a digital gift card instead of your pocket. Works at any store, any register.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onGetStarted} style={{
            background: '#0F6E56', color: '#fff', border: 'none',
            padding: '14px 32px', borderRadius: 12, fontSize: 16,
            fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(15,110,86,0.3)'
          }}>
            Try the live demo
          </button>
          <a href="#how" style={{
            background: '#fff', color: '#111', border: '1.5px solid #e5e5e5',
            padding: '14px 32px', borderRadius: 12, fontSize: 16,
            fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
            display: 'inline-block'
          }}>
            See how it works
          </a>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: 0, justifyContent: 'center',
          marginTop: 60, flexWrap: 'wrap'
        }}>
          {[
            { value: '$62M', label: 'in coins lost annually in the US' },
            { value: '150K+', label: 'gas stations in the US' },
            { value: '$700B', label: 'convenience store annual sales' },
          ].map((s, i) => (
            <div key={s.label} style={{
              padding: '20px 40px', borderLeft: i > 0 ? '1px solid #e5e5e5' : 'none',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: 36, fontWeight: 800, margin: 0, color: '#0F6E56' }}>{s.value}</p>
              <p style={{ fontSize: 13, color: '#999', margin: '4px 0 0', maxWidth: 140 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '80px 24px', background: '#fff', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#0F6E56', fontWeight: 600, letterSpacing: 1, margin: '0 0 12px' }}>HOW IT WORKS</p>
        <h2 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 8px', letterSpacing: -1 }}>Three steps. Zero coins.</h2>
        <p style={{ fontSize: 16, color: '#666', margin: '0 auto 48px', maxWidth: 480 }}>
          From your first visit to a growing balance — it all happens automatically.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, maxWidth: 800, margin: '0 auto' }}>
          {[
            { step: '01', icon: '📲', title: 'Sign up once', desc: 'Create your free Change Wallet account and get a digital card linked to your phone number.' },
            { step: '02', icon: '🏪', title: 'Pay cash at any store', desc: 'Give the cashier your phone number or tap your physical card. Buy anything with cash.' },
            { step: '03', icon: '💳', title: 'Coins go to your card', desc: 'Instead of coins, the change loads to your card. Spend it next time — at any store.' },
          ].map(s => (
            <div key={s.step} style={{
              background: '#f9f9f9', borderRadius: 20, padding: '32px 24px',
              textAlign: 'left', position: 'relative'
            }}>
              <p style={{ fontSize: 11, color: '#0F6E56', fontWeight: 700, letterSpacing: 2, margin: '0 0 16px' }}>{s.step}</p>
              <p style={{ fontSize: 32, margin: '0 0 12px' }}>{s.icon}</p>
              <p style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>{s.title}</p>
              <p style={{ fontSize: 14, color: '#666', margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Transaction example */}
        <div style={{
          maxWidth: 480, margin: '48px auto 0',
          background: 'linear-gradient(135deg, #0F6E56, #1D9E75)',
          borderRadius: 20, padding: '28px 32px', textAlign: 'left',
          color: '#fff'
        }}>
          <p style={{ fontSize: 13, color: '#9FE1CB', margin: '0 0 16px', letterSpacing: 0.5 }}>EXAMPLE TRANSACTION</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Chips at gas station</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>$1.49</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Cash given</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>$20.00</span>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
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
      <section id="features" style={{ padding: '80px 24px', background: '#f9f9f9', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#0F6E56', fontWeight: 600, letterSpacing: 1, margin: '0 0 12px' }}>FEATURES</p>
        <h2 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 8px', letterSpacing: -1 }}>Everything in one card</h2>
        <p style={{ fontSize: 16, color: '#666', margin: '0 auto 48px', maxWidth: 480 }}>
          One card. Works at every store. Earns rewards everywhere.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, maxWidth: 900, margin: '0 auto' }}>
          {[
            { icon: '💳', title: 'Digital card', desc: 'Custom card themes — Forest, Ocean, Midnight, Gold, Galaxy' },
            { icon: '🪙', title: 'Auto coin change', desc: 'Coin change loads automatically every time you pay cash' },
            { icon: '🎁', title: 'Rewards stamps', desc: 'Earn $0.10 every 10 visits at Shell, Mobil, BP, Chevron' },
            { icon: '📦', title: 'Physical card', desc: 'Order a physical card mailed to your home address' },
            { icon: '📊', title: 'Transaction history', desc: 'Full history with store name, date, and location' },
            { icon: '💬', title: 'Chat support', desc: 'AI-powered support built right into the app' },
            { icon: '🏪', title: 'Admin dashboard', desc: 'Real-time metrics and customer management for store owners' },
            { icon: '📍', title: 'Location tracking', desc: 'Every transaction logged with store location' },
          ].map(f => (
            <div key={f.title} style={{
              background: '#fff', borderRadius: 16, padding: '24px 20px',
              textAlign: 'left', border: '1px solid #f0f0f0'
            }}>
              <p style={{ fontSize: 28, margin: '0 0 12px' }}>{f.icon}</p>
              <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px' }}>{f.title}</p>
              <p style={{ fontSize: 13, color: '#666', margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For store owners */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 13, color: '#0F6E56', fontWeight: 600, letterSpacing: 1, margin: '0 0 12px' }}>FOR STORE OWNERS</p>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 16px', letterSpacing: -1 }}>Your customers come back</h2>
            <p style={{ fontSize: 16, color: '#666', margin: '0 0 24px', lineHeight: 1.7 }}>
              When coin change goes to a card instead of a pocket, customers have a reason to return. Their balance is waiting at your store.
            </p>
            {[
              'Reduce coin inventory management costs',
              'Increase repeat customer visits',
              'Real-time dashboard for all transactions',
              'Simple setup — works with any cash register',
            ].map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#e8f8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: '#0F6E56' }}>✓</span>
                </div>
                <p style={{ fontSize: 14, margin: 0, color: '#333' }}>{b}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Total coins collected', value: '$312.47', sub: 'all time' },
              { label: 'Active cards', value: '184', sub: 'registered customers' },
              { label: 'Transactions today', value: '47', sub: 'avg $0.39 per txn' },
            ].map(s => (
              <div key={s.label} style={{
                background: '#f9f9f9', borderRadius: 14, padding: '16px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontSize: 13, color: '#999', margin: 0 }}>{s.label}</p>
                  <p style={{ fontSize: 11, color: '#bbb', margin: '2px 0 0' }}>{s.sub}</p>
                </div>
                <p style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#0F6E56' }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investors */}
      <section id="investors" style={{ padding: '80px 24px', background: '#f9f9f9', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#0F6E56', fontWeight: 600, letterSpacing: 1, margin: '0 0 12px' }}>FOR INVESTORS</p>
        <h2 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 16px', letterSpacing: -1 }}>A real problem. A working solution.</h2>
        <p style={{ fontSize: 16, color: '#666', margin: '0 auto 48px', maxWidth: 520, lineHeight: 1.7 }}>
          Change Wallet is a pre-seed fintech startup with a live product, real users, and a massive untapped market. We are looking for our first investor partners.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, maxWidth: 700, margin: '0 auto 48px' }}>
          {[
            { value: '$62M', label: 'coins lost annually' },
            { value: '$700B', label: 'convenience store market' },
            { value: '150K+', label: 'target locations in US' },
            { value: '$150K', label: 'pre-seed ask' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '20px', border: '1px solid #f0f0f0' }}>
              <p style={{ fontSize: 32, fontWeight: 800, margin: '0 0 4px', color: '#0F6E56' }}>{s.value}</p>
              <p style={{ fontSize: 13, color: '#999', margin: 0 }}>{s.label}</p>
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

{showContact && (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 500, padding: 24
  }}>
    <div style={{
      background: '#fff', borderRadius: 20, padding: 32,
      width: '100%', maxWidth: 440,
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ fontWeight: 800, fontSize: 20, margin: 0 }}>Get in touch</p>
        <button onClick={() => setShowContact(false)} style={{
          background: 'none', border: 'none', fontSize: 20,
          cursor: 'pointer', color: '#999'
        }}>✕</button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: '#999', margin: '0 0 16px' }}>
          Interested in investing in Change Wallet? Reach out directly:
        </p>
        <div style={{ background: '#f9f9f9', borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: '#999', margin: '0 0 4px' }}>FOUNDER</p>
          <p style={{ fontWeight: 700, fontSize: 16, margin: '0 0 4px' }}>Sanketh Koritikanti</p>
          <p style={{ fontSize: 14, color: '#666', margin: 0 }}>Full Stack Developer</p>
        </div>
        <div style={{ background: '#f9f9f9', borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: '#999', margin: '0 0 4px' }}>EMAIL</p>
          <a href="mailto:kortikantisanketh@gmail.com" style={{ fontWeight: 600, fontSize: 15, color: '#0F6E56', textDecoration: 'none' }}>
            kortikantisanketh@gmail.com
          </a>
        </div>
        <div style={{ background: '#f9f9f9', borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: '#999', margin: '0 0 4px' }}>GITHUB</p>
          <a href="https://github.com/Sankethkoritikanti12/change-wallet" target="_blank" rel="noreferrer" style={{ fontWeight: 600, fontSize: 15, color: '#0F6E56', textDecoration: 'none' }}>
            github.com/Sankethkoritikanti12
          </a>
        </div>
        <div style={{ background: '#f9f9f9', borderRadius: 12, padding: '16px 20px' }}>
          <p style={{ fontSize: 12, color: '#999', margin: '0 0 4px' }}>LIVE DEMO</p>
          <a href="https://change-wallet.vercel.app" target="_blank" rel="noreferrer" style={{ fontWeight: 600, fontSize: 15, color: '#0F6E56', textDecoration: 'none' }}>
            change-wallet.vercel.app
          </a>
        </div>
      </div>

      <a href="mailto:kortikantisanketh@gmail.com" style={{
        display: 'block', textAlign: 'center',
        background: '#0F6E56', color: '#fff',
        padding: '14px', borderRadius: 12, fontSize: 15,
        fontWeight: 700, textDecoration: 'none',
        marginTop: 8
      }}>
        Send email now
      </a>
    </div>
  </div>
)}
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px 40px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🪙</span>
          <span style={{ fontWeight: 700 }}>Change Wallet</span>
        </div>
        <p style={{ fontSize: 13, color: '#999', margin: 0 }}>Built by Sanketh Koritikanti · 2026</p>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="https://github.com/Sankethkoritikanti12/change-wallet" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>GitHub</a>
          <a href="#" onClick={e => { e.preventDefault(); onGetStarted(); }} style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>App</a>
          <a href="mailto:kortikantisanketh@gmail.com" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>Contact</a>
        </div>
      </footer>

    </div>
  );
}