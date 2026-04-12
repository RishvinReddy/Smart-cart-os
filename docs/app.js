/* ═══════════════════════════════════════════════════════════════════════
   Smart Cart OS — Full Simulation Engine (GitHub Pages)
   All demos are pure JS simulations — no backend needed.
═══════════════════════════════════════════════════════════════════════ */

/* ── Scroll Reveal ─────────────────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const siblings = Array.from(e.target.parentElement.querySelectorAll('.reveal'));
      e.target.style.transitionDelay = `${siblings.indexOf(e.target) * 70}ms`;
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── Counter Animation ─────────────────────────────────────────────── */
const ctrObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const t = parseInt(e.target.dataset.target);
      if (!isNaN(t)) animCount(e.target, t);
      ctrObs.unobserve(e.target);
    }
  });
}, { threshold: 0.8 });
document.querySelectorAll('.stat-number[data-target]').forEach(el => ctrObs.observe(el));

function animCount(el, target, dur = 1400) {
  let s = 0, step = target / (dur / 16);
  const tick = () => { s = Math.min(s + step, target); el.textContent = Math.floor(s); if (s < target) requestAnimationFrame(tick); else el.textContent = target; };
  requestAnimationFrame(tick);
}

/* ── Navbar ────────────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 30px rgba(0,0,0,.5)' : 'none'; }, { passive: true });

document.getElementById('hamburgerBtn').addEventListener('click', () => {
  const m = document.getElementById('mobileMenu');
  m.style.display = m.style.display === 'flex' ? 'none' : 'flex';
});
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => { document.getElementById('mobileMenu').style.display = 'none'; }));

/* ── Demo Tabs ─────────────────────────────────────────────────────── */
document.querySelectorAll('.demo-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.demo-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.demo-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('demo-' + tab.dataset.demo).classList.add('active');
    if (tab.dataset.demo === 'dashboard') dashStart();
    if (tab.dataset.demo === 'budget') initBudget();
    if (tab.dataset.demo === 'barcode') initBarcodeGrid();
    if (tab.dataset.demo === 'voice') initVoiceWave();
  });
});

/* ══════════════════════════════════════════════════════════════════════
   DEMO 1 — RFID Cart Simulation
══════════════════════════════════════════════════════════════════════ */
let rfidCart = [], rfidTotal = 0, rfidInterval = null, rfidAutoIdx = 0;

const rfidProducts = [
  { id:1, name:'Organic Whole Milk', price:64,  uid:'04:A2:3F:77', emoji:'🥛' },
  { id:2, name:'Sourdough Bread',    price:55,  uid:'A1:2F:45:C1', emoji:'🍞' },
  { id:3, name:'Free Range Eggs',    price:110, uid:'C3:88:21:00', emoji:'🥚' },
  { id:4, name:'Tata Tea Gold',      price:150, uid:'H8:33:DD:66', emoji:'🍵' },
  { id:5, name:'India Gate Rice',    price:185, uid:'F6:11:BB:44', emoji:'🍚' },
  { id:6, name:'Amul Pure Ghee',     price:275, uid:'M3:88:22:BB', emoji:'🧈' },
  { id:7, name:'Lays Magic Masala',  price:20,  uid:'R8:44:77:00', emoji:'🍟' },
];

function rfidLog(msg, type = 'info') {
  const el = document.getElementById('logEntries');
  const d = document.createElement('div');
  d.className = `log-entry log-${type}`;
  d.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  el.prepend(d);
  if (el.children.length > 8) el.removeChild(el.lastChild);
}

function rfidScanProduct(product) {
  const dot = document.getElementById('statusDot');
  const statusTxt = document.getElementById('statusText');
  dot.className = 'status-dot scanning';
  statusTxt.textContent = `Scanning UID: ${product.uid}...`;
  rfidLog(`RFID detected: UID ${product.uid}`, 'info');

  const items = document.querySelectorAll('.shelf-item');
  items.forEach(i => { if (parseInt(i.dataset.id) === product.id) { i.classList.add('scanning'); } });

  setTimeout(() => {
    items.forEach(i => { if (parseInt(i.dataset.id) === product.id) { i.classList.remove('scanning'); i.classList.add('scanned'); } });
    const existing = rfidCart.find(p => p.id === product.id);
    if (existing) { existing.qty++; } else { rfidCart.push({ ...product, qty: 1 }); }
    rfidTotal += product.price;
    rfidLog(`✓ Added: ${product.name} — ₹${product.price}`, 'success');
    dot.className = 'status-dot active';
    statusTxt.textContent = `Scanned: ${product.name}`;
    renderRfidCart();
  }, 600);
}

