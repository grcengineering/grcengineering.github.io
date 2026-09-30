/* ============================================================
   GRC Engineering — SiteHeader (vanilla port, 2026-07-15)
   Scroll-aware header with TWO discrete states, morphing between them in a
   single seamless CSS transition once a scroll threshold is crossed
   (cocoindex.io model — NOT a continuous scroll-linked interpolation):

     • Docked (at the top of the page): a flush, full-bleed frosted bar. The
       translucent glass fill + backdrop blur are PRESENT here, with a bottom
       hairline rule and square corners.
     • Floating (scrolled past the threshold): a centered, contained glass
       pill — full pill corners, a detached gap from the top, a gradient
       hairline ring, and a soft drop shadow beneath it.

   Crossing the threshold toggles a single `.grc-siteheader--floating` class;
   every visual property (width, corner radius, gap, shadow, ring/rule
   opacity) carries a CSS `transition`, so the whole chrome animates fully and
   at once — no per-pixel seams, no step-by-step sync with the scroll wheel. A
   small hysteresis band keeps the toggle from flickering at the boundary.

   Ported from the DS React component (components/navigation/SiteHeader.jsx,
   project 73c32b48) — the React shell is replaced with a vanilla auto-mount
   controller (same shape as ds/node-graph.js). The component's auto-collapse
   behavior (measures the real layout against the floating pill width, and
   switches to a menu button whenever it wouldn't fit) is preserved so any
   future nav-link edit stays correct without touching a hardcoded breakpoint.

   Usage:
     <header class="grc-siteheader" data-grc-siteheader data-scroll-distance="24" data-contained-width="1180">
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
   data-* attributes: data-contained-width (1180 — the floating pill width;
   set noticeably wider than the page's content container so the pill reads as
   wider than the glass boxes below it), data-scroll-distance (24 — the
   threshold in px at which the header snaps to floating), data-gap (14),
   data-side (22), data-height (64), data-blur (14), data-radius (999),
   data-collapse-at (px, forces a fixed breakpoint instead of auto-measuring).
   ============================================================ */
