import React, { useState } from 'react';
import './landing.css';

/**
 * Peacock Brand Logo Component
 * Combines Deep Teal (#0C4E4D) with Warm Gold (#EAA842) in a stylized feather / crown motif.
 */
export const PeacockLogo: React.FC<{ size?: number; showText?: boolean }> = ({ size = 42, showText = false }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', filter: 'drop-shadow(0 4px 10px rgba(12, 78, 77, 0.2))' }}
      aria-label="Peacock Brand Logo"
    >
      <defs>
        <linearGradient id="tealGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#177A77" />
          <stop offset="100%" stopColor="#0C4E4D" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F7CA75" />
          <stop offset="100%" stopColor="#EAA842" />
        </linearGradient>
        <radialGradient id="ocellusGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EAA842" />
          <stop offset="50%" stopColor="#0C4E4D" />
          <stop offset="100%" stopColor="#073534" />
        </radialGradient>
      </defs>

      {/* Fan Background Arcs (Peacock Tail Feathers) */}
      <path
        d="M20 75C20 45 35 20 50 12C65 20 80 45 80 75"
        stroke="url(#tealGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M28 80C30 55 40 30 50 22C60 30 70 55 72 80"
        stroke="url(#goldGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Outer Feather Plume */}
      <path
        d="M50 14C32 28 26 50 32 78C38 88 62 88 68 78C74 50 68 28 50 14Z"
        fill="url(#tealGrad)"
      />

      {/* Inner Peacock Feather Eye (Ocellus) */}
      <ellipse cx="50" cy="52" rx="14" ry="19" fill="#073534" />
      <ellipse cx="50" cy="53" rx="10" ry="14" fill="url(#goldGrad)" />
      <circle cx="50" cy="54" r="6.5" fill="#0C4E4D" />
      <circle cx="52" cy="52" r="2.2" fill="#FDFBF7" />

      {/* Crown Crest Filaments */}
      <circle cx="40" cy="12" r="3" fill="url(#goldGrad)" />
      <circle cx="50" cy="8" r="3.5" fill="url(#goldGrad)" />
      <circle cx="60" cy="12" r="3" fill="url(#goldGrad)" />
      <path d="M42 14L48 20M50 11.5V20M58 14L52 20" stroke="url(#goldGrad)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
    {showText && (
      <div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.4rem', color: '#0C4E4D', lineHeight: 1 }}>
          Saman Coach
        </div>
        <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: '#EAA842', textTransform: 'uppercase', fontWeight: 600 }}>
          Cultural AI Motion
        </div>
      </div>
    )}
  </div>
);

/**
 * Geometric Abstract Peacock Graphic Component
 * Clean SVG illustrating peacock curves, concentric feather arcs, and AI pose tracking nodes.
 */
