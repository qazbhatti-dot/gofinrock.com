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
  var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'fr-chat'; btn.setAttribute('data-chat', ''); btn.setAttribute('aria-label', 'Ask Finrock');
  btn.innerHTML = '<span class="fr-chat-mark"><img src="' + icon + '" alt="" width="26" height="24"></span><span class="fr-chat-label">Ask Finrock</span><span class="fr-chat-x" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></span><span class="fr-chat-close">Close</span><i></i>';
  function add() { document.body.appendChild(btn); } if (document.body) add(); else document.addEventListener('DOMContentLoaded', add);
  /* The pill opens our own help panel first: start a chat, six common questions answered in place, or the contact form.
     Nothing is fetched from Tawk until Start conversation is pressed. */
  var QA = [
    ["What is Finrock and who is it for?", "Finrock is one app for your money, tax and life admin in the UK.\n\n**It's built for**\n- Employed people and landlords\n- Sole traders and partners\n- Owner-run limited companies\n\n**What it does**\n- Connects to your bank read-only and suggests a category for every transaction\n- Keeps a live Self Assessment or Corporation Tax estimate\n- Tracks renewals such as your MOT and insurance"],
    ["How do I get started with Finrock?", "It takes about three minutes:\n\n1. Press **Start free** at the top of the page. It's 7 days free with no card.\n2. Answer a few questions about how you earn: a job, a trade, a let or a company.\n3. Connect your bank, and each transaction arrives with a suggested category for you to confirm."],
    ["How do I connect my bank?", "On a new account, Home leads with **Connect your bank**.\n\n1. Pick your bank.\n2. Approve access in your own banking app.\n3. New transactions appear in Activity within a few minutes.\n\nMost UK banks are supported. If an account can't be connected, you can import a statement instead."],
    ["Is bank access safe?", "Yes. The connection is read-only, through a regulated Open Banking provider.\n\n- Finrock can read your accounts, balances and transactions\n- It can never move, send or withdraw money\n- You approve access in your own banking app, and we never see your bank login"],
    ["Does Finrock file my tax return?", "Finrock prepares your Self Assessment, Making Tax Digital quarterly updates and VAT return from your books, ready to file.\n\n**Filing with HMRC**\nFinrock can’t send returns to HMRC itself yet. We’re working through HMRC’s software recognition process, and the app will tell you when direct filing is switched on.\n\n**Until then, you can:**\n- File the prepared figures yourself in your HMRC online account\n- Ask your own accountant to file them\n- Add the accountant check for £10 a month: a qualified UK accountant reviews your return and files it with HMRC for you"],
    ["Can my accountant use it too?", "Yes. Invite your accountant from **Filing & deadlines**, under **Change who files**.\n\n- Choose **Business only** or **My whole tax return**\n- They get a portal of their own and see the same figures you do\n- They suggest changes for you to accept or decline\n- You can disconnect them at any time"]
  ];
  var TOUCH = !!(window.matchMedia && matchMedia('(hover:none) and (pointer:coarse)').matches);
  var panel = null, CH = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  function txt(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  var CONTACT = 'https://app.gofinrock.com/api/public/contact';
  /* Cloudflare Turnstile: the check that a person is there, usually invisible. The site key is public; the server holds
     the secret and decides whether to ask for the check at all. The script is fetched only when a form or the chat needs it. */
  var TS_KEY = '0x4AAAAAAF92mSnXNrDBme8C', tsWait = [];
  function tsReady(cb) {
    if (window.turnstile && window.turnstile.render) return cb();
    tsWait.push(cb);
    if (tsReady.asked) return; tsReady.asked = true;
    window.frTsReady = function () { var w = tsWait; tsWait = []; w.forEach(function (f) { try { f(); } catch (e) {} }); };
    var sc = document.createElement('script'); sc.async = true; sc.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=frTsReady'; document.head.appendChild(sc);
  }
  /* A widget drawn in el; token() is its latest passed check, or '' while it has none. */
  function tsWidget(el) {
    var id = null, tok = '';
    tsReady(function () { try { id = window.turnstile.render(el, { sitekey: TS_KEY, appearance: 'interaction-only', theme: 'light',
      callback: function (t) { tok = t; }, 'expired-callback': function () { tok = ''; }, 'error-callback': function () { tok = ''; } }); } catch (e) {} });
    return {
      token: function () { return tok; },
      reset: function () { tok = ''; try { if (id !== null) window.turnstile.reset(id); } catch (e) {} },
      /* The token, waiting up to a few seconds for the check to finish; '' if it never does, and the server decides. */
      wait: function (done) { var n = 0; (function tick() { if (tok || ++n > 40) return done(tok); setTimeout(tick, 150); })(); }
    };
  }
  /* Our own assistant answers in the panel, from the live app, and Tawk is loaded only to hand a visitor to the team.
     One browser can be pointed at a test server with ?ai=<address>, or back to Tawk alone with ?ai=off, kept for that
     browser; ?ai=live returns it to the live app. */
  var APP = 'https://app.gofinrock.com', AI = APP + '/api/public/help-chat', msgs = [];
  try {
    var qa = new URLSearchParams(location.search).get('ai');
    if (qa === 'live') localStorage.removeItem('fr-ai'); else if (qa === 'off') localStorage.setItem('fr-ai', 'off'); else if (qa && /^(https:\/\/app\.gofinrock\.com|http:\/\/localhost(:\d+)?)\//.test(qa)) localStorage.setItem('fr-ai', qa);
    var kept = localStorage.getItem('fr-ai'); if (kept) AI = kept === 'off' ? '' : kept;
    if (AI) msgs = JSON.parse(sessionStorage.getItem('fr-ai-log') || '[]');
  } catch (e) {}
  /* A soft chime as an answer lands and a quiet tick as a question goes, drawn in the browser so nothing is fetched.
     Browsers allow sound only after a tap or a key, so the player is made on the first question. */
  var snd = null;
  function tone(notes, vol) {
    try {
      if (!snd) { var A = window.AudioContext || window.webkitAudioContext; if (!A) return; snd = new A(); }
      if (snd.state === 'suspended') snd.resume();
      var t = snd.currentTime;
      notes.forEach(function (n) {
        var o = snd.createOscillator(), g = snd.createGain(); o.type = 'sine'; o.frequency.value = n[0];
        g.gain.setValueAtTime(0, t + n[1]); g.gain.linearRampToValueAtTime(vol, t + n[1] + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + n[1] + n[2]);
        o.connect(g); g.connect(snd.destination); o.start(t + n[1]); o.stop(t + n[1] + n[2] + 0.05);
      });
    } catch (e) {}
  }
  function pop(from, to, len, vol) {
    try {
      if (!snd) { var A = window.AudioContext || window.webkitAudioContext; if (!A) return; snd = new A(); }
      if (snd.state === 'suspended') snd.resume();
      var t = snd.currentTime, o = snd.createOscillator(), g = snd.createGain(); o.type = 'sine';
      o.frequency.setValueAtTime(from, t); o.frequency.exponentialRampToValueAtTime(to, t + len * 0.6);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(g); g.connect(snd.destination); o.start(t); o.stop(t + len + 0.03);
    } catch (e) {}
  }
  function tick() { pop(520, 760, 0.07, 0.05); }
  function chime() { pop(380, 1040, 0.16, 0.16); setTimeout(function () { pop(620, 1480, 0.14, 0.09); }, 70); }
  /* An answer writes itself in over about a second, word by word, as if typed; links and bold are in place from the start. */
  function reveal(el, html, log) {
    el.innerHTML = html;
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var nodes = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n, total = 0;
    while ((n = w.nextNode())) { nodes.push([n, n.nodeValue]); total += n.nodeValue.length; n.nodeValue = ''; }
    var shown = 0, step = Math.max(3, Math.ceil(total / 55));
    (function frame() {
      shown += step; var left = shown;
      nodes.forEach(function (x) { var k = Math.max(0, Math.min(x[1].length, left)); x[0].nodeValue = x[1].slice(0, k); left -= x[1].length; });
      if (log) log.scrollTop = log.scrollHeight;
      if (shown < total) requestAnimationFrame(frame);
    })();
  }
  function save() { try { sessionStorage.setItem('fr-ai-log', JSON.stringify(msgs.slice(-20))); } catch (e) {} }
  /* An answer is the server's plain text: links, bold and list lines are drawn, everything else is escaped. An app page
     is named by its path, so a path becomes a link into the app. */
  function fmt(s) {
    function href(u) { return /^\//.test(u) ? APP + u : u; }
    function inline(t) {
      return txt(t).replace(/\[([^\]\n]{1,80})\]\(((?:https:\/\/|\/)[^\s)]{0,200})\)/g, function (m, l, u) { return '<a href="' + href(u) + '" target="_blank" rel="noopener">' + l + '</a>'; })
        .replace(/(^|[\s(])(https:\/\/[^\s<)]+[^\s<).,;:!?])/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')
        .replace(/(^|[\s(])(\/[a-z][\w\-\/]*[\w\/])(?=[\s).,;:!?]|$)/g, '$1<a href="' + APP + '$2" target="_blank" rel="noopener">$2</a>')
        .replace(/\*\*([^*\n]+)\*\*/g, '<b>$1</b>');
    }
    /* Blank lines part paragraphs and "- " lines make a list, so an answer reads as a support agent would set it out. */
    var out = [], para = [], list = null, kind = 'ul';
    function endPara() { if (para.length) out.push('<p>' + para.join('<br>') + '</p>'); para = []; }
    function endList() { if (list) out.push('<' + kind + '>' + list.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</' + kind + '>'); list = null; }
    String(s).split('\n').forEach(function (line) {
      var t = line.trim();
      if (!t) { endPara(); endList(); return; }
      var b = t.match(/^([-*•]|\d+[.)])\s+(.*)$/), k = b && (/\d/.test(b[1]) ? 'ol' : 'ul');
      if (b) { endPara(); if (list && k !== kind) endList(); kind = k; (list = list || []).push(inline(b[2])); return; }
      endList(); para.push(inline(t));
    });
    endPara(); endList();
    return out.join('');
  }

  function build() {
    var base = icon.replace(/assets\/favicon\.svg$/, ''), BK = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
    var AV = '<span class="fr-cp-av"><img src="' + icon + '" alt="" width="32" height="29"></span>';
    var XX = '<button type="button" class="fr-cp-x" data-close aria-label="Close"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
    panel = document.createElement('div'); panel.className = 'fr-cp'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Finrock help'); panel.tabIndex = -1;
    panel.innerHTML = '<div class="fr-cp-home" data-v="home"><div class="fr-cp-hero">' + XX + '<span class="fr-cp-mark"><img src="' + icon + '" alt="" width="22" height="20"></span><h2>Hi there 👋</h2>' +
      '<p class="fr-cp-in">Ask anything about Finrock: plans and prices, banking, tax, invoices or your account.</p></div>' +
      '<button type="button" class="fr-cp-askcard" data-chat><span><b>' + (AI ? 'Ask Finrock' : 'Chat with the team') + '</b><small>' + (AI ? 'Instant answers, any time of day' : 'A person from Finrock replies here') + '</small></span><i>' + CH + '</i></button>' +
      '<div class="fr-cp-card fr-cp-list"><h3>Popular questions</h3>' + QA.map(function (x, i) { return '<button type="button" class="fr-cp-q" data-q="' + i + '"><span>' + txt(x[0]) + '</span>' + CH + '</button>'; }).join('') + '</div>' +
      '<div class="fr-cp-card"><h3>Need a person?</h3><p>Send your question to the Finrock support team and we’ll reply by email.</p><button type="button" class="fr-cp-link" data-sup="home">Contact support ' + CH + '</button></div>' +
      '<p class="fr-cp-note">AI answers can be wrong.</p></div>' +
      '<div class="fr-cp-ans" data-v="chat" hidden><div class="fr-cp-head"><button type="button" class="fr-cp-back" data-to="home" aria-label="Back">' + BK + '</button>' + AV + '<div><b>Finrock Assistant</b><span>AI assistant · Replies instantly</span></div>' + XX + '</div>' +
      '<div class="fr-cp-log" aria-live="polite"></div>' +
      '<div class="fr-cp-foot">' + (AI ? '<div class="fr-cp-ts"></div><form class="fr-cp-box"><textarea rows="1" maxlength="1500" placeholder="Ask a question about Finrock…" aria-label="Your question"></textarea><button type="submit" class="fr-cp-go" aria-label="Send"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button></form>'
        : '<button type="button" class="fr-cp-ask" data-chat><span>Ask a question about Finrock…</span><i><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg></i></button>') +
      '<p class="fr-cp-note">AI answers can be wrong. <button type="button" class="fr-cp-a" data-sup="chat">Contact support</button></p></div></div>' +
      '<div class="fr-cp-ans fr-cp-sup" data-v="sup" hidden><div class="fr-cp-head"><button type="button" class="fr-cp-back" aria-label="Back">' + BK + '</button><div><b>Contact support</b><span>The Finrock support team replies by email</span></div>' + XX + '</div>' +
      '<form class="fr-cp-form" novalidate>' + '<label>Your email<input type="email" name="email" autocomplete="email" maxlength="254" required></label>' +
      '<label>Your question<textarea name="query" rows="5" maxlength="5000" required></textarea></label>' +
      '<div class="fr-cp-ts"></div><button type="submit" class="fr-cp-send">Send to support</button><p class="fr-cp-status" role="status"></p></form>' +
      '<div class="fr-cp-done" hidden><svg class="fr-cp-tick" viewBox="0 0 52 52" width="64" height="64" aria-hidden="true"><circle cx="26" cy="26" r="24" fill="none"/><path fill="none" d="M15 27l7.5 7.5L37.5 19"/></svg><h3>Message sent</h3><p>Your question has been sent to the Finrock support team. We’ll reply by email.</p><button type="button" class="fr-cp-send" data-to="home">Back to chat</button></div></div>';
    document.body.appendChild(panel);
    var log = panel.querySelector('.fr-cp-log'), sup = panel.querySelector('.fr-cp-sup'), form = sup.querySelector('form'), done = sup.querySelector('.fr-cp-done'), status = sup.querySelector('.fr-cp-status'), lastQ = '';
    function view(v) { [].forEach.call(panel.children, function (c) { c.hidden = c.getAttribute('data-v') !== v; }); if (v === 'home') panel.firstChild.scrollTop = 0; if (AI) keep(v === 'chat'); if (v === 'chat') log.scrollTop = log.scrollHeight; }
    function say(who, text) {
      var m = document.createElement('div'); m.className = 'fr-cp-m ' + who;
      m.innerHTML = (who === 'bot' ? AV : '') + '<div>' + (text === null ? '<span class="fr-cp-dots"><i></i><i></i><i></i></span>' + (AI && who === 'bot' ? '<span class="fr-cp-think">Thinking…</span>' : '') : who === 'bot' ? fmt(text) : txt(text)) + '</div>';
      log.appendChild(m); log.scrollTop = log.scrollHeight; return m;
    }
    panel.__support = function (from) { support(from); };
    var box = panel.querySelector('.fr-cp-box'), ta = box && box.querySelector('textarea'), go = box && box.querySelector('.fr-cp-go'), busy = false;
    /* An empty conversation opens with a greeting, typed in as the panel opens; it is the panel's, so it is never sent to the model. */
    function greet() {
      if (!AI || log.querySelector('.fr-cp-m')) return;
      var m = say('bot', null);
      setTimeout(function () { reveal(m.lastChild, txt('Hi there! 👋 I’m the Finrock assistant. Ask me anything about Finrock: plans and prices, banking, tax, invoices or your account.'), log); }, 450);
    }
    var chatTs = null;
    /* Focus never scrolls the page: on a phone that scroll fights the keyboard's own and the chat jumps. A box that
       is focused without a tap would raise the keyboard over an answer that has just landed, so a phone waits for one. */
    panel.__chat = function (focus) { view('chat'); greet(); if (AI && !chatTs) chatTs = tsWidget(panel.querySelector('[data-v="chat"] .fr-cp-ts')); if (focus && ta) ta.focus({ preventScroll: true }); };
    /* A chat that has ended is gone: the panel closes and the next one starts afresh with the greeting. */
    panel.__ended = function () {
      try { sessionStorage.removeItem('fr-carry'); } catch (e) {}
      msgs = []; save(); log.innerHTML = ''; lastQ = ''; asking = false;
      try { sessionStorage.removeItem('fr-live'); } catch (e) {}
      view('home'); hidePanel(false); btn.focus({ preventScroll: true });
    };
    msgs.forEach(function (m) { say(m.role === 'user' ? 'user' : 'bot', m.content); });
    /* A log that was at its end stays there when the panel changes height, as it does when a phone's keyboard opens. */
    var logEnd = true;
    log.addEventListener('scroll', function () { logEnd = log.scrollHeight - log.scrollTop - log.clientHeight < 24; }, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(function () { if (logEnd) log.scrollTop = log.scrollHeight; }).observe(log);
    function grow() { box.classList.toggle('has', !!ta.value.trim()); ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'; }
    var HUMAN = /\b(human|humans|real person|actual person|someone real|live (chat|agent|person|support)|(spe+a?k|spk|sk|spek|spak|talk|tlk|chat)\s+(to|with|2)\s+(an?\s+|the\s+|your\s+|a\s+real\s+)?(someone|somebody|person|human|agent|advisor|adviser|support|team|staff|rep)|(to|with)\s+(an?\s+)?(agent|human|advisor|adviser)|customer (service|support)|operator)\b|^\s*(agent|advisor|adviser|human|person|support)\s*[?!.]*\s*$/i,
      YES = /^\s*(y|ye|yes|yea|yeah|yep|yup|ya|ok|okay|sure|please|yes please|ok please|go on|go ahead|do it|transfer( me)?|connect me|put me through)\s*[.!]*\s*$/i,
      NO = /^\s*(n|no|nope|nah|no thanks|no thank you|not now|not yet|later)\s*[.!]*\s*$/i, asking = false;
    var ASK = 'Would you like me to transfer you to someone on the team?';
    /* The transfer is asked in words first; the button comes only once they have said yes. */
    function askTransfer(before) {
      asking = true; var m = say('bot', null);
      setTimeout(function () { reveal(m.lastChild, txt((before ? before + ' ' : '') + ASK), log); chime(); }, 400);
    }
    /* A person costs the team's time, so live chat is offered only when the assistant has said it can't help. Tawk is
       fetched as the offer appears, so Yes opens it straight away. */
    function offer(text, agreed) {
      load(false);
      var o = document.createElement('div'); o.className = 'fr-cp-offer';
      o.innerHTML = (text ? '<p>' + txt(text) + '</p>' : '') + '<div><button type="button" class="fr-cp-yes">' + (agreed ? 'Transfer me' : 'Yes, transfer me') + '</button><button type="button" class="fr-cp-no">' + (agreed ? 'Not now' : 'No thanks') + '</button></div>';
      o.querySelector('.fr-cp-no').addEventListener('click', function () { o.remove(); if (ta) ta.focus({ preventScroll: true }); });
      o.querySelector('.fr-cp-yes').addEventListener('click', function () {
        o.remove(); tick();
        var m = say('bot', null);
        setTimeout(function () { reveal(m.lastChild, 'Transferring you to a real support agent now. They’ll see what you’ve asked me, so there’s no need to repeat it.', log); chime(); }, 350);
        setTimeout(function () { hand(); goLive(); }, 1700);
      });
      log.appendChild(o); log.scrollTop = log.scrollHeight;
    }
    /* The agent is handed the conversation so far as an event on the visitor, which Tawk shows beside the chat. */
    function hand() {
      var sent = false, tries = 0, t = setInterval(function () {
        if (sent || ++tries > 60) return clearInterval(t);
        if (!T || !T.addEvent) return;
        var meta = {};
        msgs.slice(-8).forEach(function (m, i) { meta[(i + 1) + ' ' + (m.role === 'user' ? 'visitor' : 'assistant')] = String(m.content).slice(0, 250); });
        try { T.addEvent('website-assistant-chat', meta, function () {}); sent = true; } catch (e) {}
      }, 250);
    }
    function ask(q) {
      q = q.trim().slice(0, 1500); if (!q || busy) return;
      if (asking && (YES.test(q) || NO.test(q))) {
        asking = false; ta.value = ''; grow(); say('user', q); tick();
        if (YES.test(q)) { var y = say('bot', null); setTimeout(function () { reveal(y.lastChild, 'Great. Tap below and I’ll put you through.', log); chime(); offer('', true); }, 400); }
        else { var n = say('bot', null); setTimeout(function () { reveal(n.lastChild, 'No problem. What else can I help with?', log); chime(); }, 400); }
        return;
      }
      asking = false;
      if (HUMAN.test(q) && q.length < 160) {
        ta.value = ''; grow(); lastQ = ''; say('user', q); tick();
        askTransfer('Sure. I can also try to answer straight away if you tell me what it’s about.');
        return;
      } busy = true; go.disabled = true; lastQ = q; ta.value = ''; grow();
      msgs.push({ role: 'user', content: q }); save(); say('user', q); tick(); var w = say('bot', null);
      /* A conversation carries the pass the server gave its first checked question; without one, this question carries
         the page's Turnstile check, waited for a moment if it is still running. */
      var pass = ''; try { pass = sessionStorage.getItem('fr-ai-pass') || ''; } catch (e) {}
      if (pass || !chatTs) post(''); else chatTs.wait(post);
      function post(tok) {
      var ctl = window.AbortController ? new AbortController() : null, tm = setTimeout(function () { if (ctl) ctl.abort(); }, 30000);
      /* Sent as plain text so the browser asks no permission first: the answer arrives in one round trip. */
      fetch(AI, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ messages: msgs.slice(-10), pass: pass, turnstile: tok }), signal: ctl ? ctl.signal : undefined })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { j.status = r.status; return j; }); })
        .then(function (j) {
          if (j.pass) try { sessionStorage.setItem('fr-ai-pass', j.pass); } catch (e) {}
          /* Cloudflare could not confirm a person. A bot must not reach an agent, so live chat is not offered: the check is
             drawn again for another try, and the email form (checked itself) carries the question to the team. */
          if (j.check) { if (chatTs) chatTs.reset(); try { sessionStorage.removeItem('fr-ai-pass'); } catch (e) {} reveal(w.lastChild, 'I couldn’t complete the quick security check, so I can’t answer here just now. Tick the box above and send your question again, or email it to the team.', log); chime(); var em = document.createElement('button'); em.type = 'button'; em.className = 'fr-cp-a fr-cp-more'; em.setAttribute('data-sup', 'chat'); em.textContent = 'Email the team'; log.appendChild(em); log.scrollTop = log.scrollHeight; return; }
          if (!j.answer && !j.handoff) throw j; if (j.answer) { msgs.push({ role: 'assistant', content: j.answer }); save(); } if (j.handoff) { w.remove(); askTransfer(j.answer); return; } reveal(w.lastChild, fmt(j.answer), log); chime(); })
        .catch(function (j) {
          msgs.pop(); save();
          w.remove(); askTransfer(j && j.status === 429 ? 'That’s a lot of questions in a short time.' : 'Sorry, I couldn’t answer just now.');
        })
        .then(function () { clearTimeout(tm); busy = false; go.disabled = false; log.scrollTop = log.scrollHeight; });
      }
    }
    if (box) {
      box.addEventListener('submit', function (e) { e.preventDefault(); ask(ta.value); });
      ta.addEventListener('input', grow);
      ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); ask(ta.value); } });
    }
    function support(from) {
      sup.querySelector('.fr-cp-back').setAttribute('data-to', from); sup.querySelector('.fr-cp-back').hidden = false; form.hidden = false; done.hidden = true; status.textContent = ''; form.querySelector('.fr-cp-send').disabled = false;
      if (!form.elements.query.value && lastQ && lastQ.length > 12) form.elements.query.value = lastQ;
      view('sup'); form.elements.email.focus({ preventScroll: true });
      if (!supTs) supTs = tsWidget(form.querySelector('.fr-cp-ts'));
    }
    panel.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('[data-close]')) { hidePanel(false); btn.focus({ preventScroll: true }); return; }
      var t = e.target.closest && e.target.closest('.fr-cp-q,[data-sup],[data-to]'); if (!t) return;
      if (t.hasAttribute('data-sup')) return support(t.getAttribute('data-sup'));
      if (t.hasAttribute('data-to')) return view(t.getAttribute('data-to'));
      var x = QA[+t.getAttribute('data-q')]; lastQ = x[0]; view('chat'); say('user', x[0]); var w = say('bot', null);
      if (AI) { msgs.push({ role: 'user', content: x[0] }, { role: 'assistant', content: x[1] }); save(); tick(); setTimeout(function () { reveal(w.lastChild, fmt(x[1]), log); chime(); log.scrollTop = log.scrollHeight; if (ta && !TOUCH) ta.focus({ preventScroll: true }); }, 450); return; }
      setTimeout(function () {
        w.lastChild.innerHTML = fmt(x[1]); var more = document.createElement('button'); more.type = 'button'; more.className = 'fr-cp-a fr-cp-more'; more.setAttribute('data-sup', 'chat'); more.textContent = 'Didn’t answer my question?';
        log.appendChild(more); log.scrollTop = log.scrollHeight;
      }, 600);
      panel.querySelector('[data-v="chat"] .fr-cp-back').focus({ preventScroll: true });
    });
    /* The question goes to the same place as the contact page's form. That endpoint answers with a redirect back to the
       contact page carrying the result, so it is posted into a hidden frame and the result read from where the frame lands. */
    var supTs = null;
    var WHY = { check: 'We couldn’t confirm you’re not a robot. Please tick the box and send again.', missing: 'Please enter your email and your question.', email: 'That email address doesn’t look right. Please check it and send again.', long: 'That message is over 5,000 characters. Please shorten it and send again.', links: 'Please keep it to three links or fewer and send again.', busy: 'Too many messages just now. Please try again in a little while.' };
    form.addEventListener('input', function () { status.textContent = ''; });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.elements.email.value.trim(), q = form.elements.query.value.trim(), sendBtn = form.querySelector('.fr-cp-send');
      if (!email || !q) { status.textContent = WHY.missing; return; }
      if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) { status.textContent = WHY.email; return; }
      sendBtn.disabled = true; status.textContent = 'Sending…';
      if (supTs && !e.frChecked) { supTs.wait(function () { var ev = new Event('submit', { cancelable: true }); ev.frChecked = true; sendBtn.disabled = false; form.dispatchEvent(ev); }); return; }
      var name = 'frsup' + Date.now(), fr = document.createElement('iframe'); fr.name = name; fr.hidden = true; fr.setAttribute('aria-hidden', 'true'); fr.tabIndex = -1; document.body.appendChild(fr);
      var f = document.createElement('form'); f.method = 'post'; f.action = CONTACT; f.target = name; f.hidden = true;
      var fields = { 'cf-turnstile-response': supTs ? supTs.token() : '', form: 'contact', website: '', name: email.split('@')[0].slice(0, 100), email: email, topic: 'Something else', who: '', message: q + '\n\nSent from the chat panel on ' + location.href.split('?')[0] };
      Object.keys(fields).forEach(function (k) { var i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = fields[k]; f.appendChild(i); });
      document.body.appendChild(f);
      var over = false, timer;
      function end(r) {
        if (over) return; over = true; clearTimeout(timer); setTimeout(function () { if (fr.parentNode) fr.parentNode.removeChild(fr); if (f.parentNode) f.parentNode.removeChild(f); }, 0);
        if (supTs) supTs.reset();
        if (r === 'sent' || r === 'ok') { form.hidden = true; form.reset(); done.hidden = false; sup.querySelector('.fr-cp-back').hidden = true; done.querySelector('button').focus({ preventScroll: true }); return; }
        sendBtn.disabled = false; status.textContent = WHY[r] || 'That didn’t send. Please try again or email support@gofinrock.com.';
      }
      fr.addEventListener('load', function () { var r; try { r = new URLSearchParams(fr.contentWindow.location.search).get('contact'); } catch (x) { r = 'error'; } if (r) end(r); });
      timer = setTimeout(function () { end('error'); }, 20000);
      f.submit();
    });
  }
  function panelOpen() { return root.classList.contains('chat-panel'); }
  function showPanel() {
    if (!panel) build();
    [].forEach.call(panel.children, function (c) { c.hidden = c.getAttribute('data-v') !== 'home'; });
    var live = AI ? msgs.length > 0 : false; try { if (!AI) live = !!(T && T.isChatOngoing && T.isChatOngoing()); } catch (e) {}
    var go = panel.querySelector('.fr-cp-askcard b'); go.textContent = live ? 'Continue your conversation' : AI ? 'Ask Finrock' : 'Chat with the team';
    root.classList.toggle('chat-anim', !!showPanel.anim); showPanel.anim = false;
    root.classList.add('chat-panel', 'chat-open'); btn.classList.remove('new'); btn.setAttribute('aria-label', 'Close'); panel.querySelector('.fr-cp-home').scrollTop = 0; panel.focus({ preventScroll: true });
  }
  function hidePanel(keepOpen) { root.classList.remove('chat-panel'); if (AI && !keepOpen) keep(false); if (!keepOpen) { root.classList.remove('chat-open'); btn.setAttribute('aria-label', 'Ask Finrock'); } }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panelOpen()) { hidePanel(false); btn.focus({ preventScroll: true }); } });
  var clickAt2 = 0;
  function openChat() { clickAt2 = Date.now(); [].forEach.call(document.querySelectorAll('iframe[title="Chat widget"]'), function (f) { var r = f.getBoundingClientRect(); if (r.height > 200 || !r.height) f.style.setProperty('visibility', 'hidden', 'important'); }); if (!T || !T.maximize) return; if (T.showWidget) T.showWidget(); T.maximize(); opened(); }
  /* While the chat is open the pill is its Close button, as on a phone the window fills the screen. Tawk's own
     round minimise button is hidden under it, and a window that would sit under the pill is shortened to end above it. */
  /* The chat window is Tawk's, drawn in a same-origin frame, so it is given the same look as the panel: white bar,
     grey page, white answers, orange questions. Tawk names the assistant "Customer Support"; that is shown as Finrock Assistant. */
  var ICON = 'https://gofinrock.com/assets/favicon.svg';
  /* Ending is the visitor's: Tawk closes the conversation for the agent too, and the panel says so where they were.
     The screen changes first and Tawk is told after the next paint, so the button answers at once however long Tawk
     takes; Tawk's own end and minimise, which it reports back through onChatEnded and onChatMinimized, then find the
     chat already closed. */
  function endLive() {
    endedAt = Date.now(); wantChat = false; swapping = false;
    [].forEach.call(document.querySelectorAll('iframe[title="Chat widget"]'), function (f) { f.style.setProperty('visibility', 'hidden', 'important'); });
    closed();
    if (!panel) build();
    panel.__ended();
    var told = false, tell = function () {
      if (told) return; told = true;
      try { if (T && T.endChat) T.endChat(); } catch (e) {}
      try { if (T && T.minimize) T.minimize(); } catch (e) {}
    };
    requestAnimationFrame(function () { setTimeout(tell, 0); }); setTimeout(tell, 150);
  }
  /* The team chat's close on a phone, where the pill is hidden under a chat that fills the screen. The chat carries on
     at Tawk; only the window goes, at once, and Tawk is told after the next paint. */
  function closeLive() {
    wantChat = false; swapping = false;
    [].forEach.call(document.querySelectorAll('iframe[title="Chat widget"]'), function (f) { f.style.setProperty('visibility', 'hidden', 'important'); });
    closed(); btn.focus({ preventScroll: true });
    var told = false, tell = function () { if (told) return; told = true; try { if (T && T.minimize) T.minimize(); } catch (e) {} };
    requestAnimationFrame(function () { setTimeout(tell, 0); }); setTimeout(tell, 150);
  }
  var SKIN = '.fr-carry{display:flex;flex-direction:column;gap:8px;padding:14px 12px 6px}.fr-carry-lbl{margin:0 0 2px;text-align:center;font:500 11.5px/1.3 Inter,system-ui,sans-serif;color:#a1a1aa}.fr-carry-m{max-width:84%;padding:8px 12px;border-radius:14px;font:400 13.5px/1.45 Inter,system-ui,sans-serif;opacity:.85}.fr-carry-m.u{align-self:flex-end;background:#F6921A;color:#111;border-bottom-right-radius:4px}.fr-carry-m.b{align-self:flex-start;background:#fff;border:1px solid #e4e4e7;color:#18181b;border-bottom-left-radius:4px}.fr-carry-m p{margin:0}.fr-carry-m p+p,.fr-carry-m p+ul,.fr-carry-m ul+p{margin-top:6px}.fr-carry-m ul,.fr-carry-m ol{margin:0;padding-left:18px}.fr-carry-sep{display:flex;align-items:center;gap:10px;margin:8px 0 2px;font:600 12px/1.3 Inter,system-ui,sans-serif;color:#16a34a}.fr-carry-sep::before,.fr-carry-sep::after{content:"";flex:1;height:1px;background:#e4e4e7}.tawk-router-view:has(.fr-carry)::before{display:none!important}' +
    '.tawk-toolbar{position:relative}.tawk-toolbar:has(.fr-end){padding-right:100px!important}.tawk-toolbar-nav:has(.tawk-route-back)::before,.tawk-toolbar-nav:has(.tawk-route-back)::after{min-width:0;overflow:hidden;text-overflow:ellipsis}.fr-end{position:absolute;right:12px;top:50%;transform:translateY(-50%);height:30px;padding:0 12px;border:1px solid #e4e4e7;border-radius:9px;background:#fff;color:#18181b;font:600 13px/1 Inter,system-ui,sans-serif;cursor:pointer;z-index:2}.fr-end:hover{background:#fef2f2;border-color:#fecaca;color:#b91c1c}' +
    '.tawk-toolbar{background:#fff!important;background-image:none!important;box-shadow:none!important;border-bottom:1px solid #e4e4e7!important;padding:10px 14px!important}' +
    '.tawk-toolbar,.tawk-toolbar *{color:#18181b!important}.tawk-toolbar button.tawk-header-text svg,.tawk-toolbar button.tawk-header-text svg *{fill:#18181b!important}.tawk-button.tawk-custom-color{color:#111!important}' +
    '.tawk-toolbar-title,.tawk-toolbar-agent-name{font-weight:600!important;font-size:15px!important;line-height:1.3!important}' +
    '.tawk-toolbar-agent-avatars,.tawk-toolbar-agent-name,.tawk-toolbar button[aria-label="Minimize"]{display:none!important}' +
    '.tawk-toolbar-title{font-weight:600!important;font-size:15px!important;line-height:1.3!important}' +
    '.tawk-route-back:not(:has(.tawk-toolbar-title))::after{content:"";display:block!important;flex:none;width:36px;height:36px;margin-left:6px;border-radius:50%;background:#fff url(' + ICON + ') center/22px no-repeat;box-shadow:0 0 0 1px #e4e4e7}' +
    '.tawk-toolbar-nav:has(.tawk-route-back):not(:has(.tawk-toolbar-title)){display:grid!important;grid-template-columns:auto 1fr;grid-template-rows:auto auto;align-items:center;column-gap:10px}' +
    '.tawk-toolbar-nav:has(.tawk-route-back):not(:has(.tawk-toolbar-title)) .tawk-route-back{grid-row:1/3;margin:0!important;overflow:visible!important}' +
    '.tawk-toolbar-nav:has(.tawk-route-back):not(:has(.tawk-toolbar-title))::before{content:"Finrock team";grid-column:2;grid-row:1;align-self:end;font:600 15px/1.3 Inter,system-ui,sans-serif;color:#18181b;white-space:nowrap}' +
    '.tawk-toolbar-nav:has(.tawk-route-back):not(:has(.tawk-toolbar-title))::after{content:"Live chat with a person";grid-column:2;grid-row:2;align-self:start;font:400 12px/1.35 Inter,system-ui,sans-serif;color:#71717a;white-space:nowrap}' +
    '.tawk-max-container:has(.tawk-route-back):not(:has(.tawk-toolbar-title)):not(:has(.tawk-message-block)) .tawk-max-content>.tawk-router-view{position:relative}' +
    '.tawk-max-container:has(.tawk-route-back):not(:has(.tawk-toolbar-title)):not(:has(.tawk-message-block)) .tawk-max-content>.tawk-router-view::before{content:"Hi! I\\2019m the Finrock AI assistant. Ask me anything about using Finrock: banking, tax, invoices, bills or your account.";display:block!important;position:absolute;z-index:2;left:50px;top:78px;max-width:calc(100% - 96px);padding:9px 13px;background:#fff;border:1px solid #e4e4e7;border-radius:16px 16px 16px 4px;font:400 14px/1.5 Inter,system-ui,sans-serif;color:#18181b;box-shadow:0 1px 2px rgba(24,24,27,.04);animation:frm .22s ease both}' +
    '.tawk-max-container:has(.tawk-route-back):not(:has(.tawk-toolbar-title)):not(:has(.tawk-message-block)) .tawk-max-content>.tawk-router-view::after{content:"";display:block!important;position:absolute;z-index:2;left:14px;top:78px;width:28px;height:28px;border-radius:50%;background:#fff url(' + ICON + ') center/60% no-repeat;box-shadow:0 0 0 1px #e4e4e7}' +
    '.tawk-toolbar .tawk-margin-auto-left{display:none!important}' +
    '.tawk-footer .tawk-chatinput-action-buttons,.tawk-footer .tawk-chatinput-button{display:none!important}' +
    '.tawk-footer .tawk-chatinput{padding:6px 6px 6px 14px!important;border-radius:14px!important}' +
    '.tawk-footer .tawk-chatinput-wrap{display:flex!important;flex-wrap:nowrap!important;align-items:center!important;gap:8px}' +
    '.tawk-footer .tawk-chatinput-editor{flex:1;margin:0!important;min-height:34px!important;height:34px;box-sizing:border-box!important;padding:6px 0!important;font-size:14.5px!important;line-height:1.45!important}' +
    '.fr-send{flex:none;display:grid;place-items:center;width:34px;height:34px;border:0;border-radius:10px;background:#F6921A;color:#111;cursor:pointer;padding:0;transition:transform .15s}.fr-send:hover{transform:translateY(-1px)}' +
    '.fr-note{margin:8px 0 0;text-align:center;font:400 12px/1.4 Inter,system-ui,sans-serif;color:#71717a}.fr-note a,.fr-more a{color:#b45309;text-decoration:underline;cursor:pointer}' +
    '.fr-more{margin:-2px 0 6px 46px;font:400 12.5px/1.4 Inter,system-ui,sans-serif}' +
    'html body .tawk-overlay,html body .tawk-router-view,html body .tawk-main-panel,html body .tawk-chat-panel.tawk-chat-panel.tawk-chat-panel.tawk-chat-panel{background:#f4f4f6!important}' +
    '.tawk-home-view,.tawk-home-view~.tawk-bottom-navbar{visibility:hidden!important}' +
    '.tawk-agent-chat-bubble{background:#fff!important;color:#18181b!important;border:1px solid #e4e4e7!important;border-radius:16px 16px 16px 4px!important;padding:9px 13px!important}.tawk-agent-chat-bubble *{color:#18181b!important}.tawk-agent-chat-bubble a{color:#b45309!important}' +
    '.tawk-visitor-chat-bubble{background:#F6921A!important;color:#111!important;border-radius:16px 16px 4px 16px!important;padding:9px 13px!important}.tawk-visitor-chat-bubble *{color:#111!important}' +
    '.tawk-chat-name-margin{font-size:12px!important;color:#71717a!important}' +
    '.tawk-message-profile .tawk-avatar-image{background:#fff url(' + ICON + ') center/60% no-repeat!important;border-radius:50%!important;box-shadow:0 0 0 1px #e4e4e7}.tawk-message-profile img{opacity:0!important}' +
    '.tawk-footer{background:#f4f4f6!important;box-shadow:none!important}.tawk-footer .tawk-chatinput{background:#fff!important;border-radius:14px!important;box-shadow:0 0 0 1px #e4e4e7,0 1px 2px rgba(24,24,27,.04)!important;padding:6px 10px!important}' +
    '.tawk-footer .tawk-chatinput.tawk-chatinput-focused{box-shadow:0 0 0 1px #F6921A,0 0 0 4px rgba(246,146,26,.16)!important}.tawk-chatinput-editor{background:transparent!important;font-size:14px!important;color:#18181b!important}.tawk-chatinput-editor::placeholder{color:#a1a1aa!important}' +
    'body,body *:not([class*="icon"]){font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif!important;-webkit-font-smoothing:antialiased}' +
    '.tawk-agent-chat-bubble,.tawk-visitor-chat-bubble{font-size:14px!important;line-height:1.5!important}.tawk-agent-chat-bubble{box-shadow:0 1px 2px rgba(24,24,27,.04)!important}.tawk-chat-name-margin{font-weight:500!important}' +
    '.tawk-message-block{animation:frm .22s ease both}@keyframes frm{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.tawk-message-block{animation:none}}' +
    '@media(hover:none) and (pointer:coarse){.tawk-footer .tawk-chatinput-editor{font-size:16px!important;line-height:1.35!important}}' +
    /* On a phone (fr-phone, set by the page) the chat fills the screen, so its bar is one line: back, a small mark, the
       name, End chat and a close, each 44px to tap. While typing (fr-kb) the email note goes and tawk.to's credit, which
       stays, shrinks, so the room above the box is messages. */
    '.fr-x{display:none}.fr-phone .tawk-toolbar{padding:4px 2px!important;min-height:52px;box-sizing:border-box}.fr-phone .tawk-toolbar:has(.fr-end){padding-right:142px!important}' +
    '.fr-phone .tawk-toolbar-nav:has(.tawk-route-back):not(:has(.tawk-toolbar-title))::after{display:none!important}.fr-phone .tawk-toolbar-nav:has(.tawk-route-back):not(:has(.tawk-toolbar-title))::before{grid-row:1/3;align-self:center}' +
    '.fr-phone .tawk-route-back{display:flex!important;align-items:center}.fr-phone .tawk-route-back:not(:has(.tawk-toolbar-title))::after{width:28px;height:28px;margin-left:0;background-size:17px}.fr-phone .tawk-route-back button{min-width:44px;min-height:44px}' +
    '.fr-phone .tawk-toolbar .fr-end{right:46px;height:44px;padding:0 10px;border:0;background:none;color:#b91c1c!important;font-size:14px}' +
    '.fr-phone .fr-x{display:grid;place-items:center;position:absolute;right:2px;top:50%;transform:translateY(-50%);width:44px;height:44px;border:0;border-radius:10px;background:none;cursor:pointer;padding:0;z-index:2}' +
    '.fr-phone .tawk-main-panel .tawk-chat-panel .tawk-chat-panel-inner{padding-bottom:8px!important}' +
    '.fr-phone.fr-kb .fr-note{display:none}.fr-phone.fr-kb .tawk-padding-small:has(a[href*="tawk.to"]){padding:0 0 2px!important;opacity:.55}' +
    '.fr-phone.fr-kb .tawk-padding-small:has(a[href*="tawk.to"]) *{font-size:10px!important;line-height:1.2!important;color:#a1a1aa!important}.fr-phone.fr-kb .tawk-padding-small:has(a[href*="tawk.to"]) img{width:10px!important;height:auto!important}';
  function skin(f) {
    var d; try { d = f.contentDocument; } catch (e) { return; }
    if (!d || !d.head || !d.body || d.getElementById('fr-skin')) return;
    var ln = d.createElement('link'); ln.rel = 'stylesheet'; ln.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'; d.head.appendChild(ln);
    var st = d.createElement('style'); st.id = 'fr-skin'; st.textContent = SKIN; d.head.appendChild(st);
    /* The greeting in an empty chat is the home message set in Tawk, read from Tawk's own Home screen. */
    var busy = 0, greet = '', gs = d.createElement('style'); d.head.appendChild(gs);
    function name() {
      busy = 0;
      var ci = [].filter.call(d.querySelectorAll('.tawk-footer .tawk-chatinput'), function (x) { return x.offsetWidth; })[0], nt = d.querySelector('.fr-note');
      var wr = ci && ci.querySelector('.tawk-chatinput-wrap');
      var tx = wr && wr.querySelector('textarea'); if (tx && tx.placeholder !== 'Message the Finrock team…') tx.placeholder = 'Message the Finrock team…';
      if (wr && !wr.querySelector('.fr-send')) {
        var sb = d.createElement('button'); sb.type = 'button'; sb.className = 'fr-send'; sb.setAttribute('aria-label', 'Send');
        sb.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
        sb.addEventListener('click', function () { var ta = wr.querySelector('textarea'); if (!ta || !ta.value.trim()) { if (ta) ta.focus({ preventScroll: true }); return; } ta.focus({ preventScroll: true }); var w = d.defaultView, o = { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }; ta.dispatchEvent(new w.KeyboardEvent('keydown', o)); ta.dispatchEvent(new w.KeyboardEvent('keypress', o)); });
        wr.appendChild(sb);
      }
      if (ci && (!nt || nt.previousSibling !== ci)) { if (!nt) { nt = d.createElement('p'); nt.className = 'fr-note'; nt.innerHTML = 'Prefer email? <a class="fr-sup" href="#">Contact support</a>'; } ci.parentNode.insertBefore(nt, ci.nextSibling); }
      var oldMore = d.querySelector('.fr-more'); if (oldMore) oldMore.parentNode.removeChild(oldMore);
      /* What the visitor asked the assistant comes with them, above the live chat, so it reads as one conversation. */
      var carry = []; try { carry = AI ? JSON.parse(sessionStorage.getItem('fr-carry') || '[]') : []; } catch (e) {}
      if (carry.length) {
        var box = [].filter.call(d.querySelectorAll('.tawk-chat-message-container'), function (x) { return x.offsetWidth; })[0]
          || [].filter.call(d.querySelectorAll('.tawk-max-content>.tawk-router-view'), function (x) { return x.offsetWidth && !x.querySelector('.tawk-main-panel'); })[0];
        [].forEach.call(d.querySelectorAll('.fr-carry'), function (x) { if (!box || x.parentNode !== box) x.parentNode.removeChild(x); });
        if (box && !box.querySelector(':scope > .fr-carry')) {
          var cv = d.createElement('div'); cv.className = 'fr-carry';
          cv.innerHTML = '<p class="fr-carry-lbl">Your conversation with the assistant</p>' + carry.map(function (m) {
            return '<div class="fr-carry-m ' + (m.role === 'user' ? 'u' : 'b') + '">' + (m.role === 'user' ? txt(m.content) : fmt(m.content)) + '</div>';
          }).join('') + '<p class="fr-carry-sep"><span>You’re through to the Finrock team</span></p>';
          box.insertBefore(cv, box.firstChild);
        }
      }
      /* Tawk's own menu, which held End chat, is hidden, so the chat carries its own End chat beside the title. */
      var bar = [].filter.call(d.querySelectorAll('.tawk-toolbar'), function (x) { return x.offsetWidth; })[0];
      if (bar && !bar.querySelector('.fr-end')) {
        var eb = d.createElement('button'); eb.type = 'button'; eb.className = 'fr-end'; eb.textContent = 'End chat';
        eb.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); endLive(); });
        bar.appendChild(eb);
        var xb = d.createElement('button'); xb.type = 'button'; xb.className = 'fr-x'; xb.setAttribute('aria-label', 'Close');
        xb.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
        xb.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); closeLive(); });
        bar.appendChild(xb);
      }
      var hm = d.querySelectorAll('.tawk-home-view .tawk-header-text'), g = 'You’re through to the Finrock team. Send your message and we’ll reply here';
      if (g && g !== greet) { greet = g; gs.textContent = '.tawk-max-container:has(.tawk-route-back):not(:has(.tawk-toolbar-title)):not(:has(.tawk-message-block)) .tawk-max-content>.tawk-router-view::before{content:' + JSON.stringify('Hi! ' + g) + '!important}'; } var w = d.createTreeWalker(d.body, 4, null), n;
      while ((n = w.nextNode())) {
        var v = n.nodeValue && n.nodeValue.trim();
        if (v === 'Customer Support') n.nodeValue = 'Finrock team';
        else if (v === 'New messages' && n.parentElement && !n.parentElement.style.fontSize) n.parentElement.style.cssText += ';background:#f4f4f6;color:#71717a;font-size:12px;padding:0 0 0 8px';
      }
    }
    name(); f.__frName = function () { if (!busy) name(); };
    d.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.fr-sup')) { e.preventDefault(); e.stopPropagation(); f.style.setProperty('visibility', 'hidden', 'important'); showPanel(); if (panel && panel.__support) panel.__support('home'); if (T && T.minimize) T.minimize(); return; }
      var b = e.target.closest && e.target.closest('.tawk-route-back button, .tawk-route-back');
      if (!b) return;
      e.preventDefault(); e.stopPropagation();
      f.style.setProperty('visibility', 'hidden', 'important'); showPanel(); if (T && T.minimize) T.minimize();
    }, true);
    try { new MutationObserver(function () { if (!busy) busy = setTimeout(name, 60); }).observe(d.body, { childList: true, subtree: true, characterData: true }); } catch (e) {}
  }
  var swapReady = 0, swapping = false, fitting = 0, wantChat = false, homeTicks = 0, clickAt = 0, chatAt = 0, wantAt = 0, closedAt = 0, endedAt = 0;
  /* On a phone the chat fills the screen, and the screen is the visual viewport: a keyboard shrinks only that, leaving
     the page and anything fixed to its bottom full height behind the keys, and the browser pans to the focused box. So
     the chat is laid over exactly what is seen, read from window.visualViewport at most once a frame. */
  var VV = window.visualViewport, vvTop = 0, vvH = 0, kbOn = false, vvAsk = 0;
  function vvRead() {
    vvAsk = 0;
    var t = 0, h = 0, kb = false;
    if (VV && window.innerWidth < 760 && VV.scale < 1.05) { t = Math.round(VV.offsetTop); h = Math.round(VV.height); kb = document.documentElement.clientHeight - VV.height > 120; }
    if (t === vvTop && h === vvH && kb === kbOn) return;
    vvTop = t; vvH = h; kbOn = kb;
    if (h) { root.style.setProperty('--fr-vt', t + 'px'); root.style.setProperty('--fr-vh', h + 'px'); }
    else { root.style.removeProperty('--fr-vt'); root.style.removeProperty('--fr-vh'); }
    root.classList.toggle('fr-kb', kb);
    fit();
  }
  function vvLater() { if (!vvAsk) vvAsk = requestAnimationFrame(vvRead); }
  if (VV) { VV.addEventListener('resize', vvLater); VV.addEventListener('scroll', vvLater); }
  window.addEventListener('resize', vvLater); vvLater();
  /* A chat filling a phone's screen holds the page still behind it, so a swipe that reaches the end of the messages
     does not scroll the site; the page comes back where it was when the chat closes. */
  var lockY = null;
  function lockSync() {
    var want = window.innerWidth < 760 && root.classList.contains('chat-open');
    if (want === (lockY !== null) || !document.body) return;
    var b = document.body.style;
    if (want) { lockY = window.scrollY; b.position = 'fixed'; b.top = -lockY + 'px'; b.left = '0'; b.right = '0'; b.width = '100%'; return; }
    var y = lockY; lockY = null; b.position = b.top = b.left = b.right = b.width = '';
    try { window.scrollTo({ top: y, left: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, y); }
  }
  try { new MutationObserver(lockSync).observe(root, { attributes: true, attributeFilter: ['class'] }); } catch (e) {}
  window.addEventListener('resize', lockSync);
  /* A frame made shorter keeps its scroll position, which leaves the newest message under the keyboard with Tawk's
     jump-to-latest arrow over it; this is the message list, so one that was at its end can be kept there. */
  function endOf(d) {
    var m = d.querySelectorAll('.tawk-message-block'), e = m.length ? m[m.length - 1] : d.querySelector('.tawk-chat-message-container');
    for (; e && e !== d.body; e = e.parentElement) { var o = d.defaultView.getComputedStyle(e).overflowY; if (o === 'auto' || o === 'scroll') return e; }
    return null;
  }
  function fit() {
    if (!root.classList.contains('chat-open') || (panelOpen() && !swapping)) return;
    var vh = window.innerHeight, wide = window.innerWidth >= 760;
    [].slice.call(document.querySelectorAll('iframe[title="Chat widget"]')).forEach(function (f) {
      var r = f.getBoundingClientRect(); if (!r.width || !r.height) return;
      if (r.width <= 100 && r.height <= 100) { f.classList.add('fr-tawk-min'); return; }
      f.classList.remove('fr-tawk-min');
      if (r.height <= 200) return;
      skin(f); if (f.__frName && ((fit.n = (fit.n || 0) + 1) % 6 === 0)) f.__frName();
      /* The window sits exactly where the panel was, so the two read as one widget. */
      var P = function (k, v) { if (f.style.getPropertyValue(k) !== v) f.style.setProperty(k, v, 'important'); };
      var room = wide ? 84 : 74, side = wide ? 18 : 14, h = Math.max(240, Math.min(640, vh - room - (wide ? 20 : 16)));
      /* On a phone the window fills what is seen, edge to edge, with the keyboard up or down. */
      if (!wide) h = vvH || window.innerHeight;
      var sc = null, atEnd = false;
      if (f.style.getPropertyValue('height') !== h + 'px') { try { sc = endOf(f.contentDocument); } catch (e) {} atEnd = !!sc && sc.scrollHeight - sc.scrollTop - sc.clientHeight < 80; }
      P('height', h + 'px'); P('max-height', h + 'px'); P('min-height', '0px');
      if (wide) { P('top', 'auto'); P('bottom', room + 'px'); P('right', side + 'px'); P('left', 'auto'); P('width', '384px'); P('min-width', '0px'); P('max-width', 'calc(100vw - 36px)'); }
      /* A frame given width:auto falls back to the browser's narrow default, so on a phone it is told the screen's width. */
      else { P('top', vvTop + 'px'); P('bottom', 'auto'); P('right', '0px'); P('left', '0px'); P('width', document.documentElement.clientWidth + 'px'); P('min-width', '0px'); P('max-width', 'none'); }
      if (atEnd) requestAnimationFrame(function () { sc.scrollTop = sc.scrollHeight; });
      /* The frame's own page cannot tell a phone from the desktop window, both narrow, so it is told. */
      try { var de = f.contentDocument.documentElement; if (de.classList.contains('fr-phone') === wide) de.classList.toggle('fr-phone', !wide); if (de.classList.contains('fr-kb') !== (!wide && kbOn)) de.classList.toggle('fr-kb', !wide && kbOn); } catch (e) {}
      /* Hidden until Tawk has drawn the chat, so reopening never shows an empty window. */
      if (!swapping && f.style.getPropertyValue('visibility') === 'hidden') { var dd; try { dd = f.contentDocument; } catch (e) {} var rb = dd && dd.querySelector('.tawk-route-back'); if (!dd || (rb && rb.offsetWidth) || Date.now() - clickAt2 > 2500) f.style.setProperty('visibility', 'visible', 'important'); }
      P('border-radius', wide ? '18px' : '0px'); P('box-shadow', wide ? '0 16px 48px rgba(0,0,0,.24)' : 'none');
      /* Tawk's own Home screen repeats our panel. Coming from Start conversation it is skipped; going back to it shows the panel. */
      var d; try { d = f.contentDocument; } catch (e) { return; }
      if (!d) return;
      var on = function (q) { var e = d.querySelector(q); return !!(e && e.offsetWidth); };
      var now = Date.now();
      /* A back arrow means a chat or Tawk's list of past chats is showing, not its Home. */
      if (on('.tawk-chat-view') || on('.tawk-route-back')) {
        /* The chat is drawn: it is given a moment to settle, dressed, and then the panel and the window cross-fade, so the
           visitor sees one window change rather than two swap. */
        if (swapping) {
          if (!swapReady) swapReady = now;
          if (now - swapReady < 150) return;
          swapping = false; swapReady = 0; if (f.__frName) f.__frName();
          /* The panel sits above Tawk's window, so the window settles unseen beneath it and the panel fades away from on
             top. Its opening animation holds its opacity, so that is lifted first. */
          f.style.setProperty('visibility', 'visible', 'important');
          if (panel) { panel.style.animation = 'none'; void panel.offsetWidth; panel.style.transition = 'opacity .24s ease'; panel.style.opacity = '0'; }
          setTimeout(function () { hidePanel(true); if (panel) { panel.style.transition = ''; panel.style.opacity = ''; panel.style.animation = ''; } }, 260);
        }
        wantChat = false; wantAt = 0; homeTicks = 0; chatAt = now; return;
      }
      if (!on('.tawk-home-view')) { homeTicks = 0; return; }
      if (wantChat) {
        /* After a chat has ended Tawk's Home has no chat card, so its Start New Chat is pressed; failing that, its Messages tab. */
        var c = d.querySelector('.tawk-home-card-chat') || [].filter.call(d.querySelectorAll('button'), function (x) { return /start new chat/i.test(x.textContent); })[0], nav = d.querySelector('.tawk-bottom-navbar');
        if (!c && nav && nav.lastElementChild) c = nav.lastElementChild.querySelector('button,[role="button"]') || nav.lastElementChild;
        if (!wantAt) wantAt = now; else if (now - wantAt > 5000) { wantChat = false; wantAt = 0; return; }
        if (c && now - clickAt > 1500) { clickAt = now; c.click(); }
        return;
      }
      /* Tawk shows Home for a moment while it changes screens, so it has to stay there before it counts as going back. */
      if (++homeTicks >= 2 && now - chatAt > 600) { homeTicks = 0; showPanel(); if (T && T.minimize) T.minimize(); }
    });
  }
  /* A chat left open carries on to the next page of the visit: the visitor asked for it once already. */
  function keep(on) { try { if (on) sessionStorage.setItem('fr-chat-on', '1'); else sessionStorage.removeItem('fr-chat-on'); } catch (e) {} }
  function opened() { keep(true); if (AI) try { sessionStorage.setItem('fr-live', '1'); } catch (e) {} root.classList.add('chat-open'); btn.classList.remove('new'); btn.setAttribute('aria-label', 'Close chat'); fit(); if (!fitting) fitting = setInterval(fit, 50); }
  function closed() { keep(false); try { sessionStorage.removeItem('fr-live'); } catch (e) {} closedAt = Date.now(); if (!panelOpen()) { root.classList.remove('chat-open'); btn.setAttribute('aria-label', 'Ask Finrock'); } if (fitting) { clearInterval(fitting); fitting = 0; } }
  function load(open) {
    if (open) wantOpen = true;
    if (loaded) { if (open) openChat(); return; }
    loaded = true; if (open) btn.classList.add('busy');
    T = window.Tawk_API = window.Tawk_API || {}; window.Tawk_LoadStart = new Date();
    T.onBeforeLoad = function () { if (!wantOpen && T.hideWidget) T.hideWidget(); };
    /* Tawk reopens a chat that was open on the last page without calling onChatMaximized, so the state is read, twice more after load. */
    function sync() { if (T.isChatMaximized && T.isChatMaximized() && !root.classList.contains('chat-open')) { if (T.showWidget) T.showWidget(); opened(); } }
    T.onLoad = function () {
      btn.classList.remove('busy');
      if (wantOpen) openChat();
      else if (AI) { if (T.isChatMaximized && T.isChatMaximized() && T.minimize) T.minimize(); if (T.hideWidget) T.hideWidget(); return; }
      else if (T.isChatMaximized && T.isChatMaximized()) sync(); else if (T.hideWidget) T.hideWidget();
      setTimeout(sync, 800); setTimeout(sync, 2500);
    };
    T.onChatMaximized = function () { if (AI && !wantOpen) { if (T.minimize) T.minimize(); return; } opened(); };
    /* Tawk minimises itself as a chat ends, so a chat ended by the visitor is told from one that timed out by how recently the window closed. */
    T.onChatEnded = function () { if (panelOpen() || Date.now() - endedAt < 5000) return; if (root.classList.contains('chat-open') || Date.now() - closedAt < 2000) { wantChat = false; if (T.minimize) T.minimize(); if (AI) { if (!panel) build(); panel.__ended(); } else showPanel(); } };
    T.onChatMinimized = function () { closed(); if (T.hideWidget) T.hideWidget(); };
    T.onChatMessageAgent = function () { if (!root.classList.contains('chat-open')) btn.classList.add('new'); };
    /* The look goes on the moment Tawk's frame exists, before it has drawn anything. */
    var early = setInterval(function () { [].forEach.call(document.querySelectorAll('iframe[title="Chat widget"]'), skin); }, 40); setTimeout(function () { clearInterval(early); }, 20000);
    var s = document.createElement('script'); s.async = true; s.src = 'https://embed.tawk.to/' + PROPERTY + '/' + WIDGET;
    s.charset = 'UTF-8'; s.setAttribute('crossorigin', '*'); document.head.appendChild(s);
  }
  function allowed() { try { var c = JSON.parse(localStorage.getItem('fr-consent') || 'null'); return !!(c && (c.analytics || c.ads || c.all)); } catch (e) { return false; } }
  var again = false; try { again = sessionStorage.getItem('fr-chat-on') === '1'; } catch (e) {}
  /* Our own assistant needs nothing loaded: a conversation open on the last page is shown again as it was. */
  var liveOn = false; try { liveOn = sessionStorage.getItem('fr-live') === '1'; } catch (e) {}
  if (AI && liveOn) { wantChat = true; load(true); }
  else if (AI) { if (again) { var reopen = function () { showPanel(); panel.__chat(false); }; if (document.body) reopen(); else document.addEventListener('DOMContentLoaded', reopen); } }
  else if (again) { wantChat = true; load(true); } else if (allowed()) load(false);
  window.addEventListener('fr-consent', function () { if (!AI && allowed()) load(false); });
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-chat]'); if (!b) return; e.preventDefault();
    if (b === btn) { if (panelOpen()) hidePanel(false); else if (root.classList.contains('chat-open')) { if (T && T.minimize) T.minimize(); } else { showPanel.anim = true; showPanel(); } return; }
    if (AI && !b.hasAttribute('data-live')) { if (!panelOpen()) showPanel(); panel.__chat(true); return; }
    goLive();
  });
  /* The panel stays on top until Tawk has drawn the chat underneath it, then the two swap in one frame. */
  function goLive() {
    try { if (AI) sessionStorage.setItem('fr-carry', JSON.stringify(msgs.slice(-6))); } catch (e) {}
    swapping = true; setTimeout(function () { if (swapping) { swapping = false; hidePanel(true); } }, 4000);
    wantChat = true; wantAt = 0; load(true);
  }
})();

/* Films marked data-lazy load and play only when scrolled into view, and pause when out of it. */
(function () {
  var vids = document.querySelectorAll('video[data-lazy]'); if (!vids.length) return;
  if (!('IntersectionObserver' in window)) { vids.forEach(function (v) { v.setAttribute('controls', ''); }); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { var v = e.target; if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () { v.setAttribute('controls', ''); }); } else v.pause(); }); }, { threshold: 0.35 });
  vids.forEach(function (v) { io.observe(v); });
})();
