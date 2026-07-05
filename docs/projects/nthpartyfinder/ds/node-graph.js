/* ============================================================
   GRC Engineering — NodeGraphBackground (vanilla port, 2026-07-05)
   The Nth Party Finder "web of spheres" backdrop: orange/blue (+accent)
   spheres in a slowly-orbiting 3D cloud, linked by lines — the nth-party
   supply-chain graph. Raw-WebGL "sphere impostors", instanced, NO three.js
   (paints on frame 1). 2D-sprite fallback where WebGL is absent.

   UPDATED ENGINE (pulled from the Claude Design canvas 2026-07-05):
     • ENERGY-PULSE CASCADE — bright red beads travel the links; each arrival
       flares its sphere red and floods onward through the graph, then the web
       rests ~5s and a new cascade seeds. Risk propagating through the party.
     • THEME-AWARE — dark (additive glow) and light (shadow-halo) rendering,
       plus data-bg / data-line-color overrides.

   Ported verbatim from the DS React component
   (components/backgrounds/NodeGraphBackground.jsx, project 73c32b48) — engine,
   shaders and math are unchanged; only the React shell is replaced with a
   vanilla auto-mount controller.

   Usage:
     <div class="grc-nodegraph" data-grc-nodegraph
          data-palette="spectrum" data-density="0.6" data-max-nodes="48"
          data-link-opacity="0.9" data-speed="1"></div>
   Auto-mounts every [data-grc-nodegraph] on DOMContentLoaded. A <canvas> child
   is created if absent. Options via data-* attributes:
     data-density, data-max-nodes, data-fps, data-dpr-cap, data-link-distance,
     data-link-opacity, data-palette, data-speed, data-theme ("dark"|"light"),
     data-bg, data-line-color, data-pulse ("false" disables), data-pulse-rate
   ============================================================ */
