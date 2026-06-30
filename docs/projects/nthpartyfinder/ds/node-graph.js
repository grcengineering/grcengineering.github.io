/* ============================================================
   GRC Engineering — NodeGraphBackground (vanilla port)
   The Nth Party Finder "web of spheres" backdrop: orange/blue (+accent)
   spheres in a slowly-orbiting 3D cloud, linked by lines — the nth-party
   supply-chain graph. Raw-WebGL "sphere impostors", instanced, ONE draw call,
   NO three.js (paints on frame 1). 2D-sprite fallback where WebGL is absent.

   Ported verbatim from the DS React component
   (components/backgrounds/NodeGraphBackground.jsx, project 73c32b48) — engine,
   shaders and math are unchanged; only the React shell is replaced with a
   vanilla auto-mount controller.

   Usage:
     <div class="grc-nodegraph" data-grc-nodegraph
          data-palette="spectrum" data-max-nodes="90" data-speed="1"></div>
   Auto-mounts every [data-grc-nodegraph] on DOMContentLoaded. A <canvas> child
   is created if absent. Reads options from data-* attributes.
   ============================================================ */
(function () {
  "use strict";

  // rgb 0..1. Named hues; orange & blue lead, the rest accent.
  var HUES = {
    orange:     [1.00, 0.66, 0.31],
    orangeLit:  [1.00, 0.79, 0.52],
    orangeDeep: [0.85, 0.49, 0.18],
    blue:       [0.11, 0.58, 0.76],
    blueLit:    [0.36, 0.74, 0.88],
    blueDeep:   [0.06, 0.41, 0.58],
    purple:     [0.59, 0.47, 0.90],
    gray:       [0.59, 0.64, 0.70],
    red:        [0.88, 0.34, 0.36]
  };
  var PALETTES = {
    spectrum:    [HUES.orange, HUES.orange, HUES.blue, HUES.blue, HUES.purple, HUES.gray, HUES.red],
    brand:       [HUES.orange, HUES.blue],
    legacy:      [HUES.orange, HUES.orangeLit, HUES.orangeDeep],
    engineering: [HUES.blue, HUES.blueLit, HUES.blueDeep]
  };
  function resolvePalette(name) { return PALETTES[name] || PALETTES.spectrum; }

  var BG_RGB = [0.039, 0.055, 0.086]; // #0A0E16-ish, for depth fog

  /* ---------- tiny column-major mat4 helpers ---------- */
  function mPerspective(fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    return [f / aspect,0,0,0, 0,f,0,0, 0,0,(far + near) * nf,-1, 0,0,2 * far * near * nf,0];
  }
  function mMul(a, b) {
    var o = new Array(16);
    for (var c = 0; c < 4; c++) for (var r = 0; r < 4; r++) {
      o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    }
    return o;
  }
  function mTranslate(x, y, z) { return [1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1]; }
  function mRotY(a) { var c = Math.cos(a), s = Math.sin(a); return [c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]; }
  function mRotX(a) { var c = Math.cos(a), s = Math.sin(a); return [1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]; }

  function compile(gl, type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src); gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn("NodeGraphBackground shader:", gl.getShaderInfoLog(sh));
      gl.deleteShader(sh); return null;
    }
    return sh;
  }
  function program(gl, vs, fs) {
    var v = compile(gl, gl.VERTEX_SHADER, vs), f = compile(gl, gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return null;
    var p = gl.createProgram();
    gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(p)); return null; }
    return p;
  }

  var SPHERE_VS = [
    "attribute vec2 aCorner;",
    "attribute vec3 aOffset;",
    "attribute float aRadius;",
    "attribute vec3 aColor;",
    "uniform mat4 uMV, uProj;",
    "uniform float uPad;",
    "varying vec2 vCoord; varying vec3 vColor; varying float vViewZ; varying float vPhase;",
    "void main(){",
    "  vec4 vp = uMV * vec4(aOffset, 1.0);",
    "  vp.xy += aCorner * aRadius * uPad;",
    "  vViewZ = vp.z;",
    "  vColor = aColor;",
    "  vPhase = aOffset.x * 1.7 + aOffset.y * 2.3 + aOffset.z * 1.1;",
    "  vCoord = aCorner * uPad;",
    "  gl_Position = uProj * vp;",
    "}"
  ].join("\n");

  var SPHERE_FS = [
    "precision mediump float;",
    "varying vec2 vCoord; varying vec3 vColor; varying float vViewZ; varying float vPhase;",
    "uniform vec3 uBg; uniform float uFogNear, uFogFar;",
    "uniform float uGlowPass, uTime, uGlowMax, uGlow;",
    "void main(){",
    "  float r2 = dot(vCoord, vCoord);",
    "  float r = sqrt(r2);",
    "  float fog = clamp((-vViewZ - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);",
    "  if (uGlowPass < 0.5) {",
    "    if (r2 > 1.0) discard;",
    "    float z = sqrt(1.0 - r2);",
    "    vec3 n = vec3(vCoord, z);",
    "    vec3 L = normalize(vec3(-0.35, 0.45, 0.85));",
    "    float diff = max(dot(n, L), 0.0);",
    "    vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));",
    "    float spec = pow(max(dot(n, H), 0.0), 22.0) * 0.22;",
    "    vec3 col = vColor * (0.42 + 0.72 * diff) + spec;",
    "    col = mix(col, uBg, fog * 0.6);",
    "    float aa = smoothstep(1.0, 0.88, r2);",
    "    gl_FragColor = vec4(col, aa);",
    "  } else {",
    "    if (r < 1.0 || r > uGlowMax) discard;",
    "    float pulse = 0.5 + 0.5 * sin(uTime * 0.0020944 + vPhase);",
    "    float halo = 1.0 - smoothstep(1.0, uGlowMax, r);",
    "    halo = pow(halo, 2.2);",
    "    float a = halo * (0.06 + 0.20 * pulse) * uGlow * (1.0 - fog * 0.5);",
    "    vec3 col = vColor * 1.15 + 0.04;",
    "    gl_FragColor = vec4(col, a);",
    "  }",
    "}"
  ].join("\n");

  var LINE_VS = [
    "attribute vec3 aPos; attribute float aAlpha;",
    "uniform mat4 uMV, uProj;",
    "varying float vAlpha; varying float vViewZ;",
    "void main(){",
    "  vec4 vp = uMV * vec4(aPos, 1.0);",
    "  vViewZ = vp.z; vAlpha = aAlpha;",
    "  gl_Position = uProj * vp;",
    "}"
  ].join("\n");

  var LINE_FS = [
    "precision mediump float;",
    "varying float vAlpha; varying float vViewZ;",
    "uniform vec3 uBg, uLine; uniform float uFogNear, uFogFar;",
    "void main(){",
    "  float fog = clamp((-vViewZ - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);",
    "  vec3 col = mix(uLine, uBg, fog * 0.5);",
    "  gl_FragColor = vec4(col, vAlpha * (1.0 - fog * 0.35));",
    "}"
  ].join("\n");

  /* ===================== WebGL renderer ===================== */
  function initGL(gl, wrap, canvas, opts) {
    var isGL2 = (typeof WebGL2RenderingContext !== "undefined") && (gl instanceof WebGL2RenderingContext);
    var ext = isGL2 ? null : gl.getExtension("ANGLE_instanced_arrays");
    if (!isGL2 && !ext) return null;
    var divisor = function (loc, d) { return isGL2 ? gl.vertexAttribDivisor(loc, d) : ext.vertexAttribDivisorANGLE(loc, d); };
    var drawInst = function (mode, first, count, prim) { return isGL2 ? gl.drawArraysInstanced(mode, first, count, prim) : ext.drawArraysInstancedANGLE(mode, first, count, prim); };

    var sphereProg = program(gl, SPHERE_VS, SPHERE_FS);
    var lineProg = program(gl, LINE_VS, LINE_FS);
    if (!sphereProg || !lineProg) return null;

    var SL = {
      aCorner: gl.getAttribLocation(sphereProg, "aCorner"),
      aOffset: gl.getAttribLocation(sphereProg, "aOffset"),
      aRadius: gl.getAttribLocation(sphereProg, "aRadius"),
      aColor: gl.getAttribLocation(sphereProg, "aColor"),
      uMV: gl.getUniformLocation(sphereProg, "uMV"),
      uProj: gl.getUniformLocation(sphereProg, "uProj"),
      uPad: gl.getUniformLocation(sphereProg, "uPad"),
      uBg: gl.getUniformLocation(sphereProg, "uBg"),
      uFogNear: gl.getUniformLocation(sphereProg, "uFogNear"),
      uFogFar: gl.getUniformLocation(sphereProg, "uFogFar"),
      uGlowPass: gl.getUniformLocation(sphereProg, "uGlowPass"),
      uTime: gl.getUniformLocation(sphereProg, "uTime"),
      uGlowMax: gl.getUniformLocation(sphereProg, "uGlowMax"),
      uGlow: gl.getUniformLocation(sphereProg, "uGlow")
    };
    var LL = {
      aPos: gl.getAttribLocation(lineProg, "aPos"),
      aAlpha: gl.getAttribLocation(lineProg, "aAlpha"),
      uMV: gl.getUniformLocation(lineProg, "uMV"),
      uProj: gl.getUniformLocation(lineProg, "uProj"),
      uBg: gl.getUniformLocation(lineProg, "uBg"),
      uLine: gl.getUniformLocation(lineProg, "uLine"),
      uFogNear: gl.getUniformLocation(lineProg, "uFogNear"),
      uFogFar: gl.getUniformLocation(lineProg, "uFogFar")
    };

    var quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    var offBuf = gl.createBuffer();
    var radBuf = gl.createBuffer();
    var colBuf = gl.createBuffer();
    var lineBuf = gl.createBuffer();

    var R = 2.9;
    var camZ = 3.7;
    var nodes = [];
    var radii, colors, lineVerts, lineCount = 0;
    var W = 1, H = 1, dpr = 1;

    function rand(a, b) { return a + Math.random() * (b - a); }
    var threshold = 0.7 * R * (opts.linkDistance / 250);
    function offArr() { var a = new Float32Array(nodes.length * 3); for (var i = 0; i < nodes.length; i++) { a[i*3] = nodes[i].x; a[i*3+1] = nodes[i].y; a[i*3+2] = nodes[i].z; } return a; }

    function buildLines() {
      var t2 = threshold * threshold; var verts = [];
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var dx = a.x-b.x, dy = a.y-b.y, dz = a.z-b.z, d2 = dx*dx + dy*dy + dz*dz;
          if (d2 > t2) continue;
          var al = Math.min(1, ((1 - Math.sqrt(d2) / threshold) * 0.55 + 0.14) * (opts.linkOpacity != null ? opts.linkOpacity : 1));
          verts.push(a.x,a.y,a.z,al, b.x,b.y,b.z,al);
        }
      }
      return new Float32Array(verts);
    }

    function build() {
      var rect = wrap.getBoundingClientRect();
      W = Math.max(1, rect.width); H = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, opts.dprCap);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);

      var target = Math.min(opts.maxNodes, Math.round((W * H) / 16000 * opts.density));
      var N = Math.max(8, target);
      var pal = resolvePalette(opts.palette);
      nodes = []; var rad = new Float32Array(N); var col = new Float32Array(N * 3);
      for (var i = 0; i < N; i++) {
        var x, y, z;
        do { x = rand(-1,1); y = rand(-1,1); z = rand(-1,1); } while (x*x + y*y + z*z > 1);
        var big = Math.random() < 0.16;
        nodes.push({ x: x*R, y: y*R, z: z*R, vx: rand(-1,1), vy: rand(-1,1), vz: rand(-1,1) });
        rad[i] = big ? rand(0.085, 0.14) : rand(0.032, 0.066);
        var c = pal[(Math.random() * pal.length) | 0];
        col[i*3] = c[0]; col[i*3+1] = c[1]; col[i*3+2] = c[2];
      }
      radii = rad; colors = col;

      gl.bindBuffer(gl.ARRAY_BUFFER, radBuf); gl.bufferData(gl.ARRAY_BUFFER, radii, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, colBuf); gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, offBuf); gl.bufferData(gl.ARRAY_BUFFER, offArr(), gl.STATIC_DRAW);
      lineVerts = buildLines(); lineCount = lineVerts.length / 4;
      gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf); gl.bufferData(gl.ARRAY_BUFFER, lineVerts, gl.STATIC_DRAW);
    }

    function proj() { return mPerspective(45 * Math.PI / 180, W / H, 0.1, 100); }

    function drift() {
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.vx += rand(-0.02,0.02); n.vy += rand(-0.02,0.02); n.vz += rand(-0.02,0.02);
        var sp = Math.hypot(n.vx, n.vy, n.vz) || 1, m = 0.0016 * opts.speed / sp;
        n.x += n.vx * m * 60; n.y += n.vy * m * 60; n.z += n.vz * m * 60;
        var d = Math.hypot(n.x, n.y, n.z);
        if (d > R) { var k = R / d; n.x *= k; n.y *= k; n.z *= k; n.vx = -n.vx; n.vy = -n.vy; n.vz = -n.vz; }
      }
    }

    function render(yaw, pitch) {
      var mv = mMul(mTranslate(0,0,-camZ), mMul(mRotX(pitch), mRotY(yaw)));
      var pj = proj();
      gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);

      if (lineCount) {
        gl.useProgram(lineProg); gl.depthMask(false);
        gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
        gl.enableVertexAttribArray(LL.aPos); gl.vertexAttribPointer(LL.aPos, 3, gl.FLOAT, false, 16, 0);
        gl.enableVertexAttribArray(LL.aAlpha); gl.vertexAttribPointer(LL.aAlpha, 1, gl.FLOAT, false, 16, 12);
        gl.uniformMatrix4fv(LL.uMV, false, mv); gl.uniformMatrix4fv(LL.uProj, false, pj);
        gl.uniform3fv(LL.uBg, BG_RGB); gl.uniform3f(LL.uLine, 0.63, 0.71, 0.80);
        gl.uniform1f(LL.uFogNear, camZ - R); gl.uniform1f(LL.uFogFar, camZ + R);
        gl.drawArrays(gl.LINES, 0, lineCount);
      }

      gl.useProgram(sphereProg); gl.depthMask(true);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(SL.aCorner); gl.vertexAttribPointer(SL.aCorner, 2, gl.FLOAT, false, 0, 0); divisor(SL.aCorner, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, offBuf);
      gl.enableVertexAttribArray(SL.aOffset); gl.vertexAttribPointer(SL.aOffset, 3, gl.FLOAT, false, 0, 0); divisor(SL.aOffset, 1);
      gl.bindBuffer(gl.ARRAY_BUFFER, radBuf);
      gl.enableVertexAttribArray(SL.aRadius); gl.vertexAttribPointer(SL.aRadius, 1, gl.FLOAT, false, 0, 0); divisor(SL.aRadius, 1);
      gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
      gl.enableVertexAttribArray(SL.aColor); gl.vertexAttribPointer(SL.aColor, 3, gl.FLOAT, false, 0, 0); divisor(SL.aColor, 1);

      gl.uniformMatrix4fv(SL.uMV, false, mv); gl.uniformMatrix4fv(SL.uProj, false, pj);
      gl.uniform1f(SL.uPad, 1.08);
      gl.uniform3fv(SL.uBg, BG_RGB);
      gl.uniform1f(SL.uFogNear, camZ - R); gl.uniform1f(SL.uFogFar, camZ + R);
      gl.uniform1f(SL.uGlowPass, 0.0);
      drawInst(gl.TRIANGLE_STRIP, 0, 4, nodes.length);

      var nowMs = (typeof performance !== "undefined" ? performance.now() : Date.now());
      gl.depthMask(false);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.uniform1f(SL.uGlowPass, 1.0);
      gl.uniform1f(SL.uPad, 1.5);
      gl.uniform1f(SL.uTime, nowMs);
      gl.uniform1f(SL.uGlowMax, 1.3);
      gl.uniform1f(SL.uGlow, 1.0);
      drawInst(gl.TRIANGLE_STRIP, 0, 4, nodes.length);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.depthMask(true);
    }

    build();
    return { build: build, drift: drift, render: render };
  }

  /* ===================== 2D fallback (no WebGL) ===================== */
  function init2D(ctx, wrap, canvas, opts) {
    var pal01 = (PALETTES[opts.palette] || PALETTES.spectrum);
    var COLORS2D = pal01.map(function (c) { return { r: Math.round(c[0]*255), g: Math.round(c[1]*255), b: Math.round(c[2]*255) }; });
    function sprite(col, baseR) {
      var pad = baseR*1.6, size = Math.ceil((baseR+pad)*2), cx = size/2, cy = size/2;
      var c = document.createElement("canvas"); c.width = c.height = size; var x = c.getContext("2d");
      var g = x.createRadialGradient(cx,cy,baseR*0.5,cx,cy,baseR+pad);
      g.addColorStop(0,"rgba("+col.r+","+col.g+","+col.b+",0.24)"); g.addColorStop(1,"rgba("+col.r+","+col.g+","+col.b+",0)");
      x.fillStyle = g; x.fillRect(0,0,size,size);
      var lx = cx-baseR*0.38, ly = cy-baseR*0.42, b = x.createRadialGradient(lx,ly,baseR*0.1,cx,cy,baseR);
      b.addColorStop(0,"rgba("+Math.min(col.r+34,255)+","+Math.min(col.g+32,255)+","+Math.min(col.b+32,255)+",1)");
      b.addColorStop(0.5,"rgba("+col.r+","+col.g+","+col.b+",1)");
      b.addColorStop(1,"rgba("+Math.round(col.r*0.64)+","+Math.round(col.g*0.64)+","+Math.round(col.b*0.64)+",1)");
      x.beginPath(); x.arc(cx,cy,baseR,0,7); x.fillStyle = b; x.fill();
      return { canvas:c, baseR:baseR, half:size/2 };
    }
    var W=1,H=1,dpr=1,nodes=[],sprites=[]; var baseSpriteR=26;
    function linkSq() { return (opts.linkDistance) * (opts.linkDistance); }
    function build() {
      var rect = wrap.getBoundingClientRect(); W = Math.max(1,rect.width); H = Math.max(1,rect.height);
      dpr = Math.min(window.devicePixelRatio||1, opts.dprCap);
      canvas.width = Math.round(W*dpr); canvas.height = Math.round(H*dpr); ctx.setTransform(dpr,0,0,dpr,0,0);
      sprites = COLORS2D.map(function (c) { return sprite(c, baseSpriteR); });
      var target = Math.min(opts.maxNodes, Math.round((W*H)/26000*opts.density));
      nodes = new Array(Math.max(6,target)).fill(0).map(function () {
        var z = 0.32+Math.random()*0.68, big = Math.random()<0.18;
        return { x:Math.random()*W, y:Math.random()*H, z:z,
          r:(big?9+Math.random()*7:1.5+Math.random()*4.5)*(0.6+z*0.4),
          angle:Math.random()*Math.PI*2, spd:(0.14+Math.random()*0.28)*opts.speed*(0.55+z*0.45),
          wander:0.05+Math.random()*0.06, ci:(Math.random()*COLORS2D.length)|0 };
      });
    }
    function drift() {
      for (var i=0;i<nodes.length;i++){ var n=nodes[i]; n.angle += (Math.random()-0.5)*n.wander; n.x += Math.cos(n.angle)*n.spd; n.y += Math.sin(n.angle)*n.spd;
        if (n.x<-20) n.x = W+20; else if (n.x>W+20) n.x = -20; if (n.y<-20) n.y = H+20; else if (n.y>H+20) n.y = -20; }
    }
    function render() {
      ctx.clearRect(0,0,W,H); ctx.lineWidth = 1; var ls = linkSq();
      for (var i=0;i<nodes.length;i++){ var a=nodes[i]; for (var j=i+1;j<nodes.length;j++){ var b=nodes[j];
        var dx=a.x-b.x, dy=a.y-b.y, d2=dx*dx+dy*dy; if (d2>ls) continue;
        var t=1-Math.sqrt(d2)/opts.linkDistance, depth=(a.z+b.z)*0.5;
        ctx.strokeStyle="rgba(160,180,200,"+(Math.min(1,(0.14+t*0.30)*(opts.linkOpacity != null ? opts.linkOpacity : 1))*depth)+")"; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); } }
      for (var k=0;k<nodes.length;k++){ var nn=nodes[k]; var s=sprites[nn.ci], sc=nn.r/s.baseR, dh=s.half*sc; ctx.globalAlpha=0.55+nn.z*0.45;
        ctx.drawImage(s.canvas, nn.x-dh, nn.y-dh, s.half*2*sc, s.half*2*sc); } ctx.globalAlpha=1;
    }
    build();
    return { build: build, drift: drift, render: render, is2D: true };
  }

  /* ===================== vanilla mount controller ===================== */
  function mount(wrap, opts) {
    var canvas = wrap.querySelector("canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.className = "grc-nodegraph__canvas";
      wrap.appendChild(canvas);
    }
    var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var engine = null;
    var gl = canvas.getContext("webgl2", { alpha:true, antialias:true, premultipliedAlpha:true })
          || canvas.getContext("webgl", { alpha:true, antialias:true, premultipliedAlpha:true })
          || canvas.getContext("experimental-webgl", { alpha:true, antialias:true });
    if (gl) { try { engine = initGL(gl, wrap, canvas, opts); } catch (e) { engine = null; } }
    if (!engine) {
      var ctx2d = canvas.getContext("2d", { alpha:true });
      if (ctx2d) engine = init2D(ctx2d, wrap, canvas, opts);
    }
    if (!engine) return function () {};

    var raf = 0, lastT = 0, running = false, t = 0;
    var frameInterval = 1000 / opts.fps;

    function frame(now) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (now - lastT < frameInterval) return;
      var dt = lastT ? (now - lastT) : frameInterval; lastT = now; t += dt;
      if (engine.is2D) { engine.drift(); engine.render(); }
      else if (opts.speed === 0) { engine.render(0.6, 0.22); }
      else { engine.render(t * 0.00003 * opts.speed, 0.16 * Math.sin(t * 0.000022 * opts.speed)); }
    }
    function paintStatic() {
      if (engine.is2D) engine.render();
      else engine.render(0.6, 0.22);
    }
    function start() { if (running || reduce) return; running = true; lastT = 0; raf = requestAnimationFrame(frame); }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

    paintStatic();

    var io;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(function (es) { for (var i = 0; i < es.length; i++) { es[i].isIntersecting ? start() : stop(); } }, { threshold: 0.01 });
      io.observe(wrap);
    } else start();

    var onVis = function () { return (document.hidden ? stop() : start()); };
    document.addEventListener("visibilitychange", onVis);

    var rt = 0;
    var onResize = function () { clearTimeout(rt); rt = setTimeout(function () { engine.build(); paintStatic(); }, 180); };
    window.addEventListener("resize", onResize);

    return function () { stop(); if (io) io.disconnect(); document.removeEventListener("visibilitychange", onVis); window.removeEventListener("resize", onResize); clearTimeout(rt); };
  }

  function readOpts(el) {
    var d = el.dataset || {};
    var num = function (v, def) { var n = parseFloat(v); return isFinite(n) ? n : def; };
    return {
      density: num(d.density, 1),
      maxNodes: num(d.maxNodes, 90),
      fps: num(d.fps, 30),
      dprCap: num(d.dprCap, 1.5),
      linkDistance: num(d.linkDistance, 250),
      linkOpacity: num(d.linkOpacity, 1),
      palette: d.palette || "spectrum",
      speed: num(d.speed, 1)
    };
  }

  function autoMount() {
    var els = document.querySelectorAll("[data-grc-nodegraph]");
    for (var i = 0; i < els.length; i++) {
      if (els[i].__grcMounted) continue;
      els[i].__grcMounted = true;
      mount(els[i], readOpts(els[i]));
    }
  }

  window.GRCNodeGraph = { mount: mount };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMount);
  } else {
    autoMount();
  }
})();
