/* ============================================================
   GRC Engineering — SiteHeader (vanilla port, 2026-07-15)
   Scroll-aware header: a flush, full-bleed bar at the top of the page that
   morphs — continuously, driven by scroll position — into a centered,
   floating glass pill. The chrome shrinks from edge-to-edge to a contained
   width, corners round to a full pill, it detaches from the top with a
   small gap, and a translucent frosted fill + backdrop blur + drop shadow +
   the brand's orange→blue gradient hairline fade in. The content row stays
   at a constant container width so the logo/links never jump.

   Ported verbatim from the DS React component
   (components/navigation/SiteHeader.jsx, project 73c32b48) — CSS and scroll
   math unchanged; only the React shell is replaced with a vanilla auto-mount
   controller (same shape as ds/node-graph.js). The component's auto-collapse
   behavior (measures the real layout against the floating pill width, and
   switches to a menu button whenever it wouldn't fit) is preserved so any
   future nav-link edit stays correct without touching a hardcoded breakpoint.

   Usage:
     <header class="grc-siteheader" data-grc-siteheader data-scroll-distance="88">
       <div class="grc-siteheader__bar">
         <div class="grc-siteheader__rule"></div>
         <div class="grc-siteheader__inner">
           <a class="grc-siteheader__brand" href="#top">…brand mark…</a>
           <nav class="grc-siteheader__nav" aria-label="Primary">…links…</nav>
           <div class="grc-siteheader__actions">…actions…</div>
           <button type="button" class="grc-siteheader__menu-btn" aria-label="Open menu" aria-expanded="false"></button>
         </div>
       </div>
     </header>
   Auto-mounts every [data-grc-siteheader] on DOMContentLoaded. Options via
   data-* attributes: data-contained-width (1120), data-scroll-distance (88),
   data-gap (14), data-side (22), data-height (64), data-blur (14),
   data-radius (999), data-collapse-at (px, forces a fixed breakpoint instead
   of auto-measuring).
   ============================================================ */
