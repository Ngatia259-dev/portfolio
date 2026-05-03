/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ===== HAMBURGER / MOBILE NAV ===== */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

function closeMobile() {
  mobileNav.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ===== ACTIVE NAV LINK ON SCROLL ===== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.style.color = 'var(--cyan)';
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ===== FADE-UP INTERSECTION OBSERVER ===== */
const fadeEls = document.querySelectorAll('.fade-up');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => fadeObserver.observe(el));

/* ===== FOOTER YEAR ===== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===== TYPED HERO SUBTITLE ===== */
const heroDesc = document.querySelector('.hero-desc');
if (heroDesc) {
  const originalText = heroDesc.textContent;
  heroDesc.textContent = '';
  let i = 0;
  const speed = 18;
  function typeWriter() {
    if (i < originalText.length) {
      heroDesc.textContent += originalText.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }
  // Trigger once hero is visible
  const heroObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(typeWriter, 800);
      heroObs.disconnect();
    }
  });
  heroObs.observe(heroDesc);
}

/* ===== PARTICLE CANVAS (hero bg accent) ===== */
(function createParticles() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.35';
  const hero = document.getElementById('hero');
  if (!hero) return;
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.5;
    this.dx = (Math.random() - 0.5) * 0.4;
    this.dy = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.6 + 0.2;
  }

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${this.opacity})`;
    ctx.fill();
  };

  Particle.prototype.update = function () {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x < 0 || this.x > W) this.dx *= -1;
    if (this.y < 0 || this.y > H) this.dy *= -1;
  };

  function init() {
    resize();
    particles = Array.from({ length: 70 }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize, { passive: true });
  init();
  animate();
})();

/* ===== SKILL CARD HOVER GLOW ===== */
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0,212,255,0.06), rgba(15,22,41,0.85) 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* ===== CONTACT FORM ===== */
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
const submitBtn = document.getElementById('form-submit');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.className = '';
  status.textContent = '';

  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    status.textContent = '⚠️ Please fill in all required fields.';
    status.className = 'error';
    return;
  }
  if (!validateEmail(email)) {
    status.textContent = '⚠️ Please enter a valid email address.';
    status.className = 'error';
    return;
  }

  // Simulate sending (replace with real endpoint)
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    await new Promise(res => setTimeout(res, 1600)); // simulate network
    status.textContent = '✅ Message sent! I\'ll get back to you within 24 hours.';
    status.className = 'success';
    form.reset();
  } catch {
    status.textContent = '❌ Something went wrong. Please email me directly.';
    status.className = 'error';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message ✉️';
  }
});

/* ===== SMOOTH SCROLL POLYFILL FOR OLDER SAFARI ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
