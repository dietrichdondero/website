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

  // Contact form -> emailed to the business inbox via FormSubmit (falls back to the visitor's email app)
  var quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var val = function (id) { return (document.getElementById(id) || {}).value || ''; };
      var name = val('q-name'), phone = val('q-phone'), email = val('q-email');
      var projectType = val('q-type'), details = val('q-details');
      var status = document.getElementById('form-status');
      var btn = quoteForm.querySelector('button[type="submit"]');
      var subject = 'Quote Request: ' + (projectType || 'Project Inquiry') + ' - ' + name;

      function fallback() {
        var body = ['Name: ' + name, 'Phone: ' + phone, 'Email: ' + email,
          'Project type: ' + projectType, '', 'Details:', details].join('\n');
        window.location.href = 'mailto:donderoconstruction@gmail.com'
          + '?subject=' + encodeURIComponent(subject)
          + '&body=' + encodeURIComponent(body);
      }

      if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

      fetch('https://formsubmit.co/ajax/donderoconstruction@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: subject,
          _replyto: email,
          _template: 'table',
          _captcha: 'false',
          Name: name,
          Phone: phone,
          Email: email,
          'Project type': projectType,
          Details: details
        })
      }).then(function (r) {
        if (!r.ok) { throw new Error('bad response'); }
        return r.json();
      }).then(function (data) {
        if (data && (data.success === 'true' || data.success === true)) {
          quoteForm.reset();
          if (status) { status.textContent = 'Thank you! Your quote request was sent. We will be in touch soon.'; }
          if (btn) { btn.textContent = 'Request Sent'; }
        } else {
          throw new Error('not successful');
        }
      }).catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = 'Send Quote Request'; }
        if (status) { status.textContent = 'We could not send that automatically, so your email app will open instead. You can also call 403-998-3971.'; }
        fallback();
      });
    });
  }
});
