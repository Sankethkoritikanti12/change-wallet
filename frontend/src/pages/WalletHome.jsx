import { useState, useEffect } from 'react';
import { api } from '../api';
import RewardsTab from './RewardsTab';
function formatMoney(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}
function formatDate(iso) {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (isToday) return `Today, ${time}`;
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${time}`;
}

const CARD_THEMES = [
  { id: 'green', gradient: 'linear-gradient(135deg, #0F6E56, #1D9E75)' },
  { id: 'blue', gradient: 'linear-gradient(135deg, #1a5fa8, #2980d9)' },
  { id: 'dark', gradient: 'linear-gradient(135deg, #1a1a2e, #16213e)' },
  { id: 'gold', gradient: 'linear-gradient(135deg, #b8860b, #ffd700)' },
  { id: 'purple', gradient: 'linear-gradient(135deg, #6B3FA0, #9b59b6)' },
  { id: 'red', gradient: 'linear-gradient(135deg, #c0392b, #e74c3c)' },
];

function ChatSupport({ customer }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hi ${customer.name.split(' ')[0]}! 👋 How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customer.name,
          messages: newMessages.filter((m, i) => i > 0).map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(!open)} style={{
        position: 'fixed', bottom: 80, right: 20, width: 52, height: 52,
        borderRadius: '50%', background: '#0F6E56', border: 'none',
        color: '#fff', fontSize: 22, cursor: 'pointer', zIndex: 200,
        boxShadow: '0 4px 16px rgba(15,110,86,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: 144, right: 16, width: 320,
          background: '#fff', borderRadius: 20, zIndex: 200,
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', maxHeight: 440
        }}>
          <div style={{ background: '#0F6E56', padding: '14px 16px' }}>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: 0 }}>Support</p>
            <p style={{ color: '#9FE1CB', fontSize: 12, margin: 0 }}>Change Wallet · Online</p>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: 14,
                  fontSize: 13, lineHeight: 1.5,
                  background: m.role === 'user' ? '#0F6E56' : '#f5f5f5',
                  color: m.role === 'user' ? '#fff' : '#111',
                  borderBottomRightRadius: m.role === 'user' ? 4 : 14,
                  borderBottomLeftRadius: m.role === 'assistant' ? 4 : 14,
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#f5f5f5', padding: '10px 14px', borderRadius: 14, fontSize: 13, color: '#999' }}>
                  Typing...
                </div>
              </div>
            )}
          </div>
          <div style={{ padding: '10px 12px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Type a message..."
              style={{ flex: 1, border: '1.5px solid #e5e5e5', borderRadius: 10, padding: '8px 12px', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
            />
            <button onClick={send} disabled={loading || !input.trim()} style={{
              background: '#0F6E56', border: 'none', borderRadius: 10,
              color: '#fff', padding: '8px 14px', fontSize: 13, cursor: 'pointer', fontWeight: 600
            }}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function CardsTab({ card, history }) {
 const [cards, setCards] = useState([
    { id: card.id, number: card.cardNumber, balance: card.balanceCents, theme: card.theme || CARD_THEMES[0], label: 'My Card' }
  ]);
  const [selectedCard, setSelectedCard] = useState(cards[0]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [newCardColor, setNewCardColor] = useState('#1a5fa8');
  const [newCardLabel, setNewCardLabel] = useState('');

  const cardTxns = history.slice(0, 10);

  function addCard() {
    const newCard = {
      id: Date.now(),
      number: `CW-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      balance: 0,
      theme: { id: 'custom', gradient: `linear-gradient(135deg, ${newCardColor}, ${newCardColor}dd)` },
      label: newCardLabel || 'New Card'
    };
    setCards(prev => [...prev, newCard]);
    setSelectedCard(newCard);
    setShowAddCard(false);
    setNewCardLabel('');
  }

  return (
    <div style={{ padding: '20px 16px 100px' }}>
      <p style={{ fontWeight: 700, fontSize: 20, margin: '0 0 20px' }}>My Cards</p>

      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, marginBottom: 20 }}>
        {cards.map(c => (
          <div key={c.id} onClick={() => setSelectedCard(c)} style={{
            minWidth: 260, height: 150, borderRadius: 18, padding: '20px',
            background: c.theme.gradient, cursor: 'pointer', flexShrink: 0,
            boxShadow: selectedCard.id === c.id ? '0 8px 24px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.1)',
            transform: selectedCard.id === c.id ? 'scale(1.03)' : 'scale(1)',
            transition: 'all 0.2s'
          }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, margin: '0 0 4px', letterSpacing: 1 }}>
              {c.label.toUpperCase()}
            </p>
            <p style={{ color: '#fff', fontSize: 26, fontWeight: 700, margin: '0 0 24px' }}>
              {formatMoney(c.balance)}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: 0, letterSpacing: 2 }}>
              {c.number}
            </p>
          </div>
        ))}
        <div onClick={() => setShowAddCard(true)} style={{
          minWidth: 260, height: 150, borderRadius: 18,
          border: '2px dashed #e5e5e5', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          flexShrink: 0, color: '#999', gap: 8
        }}>
          <span style={{ fontSize: 28 }}>+</span>
          <span style={{ fontSize: 13 }}>Add new card</span>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>{selectedCard.label} — Transactions</p>
          <button onClick={() => setShowThemePicker(true)} style={{
            fontSize: 12, padding: '4px 10px', borderRadius: 8,
            border: '1px solid #e5e5e5', background: '#fafafa', cursor: 'pointer'
          }}>
            Change theme
          </button>
        </div>
        {cardTxns.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#999', fontSize: 14 }}>No transactions yet</div>
        ) : (
          cardTxns.map((t, i) => (
            <div key={t.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px', borderTop: i > 0 ? '1px solid #f0f0f0' : 'none',
              background: i % 2 === 0 ? '#fff' : '#fafafa'
            }}>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{t.storeName}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#999' }}>{formatDate(t.date)}</p>
              </div>
              <p style={{ margin: 0, fontWeight: 700, color: t.amountCents > 0 ? '#0F6E56' : '#e53e3e' }}>
                {t.amountDisplay}
              </p>
            </div>
          ))
        )}
      </div>

      {showAddCard && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 300 }}>
          <div style={{ background: '#fff', borderRadius: '20px 20px 0 0', padding: 28, width: '100%' }}>
            <p style={{ fontWeight: 700, fontSize: 18, margin: '0 0 20px' }}>Add New Card</p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: '#999', display: 'block', marginBottom: 4 }}>Card label</label>
              <input value={newCardLabel} onChange={e => setNewCardLabel(e.target.value)}
                placeholder="e.g. Gas Station Card"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e5e5e5', fontSize: 14, boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none' }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, color: '#999', display: 'block', marginBottom: 4 }}>Pick card color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input type="color" value={newCardColor} onChange={e => setNewCardColor(e.target.value)}
                  style={{ width: 48, height: 48, borderRadius: 10, border: 'none', cursor: 'pointer', padding: 2 }}
                />
                <div style={{ flex: 1, height: 48, borderRadius: 10, background: `linear-gradient(135deg, ${newCardColor}, ${newCardColor}aa)` }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowAddCard(false)} style={{ flex: 1, padding: 14, borderRadius: 12, border: '1.5px solid #e5e5e5', background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={addCard} style={{ flex: 2, padding: 14, borderRadius: 12, border: 'none', background: '#0F6E56', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}

      {showThemePicker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 300 }}>
          <div style={{ background: '#fff', borderRadius: '20px 20px 0 0', padding: 28, width: '100%' }}>
            <p style={{ fontWeight: 700, fontSize: 18, margin: '0 0 20px' }}>Pick a Theme</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              {CARD_THEMES.map(t => (
                <div key={t.id} onClick={() => {
                  setCards(prev => prev.map(c => c.id === selectedCard.id ? { ...c, theme: t } : c));
                  setSelectedCard(prev => ({ ...prev, theme: t }));
                  setShowThemePicker(false);
                }} style={{
                  height: 70, borderRadius: 12, background: t.gradient, cursor: 'pointer',
                  border: selectedCard.theme.id === t.id ? '3px solid #fff' : '3px solid transparent',
                  boxShadow: selectedCard.theme.id === t.id ? '0 0 0 2px #0F6E56' : 'none'
                }} />
              ))}
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#999', display: 'block', marginBottom: 8 }}>Or pick a custom color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input type="color" defaultValue="#0F6E56" onChange={e => {
                  const custom = { id: 'custom', gradient: `linear-gradient(135deg, ${e.target.value}, ${e.target.value}aa)` };
                  setCards(prev => prev.map(c => c.id === selectedCard.id ? { ...c, theme: custom } : c));
                  setSelectedCard(prev => ({ ...prev, theme: custom }));
                }} style={{ width: 48, height: 48, borderRadius: 10, border: 'none', cursor: 'pointer', padding: 2 }} />
                <p style={{ fontSize: 13, color: '#999', margin: 0 }}>Choose any color for your card</p>
              </div>
            </div>
            <button onClick={() => setShowThemePicker(false)} style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: '#0F6E56', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryTab({ history, loading }) {
  return (
    <div style={{ padding: '20px 16px 100px' }}>
      <p style={{ fontWeight: 700, fontSize: 20, margin: '0 0 20px' }}>Transaction History</p>
      {loading && <p style={{ color: '#999', textAlign: 'center', padding: 20 }}>Loading...</p>}
      {!loading && history.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f9f9f9', borderRadius: 16, color: '#999' }}>
          <p style={{ fontSize: 32, margin: '0 0 8px' }}>🪙</p>
          <p style={{ fontSize: 14, margin: 0 }}>No transactions yet</p>
        </div>
      )}
      <div style={{ borderRadius: 16, overflow: 'hidden', border: history.length > 0 ? '1px solid #f0f0f0' : 'none' }}>
        {history.map((t, i) => (
          <div key={t.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 16px', background: i % 2 === 0 ? '#fff' : '#fafafa',
            borderBottom: i < history.length - 1 ? '1px solid #f0f0f0' : 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: t.amountCents > 0 ? '#f0faf6' : '#fef0f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0
              }}>
                {t.amountCents > 0 ? '🪙' : '💳'}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{t.storeName}</p>
<p style={{ margin: 0, fontSize: 12, color: '#999', marginTop: 2 }}>{formatDate(t.date)}</p>
{t.location && (
  <p style={{ margin: 0, fontSize: 11, color: '#bbb', marginTop: 1 }}>
     {t.location}
  </p>
)}
              </div>
            </div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: t.amountCents > 0 ? '#0F6E56' : '#e53e3e' }}>
              {t.amountDisplay}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeTab({ customer, card, history, onShowCard }) {
  const totalSaved = history.reduce((sum, t) => t.amountCents > 0 ? sum + t.amountCents : sum, 0);
  const thisMonth = history.filter(t => {
    const d = new Date(t.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.amountCents > 0;
  }).reduce((sum, t) => sum + t.amountCents, 0);
  const positiveTxns = history.filter(t => t.amountCents > 0);

  return (
    <div style={{ padding: '20px 16px 100px' }}>
      <div style={{
        background: card.theme ? card.theme.gradient : 'linear-gradient(135deg, #0F6E56 0%, #1D9E75 100%)',
        borderRadius: 24, padding: '28px 24px', marginBottom: 20,
        boxShadow: '0 8px 32px rgba(15,110,86,0.3)'
      }}>
        <p style={{ color: '#9FE1CB', fontSize: 12, margin: '0 0 4px', letterSpacing: 1 }}>TOTAL BALANCE</p>
        <p style={{ color: '#fff', fontSize: 52, fontWeight: 800, margin: '0 0 20px', letterSpacing: -2 }}>
          {formatMoney(card.balanceCents)}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, margin: '0 0 2px' }}>CARDHOLDER</p>
            <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, margin: 0 }}>{customer.name}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, margin: '0 0 2px' }}>CARD</p>
            <p style={{ color: '#fff', fontSize: 13, margin: 0, letterSpacing: 2 }}>{card.cardNumber}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <button onClick={onShowCard} style={{
          padding: '16px', borderRadius: 16, border: 'none',
          background: '#0F6E56', color: '#fff', fontSize: 14, fontWeight: 700,
          cursor: 'pointer', textAlign: 'left'
        }}>
          <p style={{ margin: '0 0 4px', fontSize: 22 }}>📲</p>
          Show Card
        </button>
        <button style={{
          padding: '16px', borderRadius: 16, border: '1.5px solid #f0f0f0',
          background: '#fff', color: '#111', fontSize: 14, fontWeight: 700,
          cursor: 'pointer', textAlign: 'left'
        }}>
          <p style={{ margin: '0 0 4px', fontSize: 22 }}>📊</p>
          Stats
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total saved', value: formatMoney(totalSaved), icon: '💰' },
          { label: 'This month', value: formatMoney(thisMonth), icon: '📅' },
          { label: 'Transactions', value: history.length, icon: '🔄' },
          { label: 'Avg per visit', value: positiveTxns.length > 0 ? formatMoney(Math.round(totalSaved / positiveTxns.length)) : '$0.00', icon: '📈' },
        ].map(s => (
          <div key={s.label} style={{ background: '#f9f9f9', borderRadius: 14, padding: '14px 16px' }}>
            <p style={{ margin: '0 0 4px', fontSize: 18 }}>{s.icon}</p>
            <p style={{ margin: '0 0 2px', fontSize: 20, fontWeight: 700 }}>{s.value}</p>
            <p style={{ margin: 0, fontSize: 12, color: '#999' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <p style={{ fontWeight: 700, fontSize: 16, margin: '0 0 12px' }}>Recent</p>
      <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #f0f0f0' }}>
        {history.slice(0, 4).map((t, i) => (
          <div key={t.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px', background: i % 2 === 0 ? '#fff' : '#fafafa',
            borderBottom: i < 3 ? '1px solid #f0f0f0' : 'none'
          }}>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{t.storeName}</p>
              <p style={{ margin: 0, fontSize: 12, color: '#999' }}>{formatDate(t.date)}</p>
            </div>
            <p style={{ margin: 0, fontWeight: 700, color: t.amountCents > 0 ? '#0F6E56' : '#e53e3e' }}>
              {t.amountDisplay}
            </p>
          </div>
        ))}
        {history.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: '#999', fontSize: 14 }}>
            No transactions yet
          </div>
        )}
      </div>
    </div>
  );
}

