/* ═══════════════════════════════════════════════════════════════════════
   Smart Cart OS — GitHub Pages JS (Full Roadmap Edition)
   Handles: scroll reveal, sticky nav, mobile menu, phase tabs,
            nav highlight, counter animation
═══════════════════════════════════════════════════════════════════════ */

// ── Scroll Reveal ────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = Array.from(
          entry.target.parentElement.querySelectorAll('.reveal')
        );
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 70}ms`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ── Sticky Nav Shadow ─────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 20
    ? '0 4px 30px rgba(0,0,0,0.5)'
    : 'none';
}, { passive: true });

// ── Mobile Hamburger ──────────────────────────────────────────────────
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu   = document.getElementById('mobileMenu');

hamburgerBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.style.display === 'flex';
  mobileMenu.style.display = isOpen ? 'none' : 'flex';
});

document.querySelectorAll('.mobile-link').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.style.display = 'none';
  });
});

// ── Phase Tabs ────────────────────────────────────────────────────────
const phaseTabs   = document.querySelectorAll('.phase-tab');
const phasePanels = document.querySelectorAll('.phase-panel');

phaseTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const phase = tab.getAttribute('data-phase');

    // Update tab active state
    phaseTabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');

    // Show corresponding panel
    phasePanels.forEach((panel) => {
      panel.classList.remove('active');
      if (panel.id === `phase-${phase}`) {
        panel.classList.add('active');
      }
    });
  });
});

// ── Active Nav Link on Scroll ─────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.style.color = isActive ? '#6366f1' : '';
          link.style.background = isActive ? 'rgba(99,102,241,0.1)' : '';
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach((s) => sectionObserver.observe(s));

// ── Counter Animation for Hero Stats ─────────────────────────────────
function animateCounter(el, duration = 1400) {
  const rawTarget = el.getAttribute('data-target');
  const target = parseInt(rawTarget);
  if (isNaN(target)) return; // skip non-numeric

  let start = 0;
  const step = target / (duration / 16);

  const update = () => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start);
    if (start < target) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.8 }
);

document.querySelectorAll('.stat-number[data-target]').forEach((el) =>
  counterObserver.observe(el)
);

// ── Smooth hover tilt on WOW cards ───────────────────────────────────
document.querySelectorAll('.wow-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -8;
    card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease';
  });
});
