(function () {
  document.documentElement.classList.add('js');
  if (matchMedia('(prefers-color-scheme: dark)').matches) document.querySelectorAll('img[data-dark]').forEach(function (im) { im.src = im.dataset.dark; var s = im.closest('.screen'); if (s) s.style.background = '#0b0b10'; });
  var paint = function () { if (window.lucide) window.lucide.createIcons(); };
  paint(); window.addEventListener('load', paint);

  var b = document.querySelector('.burger'), s = document.querySelector('.sheet');
  if (b && s) b.addEventListener('click', function () {
    var o = s.classList.toggle('open'); var h = b.closest('.hdr'); h.classList.toggle('open', o); if (o) s.style.paddingTop = (h.getBoundingClientRect().bottom + 16) + 'px';
    b.setAttribute('aria-expanded', o);
    document.body.classList.toggle('lock', o);
    b.innerHTML = '<i data-lucide="' + (o ? 'x' : 'menu') + '"></i>'; paint();
  });

  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { io.observe(el); });
    var steps = document.querySelectorAll('.step'), shots = document.querySelectorAll('.stage img');
    if (steps.length && shots.length) {
      var so = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          var i = [].indexOf.call(steps, e.target);
          steps.forEach(function (x, j) { x.classList.toggle('on', j === i); });
          shots.forEach(function (x, j) { x.classList.toggle('on', j === i); });
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      steps.forEach(function (el) { so.observe(el); });
    }
  } else rv.forEach(function (el) { el.classList.add('in'); });

  // pricing chooser
  var ch = document.querySelector('.chooser');
  if (ch) {
    var sel = {}, over = null;
    var q2 = ch.querySelector('.q2'), out = ch.querySelector('.answer p'), go = ch.querySelector('.answer a');
    var plans = { life: ['My Life', '£9.99'], st: ['Sole trader & Landlord', '£14.99'], se: ['Sole trader & Landlord · MTD', '£24.99'], ltd: ['Limited company', '£49.99'] };
    function pick(k) { document.querySelectorAll('.plan').forEach(function (p) { p.classList.toggle('pick', p.dataset.plan === k); }); }
    function run() {
      var trade = sel.se || sel.prop;
      q2.classList.toggle('show', !!trade);
      var k, msg;
      if (!sel.pay && !trade && !sel.ltd) { out.innerHTML = 'Tap everything that applies.'; pick(null); go.href = '#plans'; return; }
      if (trade && over === null) { out.innerHTML = 'One more — is your <b>self-employed and rental income together</b> over £50,000?'; pick(null); return; }
      if (sel.ltd) {
        k = 'ltd';
        if (trade && over) msg = '<b>Limited company</b> · <span class="num">£59.99</span>/mo — the company (accountant sign-off included) plus your personal MTD quarterly updates (+£10). Want the accountant to check and submit your personal return too? +£10 more.';
        else if (trade) msg = '<b>Limited company</b> · <span class="num">£49.99</span>/mo — includes your personal plan, so your trade and lets are covered. Accountant sign-off covers the company; add +£10 for them to check and submit your personal return.';
        else msg = '<b>Limited company</b> · <span class="num">£49.99</span>/mo per company — accountant sign-off and your personal My Life included.';
      } else {
        if (trade) k = over ? 'se' : 'st'; else k = 'life';
        var p = plans[k];
        msg = '<b>' + p[0] + '</b> · <span class="num">' + p[1] + '</span>/mo';
        if (trade && sel.se && sel.prop) msg += ' — your trade <i>and</i> your lets, one price.';
        else if (k === 'life') msg += ' — salary, pension, savings and dividends are all in.';
        else if (k === 'st') msg += ' — Self Assessment incl. property pages, no quarterly updates yet.';
        else msg += ' — every trade and every property, quarterly updates included.';
      }
      var them = 0, bits = [];
      if (sel.ltd) { them += 76; bits.push('company software + accountant retainer'); }
      if (sel.se) { them += 22.80; bits.push('a sole trader app'); }
      if (sel.prop) { them += 12; bits.push('a landlord add-on'); }
      them += 9.99; bits.push('a budgeting app');
      msg += '<small class="els">Elsewhere: ' + bits.join(' + ') + ' ≈ <b>£' + them.toFixed(2) + '</b>/mo</small>';
      out.innerHTML = msg; pick(k); go.href = '#plans';
    }
    ch.querySelectorAll('[data-k]').forEach(function (o) {
      o.addEventListener('click', function () { var k = o.dataset.k; sel[k] = !sel[k]; o.setAttribute('aria-pressed', !!sel[k]); run(); });
    });
    ch.querySelectorAll('[data-over]').forEach(function (o) {
      o.addEventListener('click', function () {
        over = o.dataset.over === '1';
        ch.querySelectorAll('[data-over]').forEach(function (x) { x.setAttribute('aria-pressed', x === o); });
        run();
      });
    });
    run();
  }
  
  // hero demo sequence
  var demo = document.querySelector('.demo');
  if (demo) {
    var imgs = demo.querySelectorAll('.seq img'), caps = demo.querySelectorAll('.cap span'), chips = demo.querySelectorAll('.chip[data-i]'), dots = demo.querySelectorAll('.dots button'), tap = demo.querySelector('.tap'), ci = 0, ct;
    var taps = [[50, 86], [50, 60], [50, 50], [50, 40], [50, 58]];
    var setC = function (i, anim) {
      var go = function () { imgs.forEach(function (x, j) { x.classList.toggle('on', j === i); x.classList.toggle('out', j === ci && i !== ci); }); caps.forEach(function (x, j) { x.classList.toggle('on', j === i); }); chips.forEach(function (x) { x.classList.toggle('on', +x.dataset.i === i); }); dots.forEach(function (x, j) { x.setAttribute('aria-selected', j === i); }); ci = i; };
      if (anim && tap) { tap.style.left = taps[ci][0] + '%'; tap.style.top = taps[ci][1] + '%'; tap.classList.remove('go'); void tap.offsetWidth; tap.classList.add('go'); setTimeout(go, 260); } else go();
    };
    var tick = function () { ct = setTimeout(function () { setC((ci + 1) % imgs.length, true); tick(); }, 3800); };
    dots.forEach(function (d, j) { d.addEventListener('click', function () { clearTimeout(ct); setC(j); tick(); }); });
    var refl = demo.querySelector('.refl img'); if (refl) { var _s = setC; setC = function (i, a) { _s(i, a); refl.src = imgs[i].src; }; }
    setC(0); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) tick();
  }
  var md = document.querySelector('.mode');
  if (md) md.addEventListener('click', function () {
    var d = md.getAttribute('aria-pressed') !== 'true'; md.setAttribute('aria-pressed', d); md.setAttribute('aria-label', d ? 'Switch to light mode' : 'Switch to dark mode');
    md.innerHTML = '<i data-lucide="' + (d ? 'sun' : 'moon') + '"></i>'; paint();
    document.querySelectorAll('.cyc img[data-d]').forEach(function (im) { im.src = d ? im.dataset.d : im.dataset.l; });
    document.querySelectorAll('.cyc .screen').forEach(function (s) { s.style.background = d ? '#0b0b10' : ''; });
  });
  var cw = document.querySelector('.cw');
  if (false && cw) { var ws = cw.children, wi = 0; setInterval(function () { ws[wi].classList.remove('on'); wi = (wi + 1) % ws.length; ws[wi].classList.add('on'); }, 2200); }
  // count-up
  var cnt = document.querySelectorAll('[data-count]');
  if (cnt.length && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; co.unobserve(e.target); var el = e.target, to = +el.dataset.count, pre = el.dataset.pre || '', t0 = performance.now(); (function f(now) { var p = Math.min(1, (now - t0) / 1400); p = 1 - Math.pow(1 - p, 3); el.textContent = pre + Math.round(to * p).toLocaleString('en-GB'); if (p < 1) requestAnimationFrame(f); })(t0); }); }, { threshold: .4 });
    cnt.forEach(function (el) { co.observe(el); });
  }
  // tilt on scroll/pointer
  var tilts = document.querySelectorAll('.tilt');
  if (tilts.length && !matchMedia('(prefers-reduced-motion: reduce)').matches && matchMedia('(min-width:760px)').matches) {
    var upd = function () { tilts.forEach(function (el) { var r = el.getBoundingClientRect(), c = (r.top + r.height / 2) / innerHeight - .5; el.style.setProperty('--rx', (c * 10).toFixed(2) + 'deg'); }); };
    addEventListener('scroll', upd, { passive: true }); upd();
    if (matchMedia('(hover:hover)').matches) tilts.forEach(function (el) {
      el.addEventListener('pointermove', function (e) { var r = el.getBoundingClientRect(); el.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 14).toFixed(2) + 'deg'); });
      el.addEventListener('pointerleave', function () { el.style.setProperty('--ry', '0deg'); });
    });
  }
  // mobile tour stage
  var sm = document.querySelectorAll('.stage-m img'), sl = document.querySelectorAll('.stage-lbl span');
  if (sm.length) {
    var stepsM = document.querySelectorAll('.step');
    var mo = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; var i = [].indexOf.call(stepsM, e.target); sm.forEach(function (x, j) { x.classList.toggle('on', j === i); }); sl.forEach(function (x, j) { x.classList.toggle('on', j === i); }); stepsM.forEach(function (x, j) { x.classList.toggle('on', j === i); }); }); }, { rootMargin: '-40% 0px -40% 0px' });
    stepsM.forEach(function (el) { mo.observe(el); });
  }
  var mc = document.querySelector('.mcta'), hero = document.querySelector('.hero');
  if (mc && hero) { var onS = function () { mc.classList.toggle('show', scrollY > hero.offsetHeight * .7 && scrollY + innerHeight < document.body.scrollHeight - 200); }; addEventListener('scroll', onS, { passive: true }); onS(); }
  var seg = document.querySelector('.seg');
  if (seg) seg.querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { seg.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-selected', x === b); }); document.querySelectorAll('.cmp-list').forEach(function (l) { l.classList.toggle('on', l.dataset.p === b.dataset.p); }); }); });
  // pricing calculator
  var calc = document.querySelector('.calc');
  if (calc) {
    var fmt = function (n) { return '£' + n.toFixed(2); };
    var run2 = function () {
      var s = {}; calc.querySelectorAll('.opt2').forEach(function (o) { s[o.dataset.c] = o.getAttribute('aria-pressed') === 'true'; });
      var rows = [], them = 0;
      if (s.se) { rows.push(['A sole trader app', 22.80]); them += 22.80; }
      if (s.prop) { rows.push(['A landlord add-on', 12.00]); them += 12.00; }
      if (s.ltd) { rows.push(['Company accounting software', 16.00]); them += 16.00; rows.push(['Accountant retainer (from)', 60.00]); them += 60.00; }
      if (s.life) { rows.push(['A budgeting app', 9.99]); them += 9.99; }
      if (!rows.length) { rows.push(['Nothing selected', 0]); }
      var me, plan;
      if (s.ltd) { plan = 'Finrock Limited company' + ((s.se || s.prop) ? '' : ''); me = ((s.se || s.prop) && over) ? 59.99 : 49.99; }
      else if (s.se || s.prop) { plan = 'Finrock Sole trader & Landlord · MTD'; me = 24.99; }
      else { plan = 'Finrock My Life'; me = 9.99; }
      document.getElementById('calc-rows').innerHTML = rows.map(function (r) { return '<div class="row"><span>' + r[0] + '</span><b>' + (r[1] ? fmt(r[1]) : '—') + '</b></div>'; }).join('');
      document.getElementById('calc-them').textContent = fmt(them);
      document.getElementById('calc-me').textContent = fmt(me);
      document.getElementById('calc-plan').textContent = plan;
      var sv = them - me; document.getElementById('calc-save').textContent = sv > 0 ? 'Save ' + fmt(sv) + ' a month — ' + fmt(sv * 12) + ' a year — and keep one app.' : (them ? 'Similar price — but one app, and your whole life in it.' : '');
    };
    calc.querySelectorAll('.opt2').forEach(function (o) { o.addEventListener('click', function () { o.setAttribute('aria-pressed', o.getAttribute('aria-pressed') !== 'true'); run2(); }); });
    run2();
  }
  // scrollSnapInit
  if (matchMedia('(max-width:759px)').matches) document.querySelectorAll('.plans').forEach(function (p) { var h = p.querySelector('.plan.hot'); if (h) p.scrollLeft = h.offsetLeft - (p.clientWidth - h.clientWidth) / 2 - 22; });
  var y = document.querySelector('[data-year]'); if (y) y.textContent = new Date().getFullYear();
})();

