/*
  AI Academy — Monetag Ad Engine (Clean, Slot-Only)
  
  Active Zones:
    11445764  push   → 5gvci.com  (Push Notification opt-in, in <head>)
    11445763  inpage → al5sm.com  (In-Page Push banner, inside .ad-slot divs only)
    11454764  sw     → 3nbf4.com  (Service Worker, sw.js)

  NO popunder / no page-wide click zones.
  Ads only fire inside .ad-slot containers.
*/

/* Register Service Worker for Push Notifications */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then(r  => console.log('[Monetag SW] Registered:', r.scope))
    .catch(er => console.warn('[Monetag SW] Error:', er));
}

/* Slot visibility: ensure ad slots stay visible even if Monetag returns nothing */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ad-slot').forEach(slot => {
    // Force min-height so slot doesn't collapse
    if (!slot.style.minHeight) slot.style.minHeight = '90px';
  });
});
