import { useState, useEffect } from 'react';
import { adminApi } from '../api';

function formatMoney(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}
function formatDateShort(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      adminApi.getSummary(),
      adminApi.getTransactions(50),
      fetch('http://localhost:4000/api/admin/customers').then(r => r.json()),
    ]).then(([s, t, c]) => {
      setSummary(s);
      setTransactions(t.transactions);
      setCustomers(c.customers || []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone_number.includes(search) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ padding: 60, textAlign: 'center', color: '#999', fontSize: 14 }}>Loading...</div>
  );

  const metrics = summary ? [
    { label: 'TOTAL COINS COLLECTED', value: formatMoney(summary.totalCoinsCents), sub: 'all time', color: '#0F6E56' },
    { label: 'REGISTERED CUSTOMERS', value: customers.length, sub: 'total signups', color: '#185FA5' },
    { label: 'BALANCE IN CIRCULATION', value: formatMoney(summary.circulationCents), sub: 'unspent', color: '#854F0B' },
    { label: 'TRANSACTIONS TODAY', value: summary.todayTxnCount, sub: `avg ${formatMoney(summary.todayAvgCents)}/txn`, color: '#6B3FA0' },
  ] : [];

  const tabs = ['overview', 'customers', 'transactions'];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 16px', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontWeight: 800, fontSize: 22, margin: '0 0 4px' }}>Admin Dashboard</p>
        <p style={{ fontSize: 13, color: '#999', margin: 0 }}>Change Wallet — store overview</p>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
        {metrics.map(m => (
          <div key={m.label} style={{
            background: '#fff', borderRadius: 16, padding: '18px 20px',
            border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <p style={{ fontSize: 11, color: '#999', margin: '0 0 8px', fontWeight: 600, letterSpacing: 0.5 }}>{m.label}</p>
            <p style={{ fontSize: 28, fontWeight: 800, margin: '0 0 4px', color: m.color }}>{m.value}</p>
            <p style={{ fontSize: 12, color: '#bbb', margin: 0 }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: '#f5f5f5', borderRadius: 12, padding: 4, marginBottom: 20, width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', borderRadius: 10, border: 'none',
            background: tab === t ? '#fff' : 'transparent',
            fontWeight: tab === t ? 700 : 400, fontSize: 13, cursor: 'pointer',
            color: tab === t ? '#0F6E56' : '#999',
            boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            textTransform: 'capitalize'
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>Recent transactions</p>
            <p style={{ fontSize: 13, color: '#999', margin: 0 }}>{transactions.length} records</p>
          </div>
          {transactions.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#999', fontSize: 14 }}>No transactions yet</div>
          ) : (
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa' }}>
                  {['CUSTOMER', 'DATE', 'PURCHASE', 'CASH BACK', 'TO CARD', 'LOCATION'].map(h => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: h === 'CUSTOMER' || h === 'DATE' || h === 'LOCATION' ? 'left' : 'right',
                      fontWeight: 600, color: '#999', fontSize: 11,
                      letterSpacing: 0.3, borderBottom: '1px solid #f0f0f0'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr key={t.id} style={{ borderTop: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{t.customer_name}</td>
                    <td style={{ padding: '12px 16px', color: '#999' }}>{formatDate(t.created_at)}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>{formatMoney(t.purchase_total_cents)}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: '#999' }}>
                      {t.cash_returned_cents != null ? formatMoney(t.cash_returned_cents) : '—'}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: t.coins_to_card_cents > 0 ? '#0F6E56' : '#e53e3e' }}>
                      {t.coins_to_card_cents > 0 ? '+' : ''}{formatMoney(Math.abs(t.coins_to_card_cents))}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#999', fontSize: 12 }}>
                      {t.location ? `📍 ${t.location}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Customers tab */}
      {tab === 'customers' && (
        <div>
          {/* Search */}
          <div style={{ marginBottom: 16 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, phone or email..."
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12,
                border: '1.5px solid #e5e5e5', fontSize: 14,
                fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>Registered customers</p>
              <p style={{ fontSize: 13, color: '#999', margin: 0 }}>{filteredCustomers.length} of {customers.length}</p>
            </div>

            {filteredCustomers.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#999', fontSize: 14 }}>
                {search ? 'No customers match your search' : 'No customers yet'}
              </div>
            ) : (
              filteredCustomers.map((c, i) => (
                <div key={c.id} style={{
                  padding: '16px 20px',
                  borderTop: i > 0 ? '1px solid #f0f0f0' : 'none',
                  background: i % 2 === 0 ? '#fff' : '#fafafa',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {/* Avatar */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: 'linear-gradient(135deg, #0F6E56, #1D9E75)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0
                    }}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{c.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#999', marginTop: 2 }}>
                        {c.phone_number} {c.email ? `· ${c.email}` : ''}
                      </p>
                      {c.city && (
                        <p style={{ margin: 0, fontSize: 11, color: '#bbb', marginTop: 2 }}>
                          📍 {c.address}, {c.city}, {c.state} {c.zip}
                        </p>
                      )}
                      <p style={{ margin: 0, fontSize: 11, color: '#bbb', marginTop: 2 }}>
                        Joined {formatDateShort(c.created_at)} · Card {c.card_number}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#0F6E56' }}>
                      {formatMoney(c.balance_cents)}
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: '#999', marginTop: 2 }}>balance</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#999', marginTop: 2 }}>
                      {c.transaction_count} txns · saved {formatMoney(c.total_saved_cents)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Transactions tab */}
      {tab === 'transactions' && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>All transactions</p>
          </div>
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['CUSTOMER', 'DATE', 'STORE', 'PURCHASE', 'TO CARD', 'LOCATION'].map(h => (
                  <th key={h} style={{
                    padding: '10px 16px',
                    textAlign: h === 'CUSTOMER' || h === 'DATE' || h === 'STORE' || h === 'LOCATION' ? 'left' : 'right',
                    fontWeight: 600, color: '#999', fontSize: 11,
                    borderBottom: '1px solid #f0f0f0'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={t.id} style={{ borderTop: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{t.customer_name}</td>
                  <td style={{ padding: '12px 16px', color: '#999' }}>{formatDate(t.created_at)}</td>
                  <td style={{ padding: '12px 16px', color: '#999' }}>{t.store_name}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>{formatMoney(t.purchase_total_cents)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: t.coins_to_card_cents > 0 ? '#0F6E56' : '#e53e3e' }}>
                    {t.coins_to_card_cents > 0 ? '+' : ''}{formatMoney(Math.abs(t.coins_to_card_cents))}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#999', fontSize: 12 }}>
                    {t.location ? `📍 ${t.location}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}