function renderRfidCart() {
  const el = document.getElementById('rfidCartItems');
  document.getElementById('rfidTotal').textContent = `₹${rfidTotal.toFixed(2)}`;
  document.getElementById('rfidCount').textContent = rfidCart.reduce((s, i) => s + i.qty, 0);
  if (rfidCart.length === 0) { el.innerHTML = '<div class="empty-cart">Place items in cart to start scanning</div>'; return; }
  el.innerHTML = rfidCart.map(i => `
    <div class="cart-item-row">
      <span class="ci-name">${i.emoji} ${i.name}${i.qty > 1 ? ` ×${i.qty}` : ''}</span>
      <span class="ci-price">₹${(i.price * i.qty).toFixed(0)}</span>
    </div>`).join('');
}

window.rfidAutoScan = function() {
  if (rfidInterval) { clearInterval(rfidInterval); rfidInterval = null; document.getElementById('rfidAutoBtn').textContent = '▶ Auto Scan'; return; }
  document.getElementById('rfidAutoBtn').textContent = '⏹ Stop';
  rfidAutoIdx = 0;
  rfidInterval = setInterval(() => {
    if (rfidAutoIdx >= rfidProducts.length) { clearInterval(rfidInterval); rfidInterval = null; document.getElementById('rfidAutoBtn').textContent = '▶ Auto Scan'; rfidLog('✓ All items scanned!', 'success'); return; }
    rfidScanProduct(rfidProducts[rfidAutoIdx++]);
  }, 1200);
};

window.rfidClear = function() {
  rfidCart = []; rfidTotal = 0;
  document.querySelectorAll('.shelf-item').forEach(i => { i.classList.remove('scanned'); });
  document.getElementById('rfidCount').textContent = '0';
  document.getElementById('rfidTotal').textContent = '₹0.00';
  document.getElementById('rfidCartItems').innerHTML = '<div class="empty-cart">Place items in cart to start scanning</div>';
  document.getElementById('statusDot').className = 'status-dot';
  document.getElementById('statusText').textContent = 'Waiting for scan...';
  rfidLog('Cart cleared', 'warn');
};

window.rfidCheckout = function() {
  if (rfidCart.length === 0) return;
  rfidLog(`✓ Checkout complete! Total: ₹${rfidTotal.toFixed(2)}`, 'success');
  setTimeout(() => { rfidClear(); }, 1500);
};

// Click to scan individual items
document.querySelectorAll('.shelf-item').forEach(item => {
  item.addEventListener('click', () => {
    const id = parseInt(item.dataset.id);
    const product = rfidProducts.find(p => p.id === id);
    if (product) rfidScanProduct(product);
  });
});

/* ══════════════════════════════════════════════════════════════════════
   DEMO 2 — AI Chat Simulation
══════════════════════════════════════════════════════════════════════ */
const chatResponses = [
  { q: "Budget groceries under ₹500?",
    a: `Here's a smart grocery list under ₹500 for a week! 🛒\n\n• 🍚 India Gate Basmati Rice — ₹185\n• 🌿 Toor Dal (1kg) — ₹145\n• 🥛 Organic Whole Milk — ₹64\n• 🌾 Aashirvaad Atta — ₹62\n\n✅ Total: ₹456 — saves you ₹44!\n\nWant me to add these to your cart?` },
  { q: "Show me dairy products",
    a: `Found 5 dairy products in the store! 🥛\n\n• 🥛 Organic Whole Milk — ₹64\n• 🧀 Amul Malai Paneer — ₹95\n• 🧈 Amul Butter — ₹56\n• 🥣 Amul Pure Ghee — ₹275\n• 🥚 Free Range Eggs — ₹110\n\n💡 Dairy total: ₹600. Milk and paneer give the best protein-per-rupee ratio!` },
  { q: "Plan meals for a week",
    a: `Here's your AI-generated 7-day meal plan! 🍽️\n\nMon: Dal Chawal · Tue: Paneer Sabzi\nWed: Egg Curry · Thu: Poha + Tea\nFri: Rice + Sambar · Sat: Atta Roti\nSun: Khichdi\n\n🛒 I'll auto-add ingredients:\n• Rice, Dal, Eggs, Paneer, Atta, Tea\n\nEstimated cost: ₹820 for the week.` },
  { q: "Nutrition info for Avocados",
    a: `Avocados (Pack of 3) — ₹240 🥑\n\n📊 Per serving (half avocado):\n• Calories: 117\n• Protein: 1.5g\n• Carbs: 6g\n• Healthy Fat: 10.5g (monounsaturated!)\n• Fiber: 4.6g\n\n✨ Benefits: Rich in potassium, Vitamin K, B5 & B6, heart-healthy fats.\n\nCurrently out of stock — I'll notify you when it's back!` },
  { q: "Cheapest snacks available",
    a: `Best value snacks right now! 🍟\n\n1. 🍟 Lays Magic Masala — ₹20 ← Best value!\n2. 🍪 Britannia Marie Gold — ₹30\n3. 🍪 Britannia Good Day — ₹35\n4. 🧂 Haldiram's Bhujia — ₹55 (big pack!)\n5. 🍫 Cadbury Dairy Milk Silk — ₹175 (premium)\n\n💡 Tip: Haldiram's Bhujia at ₹55 for 200g is the best price-per-gram!` }
];

