# Change Wallet System

Coin change goes to a digital gift card instead of your pocket.

## Project structure

```
change-wallet/
├── database/
│   └── schema.sql          ← Run this once in PostgreSQL
├── backend/
│   ├── server.js           ← Express API entry point
│   ├── db.js               ← PostgreSQL connection
│   ├── .env.example        ← Copy to .env and fill in
│   ├── middleware/
│   │   └── registerAuth.js ← Validates store API key
│   └── routes/
│       ├── transactions.js ← Core: POST /api/transaction
│       ├── customers.js    ← Signup, lookup, history
│       └── admin.js        ← Dashboard stats
└── frontend/
    └── src/
        ├── App.jsx          ← Root, switches between views
        ├── api/index.js     ← All fetch calls
        └── pages/
            ├── SignupLogin.jsx    ← Customer sign in / sign up
            ├── WalletHome.jsx    ← Customer wallet screen
            ├── RegisterScreen.jsx ← Cashier POS screen
            └── AdminDashboard.jsx ← Owner overview
```

## Setup

### 1. Database

```bash
# Create the database
createdb change_wallet

# Run the schema (creates tables + seeds test data)
psql change_wallet < database/schema.sql
```

### 2. Backend

```bash
cd backend
npm install

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL

npm run dev
# API runs on http://localhost:4000
```

### 3. Frontend

```bash
cd frontend
npx create-react-app . --template minimal  # or use Vite
# Copy the src/ files into your React project

# Create .env
echo "REACT_APP_API_URL=http://localhost:4000" > .env
echo "REACT_APP_REGISTER_KEY=test-register-key-12345" >> .env

npm start
# App runs on http://localhost:3000
```

## How to test the core flow

```bash
# 1. Look up the test customer
curl "http://localhost:4000/api/customers/lookup?phone=2485550192"

# 2. Process a transaction ($1.49 purchase, $20 cash)
curl -X POST http://localhost:4000/api/transaction \
  -H "Content-Type: application/json" \
  -H "x-register-key: test-register-key-12345" \
  -d '{
    "phoneNumber": "2485550192",
    "purchaseTotalCents": 149,
    "cashGivenCents": 2000
  }'

# Response:
# {
#   "cashReturnedCents": 1800,     ← give $18.00 in bills
#   "coinsToCardCents": 51,         ← $0.51 added to card
#   "display": {
#     "cashBack": "$18.00",
#     "addedToCard": "$0.51",
#     "newBalance": "$5.34"
#   }
# }

# 3. Check the admin summary
curl "http://localhost:4000/api/admin/summary"
```

## Key decisions

- All money stored as integer cents — never floats
- Every transaction is atomic (BEGIN/COMMIT) so balance + log always match
- The register authenticates with a per-store API key (x-register-key header)
- Phone number is the primary customer identifier — no physical card needed to get started

## Next steps

- Add SMS notification when coins are added (Twilio)
- Add QR code generation in the customer app (use `qrcode.react`)
- Add cash-out: customer spends balance at the register via the /redeem endpoint
- Deploy backend to Railway or Render; frontend to Vercel
- Add proper auth (JWT) before going to production — the current register key is simple but good enough to start
