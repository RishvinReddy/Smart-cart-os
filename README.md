<div align="center">

<!-- Animated Header -->
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:00D9FF,50:0052CC,100:7B2FBE&height=250&section=header&text=Smart%20Cart%20OS&fontSize=70&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=🛒%20The%20Future%20of%20Retail%20Shopping%20is%20Here&descAlignY=58&descAlign=50&descSize=22" />

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=28&duration=2500&pause=800&color=00D9FF&center=true&vCenter=true&multiline=false&width=700&lines=🛒+Smart+Cart+OS+—+IoT+Shopping+Redefined;⚡+ESP32+%2B+RFID+%2B+React+%3D+Magic;📡+Scan.+Track.+Checkout.+No+Queues.;🚀+Built+by+Rishvin+Reddy+%40+Woxsen" alt="Typing SVG" />

<br/><br/>

<!-- Primary Tech Badges -->
<a href="https://www.arduino.cc/"><img src="https://img.shields.io/badge/Arduino-00979D?style=for-the-badge&logo=arduino&logoColor=white"/></a>
<a href="https://www.espressif.com/"><img src="https://img.shields.io/badge/ESP32-E7352C?style=for-the-badge&logo=espressif&logoColor=white"/></a>
<a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/></a>
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/></a>
<img src="https://img.shields.io/badge/RFID%2FNFC-0052CC?style=for-the-badge&logo=nfc&logoColor=white"/>
<img src="https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white"/>
<img src="https://img.shields.io/badge/C%2FC%2B%2B-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white"/>

<br/><br/>

<!-- Status Badges -->
<img src="https://img.shields.io/badge/Status-🔥%20Active%20Development-brightgreen?style=flat-square&labelColor=1a1a2e"/>
<img src="https://img.shields.io/badge/Version-1.0.0--beta-blue?style=flat-square&labelColor=1a1a2e"/>
<img src="https://img.shields.io/badge/License-MIT-purple?style=flat-square&labelColor=1a1a2e"/>
<img src="https://img.shields.io/badge/Platform-ESP32%20%7C%20Web-orange?style=flat-square&labelColor=1a1a2e"/>
<img src="https://img.shields.io/badge/PRs-Welcome-ff69b4?style=flat-square&labelColor=1a1a2e"/>
<img src="https://img.shields.io/badge/Made%20in-Hyderabad%20🇮🇳-red?style=flat-square&labelColor=1a1a2e"/>

<br/><br/>