/* Cookie consent. Essential cookies always; analytics and advertising only after a yes.
   The choice is kept in localStorage under 'fr-consent' and announced with a 'fr-consent' event,
   which the analytics block on each page listens for. Footer "Cookie settings" reopens it.
   The banner only opens by itself on a page whose analytics block has an ID filled in
   (window.FR_TRACKING); with no trackers configured there is nothing to ask about. */
(function () {
  var KEY = 'fr-consent', VERSION = 1;
  function read() { try { var c = JSON.parse(localStorage.getItem(KEY) || 'null'); return c && c.v === VERSION ? c : null; } catch (e) { return null; } }
  function save(analytics, marketing) {
    var c = { v: VERSION, analytics: !!analytics, marketing: !!marketing, at: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    window.frConsentState = c;
    try { window.dispatchEvent(new CustomEvent('fr-consent', { detail: c })); } catch (e) {}
    close();
  }
  var root = null;
  function legalHref() { var a = document.querySelector('a[href$="finrock-legal.html"]'); return (a ? a.getAttribute('href') : 'finrock-legal.html') + '#cookies'; }
  function close() { if (root) { root.remove(); root = null; } document.body.classList.remove('cc-open'); }
  function open(showSettings) {
    close();
    var c = read() || { analytics: false, marketing: false };
    root = document.createElement('div');
    root.className = 'cc'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-live', 'polite'); root.setAttribute('aria-label', 'Cookie choices');
    root.innerHTML =
      '<div class="cc-in">' +
        '<p class="cc-t">Cookies, plainly</p>' +
        '<p class="cc-p">We use essential cookies to run this site. With your OK we’d also measure visits and see which of our ads work. Never tied to your financial data. <a href="' + legalHref() + '">Details</a></p>' +
        '<div class="cc-set"' + (showSettings ? '' : ' hidden') + '>' +
          '<label class="cc-row"><span><b>Essential</b><small>Sign-in, security, your choices here. Always on.</small></span><input type="checkbox" checked disabled></label>' +
          '<label class="cc-row"><span><b>Analytics</b><small>Google Analytics: which pages help and which confuse.</small></span><input type="checkbox" name="analytics"' + (c.analytics ? ' checked' : '') + '></label>' +
          '<label class="cc-row"><span><b>Advertising</b><small>Meta and Google Ads: whether an ad led to a sign-up.</small></span><input type="checkbox" name="marketing"' + (c.marketing ? ' checked' : '') + '></label>' +
        '</div>' +
        '<div class="cc-b">' +
          '<button type="button" class="btn btn-or" data-cc="all">Accept all</button>' +
          '<button type="button" class="btn cc-no" data-cc="none">Reject non-essential</button>' +
          '<button type="button" class="cc-link" data-cc="' + (showSettings ? 'save' : 'settings') + '">' + (showSettings ? 'Save my choices' : 'Choose') + '</button>' +
        '</div>' +
      '</div>';
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cc]'); if (!b) return;
      var k = b.getAttribute('data-cc');
      if (k === 'all') save(true, true);
      else if (k === 'none') save(false, false);
      else if (k === 'settings') open(true);
      else if (k === 'save') save(root.querySelector('[name=analytics]').checked, root.querySelector('[name=marketing]').checked);
    });
    document.body.appendChild(root);
    document.body.classList.add('cc-open');
  }
  window.frConsent = { get: read, open: function () { open(true); } };
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('[data-cookie-settings]'); if (a) { e.preventDefault(); open(true); } });
  if (!read() && window.FR_TRACKING) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { open(false); }); else open(false); }
})();

