// Dondero Construction and Renovation — shared site behaviour

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
    });

    // Close mobile nav after tapping a link
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Mark active nav link based on current page
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Gallery filter buttons
  var filterButtons = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        galleryItems.forEach(function (item) {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Contact form -> mailto handoff (no backend/server on a static site)
  var quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = (document.getElementById('q-name') || {}).value || '';
      var phone = (document.getElementById('q-phone') || {}).value || '';
      var email = (document.getElementById('q-email') || {}).value || '';
      var projectType = (document.getElementById('q-type') || {}).value || '';
      var details = (document.getElementById('q-details') || {}).value || '';

      var subject = 'Quote Request: ' + (projectType || 'Project Inquiry') + ' — ' + name;
      var bodyLines = [
        'Name: ' + name,
        'Phone: ' + phone,
        'Email: ' + email,
        'Project type: ' + projectType,
        '',
        'Details:',
        details
      ];
      var body = bodyLines.join('\n');

      var mailto = 'mailto:donderoconstruction@gmail.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);

      window.location.href = mailto;
    });
  }
});