(function () {
  "use strict";
  if (typeof document === "undefined") return;

  var CSS = "\n.grc-nodegraph {\n  position: absolute; inset: 0; width: 100%; height: 100%;\n  display: block; pointer-events: none; z-index: 0;\n  background: transparent;\n}\n.grc-nodegraph__canvas { width: 100%; height: 100%; display: block; }\n";
  if (!document.getElementById("grc-nodegraph-css")) {
    const s = document.createElement("style"); s.id = "grc-nodegraph-css"; s.textContent = CSS;
    document.head.appendChild(s);
  }

  // rgb 0..1. Named hues; orange & blue lead, the rest accent.
  const HUES = {
    orange:     [1.00, 0.66, 0.31],
    orangeLit:  [1.00, 0.79, 0.52],
    orangeDeep: [0.85, 0.49, 0.18],
    blue:       [0.11, 0.58, 0.76],
    blueLit:    [0.36, 0.74, 0.88],
    blueDeep:   [0.06, 0.41, 0.58],
    purple:     [0.59, 0.47, 0.90],
    gray:       [0.59, 0.64, 0.70],
    red:        [0.88, 0.34, 0.36],
  };
  // Palettes the `palette` option selects from (sampled uniformly per sphere).
  const PALETTES = {
    spectrum:    [HUES.orange, HUES.orange, HUES.blue, HUES.blue, HUES.purple, HUES.gray, HUES.red],
    brand:       [HUES.orange, HUES.blue],
    legacy:      [HUES.orange, HUES.orangeLit, HUES.orangeDeep],
    engineering: [HUES.blue, HUES.blueLit, HUES.blueDeep],
  };
  function resolvePalette(name) { return PALETTES[name] || PALETTES.spectrum; }

  /* Depth-fog / recede color — spheres & links fade toward this as they get far —
     plus link-line colors, per theme. Light theme fades toward a pale slate and
     uses darker links so the web reads on a light surface. */
  const BG_DARK  = [0.039, 0.055, 0.086]; // #0A0E16-ish (dark)
  const BG_LIGHT = [0.960, 0.972, 0.984]; // ~slate-50 (light)
  const LINE_DARK  = [0.63, 0.71, 0.80];
  const LINE_LIGHT = [0.224, 0.271, 0.314]; // ~slate-700 — dark enough to read on a pale surface
  const PULSE_RGB  = [0.95, 0.16, 0.13];    // energy pulse + charge flash — bright "bad-signal" red
  // Parse "#rgb" | "#rrggbb" | "rgb(r,g,b)" → [r,g,b] in 0..1, else null.
  function parseRGB01(s) {
    if (!s || typeof s !== "string") return null;
    const hex = s.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hex) {
      let h = hex[1];
      if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
      return [parseInt(h.slice(0,2),16)/255, parseInt(h.slice(2,4),16)/255, parseInt(h.slice(4,6),16)/255];
    }
    const m = s.match(/rgba?\(([^)]+)\)/i);
    if (m) { const p = m[1].split(",").map(v => parseFloat(v)); if (p.length >= 3) return [p[0]/255, p[1]/255, p[2]/255]; }
    return null;
  }

  /* ---------- tiny column-major mat4 helpers ---------- */
  function mPerspective(fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    return [f / aspect,0,0,0, 0,f,0,0, 0,0,(far + near) * nf,-1, 0,0,2 * far * near * nf,0];
  }
  function mMul(a, b) {
    const o = new Array(16);
    for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
      o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    }
    return o;
  }
  function mTranslate(x, y, z) { return [1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1]; }
  function mRotY(a) { const c = Math.cos(a), s = Math.sin(a); return [c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]; }
  function mRotX(a) { const c = Math.cos(a), s = Math.sin(a); return [1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]; }

  function compile(gl, type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src); gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn("NodeGraphBackground shader:", gl.getShaderInfoLog(sh));
      gl.deleteShader(sh); return null;
    }
    return sh;
  }
  function program(gl, vs, fs) {
    const v = compile(gl, gl.VERTEX_SHADER, vs), f = compile(gl, gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return null;
    const p = gl.createProgram();
    gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(p)); return null; }
    return p;
  }

  const SPHERE_VS = `
attribute vec2 aCorner;     // quad corner -1..1
attribute vec3 aOffset;     // instance center (model space)
attribute float aRadius;    // instance radius (world)
attribute vec3 aColor;
attribute float aCharge;
uniform mat4 uMV, uProj;
uniform float uPad;
varying vec2 vCoord; varying vec3 vColor; varying float vViewZ; varying float vPhase; varying float vCharge;
void main(){
  vec4 vp = uMV * vec4(aOffset, 1.0);
  vp.xy += aCorner * aRadius * uPad;   // camera-facing billboard
  vViewZ = vp.z;
  vColor = aColor;
  vCharge = aCharge;
  vPhase = aOffset.x * 1.7 + aOffset.y * 2.3 + aOffset.z * 1.1;   // per-sphere glow phase
  vCoord = aCorner * uPad;
  gl_Position = uProj * vp;
}`;

  const SPHERE_FS = `
precision mediump float;
varying vec2 vCoord; varying vec3 vColor; varying float vViewZ; varying float vPhase; varying float vCharge;
uniform vec3 uBg; uniform float uFogNear, uFogFar;
uniform float uGlowPass, uTime, uGlowMax, uGlow, uHaloMode;
uniform vec3 uChargeCol;
void main(){
  float r2 = dot(vCoord, vCoord);
  float r = sqrt(r2);
  float fog = clamp((-vViewZ - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
  if (uGlowPass < 0.5) {
    // ---- solid sphere body ----
    if (r2 > 1.0) discard;                       // outside the disc → not this sphere
    float z = sqrt(1.0 - r2);
    vec3 n = vec3(vCoord, z);                     // analytic sphere normal
    vec3 L = normalize(vec3(-0.35, 0.45, 0.85));
    float diff = max(dot(n, L), 0.0);
    vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(n, H), 0.0), 22.0) * 0.22;   // subtle highlight
    vec3 col = vColor * (0.42 + 0.72 * diff) + spec;       // gentle shading
    col = mix(col, uBg, fog * 0.6);               // far spheres recede
    col += uChargeCol * vCharge * 0.7;            // an arriving pulse charges the sphere — it flares red
    col = mix(col, vec3(1.0), clamp(vCharge, 0.0, 1.0) * 0.10);   // brief hot core at peak charge
    float aa = smoothstep(1.0, 0.88, r2);         // antialiased rim
    gl_FragColor = vec4(col, aa);
  } else {
    // ---- halo pass (annulus around the body) ----
    if (r < 1.0 || r > uGlowMax) discard;
    float pulse = 0.5 + 0.5 * sin(uTime * 0.0020944 + vPhase);   // per-sphere phase
    float halo = 1.0 - smoothstep(1.0, uGlowMax, r);             // strong at rim → 0 at edge
    halo = pow(halo, 2.2);
    float ch = clamp(vCharge, 0.0, 1.0);
    if (uHaloMode < 0.5) {
      // dark theme: additive glow; flares RED when an energy pulse arrives
      float a = halo * (0.06 + 0.20 * pulse) * uGlow * (1.0 - fog * 0.5);
      a *= (1.0 + vCharge * 3.5);
      vec3 col = mix(vColor * 1.15, uChargeCol * 1.5, ch) + 0.04;
      gl_FragColor = vec4(col, a);
    } else {
      // light theme: faint dark shadow that blooms into a bright RED aura when charged
      float shadowA = halo * (0.13 + 0.03 * pulse) * (1.0 - fog * 0.45);
      vec3 shadowCol = mix(vec3(0.09, 0.12, 0.17), vColor * 0.5, 0.20);
      float bloomA = halo * (0.18 + 0.34 * ch) * (1.0 - fog * 0.4);
      vec3 bloomCol = mix(uChargeCol * 1.1, vec3(1.0), 0.10);
      float a = mix(shadowA, bloomA, ch) * uGlow;
      vec3 col = mix(shadowCol, bloomCol, ch);
      gl_FragColor = vec4(col, a);
    }
  }
}`;

  const LINE_VS = `
attribute vec3 aPos; attribute float aAlpha;
uniform mat4 uMV, uProj;
varying float vAlpha; varying float vViewZ;
void main(){
  vec4 vp = uMV * vec4(aPos, 1.0);
  vViewZ = vp.z; vAlpha = aAlpha;
  gl_Position = uProj * vp;
}`;

  const LINE_FS = `
precision mediump float;
varying float vAlpha; varying float vViewZ;
uniform vec3 uBg, uLine; uniform float uFogNear, uFogFar, uBoost, uFogMix;
void main(){
  float fog = clamp((-vViewZ - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
  vec3 col = mix(uLine, uBg, fog * uFogMix);
  gl_FragColor = vec4(col, min(1.0, vAlpha * uBoost) * (1.0 - fog * 0.35));
}`;

  /* ---- energy pulse: a bright bead that travels a link, billboarded like a sphere ---- */
  const PULSE_VS = `
attribute vec2 aCorner;
attribute vec3 aOffset;
attribute vec3 aColor;
attribute float aIntensity;
attribute float aScale;
uniform mat4 uMV, uProj; uniform float uR;
varying vec2 vCoord; varying vec3 vCol; varying float vI;
void main(){
  vec4 vp = uMV * vec4(aOffset, 1.0);
  vp.xy += aCorner * uR * aScale;
  vCoord = aCorner; vCol = aColor; vI = aIntensity;
  gl_Position = uProj * vp;
}`;

  const PULSE_FS = `
precision mediump float;
varying vec2 vCoord; varying vec3 vCol; varying float vI;
uniform float uLight;
void main(){
  float d = length(vCoord);
  if (d > 1.0) discard;
  float core = smoothstep(0.45, 0.0, d);
  float glow = pow(1.0 - d, 2.2);
  if (uLight < 0.5) {
    // dark: red bead with a hot center (additive)
    vec3 col = mix(vCol, vec3(1.0), 0.30);
    gl_FragColor = vec4(col, (core + glow * 0.5) * vI);
  } else {
    // light: saturated red dot (normal blend reads on a pale surface)
    vec3 col = mix(vCol, vec3(1.0), 0.05);
    gl_FragColor = vec4(col, (core * 0.95 + glow * 0.4) * vI);
  }
}`;

  /* ===================== WebGL renderer ===================== */
  function initGL(gl, wrap, canvas, opts) {
    const isGL2 = (typeof WebGL2RenderingContext !== "undefined") && (gl instanceof WebGL2RenderingContext);
    const ext = isGL2 ? null : gl.getExtension("ANGLE_instanced_arrays");
    if (!isGL2 && !ext) return null; // need instancing
    const divisor = (loc, d) => isGL2 ? gl.vertexAttribDivisor(loc, d) : ext.vertexAttribDivisorANGLE(loc, d);
    const drawInst = (mode, first, count, prim) => isGL2 ? gl.drawArraysInstanced(mode, first, count, prim) : ext.drawArraysInstancedANGLE(mode, first, count, prim);

    const sphereProg = program(gl, SPHERE_VS, SPHERE_FS);
    const lineProg = program(gl, LINE_VS, LINE_FS);
    const pulseProg = program(gl, PULSE_VS, PULSE_FS);
    if (!sphereProg || !lineProg || !pulseProg) return null;

    // locations
    const SL = {
      aCorner: gl.getAttribLocation(sphereProg, "aCorner"),
      aOffset: gl.getAttribLocation(sphereProg, "aOffset"),
      aRadius: gl.getAttribLocation(sphereProg, "aRadius"),
      aColor: gl.getAttribLocation(sphereProg, "aColor"),
      aCharge: gl.getAttribLocation(sphereProg, "aCharge"),
      uMV: gl.getUniformLocation(sphereProg, "uMV"),
      uProj: gl.getUniformLocation(sphereProg, "uProj"),
      uPad: gl.getUniformLocation(sphereProg, "uPad"),
      uBg: gl.getUniformLocation(sphereProg, "uBg"),
      uFogNear: gl.getUniformLocation(sphereProg, "uFogNear"),
      uFogFar: gl.getUniformLocation(sphereProg, "uFogFar"),
      uGlowPass: gl.getUniformLocation(sphereProg, "uGlowPass"),
      uTime: gl.getUniformLocation(sphereProg, "uTime"),
      uGlowMax: gl.getUniformLocation(sphereProg, "uGlowMax"),
      uGlow: gl.getUniformLocation(sphereProg, "uGlow"),
      uHaloMode: gl.getUniformLocation(sphereProg, "uHaloMode"),
      uChargeCol: gl.getUniformLocation(sphereProg, "uChargeCol"),
    };
    const LL = {
      aPos: gl.getAttribLocation(lineProg, "aPos"),
      aAlpha: gl.getAttribLocation(lineProg, "aAlpha"),
      uMV: gl.getUniformLocation(lineProg, "uMV"),
      uProj: gl.getUniformLocation(lineProg, "uProj"),
      uBg: gl.getUniformLocation(lineProg, "uBg"),
      uLine: gl.getUniformLocation(lineProg, "uLine"),
      uFogNear: gl.getUniformLocation(lineProg, "uFogNear"),
      uFogFar: gl.getUniformLocation(lineProg, "uFogFar"),
      uBoost: gl.getUniformLocation(lineProg, "uBoost"),
      uFogMix: gl.getUniformLocation(lineProg, "uFogMix"),
    };
    const PL = {
      aCorner: gl.getAttribLocation(pulseProg, "aCorner"),
      aOffset: gl.getAttribLocation(pulseProg, "aOffset"),
      aColor: gl.getAttribLocation(pulseProg, "aColor"),
      aIntensity: gl.getAttribLocation(pulseProg, "aIntensity"),
      aScale: gl.getAttribLocation(pulseProg, "aScale"),
      uMV: gl.getUniformLocation(pulseProg, "uMV"),
      uProj: gl.getUniformLocation(pulseProg, "uProj"),
      uR: gl.getUniformLocation(pulseProg, "uR"),
      uLight: gl.getUniformLocation(pulseProg, "uLight"),
    };

    // quad (triangle strip) shared by every sphere instance
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const offBuf = gl.createBuffer();   // sphere centers (static — camera does the moving)
    const radBuf = gl.createBuffer();   // static
    const colBuf = gl.createBuffer();   // static
    const lineBuf = gl.createBuffer();  // static (pos+alpha interleaved)
    const chargeBuf = gl.createBuffer();    // per-sphere energy charge (dynamic, decays each frame)
    const pulseInstBuf = gl.createBuffer(); // traveling-pulse instances (dynamic)

    const R = 2.9;                       // cloud radius (overfills the frustum so spheres clip off-edge)
    const camZ = 3.7;
    let nodes = [];
    let radii, colors, lineVerts, lineCount = 0;
    let charge = new Float32Array(0);   // per-sphere energy (0..~1.2), decays over time
    let linkPairs = [];                 // [i,j] endpoints of every drawn link
    let adj = [];                       // adjacency list (each sphere's neighbours) — the cascade graph
    let pulses = [];                    // active traveling pulses {a,b,t,speed}
    let visited = new Uint8Array(0);    // spheres the current cascade has already charged
    let reserved = new Uint8Array(0);   // spheres a pulse is already heading toward (no double-targeting)
    let casc = { phase: "waiting", wait: 900 };   // cascade lifecycle: brief intro → flood ⇄ 5s rest
    let W = 1, H = 1, dpr = 1;

    function rand(a, b) { return a + Math.random() * (b - a); }

    function build() {
      const rect = wrap.getBoundingClientRect();
      W = Math.max(1, rect.width); H = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, opts.dprCap);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);

      const target = Math.min(opts.maxNodes, Math.round((W * H) / 16000 * opts.density));
      const N = Math.max(8, target);
      const pal = resolvePalette(opts.palette);
      nodes = []; const rad = new Float32Array(N); const col = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        // uniform-ish point inside sphere of radius R
        let x, y, z;
        do { x = rand(-1,1); y = rand(-1,1); z = rand(-1,1); } while (x*x + y*y + z*z > 1);
        const big = Math.random() < 0.16;
        nodes.push({
          x: x*R, y: y*R, z: z*R,
          vx: rand(-1,1), vy: rand(-1,1), vz: rand(-1,1),
        });
        rad[i] = big ? rand(0.085, 0.14) : rand(0.032, 0.066);
        const c = pal[(Math.random() * pal.length) | 0];
        col[i*3] = c[0]; col[i*3+1] = c[1]; col[i*3+2] = c[2];
      }
      radii = rad; colors = col;
      charge = new Float32Array(N); pulses = [];
      visited = new Uint8Array(N); reserved = new Uint8Array(N);
      casc = { phase: "waiting", wait: 900 };

      gl.bindBuffer(gl.ARRAY_BUFFER, chargeBuf); gl.bufferData(gl.ARRAY_BUFFER, charge, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, radBuf); gl.bufferData(gl.ARRAY_BUFFER, radii, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, colBuf); gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
      // spheres are stationary — upload offsets ONCE (camera does the moving)
      gl.bindBuffer(gl.ARRAY_BUFFER, offBuf); gl.bufferData(gl.ARRAY_BUFFER, offArr(), gl.STATIC_DRAW);
      // links are constant too — compute & upload ONCE
      lineVerts = buildLines(); lineCount = lineVerts.length / 4;
      adj = Array.from({ length: nodes.length }, () => []);
      for (let i = 0; i < linkPairs.length; i++) { const u = linkPairs[i][0], v = linkPairs[i][1]; adj[u].push(v); adj[v].push(u); }
      gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf); gl.bufferData(gl.ARRAY_BUFFER, lineVerts, gl.STATIC_DRAW);
    }

    const proj = () => mPerspective(45 * Math.PI / 180, W / H, 0.1, 100);
    const threshold = 0.7 * R * (opts.linkDistance / 250); // world-space link radius (scales with cloud size)
    const offArr = () => { const a = new Float32Array(nodes.length * 3); for (let i = 0; i < nodes.length; i++) { a[i*3] = nodes[i].x; a[i*3+1] = nodes[i].y; a[i*3+2] = nodes[i].z; } return a; };

    function drift() {
      for (const n of nodes) {
        n.vx += rand(-0.02,0.02); n.vy += rand(-0.02,0.02); n.vz += rand(-0.02,0.02);
        const sp = Math.hypot(n.vx, n.vy, n.vz) || 1, m = 0.0016 * opts.speed / sp;
        n.x += n.vx * m * 60; n.y += n.vy * m * 60; n.z += n.vz * m * 60;
        const d = Math.hypot(n.x, n.y, n.z);
        if (d > R) { const k = R / d; n.x *= k; n.y *= k; n.z *= k; n.vx = -n.vx; n.vy = -n.vy; n.vz = -n.vz; }
      }
    }

    function buildLines() {
      const t2 = threshold * threshold; const verts = []; linkPairs = [];
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x-b.x, dy = a.y-b.y, dz = a.z-b.z, d2 = dx*dx + dy*dy + dz*dz;
          if (d2 > t2) continue;
          const al = Math.min(1, ((1 - Math.sqrt(d2) / threshold) * 0.55 + 0.14) * (opts.linkOpacity != null ? opts.linkOpacity : 1));
          verts.push(a.x,a.y,a.z,al, b.x,b.y,b.z,al);
          linkPairs.push([i, j]);
        }
      }
      return new Float32Array(verts);
    }

    function pulseSpeed() { return 1000 / (360 + Math.random() * 220); }   // fast laser transit (~0.4–0.6s/link)
    function spawnEdge(a, b) { pulses.push({ a, b, t: 0, speed: pulseSpeed() }); }

    // Begin a fresh cascade: pick a random seed sphere and fire ONE pulse to a neighbour. That pulse's
    // arrival then floods outward (see step) until every reachable downstream sphere has been charged.
    function startCascade() {
      if (!adj.length) return;
      visited.fill(0); reserved.fill(0);
      let s = -1;
      for (let tries = 0; tries < 48; tries++) {
        const c = (Math.random() * nodes.length) | 0;
        if (adj[c] && adj[c].length) { s = c; break; }
      }
      if (s < 0) { casc = { phase: "waiting", wait: 1500 }; return; }
      visited[s] = 1;
      const nbrs = adj[s];
      const n = nbrs[(Math.random() * nbrs.length) | 0];
      reserved[n] = 1;
      spawnEdge(s, n);                       // the single initiating shot
      casc = { phase: "running", wait: 0 };
    }

    // Advance energy each frame: decay charges, move pulses, and on every arrival CASCADE the pulse
    // onward to all not-yet-hit neighbours — so the energy floods through the whole downstream network.
    // When the wave dies out, rest ~5s, then kick off a new cascade from a new seed.
    function step(dtMs) {
      const decay = Math.pow(0.5, dtMs / 650);   // half-life ~650ms → flare then dim
      for (let i = 0; i < charge.length; i++) charge[i] *= decay;
      const on = opts.pulse && opts.pulseRate > 0;
      const rate = on ? opts.pulseRate : 1;

      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k];
        p.t += (dtMs / 1000) * p.speed;
        if (p.t >= 1) {
          const dest = p.b;
          charge[dest] = Math.min(1.2, charge[dest] + 1.0);   // arrival flares the sphere red
          visited[dest] = 1;
          pulses.splice(k, 1);
          if (on && casc.phase === "running") {               // …and shoots on to every fresh neighbour
            const ns = adj[dest];
            for (let m = 0; m < ns.length; m++) {
              const y = ns[m];
              if (!visited[y] && !reserved[y]) { reserved[y] = 1; spawnEdge(dest, y); }
            }
          }
        }
      }

      if (casc.phase === "running") {
        if (pulses.length === 0) casc = { phase: "waiting", wait: 5000 / rate };   // wave finished → rest
      } else {
        casc.wait -= dtMs;
        if (casc.wait <= 0) { if (on) startCascade(); else casc.wait = 400; }
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, chargeBuf); gl.bufferSubData(gl.ARRAY_BUFFER, 0, charge);
    }

    function renderPulses(mv, pj, light) {
      if (!pulses.length) return;
      const TAIL = 6, GAP = 0.032;                 // head + 5 trailing samples → a short directional comet tail
      const total = pulses.length * TAIL;
      const arr = new Float32Array(total * 8);     // offset(3) color(3) intensity(1) scale(1)
      let o = 0;
      for (let k = 0; k < pulses.length; k++) {
        const p = pulses[k], a = nodes[p.a], b = nodes[p.b], tt = Math.min(1, p.t);
        const headI = 0.82 + 0.18 * Math.sin(tt * Math.PI);
        // emit furthest tail sample first → head last, so the bright head sits on top under normal blend (light)
        for (let i = TAIL - 1; i >= 0; i--) {
          const tpos = tt - i * GAP;
          const on = tpos > 0 ? 1 : 0;             // the tail never reaches back past the source sphere
          arr[o]   = a.x + (b.x - a.x) * tpos;
          arr[o+1] = a.y + (b.y - a.y) * tpos;
          arr[o+2] = a.z + (b.z - a.z) * tpos;
          arr[o+3] = PULSE_RGB[0]; arr[o+4] = PULSE_RGB[1]; arr[o+5] = PULSE_RGB[2];
          arr[o+6] = headI * Math.pow(0.56, i) * on;      // trailing samples fade out behind the head
          arr[o+7] = 1.0 - i * (0.62 / (TAIL - 1));        // … and shrink behind the head
          o += 8;
        }
      }
      gl.useProgram(pulseProg);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(PL.aCorner); gl.vertexAttribPointer(PL.aCorner, 2, gl.FLOAT, false, 0, 0); divisor(PL.aCorner, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, pulseInstBuf); gl.bufferData(gl.ARRAY_BUFFER, arr, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(PL.aOffset); gl.vertexAttribPointer(PL.aOffset, 3, gl.FLOAT, false, 32, 0); divisor(PL.aOffset, 1);
      gl.enableVertexAttribArray(PL.aColor); gl.vertexAttribPointer(PL.aColor, 3, gl.FLOAT, false, 32, 12); divisor(PL.aColor, 1);
      gl.enableVertexAttribArray(PL.aIntensity); gl.vertexAttribPointer(PL.aIntensity, 1, gl.FLOAT, false, 32, 24); divisor(PL.aIntensity, 1);
      gl.enableVertexAttribArray(PL.aScale); gl.vertexAttribPointer(PL.aScale, 1, gl.FLOAT, false, 32, 28); divisor(PL.aScale, 1);
      gl.uniformMatrix4fv(PL.uMV, false, mv); gl.uniformMatrix4fv(PL.uProj, false, pj);
      gl.uniform1f(PL.uR, 0.058); gl.uniform1f(PL.uLight, light ? 1.0 : 0.0);
      gl.depthMask(false);
      gl.blendFunc(gl.SRC_ALPHA, light ? gl.ONE_MINUS_SRC_ALPHA : gl.ONE);
      drawInst(gl.TRIANGLE_STRIP, 0, 4, total);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.depthMask(true);
    }

    function render(yaw, pitch) {
      const mv = mMul(mTranslate(0,0,-camZ), mMul(mRotX(pitch), mRotY(yaw)));
      const pj = proj();
      gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);

      // lines (no depth write so they don't punch holes in spheres) — cached buffer
      if (lineCount) {
        gl.useProgram(lineProg); gl.depthMask(false);
        gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
        gl.enableVertexAttribArray(LL.aPos); gl.vertexAttribPointer(LL.aPos, 3, gl.FLOAT, false, 16, 0); divisor(LL.aPos, 0);
        gl.enableVertexAttribArray(LL.aAlpha); gl.vertexAttribPointer(LL.aAlpha, 1, gl.FLOAT, false, 16, 12); divisor(LL.aAlpha, 0);
        gl.uniformMatrix4fv(LL.uMV, false, mv); gl.uniformMatrix4fv(LL.uProj, false, pj);
        gl.uniform3fv(LL.uBg, opts.bgRGB); gl.uniform3fv(LL.uLine, opts.lineRGB);
        gl.uniform1f(LL.uFogNear, camZ - R); gl.uniform1f(LL.uFogFar, camZ + R);
        gl.uniform1f(LL.uBoost, opts.haloMode >= 0.5 ? 1.5 : 1.0);
        gl.uniform1f(LL.uFogMix, opts.haloMode >= 0.5 ? 0.32 : 0.5);
        gl.drawArrays(gl.LINES, 0, lineCount);
      }

      // spheres (instanced, depth-written) — offsets already uploaded in build()
      gl.useProgram(sphereProg); gl.depthMask(true);
      gl.uniform3fv(SL.uChargeCol, PULSE_RGB);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(SL.aCorner); gl.vertexAttribPointer(SL.aCorner, 2, gl.FLOAT, false, 0, 0); divisor(SL.aCorner, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, offBuf);
      gl.enableVertexAttribArray(SL.aOffset); gl.vertexAttribPointer(SL.aOffset, 3, gl.FLOAT, false, 0, 0); divisor(SL.aOffset, 1);
      gl.bindBuffer(gl.ARRAY_BUFFER, radBuf);
      gl.enableVertexAttribArray(SL.aRadius); gl.vertexAttribPointer(SL.aRadius, 1, gl.FLOAT, false, 0, 0); divisor(SL.aRadius, 1);
      gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
      gl.enableVertexAttribArray(SL.aColor); gl.vertexAttribPointer(SL.aColor, 3, gl.FLOAT, false, 0, 0); divisor(SL.aColor, 1);
      gl.bindBuffer(gl.ARRAY_BUFFER, chargeBuf);
      gl.enableVertexAttribArray(SL.aCharge); gl.vertexAttribPointer(SL.aCharge, 1, gl.FLOAT, false, 0, 0); divisor(SL.aCharge, 1);

      gl.uniformMatrix4fv(SL.uMV, false, mv); gl.uniformMatrix4fv(SL.uProj, false, pj);
      gl.uniform1f(SL.uPad, 1.08);
      gl.uniform3fv(SL.uBg, opts.bgRGB);
      gl.uniform1f(SL.uFogNear, camZ - R); gl.uniform1f(SL.uFogFar, camZ + R);
      gl.uniform1f(SL.uGlowPass, 0.0);
      drawInst(gl.TRIANGLE_STRIP, 0, 4, nodes.length);

      // pulsing halo pass: larger billboard, ADDITIVE blend so the glow adds light
      // on the dark backdrop (reads as a real glow); no depth write so faint halos
      // don't punch depth holes; still depth-tested so nearer bodies occlude them.
      const nowMs = (typeof performance !== "undefined" ? performance.now() : Date.now());
      const lightHalo = opts.haloMode >= 0.5;
      gl.depthMask(false);
      // dark → ADDITIVE luminous glow; light → NORMAL-blended soft shadow aura
      gl.blendFunc(gl.SRC_ALPHA, lightHalo ? gl.ONE_MINUS_SRC_ALPHA : gl.ONE);
      gl.uniform1f(SL.uGlowPass, 1.0);
      gl.uniform1f(SL.uHaloMode, opts.haloMode);
      gl.uniform1f(SL.uPad, lightHalo ? 1.75 : 1.5);
      gl.uniform1f(SL.uTime, nowMs);
      gl.uniform1f(SL.uGlowMax, lightHalo ? 1.55 : 1.3);
      gl.uniform1f(SL.uGlow, 1.0);
      drawInst(gl.TRIANGLE_STRIP, 0, 4, nodes.length);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);   // restore
      gl.depthMask(true);

      renderPulses(mv, pj, opts.haloMode >= 0.5);
    }

    build();
    return { build, drift, render, step };
  }

  /* ===================== 2D fallback (no WebGL) ===================== */
  function init2D(ctx, wrap, canvas, opts) {
    // mirror the WebGL palettes (rgb 0..1) as 0..255 objects
    const pal01 = (PALETTES[opts.palette] || PALETTES.spectrum);
    const COLORS2D = pal01.map(c => ({ r: Math.round(c[0]*255), g: Math.round(c[1]*255), b: Math.round(c[2]*255) }));
    const L2D = (opts.lineRGB || LINE_DARK).map(v => Math.round(v * 255)); // link color (theme-aware)
    function sprite(col, baseR) {
      const pad = baseR*1.6, size = Math.ceil((baseR+pad)*2), cx = size/2, cy = size/2;
      const c = document.createElement("canvas"); c.width = c.height = size; const x = c.getContext("2d");
      const g = x.createRadialGradient(cx,cy,baseR*0.5,cx,cy,baseR+pad);
      g.addColorStop(0,"rgba(" + col.r + "," + col.g + "," + col.b + ",0.24)"); g.addColorStop(1,"rgba(" + col.r + "," + col.g + "," + col.b + ",0)");
      x.fillStyle = g; x.fillRect(0,0,size,size);
      const lx = cx-baseR*0.38, ly = cy-baseR*0.42, b = x.createRadialGradient(lx,ly,baseR*0.1,cx,cy,baseR);
      b.addColorStop(0,"rgba(" + Math.min(col.r+34,255) + "," + Math.min(col.g+32,255) + "," + Math.min(col.b+32,255) + ",1)");
      b.addColorStop(0.5,"rgba(" + col.r + "," + col.g + "," + col.b + ",1)");
      b.addColorStop(1,"rgba(" + Math.round(col.r*0.64) + "," + Math.round(col.g*0.64) + "," + Math.round(col.b*0.64) + ",1)");
      x.beginPath(); x.arc(cx,cy,baseR,0,7); x.fillStyle = b; x.fill();
      return { canvas:c, baseR, half:size/2 };
    }
    let W=1,H=1,dpr=1,nodes=[],sprites=[]; const baseSpriteR=26;
    const linkSq = () => (opts.linkDistance) * (opts.linkDistance);
    function build() {
      const rect = wrap.getBoundingClientRect(); W = Math.max(1,rect.width); H = Math.max(1,rect.height);
      dpr = Math.min(window.devicePixelRatio||1, opts.dprCap);
      canvas.width = Math.round(W*dpr); canvas.height = Math.round(H*dpr); ctx.setTransform(dpr,0,0,dpr,0,0);
      sprites = COLORS2D.map(c => sprite(c, baseSpriteR));
      const target = Math.min(opts.maxNodes, Math.round((W*H)/26000*opts.density));
      nodes = new Array(Math.max(6,target)).fill(0).map(() => {
        const z = 0.32+Math.random()*0.68, big = Math.random()<0.18;
        return { x:Math.random()*W, y:Math.random()*H, z,
          r:(big?9+Math.random()*7:1.5+Math.random()*4.5)*(0.6+z*0.4),
          angle:Math.random()*Math.PI*2, spd:(0.14+Math.random()*0.28)*opts.speed*(0.55+z*0.45),
          wander:0.05+Math.random()*0.06, ci:(Math.random()*COLORS2D.length)|0 };
      });
    }
    function drift() {
      for (const n of nodes) { n.angle += (Math.random()-0.5)*n.wander; n.x += Math.cos(n.angle)*n.spd; n.y += Math.sin(n.angle)*n.spd;
        if (n.x<-20) n.x = W+20; else if (n.x>W+20) n.x = -20; if (n.y<-20) n.y = H+20; else if (n.y>H+20) n.y = -20; }
    }
    function render() {
      ctx.clearRect(0,0,W,H); ctx.lineWidth = 1; const ls = linkSq();
      for (let i=0;i<nodes.length;i++){ const a=nodes[i]; for (let j=i+1;j<nodes.length;j++){ const b=nodes[j];
        const dx=a.x-b.x, dy=a.y-b.y, d2=dx*dx+dy*dy; if (d2>ls) continue;
        const t=1-Math.sqrt(d2)/opts.linkDistance, depth=(a.z+b.z)*0.5;
        ctx.strokeStyle="rgba(" + L2D[0] + "," + L2D[1] + "," + L2D[2] + "," + (Math.min(1,(0.14+t*0.30)*(opts.linkOpacity != null ? opts.linkOpacity : 1))*depth) + ")"; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); } }
      for (const n of nodes){ const s=sprites[n.ci], sc=n.r/s.baseR, dh=s.half*sc; ctx.globalAlpha=0.55+n.z*0.45;
        ctx.drawImage(s.canvas, n.x-dh, n.y-dh, s.half*2*sc, s.half*2*sc); } ctx.globalAlpha=1;
    }
    build();
    return { build, drift, render, is2D:true };
  }

  /* ===================== auto-mount controller (replaces the React shell) ===================== */
  const DEFAULTS = {
    density: 1, maxNodes: 90, fps: 30, dprCap: 1.5,
    linkDistance: 250, linkOpacity: 1, palette: "spectrum", speed: 1,
    theme: "dark", bg: null, lineColor: null, pulse: true, pulseRate: 1,
  };
  function attrNum(el, name, fallback) {
    const v = el.getAttribute(name); if (v === null || v === "") return fallback;
    const n = parseFloat(v); return Number.isFinite(n) ? n : fallback;
  }
  function attrStr(el, name, fallback) {
    const v = el.getAttribute(name); return (v === null || v === "") ? fallback : v;
  }
  function attrBool(el, name, fallback) {
    const v = el.getAttribute(name); if (v === null) return fallback;
    return !(v === "false" || v === "0" || v === "off");
  }

  function mountOne(wrap) {
    if (wrap.__grcNodeGraph) return;
    wrap.classList.add("grc-nodegraph");
    if (!wrap.hasAttribute("aria-hidden")) wrap.setAttribute("aria-hidden", "true");
    let canvas = wrap.querySelector(".grc-nodegraph__canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.className = "grc-nodegraph__canvas";
      wrap.appendChild(canvas);
    }

    const theme = attrStr(wrap, "data-theme", DEFAULTS.theme) === "light" ? "light" : "dark";
    const themeDef = theme === "light"
      ? { bgRGB: BG_LIGHT, lineRGB: LINE_LIGHT, haloMode: 1 }
      : { bgRGB: BG_DARK,  lineRGB: LINE_DARK,  haloMode: 0 };
    const bgRGB = parseRGB01(attrStr(wrap, "data-bg", DEFAULTS.bg)) || themeDef.bgRGB;
    const lineRGB = parseRGB01(attrStr(wrap, "data-line-color", DEFAULTS.lineColor)) || themeDef.lineRGB;
    const opts = {
      density: attrNum(wrap, "data-density", DEFAULTS.density),
      maxNodes: attrNum(wrap, "data-max-nodes", DEFAULTS.maxNodes),
      fps: attrNum(wrap, "data-fps", DEFAULTS.fps),
      dprCap: attrNum(wrap, "data-dpr-cap", DEFAULTS.dprCap),
      linkDistance: attrNum(wrap, "data-link-distance", DEFAULTS.linkDistance),
      linkOpacity: attrNum(wrap, "data-link-opacity", DEFAULTS.linkOpacity),
      palette: attrStr(wrap, "data-palette", DEFAULTS.palette),
      speed: attrNum(wrap, "data-speed", DEFAULTS.speed),
      bgRGB: bgRGB, lineRGB: lineRGB, haloMode: themeDef.haloMode,
      pulse: attrBool(wrap, "data-pulse", DEFAULTS.pulse),
      pulseRate: attrNum(wrap, "data-pulse-rate", DEFAULTS.pulseRate),
    };
    const speed = opts.speed;
    const reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    // try WebGL, else 2D
    let engine = null;
    const gl = canvas.getContext("webgl2", { alpha:true, antialias:true, premultipliedAlpha:true })
            || canvas.getContext("webgl", { alpha:true, antialias:true, premultipliedAlpha:true })
            || canvas.getContext("experimental-webgl", { alpha:true, antialias:true });
    if (gl) { try { engine = initGL(gl, wrap, canvas, opts); } catch (e) { engine = null; } }
    if (!engine) {
      const ctx2d = canvas.getContext("2d", { alpha:true });
      if (ctx2d) engine = init2D(ctx2d, wrap, canvas, opts);
    }
    if (!engine) return;

    let raf = 0, lastT = 0, running = false, t = 0;
    const frameInterval = 1000 / opts.fps;

    function frame(now) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (now - lastT < frameInterval) return;
      const dt = lastT ? (now - lastT) : frameInterval; lastT = now; t += dt;
      if (engine.step) engine.step(dt);   // advance energy pulses + charge decay (WebGL only)
      if (engine.is2D) {
        engine.drift();   // 2D fallback has no camera; gentle node drift instead
        engine.render();
      } else {
        // spheres are a STATIONARY constellation — only the camera orbits it.
        // speed 0 → hold a fixed 3/4 view ("Still"); otherwise slow yaw + faint sway.
        if (speed === 0) { engine.render(0.6, 0.22); }
        else { engine.render(t * 0.00003 * speed, 0.16 * Math.sin(t * 0.000022 * speed)); }
      }
    }
    function paintStatic() {
      if (engine.is2D) engine.render();
      else engine.render(0.6, 0.22); // a pleasant fixed 3/4 view
    }
    // RAF runs even at speed 0 so the faint glow keeps pulsing; the camera stays fixed.
    function start() { if (running || reduce) return; running = true; lastT = 0; raf = requestAnimationFrame(frame); }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

    paintStatic(); // immediate first paint (also the reduced-motion result)

    let io;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((es) => { for (const e of es) e.isIntersecting ? start() : stop(); }, { threshold: 0.01 });
      io.observe(wrap);
    } else start();

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    let rt = 0;
    const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { engine.build(); paintStatic(); }, 180); };
    window.addEventListener("resize", onResize);

    wrap.__grcNodeGraph = {
      destroy: function () {
        stop(); if (io) io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("resize", onResize);
        clearTimeout(rt);
        delete wrap.__grcNodeGraph;
      }
    };
  }

  function mountAll() {
    document.querySelectorAll("[data-grc-nodegraph]").forEach(mountOne);
  }
  // public API preserved from the previous port (programmatic mounting)
  window.GRCNodeGraph = { mount: mountOne, mountAll: mountAll };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountAll);
  else mountAll();
})();
