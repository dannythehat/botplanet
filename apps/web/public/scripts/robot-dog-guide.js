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
    'Joy for All': '#companion'
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