/* Live chat (Tawk.to). Set the two ids from the Tawk dashboard (Administration > Chat Widget > Direct Chat Link:
   https://tawk.to/chat/<PROPERTY>/<WIDGET>). While either is empty nothing loads and the contact form stays.
   The widget sets its own cookies, so it loads only after the visitor accepts non-essential cookies, or when
   they press a "Chat with us" button (which is them asking for it). */
(function () {
  var PROPERTY = '6af506c501d7323c49b2e862', WIDGET = '1k76i4ter';
  if (!PROPERTY || !WIDGET) return;
  var root = document.documentElement; root.classList.add('has-chat');
  var loaded = false, wantOpen = false, T;
  /* Our own launcher: a pill in the site's colours with the Finrock mark. Tawk's default bubble stays hidden. */
  var me = document.querySelector('script[src*="fr.js"]'), icon = (me ? me.getAttribute('src').replace(/fr\.js.*$/, '') : 'assets/') + 'favicon.svg';
  var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'fr-chat'; btn.setAttribute('data-chat', ''); btn.setAttribute('aria-label', 'Chat with us');
  btn.innerHTML = '<span class="fr-chat-mark"><img src="' + icon + '" alt="" width="26" height="24"></span><span class="fr-chat-label">Chat with us</span><span class="fr-chat-x" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></span><span class="fr-chat-close">Close</span><i></i>';
  function add() { document.body.appendChild(btn); } if (document.body) add(); else document.addEventListener('DOMContentLoaded', add);
  /* The pill opens our own help panel first: start a chat, six common questions answered in place, or the contact form.
     Nothing is fetched from Tawk until Start conversation is pressed. */
  var QA = [
    ['What is Finrock and who is it for?', 'Finrock is a UK bookkeeping, tax and life-admin app for employed people, landlords, sole traders, partners and limited companies. It connects to your bank read-only, suggests a category for every transaction, keeps a live Self Assessment or Corporation Tax estimate, and tracks renewals such as your MOT and insurance.'],
    ['How do I get started with Finrock?', 'Press Start free at the top of the page and create your account. Setup is a handful of questions about how you earn, such as a job, a trade, a let or a company. Then connect your bank, and each transaction arrives with a suggested category for you to confirm.'],
    ['How do I connect my bank?', 'On a new account, Home leads with Connect your bank. Pick your bank and approve access in your own banking app. New transactions appear in Activity within a few minutes. Most UK banks are supported, and you can import a statement for an account that can’t be connected.'],
    ['Is bank access safe?', 'Yes. The connection is read-only, through a regulated Open Banking provider. Finrock can read your accounts, balances and transactions to do your books. It can never move, send or withdraw money. You approve access in your own banking app, and we never see your bank login.'],
    ['Does Finrock file my tax return?', 'Finrock works out the figures for your returns from your sorted transactions. VAT returns and Making Tax Digital quarterly updates are built to go to HMRC from the app once you connect your HMRC account, and the page tells you if that is not live yet. Your Self Assessment return, the Corporation Tax return and the confirmation statement are prepared here and sent by you or your accountant.'],
    ['Can my accountant use it too?', 'Yes. Invite your accountant from Filing & deadlines, under Change who files. Choose Business only or My whole tax return. They get a portal of their own, see the same figures you do, and suggest changes for you to accept or decline. You can disconnect them at any time.']
  ];
  var panel = null, CH = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  function txt(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function build() {
    var base = icon.replace(/assets\/favicon\.svg$/, '');
    panel = document.createElement('div'); panel.className = 'fr-cp'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Finrock help'); panel.tabIndex = -1;
    panel.innerHTML = '<div class="fr-cp-home"><span class="fr-cp-av"><img src="' + icon + '" alt="" width="32" height="29"></span><h2>Hi there! 👋</h2>' +
      '<p class="fr-cp-in">I’m the Finrock AI assistant. Ask me anything about using Finrock: banking, tax, invoices, bills or your account.</p>' +
      '<div class="fr-cp-card"><h3>Ask Finrock Assistant</h3><p>Instant answers from the Finrock help centre</p><button type="button" class="fr-cp-link" data-chat>Start conversation ' + CH + '</button></div>' +
      '<div class="fr-cp-card fr-cp-list"><h3>Popular questions</h3>' + QA.map(function (x, i) { return '<button type="button" class="fr-cp-q" data-q="' + i + '"><span>' + txt(x[0]) + '</span>' + CH + '</button>'; }).join('') + '</div>' +
      '<div class="fr-cp-card"><h3>Need a person?</h3><p>Send your question to the Finrock support team and we’ll reply by email.</p><a class="fr-cp-link" href="' + base + 'finrock-contact.html#contact-form">Contact support ' + CH + '</a></div>' +
      '<p class="fr-cp-note">AI answers can be wrong.</p></div>' +
      '<div class="fr-cp-ans" hidden><button type="button" class="fr-cp-back"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg> Back</button><h3></h3><p></p>' +
      '<button type="button" class="fr-cp-link" data-chat>Didn’t answer my question? Ask the assistant ' + CH + '</button></div>';
    document.body.appendChild(panel);
    var home = panel.querySelector('.fr-cp-home'), ans = panel.querySelector('.fr-cp-ans');
    panel.addEventListener('click', function (e) {
      var q = e.target.closest && e.target.closest('.fr-cp-q');
      if (q) { var x = QA[+q.getAttribute('data-q')]; ans.querySelector('h3').textContent = x[0]; ans.querySelector('p').textContent = x[1]; home.hidden = true; ans.hidden = false; panel.scrollTop = 0; ans.querySelector('.fr-cp-back').focus(); return; }
      if (e.target.closest && e.target.closest('.fr-cp-back')) { ans.hidden = true; home.hidden = false; panel.scrollTop = 0; }
    });
  }
  function panelOpen() { return root.classList.contains('chat-panel'); }
  function showPanel() {
    if (!panel) build();
    panel.querySelector('.fr-cp-ans').hidden = true; panel.querySelector('.fr-cp-home').hidden = false;
    root.classList.add('chat-panel', 'chat-open'); btn.classList.remove('new'); btn.setAttribute('aria-label', 'Close'); panel.scrollTop = 0; panel.focus();
  }
  function hidePanel(keepOpen) { root.classList.remove('chat-panel'); if (!keepOpen) { root.classList.remove('chat-open'); btn.setAttribute('aria-label', 'Chat with us'); } }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panelOpen()) { hidePanel(false); btn.focus(); } });
  function openChat() { if (!T || !T.maximize) return; if (T.showWidget) T.showWidget(); T.maximize(); opened(); }
  /* While the chat is open the pill is its Close button, as on a phone the window fills the screen. Tawk's own
     round minimise button is hidden under it, and a window that would sit under the pill is shortened to end above it. */
  var fitting = 0;
  function fit() {
    if (!root.classList.contains('chat-open')) return;
    var vh = window.innerHeight, room = 78;
    [].slice.call(document.querySelectorAll('iframe[title="Chat widget"]')).forEach(function (f) {
      var r = f.getBoundingClientRect(); if (!r.width || !r.height) return;
      if (r.width <= 100 && r.height <= 100) { f.classList.add('fr-tawk-min'); return; }
      f.classList.remove('fr-tawk-min');
      if (r.height > 200 && r.bottom > vh - room + 1) {
        var h = Math.max(240, Math.round(vh - room - Math.max(r.top, 0)));
        f.style.setProperty('height', h + 'px', 'important'); f.style.setProperty('max-height', h + 'px', 'important'); f.style.setProperty('min-height', '0px', 'important');
        f.style.setProperty('top', 'auto', 'important'); f.style.setProperty('bottom', room + 'px', 'important');
      }
    });
  }
  function opened() { root.classList.add('chat-open'); btn.classList.remove('new'); btn.setAttribute('aria-label', 'Close chat'); fit(); if (!fitting) fitting = setInterval(fit, 400); }
  function closed() { root.classList.remove('chat-open'); btn.setAttribute('aria-label', 'Chat with us'); if (fitting) { clearInterval(fitting); fitting = 0; } }
  function load(open) {
    if (open) wantOpen = true;
    if (loaded) { if (open) openChat(); return; }
    loaded = true; if (open) btn.classList.add('busy');
    T = window.Tawk_API = window.Tawk_API || {}; window.Tawk_LoadStart = new Date();
    T.onBeforeLoad = function () { if (!wantOpen && T.hideWidget) T.hideWidget(); };
    /* Tawk reopens a chat that was open on the last page without calling onChatMaximized, so the state is read, twice more after load. */
    function sync() { if (T.isChatMaximized && T.isChatMaximized() && !root.classList.contains('chat-open')) { if (T.showWidget) T.showWidget(); opened(); } }
    T.onLoad = function () { btn.classList.remove('busy'); if (wantOpen) openChat(); else if (T.isChatMaximized && T.isChatMaximized()) sync(); else if (T.hideWidget) T.hideWidget(); setTimeout(sync, 800); setTimeout(sync, 2500); };
    T.onChatMaximized = opened;
    T.onChatMinimized = function () { closed(); if (T.hideWidget) T.hideWidget(); };
    T.onChatMessageAgent = function () { if (!root.classList.contains('chat-open')) btn.classList.add('new'); };
    var s = document.createElement('script'); s.async = true; s.src = 'https://embed.tawk.to/' + PROPERTY + '/' + WIDGET;
    s.charset = 'UTF-8'; s.setAttribute('crossorigin', '*'); document.head.appendChild(s);
  }
  function allowed() { try { var c = JSON.parse(localStorage.getItem('fr-consent') || 'null'); return !!(c && (c.analytics || c.ads || c.all)); } catch (e) { return false; } }
  if (allowed()) load(false);
  window.addEventListener('fr-consent', function () { if (allowed()) load(false); });
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-chat]'); if (!b) return; e.preventDefault();
    if (b === btn) { if (panelOpen()) hidePanel(false); else if (root.classList.contains('chat-open')) { if (T && T.minimize) T.minimize(); } else showPanel(); return; }
    hidePanel(true); load(true);
  });
})();

/* Films marked data-lazy load and play only when scrolled into view, and pause when out of it. */
(function () {
  var vids = document.querySelectorAll('video[data-lazy]'); if (!vids.length) return;
  if (!('IntersectionObserver' in window)) { vids.forEach(function (v) { v.setAttribute('controls', ''); }); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { var v = e.target; if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () { v.setAttribute('controls', ''); }); } else v.pause(); }); }, { threshold: 0.35 });
  vids.forEach(function (v) { io.observe(v); });
})();
