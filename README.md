# 🛒 Smart Cart OS

> An AI-powered smart grocery cart system with a real-time dashboard, mobile customer view, and Gemini AI integration.

---

## ✨ Features

- **AI Shopping Assistant** — Gemini AI-powered product recommendations and queries
- **Real-Time Dashboard** — Live inventory tracking, cart status, and store analytics
- **Mobile Customer View** — Responsive mobile interface for in-store shoppers
- **Backend API** — Express.js REST API with SQLite database
- **Multi-Cart Management** — Track multiple carts simultaneously from a single dashboard

---

## 🧱 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, TypeScript, Vite          |
| UI         | Lucide React, Custom CSS            |
| Backend    | Node.js, Express.js                 |
| Database   | SQLite (local) / PostgreSQL (prod)  |
| AI         | Google Gemini API (`@google/genai`) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A [Gemini API key](https://aistudio.google.com/app/apikey) (free)

### 1. Clone the repository

```bash
git clone https://github.com/RishvinReddy/Smart-cart-os.git
cd Smart-cart-os
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the app

**Option A — Frontend only (Vite dev server):**
```bash
npm run dev
```

**Option B — Full stack (Frontend + Backend together):**
```bash
npm run dev:full
```

The frontend will be available at: `http://localhost:5173`  
The backend API will run at: `http://localhost:5000`

---

## 📁 Project Structure

```
smart-cart-os/
├── backend/
│   ├── server.js          # Express REST API
│   ├── database.js        # SQLite DB setup & queries
│   └── initial_data.json  # Seed data for products
├── components/
│   ├── DashboardView.tsx  # Store manager dashboard
│   ├── LandingPage.tsx    # Entry / login screen
│   └── MobileView.tsx     # Customer mobile interface
├── services/
│   └── geminiService.ts   # Gemini AI integration
├── scripts/               # Verification & test scripts
├── App.tsx                # Root app component & routing
├── types.ts               # TypeScript type definitions
├── constants.ts           # App-wide constants & config
├── index.tsx              # React entry point
├── vite.config.ts
├── tsconfig.json
├── package.json
├── .env.example           # Environment variable template
└── README.md
```

---

## 📜 Available Scripts

| Command           | Description                             |
|-------------------|-----------------------------------------|
| `npm run dev`     | Start Vite frontend dev server          |
| `npm run build`   | Build production bundle                 |
| `npm run preview` | Preview production build locally        |
| `npm run server`  | Start backend API server (port 5000)    |
| `npm run dev:full`| Run frontend + backend concurrently     |

---

## 🔐 Security Notes

- **Never commit `.env.local`** — it contains your API key
- The `.gitignore` is configured to exclude all `.env*` files automatically
- Use environment variables for all secrets in production

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
Built with ❤️ by <a href="https://github.com/RishvinReddy">Rishvin Reddy</a>
</div>
