<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=32&duration=3000&pause=1000&color=00D9FF&center=true&vCenter=true&width=600&lines=🛒+Smart+Cart+OS;IoT+Shopping+%2B+RFID+%2B+ESP32;Scan.+Track.+Checkout." alt="Typing SVG" />

<br/>

![Smart Cart Banner](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12&height=200&section=header&text=Smart%20Cart%20OS&fontSize=50&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=IoT-Powered%20Shopping%20Experience&descAlignY=55&descAlign=50)

<br/>

[![Arduino](https://img.shields.io/badge/Arduino-00979D?style=for-the-badge&logo=arduino&logoColor=white)](https://www.arduino.cc/)
[![ESP32](https://img.shields.io/badge/ESP32-E7352C?style=for-the-badge&logo=espressif&logoColor=white)](https://www.espressif.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![RFID](https://img.shields.io/badge/RFID%2FNFC-0052CC?style=for-the-badge&logo=nfc&logoColor=white)]()

<br/>

[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=flat-square)](https://github.com/RishvinReddy/Smart-cart-os)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](./LICENSE)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️%20in%20Hyderabad-red?style=flat-square)](https://github.com/RishvinReddy)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](https://github.com/RishvinReddy/Smart-cart-os/pulls)

</div>

---

## 🛒 What is Smart Cart OS?

**Smart Cart OS** is an IoT-powered smart shopping cart system that transforms the traditional retail experience. By combining **ESP32 microcontrollers**, **RFID/Barcode scanning**, and a **React-based dashboard**, it enables real-time product identification, automatic billing, and seamless checkout — all without waiting in queues.

> 🎯 **Goal:** Eliminate checkout friction by bringing intelligence directly to the shopping cart.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔍 Smart Scanning
- **RFID tag** detection for product identification
- **Barcode scanning** support for standard retail items
- Real-time item addition & removal from cart
- Duplicate item detection & quantity management

</td>
<td width="50%">

### 📊 Live Dashboard
- React-based frontend for cart monitoring
- Real-time cart total & itemized billing
- Product catalog with price lookup
- Cart history and session management

</td>
</tr>
<tr>
<td width="50%">

### ⚡ ESP32 Core
- Wi-Fi enabled for real-time data sync
- Low-latency communication with the web interface
- Compact, cart-mountable hardware form factor
- Serial communication with RFID/Barcode modules

</td>
<td width="50%">

### 💳 Checkout Experience
- Automatic bill generation
- Queue-free checkout flow
- Session-based cart persistence
- Extensible payment gateway integration

</td>
</tr>
</table>

---

## 🏗️ System Architecture
```
┌─────────────────────────────────────────────────────────┐
│                     SMART CART OS                        │
│                                                          │
│   ┌──────────────┐     ┌──────────────────────────────┐ │
│   │   HARDWARE   │     │         SOFTWARE             │ │
│   │              │     │                              │ │
│   │  ┌────────┐  │     │  ┌────────┐   ┌──────────┐  │ │
│   │  │  RFID  │──│─────│─▶│ ESP32  │──▶│  React   │  │ │
│   │  │ Module │  │     │  │ Server │   │Dashboard │  │ │
│   │  └────────┘  │     │  └────────┘   └──────────┘  │ │
│   │              │     │       │                      │ │
│   │  ┌────────┐  │     │       ▼                      │ │
│   │  │Barcode │──│─────│─▶ ┌──────────────────────┐   │ │
│   │  │Scanner │  │     │   │   Cart State Engine  │   │ │
│   │  └────────┘  │     │   │  (Add/Remove/Total)  │   │ │
│   │              │     │   └──────────────────────┘   │ │
│   │  ┌────────┐  │     │                              │ │
│   │  │ ESP32  │  │     │                              │ │
│   │  │ Board  │  │     │                              │ │
│   │  └────────┘  │     │                              │ │
│   └──────────────┘     └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Microcontroller** | ESP32 | Wi-Fi-enabled IoT brain of the cart |
| **Scanning** | RFID (RC522 / PN532) | Tag-based product identification |
| **Scanning** | Barcode Module | Standard retail barcode reading |
| **Firmware** | Arduino C/C++ | ESP32 programming & serial handling |
| **Frontend** | React.js | Real-time cart dashboard UI |
| **Styling** | CSS / Tailwind | Responsive, clean interface |
| **Communication** | WebSocket / HTTP | ESP32 ↔ Dashboard real-time sync |

---

## 📁 Project Structure
```
Smart-cart-os/
│
├── 📂 hardware/
│   ├── 📄 smart_cart.ino          # Main Arduino sketch for ESP32
│   ├── 📄 rfid_handler.ino        # RFID read/write logic
│   └── 📄 barcode_handler.ino     # Barcode serial parsing
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📄 App.jsx             # Main React app
│   │   ├── 📄 CartDashboard.jsx   # Live cart display
│   │   └── 📄 ProductList.jsx     # Product catalog component
│   ├── 📄 package.json
│   └── 📄 index.html
│
├── 📂 docs/
│   └── 📄 circuit_diagram.png     # Hardware wiring reference
│
└── 📄 README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Arduino IDE (v2.x recommended)
- Node.js v18+
- ESP32 board support installed in Arduino IDE
- RFID module (RC522 or PN532) + ESP32 dev board

---

### 🔌 Hardware Setup

**Wire your RFID module to ESP32:**

| RFID Pin | ESP32 Pin |
|----------|-----------|
| SDA      | GPIO 5    |
| SCK      | GPIO 18   |
| MOSI     | GPIO 23   |
| MISO     | GPIO 19   |
| GND      | GND       |
| RST      | GPIO 22   |
| 3.3V     | 3.3V      |

Connect your barcode scanner to the **UART/Serial** pins of the ESP32.

---

### 💻 Firmware Upload
```bash
# 1. Clone the repository
git clone https://github.com/RishvinReddy/Smart-cart-os.git
cd Smart-cart-os/hardware

# 2. Open smart_cart.ino in Arduino IDE

# 3. Install required libraries via Library Manager:
#    - MFRC522 (for RFID)
#    - ArduinoJson
#    - ESPAsyncWebServer (or WiFiServer)

# 4. Update WiFi credentials in smart_cart.ino
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

# 5. Select Board: ESP32 Dev Module → Upload
```

---

### 🖥️ Frontend Setup
```bash
# Navigate to frontend directory
cd Smart-cart-os/frontend

# Install dependencies
npm install

# Start the development server
npm run dev

# Open in browser → http://localhost:5173
```

> ⚠️ Make sure the ESP32 IP address is configured in the frontend API config to match your local network.

---

## 📸 Screenshots

> 🚧 Screenshots coming soon — check back as the project progresses!

---

## 🔮 Roadmap

- [x] ESP32 Wi-Fi connectivity
- [x] RFID tag reading & product lookup
- [x] Barcode scanner integration
- [x] React dashboard — live cart view
- [ ] Persistent product database (SQLite / Firebase)
- [ ] QR code based mobile checkout
- [ ] Admin panel for product management
- [ ] Payment gateway integration (Razorpay / UPI)
- [ ] Weight sensor validation (anti-theft)
- [ ] OTA firmware updates for ESP32

---

## 🤝 Contributing

Contributions are welcome! Here's how:
```bash
# 1. Fork the repo
# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature"

# 4. Push to your branch
git push origin feature/your-feature-name

# 5. Open a Pull Request 🎉
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

<img src="https://github.com/RishvinReddy.png" width="100" style="border-radius: 50%;" />

### Rishvin Reddy
**B.Tech CSE (IoT, Blockchain & Cybersecurity) · Woxsen University, Hyderabad**

[![GitHub](https://img.shields.io/badge/GitHub-RishvinReddy-181717?style=for-the-badge&logo=github)](https://github.com/RishvinReddy)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/rishvinreddy)
[![Portfolio](https://img.shields.io/badge/Portfolio-rishvinreddy.github.io-00D9FF?style=for-the-badge&logo=githubpages)](https://rishvinreddy.github.io)

</div>

---

<div align="center">

![Footer](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12&height=100&section=footer)

**⭐ If you found this useful, drop a star — it means a lot!**

</div>