<!-- Quick Links -->
[📖 Docs](#-getting-started) • [🏗️ Architecture](#%EF%B8%8F-system-architecture) • [⚙️ Setup](#-getting-started) • [🔮 Roadmap](#-roadmap) • [🤝 Contribute](#-contributing)

<br/>

</div>

---

## 📌 Table of Contents

- [🌟 Overview](#-overview)
- [💡 Problem Statement](#-problem-statement)
- [✨ Features](#-features)
- [🏗️ System Architecture](#%EF%B8%8F-system-architecture)
- [🛠️ Tech Stack](#%EF%B8%8F-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [🔌 Hardware Setup](#-hardware-setup)
  - [💻 Firmware Upload](#-firmware-upload)
  - [🖥️ Frontend Setup](#%EF%B8%8F-frontend-setup)
- [📡 API & Communication](#-api--communication)
- [📸 Screenshots](#-screenshots)
- [🔮 Roadmap](#-roadmap)
- [⚠️ Known Issues](#%EF%B8%8F-known-issues)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👨‍💻 Author](#-author)

---

## 🌟 Overview

<div align="center">
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=16&duration=4000&pause=1000&color=7B2FBE&center=true&vCenter=true&width=700&lines=Transforming+retail+one+scan+at+a+time...;No+queues.+No+cashiers.+Just+smart+shopping." />
</div>

**Smart Cart OS** is a full-stack IoT project that brings intelligence to the humble shopping cart. The system uses an **ESP32 microcontroller** paired with **RFID and Barcode modules** to automatically detect products as they are placed into the cart, and streams this data in real-time to a **React.js dashboard** — giving shoppers and store managers a live view of the cart contents, running totals, and a frictionless one-tap checkout experience.
```
  👤 Shopper picks item      🏷️ RFID/Barcode scanned      📡 ESP32 sends data
        │                            │                            │
        ▼                            ▼                            ▼
  [Places in cart]  ──────▶  [Tag Detected]  ──────▶  [React Dashboard Updates]
                                                              │
                                                              ▼
                                                    [💳 Auto Bill Generated]
```

> Built as part of the **IoT & Embedded Systems** coursework at **Woxsen University, Hyderabad** — but designed to be production-grade.

---

## 💡 Problem Statement

<table>
<tr>
<td>

### 😤 The Problem
Traditional retail checkout is broken:
- Long queues waste **15–30 minutes** per customer
- Manual billing is **error-prone**
- No **real-time visibility** into cart value
- High **operational cost** for cashier staff
- Poor shopping experience leads to **cart abandonment**

</td>
<td>

### ✅ Our Solution
Smart Cart OS eliminates all of this:
- **Zero queue** — bill is auto-generated as you shop
- **RFID/Barcode precision** — no scan errors
- **Live dashboard** — see your total as items go in
- **Scalable hardware** — cheap ESP32 on every cart
- **Open source** — free for any retailer to deploy

</td>
</tr>
</table>

---

## ✨ Features

<div align="center">

### 🔥 Core Capabilities

</div>

<table>
<tr>
<td width="50%" valign="top">

#### 🔍 Smart Scanning Engine
- ✅ RFID tag detection (RC522 / PN532)
- ✅ Barcode module support (standard 1D/2D)
- ✅ Real-time item ADD to cart on scan
- ✅ Re-scan same tag → increments quantity
- ✅ Remove item trigger (optional button)
- ✅ Duplicate scan debouncing

</td>
<td width="50%" valign="top">

#### 📊 React Live Dashboard
- ✅ Real-time cart item list with prices
- ✅ Running total with GST calculation
- ✅ Product image + name display
- ✅ Item count badges
- ✅ Session-based cart state
- ✅ Responsive mobile-first UI

</td>
</tr>
<tr>
<td width="50%" valign="top">

#### ⚡ ESP32 Firmware
- ✅ Wi-Fi connectivity (Station mode)
- ✅ HTTP POST to backend on every scan
- ✅ Serial communication with scanner modules
- ✅ LED indicator on successful scan
- ✅ Buzzer feedback on item add
- ✅ Watchdog timer for reliability

</td>
<td width="50%" valign="top">

#### 💳 Checkout & Billing
- ✅ One-tap checkout button
- ✅ Itemized receipt generation
- ✅ GST / tax calculation
- ✅ Cart clear on checkout
- 🔄 QR code receipt (coming soon)
- 🔄 UPI / Razorpay payment (coming soon)

</td>
</tr>
<tr>
<td width="50%" valign="top">

#### 🛡️ Reliability & Safety
- ✅ Scan debounce (prevent duplicate add)
- ✅ ESP32 reconnect on Wi-Fi drop
- ✅ Error toast notifications on frontend
- ✅ Hardware watchdog reset on firmware hang
- 🔄 Weight sensor anti-theft (coming soon)

</td>
<td width="50%" valign="top">

#### 🔧 Developer Friendly
- ✅ Clean modular code structure
- ✅ Easy product catalog JSON config
- ✅ Environment variable based config
- ✅ Documented API endpoints
- ✅ MIT Licensed & open source

</td>
</tr>
</table>

---
## 🏗️ System Architecture

<div align="center">
```
+----------------------------------------------------------------------+
|                   SMART CART OS  --  SYSTEM OVERVIEW                |
+----------------------------------------------------------------------+
|                                                                      |
|  +--------------------+          +------------------------------+    |
|  |   CART HARDWARE    |          |      SERVER / FRONTEND       |    |
|  |                    |          |                              |    |
|  |  +--------------+  |          |  +--------------------------+|    |
|  |  |  RFID RC522  |--+--HTTP -->+->|   ESP32 API Handler      ||    |
|  |  +--------------+  |  POST    |  |  (Node / Flask / Raw)    ||    |
|  |         |          |          |  +------------+-------------+|    |
|  |  +------v-------+  |          |               |              |    |
|  |  |    ESP32     |  |          |               v  WebSocket   |    |
|  |  |  Dev Board   |  |          |  +--------------------------+|    |
|  |  +------+-------+  |          |  |   React.js Dashboard     ||    |
|  |         |          |          |  |  +----------+ +--------+ ||    |
|  |  +------v-------+  |          |  |  | Cart UI  | |Receipt | ||    |
|  |  |   Barcode    |  |          |  |  +----------+ +--------+ ||    |
|  |  |   Scanner    |  |          |  +-----------+--------------+|    |
|  |  +--------------+  |          |              |               |    |
|  |                    |          |              v               |    |
|  |  +--------------+  |          |  +--------------------------+|    |
|  |  | LED + Buzzer |  |          |  |   Product Catalog DB     ||    |
|  |  +--------------+  |          |  |   (JSON / SQLite)        ||    |
|  +--------------------+          |  +--------------------------+|    |
|                                  +------------------------------+    |
+----------------------------------------------------------------------+
```

</div>

### 🔄 Data Flow

[Item placed in cart]
       |
       v
[RFID/Barcode Module reads tag/code]
       |
       v
[ESP32 receives tag ID via SPI/Serial]
       |
       v
[ESP32 sends HTTP POST  -->  { tagId: "XXXX" }]
       |
       v
[Server looks up tagId in Product Catalog]
       |
       v
[Server emits product data via WebSocket]
       |
       v
[React Dashboard updates cart in real-time]
       |
       v
[Running total recalculated  -->  Display updated]


## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Version | Purpose |
|:-----:|:----------:|:-------:|:--------|
| 🧠 **MCU** | ESP32 Dev Board | — | Wi-Fi-enabled IoT brain of the cart |
| 📡 **RFID** | MFRC522 / RC522 | — | SPI-based tag read/write |
| 🔢 **Barcode** | TTL Serial Module | — | 1D/2D barcode scanning |
| ⚙️ **Firmware** | Arduino C/C++ | IDE 2.x | ESP32 programming |
| 🌐 **Frontend** | React.js | 18+ | Real-time cart dashboard |
| 🎨 **Styling** | CSS3 / Tailwind | 3.x | Responsive UI components |
| 🔌 **Realtime** | WebSocket / HTTP | — | ESP32 ↔ Dashboard sync |
| 📦 **Package Mgr** | npm | 9+ | JS dependency management |
| 🗃️ **Data Store** | JSON / SQLite | — | Product catalog & pricing |
| 🔧 **Build Tool** | Vite | 5.x | Lightning fast dev server |

</div>

---

## 📁 Project Structure
```
Smart-cart-os/
│
├── 📂 hardware/                        # All ESP32 / Arduino firmware
│   ├── 📄 smart_cart.ino               # Main sketch — WiFi, HTTP, loop logic
│   ├── 📄 rfid_handler.ino             # RC522 SPI init, tag read/write
│   ├── 📄 barcode_handler.ino          # Serial barcode parsing
│   ├── 📄 buzzer_led.ino               # Feedback: LED blink + buzzer beep
│   └── 📄 config.h                     # WiFi SSID, password, server IP
│
├── 📂 frontend/                        # React.js dashboard
│   ├── 📂 public/
│   │   └── 🖼️ cart-icon.svg
│   ├── 📂 src/
│   │   ├── 📄 App.jsx                  # Root component + routing
│   │   ├── 📄 CartDashboard.jsx        # Main cart view (items + total)
│   │   ├── 📄 ProductCard.jsx          # Individual product tile
│   │   ├── 📄 CheckoutModal.jsx        # Receipt + checkout confirmation
│   │   ├── 📄 useCartSocket.js         # Custom hook — WebSocket listener
│   │   ├── 📄 api.js                   # Axios / Fetch API config
│   │   └── 📂 styles/
│   │       └── 📄 main.css             # Global styles
│   ├── 📄 package.json
│   ├── 📄 vite.config.js
│   └── 📄 index.html
│
├── 📂 server/                          # Optional lightweight backend
│   ├── 📄 server.js                    # Express / Node server
│   ├── 📄 routes.js                    # API endpoints
│   └── 📄 products.json                # Product catalog (id, name, price, image)
│
├── 📂 docs/                            # Documentation & assets
│   ├── 🖼️ circuit_diagram.png          # Hardware wiring reference
│   ├── 🖼️ architecture.png             # System design diagram
│   └── 📄 hardware_bom.md              # Bill of Materials
│
├── 📄 .gitignore
├── 📄 LICENSE
└── 📄 README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following before starting:

| Tool | Version | Download |
|------|---------|----------|
| Arduino IDE | 2.x | [arduino.cc](https://www.arduino.cc/en/software) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| ESP32 Board Package | Latest | Via Arduino Board Manager |
| Git | Any | [git-scm.com](https://git-scm.com/) |

**Hardware Required:**

| Component | Qty | Notes |
|-----------|-----|-------|
| ESP32 Dev Board | 1 | Any 30-pin variant works |
| RFID RC522 Module | 1 | 3.3V logic |
| RFID Tags / Cards | 5+ | For testing |
| Barcode Scanner Module | 1 | TTL Serial output |
| LED (Green/Red) | 2 | Scan feedback |
| Buzzer | 1 | Beep on scan |
| Jumper Wires | 20+ | Male-to-Female |
| Breadboard | 1 | Prototyping |
| Micro USB Cable | 1 | ESP32 programming |

---

### 🔌 Hardware Setup

#### ESP32 ↔ RFID RC522 Wiring

| RFID RC522 Pin | ESP32 Pin | Description |
|:--------------:|:---------:|:------------|
| **SDA (SS)**   | GPIO **5** | SPI Chip Select |
| **SCK**        | GPIO **18** | SPI Clock |
| **MOSI**       | GPIO **23** | SPI Master Out |
| **MISO**       | GPIO **19** | SPI Master In |
| **RST**        | GPIO **22** | Reset |
| **GND**        | GND | Ground |
| **3.3V**       | 3.3V | Power (⚠️ NOT 5V!) |

#### ESP32 ↔ Buzzer / LED Wiring

| Component | ESP32 Pin | Notes |
|-----------|-----------|-------|
| Buzzer (+) | GPIO **25** | Active buzzer |
| Green LED  | GPIO **26** | Item added feedback |
| Red LED    | GPIO **27** | Error / not found |

#### ESP32 ↔ Barcode Scanner

| Scanner Pin | ESP32 Pin |
|-------------|-----------|
| TX | GPIO **16** (RX2) |
| RX | GPIO **17** (TX2) |
| GND | GND |
| VCC | 5V |

---

### 💻 Firmware Upload
```bash
# Step 1 — Clone the repo
git clone https://github.com/RishvinReddy/Smart-cart-os.git
cd Smart-cart-os
```
```bash
# Step 2 — Open hardware/smart_cart.ino in Arduino IDE
```
```bash
# Step 3 — Install required libraries from Library Manager (Ctrl+Shift+I)
# ✅ MFRC522          → RFID module driver
# ✅ ArduinoJson       → Parse/build JSON payloads
# ✅ ESPAsyncWebServer → Async HTTP server on ESP32
# ✅ AsyncTCP          → Required by ESPAsyncWebServer
```
```cpp
// Step 4 — Update config.h with your details
const char* ssid     = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverIP = "192.168.X.X";   // IP of machine running React frontend
const int   serverPort = 3001;
```
```bash
# Step 5 — In Arduino IDE:
# Tools → Board → ESP32 Arduino → ESP32 Dev Module
# Tools → Port → Select your COM port
# Click Upload ✅
```

> 💡 **Tip:** Open Serial Monitor at 115200 baud to see scan logs and debug output after uploading.

---

### 🖥️ Frontend Setup
```bash
# Navigate to frontend
cd Smart-cart-os/frontend

# Install all dependencies
npm install

# Start the dev server
npm run dev
```
```
✅ Server running at → http://localhost:5173
```
```bash
# For production build
npm run build
npm run preview
```

> ⚠️ **Important:** Update the ESP32 IP address in `src/api.js` to point to your ESP32 on the local network. Both your PC and ESP32 must be on the **same Wi-Fi network**.

---

### ⚙️ Optional — Node Backend Setup
```bash
cd Smart-cart-os/server

npm install

# Start server
node server.js

# Server runs at → http://localhost:3001
```

Edit `products.json` to add your product catalog:
```json
[
  { "id": "A1B2C3D4", "name": "Amul Butter 500g", "price": 275, "gst": 5  },
  { "id": "E5F6G7H8", "name": "Parle-G Biscuits",  "price": 30,  "gst": 12 },
  { "id": "I9J0K1L2", "name": "Surf Excel 1kg",    "price": 220, "gst": 18 }
]
```

---

## 📡 API & Communication

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/scan` | ESP32 sends scanned tag/barcode ID |
| `GET`  | `/api/products` | Fetch full product catalog |
| `GET`  | `/api/cart` | Get current cart state |
| `POST` | `/api/checkout` | Finalize cart and generate bill |
| `DELETE` | `/api/cart/clear` | Clear cart after checkout |

### Sample ESP32 POST Payload
```json
{
  "tagId": "A1B2C3D4",
  "type": "rfid",
  "timestamp": 1711500000
}
```

### Sample Server Response
```json
{
  "status": "added",
  "product": {
    "id": "A1B2C3D4",
    "name": "Amul Butter 500g",
    "price": 275,
    "gst": 5,
    "quantity": 1
  },
  "cartTotal": 275
}
```

---

## 📸 Screenshots

<div align="center">

> 🚧 **Live screenshots coming as development progresses!**
> Star the repo to get notified when the first demo drops ⭐

| View | Status |
|------|--------|
| 🛒 Cart Dashboard (live) | 🔄 Coming Soon |
| 🔍 RFID Scan Demo | 🔄 Coming Soon |
| 💳 Checkout Receipt | 🔄 Coming Soon |
| 🔌 Hardware Wiring | 🔄 Coming Soon |

</div>

---

## 🔮 Roadmap

<div align="center">
```
2024 Q1          2024 Q2          2024 Q3          2024 Q4
   │                │                │                │
   ▼                ▼                ▼                ▼
[Core MVP]     [Dashboard]     [Payments]       [Scale]
ESP32 + RFID   React UI Live   UPI / Razorpay   Multi-cart
Barcode Scan   Admin Panel     QR Checkout      Cloud Sync
WiFi POST      Product DB      Weight Sensor    Analytics
```

</div>

#### ✅ Completed
- [x] ESP32 Wi-Fi connectivity & HTTP POST
- [x] RFID RC522 tag reading
- [x] Barcode scanner integration
- [x] React dashboard — live cart display
- [x] Running cart total calculation
- [x] LED + Buzzer feedback on scan

#### 🔄 In Progress
- [ ] Persistent product database (SQLite)
- [ ] Admin panel for product management
- [ ] WebSocket real-time sync (replacing polling)
- [ ] Mobile-responsive UI improvements

#### 🔮 Planned
- [ ] QR code based mobile checkout
- [ ] UPI / Razorpay payment gateway
- [ ] Weight sensor anti-theft validation
- [ ] OTA firmware updates for ESP32
- [ ] Cloud sync with Firebase
- [ ] Multi-cart session management
- [ ] Sales analytics dashboard
- [ ] Printer receipt via thermal printer
- [ ] Customer loyalty points system

---

## ⚠️ Known Issues

| # | Issue | Status |
|---|-------|--------|
| 1 | RFID reads may flicker if tag held too long | 🔄 Debounce fix in progress |
| 2 | Frontend doesn't persist cart on page refresh | 🔄 localStorage fix planned |
| 3 | ESP32 drops Wi-Fi on long idle | 🔄 Reconnect watchdog in progress |
| 4 | No authentication on `/api/checkout` | ⚠️ Security fix planned |

> Found a bug? [Open an issue](https://github.com/RishvinReddy/Smart-cart-os/issues) — contributions welcome!

---

## 🤝 Contributing

We welcome contributions of all kinds — bug fixes, new features, documentation, hardware improvements!
```bash
# 1. Fork the repository
#    Click the "Fork" button on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/Smart-cart-os.git
cd Smart-cart-os

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Make your changes and commit
git add .
git commit -m "feat: describe what you added"

# 5. Push and open a Pull Request
git push origin feature/your-feature-name
```

### Commit Convention

| Prefix | Use for |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation update |
| `hw:` | Hardware / firmware change |
| `style:` | UI styling change |
| `refactor:` | Code cleanup |

---

## 📄 License
```
MIT License — Copyright (c) 2024 Rishvin Reddy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

Full license in [LICENSE](./LICENSE).

---

## 👨‍💻 Author

<div align="center">

<img src="https://github.com/RishvinReddy.png" width="120" style="border-radius:50%; border: 3px solid #00D9FF;" />

<br/>

### Rishvin Reddy

**B.Tech CSE — IoT, Blockchain & Cybersecurity**
**Woxsen University, Hyderabad · Class of 2028**

*Builder. Hacker. IoT Enthusiast. Future Startup Founder.*

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-RishvinReddy-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RishvinReddy)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/rishvinreddy)
[![Portfolio](https://img.shields.io/badge/Portfolio-rishvinreddy.github.io-00D9FF?style=for-the-badge&logo=githubpages&logoColor=white)](https://rishvinreddy.github.io)

<br/>

> *"Building the things I wish existed."*

</div>

---

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=14&duration=3000&pause=1000&color=7B2FBE&center=true&vCenter=true&width=500&lines=Thanks+for+visiting+Smart+Cart+OS!;⭐+Star+the+repo+if+it+helped+you!;🛒+The+future+of+retail+starts+here." />

<br/>

**If this project helped or inspired you, drop a ⭐ — it keeps the cart rolling!**

<br/>

![Footer](https://capsule-render.vercel.app/api?type=waving&color=0:7B2FBE,50:0052CC,100:00D9FF&height=120&section=footer)

</div>
