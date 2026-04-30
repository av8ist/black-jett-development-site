/* =============================================================
   Black Jett Development, LLC
   main.js — minimal vanilla JS, no dependencies
   ============================================================= */

(function () {
  'use strict';

  // ----- Mobile menu toggle ------------------------------------
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      // Swap icons (menu / close)
      const iconMenu = toggle.querySelector('[data-icon="menu"]');
      const iconClose = toggle.querySelector('[data-icon="close"]');
      if (iconMenu && iconClose) {
        iconMenu.style.display = isOpen ? 'none' : 'block';
        iconClose.style.display = isOpen ? 'block' : 'none';
      }
    });

    // Close menu when a link is clicked
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        const iconMenu = toggle.querySelector('[data-icon="menu"]');
        const iconClose = toggle.querySelector('[data-icon="close"]');
        if (iconMenu && iconClose) {
          iconMenu.style.display = 'block';
          iconClose.style.display = 'none';
        }
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
        const iconMenu = toggle.querySelector('[data-icon="menu"]');
        const iconClose = toggle.querySelector('[data-icon="close"]');
        if (iconMenu && iconClose) {
          iconMenu.style.display = 'block';
          iconClose.style.display = 'none';
        }
      }
    });
  }

  // ----- Auto-set the current year in the footer --------------
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
