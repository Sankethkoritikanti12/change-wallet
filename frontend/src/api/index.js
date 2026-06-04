const BASE = 'https://change-wallet-backend.onrender.com';

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  registerCustomer: (name, phoneNumber, email, address, city, state, zip) =>
    request('POST', '/api/customers/register', {
      name, phoneNumber, email, address, city, state, zip
    }),

  lookupCustomer: (phone) =>
    request('GET', `/api/customers/lookup?phone=${phone.replace(/\D/g, '')}`),

  getHistory: (customerId) =>
    request('GET', `/api/customers/${customerId}/history`),

  getOrders: (customerId) =>
    request('GET', `/api/customers/${customerId}/orders`),
};

export function registerApi(apiKey) {
  async function regRequest(method, path, body) {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-register-key': apiKey,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  return {
    processTransaction: (phoneNumber, purchaseTotalCents, cashGivenCents, location) =>
      regRequest('POST', '/api/transaction', {
        phoneNumber, purchaseTotalCents, cashGivenCents, location
      }),

    redeemBalance: (phoneNumber, amountCents) =>
      regRequest('POST', '/api/transaction/redeem', { phoneNumber, amountCents }),
  };
}

export const adminApi = {
  getSummary: (storeId) =>
    request('GET', `/api/admin/summary${storeId ? `?storeId=${storeId}` : ''}`),

  getTransactions: (limit = 50, offset = 0) =>
    request('GET', `/api/admin/transactions?limit=${limit}&offset=${offset}`),
};