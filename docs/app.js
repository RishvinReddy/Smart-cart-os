/* ═══════════════════════════════════════════════════════════════════════
   Smart Cart OS — GitHub Pages JS
   Handles: scroll reveal, sticky nav, mobile menu
═══════════════════════════════════════════════════════════════════════ */

// ── Scroll Reveal ────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children in the same parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Sticky Nav Shadow ────────────────────────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
  } else {
    navbar.style.boxShadow = 'none';
  }
}, { passive: true });

// ── Mobile Hamburger ─────────────────────────────────────────────────
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu   = document.getElementById('mobileMenu');

hamburgerBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.style.display === 'flex';
  mobileMenu.style.display = isOpen ? 'none' : 'flex';
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.style.display = 'none';
  });
});

// ── Active Nav Link Highlight ────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? '#6366f1'
            : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

// ── Smooth Counter Animation for Stats ──────────────────────────────
function animateCounter(el, target, duration = 1200) {
  const isNumeric = !isNaN(parseInt(target));
  if (!isNumeric) return; // skip "AI", "RT" etc.

  const end = parseInt(target);
  let start = 0;
  const step = end / (duration / 16);

  const update = () => {
    start = Math.min(start + step, end);
    el.textContent = Math.floor(start);
    if (start < end) requestAnimationFrame(update);
    else el.textContent = end;
  };
  requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, entry.target.textContent);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.8 }
);

statNumbers.forEach(el => counterObserver.observe(el));
