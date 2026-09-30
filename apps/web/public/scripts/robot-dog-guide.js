(function () {
  'use strict';

  var targetByName = {
    'Ruko 18011': '#ruko',
    'Ruko': '#ruko',
    'Loona': '#loona',
    'Loona Petbot': '#loona',
    'MechDog': '#mechdog',
    'Hiwonder MechDog': '#mechdog',
    'Bittle X V2': '#bittle',
    'Petoi Bittle X V2': '#bittle',
    'PuppyPi': '#puppypi',
    'Hiwonder PuppyPi': '#puppypi',
    'Joy for All': '#joy',
    'Joy for All Companion Pet': '#joy'
  };

  function go(target) {
    if (!target) return;
    var el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', target);
    } else {
      window.location.hash = target;
    }
  }

  /* The Joy for All card originally sent its main CTA to our review while every
     other commercial pick had a direct Amazon route. Keep the review, but make
     the purchase path consistent and explicit. */
  var joyLinks = document.querySelector('#joy .dog-links');
  if (joyLinks && !joyLinks.querySelector('[data-joy-amazon]')) {
    var existingPrimary = joyLinks.querySelector('.dog-btn--primary');
    if (existingPrimary) existingPrimary.classList.remove('dog-btn--primary');

    var joyAmazon = document.createElement('a');
    joyAmazon.className = 'dog-btn dog-btn--primary';
    joyAmazon.href = 'https://www.amazon.com/s?k=Joy+for+All+Companion+Pet+Dog&tag=botplanet-20';
    joyAmazon.rel = 'sponsored nofollow';
    joyAmazon.textContent = 'Check Joy for All on Amazon';
    joyAmazon.setAttribute('data-joy-amazon', 'true');
    joyLinks.insertBefore(joyAmazon, joyLinks.firstChild);
  }

  document.querySelectorAll('.rd-table tbody tr').forEach(function (row) {
    var first = row.querySelector('td:first-child');
    if (!first) return;
    var name = first.textContent.trim();
    var target = targetByName[name];
    if (!target) return;

    row.classList.add('rd-table-row--clickable');
    row.setAttribute('role', 'link');
    row.setAttribute('tabindex', '0');
    row.setAttribute('aria-label', 'View ' + name + ' details');

    var cta = document.createElement('span');
    cta.className = 'rd-row-cta';
    cta.textContent = 'View details →';
    first.appendChild(cta);

    row.addEventListener('click', function (event) {
      if (event.target.closest('a, button')) return;
      go(target);
    });
    row.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        go(target);
      }
    });
  });

  document.querySelectorAll('.rd-program-card').forEach(function (card) {
    var link = card.querySelector('a[href]');
    if (!link) return;
    card.classList.add('rd-click-card');
    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', function (event) {
      if (event.target.closest('a, button')) return;
      window.location.href = link.href;
    });
    card.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        window.location.href = link.href;
      }
    });
  });

  document.querySelectorAll('.rd-duel__side').forEach(function (side) {
    var strong = side.querySelector('strong');
    if (!strong) return;
    var target = targetByName[strong.textContent.trim()];
    if (!target) return;
    side.classList.add('rd-duel__side--clickable');
    side.setAttribute('role', 'link');
    side.setAttribute('tabindex', '0');
    side.setAttribute('aria-label', 'Jump to ' + strong.textContent.trim());
    side.addEventListener('click', function () { go(target); });
    side.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        go(target);
      }
    });
  });
})();