let chatTyping = false;

function addChatBubble(text, isUser) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `msg ${isUser ? 'user-msg' : 'ai-msg'}`;
  div.innerHTML = `<div class="msg-avatar">${isUser ? '👤' : '🤖'}</div><div class="msg-bubble">${text.replace(/\n/g,'<br/>')}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('chatMessages');
  const d = document.createElement('div');
  d.className = 'msg ai-msg'; d.id = 'typingIndicator';
  d.innerHTML = '<div class="msg-avatar">🤖</div><div class="msg-bubble typing-bubble"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
  msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() { const t = document.getElementById('typingIndicator'); if (t) t.remove(); }

window.chatAsk = function(idx) {
  if (chatTyping) return;
  const r = chatResponses[idx];
  addChatBubble(r.q, true);
  chatTyping = true;
  showTyping();
  setTimeout(() => { removeTyping(); addChatBubble(r.a, false); chatTyping = false; }, 1200 + Math.random() * 600);
};

window.chatSend = function() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text || chatTyping) return;
  addChatBubble(text, true);
  input.value = '';
  chatTyping = true;
  showTyping();
  const lower = text.toLowerCase();
  let reply = "Great question! I'm a simulated AI on this demo page. In the real app, I'd connect to Gemini API and give you personalized grocery advice, recipes, nutrition info, and budget optimization! Try one of the preset questions on the left 👈";
  if (lower.includes('milk') || lower.includes('dairy')) reply = chatResponses[1].a;
  else if (lower.includes('budget') || lower.includes('cheap') || lower.includes('₹')) reply = chatResponses[0].a;
  else if (lower.includes('meal') || lower.includes('plan') || lower.includes('week')) reply = chatResponses[2].a;
  else if (lower.includes('snack') || lower.includes('chips')) reply = chatResponses[4].a;
  setTimeout(() => { removeTyping(); addChatBubble(reply, false); chatTyping = false; }, 1000 + Math.random() * 800);
};

/* ══════════════════════════════════════════════════════════════════════
   DEMO 3 — Barcode Scanner
══════════════════════════════════════════════════════════════════════ */
const barcodeProducts = [
  { name:'Maggi Noodles', price:14, emoji:'🍜', barcode:'8901058000306' },
  { name:'Amul Butter', price:56, emoji:'🧈', barcode:'8901030006178' },
  { name:'Tata Tea Gold', price:150, emoji:'🍵', barcode:'8904147800016' },
  { name:'Lays Masala', price:20, emoji:'🍟', barcode:'8901491102609' },
  { name:'MDH Garam Masala', price:88, emoji:'🌶️', barcode:'8904004500014' },
  { name:'India Gate Rice', price:185, emoji:'🍚', barcode:'8906083310015' },
];

let bcCart = [], bcTotal = 0, scanning = false;

function initBarcodeGrid() {
  const grid = document.getElementById('barcodeProductGrid');
  grid.innerHTML = barcodeProducts.map((p, i) => `
    <div class="bp-item" onclick="barcodeScanItem(${i})">
      <span>${p.emoji}</span><span style="font-size:.65rem;color:var(--tx3)">${p.name.split(' ')[0]}</span>
    </div>`).join('');
}
initBarcodeGrid();

window.startBarcodeScan = function() {
  if (scanning) return;
  scanning = true;
  document.getElementById('scannerIdle').style.display = 'none';
  const line = document.getElementById('scannerLine');
  line.style.display = 'block';
  line.style.top = '0px';
  let pos = 0, dir = 1;
  const frame = document.getElementById('scannerFrame');
  const h = frame.offsetHeight;
  const anim = setInterval(() => { pos += dir * 3; if (pos > h - 4 || pos < 0) dir *= -1; line.style.top = pos + 'px'; }, 16);

  setTimeout(() => {
    clearInterval(anim);
    const product = barcodeProducts[Math.floor(Math.random() * barcodeProducts.length)];
    line.style.display = 'none';
    showBarcodeDetected(product);
    scanning = false;
  }, 2000 + Math.random() * 1000);
};

function showBarcodeDetected(product) {
  const det = document.getElementById('scannerDetected');
  document.getElementById('detectedName').textContent = product.name;
  document.getElementById('detectedPrice').textContent = `₹${product.price}`;
  det.style.display = 'flex'; det.style.flexDirection = 'column';
  bcAddItem(product);
  setTimeout(() => { det.style.display = 'none'; document.getElementById('scannerIdle').style.display = 'block'; }, 2500);
}

window.barcodeScanItem = function(idx) { showBarcodeDetected(barcodeProducts[idx]); };
window.barcodeManualScan = function() { window.startBarcodeScan(); };

function bcAddItem(product) {
  const existing = bcCart.find(p => p.name === product.name);
  if (existing) existing.qty = (existing.qty || 1) + 1;
  else bcCart.push({ ...product, qty: 1 });
  bcTotal += product.price;
  const cart = document.getElementById('barcodeCart');
  document.getElementById('bcTotal').textContent = `₹${bcTotal.toFixed(2)}`;
  cart.innerHTML = bcCart.map(p => `
    <div class="bc-item">
      <span>${p.emoji} ${p.name}${p.qty > 1 ? ' ×' + p.qty : ''}</span>
      <span style="color:var(--em);font-weight:700">₹${(p.price * p.qty).toFixed(0)}</span>
    </div>`).join('');
}

/* ══════════════════════════════════════════════════════════════════════
   DEMO 4 — Voice Control
══════════════════════════════════════════════════════════════════════ */
let voiceCart = [], voiceTotal = 0, voiceListening = false, waveCtx, waveAnim;

const voiceCmds = [
  { cmd: '"Add milk to cart"',   action: () => voiceAddItem({ name:'Organic Whole Milk', price:64, emoji:'🥛' }), response: '✅ Added Organic Whole Milk × 1 — ₹64' },
  { cmd: '"Remove bread"',       action: () => voiceRemoveItem('Sourdough Bread'), response: '🗑 Removed Sourdough Bread from cart' },
  { cmd: '"What\'s my total?"',  action: () => {}, response: () => `🛒 Your cart total is ₹${voiceTotal.toFixed(2)} (${voiceCart.reduce((s,i)=>s+i.qty,0)} items)` },
  { cmd: '"Clear my cart"',      action: () => voiceClearCart(), response: '🗑 Cart cleared!' },
  { cmd: '"Add 2 eggs"',         action: () => { voiceAddItem({ name:'Free Range Eggs', price:110, emoji:'🥚' }); voiceAddItem({ name:'Free Range Eggs', price:110, emoji:'🥚' }); }, response: '✅ Added Free Range Eggs × 2 — ₹220' },
];

function initVoiceWave() {
  const canvas = document.getElementById('voiceWave');
  waveCtx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth * 2;
  canvas.height = 100;
  canvas.style.width = '100%';
  drawIdleWave();
}

function drawIdleWave() {
  if (!waveCtx) return;
  const c = waveCtx, w = c.canvas.width, h = c.canvas.height;
  c.clearRect(0, 0, w, h);
  c.strokeStyle = 'rgba(99,102,241,0.3)'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(0, h / 2);
  for (let x = 0; x < w; x++) { c.lineTo(x, h / 2 + Math.sin(x * 0.05 + Date.now() * 0.002) * 5); }
  c.stroke();
  if (!voiceListening) waveAnim = requestAnimationFrame(drawIdleWave);
}

function drawActiveWave() {
  if (!waveCtx) return;
  cancelAnimationFrame(waveAnim);
  const c = waveCtx, w = c.canvas.width, h = c.canvas.height;
  c.clearRect(0, 0, w, h);
  const grad = c.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, '#6366f1'); grad.addColorStop(0.5, '#8b5cf6'); grad.addColorStop(1, '#06b6d4');
  c.strokeStyle = grad; c.lineWidth = 3;
  c.beginPath(); c.moveTo(0, h / 2);
  for (let x = 0; x < w; x++) {
    const amp = 20 + Math.random() * 20;
    c.lineTo(x, h / 2 + Math.sin(x * 0.04 + Date.now() * 0.008) * amp);
  }
  c.stroke();
  if (voiceListening) waveAnim = requestAnimationFrame(drawActiveWave);
}

window.voiceToggle = function() {
  voiceListening = !voiceListening;
  const orb = document.getElementById('voiceOrb');
  const status = document.getElementById('voiceStatus');
  if (voiceListening) {
    orb.classList.add('listening');
    document.querySelectorAll('.vring').forEach(r => r.classList.add('active'));
    status.textContent = '🎤 Listening...';
    document.getElementById('voiceTranscript').textContent = '';
    drawActiveWave();
    setTimeout(() => { if (voiceListening) { voiceListening = false; orb.classList.remove('listening'); document.querySelectorAll('.vring').forEach(r => r.classList.remove('active')); status.textContent = 'Tap the mic to speak'; cancelAnimationFrame(waveAnim); drawIdleWave(); } }, 2000);
  } else {
    orb.classList.remove('listening');
    document.querySelectorAll('.vring').forEach(r => r.classList.remove('active'));
    status.textContent = 'Tap the mic to speak';
    cancelAnimationFrame(waveAnim); drawIdleWave();
  }
};

window.voiceCommand = function(idx) {
  const cmd = voiceCmds[idx];
  voiceListening = true;
  const orb = document.getElementById('voiceOrb');
  orb.classList.add('listening');
  document.querySelectorAll('.vring').forEach(r => r.classList.add('active'));
  document.getElementById('voiceStatus').textContent = '🎤 Listening...';
  document.getElementById('voiceTranscript').textContent = '';
  drawActiveWave();

  setTimeout(() => {
    document.getElementById('voiceTranscript').textContent = cmd.cmd.replace(/"/g, '');
    document.getElementById('voiceStatus').textContent = 'Processing...';
  }, 700);

  setTimeout(() => {
    voiceListening = false;
    orb.classList.remove('listening');
    document.querySelectorAll('.vring').forEach(r => r.classList.remove('active'));
    cancelAnimationFrame(waveAnim); drawIdleWave();
    cmd.action();
    const resp = typeof cmd.response === 'function' ? cmd.response() : cmd.response;
    document.getElementById('voiceStatus').textContent = resp;
    addVoiceHistory(cmd.cmd.replace(/"/g,''), resp);
  }, 1600);
};

function voiceAddItem(product) {
  const ex = voiceCart.find(p => p.name === product.name);
  if (ex) ex.qty = (ex.qty || 1) + 1; else voiceCart.push({ ...product, qty: 1 });
  voiceTotal += product.price;
  renderVoiceCart();
}

function voiceRemoveItem(name) {
  const idx = voiceCart.findIndex(p => p.name === name);
  if (idx !== -1) { voiceTotal -= voiceCart[idx].price * voiceCart[idx].qty; voiceCart.splice(idx, 1); }
  renderVoiceCart();
}

function voiceClearCart() { voiceCart = []; voiceTotal = 0; renderVoiceCart(); }

function renderVoiceCart() {
  const el = document.getElementById('voiceCart');
  document.getElementById('voiceTotal').textContent = `₹${voiceTotal.toFixed(2)}`;
  if (voiceCart.length === 0) { el.innerHTML = '<div class="vc-empty">No items added yet. Use voice commands!</div>'; return; }
  el.innerHTML = voiceCart.map(i => `
    <div class="vc-item">
      <span>${i.emoji} ${i.name}${i.qty > 1 ? ' ×' + i.qty : ''}</span>
      <span style="color:var(--em);font-weight:700">₹${(i.price * i.qty).toFixed(0)}</span>
    </div>`).join('');
}

function addVoiceHistory(cmd, resp) {
  const h = document.getElementById('voiceHistory');
  const d = document.createElement('div');
  d.className = 'vh-entry';
  d.textContent = `> ${cmd} → ${resp}`;
  const existingEntries = h.querySelectorAll('.vh-entry');
  h.insertBefore(d, existingEntries[0] || null);
  if (existingEntries.length >= 4) existingEntries[existingEntries.length - 1].remove();
}

/* ══════════════════════════════════════════════════════════════════════
   DEMO 5 — Admin Dashboard
══════════════════════════════════════════════════════════════════════ */
let dashRunning = false, dashTimers = [];

const dashLogs = [
  { msg:'RFID scan: UID 04:A2:3F:77 → Milk added', type:'success' },
  { msg:'Cart #04A2: checkout initiated — ₹456', type:'success' },
  { msg:'New cart session started: #B1C3', type:'info' },
  { msg:'Product p-003 (Avocado): out of stock', type:'warn' },
  { msg:'Admin login from 192.168.1.10', type:'info' },
  { msg:'MQTT broker: 3 devices connected', type:'info' },
  { msg:'Cart #C7D2: item removed (Sourdough)', type:'warn' },
  { msg:'Gemini API: 42 queries today', type:'success' },
  { msg:'RFID scan: UID F6:11:BB:44 → Rice added', type:'success' },
  { msg:'Analytics report generated', type:'info' },
  { msg:'Edge gateway ping: 12ms latency', type:'info' },
  { msg:'Cart #04A2: total updated ₹641', type:'success' },
];

const dbTables = {
  products: {
    cols: ['id','name','price','rfid_uid','in_stock'],
    rows: [
      ['p-001','Organic Whole Milk','₹64','04:A2:3F:77','✅'],
      ['p-002','Sourdough Bread','₹55','A1:2F:45:C1','✅'],
      ['p-003','Avocados (Pack 3)','₹240','B2:11:9A:FF','❌'],
      ['p-004','Free Range Eggs','₹110','C3:88:21:00','✅'],
      ['p-007','India Gate Rice','₹185','F6:11:BB:44','✅'],
    ]
  },
  orders: {
    cols: ['id','cart_id','total','status','time'],
    rows: [
      ['ORD-001','#04A2','₹456','completed','14:21'],
      ['ORD-002','#B1C3','₹285','active','14:28'],
      ['ORD-003','#C7D2','₹812','completed','13:55'],
      ['ORD-004','#D3E1','₹124','pending','14:31'],
    ]
  },
  logs: {
    cols: ['time','source','event','type'],
    rows: [
      ['14:31:02','RFID','Scan: UID 04:A2','info'],
      ['14:31:05','API','Cart item added','success'],
      ['14:30:58','Auth','Admin login','info'],
      ['14:30:45','MQTT','Device connected','success'],
      ['14:30:22','Cart','Checkout: ORD-001','success'],
    ]
  }
};

window.dashStart = function() {
  if (dashRunning) return;
  dashRunning = true;
  let orders = 12, revenue = 3456, carts = 3, logIdx = 0;

  animCount(document.getElementById('dsOrders'), orders);
  const revEl = document.getElementById('dsRevenue');
  let rv = 0; const rstep = revenue / 80;
  const rtick = setInterval(() => { rv = Math.min(rv + rstep, revenue); revEl.textContent = '₹' + Math.floor(rv); if (rv >= revenue) clearInterval(rtick); }, 16);
  document.getElementById('dsCarts').textContent = carts;
  renderDbTable('products');
  setTimeout(() => {
    document.querySelectorAll('.cat-bar-fill').forEach(el => { el.style.width = el.className.includes('dairy') ? '32%' : el.className.includes('pantry') ? '28%' : el.className.includes('snacks') ? '22%' : el.className.includes('bev') ? '12%' : '6%'; });
  }, 300);

  const logTimer = setInterval(() => {
    if (!dashRunning) return;
    const log = dashLogs[logIdx % dashLogs.length]; logIdx++;
    const dlEl = document.getElementById('dashLogEntries');
    const d = document.createElement('div');
    d.className = `dl-entry ${log.type}`;
    d.textContent = `[${new Date().toLocaleTimeString()}] ${log.msg}`;
    dlEl.prepend(d);
    if (dlEl.children.length > 10) dlEl.removeChild(dlEl.lastChild);

    // Occasionally update stats
    if (logIdx % 3 === 0) { orders++; document.getElementById('dsOrders').textContent = orders; }
    if (logIdx % 5 === 0) { revenue += Math.floor(Math.random() * 200 + 50); revEl.textContent = '₹' + revenue; }
  }, 1500);
  dashTimers.push(logTimer);
};

window.dashStop = function() {
  dashRunning = false;
  dashTimers.forEach(t => clearInterval(t));
  dashTimers = [];
};

window.switchDbTab = function(table, btn) {
  document.querySelectorAll('.db-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderDbTable(table);
};

function renderDbTable(table) {
  const t = dbTables[table];
  const wrap = document.getElementById('dbTableWrap');
  wrap.innerHTML = `<table class="db-table">
    <thead><tr>${t.cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
    <tbody>${t.rows.map(r => `<tr>${r.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
  </table>`;
}

/* ══════════════════════════════════════════════════════════════════════
   DEMO 6 — Budget Tracker
══════════════════════════════════════════════════════════════════════ */
const budgetItems = [
  { name:'Basmati Rice', price:185, emoji:'🍚' },
  { name:'Toor Dal', price:145, emoji:'🌿' },
  { name:'Amul Ghee', price:275, emoji:'🧈' },
  { name:'Wheat Atta', price:62, emoji:'🌾' },
  { name:'Organic Milk', price:64, emoji:'🥛' },
  { name:'Tata Tea', price:150, emoji:'🍵' },
  { name:'Free Eggs', price:110, emoji:'🥚' },
  { name:'Lays Chips', price:20, emoji:'🍟' },
];

let budgetAmount = 500, budgetSpent = 0, budgetList = [];

function initBudget() {
  const grid = document.getElementById('budgetItemsGrid');
  grid.innerHTML = budgetItems.map((item, i) => `
    <div class="bud-item" onclick="budgetAdd(${i})">
      <span>${item.emoji} ${item.name.split(' ')[0]}</span>
      <span>₹${item.price}</span>
    </div>`).join('');
}
initBudget();

window.updateBudget = function() {
  budgetAmount = parseInt(document.getElementById('budgetSlider').value);
  document.getElementById('budgetAmount').textContent = `₹${budgetAmount}`;
  updateBudgetUI();
};

window.budgetAdd = function(idx) {
  const item = budgetItems[idx];
  if (budgetSpent + item.price > budgetAmount * 1.5) { alert('Cart is getting very full!'); return; }
  const ex = budgetList.find(i => i.name === item.name);
  if (ex) ex.qty = (ex.qty || 1) + 1; else budgetList.push({ ...item, qty: 1 });
  budgetSpent += item.price;
  updateBudgetUI();
};

function updateBudgetUI() {
  const pct = Math.min((budgetSpent / budgetAmount) * 100, 100);
  const circ = 2 * Math.PI * 80;
  const offset = circ * (1 - pct / 100);
  document.getElementById('budgetArc').style.strokeDashoffset = offset;
  document.getElementById('budgetSpentLabel').textContent = `₹${budgetSpent}`;
  document.getElementById('budgetPctLabel').textContent = `${Math.round(pct)}%`;
  const remain = budgetAmount - budgetSpent;
  document.getElementById('budgetRemain').textContent = remain >= 0 ? `₹${remain}` : `-₹${Math.abs(remain)}`;
  document.getElementById('budgetRemain').style.color = remain < 0 ? '#f43f5e' : '#10b981';
  const alertEl = document.getElementById('budgetAlert');
  alertEl.style.display = pct >= 80 ? 'block' : 'none';

  const cart = document.getElementById('budgetCart');
  if (budgetList.length === 0) { cart.innerHTML = '<div class="bc-empty">No items added yet</div>'; return; }
  cart.innerHTML = budgetList.map((item, i) => `
    <div class="budget-item-row">
      <span>${item.emoji} ${item.name}${item.qty > 1 ? ' ×' + item.qty : ''}</span>
      <span style="display:flex;align-items:center;gap:8px">
        <span style="color:var(--em);font-weight:700">₹${item.price * item.qty}</span>
        <button class="remove-btn" onclick="budgetRemove(${i})">✕</button>
      </span>
    </div>`).join('');
}

window.budgetRemove = function(idx) {
  budgetSpent -= budgetList[idx].price * budgetList[idx].qty;
  budgetList.splice(idx, 1);
  updateBudgetUI();
};

/* ══════════════════════════════════════════════════════════════════════
   ALL 20 FEATURES — Filter Grid
══════════════════════════════════════════════════════════════════════ */
const allFeatures = [
  { emoji:'📡', title:'RFID Auto-Scan', desc:'Products detected instantly as they enter the cart. Real-time cart updates via ESP32 RFID hardware.', phase:'live', hot:false },
  { emoji:'🤖', title:'Gemini AI Assistant', desc:'Ask anything — nutrition, recipes, allergens, budget advice — powered by Google Gemini API.', phase:'live', hot:true },
  { emoji:'📱', title:'Mobile Shopper View', desc:'Customers see cart live on their phone, add/remove items, view nutrition labels & pay without queuing.', phase:'live', hot:false },
  { emoji:'📊', title:'Admin Dashboard', desc:'Real-time cart tracking, live DB views, system logs, transaction analytics — all in one screen.', phase:'live', hot:false },
  { emoji:'🔐', title:'Admin Authentication', desc:'Role-based access control separating shopper and admin views via a secure backend API.', phase:'live', hot:false },
  { emoji:'🗃️', title:'SQLite Persistence', desc:'All cart sessions, orders, and products persist. Swappable with PostgreSQL for production.', phase:'live', hot:false },
  { emoji:'🗣️', title:'AI Shopping Assistant', desc:'Chat-based grocery suggestions. "What should I buy under ₹1000?" — real-time AI answers.', phase:'phase1', hot:false },
  { emoji:'🎯', title:'Smart Recommendations', desc:'"Frequently bought together" and "You may need this" — powered by purchase history & preferences.', phase:'phase1', hot:false },
  { emoji:'💰', title:'Budget Tracker', desc:'Set a budget, track spending live with alerts when approaching limit. Monthly analytics chart.', phase:'phase1', hot:false },
  { emoji:'📦', title:'Product Catalog', desc:'Browse by category: Groceries, Electronics, Essentials. Filter by price, dietary tags, availability.', phase:'phase2', hot:false },
  { emoji:'🛍️', title:'Cart System Upgrade', desc:'Quantity management, save-for-later, auto-suggestions as you add items, smart checkout flow.', phase:'phase2', hot:false },
  { emoji:'📷', title:'Barcode Scanner', desc:'Use your phone camera to scan any product barcode and add it to cart instantly — no hardware needed.', phase:'phase2', hot:true },
  { emoji:'🔑', title:'User Authentication', desc:'Email/password + social login via Firebase Auth. Secure sessions and role-based routing.', phase:'phase3', hot:false },
  { emoji:'👤', title:'User Profiles', desc:'Saved carts, dietary preferences, full order history. Personalization at every touchpoint.', phase:'phase3', hot:false },
  { emoji:'💸', title:'Price Comparison', desc:'Compare prices for the same product across nearby stores. Always find the best deal.', phase:'phase4', hot:false },
  { emoji:'📍', title:'Nearby Store Finder', desc:'Show nearby grocery stores on a map with live stock availability from scan data.', phase:'phase4', hot:false },
  { emoji:'🎤', title:'Voice Assistant', desc:'"Add milk to cart." "Remove bread." Hands-free shopping via the Web Speech API.', phase:'phase4', hot:true },
  { emoji:'📴', title:'Offline Mode', desc:'Browse & manage cart without internet. Syncs automatically when connectivity restores.', phase:'phase4', hot:false },
  { emoji:'📈', title:'Analytics Dashboard', desc:'Spending trends, category breakdowns, monthly comparisons — interactive charts.', phase:'phase5', hot:false },
  { emoji:'🍽️', title:'AI Meal Planner', desc:'Suggest weekly meals by budget & preferences, then auto-add all ingredients to cart in one tap.', phase:'phase5', hot:true },
  { emoji:'🔄', title:'Subscription System', desc:'Weekly grocery auto-cart. Set recurring orders — your cart is ready every time.', phase:'phase5', hot:false },
  { emoji:'🔔', title:'Smart Notifications', desc:'Price drop alerts, expiry reminders, back-in-stock pings via push notifications.', phase:'phase5', hot:false },
  { emoji:'👁️', title:'Computer Vision', desc:'Point camera at any product — AI identifies it and adds to cart. No barcode, no RFID needed.', phase:'phase6', hot:true },
  { emoji:'🕶️', title:'AR Shopping', desc:'Visualize products in your kitchen before buying. See actual scale in augmented reality.', phase:'phase6', hot:true },
  { emoji:'👨‍👩‍👧', title:'Family Cart Mode', desc:'Shared family carts where multiple members add items simultaneously in real-time.', phase:'phase6', hot:false },
  { emoji:'🧮', title:'AI Expense Optimizer', desc:'Suggest cheaper alternatives for every cart item without sacrificing quality.', phase:'phase6', hot:true },
];

const phaseLabels = { live:'Live', phase1:'Phase 1', phase2:'Phase 2', phase3:'Phase 3', phase4:'Phase 4', phase5:'Phase 5', phase6:'Phase 6' };

function renderFeatures(filter = 'all') {
  const grid = document.getElementById('allFeaturesGrid');
  grid.innerHTML = allFeatures
    .filter(f => filter === 'all' || f.phase === filter)
    .map(f => `
      <div class="af-card ${f.hot ? 'hot-card' : ''} ${f.phase === 'live' ? 'live-card' : ''}">
        <span class="af-emoji">${f.emoji}</span>
        <div class="af-title">${f.title}</div>
        <div class="af-desc">${f.desc}</div>
        <div class="af-meta">
          <span class="af-phase ph-${f.phase}">${phaseLabels[f.phase]}</span>
          ${f.hot ? '<span class="af-hot">🔥 WOW</span>' : ''}
        </div>
      </div>`).join('');
}
renderFeatures();

document.querySelectorAll('.ff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderFeatures(btn.dataset.filter);
  });
});

/* ── Init on load ──────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  initBarcodeGrid();
  initBudget();
  initVoiceWave();
});