(function () {
  "use strict";
  if (typeof document === "undefined") return;

  var CSS = "\n" +
".grc-siteheader {\n" +
"  position: fixed; top: 0; left: 0; right: 0; z-index: 50;\n" +
"  display: flex; justify-content: center;\n" +
"  padding: 0;\n" +      /* NEVER animated — layout-transitioning a fixed wrapper's padding re-lays-out
                            every frame under the backdrop-filter (visible micro-stutter on iOS) */
"  pointer-events: none;\n" +
"  font-family: var(--ui-family);\n" +
"}\n" +
/* The morph animates exactly three things on the bar itself:
     width         — explicit PX values set by JS (viewport px ⇄ pill px).
                     px→px interpolates in every engine. iOS Safari does NOT
                     reliably interpolate a `100%` ⇄ `min(px, calc(% - px))`
                     pair — the width SNAPS instead of gliding, which killed
                     the whole morph animation on iPhone. (And the earlier
                     6000px docked max-width sentinel interpolated invisibly
                     above the viewport for most of the transition — a late
                     \"kick\". Explicit px avoids both failure modes.)
     transform     — translateY(gap) for the detach. Compositor-only (cocoindex
                     does the same); no per-frame layout for the vertical motion.
     border-radius + box-shadow — paint-level.
   The ::after ring and __rule hairline cross-fade via opacity. */
".grc-siteheader__bar {\n" +
"  position: relative; pointer-events: auto; box-sizing: border-box;\n" +
"  width: 100%;\n" +
"  height: var(--grc-sh-h, 64px);\n" +
"  display: flex; justify-content: center;\n" +
"  border-radius: 0;\n" +
"  isolation: isolate;\n" +
"  transform: translateY(0);\n" +
"  box-shadow: 0 0 0 0 rgba(0,0,0,0);\n" +
"  transition:\n" +
"    width var(--grc-sh-dur, 320ms) var(--grc-sh-ease, cubic-bezier(0.2,0.8,0.2,1)),\n" +
"    transform var(--grc-sh-dur, 320ms) var(--grc-sh-ease, cubic-bezier(0.2,0.8,0.2,1)),\n" +
"    border-radius var(--grc-sh-dur, 320ms) var(--grc-sh-ease, cubic-bezier(0.2,0.8,0.2,1)),\n" +
"    box-shadow var(--grc-sh-dur, 320ms) var(--grc-sh-ease, cubic-bezier(0.2,0.8,0.2,1));\n" +
"}\n" +
/* NOTE: no width rule here — JS sets explicit px widths for BOTH states (see
   applyWidth) so the width transition is always px→px and actually animates
   on iOS Safari. */
".grc-siteheader--floating .grc-siteheader__bar {\n" +
"  transform: translateY(var(--grc-sh-gap, 14px));\n" +
"  border-radius: var(--grc-sh-radius, 999px);\n" +
"  box-shadow: var(--shadow-xl);\n" +
"}\n" +
".grc-siteheader__bar::before {\n" +
"  content: \"\"; position: absolute; inset: 0; border-radius: inherit;\n" +
"  background: var(--glass-fill-strong);\n" +
"  -webkit-backdrop-filter: blur(var(--grc-sh-blur, 14px)) saturate(1.3);\n" +
"          backdrop-filter: blur(var(--grc-sh-blur, 14px)) saturate(1.3);\n" +
"  box-shadow: var(--glass-highlight);\n" +
"  pointer-events: none; z-index: 0;\n" +
"}\n" +
"@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {\n" +
"  .grc-siteheader__bar::before { background: var(--surface-card); }\n" +
"}\n" +
".grc-siteheader__bar::after {\n" +
"  content: \"\"; position: absolute; inset: 0; border-radius: inherit;\n" +
"  padding: 1px; background: var(--glass-border);\n" +
"  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);\n" +
"  -webkit-mask-composite: xor; mask-composite: exclude;\n" +
"  opacity: 0; pointer-events: none; z-index: 1;\n" +
"  transition: opacity var(--grc-sh-dur, 320ms) var(--grc-sh-ease, cubic-bezier(0.2,0.8,0.2,1));\n" +
"}\n" +
".grc-siteheader--floating .grc-siteheader__bar::after { opacity: 1; }\n" +
".grc-siteheader__rule {\n" +
"  position: absolute; left: 0; right: 0; bottom: 0; height: 1px;\n" +
"  background: var(--border-default); opacity: 1;\n" +
"  pointer-events: none; z-index: 1;\n" +
"  transition: opacity var(--grc-sh-dur, 320ms) var(--grc-sh-ease, cubic-bezier(0.2,0.8,0.2,1));\n" +
"}\n" +
".grc-siteheader--floating .grc-siteheader__rule { opacity: 0; }\n" +
".grc-siteheader__inner {\n" +
"  position: relative; z-index: 2; width: 100%;\n" +
"  max-width: var(--grc-sh-contained, 1180px); height: 100%;\n" +
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
".grc-siteheader[data-measuring=\"1\"] .grc-siteheader__bar { transition: none !important; }\n" +
"@media (prefers-reduced-motion: reduce) {\n" +
"  .grc-siteheader, .grc-siteheader__bar, .grc-siteheader__bar::after, .grc-siteheader__rule { transition: none; }\n" +
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

  function mountOne(wrap) {
    if (wrap.__grcSiteHeader) return;
    var bar = wrap.querySelector(".grc-siteheader__bar");
    var inner = wrap.querySelector(".grc-siteheader__inner");
    var nav = wrap.querySelector(".grc-siteheader__nav");
    var actions = wrap.querySelector(".grc-siteheader__actions");
    var menuBtn = wrap.querySelector(".grc-siteheader__menu-btn");
    if (!bar || !inner) return;

    var opts = {
      containedWidth: attrNum(wrap, "data-contained-width", 1180),
      scrollDistance: attrNum(wrap, "data-scroll-distance", 24),
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
    wrap.style.setProperty("--grc-sh-dur", "var(--dur-slow, 320ms)");
    wrap.style.setProperty("--grc-sh-ease", "var(--ease-out, cubic-bezier(0.2,0.8,0.2,1))");

    var compact = false, open = false, panel = null;
    // Threshold-triggered floating state. The threshold is SMALL (cocoindex
    // toggles at scrollY > 24): the morph belongs to "leaving the top", so one
    // scroll gesture produces exactly one morph. A large threshold (the old 88px)
    // sat right in the band where a reader's thumb hovers over the hero, firing
    // full lurching morphs in sync with every small scroll wiggle. A small
    // hysteresis band (exit below ~1/3 of enter) still guards against scroll
    // jitter parking exactly on the boundary.
    var floating = false, raf = 0;
    var enterAt = Math.max(1, opts.scrollDistance);
    var exitAt = Math.max(0, Math.min(opts.scrollDistance - 1, opts.scrollDistance * 0.34));

    // Explicit px widths for both states: iOS Safari does not reliably
    // interpolate a percentage ⇄ min()/calc() width pair (it snaps), and px→px
    // interpolates everywhere. JS owns the bar width; CSS owns everything else.
    function applyWidth() {
      var vw = wrap.getBoundingClientRect().width || document.documentElement.clientWidth || window.innerWidth;
      var w = floating ? Math.max(0, Math.min(opts.containedWidth, vw - 2 * opts.side)) : vw;
      bar.style.width = Math.round(w) + "px";
    }

    function applyScroll() {
      raf = 0;
      var y = window.scrollY || window.pageYOffset || 0;
      var next = floating ? (y > exitAt) : (y >= enterAt);
      if (next !== floating) {
        floating = next;
        wrap.classList.toggle("grc-siteheader--floating", floating);
        applyWidth();
      }
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
    applyWidth();
    measure();
    // WIDTH-GUARDED resize (the iOS transition-killer fix): iOS Safari fires a
    // resize event when the URL bar collapses — in the first few px of any
    // scroll, i.e. the SAME frame the 24px threshold crosses. Running measure()
    // there set data-measuring (whose CSS applies transition:none !important to
    // the bar) and forced a synchronous reflow while the freshly-toggled
    // floating geometry was pending — committing the whole morph WITHOUT its
    // transition: an instant snap on every mobile scroll-from-top. URL-bar
    // wobble only changes the viewport HEIGHT, so gate all resize work on a
    // real WIDTH change (same guard ds/node-graph.js uses for the same iOS
    // behavior). Rotation/desktop resizes still re-measure and re-fit.
    var lastVW = wrap.getBoundingClientRect().width || 0;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
      onScroll();
      var w = wrap.getBoundingClientRect().width || 0;
      if (Math.abs(w - lastVW) > 1) {
        lastVW = w;
        applyWidth();
        scheduleMeasure();
      }
    });

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