export const PeacockCurvesGraphic: React.FC = () => (
  <svg
    viewBox="0 0 540 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', height: 'auto', maxHeight: '460px' }}
    aria-label="Abstract Peacock Curves & Pose Tracking Geometry"
  >
    <defs>
      <linearGradient id="curveGold" x1="0" y1="0" x2="500" y2="500" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F9D48C" />
        <stop offset="50%" stopColor="#EAA842" />
        <stop offset="100%" stopColor="#9E6819" />
      </linearGradient>
      <linearGradient id="curveTeal" x1="100" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E8B87" />
        <stop offset="50%" stopColor="#0C4E4D" />
        <stop offset="100%" stopColor="#062F2E" />
      </linearGradient>
      <radialGradient id="featherCore" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F9D48C" stopOpacity="0.8" />
        <stop offset="40%" stopColor="#0C4E4D" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#0C4E4D" stopOpacity="0" />
      </radialGradient>
      <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Concentric Aura Rings */}
    <circle cx="270" cy="250" r="220" stroke="#0C4E4D" strokeWidth="1" strokeDasharray="4 8" opacity="0.25" />
    <circle cx="270" cy="250" r="180" stroke="#EAA842" strokeWidth="1.2" strokeDasharray="6 6" opacity="0.35" />
    <circle cx="270" cy="250" r="140" fill="url(#featherCore)" />

    {/* Peacock Feathers Organic Radiating Curves */}
    <path
      d="M110 390C120 280 180 140 270 90C360 140 420 280 430 390"
      stroke="url(#curveTeal)"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.8"
    />
    <path
      d="M150 400C160 310 210 200 270 150C330 200 380 310 390 400"
      stroke="url(#curveGold)"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.9"
    />
    <path
      d="M190 410C205 340 235 250 270 210C305 250 335 340 350 410"
      stroke="url(#curveTeal)"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.6"
    />

    {/* Central Peacock Ocellus (Eye) */}
    <ellipse cx="270" cy="210" rx="48" ry="68" fill="url(#curveTeal)" filter="drop-shadow(0 12px 24px rgba(12,78,77,0.25))" />
    <ellipse cx="270" cy="215" rx="34" ry="48" fill="#062F2E" />
    <ellipse cx="270" cy="218" rx="24" ry="34" fill="url(#curveGold)" />
    <circle cx="270" cy="220" r="14" fill="#0C4E4D" />
    <circle cx="274" cy="216" r="5" fill="#FDFBF7" opacity="0.9" />

    {/* Stylized Saman Torso & Arm Skeleton Node Overlay */}
    <g opacity="0.95">
      {/* Spine / Head Node */}
      <line x1="270" y1="90" x2="270" y2="150" stroke="#EAA842" strokeWidth="2.5" />
      <circle cx="270" cy="90" r="7" fill="#EAA842" />

      {/* Shoulder Bar */}
      <line x1="200" y1="165" x2="340" y2="165" stroke="#EAA842" strokeWidth="3" />
      <circle cx="200" cy="165" r="6" fill="#0C4E4D" stroke="#EAA842" strokeWidth="2" />
      <circle cx="340" cy="165" r="6" fill="#0C4E4D" stroke="#EAA842" strokeWidth="2" />

      {/* Elbow to Chest Arms (Classic Saman Tepuk Dada pose) */}
      <line x1="200" y1="165" x2="160" y2="235" stroke="#0C4E4D" strokeWidth="2.5" />
      <line x1="160" y1="235" x2="245" y2="240" stroke="#EAA842" strokeWidth="2.5" strokeDasharray="3 3" />
      <circle cx="160" cy="235" r="5" fill="#EAA842" />
      <circle cx="245" cy="240" r="6" fill="#EAA842" />

      <line x1="340" y1="165" x2="380" y2="235" stroke="#0C4E4D" strokeWidth="2.5" />
      <line x1="380" y1="235" x2="295" y2="240" stroke="#EAA842" strokeWidth="2.5" strokeDasharray="3 3" />
      <circle cx="380" cy="235" r="5" fill="#EAA842" />
      <circle cx="295" cy="240" r="6" fill="#EAA842" />
    </g>

    {/* Floating Motion Trajectory Beads */}
    <circle cx="130" cy="180" r="4" fill="#EAA842" opacity="0.6" />
    <circle cx="410" cy="180" r="4" fill="#EAA842" opacity="0.6" />
    <circle cx="220" cy="70" r="5" fill="#0C4E4D" opacity="0.5" />
    <circle cx="320" cy="70" r="5" fill="#0C4E4D" opacity="0.5" />
  </svg>
);

