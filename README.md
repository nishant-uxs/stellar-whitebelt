# 🌟 XLM Pay - Stellar Testnet Payment dApp

A modern, user-friendly decentralized application for sending XLM payments on the Stellar Testnet. Connect your Freighter wallet, view your balance, and send XLM transactions with ease.

![Stellar](https://img.shields.io/badge/Stellar-Testnet-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8)

## 🎯 Features

✅ **Wallet Integration**
- Connect/disconnect Freighter browser wallet
- Secure wallet address display with copy-to-clipboard
- Real-time connection status

✅ **Balance Management**
- View XLM balance from Stellar Testnet
- Auto-refresh on wallet connection
- Manual refresh button
- Loading states with smooth animations

✅ **Send Payments**
- Simple payment form with validation
- Real-time transaction submission
- Transaction hash with explorer link
- Success/error notifications
- Freighter wallet signing integration

✅ **User Experience**
- Dark/light theme toggle
- Responsive design (mobile-friendly)
- Toast notifications for user feedback
- Modern UI with Shadcn components
- Smooth animations and transitions

## 🚀 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | Frontend framework |
| **TypeScript** | 5.6.3 | Type safety |
| **Vite** | 7.3.0 | Build tool & dev server |
| **Express** | 5.0.1 | Backend server |
| **Stellar SDK** | 14.5.0 | Blockchain interactions |
| **Freighter API** | 6.0.1 | Wallet integration |
| **Tailwind CSS** | 3.4.17 | Styling |
| **Shadcn UI** | Latest | UI components |
| **Lucide React** | 0.453.0 | Icons |
| **Wouter** | 3.3.5 | Routing |

## 📁 Project Structure

```
Stellar-Testnet-Dapp/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── balance-card.tsx       # XLM balance display
│   │   │   ├── send-payment.tsx       # Payment form
│   │   │   ├── wallet-connect.tsx     # Wallet connection UI
│   │   │   ├── theme-toggle.tsx       # Dark/light mode
│   │   │   └── ui/                    # Shadcn components
│   │   ├── hooks/
│   │   │   └── useWallet.ts           # Freighter wallet hook
│   │   ├── lib/
│   │   │   └── stellar.ts             # Stellar SDK helpers
│   │   ├── pages/
│   │   │   ├── home.tsx               # Main dashboard
│   │   │   └── not-found.tsx          # 404 page
│   │   ├── App.tsx                    # App root
│   │   └── main.tsx                   # Entry point
│   ├── index.html
│   └── public/
├── server/
│   ├── index.ts                       # Express server
│   └── vite.ts                        # Vite dev middleware
├── package.json
├── vite.config.ts
└── tailwind.config.ts
```

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Freighter Wallet** ([Install Extension](https://www.freighter.app/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/nishant-uxs/stellar-whitebelt.git
cd stellar-whitebelt/Stellar-Testnet-Dapp
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5000
```

### Get Testnet XLM

1. Install and set up [Freighter Wallet](https://www.freighter.app/)
2. Switch to **Testnet** in Freighter settings
3. Connect your wallet in the app
4. Copy your wallet address
5. Visit [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=test)
6. Paste your address and click "Get test network lumens"
7. Refresh your balance in the app!

## 📸 Screenshots

### Wallet Connected State
![Wallet Connected](./screenshots/wallet-connected.png)
*Dashboard showing connected wallet with address and balance*

### Balance Display
![Balance Display](./screenshots/balance-display.png)
*XLM balance card with refresh functionality*

### Successful Transaction
![Transaction Success](./screenshots/transaction-success.png)
*Successful payment with transaction hash and explorer link*

## 🎨 Key Components

### Wallet Connection (`useWallet.ts`)
```typescript
// Custom hook for Freighter wallet integration
const wallet = useWallet();

// Connect wallet
await wallet.connect();

// Sign transaction
const signedXDR = await wallet.sign(transactionXDR);

// Disconnect
wallet.disconnect();
```

### Balance Fetching (`stellar.ts`)
```typescript
// Fetch XLM balance from Horizon
const balance = await fetchBalance(publicKey);
```

### Send Payment (`stellar.ts`)
```typescript
// Build and submit transaction
const txHash = await sendPayment({
  from: senderPublicKey,
  to: recipientAddress,
  amount: "10.5",
  memo: "Payment"
}, signTransaction);
```

## 🌐 Stellar Integration

### Network Configuration
- **Network**: Stellar Testnet
- **Horizon URL**: `https://horizon-testnet.stellar.org`
- **Explorer**: `https://stellar.expert/explorer/testnet`

### Supported Operations
- ✅ Account balance queries
- ✅ Payment transactions
- ✅ Transaction signing via Freighter
- ✅ Transaction submission to network
- ✅ Explorer link generation

## 🔧 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check
```

## 🎯 How It Works

1. **Connect Wallet**: Click "Connect Wallet" to open Freighter
2. **View Balance**: Your XLM balance loads automatically
3. **Send Payment**: 
   - Enter recipient address
   - Enter amount (XLM)
   - Add optional memo
   - Click "Send Payment"
   - Approve in Freighter
4. **View Transaction**: Click the explorer link to see transaction details

## 🔐 Security

- ✅ No private keys stored
- ✅ All signing done in Freighter wallet
- ✅ Testnet only (no real funds)
- ✅ Client-side transaction building
- ✅ Secure wallet connection via Freighter API

## 🌟 Features Implemented

- [x] Freighter wallet integration
- [x] XLM balance display
- [x] Send XLM payments
- [x] Transaction signing
- [x] Explorer links
- [x] Copy wallet address
- [x] Dark/light theme
- [x] Responsive design
- [x] Error handling
- [x] Loading states
- [x] Toast notifications

## 🚧 Future Enhancements

- [ ] Transaction history
- [ ] Multiple asset support
- [ ] QR code generation
- [ ] Address book
- [ ] Transaction confirmations
- [ ] Balance charts
- [ ] Multi-wallet support (xBull, Albedo)

## 🐛 Troubleshooting

**Wallet won't connect?**
- Ensure Freighter is installed
- Check you're on Testnet (not Mainnet)
- Refresh the page

**Balance shows 0?**
- Fund your testnet account via [Friendbot](https://laboratory.stellar.org/#account-creator?network=test)
- Click the refresh button

**Transaction fails?**
- Keep at least 1 XLM as base reserve
- Verify recipient address is valid
- Check you're on Testnet

## 📚 Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Stellar SDK Docs](https://stellar.github.io/js-stellar-sdk/)
- [Freighter Wallet](https://www.freighter.app/)
- [Stellar Laboratory](https://laboratory.stellar.org/)
- [Stellar Expert Explorer](https://stellar.expert/explorer/testnet)

## 📝 License

MIT License - Feel free to use this for learning or building your own projects!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

**Nishant**
- GitHub: [@nishant-uxs](https://github.com/nishant-uxs)

## 🙏 Acknowledgments

- Built for Stellar White Belt Challenge
- Powered by Stellar blockchain
- UI components from Shadcn
- Icons from Lucide

---

Made with ❤️ for the Stellar Community 🚀✨

**Network**: Testnet Only | **Status**: Production Ready | **Version**: 1.0.0
