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
  const [step, setStep] = useState('lookup');

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
    } catch (err) {
      setError('Customer not found. Check the phone number.');
    } finally {
      setLoading(false);
    }
  }

  async function processTransaction() {
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
    try {
      // Auto-detect location
let location = null;
try {
  const pos = await new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
  );
  location = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
} catch {
  location = req?.store?.address || null;
}

const data = await regApi.processTransaction(
  phone.replace(/\D/g, ''), purchaseCents, cashCents, location
);
      setResult(data);
      setStep('done');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setPhone(''); setCustomer(null); setPurchase('');
    setCashGiven(''); setResult(null); setError('');
    setStep('lookup');
  }

  const card = { padding: '20px', background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', marginBottom: 16 };
  const label = { fontSize: 12, color: '#999', marginBottom: 4, display: 'block', fontWeight: 500, letterSpacing: 0.3 };
  const input = { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e5e5e5', fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };
  const btn = { width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: '#0F6E56', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' };

  if (step === 'lookup') return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '32px 16px' }}>
      <p style={{ fontWeight: 700, fontSize: 22, margin: '0 0 6px' }}>Register</p>
      <p style={{ color: '#999', fontSize: 14, margin: '0 0 28px' }}>Look up customer by phone number</p>

      <div style={card}>
        <span style={label}>Customer phone number</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            style={{ ...input, flex: 1 }}
            type="tel" value={phone}
            onChange={e => setPhone(formatPhone(e.target.value))}
            placeholder="(248) 555-0192"
            onKeyDown={e => e.key === 'Enter' && lookupCustomer()}
          />
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
              <p style={{ margin: 0, fontSize: 12, color: '#999' }}>Card balance</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 20, color: '#0F6E56' }}>
                {formatMoney(customer.card.balanceCents)}
              </p>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div style={card}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <span style={label}>Purchase total</span>
              <input style={input} type="text" value={purchase}
                onChange={e => setPurchase(e.target.value)} placeholder="$1.49" />
            </div>
            <div>
              <span style={label}>Cash given</span>
              <input style={input} type="text" value={cashGiven}
                onChange={e => setCashGiven(e.target.value)} placeholder="$20.00" />
            </div>
          </div>

          {/* Live preview */}
          {showPreview && (
            <div style={{
              background: '#f0faf6', borderRadius: 10, padding: '14px 16px',
              border: '1.5px solid #9FE1CB'
            }}>
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

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={reset} style={{ ...btn, background: '#fff', color: '#333', border: '1.5px solid #e5e5e5', flex: 1 }}>
            Back
          </button>
          <button onClick={processTransaction} disabled={loading} style={{ ...btn, flex: 2 }}>
            {loading ? 'Processing...' : 'Confirm transaction'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '32px 16px', textAlign: 'center' }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%', background: '#f0faf6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px', fontSize: 32
      }}>✓</div>

      <p style={{ fontWeight: 700, fontSize: 24, margin: '0 0 6px' }}>Done!</p>
      <p style={{ color: '#999', fontSize: 14, margin: '0 0 24px' }}>Transaction complete</p>

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