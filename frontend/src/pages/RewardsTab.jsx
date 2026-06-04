import { useState, useEffect } from 'react';

const BRANDS = [
  { name: 'Shell', color: '#e8000d', bg: '#fff5f5', logo: '⛽' },
  { name: 'Mobil', color: '#e5001b', bg: '#fff5f5', logo: '⛽' },
  { name: 'BP', color: '#006400', bg: '#f0fff4', logo: '🌿' },
  { name: 'Chevron', color: '#e31837', bg: '#fff5f5', logo: '⚡' },
  { name: 'QuikTrip', color: '#c8102e', bg: '#fff5f5', logo: '🏪' },
];

const VISITS_REQUIRED = 10;

function StampCard({ brand, visitCount, onSimulateVisit }) {
  const stamps = visitCount % VISITS_REQUIRED;
  const totalEarned = Math.floor(visitCount / VISITS_REQUIRED);

  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: 20,
      border: '1.5px solid #f0f0f0', marginBottom: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    }}>
      {/* Brand header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: brand.bg, display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 22
          }}>
            {brand.logo}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>{brand.name}</p>
            <p style={{ fontSize: 12, color: '#999', margin: 0 }}>
              Every 10 visits = +$0.10 to your card
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 11, color: '#999', margin: 0 }}>Total earned</p>
          <p style={{ fontWeight: 700, fontSize: 18, margin: 0, color: '#0F6E56' }}>
            ${(totalEarned * 0.10).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Stamp grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 12 }}>
        {Array.from({ length: VISITS_REQUIRED }).map((_, i) => (
          <div key={i} style={{
            height: 38, borderRadius: 10,
            background: i < stamps ? brand.color : '#f5f5f5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: '#fff', fontWeight: 700,
            border: i < stamps ? 'none' : '1.5px dashed #e5e5e5',
            transition: 'all 0.3s'
          }}>
            {i < stamps ? '✓' : ''}
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: '#999', margin: 0 }}>
          {stamps === 0 && visitCount > 0
            ? '🎉 $0.10 just added to your card!'
            : `${VISITS_REQUIRED - stamps} more visits for +$0.10`}
        </p>
        <p style={{ fontSize: 12, color: '#999', margin: 0 }}>{stamps}/{VISITS_REQUIRED}</p>
      </div>

      {/* Progress bar */}
      <div style={{ background: '#f5f5f5', borderRadius: 999, height: 6, marginBottom: 14 }}>
        <div style={{
          height: 6, borderRadius: 999,
          background: brand.color,
          width: `${(stamps / VISITS_REQUIRED) * 100}%`,
          transition: 'width 0.4s ease'
        }} />
      </div>

      {/* Simulate visit button */}
      <button onClick={() => onSimulateVisit(brand.name)} style={{
        width: '100%', padding: '10px 0', borderRadius: 12,
        border: `1.5px dashed ${brand.color}66`,
        background: brand.bg, color: brand.color,
        fontSize: 13, fontWeight: 600, cursor: 'pointer'
      }}>
        + Simulate tap/swipe at {brand.name}
      </button>
    </div>
  );
}

export default function RewardsTab({ customer }) {
  const [rewards, setRewards] = useState(
    BRANDS.map(b => ({ brand: b.name, visitCount: 0, earnedRewards: 0 }))
  );
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/api/rewards/${customer.id}`)
      .then(r => r.json())
      .then(data => { if (data.rewards) setRewards(data.rewards); })
      .catch(console.error);
  }, [customer.id]);

  function showToast(msg, color = '#0F6E56') {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  }

  async function simulateVisit(brandName) {
    try {
      const res = await fetch('http://localhost:4000/api/rewards/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: customer.id, storeBrand: brandName })
      });
      const data = await res.json();
      setRewards(prev => prev.map(r =>
        r.brand === brandName
          ? { ...r, visitCount: data.visitCount, stampsThisCycle: data.stampsThisCycle }
          : r
      ));
      if (data.justHitMilestone) {
        showToast(`🎉 $0.10 added to your card from ${brandName}!`, '#0F6E56');
      } else {
        showToast(`✓ Visit recorded at ${brandName} — ${data.visitsToNext} more for +$0.10`, '#333');
      }
    } catch {
      showToast('Something went wrong', '#e53e3e');
    }
  }

  const totalVisits = rewards.reduce((sum, r) => sum + (r.visitCount || 0), 0);
  const totalEarnedCents = rewards.reduce((sum, r) => sum + (Math.floor((r.visitCount || 0) / VISITS_REQUIRED) * 10), 0);

  return (
    <div style={{ padding: '20px 16px 100px', background: '#f9f9f9', minHeight: '100vh' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          background: toast.color, color: '#fff', padding: '12px 20px',
          borderRadius: 12, fontSize: 14, fontWeight: 600, zIndex: 500,
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)', whiteSpace: 'nowrap'
        }}>
          {toast.msg}
        </div>
      )}

      <p style={{ fontWeight: 700, fontSize: 20, margin: '0 0 4px' }}>Rewards</p>
      <p style={{ fontSize: 13, color: '#999', margin: '0 0 20px' }}>
        One card — earn at every station
      </p>

      {/* Summary */}
      <div style={{
        background: 'linear-gradient(135deg, #0F6E56, #1D9E75)',
        borderRadius: 16, padding: '16px 20px', marginBottom: 24,
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr'
      }}>
        {[
          { label: 'Total visits', value: totalVisits },
          { label: 'Stations', value: BRANDS.length },
          { label: 'Total earned', value: `$${(totalEarnedCents / 100).toFixed(2)}` },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: 22, margin: 0 }}>{s.value}</p>
            <p style={{ color: '#9FE1CB', fontSize: 11, margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Stamp cards */}
      {BRANDS.map(brand => {
        const r = rewards.find(r => r.brand === brand.name) || { visitCount: 0 };
        return (
          <StampCard
            key={brand.name}
            brand={brand}
            visitCount={r.visitCount || 0}
            onSimulateVisit={simulateVisit}
          />
        );
      })}
    </div>
  );
}