import { api } from './api';
import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import SignupLogin from './pages/SignupLogin';
import WalletHome from './pages/WalletHome';
import RegisterScreen from './pages/RegisterScreen';
import AdminDashboard from './pages/AdminDashboard';

function getView() {
  const hash = window.location.hash;
  if (hash === '#register') return 'register';
  if (hash === '#admin') return 'admin';
  if (hash === '#app') return 'app';
  return 'landing';
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
    setView('landing');
    window.location.hash = '';
    api.clearToken();
  }

  function goToApp() {
    setView('app');
    window.location.hash = '#app';
  }

  if (view === 'landing') {
    return <LandingPage onGetStarted={goToApp} />;
  }

  return (
    <div>
      {/* Dev nav */}
      <div style={{
        borderBottom: '1px solid #f0f0f0', padding: '8px 16px',
        display: 'flex', gap: 20, fontSize: 13,
        background: '#fff', position: 'sticky', top: 0, zIndex: 50
      }}>
        <span style={{ cursor: 'pointer', color: '#999' }}
          onClick={() => { window.location.hash = ''; setView('landing'); setCustomer(null); setCard(null); }}>
          ← Home
        </span>
        <span style={{ cursor: 'pointer', fontWeight: view === 'app' ? 700 : 400, color: view === 'app' ? '#0F6E56' : '#999' }}
          onClick={() => { window.location.hash = '#app'; setView('app'); }}>
          Customer app
        </span>
        <span style={{ cursor: 'pointer', fontWeight: view === 'register' ? 700 : 400, color: view === 'register' ? '#0F6E56' : '#999' }}
          onClick={() => { window.location.hash = '#register'; setView('register'); }}>
          Register
        </span>
        <span style={{ cursor: 'pointer', fontWeight: view === 'admin' ? 700 : 400, color: view === 'admin' ? '#0F6E56' : '#999' }}
          onClick={() => { window.location.hash = '#admin'; setView('admin'); }}>
          Admin
        </span>
      </div>

      {view === 'app' && (
        customer
          ? <WalletHome customer={customer} card={card} onSignOut={handleSignOut} />
          : <SignupLogin onSuccess={handleLoginSuccess} />
      )}
      {view === 'register' && <RegisterScreen />}
      {view === 'admin' && <AdminDashboard />}
    </div>
  );
}