(function () {
  "use strict";
  if (typeof document === "undefined") return;

  var CSS = "\n" +
".grc-siteheader {\n" +
"  position: fixed; top: 0; left: 0; right: 0; z-index: 50;\n" +
"  display: flex; justify-content: center;\n" +
"  --p: 0;\n" +
"  padding-top: calc(var(--p) * var(--grc-sh-gap, 14px));\n" +
"  padding-left: calc(var(--p) * var(--grc-sh-side, 22px));\n" +
"  padding-right: calc(var(--p) * var(--grc-sh-side, 22px));\n" +
"  pointer-events: none;\n" +
"  font-family: var(--ui-family);\n" +
"}\n" +
".grc-siteheader__bar {\n" +
"  position: relative; pointer-events: auto; box-sizing: border-box;\n" +
"  width: 100%;\n" +
"  height: var(--grc-sh-h, 64px);\n" +
"  display: flex; justify-content: center;\n" +
"  border-radius: calc(var(--p) * var(--grc-sh-radius, 999px));\n" +
"  isolation: isolate;\n" +
"}\n" +
".grc-siteheader__bar::before {\n" +
"  content: \"\"; position: absolute; inset: 0; border-radius: inherit;\n" +
"  background: var(--glass-fill-strong);\n" +
"  -webkit-backdrop-filter: blur(var(--grc-sh-blur, 14px)) saturate(1.3);\n" +
"          backdrop-filter: blur(var(--grc-sh-blur, 14px)) saturate(1.3);\n" +
"  box-shadow: var(--glass-highlight), var(--shadow-lg);\n" +
"  opacity: var(--p); pointer-events: none; z-index: 0;\n" +
"}\n" +
"@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {\n" +
"  .grc-siteheader__bar::before { background: var(--surface-card); }\n" +
"}\n" +
".grc-siteheader__bar::after {\n" +
"  content: \"\"; position: absolute; inset: 0; border-radius: inherit;\n" +
"  padding: 1px; background: var(--glass-border);\n" +
"  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);\n" +
"  -webkit-mask-composite: xor; mask-composite: exclude;\n" +
"  opacity: var(--p); pointer-events: none; z-index: 1;\n" +
"}\n" +
".grc-siteheader__rule {\n" +
"  position: absolute; left: 0; right: 0; bottom: 0; height: 1px;\n" +
"  background: var(--border-default); opacity: calc(1 - var(--p));\n" +
"  pointer-events: none; z-index: 1;\n" +
"}\n" +
".grc-siteheader__inner {\n" +
"  position: relative; z-index: 2; width: 100%;\n" +
"  max-width: var(--grc-sh-contained, 1120px); height: 100%;\n" +
"  display: flex; align-items: center; gap: var(--space-5);\n" +
"  padding: 0 var(--space-7);\n" +
"}\n" +
".grc-siteheader__brand { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; flex: none; }\n" +
".grc-siteheader__nav { display: flex; align-items: center; gap: 2px; margin-left: auto; }\n" +
".grc-siteheader__link {\n" +
"  font-family: var(--ui-family); font-size: var(--text-sm); font-weight: var(--fw-medium);\n" +
"  color: var(--text-body); text-decoration: none; cursor: pointer; white-space: nowrap;\n" +
"  padding: 8px 12px; border-radius: var(--radius-md);\n" +
"  transition: color var(--dur-fast) var(--ease-out), background-color var(--dur-fast) var(--ease-out);\n" +
"}\n" +
".grc-siteheader__link:hover { color: var(--text-strong); background: var(--surface-inset); }\n" +
".grc-siteheader__link--active { color: var(--text-strong); }\n" +
".grc-siteheader__link:focus-visible { outline: none; box-shadow: var(--focus-ring); border-radius: var(--radius-md); }\n" +
".grc-siteheader__actions { display: flex; align-items: center; gap: 10px; flex: none; }\n" +
".grc-siteheader__nav + .grc-siteheader__actions { margin-left: 0; }\n" +
".grc-siteheader__brand + .grc-siteheader__actions { margin-left: auto; }\n" +
".grc-siteheader__menu-btn {\n" +
"  display: none; align-items: center; justify-content: center;\n" +
"  width: 38px; height: 38px; margin-left: auto; flex: none;\n" +
"  background: transparent; border: 1px solid transparent; border-radius: var(--radius-md);\n" +
"  color: var(--text-body); cursor: pointer; transition: var(--transition-control);\n" +
"}\n" +
".grc-siteheader__menu-btn:hover { background: var(--surface-inset); color: var(--text-strong); }\n" +
".grc-siteheader__menu-btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }\n" +
".grc-siteheader__menu-btn > svg { width: 21px; height: 21px; }\n" +
".grc-siteheader__panel {\n" +
"  position: absolute; top: calc(100% + 10px); left: 0; right: 0; z-index: 4;\n" +
"  display: flex; flex-direction: column; gap: 2px; padding: 10px;\n" +
"  border-radius: var(--radius-xl); border: 1px solid var(--border-subtle);\n" +
"  background: var(--glass-fill-strong);\n" +
"  -webkit-backdrop-filter: blur(16px) saturate(1.3); backdrop-filter: blur(16px) saturate(1.3);\n" +
"  box-shadow: var(--glass-highlight), var(--shadow-xl);\n" +
"  transform-origin: top center; animation: grc-sh-pop var(--dur-fast) var(--ease-out);\n" +
"}\n" +
".grc-siteheader__panel .grc-siteheader__link { padding: 11px 12px; }\n" +
".grc-siteheader__panel-actions { display: flex; flex-wrap: wrap; gap: 10px; padding: 10px 4px 4px; margin-top: 4px; border-top: 1px solid var(--border-subtle); }\n" +
"@keyframes grc-sh-pop { from { transform: translateY(-7px) scale(0.99); } to { transform: translateY(0) scale(1); } }\n" +
".grc-siteheader--compact .grc-siteheader__nav { display: none; }\n" +
".grc-siteheader--compact .grc-siteheader__inner > .grc-siteheader__actions { display: none; }\n" +
".grc-siteheader--compact .grc-siteheader__menu-btn { display: inline-flex; }\n" +
".grc-siteheader[data-measuring=\"1\"] .grc-siteheader__nav { display: flex !important; flex: none !important; }\n" +
".grc-siteheader[data-measuring=\"1\"] .grc-siteheader__inner > .grc-siteheader__actions { display: flex !important; }\n" +
".grc-siteheader[data-measuring=\"1\"] .grc-siteheader__menu-btn { display: none !important; }\n" +
"@media (prefers-reduced-motion: reduce) {\n" +
"  .grc-siteheader__panel { animation: none; }\n" +
"}\n";
  if (!document.getElementById("grc-siteheader-css")) {
    var s = document.createElement("style"); s.id = "grc-siteheader-css"; s.textContent = CSS;
    document.head.appendChild(s);
  }

  var MenuSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>';
  var CloseSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

  function attrNum(el, name, fallback) {
    var v = el.getAttribute(name);
    if (v === null || v === "") return fallback;
    var n = parseFloat(v);
    return isFinite(n) ? n : fallback;
  }

  function smooth(t) { return t * t * (3 - 2 * t); }

  function mountOne(wrap) {
    if (wrap.__grcSiteHeader) return;
    var bar = wrap.querySelector(".grc-siteheader__bar");
    var inner = wrap.querySelector(".grc-siteheader__inner");
    var nav = wrap.querySelector(".grc-siteheader__nav");
    var actions = wrap.querySelector(".grc-siteheader__actions");
    var menuBtn = wrap.querySelector(".grc-siteheader__menu-btn");
    if (!bar || !inner) return;

    var opts = {
      containedWidth: attrNum(wrap, "data-contained-width", 1120),
      scrollDistance: attrNum(wrap, "data-scroll-distance", 88),
      gap: attrNum(wrap, "data-gap", 14),
      side: attrNum(wrap, "data-side", 22),
      height: attrNum(wrap, "data-height", 64),
      blur: attrNum(wrap, "data-blur", 14),
      radius: attrNum(wrap, "data-radius", 999),
      collapseAt: wrap.hasAttribute("data-collapse-at") ? attrNum(wrap, "data-collapse-at", NaN) : null,
    };
    wrap.style.setProperty("--grc-sh-contained", opts.containedWidth + "px");
    wrap.style.setProperty("--grc-sh-gap", opts.gap + "px");
    wrap.style.setProperty("--grc-sh-side", opts.side + "px");
    wrap.style.setProperty("--grc-sh-h", opts.height + "px");
    wrap.style.setProperty("--grc-sh-blur", opts.blur + "px");
    wrap.style.setProperty("--grc-sh-radius", opts.radius + "px");

    var compact = false, open = false, panel = null;
    var lastP = -1, lastW = -1, raf = 0;

    function applyScroll() {
      raf = 0;
      var y = window.scrollY || window.pageYOffset || 0;
      var p = opts.scrollDistance > 0 ? Math.min(Math.max(y / opts.scrollDistance, 0), 1) : (y > 0 ? 1 : 0);
      p = smooth(p);
      var vw = document.documentElement.clientWidth || window.innerWidth;
      var maxw = Math.round(vw + (opts.containedWidth - vw) * p);
      if (Math.abs(p - lastP) > 0.001) { wrap.style.setProperty("--p", p.toFixed(4)); lastP = p; }
      if (maxw !== lastW) { bar.style.maxWidth = maxw + "px"; lastW = maxw; }
    }
    function onScroll() { if (!raf) raf = requestAnimationFrame(applyScroll); }

    var measureRaf = 0;
    function measure() {
      measureRaf = 0;
      var vw = document.documentElement.clientWidth || window.innerWidth;
      var nextCompact;
      if (opts.collapseAt !== null && !isNaN(opts.collapseAt)) {
        nextCompact = vw <= opts.collapseAt;
      } else {
        var floatW = Math.max(0, Math.min(opts.containedWidth, vw - 2 * opts.side));
        wrap.setAttribute("data-measuring", "1");
        var prevMax = bar.style.maxWidth;
        bar.style.maxWidth = floatW + "px";
        var fits = inner.scrollWidth <= inner.clientWidth;
        bar.style.maxWidth = prevMax;
        wrap.removeAttribute("data-measuring");
        nextCompact = !fits;
      }
      if (nextCompact !== compact) {
        compact = nextCompact;
        wrap.classList.toggle("grc-siteheader--compact", compact);
        if (!compact) closePanel();
      }
    }
    function scheduleMeasure() { if (!measureRaf) measureRaf = requestAnimationFrame(measure); }

    function buildPanel() {
      var p = document.createElement("div");
      p.className = "grc-siteheader__panel";
      p.setAttribute("role", "menu");
      if (nav) {
        var navLinks = nav.querySelectorAll(".grc-siteheader__link");
        for (var i = 0; i < navLinks.length; i++) {
          var clone = navLinks[i].cloneNode(true);
          clone.addEventListener("click", closePanel);
          p.appendChild(clone);
        }
      }
      if (actions) {
        var actWrap = document.createElement("div");
        actWrap.className = "grc-siteheader__panel-actions";
        var actClone = actions.cloneNode(true);
        while (actClone.firstChild) actWrap.appendChild(actClone.firstChild);
        p.appendChild(actWrap);
      }
      return p;
    }
    function openPanel() {
      if (open || !compact) return;
      panel = buildPanel();
      bar.appendChild(panel);
      open = true;
      if (menuBtn) { menuBtn.innerHTML = CloseSVG; menuBtn.setAttribute("aria-expanded", "true"); menuBtn.setAttribute("aria-label", "Close menu"); }
      document.addEventListener("click", onOutsideClick, true);
      document.addEventListener("keydown", onKeydown);
    }
    function closePanel() {
      if (!open) return;
      if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
      panel = null;
      open = false;
      if (menuBtn) { menuBtn.innerHTML = MenuSVG; menuBtn.setAttribute("aria-expanded", "false"); menuBtn.setAttribute("aria-label", "Open menu"); }
      document.removeEventListener("click", onOutsideClick, true);
      document.removeEventListener("keydown", onKeydown);
    }
    function onOutsideClick(e) { if (panel && !panel.contains(e.target) && e.target !== menuBtn && !menuBtn.contains(e.target)) closePanel(); }
    function onKeydown(e) { if (e.key === "Escape") closePanel(); }

    if (menuBtn) {
      menuBtn.innerHTML = MenuSVG;
      menuBtn.addEventListener("click", function () { if (open) closePanel(); else openPanel(); });
    }

    applyScroll();
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () { onScroll(); scheduleMeasure(); });

    wrap.__grcSiteHeader = {
      destroy: function () {
        window.removeEventListener("scroll", onScroll);
        closePanel();
        if (raf) cancelAnimationFrame(raf);
        if (measureRaf) cancelAnimationFrame(measureRaf);
        delete wrap.__grcSiteHeader;
      }
    };
  }

  function mountAll() {
    var nodes = document.querySelectorAll("[data-grc-siteheader]");
    for (var i = 0; i < nodes.length; i++) mountOne(nodes[i]);
  }
  window.GRCSiteHeader = { mount: mountOne, mountAll: mountAll };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountAll);
  else mountAll();
})();