export const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoActive, setDemoActive] = useState(true);

  return (
    <div className="pk-landing">
      {/* 1. STICKY NAVBAR */}
      <header className="pk-navbar">
        <div className="pk-container">
          <div className="pk-navbar-inner">
            {/* Logo Slot */}
            <a href="#/" className="pk-brand">
              <PeacockLogo size={38} />
              <div>
                <span className="pk-brand-title">Saman Coach</span>
                <span className="pk-brand-tag" style={{ marginLeft: '10px' }}>AI Motion</span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav>
              <ul className={`pk-nav-links ${mobileMenuOpen ? 'open' : ''}`}>
                <li>
                  <a href="#overview" className="pk-nav-link active" onClick={() => setMobileMenuOpen(false)}>
                    Overview
                  </a>
                </li>
                <li>
                  <a href="#features" className="pk-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    Features
                  </a>
                </li>
                <li>
                  <a href="#showcase" className="pk-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    Motion Engine
                  </a>
                </li>
                <li>
                  <a href="#/belajar" className="pk-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    Belajar
                  </a>
                </li>
                <li>
                  <a href="#/studio" className="pk-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    Studio
                  </a>
                </li>
              </ul>
            </nav>

            {/* Nav Actions / CTA */}
            <div className="pk-nav-actions">
              <a href="#/belajar" className="pk-btn pk-btn-gold">
                <span>Start Training</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                className="pk-mobile-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {mobileMenuOpen ? (
                    <path d="M18 6L6 18M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="overview" className="pk-hero">
        <div className="pk-container">
          <div className="pk-hero-grid">
            <div className="pk-hero-content">
              {/* Golden Badge Highlight */}
              <div className="pk-badge">
                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#EAA842' }} />
                <span>Next-Gen Computer Vision • Zero Server Uploads</span>
              </div>

              {/* Serif Main Header */}
              <h1 className="pk-h1 pk-hero-title">
                Master the Rhythms of Saman with <span className="gold-highlight">Precision AI</span>
              </h1>

              {/* High-Legibility Subtext */}
              <p className="pk-hero-lead">
                Transform any webcam into an intelligent dance mentor. Experience millisecond-accurate upper-body posture tracking and synchronized feedback for Aceh’s legendary Thousand Hands Dance—entirely private and processed locally in your browser.
              </p>

              {/* Dual CTA Buttons */}
              <div className="pk-hero-cta-group">
                <a href="#/belajar" className="pk-btn pk-btn-gold">
                  <span>Mulai Latihan Sekarang</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                  </svg>
                </a>
                <a href="#/studio" className="pk-btn pk-btn-outline-teal">
                  <span>Buka Authoring Studio</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                </a>
              </div>

              {/* Trust Metric Stats */}
              <div className="pk-hero-stats">
                <div className="pk-stat-item">
                  <b>100%</b>
                  <span>Private In-Browser</span>
                </div>
                <div className="pk-stat-item">
                  <b>&lt; 15ms</b>
                  <span>Pose Inference Latency</span>
                </div>
                <div className="pk-stat-item">
                  <b>UNESCO</b>
                  <span>Intangible Heritage</span>
                </div>
              </div>
            </div>

            {/* Hero Decorative Peacock Graphic Card */}
            <div className="pk-hero-visual">
              <div className="pk-peacock-art-card">
                <div className="pk-card-glow" />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34D399', boxShadow: '0 0 8px #34D399' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0C4E4D', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Kinematic Tracking Live
                    </span>
                  </div>
                  <span className="pk-badge-teal" style={{ padding: '3px 8px', fontSize: '0.75rem', borderRadius: '6px' }}>
                    60 FPS WebGL
                  </span>
                </div>

                {/* Abstract peacock geometry graphic */}
                <PeacockCurvesGraphic />

                <div style={{ marginTop: '16px', background: 'rgba(12, 78, 77, 0.04)', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#526765', fontWeight: 500 }}>Saman Gesture Focus</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0C4E4D' }}>Tepuk Dada & Gerak Singkih</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#EAA842' }}>98.4%</span>
                    <div style={{ fontSize: '0.75rem', color: '#526765' }}>Accuracy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES / VALUE PROPOSITION (3-Column Rounded Grid) */}
      <section id="features" className="pk-features">
        <div className="pk-container">
          <div className="pk-section-head">
            <span className="pk-badge">Intelligent Choreography</span>
            <h2 className="pk-h2">Architected for Cultural Precision</h2>
            <p>
              Combining ancient Indonesian performing arts with bleeding-edge browser machine learning. Practice, analyze, and preserve Saman with uncompromising fidelity.
            </p>
          </div>

          <div className="pk-features-grid">
            {/* Feature Card 1 */}
            <div className="pk-feature-card">
              <div className="pk-feature-top">
                <div className="pk-icon-box">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="5" r="3" />
                    <line x1="12" y1="8" x2="12" y2="14" />
                    <path d="M5 11l7 3 7-3" />
                    <path d="M6 19l6-2 6 2" />
                  </svg>
                </div>
                <span className="pk-badge">Edge AI</span>
              </div>
              <h3 className="pk-h3 pk-feature-title">Real-Time Pose Inference</h3>
              <p>
                Utilizes client-side MediaPipe Vision models to calculate 33 upper-body landmark coordinates instantly on CPU or GPU without sending a single frame across the network.
              </p>
              <a href="#/belajar" className="pk-feature-link">
                <span>Luncurkan Mode Belajar</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
            </div>

            {/* Feature Card 2 */}
            <div className="pk-feature-card">
              <div className="pk-feature-top">
                <div className="pk-icon-box">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <span className="pk-badge">Synchrony</span>
              </div>
              <h3 className="pk-h3 pk-feature-title">Micro-Timing Alignment</h3>
              <p>
                Dynamic time-warping and angle normalization compare student velocity with master reference dancers. Instantly visualizes whether hands, torso, and shoulders match the cadence.
              </p>
              <a href="#/belajar" className="pk-feature-link">
                <span>Lihat Metrik Evaluasi</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
            </div>

            {/* Feature Card 3 */}
            <div className="pk-feature-card">
              <div className="pk-feature-top">
                <div className="pk-icon-box">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <span className="pk-badge">Heritage</span>
              </div>
              <h3 className="pk-h3 pk-feature-title">Studio Authoring Suite</h3>
              <p>
                Teachers and dance studios can upload choreography video files to extract custom reference keyframes, adjust threshold tolerances, and export curriculum packages locally.
              </p>
              <a href="#/studio" className="pk-feature-link">
                <span>Jelajahi Studio Pembuat</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SHOWCASE / DARK TEAL BANNER SECTION */}
      <section id="showcase" className="pk-showcase">
        <div className="pk-container">
          <div className="pk-showcase-grid">
            <div>
              <span className="pk-badge pk-badge-dark">Under The Hood</span>
              <h2 className="pk-h2">Engineered for Frictionless Mastery</h2>
              <p className="pk-showcase-lead">
                Traditional Saman training requires arduous synchronous group repetition. Saman Coach bridges personal rehearsal and master mentorship with instantaneous mathematical feedback.
              </p>

              <ul className="pk-showcase-points">
                <li className="pk-showcase-point">
                  <div className="pk-point-check">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div className="pk-point-text">
                    <strong>Zero Setup & No Account Barrier</strong>
                    Open in any modern browser on desktop or tablet and grant camera access. No downloads, logins, or tracking pixels.
                  </div>
                </li>

                <li className="pk-showcase-point">
                  <div className="pk-point-check">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div className="pk-point-text">
                    <strong>Adaptive Scoring Thresholds</strong>
                    Switch seamlessly between Beginner, Practice, and Master Exam modes with customized angle tolerances.
                  </div>
                </li>

                <li className="pk-showcase-point">
                  <div className="pk-point-check">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div className="pk-point-text">
                    <strong>Autonomous Offline Capability</strong>
                    Cached Progressive Web App assets ensure full operability even in dance halls with limited internet connectivity.
                  </div>
                </li>
              </ul>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a href="#/belajar" className="pk-btn pk-btn-gold">
                  <span>Mulai Sesi Interaktif</span>
                </a>
                <button
                  type="button"
                  className="pk-btn pk-btn-outline-cream"
                  onClick={() => setDemoActive(!demoActive)}
                >
                  <span>{demoActive ? 'Pause Telemetry' : 'Resume Telemetry'}</span>
                </button>
              </div>
            </div>

            {/* Interactive Telemetry / Preview Card */}
            <div className="pk-interactive-preview">
              <div className="pk-preview-header">
                <div className="pk-preview-dots">
                  <span className="pk-preview-dot" style={{ background: '#EF4444' }} />
                  <span className="pk-preview-dot" style={{ background: '#F59E0B' }} />
                  <span className="pk-preview-dot" style={{ background: '#10B981' }} />
                </div>
                <div className="pk-preview-live-badge">
                  <span className="pk-live-dot" />
                  <span>Telemetry HUD</span>
                </div>
              </div>

              {/* Metric 1: Shoulder Angle Coherence */}
              <div className="pk-preview-metric-box">
                <div className="pk-metric-row">
                  <span style={{ fontSize: '0.88rem', color: '#DCE7E2' }}>Shoulder Inclination (Kemiringan Bahu)</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#EAA842' }}>
                    {demoActive ? '94.2%' : '88.0%'}
                  </span>
                </div>
                <div className="pk-metric-bar">
                  <div className="pk-metric-fill" style={{ width: demoActive ? '94%' : '88%' }} />
                </div>
              </div>

              {/* Metric 2: Elbow-to-Torso Proximity */}
              <div className="pk-preview-metric-box">
                <div className="pk-metric-row">
                  <span style={{ fontSize: '0.88rem', color: '#DCE7E2' }}>Elbow & Torso Rhythm (Ketepatan Siku)</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#EAA842' }}>
                    {demoActive ? '91.8%' : '82.5%'}
                  </span>
                </div>
                <div className="pk-metric-bar">
                  <div className="pk-metric-fill" style={{ width: demoActive ? '92%' : '82%' }} />
                </div>
              </div>

              {/* Metric 3: Head Alignment */}
              <div className="pk-preview-metric-box">
                <div className="pk-metric-row">
                  <span style={{ fontSize: '0.88rem', color: '#DCE7E2' }}>Head Tilt & Gaze (Arah Pandangan)</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#EAA842' }}>
                    {demoActive ? '97.0%' : '90.0%'}
                  </span>
                </div>
                <div className="pk-metric-bar">
                  <div className="pk-metric-fill" style={{ width: demoActive ? '97%' : '90%' }} />
                </div>
              </div>

              {/* Status summary pill */}
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(234, 168, 66, 0.1)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(234, 168, 66, 0.25)' }}>
                <span style={{ fontSize: '0.85rem', color: '#DCE7E2' }}>Overall Score Assessment:</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#EAA842', fontSize: '1.2rem' }}>
                  {demoActive ? 'Sangat Bagus (Excellent)' : 'Cukup (Fair)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER (Clean 4-Column Layout in Deep Teal with 10% Subtle Dividers) */}
      <footer className="pk-footer">
        <div className="pk-container">
          <div className="pk-footer-grid">
            {/* Col 1: Brand & Identity */}
            <div className="pk-footer-col">
              <PeacockLogo size={36} showText={false} />
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.25rem', color: '#FDFBF7', marginTop: '12px' }}>
                Saman Coach
              </div>
              <p>
                An open-access computer vision platform dedicated to the preservation, pedagogy, and celebration of the traditional Saman dance of the Gayo highlands, Aceh.
              </p>
              <div className="pk-social-links">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="pk-social-btn" aria-label="GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                </a>
                <a href="#/" className="pk-social-btn" aria-label="Web">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                </a>
              </div>
            </div>

            {/* Col 2: Platform Links */}
            <div className="pk-footer-col">
              <h4 className="pk-footer-title">Platform</h4>
              <ul className="pk-footer-links">
                <li><a href="#/belajar" className="pk-footer-link">Belajar (Learn Mode)</a></li>
                <li><a href="#/studio" className="pk-footer-link">Studio Choreographer</a></li>
                <li><a href="#overview" className="pk-footer-link">Pose Keyframe Library</a></li>
                <li><a href="#showcase" className="pk-footer-link">Real-time Telemetry</a></li>
              </ul>
            </div>

            {/* Col 3: Heritage & Science */}
            <div className="pk-footer-col">
              <h4 className="pk-footer-title">Heritage & Science</h4>
              <ul className="pk-footer-links">
                <li><a href="https://ich.unesco.org/en/RL/saman-dance-00509" target="_blank" rel="noreferrer" className="pk-footer-link">UNESCO Inscription</a></li>
                <li><a href="#overview" className="pk-footer-link">MediaPipe Vision Pipeline</a></li>
                <li><a href="#features" className="pk-footer-link">Kinematic Scoring Model</a></li>
                <li><a href="#privacy" className="pk-footer-link">Zero-Telemetry Privacy</a></li>
              </ul>
            </div>

            {/* Col 4: Newsletter & Contact */}
            <div className="pk-footer-col">
              <h4 className="pk-footer-title">Curriculum Updates</h4>
              <p style={{ marginTop: '0', marginBottom: '14px' }}>
                Receive notifications when new sanggar routines and choreographic packages are published.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Terima kasih! Anda telah terdaftar.'); }} className="pk-newsletter-form">
                <input
                  type="email"
                  placeholder="name@sanggar.id"
                  required
                  className="pk-input"
                  aria-label="Email address"
                />
                <button type="submit" className="pk-btn pk-btn-gold" style={{ padding: '10px 16px' }}>
                  <span>Join</span>
                </button>
              </form>
            </div>
          </div>

          {/* Footer Bottom Bar */}
          <div className="pk-footer-bottom">
            <div>
              &copy; {new Date().getFullYear()} Saman Coach. Developed with cultural reverence and modern client-side AI.
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span style={{ color: 'rgba(220, 231, 226, 0.4)' }}>
                Materi bawaan draf ilustrasi • Ambang skor eksperimental
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