export default function WalletHome({ customer, card, onSignOut }) {
  const [tab, setTab] = useState('home');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    api.getHistory(customer.id)
      .then(data => setHistory(data.transactions))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [customer.id]);

  const tabs = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'cards', label: 'Cards', icon: '💳' },
  { id: 'rewards', label: 'Rewards', icon: '🎁' },
  { id: 'history', label: 'History', icon: '🕐' },
  { id: 'account', label: 'Account', icon: '👤' },
];

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', position: 'relative', minHeight: '100vh', background: '#f9f9f9' }}>

      {tab === 'home' && <HomeTab customer={customer} card={card} history={history} onShowCard={() => setShowCard(true)} />}
      {tab === 'cards' && <CardsTab card={card} history={history} />}
      {tab === 'rewards' && <RewardsTab customer={customer} />}
      {tab === 'history' && <HistoryTab history={history} loading={loading} />}
      {tab === 'account' && (
        <div style={{ padding: '32px 16px 100px' }}>
          <p style={{ fontWeight: 700, fontSize: 20, margin: '0 0 24px' }}>Account</p>
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #f0f0f0', marginBottom: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 18, margin: '0 0 4px' }}>{customer.name}</p>
            <p style={{ color: '#999', fontSize: 14, margin: 0 }}>{customer.phoneNumber}</p>
          </div>
          <button onClick={onSignOut} style={{
            width: '100%', padding: 14, borderRadius: 12,
            border: '1.5px solid #e5e5e5', background: '#fff',
            color: '#e53e3e', fontSize: 14, fontWeight: 600, cursor: 'pointer'
          }}>
            Sign Out
          </button>
        </div>
      )}

      {showCard && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, textAlign: 'center', width: '100%', maxWidth: 340, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <p style={{ fontWeight: 700, fontSize: 18, margin: '0 0 20px' }}>My Card</p>
            <div style={{ width: 140, height: 140, background: '#f5f5f5', borderRadius: 12, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#999' }}>
              QR Code
            </div>
            <p style={{ fontWeight: 700, fontSize: 20, letterSpacing: 3, margin: '0 0 6px', color: '#0F6E56' }}>{card.cardNumber}</p>
            <p style={{ fontSize: 13, color: '#999', margin: '0 0 24px' }}>Show this at the register</p>
            <button onClick={() => setShowCard(false)} style={{ width: '100%', padding: '12px 0', borderRadius: 10, border: 'none', background: '#0F6E56', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}

      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 420, background: '#fff',
        borderTop: '1px solid #f0f0f0', display: 'flex',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 100, boxShadow: '0 -4px 20px rgba(0,0,0,0.06)'
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '10px 0 12px', border: 'none', background: 'transparent',
            cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 3
          }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{ fontSize: 11, fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? '#0F6E56' : '#999' }}>
              {t.label}
            </span>
          </button>
        ))}
      </div>

      <ChatSupport customer={customer} />
    </div>
  );
}