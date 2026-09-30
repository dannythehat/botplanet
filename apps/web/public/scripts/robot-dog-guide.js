(function () {
  'use strict';

  var products = {
    'Ruko 18011': {
      target: '#ruko',
      amazon: 'https://www.amazon.com/s?k=Ruko+18011+Robot+Dog+Toy&tag=botplanet-20'
    },
    'Loona': {
      target: '#loona',
      amazon: '/go/comp-loona-amazon'
    },
    'MechDog': {
      target: '#mechdog',
      amazon: 'https://www.amazon.com/s?k=Hiwonder+MechDog+Robot+Dog&tag=botplanet-20'
    },
    'Bittle X V2': {
      target: '#bittle',
      amazon: 'https://www.amazon.com/s?k=Petoi+Bittle+X+V2&tag=botplanet-20'
    },
    'PuppyPi': {
      target: '#puppypi',
      amazon: 'https://www.amazon.com/s?k=HIWONDER+PuppyPi+Robot+Dog&tag=botplanet-20'
    },
    'Joy for All': {
      target: '#joy',
      amazon: 'https://www.amazon.com/s?k=Joy+for+All+Companion+Pet+Dog&tag=botplanet-20'
    }
  };

  function isExternal(url) {
    return /^https?:\/\//i.test(url);
  }

  function addComparisonTableLinks() {
    var table = document.querySelector('.dog-table');
    if (!table) return;

    var headRow = table.querySelector('thead tr');
    if (headRow && !headRow.querySelector('.dog-table__buy-head')) {
      var th = document.createElement('th');
      th.className = 'dog-table__buy-head';
      th.scope = 'col';
      th.textContent = 'Buy';
      headRow.appendChild(th);
    }

    table.querySelectorAll('tbody tr').forEach(function (row) {
      var first = row.querySelector('td:first-child');
      if (!first) return;

      var name = first.textContent.trim();
      var product = products[name];
      if (!product) return;

      if (!first.querySelector('a')) {
        first.textContent = '';
        var reviewLink = document.createElement('a');
        reviewLink.href = product.target;
        reviewLink.className = 'dog-table-product';
        reviewLink.textContent = name;
        first.appendChild(reviewLink);
      }

      if (!row.querySelector('.dog-table__buy')) {
        var td = document.createElement('td');
        td.className = 'dog-table__buy';
        var buy = document.createElement('a');
        buy.href = product.amazon;
        buy.className = 'dog-table-buy';
        buy.textContent = 'Amazon →';
        if (isExternal(product.amazon)) buy.rel = 'sponsored nofollow';
        td.appendChild(buy);
        row.appendChild(td);
      }
    });

    if (!document.getElementById('dog-table-link-styles')) {
      var style = document.createElement('style');
      style.id = 'dog-table-link-styles';
      style.textContent = '.dog-table-product{color:#fff;text-decoration:underline;text-decoration-color:rgba(143,230,255,.45);text-underline-offset:3px}.dog-table-product:hover{color:#c8f4ff}.dog-table-buy{display:inline-flex;align-items:center;justify-content:center;min-height:36px;padding:0 12px;border-radius:999px;background:#fff;color:#050607;text-decoration:none;font-size:.78rem;font-weight:850;white-space:nowrap}.dog-table-buy:hover{opacity:.88}.dog-table__buy{white-space:nowrap}';
      document.head.appendChild(style);
    }
  }

  function fixJoyForAllBuyLink() {
    var review = document.querySelector('.dog-review#joy');
    if (!review) return;
    var links = review.querySelector('.dog-links');
    if (!links) return;

    var primary = links.querySelector('.dog-btn--primary');
    var amazon = products['Joy for All'].amazon;
    if (primary) {
      primary.href = amazon;
      primary.textContent = 'Check Joy for All on Amazon';
      primary.rel = 'sponsored nofollow';
    }

    if (!links.querySelector('a[href="/robots/companion-robots/joy-for-all-companion-pets/"]')) {
      var reviewLink = document.createElement('a');
      reviewLink.className = 'dog-btn';
      reviewLink.href = '/robots/companion-robots/joy-for-all-companion-pets/';
      reviewLink.textContent = 'Read our full Joy for All review';
      var source = links.querySelector('.dog-text-link');
      links.insertBefore(reviewLink, source || null);
    }
  }

  addComparisonTableLinks();
  fixJoyForAllBuyLink();
})();
