/*
  AI Academy — Monetag Ad Engine (OnClick + Push)

  Active Zones:
    11445764  push   → 5gvci.com  (Push Notification opt-in, in <head>)
    11445763  inpage → al5sm.com  (In-Page Push banner, inside .ad-slot divs only)
    11454775  onclick→ al5sm.com  (OnClick Magnificent Tag, Monetag onclick)
    11454775  sw     → 3nbf4.com  (Service Worker, sw.js)

  Click anywhere on the page to trigger Monetag ad/onsite push.
  Ads fire inside .ad-slot containers and on user interaction.
*/

/* Register Service Worker for Push Notifications */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then(r  => console.log('[Monetag SW] Registered:', r.scope))
    .catch(er => console.warn('[Monetag SW] Error:', er));
}

/* Monetag OnClick — Magnificent Tag (Zone 11454775) */
function loadMonetagOnclick() {
  var s = document.createElement('script');
  s.dataset.zone = '11454775';
  s.src = 'https://al5sm.com/tag.min.js';
  (document.documentElement || document.body).appendChild(s);
  console.log('[Monetag OnClick] Magnificent tag loaded (zone 11454775)');
}

/* Attach click-to-push: first click on the page triggers Monetag ad */
document.addEventListener('DOMContentLoaded', () => {
  var clicked = false;

  document.addEventListener('click', function monetagClickHandler(e) {
    if (clicked) return;
    clicked = true;

    /* Load Monetag Magnificent onclick tag */
    loadMonetagOnclick();

    /* Show ad slot if present */
    var slots = document.querySelectorAll('.ad-slot');
    slots.forEach(function(slot) {
      slot.style.display = 'block';
      slot.style.minHeight = '90px';
    });

    /* Remove handler after first click so it only fires once */
    document.removeEventListener('click', monetagClickHandler);
  }, { once: false, capture: true });

  /* Slot visibility: ensure ad slots stay visible even if Monetag returns nothing */
  document.querySelectorAll('.ad-slot').forEach(function(slot) {
    if (!slot.style.minHeight) slot.style.minHeight = '90px';
  });
});