/* =============================================
   KERAMIKA – Pavlína Drexlerová
   JavaScript
   ============================================= */

(function () {
  'use strict';

  // ── Sticky header ──────────────────────────────
  const header = document.getElementById('site-header');

  function updateHeader() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // ── Mobile nav toggle ──────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const mainNav   = document.getElementById('main-nav');

  navToggle.addEventListener('click', function () {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav when a link is clicked
  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ── Fade-in on scroll (IntersectionObserver) ───
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // stagger siblings inside the same parent
            const siblings = Array.from(
              entry.target.parentElement.querySelectorAll('.fade-in:not(.visible)')
            );
            const idx = siblings.indexOf(entry.target);
            const delay = idx >= 0 ? idx * 80 : 0;

            setTimeout(function () {
              entry.target.classList.add('visible');
            }, delay);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback for old browsers
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ── Contact form (client-side feedback) ────────
  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      let valid = true;

      form.querySelectorAll('[required]').forEach(function (field) {
        field.classList.remove('invalid');
        if (!field.value.trim()) {
          field.classList.add('invalid');
          valid = false;
        }
      });

      // Basic email check
      const emailField = form.querySelector('#email');
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.classList.add('invalid');
        valid = false;
      }

      if (!valid) return;

      // Show success message (no real backend)
      form.innerHTML =
        '<div class="form-success">' +
        '<p>Děkuji za vaši zprávu! Ozvám se co nejdříve. 🌿</p>' +
        '</div>';
    });

    // Remove invalid state on input
    form.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        field.classList.remove('invalid');
      });
    });
  }

  // ── Smooth-scroll for anchor links ─────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = header.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();
