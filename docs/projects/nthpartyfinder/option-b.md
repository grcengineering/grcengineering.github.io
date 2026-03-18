---
title: "Nth Party Finder — Option B: Party Invitation"
hide:
  - navigation
  - toc
---

<style>
/* === PARTY INVITATION THEME === */
@keyframes balloon-float {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
}
@keyframes streamer-wave {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}
@keyframes gentle-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes sparkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

.npf-invite-hero {
  background: linear-gradient(135deg, #fff8e7 0%, #ffe4b5 40%, #ffd699 70%, #ffcc80 100%);
  padding: 80px 40px;
  text-align: center;
  border-radius: 20px;
  margin: -20px -16px 40px -16px;
  position: relative;
  overflow: hidden;
  border: 3px solid #f4a236;
  box-shadow: 0 8px 40px rgba(244, 162, 54, 0.2);
}

/* Decorative corner flourishes */
.npf-invite-hero::before,
.npf-invite-hero::after {
  content: '✦';
  position: absolute;
  font-size: 2em;
  color: #f4a236;
  opacity: 0.3;
  animation: sparkle 3s ease-in-out infinite;
}
.npf-invite-hero::before { top: 20px; left: 30px; }
.npf-invite-hero::after { top: 20px; right: 30px; animation-delay: 1.5s; }

.npf-invite-balloons {
  font-size: 3em;
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}
.npf-invite-balloons span {
  display: inline-block;
  animation: balloon-float 4s ease-in-out infinite;
}
.npf-invite-balloons span:nth-child(2) { animation-delay: 0.5s; }
.npf-invite-balloons span:nth-child(3) { animation-delay: 1s; }
.npf-invite-balloons span:nth-child(4) { animation-delay: 1.5s; }
.npf-invite-balloons span:nth-child(5) { animation-delay: 2s; }

.npf-invite-youre {
  font-family: 'Georgia', 'Palatino', serif;
  font-size: 1.2em;
  color: #b5651d;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin: 0 0 4px 0;
  position: relative;
  z-index: 1;
}

.npf-invite-title {
  font-family: 'Georgia', 'Palatino', serif;
  font-size: 3.5em;
  font-weight: 900;
  color: #8B4513 !important;
  margin: 0 0 4px 0;
  position: relative;
  z-index: 1;
  text-shadow: 2px 2px 0 rgba(244, 162, 54, 0.3);
}

.npf-invite-subtitle {
  font-family: 'Georgia', 'Palatino', serif;
  font-style: italic;
  font-size: 1.3em;
  color: #c17817;
  margin: 0 0 16px 0;
  position: relative;
  z-index: 1;
}

.npf-invite-desc {
  color: #6b4423;
  font-size: 1.05em;
  max-width: 650px;
  margin: 0 auto 32px auto;
  line-height: 1.7;
  position: relative;
  z-index: 1;
}

.npf-invite-cta {
  display: inline-block;
  background: linear-gradient(135deg, #e65100, #f4a236);
  color: white !important;
  padding: 16px 44px;
  border-radius: 50px;
  font-family: 'Georgia', 'Palatino', serif;
  font-size: 1.15em;
  font-weight: 700;
  text-decoration: none !important;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(230, 81, 0, 0.3);
  position: relative;
  z-index: 1;
}
.npf-invite-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(230, 81, 0, 0.4);
}

.npf-invite-badges {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
}
.npf-invite-badge {
  background: rgba(139, 69, 19, 0.08);
  border: 1px solid rgba(139, 69, 19, 0.2);
  color: #8B4513;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8em;
  font-family: 'Georgia', 'Palatino', serif;
}

/* Section */
.npf-invite-section {
  margin: 60px 0;
  animation: fade-in-up 0.6s ease-out;
}
.npf-invite-section-title {
  font-family: 'Georgia', 'Palatino', serif;
  font-size: 2em;
  text-align: center;
  color: #8B4513;
  margin-bottom: 8px;
}
.npf-invite-section-sub {
  text-align: center;
  color: #a0785a;
  font-family: 'Georgia', 'Palatino', serif;
  font-style: italic;
  font-size: 1em;
  margin-bottom: 40px;
}

/* Feature cards */
.npf-invite-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin: 32px 0;
}
.npf-invite-feature {
  background: linear-gradient(135deg, #fffaf0, #fff5e6);
  border: 2px solid #f4d9a0;
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s ease;
  text-align: center;
}
.npf-invite-feature:hover {
  border-color: #f4a236;
  box-shadow: 0 8px 30px rgba(244, 162, 54, 0.15);
  transform: translateY(-4px);
}
.npf-invite-feature-icon {
  font-size: 2.5em;
  margin-bottom: 16px;
  animation: gentle-bounce 3s ease-in-out infinite;
}
.npf-invite-feature h3 {
  color: #8B4513 !important;
  font-family: 'Georgia', 'Palatino', serif;
  margin: 0 0 8px 0;
}
.npf-invite-feature p {
  color: #6b4423;
  font-size: 0.95em;
  line-height: 1.6;
  margin: 0;
}

/* Timeline / how-it-works */
.npf-invite-timeline {
  max-width: 700px;
  margin: 0 auto;
  position: relative;
}
.npf-invite-timeline::before {
  content: '';
  position: absolute;
  left: 30px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #f4a236, #ffd699, #f4a236);
  border-radius: 3px;
}
.npf-invite-event {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  position: relative;
}
.npf-invite-event-dot {
  min-width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #fff8e7, #ffe4b5);
  border: 3px solid #f4a236;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  z-index: 1;
  flex-shrink: 0;
}
.npf-invite-event-content {
  background: linear-gradient(135deg, #fffaf0, #fff5e6);
  border: 2px solid #f4d9a0;
  border-radius: 12px;
  padding: 20px 24px;
  flex-grow: 1;
}
.npf-invite-event-content h3 {
  color: #8B4513 !important;
  font-family: 'Georgia', 'Palatino', serif;
  margin: 0 0 4px 0;
  font-size: 1.1em;
}
.npf-invite-event-content p {
  color: #6b4423;
  margin: 0;
  font-size: 0.95em;
  line-height: 1.5;
}

/* Terminal (warm-themed) */
.npf-invite-terminal {
  background: #2d1b0e;
  border: 3px solid #f4a236;
  border-radius: 16px;
  max-width: 700px;
  margin: 40px auto;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(139, 69, 19, 0.2);
}
.npf-invite-terminal-bar {
  background: #3d2b1e;
  padding: 10px 16px;
  display: flex;
  gap: 8px;
  align-items: center;
}
.npf-invite-terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.npf-invite-terminal-body {
  padding: 20px 24px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.8;
  color: #f4d9a0;
}
.npf-invite-terminal-body .cmd { color: #ffd699; }
.npf-invite-terminal-body .flag { color: #f4a236; }
.npf-invite-terminal-body .val { color: #7ee787; }
.npf-invite-terminal-body .out { color: #d4a574; }
.npf-invite-terminal-body .num { color: #ffcc80; }
.npf-invite-terminal-body .ok { color: #7ee787; }

/* Crashers */
.npf-invite-crashers {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin: 24px 0;
}
.npf-invite-crasher {
  background: rgba(139, 69, 19, 0.06);
  border: 2px solid #f4d9a0;
  color: #8B4513;
  padding: 8px 20px;
  border-radius: 25px;
  font-family: 'Georgia', 'Palatino', serif;
  font-size: 0.9em;
  transition: all 0.3s ease;
}
.npf-invite-crasher:hover {
  border-color: #f4a236;
  background: rgba(244, 162, 54, 0.1);
}

/* Install */
.npf-invite-install-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin: 32px 0;
}
.npf-invite-install-card {
  background: linear-gradient(135deg, #fffaf0, #fff5e6);
  border: 2px solid #f4d9a0;
  border-radius: 16px;
  padding: 28px;
  transition: all 0.3s ease;
}
.npf-invite-install-card:hover {
  border-color: #f4a236;
  box-shadow: 0 6px 25px rgba(244, 162, 54, 0.15);
}
.npf-invite-install-card h3 {
  color: #8B4513 !important;
  font-family: 'Georgia', 'Palatino', serif;
  margin: 0 0 4px 0;
}
.npf-invite-install-card .rec {
  color: #e65100;
  font-size: 0.8em;
  font-weight: 600;
  font-family: 'Georgia', 'Palatino', serif;
}
.npf-invite-install-card p {
  color: #6b4423;
  font-size: 0.9em;
  margin: 8px 0;
}
.npf-invite-install-card code {
  background: #2d1b0e;
  color: #ffd699;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85em;
}
.npf-invite-install-card pre {
  background: #2d1b0e !important;
  padding: 12px 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 12px 0 0 0;
}
.npf-invite-install-card pre code {
  background: none;
  padding: 0;
  color: #7ee787;
}

/* Bottom CTA */
.npf-invite-bottom-cta {
  background: linear-gradient(135deg, #fff8e7 0%, #ffe4b5 50%, #ffd699 100%);
  padding: 60px 40px;
  border-radius: 20px;
  text-align: center;
  margin: 60px 0 0 0;
  border: 3px solid #f4a236;
}
.npf-invite-bottom-cta h2 {
  color: #8B4513 !important;
  font-family: 'Georgia', 'Palatino', serif;
  font-size: 2em;
  margin: 0 0 12px 0;
}
.npf-invite-bottom-cta p {
  color: #6b4423;
  font-family: 'Georgia', 'Palatino', serif;
  font-style: italic;
  margin: 0 0 24px 0;
}
.npf-invite-cta-row {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}
.npf-invite-cta-secondary {
  display: inline-block;
  background: transparent;
  border: 2px solid #8B4513;
  color: #8B4513 !important;
  padding: 14px 36px;
  border-radius: 50px;
  font-family: 'Georgia', 'Palatino', serif;
  font-size: 1em;
  font-weight: 700;
  text-decoration: none !important;
  transition: all 0.3s ease;
}
.npf-invite-cta-secondary:hover {
  background: rgba(139, 69, 19, 0.1);
}
</style>

<div class="npf-invite-page">

<!-- HERO -->
<div class="npf-invite-hero">
  <div class="npf-invite-balloons">
    <span>🎈</span><span>🎈</span><span>🎈</span><span>🎈</span><span>🎈</span>
  </div>
  <p class="npf-invite-youre">You're Invited to Discover</p>
  <h1 class="npf-invite-title">Nth Party Finder</h1>
  <p class="npf-invite-subtitle">Every party has an Nth degree</p>
  <p class="npf-invite-desc">A high-performance command line tool that maps your entire vendor party guest list — from third parties to the Nth degree — through DNS analysis. Built in Rust for speed, safety, and serious party-finding power.</p>
  <a href="https://github.com/grcengineering/nthpartyfinder" class="npf-invite-cta" target="_blank" rel="noopener noreferrer">RSVP on GitHub 🎉</a>
  <div class="npf-invite-badges">
    <span class="npf-invite-badge">🦀 Built in Rust</span>
    <span class="npf-invite-badge">⚡ Async & Fast</span>
    <span class="npf-invite-badge">🧠 Embedded NER</span>
    <span class="npf-invite-badge">📜 MIT License</span>
  </div>
</div>

<!-- THE GUEST LIST -->
<div class="npf-invite-section">
  <h2 class="npf-invite-section-title">🎁 The Guest List</h2>
  <p class="npf-invite-section-sub">Your vendors have vendors who have vendors. Here's what this party planner brings to the table.</p>

  <div class="npf-invite-features">
    <div class="npf-invite-feature">
      <div class="npf-invite-feature-icon">🔍</div>
      <h3>Comprehensive DNS Analysis</h3>
      <p>Analyzes DNS TXT records — SPF entries, domain verification strings, and more — to uncover vendor relationships hiding in plain sight.</p>
    </div>
    <div class="npf-invite-feature">
      <div class="npf-invite-feature-icon" style="animation-delay: 0.5s;">🔄</div>
      <h3>Recursive Discovery</h3>
      <p>The party doesn't stop at the 3rd. Configurable depth analysis or automatic discovery until it hits common denominators.</p>
    </div>
    <div class="npf-invite-feature">
      <div class="npf-invite-feature-icon" style="animation-delay: 1s;">🧠</div>
      <h3>Embedded NER</h3>
      <p>Optional GLiNER model for intelligent organization name extraction. Works completely offline — no API keys, no external services.</p>
    </div>
    <div class="npf-invite-feature">
      <div class="npf-invite-feature-icon" style="animation-delay: 1.5s;">🌐</div>
      <h3>Cross-Platform</h3>
      <p>Runs on Windows, macOS (Intel + Apple Silicon), and Linux. Docker image available for containerized workflows.</p>
    </div>
    <div class="npf-invite-feature">
      <div class="npf-invite-feature-icon" style="animation-delay: 2s;">📊</div>
      <h3>Multiple Export Formats</h3>
      <p>CSV, JSON, Markdown, and HTML output with detailed relationship mapping. Your data, your format.</p>
    </div>
    <div class="npf-invite-feature">
      <div class="npf-invite-feature-icon" style="animation-delay: 2.5s;">⚡</div>
      <h3>High Performance</h3>
      <p>Built in Rust with async processing, intelligent caching, and configurable parallelism. Finds parties fast.</p>
    </div>
  </div>
</div>

<!-- THE PARTY PLAN -->
<div class="npf-invite-section">
  <h2 class="npf-invite-section-title">🗓️ The Party Plan</h2>
  <p class="npf-invite-section-sub">From domain to full vendor map, step by elegant step</p>

  <div class="npf-invite-timeline">
    <div class="npf-invite-event">
      <div class="npf-invite-event-dot">📨</div>
      <div class="npf-invite-event-content">
        <h3>Send the Invites</h3>
        <p>Point it at a domain. The tool queries DNS TXT records looking for SPF includes, domain verification tokens, and other vendor fingerprints.</p>
      </div>
    </div>
    <div class="npf-invite-event">
      <div class="npf-invite-event-dot">📋</div>
      <div class="npf-invite-event-content">
        <h3>Check the Guest List</h3>
        <p>Parses discovered records to identify vendor domains. WHOIS lookups resolve organizations. The NER model catches names that regex would miss.</p>
      </div>
    </div>
    <div class="npf-invite-event">
      <div class="npf-invite-event-dot">👯</div>
      <div class="npf-invite-event-content">
        <h3>Follow the Plus-Ones</h3>
        <p>Each discovered vendor gets the same treatment. Their DNS records reveal their vendors — mapping the full party tree to the Nth degree.</p>
      </div>
    </div>
    <div class="npf-invite-event">
      <div class="npf-invite-event-dot">🚫</div>
      <div class="npf-invite-event-content">
        <h3>Spot the Party Crashers</h3>
        <p>Common infrastructure providers (AWS, Azure, Cloudflare) are flagged — everyone uses them, so recursion stops there to keep results meaningful.</p>
      </div>
    </div>
    <div class="npf-invite-event">
      <div class="npf-invite-event-dot">🎁</div>
      <div class="npf-invite-event-content">
        <h3>Wrap the Party Favors</h3>
        <p>Generates a comprehensive relationship map in your chosen format — CSV, JSON, Markdown, or HTML.</p>
      </div>
    </div>
  </div>

  <!-- Terminal -->
  <div class="npf-invite-terminal">
    <div class="npf-invite-terminal-bar">
      <div class="npf-invite-terminal-dot" style="background: #e65100;"></div>
      <div class="npf-invite-terminal-dot" style="background: #f4a236;"></div>
      <div class="npf-invite-terminal-dot" style="background: #7ee787;"></div>
      <span style="color: #d4a574; font-size: 12px; margin-left: 8px; font-family: monospace;">party-planner</span>
    </div>
    <div class="npf-invite-terminal-body">
      <span style="color: #f4a236;">$</span> <span class="cmd">nthpartyfinder</span> <span class="flag">--domain</span> <span class="val">acme.com</span> <span class="flag">--depth</span> <span class="val">3</span> <span class="flag">-f</span> <span class="val">json</span><br><br>
      <span class="out">🎉 === Party Analysis Summary === 🎉</span><br>
      <span class="out">Total vendor relationships found:</span> <span class="num">12</span><br>
      <span class="out">Maximum depth reached:</span> <span class="num">3 layers</span><br>
      <span class="out">Unique vendor domains:</span> <span class="num">8</span><br>
      <span class="out">Unique vendor organizations:</span> <span class="num">6</span><br>
      <span class="out">&nbsp;&nbsp;Layer 1 (3rd party):</span> <span class="val">4 vendors</span><br>
      <span class="out">&nbsp;&nbsp;Layer 2 (4th party):</span> <span class="val">5 vendors</span><br>
      <span class="out">&nbsp;&nbsp;Layer 3 (5th party):</span> <span class="val">3 vendors</span><br><br>
      <span class="ok">✓ Party mapped! Results exported to: acme_vendors.json</span>
    </div>
  </div>
</div>

<!-- UNINVITED GUESTS -->
<div class="npf-invite-section">
  <h2 class="npf-invite-section-title">🚫 Uninvited Guests</h2>
  <p class="npf-invite-section-sub">These common infrastructure vendors show up at everyone's party — recursion stops here to keep results meaningful.</p>

  <div class="npf-invite-crashers">
    <span class="npf-invite-crasher">☁️ AWS</span>
    <span class="npf-invite-crasher">🔷 Microsoft Azure</span>
    <span class="npf-invite-crasher">🌐 Google Cloud</span>
    <span class="npf-invite-crasher">🛡️ Cloudflare</span>
    <span class="npf-invite-crasher">⚡ Fastly</span>
    <span class="npf-invite-crasher">🌊 Akamai</span>
  </div>
</div>

<!-- GET YOUR INVITATION -->
<div class="npf-invite-section">
  <h2 class="npf-invite-section-title">🎊 Get Your Invitation</h2>
  <p class="npf-invite-section-sub">Three ways to join the party — pick your favorite</p>

  <div class="npf-invite-install-grid">
    <div class="npf-invite-install-card">
      <h3>🐳 Docker</h3>
      <span class="rec">RECOMMENDED</span>
      <p>Pull the pre-built image with embedded NER and start scanning immediately.</p>
      <pre><code>docker pull ghcr.io/grcengineering/nthpartyfinder:latest

docker run -v $(pwd)/output:/output \
  nthpartyfinder -d example.com -r 2</code></pre>
    </div>
    <div class="npf-invite-install-card">
      <h3>📦 Pre-built Binaries</h3>
      <p>Download from <a href="https://github.com/grcengineering/nthpartyfinder/releases" style="color: #e65100;">GitHub Releases</a>. Available in <code>full</code> (~150MB with NER) or <code>slim</code> (~15MB) versions.</p>
      <p style="font-size: 0.85em;">Supports: Windows x86_64 · macOS Intel & Apple Silicon · Linux x86_64</p>
    </div>
    <div class="npf-invite-install-card">
      <h3>🦀 Build from Source</h3>
      <p>Clone, build, and customize. Requires Rust toolchain.</p>
      <pre><code>git clone https://github.com/grcengineering/nthpartyfinder.git
cd nthpartyfinder
cargo build --release</code></pre>
    </div>
  </div>
</div>

<!-- BOTTOM CTA -->
<div class="npf-invite-bottom-cta">
  <div style="font-size: 3em; margin-bottom: 16px;">🎂</div>
  <h2>Ready to Find Your Nth Party?</h2>
  <p>RSVP: Recursive Security Vendor Profiler</p>
  <div class="npf-invite-cta-row">
    <a href="https://github.com/grcengineering/nthpartyfinder" class="npf-invite-cta" target="_blank" rel="noopener noreferrer">RSVP on GitHub 🎉</a>
    <a href="https://github.com/grcengineering/nthpartyfinder/releases" class="npf-invite-cta-secondary" target="_blank" rel="noopener noreferrer">Download Latest Release</a>
  </div>
  <p style="margin-top: 24px; font-size: 0.85em;"><strong>Developer:</strong> <a href="https://linkedin.com/in/justinpagano" style="color: #8B4513;">Justin Pagano</a></p>
</div>

</div>
