/* Finrock website analytics. One file, loaded in the <head> of every page.
   Nothing loads until the visitor says yes in the cookie banner (assets/fr.js):
   Google Analytics needs "Analytics", the Meta pixel needs "Advertising".
   GA4 property: "Finrock website" (stream gofinrock.com), Google account qazbhatti@gmail.com.
   Fill in META_PIXEL_ID when the Meta ad account exists (Week 00). */
(function () {
  var GA4_ID = 'G-GMLD2R6RT7';
  var META_PIXEL_ID = '';
  var meta = false, ga = false;
  window.FR_TRACKING = !!(META_PIXEL_ID || GA4_ID);  /* the cookie banner only appears once a tracker is configured */
  function consent() { try { var c = JSON.parse(localStorage.getItem('fr-consent') || 'null'); return c && c.v === 1 ? c : {}; } catch (e) { return {}; } }
  function load(c) {
    if (GA4_ID && c.analytics && !ga) {
      var g = document.createElement('script'); g.async = true; g.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_ID); document.head.appendChild(g);
      window.dataLayer = window.dataLayer || []; window.gtag = function () { window.dataLayer.push(arguments); };
      gtag('js', new Date()); gtag('config', GA4_ID, { anonymize_ip: true }); ga = true;
    }
    if (META_PIXEL_ID && c.marketing && !meta) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', META_PIXEL_ID); fbq('track', 'PageView'); meta = true;
    }
  }
  load(consent());
  window.addEventListener('fr-consent', function (e) { load(e.detail || {}); });
  /* frTrack('lead') when the MTD checker shows a result; frTrack('checkout') when a Start free button is clicked. */
  window.frTrack = function (ev, data) {
    try {
      if (meta && window.fbq) fbq('track', ev === 'lead' ? 'Lead' : 'InitiateCheckout', data || {});
      if (ga && window.gtag) gtag('event', ev === 'lead' ? 'generate_lead' : 'begin_checkout', data || {});
    } catch (e) {}
  };
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="https://app.gofinrock.com/register"]') : null;
    if (a) window.frTrack('checkout', { content_name: location.pathname });
  });
})();
