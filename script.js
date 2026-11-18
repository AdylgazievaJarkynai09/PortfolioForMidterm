'use strict';
document.documentElement.classList.add('js'); 

// Получаем элементы
    const g = document.getElementById('greeting');
    const btn = document.getElementById('askName');

    // Функция показывает приветствие
    function showGreeting(name) {
      g.textContent = name
        ? `Привет, ${name}!`
        : 'Добро пожаловать!';
    }

    // Функция спрашивает имя
    function askName() {
      const name = prompt('Как тебя зовут?');
      if (name) {
        localStorage.setItem('visitorName', name);
      } else {
        localStorage.removeItem('visitorName');
      }
      showGreeting(localStorage.getItem('visitorName'));
    }

    // Когда нажимаем кнопку — спрашиваем имя
    btn.addEventListener('click', askName);

    // Если имя уже сохранено — показываем сразу
    showGreeting(localStorage.getItem('visitorName'));


function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  let saved = null;

  try {
    saved = localStorage.getItem('theme');
  } catch (e) {}

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function apply(theme) {
    const dark = theme === 'dark';
    root.setAttribute('data-theme', theme);
    btn.setAttribute('aria-pressed', dark);
    btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    btn.innerHTML = dark ? '☀ <span>Light</span>' : '☾ <span>Dark</span>';
  }
  
  apply(saved || (prefersDark ? 'dark' : 'light'));
  btn.addEventListener('click', function () {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
}





function initProjectFilter() {
  const cards = document.querySelectorAll('.project-card[data-category]');
  const chips = document.querySelectorAll('.chip');
  const search = document.getElementById('project-search');
  const status = document.getElementById('project-status');
  const noResults = document.getElementById('no-results');

  let category = 'all';

  function showCards() {
    const text = search.value.trim().toLowerCase();
    let count = 0;

    cards.forEach(function (card) {
      const categoryOk = category === 'all' || card.dataset.category === category;
      const textOk = card.textContent.toLowerCase().includes(text);
      const show = categoryOk && textOk;

      card.hidden = !show;
      if (show) count++;
    });

    noResults.hidden = count > 0;
    status.textContent = 'Showing ' + count + ' of ' + cards.length + ' projects';
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      category = chip.dataset.filter;

      chips.forEach(function (other) {
        const isSelected = other === chip;
        other.classList.toggle('is-active', isSelected);
      });

      showCards();
    });
  });

  search.addEventListener('input', showCards);
  showCards();
}










function initMobileMenu() {
  const burger = document.getElementById('menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!burger || !nav) return;

  const desktop = window.matchMedia('(min-width: 641px)');

  function isOpen() {
    return nav.classList.contains('is-open');
  }

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    burger.innerHTML = open ? '✕ <span>Close</span>' : '☰ <span>Menu</span>';
  }

  document.addEventListener('click', function (e) {
    if (burger.contains(e.target)) {
      setOpen(!isOpen());
      return;
    }

    const clickedOutside = !nav.contains(e.target);
    const clickedLink = e.target.closest('a');
    if (isOpen() && (clickedOutside || clickedLink)) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) {
      setOpen(false);
      burger.focus();
    }
  });

  desktop.addEventListener('change', function (e) {
    if (e.matches) setOpen(false);
  });
}





// Smooth scroll for anchor links (#about, #work, #top ...)
// Accounts for the sticky header and respects prefers-reduced-motion.
function initSmoothScroll() {
  const header = document.querySelector('body > header');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    e.preventDefault();

    const offset = header ? header.offsetHeight : 0;
    const top = id === 'top'
      ? 0
      : target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: top,
      behavior: reduce.matches ? 'auto' : 'smooth'
    });

    history.pushState(null, '', '#' + id);

    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}





// Scroll-to-top button: appears after SHOW_AFTER px, scrolls up smoothly on click.
function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  const SHOW_AFTER = 300;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function toggleButton() {
    btn.classList.toggle('show', window.scrollY > SHOW_AFTER);
  }

  window.addEventListener('scroll', toggleButton, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: reduce.matches ? 'auto' : 'smooth'
    });
  });

  toggleButton();
}





initTheme();
initProjectFilter();
initMobileMenu();
initSmoothScroll();
initScrollTop();
