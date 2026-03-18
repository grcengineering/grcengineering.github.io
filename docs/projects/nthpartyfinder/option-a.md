---
title: "Nth Party Finder — Option A: Neon Night Club"
hide:
  - navigation
  - toc
---

<style>
/* === NEON NIGHT CLUB THEME === */
@keyframes neon-flicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
  20%, 24%, 55% { opacity: 0.6; }
}
@keyframes confetti-fall {
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(233, 69, 96, 0.3); }
  50% { box-shadow: 0 0 40px rgba(233, 69, 96, 0.6), 0 0 80px rgba(233, 69, 96, 0.2); }
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
@keyframes disco-bg {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes slide-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.npf-neon-page .md-content {
  max-width: 100%;
}

.npf-neon-hero {
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%);
  padding: 80px 40px;
  text-align: center;
  border-radius: 20px;
  margin: -20px -16px 40px -16px;
  position: relative;
  overflow: hidden;
}

.npf-neon-hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(233, 69, 96, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(88, 166, 255, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(126, 231, 135, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

/* Confetti particles */
.npf-confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  animation: confetti-fall linear infinite;
  pointer-events: none;
}

.npf-neon-title {
  font-size: 3.5em;
  font-weight: 900;
  background: linear-gradient(90deg, #e94560, #ff6b9d, #58a6ff, #7ee787, #e94560);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: disco-bg 4s ease infinite;
  margin: 0 0 8px 0;
  position: relative;
  z-index: 1;
}

.npf-neon-subtitle {
  color: #e94560;
  font-size: 1.3em;
  font-family: monospace;
  animation: neon-flicker 3s infinite;
  margin: 0 0 16px 0;
  position: relative;
  z-index: 1;
  text-shadow: 0 0 10px rgba(233, 69, 96, 0.5);
}

.npf-neon-tagline {
  color: #8892b0;
  font-size: 1.1em;
  max-width: 700px;
  margin: 0 auto 32px auto;
  position: relative;
  z-index: 1;
  line-height: 1.6;
}

.npf-neon-cta {
  display: inline-block;
  background: linear-gradient(135deg, #e94560, #ff6b9d);
  color: white !important;
  padding: 16px 40px;
  border-radius: 50px;
  font-size: 1.1em;
  font-weight: 700;
  text-decoration: none !important;
  animation: pulse-glow 2s ease-in-out infinite;
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
  letter-spacing: 1px;
}
.npf-neon-cta:hover {
  transform: scale(1.05);
}

.npf-neon-badges {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
}
.npf-neon-badge {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(233, 69, 96, 0.3);
  color: #ccc;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8em;
  font-family: monospace;
}

/* Section styling */
.npf-neon-section {
  margin: 48px 0;
  animation: slide-up 0.6s ease-out;
}
.npf-neon-section-title {
  font-size: 2em;
  text-align: center;
  margin-bottom: 8px;
}
.npf-neon-section-subtitle {
  text-align: center;
  color: #8892b0;
  font-size: 1em;
  margin-bottom: 40px;
}

/* Feature cards */
.npf-neon-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin: 32px 0;
}
.npf-neon-feature {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 1px solid rgba(233, 69, 96, 0.2);
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s ease;
}
.npf-neon-feature:hover {
  border-color: #e94560;
  box-shadow: 0 0 30px rgba(233, 69, 96, 0.15);
  transform: translateY(-4px);
}
.npf-neon-feature-icon {
  font-size: 2.5em;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}
.npf-neon-feature h3 {
  color: #e94560 !important;
  margin: 0 0 8px 0;
  font-size: 1.2em;
}
.npf-neon-feature p {
  color: #8892b0;
  font-size: 0.95em;
  line-height: 1.6;
  margin: 0;
}

/* How it works */
.npf-neon-steps {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 700px;
  margin: 0 auto;
}
.npf-neon-step {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  padding: 24px 0;
  position: relative;
}
.npf-neon-step:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 24px;
  top: 72px;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #e94560, transparent);
}
.npf-neon-step-num {
  min-width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #e94560, #ff6b9d);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3em;
  font-weight: 900;
  color: white;
  flex-shrink: 0;
}
.npf-neon-step-content h3 {
  color: #ff6b9d !important;
  margin: 0 0 4px 0;
}
.npf-neon-step-content p {
  color: #8892b0;
  margin: 0;
  line-height: 1.5;
}

/* Terminal mockup */
.npf-neon-terminal {
  background: #0a0a1a;
  border: 1px solid rgba(233, 69, 96, 0.3);
  border-radius: 12px;
  padding: 0;
  max-width: 700px;
  margin: 40px auto;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(233, 69, 96, 0.1);
}
.npf-neon-terminal-bar {
  background: #1a1a2e;
  padding: 10px 16px;
  display: flex;
  gap: 8px;
  align-items: center;
}
.npf-neon-terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.npf-neon-terminal-body {
  padding: 20px 24px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.8;
}
.npf-neon-terminal-body .cmd { color: #58a6ff; }
.npf-neon-terminal-body .flag { color: #ff6b9d; }
.npf-neon-terminal-body .val { color: #7ee787; }
.npf-neon-terminal-body .out { color: #8892b0; }
.npf-neon-terminal-body .ok { color: #7ee787; }
.npf-neon-terminal-body .party { color: #e94560; }
.npf-neon-terminal-body .prompt { color: #e94560; }

/* Install section */
.npf-neon-install-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin: 32px 0;
}
.npf-neon-install-card {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 1px solid rgba(88, 166, 255, 0.2);
  border-radius: 16px;
  padding: 28px;
  transition: all 0.3s ease;
}
.npf-neon-install-card:hover {
  border-color: #58a6ff;
  box-shadow: 0 0 25px rgba(88, 166, 255, 0.15);
}
.npf-neon-install-card h3 {
  color: #58a6ff !important;
  margin: 0 0 4px 0;
}
.npf-neon-install-card .rec {
  color: #7ee787;
  font-size: 0.8em;
  font-weight: 600;
}
.npf-neon-install-card p {
  color: #8892b0;
  font-size: 0.9em;
  margin: 8px 0;
}
.npf-neon-install-card code {
  background: #0a0a1a;
  color: #ff6b9d;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85em;
}
.npf-neon-install-card pre {
  background: #0a0a1a !important;
  padding: 12px 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 12px 0 0 0;
}
.npf-neon-install-card pre code {
  background: none;
  padding: 0;
  color: #7ee787;
}

/* Party crashers */
.npf-neon-crashers {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin: 24px 0;
}
.npf-neon-crasher {
  background: rgba(233, 69, 96, 0.1);
  border: 1px solid rgba(233, 69, 96, 0.3);
  color: #ff6b9d;
  padding: 8px 20px;
  border-radius: 25px;
  font-family: monospace;
  font-size: 0.9em;
  transition: all 0.3s ease;
}
.npf-neon-crasher:hover {
  background: rgba(233, 69, 96, 0.2);
  box-shadow: 0 0 15px rgba(233, 69, 96, 0.2);
}

/* Bottom CTA */
.npf-neon-bottom-cta {
  background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
  padding: 60px 40px;
  border-radius: 20px;
  text-align: center;
  margin: 60px 0 0 0;
  border: 1px solid rgba(233, 69, 96, 0.2);
}
.npf-neon-bottom-cta h2 {
  color: white !important;
  font-size: 2em;
  margin: 0 0 12px 0;
}
.npf-neon-bottom-cta p {
  color: #8892b0;
  margin: 0 0 24px 0;
}
.npf-neon-cta-row {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}
.npf-neon-cta-secondary {
  display: inline-block;
  background: transparent;
  border: 2px solid #58a6ff;
  color: #58a6ff !important;
  padding: 14px 36px;
  border-radius: 50px;
  font-size: 1em;
  font-weight: 700;
  text-decoration: none !important;
  transition: all 0.3s ease;
}
.npf-neon-cta-secondary:hover {
  background: rgba(88, 166, 255, 0.1);
  box-shadow: 0 0 20px rgba(88, 166, 255, 0.2);
}
</style>

<div class="npf-neon-page">

<!-- Confetti particles (CSS-only) -->
<div class="npf-neon-hero">
  <div class="npf-confetti" style="left: 5%; background: #e94560; animation-duration: 4s; animation-delay: 0s; width: 8px; height: 8px;"></div>
  <div class="npf-confetti" style="left: 15%; background: #58a6ff; animation-duration: 5s; animation-delay: 1s; width: 6px; height: 12px;"></div>
  <div class="npf-confetti" style="left: 25%; background: #7ee787; animation-duration: 4.5s; animation-delay: 0.5s; width: 10px; height: 6px;"></div>
  <div class="npf-confetti" style="left: 35%; background: #ff6b9d; animation-duration: 5.5s; animation-delay: 2s; width: 7px; height: 7px;"></div>
  <div class="npf-confetti" style="left: 45%; background: #ffd700; animation-duration: 4.2s; animation-delay: 1.5s; width: 9px; height: 5px;"></div>
  <div class="npf-confetti" style="left: 55%; background: #e94560; animation-duration: 5.2s; animation-delay: 0.8s; width: 6px; height: 10px;"></div>
  <div class="npf-confetti" style="left: 65%; background: #58a6ff; animation-duration: 4.8s; animation-delay: 2.5s; width: 8px; height: 8px;"></div>
  <div class="npf-confetti" style="left: 75%; background: #7ee787; animation-duration: 5.1s; animation-delay: 0.3s; width: 5px; height: 11px;"></div>
  <div class="npf-confetti" style="left: 85%; background: #ff6b9d; animation-duration: 4.6s; animation-delay: 1.8s; width: 10px; height: 7px;"></div>
  <div class="npf-confetti" style="left: 95%; background: #ffd700; animation-duration: 5.4s; animation-delay: 0.7s; width: 7px; height: 9px;"></div>

  <div style="font-size: 4em; margin-bottom: 16px;">🎉🔍🎊</div>
  <h1 class="npf-neon-title">Nth Party Finder</h1>
  <p class="npf-neon-subtitle">Every party has an Nth degree</p>
  <p class="npf-neon-tagline">A high-performance command line tool that maps your entire vendor party guest list — from third parties to the Nth degree — through DNS analysis. Built in Rust for speed, safety, and serious party-finding power.</p>
  <a href="https://github.com/grcengineering/nthpartyfinder" class="npf-neon-cta" target="_blank" rel="noopener noreferrer">Get the Party Started 🚀</a>
  <div class="npf-neon-badges">
    <span class="npf-neon-badge">🦀 Built in Rust</span>
    <span class="npf-neon-badge">⚡ Async & Fast</span>
    <span class="npf-neon-badge">🧠 Embedded NER</span>
    <span class="npf-neon-badge">📜 MIT License</span>
  </div>
</div>

<!-- WHO'S COMING TO THE PARTY? -->
<div class="npf-neon-section">
  <h2 class="npf-neon-section-title">🎈 Who's Coming to the Party?</h2>
  <p class="npf-neon-section-subtitle">Your vendors have vendors who have vendors. Time to find out who's really on the guest list.</p>

  <div class="npf-neon-features">
    <div class="npf-neon-feature">
      <div class="npf-neon-feature-icon">🔍</div>
      <h3>Comprehensive DNS Analysis</h3>
      <p>Analyzes DNS TXT records — SPF entries, domain verification strings, and more — to uncover vendor relationships hiding in plain sight.</p>
    </div>
    <div class="npf-neon-feature">
      <div class="npf-neon-feature-icon" style="animation-delay: 0.5s;">🔄</div>
      <h3>Recursive Discovery</h3>
      <p>The party doesn't stop at the 3rd. Configurable depth analysis or automatic discovery until it hits common denominators.</p>
    </div>
    <div class="npf-neon-feature">
      <div class="npf-neon-feature-icon" style="animation-delay: 1s;">🧠</div>
      <h3>Embedded NER</h3>
      <p>Optional GLiNER model for intelligent organization name extraction. Works completely offline — no API keys, no external services.</p>
    </div>
    <div class="npf-neon-feature">
      <div class="npf-neon-feature-icon" style="animation-delay: 1.5s;">🌐</div>
      <h3>Cross-Platform</h3>
      <p>Runs on Windows, macOS (Intel + Apple Silicon), and Linux. Docker image available for containerized workflows.</p>
    </div>
    <div class="npf-neon-feature">
      <div class="npf-neon-feature-icon" style="animation-delay: 2s;">📊</div>
      <h3>Multiple Export Formats</h3>
      <p>CSV, JSON, Markdown, and HTML output with detailed relationship mapping. Your data, your format.</p>
    </div>
    <div class="npf-neon-feature">
      <div class="npf-neon-feature-icon" style="animation-delay: 2.5s;">⚡</div>
      <h3>High Performance</h3>
      <p>Built in Rust with async processing, intelligent caching, and configurable parallelism. Finds parties fast.</p>
    </div>
  </div>
</div>

<!-- HOW THE PARTY GETS STARTED -->
<div class="npf-neon-section">
  <h2 class="npf-neon-section-title">🎤 How the Party Gets Started</h2>
  <p class="npf-neon-section-subtitle">From domain to full vendor map in seconds</p>

  <div class="npf-neon-steps">
    <div class="npf-neon-step">
      <div class="npf-neon-step-num">1</div>
      <div class="npf-neon-step-content">
        <h3>Send the Invites (DNS Query)</h3>
        <p>Point it at a domain. The tool queries DNS TXT records looking for SPF includes, domain verification tokens, and other vendor fingerprints.</p>
      </div>
    </div>
    <div class="npf-neon-step">
      <div class="npf-neon-step-num">2</div>
      <div class="npf-neon-step-content">
        <h3>Check the Guest List (Vendor Extraction)</h3>
        <p>Parses discovered records to identify vendor domains. WHOIS lookups resolve organizations. The NER model catches names that regex would miss.</p>
      </div>
    </div>
    <div class="npf-neon-step">
      <div class="npf-neon-step-num">3</div>
      <div class="npf-neon-step-content">
        <h3>Follow the Plus-Ones (Recursive Discovery)</h3>
        <p>Each discovered vendor gets the same treatment. Their DNS records reveal their vendors, and so on — mapping the full party tree.</p>
      </div>
    </div>
    <div class="npf-neon-step">
      <div class="npf-neon-step-num">4</div>
      <div class="npf-neon-step-content">
        <h3>Spot the Party Crashers (Termination)</h3>
        <p>Common infrastructure providers (AWS, Azure, Cloudflare) are flagged as "party crashers" — everyone uses them, so recursion stops there.</p>
      </div>
    </div>
    <div class="npf-neon-step">
      <div class="npf-neon-step-num">5</div>
      <div class="npf-neon-step-content">
        <h3>Print the Party Favors (Export)</h3>
        <p>Generates a comprehensive relationship map in your chosen format — CSV, JSON, Markdown, or HTML.</p>
      </div>
    </div>
  </div>

  <!-- Terminal demo -->
  <div class="npf-neon-terminal">
    <div class="npf-neon-terminal-bar">
      <div class="npf-neon-terminal-dot" style="background: #e94560;"></div>
      <div class="npf-neon-terminal-dot" style="background: #ffd700;"></div>
      <div class="npf-neon-terminal-dot" style="background: #7ee787;"></div>
      <span style="color: #8892b0; font-size: 12px; margin-left: 8px; font-family: monospace;">party-terminal</span>
    </div>
    <div class="npf-neon-terminal-body">
      <span class="prompt">$</span> <span class="cmd">nthpartyfinder</span> <span class="flag">--domain</span> <span class="val">acme.com</span> <span class="flag">--depth</span> <span class="val">3</span> <span class="flag">-f</span> <span class="val">json</span><br><br>
      <span class="out">🎉 === Party Analysis Summary === 🎉</span><br>
      <span class="out">Total vendor relationships found:</span> <span class="party">12</span><br>
      <span class="out">Maximum depth reached:</span> <span class="party">3 layers</span><br>
      <span class="out">Unique vendor domains:</span> <span class="party">8</span><br>
      <span class="out">Unique vendor organizations:</span> <span class="party">6</span><br>
      <span class="out">&nbsp;&nbsp;Layer 1 (3rd party):</span> <span class="val">4 vendors</span><br>
      <span class="out">&nbsp;&nbsp;Layer 2 (4th party):</span> <span class="val">5 vendors</span><br>
      <span class="out">&nbsp;&nbsp;Layer 3 (5th party):</span> <span class="val">3 vendors</span><br><br>
      <span class="ok">✓ Party mapped! Results exported to: acme_vendors.json</span>
    </div>
  </div>
</div>

<!-- PARTY CRASHERS -->
<div class="npf-neon-section">
  <h2 class="npf-neon-section-title">🚨 Party Crashers Detected</h2>
  <p class="npf-neon-section-subtitle">These common infrastructure vendors show up at everyone's party — recursion stops here to keep results meaningful.</p>

  <div class="npf-neon-crashers">
    <span class="npf-neon-crasher">☁️ AWS</span>
    <span class="npf-neon-crasher">🔷 Microsoft Azure</span>
    <span class="npf-neon-crasher">🌐 Google Cloud</span>
    <span class="npf-neon-crasher">🛡️ Cloudflare</span>
    <span class="npf-neon-crasher">⚡ Fastly</span>
    <span class="npf-neon-crasher">🌊 Akamai</span>
  </div>
</div>

<!-- GET THE PARTY STARTED (Install) -->
<div class="npf-neon-section">
  <h2 class="npf-neon-section-title">🎊 Get the Party Started</h2>
  <p class="npf-neon-section-subtitle">Three ways to RSVP — pick your vibe</p>

  <div class="npf-neon-install-grid">
    <div class="npf-neon-install-card">
      <h3>🐳 Docker</h3>
      <span class="rec">RECOMMENDED</span>
      <p>Pull the pre-built image with embedded NER and start scanning immediately.</p>
      <pre><code>docker pull ghcr.io/grcengineering/nthpartyfinder:latest

docker run -v $(pwd)/output:/output \
  nthpartyfinder -d example.com -r 2</code></pre>
    </div>
    <div class="npf-neon-install-card">
      <h3>📦 Pre-built Binaries</h3>
      <p>Download from <a href="https://github.com/grcengineering/nthpartyfinder/releases" style="color: #58a6ff;">GitHub Releases</a>. Available in <code>full</code> (~150MB with NER) or <code>slim</code> (~15MB) versions.</p>
      <p style="font-size: 0.85em;">Supports: Windows x86_64 · macOS Intel & Apple Silicon · Linux x86_64</p>
    </div>
    <div class="npf-neon-install-card">
      <h3>🦀 Build from Source</h3>
      <p>Clone, build, and customize. Requires Rust toolchain.</p>
      <pre><code>git clone https://github.com/grcengineering/nthpartyfinder.git
cd nthpartyfinder
cargo build --release</code></pre>
    </div>
  </div>
</div>

<!-- BOTTOM CTA -->
<div class="npf-neon-bottom-cta">
  <div style="font-size: 3em; margin-bottom: 16px;">🥳</div>
  <h2>Ready to Find Your Nth Party?</h2>
  <p>RSVP: Recursive Security Vendor Profiler</p>
  <div class="npf-neon-cta-row">
    <a href="https://github.com/grcengineering/nthpartyfinder" class="npf-neon-cta" target="_blank" rel="noopener noreferrer" style="animation: none;">View on GitHub 🎉</a>
    <a href="https://github.com/grcengineering/nthpartyfinder/releases" class="npf-neon-cta-secondary" target="_blank" rel="noopener noreferrer">Download Latest Release</a>
  </div>
  <p style="margin-top: 24px; font-size: 0.85em;"><strong>Developer:</strong> <a href="https://linkedin.com/in/justinpagano" style="color: #58a6ff;">Justin Pagano</a></p>
</div>

</div>
