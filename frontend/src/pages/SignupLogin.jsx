import { useState } from 'react';
import { api } from '../api';

const CARD_DESIGNS = [
  { id: 'green', label: 'Forest', gradient: 'linear-gradient(135deg, #0F6E56, #1D9E75)', emoji: '🌿' },
  { id: 'blue', label: 'Ocean', gradient: 'linear-gradient(135deg, #1a5fa8, #2980d9)', emoji: '🌊' },
  { id: 'dark', label: 'Midnight', gradient: 'linear-gradient(135deg, #1a1a2e, #16213e)', emoji: '🌙' },
  { id: 'gold', label: 'Gold', gradient: 'linear-gradient(135deg, #b8860b, #ffd700)', emoji: '✨' },
  { id: 'purple', label: 'Galaxy', gradient: 'linear-gradient(135deg, #6B3FA0, #9b59b6)', emoji: '🔮' },
];

export default function SignupLogin({ onSuccess }) {
  const [mode, setMode] = useState('login');
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [selectedCard, setSelectedCard] = useState(CARD_DESIGNS[0]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function formatPhone(raw) {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(phone, password);
      api.saveToken(data.token);
      onSuccess(data.customer, data.card);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleNextStep(e) {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (!name.trim()) { setError('Please enter your full name'); return; }
    if (cleanPhone.length !== 10) { setError('Please enter a valid 10-digit phone number'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (!address || !city || !state || !zip) { setError('Please fill in your delivery address'); return; }
    setError('');
    setStep(2);
  }

  async function handleSignup() {
    setLoading(true);
    setError('');
    try {
      const data = await api.register(name, phone, password, email, address, city, state, zip);
      api.saveToken(data.token);
      onSuccess(data.customer, { ...data.card, theme: selectedCard }, data.order);
    } catch (err) {
      setError(err.message);
      setStep(1);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: '1.5px solid #e5e5e5', fontSize: 14,
    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
  };
  const labelStyle = { fontSize: 12, color: '#999', display: 'block', marginBottom: 4, fontWeight: 500 };

  // Step 2: Pick card
  if (mode === 'signup' && step === 2) return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '40px 16px', fontFamily: 'system-ui, sans-serif' }}>
      <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#999', padding: 0, marginBottom: 20 }}>← Back</button>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <p style={{ fontWeight: 800, fontSize: 22, margin: '0 0 6px' }}>Pick your card</p>
        <p style={{ fontSize: 14, color: '#999', margin: 0 }}>Choose a design for your Change Wallet card</p>
      </div>

      {/* Card preview */}
      <div style={{
        background: selectedCard.gradient, borderRadius: 20,
        padding: '24px 20px', marginBottom: 24,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)', transition: 'all 0.3s'
      }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, margin: '0 0 4px', letterSpacing: 1 }}>CHANGE WALLET</p>
        <p style={{ color: '#fff', fontSize: 32, fontWeight: 800, margin: '0 0 20px' }}>$0.00</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, margin: '0 0 2px' }}>CARDHOLDER</p>
            <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: 0 }}>{name || 'Your Name'}</p>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 22, margin: 0 }}>{selectedCard.emoji}</p>
        </div>
      </div>

      {/* Card options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 28 }}>
        {CARD_DESIGNS.map(card => (
          <div key={card.id} onClick={() => setSelectedCard(card)} style={{ cursor: 'pointer' }}>
            <div style={{
              height: 56, background: card.gradient, borderRadius: 10,
              border: selectedCard.id === card.id ? '3px solid #fff' : '3px solid transparent',
              boxShadow: selectedCard.id === card.id ? '0 0 0 2px #0F6E56' : 'none',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
            }}>{card.emoji}</div>
            <p style={{
              textAlign: 'center', fontSize: 10, margin: '4px 0 0',
              fontWeight: selectedCard.id === card.id ? 700 : 400,
              color: selectedCard.id === card.id ? '#0F6E56' : '#999'
            }}>{card.label}</p>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ background: '#fff5f5', border: '1.5px solid #feb2b2', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
          <p style={{ color: '#e53e3e', fontSize: 13, margin: 0 }}>{error}</p>
        </div>
      )}

      <button onClick={handleSignup} disabled={loading} style={{
        width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
        background: loading ? '#ccc' : selectedCard.gradient,
        color: '#fff', fontSize: 15, fontWeight: 700,
        cursor: loading ? 'not-allowed' : 'pointer',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
      }}>
        {loading ? 'Creating account...' : `Create account with ${selectedCard.label} card`}
      </button>
    </div>
  );

  // Step 1: Details
  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '40px 16px', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'linear-gradient(135deg, #0F6E56, #1D9E75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30, margin: '0 auto 16px',
          boxShadow: '0 8px 24px rgba(15,110,86,0.3)'
        }}>🪙</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px' }}>Change Wallet</h1>
        <p style={{ fontSize: 14, color: '#999', margin: 0 }}>Keep your coin change — load it to a card instead</p>
      </div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', background: '#f5f5f5', borderRadius: 12, padding: 4, marginBottom: 28 }}>
        {['login', 'signup'].map(m => (
          <button key={m} onClick={() => { setMode(m); setError(''); setStep(1); }} style={{
            flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
            background: mode === m ? '#fff' : 'transparent',
            fontWeight: mode === m ? 700 : 400, fontSize: 14, cursor: 'pointer',
            boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            color: mode === m ? '#0F6E56' : '#999', transition: 'all 0.2s'
          }}>
            {m === 'login' ? 'Sign in' : 'Sign up'}
          </button>
        ))}
      </div>

      <form onSubmit={mode === 'login' ? handleLogin : handleNextStep}>

        {mode === 'signup' && (
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>FULL NAME</label>
            <input style={inputStyle} type="text" value={name}
              onChange={e => setName(e.target.value)} placeholder="Your full name" required />
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>PHONE NUMBER</label>
          <input style={inputStyle} type="tel" value={phone}
            onChange={e => setPhone(formatPhone(e.target.value))}
            placeholder="(248) 555-0192" required />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>PASSWORD</label>
          <div style={{ position: 'relative' }}>
            <input
              style={{ ...inputStyle, paddingRight: 44 }}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={mode === 'login' ? 'Enter your password' : 'Create a password (min 6 characters)'}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#999'
            }}>
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>
        </div>

        {mode === 'signup' && (
          <>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>CONFIRM PASSWORD</label>
              <input style={inputStyle} type="password" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password" required />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>EMAIL (OPTIONAL)</label>
              <input style={inputStyle} type="email" value={email}
                onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>

            <div style={{ background: '#f9f9f9', borderRadius: 14, padding: 16, marginBottom: 14, border: '1.5px solid #e5e5e5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>📦</span>
                <p style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>Delivery address</p>
              </div>
              <p style={{ fontSize: 12, color: '#999', margin: '0 0 14px' }}>We will mail your physical Change Wallet card here</p>
              <div style={{ marginBottom: 10 }}>
                <label style={labelStyle}>STREET ADDRESS</label>
                <input style={inputStyle} type="text" value={address}
                  onChange={e => setAddress(e.target.value)} placeholder="1234 Main St" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={labelStyle}>CITY</label>
                  <input style={inputStyle} type="text" value={city}
                    onChange={e => setCity(e.target.value)} placeholder="Southfield" required />
                </div>
                <div>
                  <label style={labelStyle}>STATE</label>
                  <input style={{ ...inputStyle, textTransform: 'uppercase' }} type="text" value={state}
                    onChange={e => setState(e.target.value)} placeholder="MI" required maxLength={2} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>ZIP CODE</label>
                <input style={inputStyle} type="text" value={zip}
                  onChange={e => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="48075" required maxLength={5} />
              </div>
            </div>
          </>
        )}

        {error && (
          <div style={{ background: '#fff5f5', border: '1.5px solid #feb2b2', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
            <p style={{ color: '#e53e3e', fontSize: 13, margin: 0 }}>{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
          background: loading ? '#ccc' : 'linear-gradient(135deg, #0F6E56, #1D9E75)',
          color: '#fff', fontSize: 15, fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: loading ? 'none' : '0 4px 16px rgba(15,110,86,0.3)'
        }}>
          {loading ? 'Loading...' : mode === 'login' ? 'Sign in' : 'Next — Pick your card →'}
        </button>
      </form>

      {mode === 'login' && (
        <p style={{ fontSize: 12, color: '#999', marginTop: 16, textAlign: 'center' }}>
          Don't have an account?{' '}
          <span onClick={() => { setMode('signup'); setError(''); }} style={{ color: '#0F6E56', cursor: 'pointer', fontWeight: 600 }}>
            Sign up here
          </span>
        </p>
      )}
    </div>
  );
}