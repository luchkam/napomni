// === Scroll animations (IntersectionObserver) ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));

// === Telegram chat animation ===
function animateChat() {
  const messages = document.querySelectorAll('#tgChat .tg-msg');
  messages.forEach(msg => {
    const delay = parseInt(msg.dataset.delay) || 0;
    setTimeout(() => {
      msg.classList.remove('tg-hidden');
      msg.classList.add('tg-visible');
      // Auto-scroll chat
      const chat = document.getElementById('tgChat');
      chat.scrollTop = chat.scrollHeight;
    }, delay);
  });
}

// Start chat animation when hero is in view
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateChat();
      heroObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const heroEl = document.getElementById('hero');
if (heroEl) heroObserver.observe(heroEl);

// === Mobile menu ===
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

// === Navbar background on scroll ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.borderBottomColor = 'rgba(255,255,255,0.1)';
  } else {
    navbar.style.borderBottomColor = 'rgba(255,255,255,0.06)';
  }
});

// === Phone input mask (+7 format) ===
const phoneInput = document.getElementById('phoneInput');
// Store raw subscriber digits (without +7 prefix)
let phoneDigits = '';
let prevFormattedLen = 0;

function formatPhone(d) {
  if (d.length === 0) return '';
  let f = '+7';
  if (d.length > 0) f += ' (' + d.slice(0, 3);
  if (d.length >= 3) f += ')';
  if (d.length > 3) f += ' ' + d.slice(3, 6);
  if (d.length > 6) f += '-' + d.slice(6, 8);
  if (d.length > 8) f += '-' + d.slice(8, 10);
  return f;
}

phoneInput.addEventListener('input', () => {
  const currentVal = phoneInput.value;
  const currentDigits = currentVal.replace(/\D/g, '');

  // Field fully cleared
  if (currentVal === '') {
    phoneDigits = '';
    prevFormattedLen = 0;
    return;
  }

  // User typed just "+" — keep it, wait for digits
  if (currentDigits.length === 0 && currentVal.includes('+')) {
    phoneInput.value = '+';
    prevFormattedLen = 1;
    return;
  }

  // No digits and no plus — clear
  if (currentDigits.length === 0) {
    phoneDigits = '';
    prevFormattedLen = 0;
    phoneInput.value = '';
    return;
  }

  // Detect deletion: formatted string got shorter
  const isDeleting = currentVal.length < prevFormattedLen;

  if (isDeleting) {
    // Remove last subscriber digit
    if (phoneDigits.length > 0) {
      phoneDigits = phoneDigits.slice(0, -1);
    }
    if (phoneDigits.length === 0) {
      phoneInput.value = '';
      prevFormattedLen = 0;
      return;
    }
  } else {
    // Adding: extract new digits from the input
    // Get all digits, strip country code (7 or 8 at start)
    let raw = currentDigits;
    if (raw.startsWith('7') || raw.startsWith('8')) {
      raw = raw.slice(1);
    }
    // If user typed just the prefix digit alone
    if (raw.length === 0 && currentDigits.length === 1) {
      phoneInput.value = '+7';
      prevFormattedLen = 2;
      return;
    }
    phoneDigits = raw.slice(0, 10);
  }

  const formatted = formatPhone(phoneDigits);
  phoneInput.value = formatted;
  prevFormattedLen = formatted.length;
});

// === Form submission ===
const form = document.getElementById('subscribeForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const phone = form.phone.value.trim();
  const email = form.email.value.trim();

  // Require at least one field
  if (!phone && !email) {
    form.phone.style.borderColor = '#F44336';
    form.email.style.borderColor = '#F44336';
    setTimeout(() => {
      form.phone.style.borderColor = '';
      form.email.style.borderColor = '';
    }, 2000);
    return;
  }

  const submitBtn = form.querySelector('.btn-submit');
  submitBtn.textContent = 'Отправляем...';
  submitBtn.disabled = true;

  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, email })
    });

    const data = await res.json();

    if (data.success) {
      form.style.display = 'none';
      formSuccess.style.display = 'block';
      createConfetti();
    } else {
      submitBtn.textContent = 'Попробуйте ещё раз';
      submitBtn.disabled = false;
    }
  } catch {
    submitBtn.textContent = 'Ошибка. Попробуйте ещё раз';
    submitBtn.disabled = false;
  }
});

// === Confetti effect ===
function createConfetti() {
  const container = document.getElementById('confetti');
  const colors = ['#2196F3', '#4CAF50', '#CDDC39', '#FF9800', '#E91E63'];

  for (let i = 0; i < 30; i++) {
    const piece = document.createElement('div');
    piece.classList.add('confetti-piece');
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];

    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 120;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - 40;

    piece.style.animation = 'none';
    piece.style.left = '50%';
    piece.style.top = '50%';
    piece.style.width = (4 + Math.random() * 6) + 'px';
    piece.style.height = piece.style.width;

    container.appendChild(piece);

    requestAnimationFrame(() => {
      piece.style.transition = `all ${0.6 + Math.random() * 0.6}s ease-out`;
      piece.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
      piece.style.opacity = '0';
    });

    setTimeout(() => piece.remove(), 1500);
  }
}

// === Smooth scroll for anchor links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#' || anchor.id === 'privacyLink') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// === Privacy modal ===
const privacyModal = document.getElementById('privacyModal');
const privacyLink = document.getElementById('privacyLink');
const modalClose = document.getElementById('modalClose');

privacyLink.addEventListener('click', (e) => {
  e.preventDefault();
  privacyModal.classList.add('open');
  document.body.style.overflow = 'hidden';
});

modalClose.addEventListener('click', () => {
  privacyModal.classList.remove('open');
  document.body.style.overflow = '';
});

privacyModal.addEventListener('click', (e) => {
  if (e.target === privacyModal) {
    privacyModal.classList.remove('open');
    document.body.style.overflow = '';
  }
});
