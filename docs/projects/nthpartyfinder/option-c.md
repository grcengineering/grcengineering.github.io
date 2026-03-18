---
title: "Nth Party Finder — Option C: Developer Party"
hide:
  - navigation
  - toc
---

<style>
/* === DEVELOPER PARTY THEME === */
@keyframes typing-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
@keyframes subtle-confetti {
  0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
  10% { opacity: 0.6; }
  100% { transform: translateY(100px) rotate(360deg); opacity: 0; }
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes glow-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
@keyframes scan-line {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.npf-dev-hero {
  background: linear-gradient(135deg, #0d1117 0%, #161b22 40%, #1c2128 70%, #21262d 100%);
  padding: 80px 40px;
  text-align: center;
  border-radius: 20px;
  margin: -20px -16px 40px -16px;
  position: relative;
  overflow: hidden;
  border: 1px solid #30363d;
}

/* Subtle party confetti scattered in background */
.npf-dev-hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background:
    radial-gradient(circle at 10% 20%, rgba(88, 166, 255, 0.06) 0%, transparent 30%),
    radial-gradient(circle at 90% 80%, rgba(126, 231, 135, 0.06) 0%, transparent 30%),
    radial-gradient(circle at 50% 10%, rgba(255, 123, 114, 0.04) 0%, transparent 25%);
  pointer-events: none;
}

/* Tiny scattered emoji decorations */
.npf-dev-scatter {
  position: absolute;
  font-size: 14px;
  opacity: 0.15;
  pointer-events: none;
}

.npf-dev-emoji-row {
  font-size: 2em;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.npf-dev-title {
  font-size: 3em;
  font-weight: 900;
  color: #f0f6fc !important;
  margin: 0 0 4px 0;
  position: relative;
  z-index: 1;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
}

.npf-dev-subtitle {
  color: #58a6ff;
  font-size: 1.1em;
  font-family: 'Consolas', 'Monaco', monospace;
  margin: 0 0 20px 0;
  position: relative;
  z-index: 1;
}
.npf-dev-subtitle .cursor {
  animation: typing-cursor 1s infinite;
  color: #58a6ff;
}

.npf-dev-desc {
  color: #8b949e;
  font-size: 1.05em;
  max-width: 680px;
  margin: 0 auto 32px auto;
  line-height: 1.7;
  position: relative;
  z-index: 1;
}

.npf-dev-cta-row {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.npf-dev-cta-primary {
  display: inline-block;
  background: #238636;
  color: white !important;
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  text-decoration: none !important;
  transition: all 0.2s ease;
  border: 1px solid #2ea043;
}
.npf-dev-cta-primary:hover {
  background: #2ea043;
  box-shadow: 0 0 15px rgba(46, 160, 67, 0.3);
}

.npf-dev-cta-secondary {
  display: inline-block;
  background: #21262d;
  color: #c9d1d9 !important;
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  text-decoration: none !important;
  transition: all 0.2s ease;
  border: 1px solid #30363d;
}
.npf-dev-cta-secondary:hover {
  background: #30363d;
  border-color: #8b949e;
}

.npf-dev-badges {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 24px;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
}
.npf-dev-badge {
  background: rgba(88, 166, 255, 0.1);
  border: 1px solid rgba(88, 166, 255, 0.2);
  color: #8b949e;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.8em;
  font-family: monospace;
}

/* Section */
.npf-dev-section {
  margin: 56px 0;
  animation: fade-in 0.5s ease-out;
}
.npf-dev-section-title {
  font-size: 1.8em;
  color: #f0f6fc;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.npf-dev-section-title .party-emoji {
  font-size: 0.8em;
  opacity: 0.6;
}
.npf-dev-section-sub {
  color: #8b949e;
  font-size: 0.95em;
  margin-bottom: 32px;
}

/* Feature cards — GitHub-style */
.npf-dev-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 24px 0;
}
.npf-dev-feature {
  background: #0d1117;
  border: 1px solid #21262d;
  border-radius: 8px;
  padding: 24px;
  transition: all 0.2s ease;
}
.npf-dev-feature:hover {
  border-color: #58a6ff;
  box-shadow: 0 0 20px rgba(88, 166, 255, 0.08);
}
.npf-dev-feature-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.npf-dev-feature-icon {
  font-size: 1.5em;
}
.npf-dev-feature h3 {
  color: #58a6ff !important;
  margin: 0;
  font-size: 1em;
}
.npf-dev-feature p {
  color: #8b949e;
  font-size: 0.9em;
  line-height: 1.6;
  margin: 0;
}

/* How it works — code-comment style */
.npf-dev-howto {
  background: #0d1117;
  border: 1px solid #21262d;
  border-radius: 8px;
  max-width: 750px;
  margin: 0 auto;
  overflow: hidden;
}
.npf-dev-howto-header {
  background: #161b22;
  padding: 10px 16px;
  border-bottom: 1px solid #21262d;
  display: flex;
  align-items: center;
  gap: 8px;
}
.npf-dev-howto-dot {
  width: 12px; height: 12px; border-radius: 50%;
}
.npf-dev-howto-body {
  padding: 0;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 2;
}
.npf-dev-howto-line {
  display: flex;
  padding: 0 16px;
  transition: background 0.15s;
}
.npf-dev-howto-line:hover {
  background: rgba(88, 166, 255, 0.04);
}
.npf-dev-howto-num {
  color: #484f58;
  min-width: 40px;
  text-align: right;
  padding-right: 16px;
  user-select: none;
  border-right: 1px solid #21262d;
  margin-right: 16px;
}
.npf-dev-howto-code { flex: 1; }
.npf-dev-howto-code .comment { color: #8b949e; }
.npf-dev-howto-code .keyword { color: #ff7b72; }
.npf-dev-howto-code .fn { color: #d2a8ff; }
.npf-dev-howto-code .string { color: #a5d6ff; }
.npf-dev-howto-code .type { color: #7ee787; }
.npf-dev-howto-code .party { color: #ffa657; }
.npf-dev-howto-code .num { color: #79c0ff; }

/* Terminal */
.npf-dev-terminal {
  background: #0d1117;
  border: 1px solid #21262d;
  border-radius: 8px;
  max-width: 700px;
  margin: 32px auto;
  overflow: hidden;
}
.npf-dev-terminal-bar {
  background: #161b22;
  padding: 10px 16px;
  display: flex;
  gap: 8px;
  align-items: center;
  border-bottom: 1px solid #21262d;
}
.npf-dev-terminal-body {
  padding: 16px 20px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.8;
  color: #c9d1d9;
}
.npf-dev-terminal-body .prompt { color: #7ee787; }
.npf-dev-terminal-body .cmd { color: #f0f6fc; }
.npf-dev-terminal-body .flag { color: #79c0ff; }
.npf-dev-terminal-body .val { color: #a5d6ff; }
.npf-dev-terminal-body .out { color: #8b949e; }
.npf-dev-terminal-body .ok { color: #7ee787; }
.npf-dev-terminal-body .num { color: #ffa657; }

/* Crashers */
.npf-dev-crashers {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 20px 0;
}
.npf-dev-crasher {
  background: #0d1117;
  border: 1px solid #21262d;
  color: #8b949e;
  padding: 6px 16px;
  border-radius: 20px;
  font-family: monospace;
  font-size: 0.85em;
  transition: all 0.2s ease;
}
.npf-dev-crasher:hover {
  border-color: #ff7b72;
  color: #ff7b72;
}

/* Install */
.npf-dev-install-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin: 24px 0;
}
.npf-dev-install-card {
  background: #0d1117;
  border: 1px solid #21262d;
  border-radius: 8px;
  padding: 24px;
  transition: all 0.2s ease;
}
.npf-dev-install-card:hover {
  border-color: #30363d;
}
.npf-dev-install-card h3 {
  color: #f0f6fc !important;
  margin: 0 0 4px 0;
  font-size: 1.05em;
}
.npf-dev-install-card .rec {
  color: #7ee787;
  font-size: 0.75em;
  font-weight: 600;
  font-family: monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.npf-dev-install-card p {
  color: #8b949e;
  font-size: 0.9em;
  margin: 8px 0;
}
.npf-dev-install-card code {
  background: #161b22;
  color: #79c0ff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.85em;
}
.npf-dev-install-card pre {
  background: #161b22 !important;
  padding: 12px 16px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 12px 0 0 0;
  border: 1px solid #21262d;
}
.npf-dev-install-card pre code {
  background: none;
  padding: 0;
  color: #c9d1d9;
}

/* Bottom CTA */
.npf-dev-bottom-cta {
  background: #0d1117;
  border: 1px solid #21262d;
  padding: 48px 40px;
  border-radius: 8px;
  text-align: center;
  margin: 48px 0 0 0;
  position: relative;
  overflow: hidden;
}
.npf-dev-bottom-cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #238636, #58a6ff, #d2a8ff, #ff7b72, #ffa657);
}
.npf-dev-bottom-cta h2 {
  color: #f0f6fc !important;
  font-size: 1.8em;
  margin: 0 0 8px 0;
}
.npf-dev-bottom-cta p {
  color: #8b949e;
  margin: 0 0 24px 0;
  font-family: monospace;
}
</style>

<div class="npf-dev-page">

<!-- HERO -->
<div class="npf-dev-hero">
  <!-- Scattered party emojis as subtle easter eggs -->
  <span class="npf-dev-scatter" style="top: 12%; left: 8%;">🎉</span>
  <span class="npf-dev-scatter" style="top: 25%; right: 12%;">🎊</span>
  <span class="npf-dev-scatter" style="bottom: 20%; left: 15%;">🎈</span>
  <span class="npf-dev-scatter" style="top: 15%; right: 25%;">🥳</span>
  <span class="npf-dev-scatter" style="bottom: 15%; right: 8%;">🎉</span>
  <span class="npf-dev-scatter" style="top: 60%; left: 5%;">🎊</span>
  <span class="npf-dev-scatter" style="bottom: 40%; right: 18%;">🎈</span>

  <div class="npf-dev-emoji-row">🥳🦀</div>
  <h1 class="npf-dev-title">Nth Party Finder</h1>
  <p class="npf-dev-subtitle">// every party has an nth degree<span class="cursor">|</span></p>
  <p class="npf-dev-desc">A high-performance CLI that maps your entire vendor party guest list — from third parties to the Nth degree — through DNS analysis. Built in Rust for speed, safety, and serious party-finding power.</p>
  <div class="npf-dev-cta-row">
    <a href="https://github.com/grcengineering/nthpartyfinder" class="npf-dev-cta-primary" target="_blank" rel="noopener noreferrer">⭐ Star on GitHub</a>
    <a href="https://github.com/grcengineering/nthpartyfinder/releases" class="npf-dev-cta-secondary" target="_blank" rel="noopener noreferrer">📦 Download</a>
  </div>
  <div class="npf-dev-badges">
    <span class="npf-dev-badge">🦀 rust</span>
    <span class="npf-dev-badge">⚡ async</span>
    <span class="npf-dev-badge">🧠 ner</span>
    <span class="npf-dev-badge">📜 mit</span>
  </div>
</div>

<!-- FEATURES -->
<div class="npf-dev-section">
  <h2 class="npf-dev-section-title">Features <span class="party-emoji">🎈</span></h2>
  <p class="npf-dev-section-sub">Your vendors have vendors who have vendors. Time to find out who's really on the guest list.</p>

  <div class="npf-dev-features">
    <div class="npf-dev-feature">
      <div class="npf-dev-feature-header">
        <span class="npf-dev-feature-icon">🔍</span>
        <h3>DNS Analysis</h3>
      </div>
      <p>Analyzes DNS TXT records — SPF entries, domain verification strings, and more — to uncover vendor relationships hiding in plain sight.</p>
    </div>
    <div class="npf-dev-feature">
      <div class="npf-dev-feature-header">
        <span class="npf-dev-feature-icon">🔄</span>
        <h3>Recursive Discovery</h3>
      </div>
      <p>The party doesn't stop at the 3rd. Configurable depth or auto-discovery until it hits common denominators.</p>
    </div>
    <div class="npf-dev-feature">
      <div class="npf-dev-feature-header">
        <span class="npf-dev-feature-icon">🧠</span>
        <h3>Embedded NER</h3>
      </div>
      <p>Optional GLiNER model for intelligent org name extraction. Works offline — no API keys needed.</p>
    </div>
    <div class="npf-dev-feature">
      <div class="npf-dev-feature-header">
        <span class="npf-dev-feature-icon">🌐</span>
        <h3>Cross-Platform</h3>
      </div>
      <p>Windows, macOS (Intel + Apple Silicon), Linux. Docker image available.</p>
    </div>
    <div class="npf-dev-feature">
      <div class="npf-dev-feature-header">
        <span class="npf-dev-feature-icon">📊</span>
        <h3>Export Formats</h3>
      </div>
      <p>CSV, JSON, Markdown, and HTML output with detailed relationship mapping.</p>
    </div>
    <div class="npf-dev-feature">
      <div class="npf-dev-feature-header">
        <span class="npf-dev-feature-icon">⚡</span>
        <h3>High Performance</h3>
      </div>
      <p>Async Rust with intelligent caching and configurable parallelism. Finds parties fast.</p>
    </div>
  </div>
</div>

<!-- HOW IT WORKS — styled like a code file -->
<div class="npf-dev-section">
  <h2 class="npf-dev-section-title">How It Works <span class="party-emoji">🎊</span></h2>
  <p class="npf-dev-section-sub">The party-finding algorithm, explained</p>

  <div class="npf-dev-howto">
    <div class="npf-dev-howto-header">
      <div class="npf-dev-howto-dot" style="background: #ff7b72;"></div>
      <div class="npf-dev-howto-dot" style="background: #ffa657;"></div>
      <div class="npf-dev-howto-dot" style="background: #7ee787;"></div>
      <span style="color: #8b949e; font-size: 12px; margin-left: 8px;">party_finder.rs</span>
    </div>
    <div class="npf-dev-howto-body">
      <div class="npf-dev-howto-line"><span class="npf-dev-howto-num">1</span><span class="npf-dev-howto-code"><span class="comment">// 🎉 Step 1: Send the invites</span></span></div>
      <div class="npf-dev-howto-line"><span class="npf-dev-howto-num">2</span><span class="npf-dev-howto-code"><span class="keyword">let</span> records = <span class="fn">query_dns_txt</span>(<span class="string">"acme.com"</span>).<span class="keyword">await</span>;</span></div>
      <div class="npf-dev-howto-line"><span class="npf-dev-howto-num">3</span><span class="npf-dev-howto-code"></span></div>
      <div class="npf-dev-howto-line"><span class="npf-dev-howto-num">4</span><span class="npf-dev-howto-code"><span class="comment">// 📋 Step 2: Check the guest list</span></span></div>
      <div class="npf-dev-howto-line"><span class="npf-dev-howto-num">5</span><span class="npf-dev-howto-code"><span class="keyword">let</span> vendors = <span class="fn">extract_vendor_domains</span>(&records);</span></div>
      <div class="npf-dev-howto-line"><span class="npf-dev-howto-num">6</span><span class="npf-dev-howto-code"><span class="keyword">let</span> orgs = <span class="fn">whois_lookup</span>(&vendors).<span class="keyword">await</span>;</span></div>
      <div class="npf-dev-howto-line"><span class="npf-dev-howto-num">7</span><span class="npf-dev-howto-code"></span></div>
      <div class="npf-dev-howto-line"><span class="npf-dev-howto-num">8</span><span class="npf-dev-howto-code"><span class="comment">// 👯 Step 3: Follow the plus-ones</span></span></div>
      <div class="npf-dev-howto-line"><span class="npf-dev-howto-num">9</span><span class="npf-dev-howto-code"><span class="keyword">for</span> vendor <span class="keyword">in</span> &vendors {</span></div>
      <div class="npf-dev-howto-line"><span class="npf-dev-howto-num">10</span><span class="npf-dev-howto-code">&nbsp;&nbsp;<span class="fn">discover_nth_parties</span>(vendor, depth + <span class="num">1</span>);</span></div>
      <div class="npf-dev-howto-line"><span class="npf-dev-howto-num">11</span><span class="npf-dev-howto-code">}</span></div>
      <div class="npf-dev-howto-line"><span class="npf-dev-howto-num">12</span><span class="npf-dev-howto-code"></span></div>
      <div class="npf-dev-howto-line"><span class="npf-dev-howto-num">13</span><span class="npf-dev-howto-code"><span class="comment">// 🚨 Step 4: Bounce the party crashers</span></span></div>
      <div class="npf-dev-howto-line"><span class="npf-dev-howto-num">14</span><span class="npf-dev-howto-code"><span class="keyword">if</span> <span class="type">COMMON_INFRA</span>.<span class="fn">contains</span>(&vendor) { <span class="keyword">continue</span>; }</span></div>
      <div class="npf-dev-howto-line"><span class="npf-dev-howto-num">15</span><span class="npf-dev-howto-code"></span></div>
      <div class="npf-dev-howto-line"><span class="npf-dev-howto-num">16</span><span class="npf-dev-howto-code"><span class="comment">// 🎁 Step 5: Hand out the party favors</span></span></div>
      <div class="npf-dev-howto-line"><span class="npf-dev-howto-num">17</span><span class="npf-dev-howto-code"><span class="fn">export</span>(results, <span class="type">Format</span>::<span class="party">Json</span>);</span></div>
    </div>
  </div>

  <!-- Terminal demo -->
  <div class="npf-dev-terminal">
    <div class="npf-dev-terminal-bar">
      <div class="npf-dev-howto-dot" style="background: #ff7b72;"></div>
      <div class="npf-dev-howto-dot" style="background: #ffa657;"></div>
      <div class="npf-dev-howto-dot" style="background: #7ee787;"></div>
      <span style="color: #8b949e; font-size: 12px; margin-left: 8px;">zsh</span>
    </div>
    <div class="npf-dev-terminal-body">
      <span class="prompt">❯</span> <span class="cmd">nthpartyfinder</span> <span class="flag">--domain</span> <span class="val">acme.com</span> <span class="flag">--depth</span> <span class="val">3</span> <span class="flag">-f</span> <span class="val">json</span><br><br>
      <span class="out">=== Analysis Summary ===</span><br>
      <span class="out">Total vendor relationships found:</span> <span class="num">12</span><br>
      <span class="out">Maximum depth reached:</span> <span class="num">3 layers</span><br>
      <span class="out">Unique vendor domains:</span> <span class="num">8</span><br>
      <span class="out">Unique vendor organizations:</span> <span class="num">6</span><br>
      <span class="out">&nbsp;&nbsp;Layer 1 vendors:</span> <span class="num">4</span><br>
      <span class="out">&nbsp;&nbsp;Layer 2 vendors:</span> <span class="num">5</span><br>
      <span class="out">&nbsp;&nbsp;Layer 3 vendors:</span> <span class="num">3</span><br><br>
      <span class="ok">✓ Results exported to: acme_vendors.json</span>
    </div>
  </div>
</div>

<!-- PARTY CRASHERS -->
<div class="npf-dev-section">
  <h2 class="npf-dev-section-title">Common Denominators <span class="party-emoji">🚨</span></h2>
  <p class="npf-dev-section-sub">a.k.a. "party crashers" — these show up everywhere, so recursion stops here</p>

  <div class="npf-dev-crashers">
    <span class="npf-dev-crasher">aws</span>
    <span class="npf-dev-crasher">azure</span>
    <span class="npf-dev-crasher">gcp</span>
    <span class="npf-dev-crasher">cloudflare</span>
    <span class="npf-dev-crasher">fastly</span>
    <span class="npf-dev-crasher">akamai</span>
  </div>
</div>

<!-- INSTALL -->
<div class="npf-dev-section">
  <h2 class="npf-dev-section-title">Installation <span class="party-emoji">🎊</span></h2>
  <p class="npf-dev-section-sub">Three ways to get the party started</p>

  <div class="npf-dev-install-grid">
    <div class="npf-dev-install-card">
      <h3>🐳 Docker</h3>
      <span class="rec">recommended</span>
      <p>Pre-built image with embedded NER.</p>
      <pre><code>docker pull ghcr.io/grcengineering/nthpartyfinder:latest

docker run -v $(pwd)/output:/output \
  nthpartyfinder -d example.com -r 2</code></pre>
    </div>
    <div class="npf-dev-install-card">
      <h3>📦 Pre-built Binaries</h3>
      <p>Download from <a href="https://github.com/grcengineering/nthpartyfinder/releases" style="color: #58a6ff;">Releases</a>. Available as <code>full</code> (~150MB) or <code>slim</code> (~15MB).</p>
      <p style="font-size: 0.85em;">windows-x86_64 · macos-x86_64 · macos-aarch64 · linux-x86_64</p>
    </div>
    <div class="npf-dev-install-card">
      <h3>🦀 From Source</h3>
      <p>Clone and build. Requires Rust toolchain.</p>
      <pre><code>git clone https://github.com/grcengineering/nthpartyfinder.git
cd nthpartyfinder
cargo build --release</code></pre>
    </div>
  </div>
</div>

<!-- BOTTOM CTA -->
<div class="npf-dev-bottom-cta">
  <div style="font-size: 2.5em; margin-bottom: 12px;">🥳</div>
  <h2>Find your Nth party</h2>
  <p>// RSVP: recursive security vendor profiler</p>
  <div class="npf-dev-cta-row">
    <a href="https://github.com/grcengineering/nthpartyfinder" class="npf-dev-cta-primary" target="_blank" rel="noopener noreferrer">⭐ Star on GitHub</a>
    <a href="https://github.com/grcengineering/nthpartyfinder/releases" class="npf-dev-cta-secondary" target="_blank" rel="noopener noreferrer">📦 Download Latest</a>
  </div>
  <p style="margin-top: 20px; font-size: 0.85em; color: #8b949e;"><strong>Developer:</strong> <a href="https://linkedin.com/in/justinpagano" style="color: #58a6ff;">Justin Pagano</a></p>
</div>

</div>
