# 🪙 Change Wallet

> Turn your coin change into a digital gift card — automatically.

**Live Demo:** [change-wallet.vercel.app](https://change-wallet.vercel.app)

![Change Wallet](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-24-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)

---

## 💡 The Problem

Every time you pay cash at a gas station, you get coins back as change. Nobody wants coins. They end up lost in your car, couch, or trash.

## ✅ The Solution

Change Wallet automatically loads your coin change onto a digital gift card instead of giving you physical coins. Pay $1.49 with a $20 bill → get $18.00 back in bills → $0.51 goes straight to your card.

---

## Features

### Customer App
- 💳 Digital gift card with custom themes (Forest, Ocean, Midnight, Gold, Galaxy)
- 📊 Transaction history with location
- 🎁 Rewards system — earn $0.10 every 10 visits at Shell, Mobil, BP, Chevron
- 📦 Physical card delivery to home address
- 💬 AI-powered chat support
- 📱 Mobile-first design with bottom tab navigation

### Register / POS
- 🔍 Look up customer by phone number
- 💰 Auto-calculates coin change
- ✅ Live preview before confirming
- 📍 Location tracking per transaction

### Admin Dashboard
- 👥 Full customer list with search
- 📈 Real-time metrics (coins collected, active cards, balances)
- 🗂️ Complete transaction history
- 📊 Overview, Customers, and Transactions tabs

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Hosting | Vercel (frontend) + Render (backend) |
| Styling | Inline CSS with custom design system |

---

## 📱 Screenshots

| Customer Wallet | Register POS | Admin Dashboard |
|----------------|--------------|-----------------|
| Balance card with custom theme | Customer lookup + live preview | Metrics + customer list |

---

## 🏃 Run Locally

### Prerequisites
- Node.js v18+
- PostgreSQL 16+

### Setup

## 🏃 Run Locally

### Prerequisites
- Node.js v18+
- PostgreSQL 16+

### Setup

1. Clone the repo

       git clone https://github.com/Sankethkoritikanti12/change-wallet.git
       cd change-wallet

2. Setup database

       createdb change_wallet
       psql change_wallet < database/schema.sql

3. Setup backend

       cd backend
       npm install
       cp .env.example .env
       npm run dev

4. Setup frontend

       cd frontend
       npm install
       npm run dev

### Test the app
1. Open `http://localhost:5173`
2. Sign in with phone: `(248) 555-0192`
3. Click Register tab → enter `$1.49` purchase, `$20` cash
4. See `$0.51` added to card automatically!

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/customers/register` | Register new customer |
| GET | `/api/customers/lookup?phone=` | Look up customer by phone |
| GET | `/api/customers/:id/history` | Transaction history |
| POST | `/api/transaction` | Process cash transaction |
| POST | `/api/transaction/redeem` | Redeem card balance |
| GET | `/api/rewards/:customerId` | Get rewards progress |
| POST | `/api/rewards/visit` | Record store visit |
| GET | `/api/admin/summary` | Admin metrics |
| GET | `/api/admin/customers` | All customers |

---

## 💰 How It Works

---

## 🗺️ Roadmap

- [ ] JWT authentication
- [ ] Push notifications (Firebase)
- [ ] Real POS integration (Square/Stripe Terminal)
- [ ] NFC tap support
- [ ] Mobile app (React Native)
- [ ] Landing page for investors

---

## 👨‍💻 Built By

**Sanketh Koritikanti**
- GitHub: [@Sankethkoritikanti12](https://github.com/Sankethkoritikanti12)
- Live: [change-wallet.vercel.app](https://change-wallet.vercel.app)

---

## 📄 License

MIT License — feel free to use this project as inspiration!