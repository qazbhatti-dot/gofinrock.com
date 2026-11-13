/* Prices come from the app's plans, so the site and the app never disagree. The figures written in the HTML are the
   fallback: if the request fails, is refused or takes longer than about 4 seconds, nothing on the page changes.
   Attributes it fills (all by plan id, a plan's own or its accountant version's):
     data-plan-price="sole_trader"            the monthly price, "£14.99"
     data-plan-saving="company_own_and_sole_trader"   what the two together save, "£5"
     data-accountant-adds="sole_trader"       what our accountant adds to that plan, "£10"
     data-together-price="sole_trader"        that plan's price beside a company, "£9.99"
   It also leaves window.frPlanPrice(id, fallback) for scripts that write prices into sentences. */
(function () {
  var URL = 'https://app.gofinrock.com/api/public/plans?country=GB', byId = {}, done = false;
  function money(minor, cur) {
    var v = minor / 100, whole = Math.round(v) === v;
    try { return new Intl.NumberFormat('en-GB', { style: 'currency', currency: cur || 'GBP', minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2 }).format(v); }
    catch (e) { return '£' + (whole ? v : v.toFixed(2)); }
  }
  function index(plans) {
    for (var i = 0; i < plans.length; i++) {
      var p = plans[i]; if (!p || !p.id || typeof p.price_minor !== 'number') continue;
      byId[p.id] = p;
      if (p.filed_upgrade && p.filed_upgrade.id && typeof p.filed_upgrade.price_minor === 'number') {
        var f = p.filed_upgrade; byId[f.id] = byId[f.id] || { id: f.id, price_minor: f.price_minor, currency: p.currency };
        byId[p.id + '#adds'] = { price_minor: f.price_minor - p.price_minor, currency: p.currency };
      }
    }
  }
  function fill() {
    [].forEach.call(document.querySelectorAll('[data-plan-price]'), function (el) {
      var p = byId[el.getAttribute('data-plan-price')]; if (p) el.textContent = money(p.price_minor, p.currency);
    });
    [].forEach.call(document.querySelectorAll('[data-plan-saving]'), function (el) {
      var p = byId[el.getAttribute('data-plan-saving')]; if (p && typeof p.together_saving_minor === 'number') el.textContent = money(p.together_saving_minor, p.currency);
    });
    [].forEach.call(document.querySelectorAll('[data-together-price]'), function (el) {
      var c = byId['company_own_and_' + el.getAttribute('data-together-price')], co = byId.company_own;
      if (c && co) el.textContent = money(c.price_minor - co.price_minor, c.currency);
    });
    [].forEach.call(document.querySelectorAll('[data-accountant-adds]'), function (el) {
      var p = byId[el.getAttribute('data-accountant-adds') + '#adds']; if (p) el.textContent = money(p.price_minor, p.currency);
    });
  }
  window.frPlanPrice = function (id, fallback) { var p = byId[id]; return p ? money(p.price_minor, p.currency) : fallback; };
  if (!window.fetch) return;
  var ctl = window.AbortController ? new AbortController() : null, t = setTimeout(function () { if (ctl) ctl.abort(); }, 4000);
  fetch(URL, { headers: { Accept: 'application/json' }, signal: ctl ? ctl.signal : undefined })
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(function (j) {
      clearTimeout(t); if (!j || !j.plans || !j.plans.length) return;
      index(j.plans); done = true;
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill); else fill();
      try { document.dispatchEvent(new CustomEvent('frplans')); } catch (e) {}
    })
    .catch(function () { clearTimeout(t); });
})();
