import { useState } from 'react';
import { registerApi } from '../api';

const regApi = registerApi('test-register-key-12345');

function formatMoney(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}
function parseCents(str) {
  const num = parseFloat(str.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
}

export default function RegisterScreen() {
  const [phone, setPhone] = useState('');
  const [customer, setCustomer] = useState(null);
  const [purchase, setPurchase] = useState('');
  const [cashGiven, setCashGiven] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('lookup'); // lookup | transaction | tap | done
  const [tapMode, setTapMode] = useState(false);
  const [tapStatus, setTapStatus] = useState('waiting'); // waiting | detected | confirmed

  function formatPhone(raw) {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  }

  async function lookupCustomer() {
    setError('');
    setLoading(true);
    try {
      const { api } = await import('../api');
      const data = await api.lookupCustomer(phone);
      setCustomer(data);
      setStep('transaction');
    } catch {
      setError('Customer not found. Check the phone number.');
    } finally {
      setLoading(false);
    }
  }

  async function processTransaction(customerData) {
    setError('');
    setLoading(true);
    const purchaseCents = parseCents(purchase);
    const cashCents = parseCents(cashGiven);
    if (purchaseCents === 0 || cashCents === 0) {
      setError('Enter valid purchase total and cash amount');
      setLoading(false);
      return;
    }
    if (cashCents < purchaseCents) {
      setError('Cash given is less than purchase total');
      setLoading(false);
      return;
    }
    const c = customerData || customer;
    try {
      const data = await regApi.processTransaction(
        c.customer.phoneNumber || phone.replace(/\D/g, ''),
        purchaseCents, cashCents
      );
      setResult(data);
      setStep('done');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Simulate NFC tap detection
  function simulateTap() {
    setTapStatus('detected');
    setTimeout(() => {
      setTapStatus('confirmed');
      setTimeout(() => {
        processTransaction(customer);
      }, 1000);
    }, 1500);
  }

  function reset() {
    setPhone(''); setCustomer(null); setPurchase('');
    setCashGiven(''); setResult(null); setError('');
    setStep('lookup'); setTapMode(false); setTapStatus('waiting');
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: '1.5px solid #e5e5e5', fontSize: 15,
    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
  };
  const labelStyle = { fontSize: 12, color: '#999', display: 'block', marginBottom: 4, fontWeight: 500 };
  const card = { padding: '20px', background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', marginBottom: 16 };
  const btn = { width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: '#0F6E56', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' };

  // ── Step: Tap mode ─────────────────────────
  if (step === 'transaction' && tapMode) return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '32px 16px', textAlign: 'center' }}>
      <p style={{ fontWeight: 700, fontSize: 22, margin: '0 0 4px' }}>Tap to Receive</p>
      <p style={{ fontSize: 14, color: '#999', margin: '0 0 28px' }}>Customer taps phone or card on reader</p>

      {/* Customer info */}
      <div style={{ ...card, textAlign: 'left', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>{customer.customer.name}</p>
            <p style={{ fontSize: 13, color: '#999', margin: '2px 0 0' }}>{customer.card.cardNumber}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 12, color: '#999', margin: 0 }}>Balance</p>
            <p style={{ fontWeight: 700, fontSize: 18, color: '#0F6E56', margin: 0 }}>{formatMoney(customer.card.balanceCents)}</p>
          </div>
        </div>
      </div>

      {/* Change preview */}
      {(() => {
        const purchaseCents = parseCents(purchase);
        const cashCents = parseCents(cashGiven);
        const changeOwed = cashCents - purchaseCents;
        const cashBack = Math.floor(changeOwed / 100) * 100;
        const toCard = changeOwed - cashBack;
        return (
          <div style={{ background: '#f0faf6', borderRadius: 14, padding: '16px 20px', marginBottom: 24, border: '1.5px solid #9FE1CB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: '#0F6E56' }}>Give back in bills</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#0F6E56' }}>{formatMoney(cashBack)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#1D9E75' }}>Loading to card on tap</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1D9E75' }}>+{formatMoney(toCard)}</span>
            </div>
          </div>
        );
      })()}

      {/* NFC tap area */}
      <div onClick={tapStatus === 'waiting' ? simulateTap : undefined} style={{
        width: 180, height: 180, borderRadius: '50%', margin: '0 auto 24px',
        background: tapStatus === 'confirmed' ? '#0F6E56' : tapStatus === 'detected' ? '#1D9E75' : '#f0faf6',
        border: `4px solid ${tapStatus === 'waiting' ? '#9FE1CB' : '#0F6E56'}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: tapStatus === 'waiting' ? 'pointer' : 'default',
        transition: 'all 0.3s',
        boxShadow: tapStatus === 'waiting' ? '0 0 0 8px rgba(15,110,86,0.1)' : '0 8px 32px rgba(15,110,86,0.4)'
      }}>
        <span style={{ fontSize: 48, marginBottom: 8 }}>
          {tapStatus === 'confirmed' ? '✓' : tapStatus === 'detected' ? '📡' : '📲'}
        </span>
        <p style={{
          fontSize: 13, fontWeight: 600, margin: 0,
          color: tapStatus === 'waiting' ? '#0F6E56' : '#fff'
        }}>
          {tapStatus === 'confirmed' ? 'Card detected!' : tapStatus === 'detected' ? 'Reading card...' : 'Tap here'}
        </p>
      </div>

      <p style={{ fontSize: 13, color: '#999', margin: '0 0 20px' }}>
        {tapStatus === 'waiting' ? 'Ask customer to tap their phone or card on the reader' :
         tapStatus === 'detected' ? 'Card detected — processing...' :
         'Confirmed! Loading change to card...'}
      </p>

      <button onClick={() => { setTapMode(false); setTapStatus('waiting'); }} style={{
        ...btn, background: '#fff', color: '#333', border: '1.5px solid #e5e5e5'
      }}>
        Switch to phone number instead
      </button>
    </div>
  );

  // ── Step 1: Look up customer ──────────────
  if (step === 'lookup') return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '32px 16px' }}>
      <p style={{ fontWeight: 700, fontSize: 22, margin: '0 0 4px' }}>Register</p>
      <p style={{ color: '#999', fontSize: 14, margin: '0 0 24px' }}>Look up customer to process change</p>

      {/* Two options */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div style={{
          ...card, marginBottom: 0, textAlign: 'center', cursor: 'pointer',
          border: '1.5px solid #9FE1CB', background: '#f0faf6'
        }} onClick={() => { /* phone lookup - already default */ }}>
          <p style={{ fontSize: 28, margin: '0 0 6px' }}>📱</p>
          <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: '#0F6E56' }}>Phone number</p>
        </div>
        <div style={{
          ...card, marginBottom: 0, textAlign: 'center', cursor: 'pointer',
          border: '1.5px solid #e5e5e5'
        }} onClick={() => alert('NFC hardware required for real tap. Use phone number for demo.')}>
          <p style={{ fontSize: 28, margin: '0 0 6px' }}>📲</p>
          <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: '#333' }}>Tap card / NFC</p>
        </div>
      </div>

      <div style={card}>
        <span style={labelStyle}>Customer phone number</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <input style={{ ...inputStyle, flex: 1 }} type="tel" value={phone}
            onChange={e => setPhone(formatPhone(e.target.value))}
            placeholder="(248) 555-0192"
            onKeyDown={e => e.key === 'Enter' && lookupCustomer()} />
          <button onClick={lookupCustomer} disabled={loading || phone.length < 10} style={{
            ...btn, width: 'auto', padding: '12px 20px', fontSize: 14
          }}>
            {loading ? '...' : 'Look up'}
          </button>
        </div>
        {error && <p style={{ color: '#e53e3e', fontSize: 13, margin: '10px 0 0' }}>{error}</p>}
      </div>

      <p style={{ fontSize: 13, color: '#bbb', textAlign: 'center' }}>
        Customer can also show their card QR code
      </p>
    </div>
  );

  // ── Step 2: Enter transaction ─────────────
  if (step === 'transaction') {
    const purchaseCents = parseCents(purchase);
    const cashCents = parseCents(cashGiven);
    const changeOwed = cashCents - purchaseCents;
    const cashBack = Math.floor(changeOwed / 100) * 100;
    const toCard = changeOwed - cashBack;
    const showPreview = purchaseCents > 0 && cashCents >= purchaseCents;

    return (
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '32px 16px' }}>
        <p style={{ fontWeight: 700, fontSize: 22, margin: '0 0 20px' }}>Register</p>

        {/* Customer info */}
        <div style={{ ...card, background: '#f0faf6', border: '1.5px solid #9FE1CB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>{customer.customer.name}</p>
              <p style={{ margin: 0, fontSize: 13, color: '#999', marginTop: 2 }}>{customer.card.cardNumber}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 12, color: '#999', margin: 0 }}>Card balance</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 20, color: '#0F6E56' }}>{formatMoney(customer.card.balanceCents)}</p>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div style={card}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <span style={labelStyle}>Purchase total</span>
              <input style={inputStyle} type="text" value={purchase}
                onChange={e => setPurchase(e.target.value)} placeholder="$1.49" />
            </div>
            <div>
              <span style={labelStyle}>Cash given</span>
              <input style={inputStyle} type="text" value={cashGiven}
                onChange={e => setCashGiven(e.target.value)} placeholder="$20.00" />
            </div>
          </div>

          {showPreview && (
            <div style={{ background: '#f0faf6', borderRadius: 10, padding: '14px 16px', border: '1.5px solid #9FE1CB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: '#0F6E56' }}>Give back in bills</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#0F6E56' }}>{formatMoney(cashBack)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#1D9E75' }}>Added to card</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1D9E75' }}>+{formatMoney(toCard)}</span>
              </div>
            </div>
          )}
        </div>

        {error && <p style={{ color: '#e53e3e', fontSize: 13, margin: '-8px 0 12px' }}>{error}</p>}

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Tap to receive button */}
          {showPreview && (
            <button onClick={() => setTapMode(true)} style={{
              ...btn, background: 'linear-gradient(135deg, #0F6E56, #1D9E75)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(15,110,86,0.3)'
            }}>
              <span style={{ fontSize: 20 }}>📲</span>
              Ask customer to tap card
            </button>
          )}

          <button onClick={() => processTransaction(null)} disabled={loading} style={{
            ...btn,
            background: showPreview ? '#fff' : '#0F6E56',
            color: showPreview ? '#333' : '#fff',
            border: showPreview ? '1.5px solid #e5e5e5' : 'none'
          }}>
            {loading ? 'Processing...' : showPreview ? 'Confirm without tap' : 'Confirm transaction'}
          </button>

          <button onClick={reset} style={{ ...btn, background: '#fff', color: '#333', border: '1.5px solid #e5e5e5' }}>
            Back
          </button>
        </div>
      </div>
    );
  }

  // ── Step 3: Done ──────────────────────────
  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '32px 16px', textAlign: 'center' }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%', background: '#f0faf6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px', fontSize: 32
      }}>✓</div>

      <p style={{ fontWeight: 700, fontSize: 24, margin: '0 0 6px' }}>Done!</p>
      <p style={{ color: '#999', fontSize: 14, margin: '0 0 24px' }}>Change loaded to card successfully</p>

      <div style={{ ...card, textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
          <span style={{ fontSize: 14, color: '#999' }}>Give back in bills</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#0F6E56' }}>{result.display.cashBack}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
          <span style={{ fontSize: 14, color: '#999' }}>Added to card</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1D9E75' }}>+{result.display.addedToCard}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
          <span style={{ fontSize: 14, color: '#999' }}>New card balance</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{result.display.newBalance}</span>
        </div>
      </div>

      <button onClick={reset} style={btn}>Next customer</button>
    </div>
  );
}