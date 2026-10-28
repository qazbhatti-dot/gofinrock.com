(function () {
  document.documentElement.classList.add('js');
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
        if (trade && over) msg = '<b>Limited company</b> · <span class="num">£59.99</span>/mo — the company (accountant included) plus your personal MTD plan. Trade, lets, salary and life admin all in.';
        else if (trade) msg = '<b>Limited company</b> · <span class="num">£49.99</span>/mo — includes your personal plan. Your trade and lets are covered, nothing extra.';
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
  
  // hero cycle
  var cyc = document.querySelector('.cyc');
  if (cyc) {
    var imgs = cyc.querySelectorAll('.c .screen img'), chips = cyc.querySelectorAll('.chip'), dots = cyc.querySelectorAll('.dots button'), ci = 0, ct;
    var setC = function (i) { ci = i; imgs.forEach(function (x, j) { x.classList.toggle('on', j === i); }); chips.forEach(function (x) { x.classList.toggle('on', +x.dataset.i === i); }); dots.forEach(function (x, j) { x.setAttribute('aria-selected', j === i); }); };
    var tick = function () { ct = setTimeout(function () { setC((ci + 1) % imgs.length); tick(); }, 3600); };
    dots.forEach(function (d, j) { d.addEventListener('click', function () { clearTimeout(ct); setC(j); tick(); }); });
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
  var y = document.querySelector('[data-year]'); if (y) y.textContent = new Date().getFullYear();
})();
