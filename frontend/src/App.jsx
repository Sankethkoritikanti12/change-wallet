import { useState } from 'react';
import SignupLogin from './pages/SignupLogin';
import WalletHome from './pages/WalletHome';
import RegisterScreen from './pages/RegisterScreen';
import AdminDashboard from './pages/AdminDashboard';

function getView() {
  const hash = window.location.hash;
  if (hash === '#register') return 'register';
  if (hash === '#admin') return 'admin';
  return 'customer';
}

export default function App() {
  const [view, setView] = useState(getView());
  const [customer, setCustomer] = useState(null);
  const [card, setCard] = useState(null);

  function handleLoginSuccess(customerData, cardData) {
    setCustomer(customerData);
    setCard(cardData);
  }

  function handleSignOut() {
    setCustomer(null);
    setCard(null);
  }

  return (
    <div>
      <div style={{
        borderBottom: '1px solid #f0f0f0', padding: '8px 16px',
        display: 'flex', gap: 20, fontSize: 13,
        background: '#fff', position: 'sticky', top: 0, zIndex: 50
      }}>
        <span
          style={{ cursor: 'pointer', fontWeight: view === 'customer' ? 700 : 400, color: view === 'customer' ? '#0F6E56' : '#999' }}
          onClick={() => { window.location.hash = ''; setView('customer'); }}>
          Customer app
        </span>
        <span
          style={{ cursor: 'pointer', fontWeight: view === 'register' ? 700 : 400, color: view === 'register' ? '#0F6E56' : '#999' }}
          onClick={() => { window.location.hash = '#register'; setView('register'); }}>
          Register
        </span>
        <span
          style={{ cursor: 'pointer', fontWeight: view === 'admin' ? 700 : 400, color: view === 'admin' ? '#0F6E56' : '#999' }}
          onClick={() => { window.location.hash = '#admin'; setView('admin'); }}>
          Admin
        </span>
      </div>

      {view === 'customer' && (
        customer
          ? <WalletHome customer={customer} card={card} onSignOut={handleSignOut} />
          : <SignupLogin onSuccess={handleLoginSuccess} />
      )}
      {view === 'register' && <RegisterScreen />}
      {view === 'admin' && <AdminDashboard />}
    </div>
  );
}