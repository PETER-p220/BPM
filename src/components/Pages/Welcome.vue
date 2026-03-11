<template>
  <div class="page">

    <!-- NAV -->
    <header class="nav" :class="{ 'nav--solid': scrolled }">
      <div class="nav__inner">
        <div class="nav__logo">
          <div class="nav__logo-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="0" y="0" width="9" height="9" fill="white"/>
              <rect x="11" y="0" width="9" height="9" fill="white" opacity="0.5"/>
              <rect x="0" y="11" width="9" height="9" fill="white" opacity="0.5"/>
              <rect x="11" y="11" width="9" height="9" fill="white"/>
            </svg>
          </div>
          <span class="nav__logo-text">BPM<em>System</em></span>
        </div>
        <nav class="nav__links">
          <button @click="go('features')">Features</button>
          <button @click="go('modules')">Modules</button>
          <button @click="go('about')">About</button>
        </nav>
        <router-link to="/login" class="nav__cta">Login →</router-link>
        <button class="nav__burger" @click="menu = !menu">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="nav__mobile" v-if="menu">
        <button @click="go('features'); menu=false">Features</button>
        <button @click="go('modules'); menu=false">Modules</button>
        <button @click="go('about'); menu=false">About</button>
        <router-link to="/login" @click="menu=false">Login</router-link>
      </div>
    </header>

    <!-- HERO -->
    <section class="hero">
      <div class="hero__bg">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&q=85&fit=crop&auto=format" alt="" />
        <div class="hero__overlay"></div>
      </div>
      <div class="hero__content">
        <div class="hero__pill">
          <span class="hero__pill-dot"></span>
          Enterprise Platform · 2026
        </div>
        <h1 class="hero__title">
          The Operating System<br/>
          <span class="hero__title-gold">For Your Business.</span>
        </h1>
        <p class="hero__sub">
          Manage projects, tenders, finance, and people — all from one unified dashboard. Built for organizations that demand clarity and control.
        </p>
        <div class="hero__actions">
          <router-link to="/login" class="btn btn--gold">Get Started →</router-link>
          <button @click="go('features')" class="btn btn--ghost">Explore Features</button>
        </div>
        <div class="hero__stats">
          <div class="hstat"><strong>1,000+</strong><span>Active Users</span></div>
          <div class="hstat-line"></div>
          <div class="hstat"><strong>500+</strong><span>Projects Tracked</span></div>
          <div class="hstat-line"></div>
          <div class="hstat"><strong>99%</strong><span>Satisfaction Rate</span></div>
        </div>
      </div>
      <div class="hero__scroll-hint">
        <div class="hero__scroll-bar"></div>
        <span>Scroll</span>
      </div>
    </section>

    <!-- TICKER -->
    <div class="ticker">
      <div class="ticker__track">
        <template v-for="n in 3" :key="n">
          <span>Project Management</span><span class="tdot">✦</span>
          <span>Tender Control</span><span class="tdot">✦</span>
          <span>Financial Oversight</span><span class="tdot">✦</span>
          <span>HR &amp; Payroll</span><span class="tdot">✦</span>
          <span>Real-time Analytics</span><span class="tdot">✦</span>
          <span>Document Management</span><span class="tdot">✦</span>
          <span>CEO Dashboard</span><span class="tdot">✦</span>
        </template>
      </div>
    </div>

    <!-- FEATURES -->
    <section id="features" class="sec sec--cream">
      <div class="wrap">
        <div class="sec__head">
          <div>
            <p class="eyebrow">— Core Features</p>
            <h2 class="h2">Everything your<br/>organization needs.</h2>
          </div>
          <p class="sec__desc">A fully integrated platform designed for modern enterprises. One powerful, unified system giving every stakeholder exactly what they need — nothing more, nothing less.</p>
        </div>
        <div class="feat-grid">
          <div class="feat-card" v-for="(f, i) in features" :key="i">
            <div class="feat-card__top">
              <div class="feat-card__icon"><i :class="f.icon"></i></div>
              <span class="feat-card__num">{{ String(i+1).padStart(2,'0') }}</span>
            </div>
            <h3 class="feat-card__title">{{ f.title }}</h3>
            <p class="feat-card__desc">{{ f.desc }}</p>
            <div class="feat-card__line"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- PHOTO STRIP -->
    <div class="strip">
      <div class="strip__item" v-for="p in photos" :key="p.label">
        <img :src="p.src" :alt="p.label" />
        <div class="strip__label">{{ p.label }}</div>
      </div>
    </div>

    <!-- MODULES -->
    <section id="modules" class="sec sec--navy">
      <div class="wrap">
        <div class="sec__head sec__head--inv">
          <div>
            <p class="eyebrow eyebrow--inv">— System Modules</p>
            <h2 class="h2 h2--inv">Built for every<br/>role &amp; function.</h2>
          </div>
          <p class="sec__desc sec__desc--inv">Role-specific portals surface exactly the right information for each stakeholder — no noise, no friction.</p>
        </div>
        <div class="mod-grid">
          <div class="mod-card" v-for="(m, i) in modules" :key="i">
            <div class="mod-card__icon"><i :class="m.icon"></i></div>
            <h3 class="mod-card__title">{{ m.title }}</h3>
            <p class="mod-card__desc">{{ m.desc }}</p>
            <div class="mod-card__tags">
              <span v-for="t in m.tags" :key="t">{{ t }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="stats-sec">
      <div class="stats-sec__bg">
        <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1800&q=80&fit=crop&auto=format" alt="" />
        <div class="stats-sec__overlay"></div>
      </div>
      <div class="wrap stats-sec__inner">
        <div class="stats-grid">
          <div class="stat-box" v-for="s in stats" :key="s.label">
            <div class="stat-box__num">{{ s.value }}</div>
            <div class="stat-box__label">{{ s.label }}</div>
            <div class="stat-box__bar"><div class="stat-box__fill" :style="{width: s.pct}"></div></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ABOUT -->
    <section id="about" class="sec sec--white">
      <div class="wrap">
        <div class="about-grid">
          <div class="about-imgs">
            <div class="about-imgs__main">
              <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=85&fit=crop&auto=format" alt="Team" />
              <div class="about-imgs__badge">
                <span>Est.</span>
                <strong>2020</strong>
              </div>
            </div>
            <div class="about-imgs__sub">
              <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=500&q=85&fit=crop&auto=format" alt="Strategy" />
            </div>
          </div>
          <div class="about-text">
            <p class="eyebrow">— About the Platform</p>
            <h2 class="h2">One system.<br/>Total clarity.</h2>
            <p class="about-text__para">Our BPM system was built to eliminate the chaos of disconnected tools. By unifying every critical business function — from project delivery to financial oversight — we give leadership and teams a single source of truth.</p>
            <div class="pillars">
              <div class="pillar" v-for="p in pillars" :key="p.title">
                <div class="pillar__icon"><i :class="p.icon"></i></div>
                <div>
                  <h4>{{ p.title }}</h4>
                  <p>{{ p.desc }}</p>
                </div>
              </div>
            </div>
            <router-link to="/login" class="btn btn--navy">Access Platform →</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-sec">
      <div class="cta-sec__bg">
        <img src="https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1800&q=80&fit=crop&auto=format" alt="" />
        <div class="cta-sec__overlay"></div>
      </div>
      <div class="wrap cta-sec__inner">
        <p class="eyebrow eyebrow--inv">— Get Started Today</p>
        <h2 class="cta-sec__title">Ready to transform<br/>how your business runs?</h2>
        <p class="cta-sec__sub">Join thousands of organizations already operating at peak efficiency.</p>
        <div class="cta-sec__btns">
          <router-link to="/login" class="btn btn--gold">Get Started Now →</router-link>
          <button class="btn btn--ghost">Contact Sales</button>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="wrap">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-brand__logo">
              <div class="footer-brand__icon">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <rect x="0" y="0" width="9" height="9" fill="white"/>
                  <rect x="11" y="0" width="9" height="9" fill="white" opacity="0.4"/>
                  <rect x="0" y="11" width="9" height="9" fill="white" opacity="0.4"/>
                  <rect x="11" y="11" width="9" height="9" fill="white"/>
                </svg>
              </div>
              <span>BPM System</span>
            </div>
            <p>Enterprise-grade business process management for modern organizations.</p>
          </div>
          <div class="footer-col" v-for="col in footerCols" :key="col.title">
            <h4>{{ col.title }}</h4>
            <ul>
              <li v-for="l in col.links" :key="l"><a href="#">{{ l }}</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 BPM System. All rights reserved.</span>
          <span>Enterprise Business Process Management</span>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)
const menu = ref(false)
const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }
const onScroll = () => { scrolled.value = window.scrollY > 50 }
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const features = [
  { icon: 'fas fa-tachometer-alt', title: 'Real-time Dashboard', desc: 'Live KPIs and business metrics across every department, updated the moment data changes.' },
  { icon: 'fas fa-project-diagram', title: 'Project Management', desc: 'Plan, assign, and track every milestone from kickoff to delivery with full visibility.' },
  { icon: 'fas fa-handshake', title: 'Tender Management', desc: 'Centralize bids, contracts, and vendor relationships into one seamless workflow.' },
  { icon: 'fas fa-calculator', title: 'Budget Control', desc: 'Track expenditures in real-time and maintain complete financial accountability.' },
  { icon: 'fas fa-users-cog', title: 'HR Management', desc: 'Manage employee lifecycle, leave policies, and performance evaluations with ease.' },
  { icon: 'fas fa-file-alt', title: 'Document Control', desc: 'Secure, version-controlled document storage with instant team sharing capabilities.' },
]

const photos = [
  { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&fit=crop&auto=format', label: 'Team Collaboration' },
  { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&fit=crop&auto=format', label: 'Analytics & Reports' },
  { src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80&fit=crop&auto=format', label: 'Financial Oversight' },
  { src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80&fit=crop&auto=format', label: 'Executive Clarity' },
]

const modules = [
  { icon: 'fas fa-crown', title: 'CEO Dashboard', desc: 'Strategic oversight with board-level analytics, budget control, and performance reports.', tags: ['Budget', 'Analytics', 'Strategy'] },
  { icon: 'fas fa-user-tie', title: 'HOD Portal', desc: 'Department heads manage teams, allocate resources, and track departmental progress.', tags: ['Departments', 'Teams', 'Resources'] },
  { icon: 'fas fa-briefcase', title: 'Employee Portal', desc: 'Self-service access for tasks, leave requests, performance reviews, and documents.', tags: ['Tasks', 'Leave', 'Reviews'] },
  { icon: 'fas fa-file-contract', title: 'Tender Management', desc: 'Full lifecycle tender tracking from initial bid submission through to contract award.', tags: ['Bids', 'Contracts', 'Vendors'] },
  { icon: 'fas fa-coins', title: 'Financial Module', desc: 'Comprehensive accounting, invoicing, expense tracking, and financial report generation.', tags: ['Invoices', 'Expenses', 'Reports'] },
  { icon: 'fas fa-users', title: 'HR Module', desc: 'Recruitment, onboarding, payroll processing, and training management in one place.', tags: ['Payroll', 'Training', 'Records'] },
]

const stats = [
  { value: '1,000+', label: 'Active Users', pct: '85%' },
  { value: '500+', label: 'Projects Managed', pct: '65%' },
  { value: '50+', label: 'Tenders Processed', pct: '40%' },
  { value: '99%', label: 'Client Satisfaction', pct: '99%' },
]

const pillars = [
  { icon: 'fas fa-shield-alt', title: 'Secure & Reliable', desc: 'Enterprise-grade security protocols with 99.9% guaranteed uptime SLA.' },
  { icon: 'fas fa-mobile-alt', title: 'Mobile Accessible', desc: 'Full functionality on any device — desktop, tablet, or smartphone.' },
  { icon: 'fas fa-chart-line', title: 'Data Driven', desc: 'Make confident decisions backed by real-time organizational intelligence.' },
]

const footerCols = [
  { title: 'Platform', links: ['Features', 'Modules', 'About', 'Login'] },
  { title: 'Modules', links: ['CEO Dashboard', 'HOD Portal', 'Employee Portal', 'Financial Module'] },
  { title: 'Support', links: ['Documentation', 'Help Center', 'Contact Us', 'Privacy Policy'] },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* ─── DESIGN TOKENS ───────────────────────────── */
:root {
  /* Navy-to-slate enterprise palette */
  --navy:       #0f1f3d;       /* Deep navy – primary dark */
  --navy-mid:   #162847;       /* Mid navy for sections */
  --navy-light: #1e3560;       /* Lighter navy hover states */
  --slate:      #2c3e5e;       /* Slate for cards on dark */
  --cream:      #f5f2eb;       /* Warm cream – light bg */
  --cream-2:    #ede9e0;       /* Slightly deeper cream */
  --white:      #ffffff;
  --gold:       #c9a84c;       /* Warm gold accent */
  --gold-light: #e2c17a;       /* Light gold hover */
  --gold-pale:  #f5ecd0;       /* Gold tint backgrounds */
  --text-dark:  #1a2540;       /* Main heading text */
  --text-body:  #4a5568;       /* Body copy */
  --text-muted: #8896b0;       /* Muted labels */
  --border:     #dde3ed;       /* Light border */

  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'Plus Jakarta Sans', system-ui, sans-serif;

  --radius:     12px;
  --radius-sm:  7px;
  --shadow-md:  0 8px 30px rgba(15,31,61,.10);
  --shadow-lg:  0 20px 60px rgba(15,31,61,.18);
}

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

.page {
  font-family: var(--font-body);
  background: var(--cream);
  color: var(--text-dark);
  overflow-x: hidden;
}

.wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* ─── NAV ─────────────────────────────────────── */
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 999;
  transition: background .4s, box-shadow .4s;
}

.nav--solid {
  background: rgba(255,255,255,.97);
  backdrop-filter: blur(18px);
  box-shadow: 0 1px 0 var(--border);
}

.nav__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.3rem 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav__logo {
  display: flex;
  align-items: center;
  gap: .7rem;
  flex: none;
}

.nav__logo-icon {
  width: 34px; height: 34px;
  background: var(--navy);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
}

.nav__logo-text {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: .02em;
}

.nav--solid .nav__logo-text { color: var(--navy); }

.nav__logo-text em {
  font-style: normal;
  font-weight: 400;
  opacity: .5;
}

.nav__links {
  display: flex;
  gap: 2rem;
  margin-left: auto;
}

.nav__links button {
  background: none; border: none;
  font-family: var(--font-body);
  font-size: .875rem;
  font-weight: 500;
  color: rgba(255,255,255,.75);
  cursor: pointer;
  letter-spacing: .03em;
  transition: color .2s;
}

.nav--solid .nav__links button { color: var(--text-muted); }
.nav__links button:hover { color: #fff; }
.nav--solid .nav__links button:hover { color: var(--navy); }

.nav__cta {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  padding: .55rem 1.35rem;
  background: var(--gold);
  color: var(--navy);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: .85rem;
  font-weight: 700;
  border-radius: var(--radius-sm);
  border: 2px solid var(--gold);
  transition: all .25s;
  flex: none;
  letter-spacing: .02em;
}

.nav__cta:hover {
  background: var(--gold-light);
  border-color: var(--gold-light);
}

.nav--solid .nav__cta {
  background: var(--navy);
  color: #fff;
  border-color: var(--navy);
}

.nav--solid .nav__cta:hover {
  background: var(--navy-light);
  border-color: var(--navy-light);
}

.nav__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none; border: none;
  cursor: pointer; padding: 4px;
  margin-left: auto;
}

.nav__burger span {
  display: block;
  width: 22px; height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: background .3s;
}

.nav--solid .nav__burger span { background: var(--navy); }

.nav__mobile {
  background: #fff;
  border-top: 1px solid var(--border);
  padding: 1rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
}

.nav__mobile button,
.nav__mobile a {
  display: block;
  padding: .8rem 0;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-dark);
  background: none; border: none;
  border-bottom: 1px solid var(--border);
  text-align: left;
  cursor: pointer;
  text-decoration: none;
}

/* ─── HERO ────────────────────────────────────── */
.hero {
  position: relative;
  height: 100vh;
  min-height: 700px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero__bg { position: absolute; inset: 0; z-index: 0; }

.hero__bg img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero__overlay {
  position: absolute; inset: 0;
  background: linear-gradient(
    115deg,
    rgba(15,31,61,.93) 0%,
    rgba(15,31,61,.75) 50%,
    rgba(15,31,61,.40) 100%
  );
}

.hero__content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 2rem 0;
  width: 100%;
}

.hero__pill {
  display: inline-flex;
  align-items: center;
  gap: .65rem;
  background: rgba(201,168,76,.15);
  border: 1px solid rgba(201,168,76,.35);
  border-radius: 100px;
  padding: .38rem 1rem;
  font-size: .72rem;
  font-weight: 600;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--gold-light);
  margin-bottom: 2rem;
  animation: fadeUp .7s ease .1s both;
}

.hero__pill-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--gold);
  animation: glow 2s ease infinite;
}

@keyframes glow {
  0%,100% { box-shadow: 0 0 0 0 rgba(201,168,76,.6); opacity: 1; }
  50% { box-shadow: 0 0 0 5px rgba(201,168,76,0); opacity: .6; }
}

.hero__title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 7vw, 6rem);
  font-weight: 700;
  color: #fff;
  line-height: 1.06;
  letter-spacing: -.01em;
  margin-bottom: 1.75rem;
  animation: fadeUp .7s ease .25s both;
}

.hero__title-gold {
  color: var(--gold);
  display: block;
}

.hero__sub {
  max-width: 500px;
  font-size: 1.05rem;
  font-weight: 300;
  color: rgba(255,255,255,.68);
  line-height: 1.8;
  margin-bottom: 2.5rem;
  animation: fadeUp .7s ease .4s both;
}

.hero__actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 4rem;
  animation: fadeUp .7s ease .55s both;
}

/* ─── BUTTONS ─────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .85rem 1.9rem;
  font-family: var(--font-body);
  font-size: .9rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  border: 2px solid transparent;
  cursor: pointer;
  text-decoration: none;
  transition: all .25s;
  letter-spacing: .02em;
}

.btn--gold {
  background: var(--gold);
  color: var(--navy);
  border-color: var(--gold);
}

.btn--gold:hover {
  background: var(--gold-light);
  border-color: var(--gold-light);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(201,168,76,.35);
}

.btn--ghost {
  background: transparent;
  color: rgba(255,255,255,.85);
  border-color: rgba(255,255,255,.3);
}

.btn--ghost:hover {
  border-color: rgba(255,255,255,.75);
  color: #fff;
  transform: translateY(-2px);
}

.btn--navy {
  background: var(--navy);
  color: #fff;
  border-color: var(--navy);
}

.btn--navy:hover {
  background: var(--navy-light);
  border-color: var(--navy-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* ─── HERO STATS ──────────────────────────────── */
.hero__stats {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  animation: fadeUp .7s ease .7s both;
}

.hstat strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

.hstat span {
  display: block;
  font-size: .7rem;
  font-weight: 500;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: rgba(255,255,255,.4);
  margin-top: .25rem;
}

.hstat-line {
  width: 1px; height: 38px;
  background: rgba(255,255,255,.15);
  flex-shrink: 0;
}

.hero__scroll-hint {
  position: absolute;
  bottom: 2.5rem; right: 2.5rem;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .6rem;
  color: rgba(255,255,255,.3);
  font-size: .62rem;
  font-weight: 600;
  letter-spacing: .2em;
  text-transform: uppercase;
}

.hero__scroll-bar {
  width: 1px; height: 50px;
  background: linear-gradient(to bottom, rgba(201,168,76,.6), transparent);
  animation: pulse 2s ease infinite;
}

@keyframes pulse { 0%,100% { opacity: .5; } 50% { opacity: 1; } }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(26px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ─── TICKER ──────────────────────────────────── */
.ticker {
  background: var(--navy);
  overflow: hidden;
  padding: .82rem 0;
  border-top: 1px solid rgba(255,255,255,.06);
  border-bottom: 3px solid var(--gold);
}

.ticker__track {
  display: inline-flex;
  white-space: nowrap;
  animation: ticker 28s linear infinite;
}

.ticker__track span {
  font-size: .72rem;
  font-weight: 600;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: rgba(255,255,255,.55);
  padding: 0 1.6rem;
}

.tdot {
  color: var(--gold) !important;
  opacity: .5 !important;
  font-size: .45rem !important;
  padding: 0 !important;
  align-self: center;
}

@keyframes ticker {
  from { transform: translateX(0); }
  to   { transform: translateX(-33.333%); }
}

/* ─── SECTIONS ────────────────────────────────── */
.sec { padding: 7rem 0; }
.sec--cream { background: #f5f2eb !important; }
.sec--white { background: #ffffff !important; }
.sec--navy  { background: #0f1f3d !important; }

.sec__head {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: end;
  margin-bottom: 4rem;
}

.eyebrow {
  display: block;
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .24em;
  text-transform: uppercase;
  color: #c9a84c !important;
  margin-bottom: 1rem;
}

.eyebrow--inv { color: #c9a84c !important; }

.h2 {
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.8vw, 3.2rem);
  font-weight: 700;
  color: #1a2540 !important;
  line-height: 1.15;
  letter-spacing: -.01em;
}

.h2--inv { color: #fff; }

.sec__desc {
  font-size: 1rem;
  font-weight: 300;
  color: #4a5568 !important;
  line-height: 1.85;
  align-self: end;
}

.sec__desc--inv { color: rgba(255,255,255,.7) !important; }

/* ─── FEATURES GRID ───────────────────────────── */
.feat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feat-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 2rem 2rem 1.5rem;
  transition: box-shadow .3s, transform .3s;
  position: relative;
  overflow: hidden;
  min-height: 260px;
  display: flex;
  flex-direction: column;
}

.feat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--gold), var(--gold-light));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .35s ease;
}

.feat-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-5px);
}

.feat-card:hover::before { transform: scaleX(1); }

.feat-card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.feat-card__icon {
  width: 48px; height: 48px;
  background: var(--gold-pale);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
  font-size: 1rem;
  transition: background .3s;
}

.feat-card:hover .feat-card__icon {
  background: var(--gold);
  color: var(--navy);
}

.feat-card__num {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--cream-2);
}

.feat-card__title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: .65rem;
  line-height: 1.3;
}

.feat-card__desc {
  font-size: .875rem;
  font-weight: 300;
  color: var(--text-body);
  line-height: 1.75;
  margin-bottom: 1.25rem;
  flex-grow: 1;
}

.feat-card__line {
  height: 1px;
  background: var(--border);
}

/* ─── PHOTO STRIP ─────────────────────────────── */
.strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: 360px;
  overflow: hidden;
}

.strip__item {
  position: relative;
  overflow: hidden;
}

.strip__item img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform .6s ease;
  display: block;
}

.strip__item:hover img { transform: scale(1.06); }

.strip__item::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(15,31,61,.7) 0%, transparent 55%);
}

.strip__label {
  position: absolute;
  bottom: 1.2rem; left: 1.2rem;
  background: var(--gold);
  color: var(--navy);
  font-size: .68rem;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  padding: .32rem .85rem;
  border-radius: 4px;
  z-index: 1;
}

/* ─── MODULES GRID ────────────────────────────── */
.mod-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.mod-card {
  background: rgba(255,255,255,.08) !important;
  border: 1px solid rgba(201,168,76,.2) !important;
  border-radius: var(--radius);
  padding: 2rem;
  transition: background .3s, border-color .3s, transform .3s;
  cursor: default;
}

.mod-card:hover {
  background: rgba(255,255,255,.12) !important;
  border-color: rgba(201,168,76,.6) !important;
  transform: translateY(-4px);
}

.mod-card__icon {
  width: 48px; height: 48px;
  background: rgba(201,168,76,.25) !important;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c9a84c !important;
  font-size: 1rem;
  margin-bottom: 1.25rem;
  transition: background .3s;
}

.mod-card:hover .mod-card__icon {
  background: #c9a84c !important;
  color: #0f1f3d !important;
}

.mod-card__title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: .5rem;
}

.mod-card__desc {
  font-size: .875rem;
  font-weight: 300;
  color: rgba(255,255,255,.7) !important;
  line-height: 1.7;
  margin-bottom: 1.25rem;
}

.mod-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: .4rem;
}

.mod-card__tags span {
  font-size: .65rem;
  font-weight: 600;
  letter-spacing: .1em;
  text-transform: uppercase;
  padding: .28rem .75rem;
  border: 1px solid rgba(201,168,76,.4) !important;
  border-radius: 100px;
  color: rgba(201,168,76,.8) !important;
}

/* ─── STATS ───────────────────────────────────── */
.stats-sec {
  position: relative;
  padding: 7rem 0;
  overflow: hidden;
}

.stats-sec__bg { position: absolute; inset: 0; }

.stats-sec__bg img {
  width: 100%; height: 100%;
  object-fit: cover;
}

.stats-sec__overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(15,31,61,.95) 0%, rgba(15,31,61,.85) 100%);
}

.stats-sec__inner { position: relative; z-index: 1; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.stat-box {
  text-align: center;
  padding: 2.5rem 1.5rem;
  border: 1px solid rgba(201,168,76,.2);
  border-radius: var(--radius);
  background: rgba(201,168,76,.04);
  transition: border-color .3s, background .3s;
}

.stat-box:hover {
  border-color: rgba(201,168,76,.45);
  background: rgba(201,168,76,.08);
}

.stat-box__num {
  font-family: var(--font-display);
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: .4rem;
  line-height: 1;
}

.stat-box__label {
  font-size: .7rem;
  font-weight: 600;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: rgba(255,255,255,.35);
  margin-bottom: 1.5rem;
}

.stat-box__bar {
  height: 3px;
  background: rgba(255,255,255,.08);
  border-radius: 2px;
  overflow: hidden;
}

.stat-box__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold), var(--gold-light));
  border-radius: 2px;
}

/* ─── ABOUT ───────────────────────────────────── */
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: center;
}

.about-imgs__main {
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
}

.about-imgs__main img {
  width: 100%; height: 460px;
  object-fit: cover;
  display: block;
  transition: transform .6s ease;
}

.about-imgs__main:hover img { transform: scale(1.03); }

.about-imgs__badge {
  position: absolute;
  bottom: 1.75rem; right: -1.75rem;
  background: var(--navy);
  color: #fff;
  padding: 1.25rem 1.75rem;
  border-radius: var(--radius);
  text-align: center;
  box-shadow: var(--shadow-lg);
  border: 2px solid rgba(201,168,76,.3);
}

.about-imgs__badge span {
  display: block;
  font-size: .62rem;
  font-weight: 600;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: .2rem;
}

.about-imgs__badge strong {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 700;
  color: #fff;
}

.about-imgs__sub {
  margin-top: 1.25rem;
  margin-left: 2.5rem;
  border-radius: var(--radius);
  overflow: hidden;
}

.about-imgs__sub img {
  width: 100%; height: 175px;
  object-fit: cover;
  display: block;
  transition: transform .6s ease;
}

.about-imgs__sub:hover img { transform: scale(1.04); }

.about-text .eyebrow { margin-bottom: 1rem; }
.about-text .h2 { margin-bottom: 1.5rem; }

.about-text__para {
  font-size: .975rem;
  font-weight: 300;
  color: var(--text-body);
  line-height: 1.9;
  margin-bottom: 2.5rem;
}

.pillars {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
  margin-bottom: 2.5rem;
}

.pillar {
  display: flex;
  gap: 1.1rem;
  align-items: flex-start;
}

.pillar__icon {
  width: 40px; height: 40px;
  background: var(--gold-pale);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
  font-size: .88rem;
  flex-shrink: 0;
  margin-top: .1rem;
  transition: background .3s;
}

.pillar:hover .pillar__icon {
  background: var(--gold);
  color: var(--navy);
}

.pillar h4 {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: .2rem;
}

.pillar p {
  font-size: .875rem;
  font-weight: 300;
  color: var(--text-body);
  line-height: 1.65;
}

/* ─── CTA ─────────────────────────────────────── */
.cta-sec {
  position: relative;
  padding: 9rem 0;
  text-align: center;
  overflow: hidden;
}

.cta-sec__bg { position: absolute; inset: 0; }

.cta-sec__bg img {
  width: 100%; height: 100%;
  object-fit: cover;
}

.cta-sec__overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(15,31,61,.95) 0%, rgba(15,31,61,.88) 100%);
}

.cta-sec__inner { position: relative; z-index: 1; }

.cta-sec__title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5.5vw, 4.2rem);
  font-weight: 700;
  color: #fff;
  line-height: 1.12;
  letter-spacing: -.01em;
  margin-bottom: 1.25rem;
}

.cta-sec__sub {
  font-size: 1.05rem;
  font-weight: 300;
  color: rgba(255,255,255,.5);
  margin-bottom: 3rem;
}

.cta-sec__btns {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* ─── FOOTER ──────────────────────────────────── */
footer.footer {
  background: #0f1f3d !important;
  background: var(--navy) !important;
  background-color: #0f1f3d !important;
  color: #fff;
  padding: 5rem 0 2rem;
  border-top: 3px solid var(--gold);
  position: relative;
  z-index: 10;
  margin-top: 0;
  box-shadow: 0 -10px 30px rgba(15,31,61,0.3);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 4rem;
  padding-bottom: 4rem;
  border-bottom: 1px solid rgba(255,255,255,.08);
  margin-bottom: 2rem;
}

.footer-brand__logo {
  display: flex;
  align-items: center;
  gap: .7rem;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.footer-brand__icon {
  width: 32px; height: 32px;
  background: rgba(255,255,255,.1);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
}

.footer-brand p {
  font-size: .875rem;
  font-weight: 300;
  color: rgba(255,255,255,.6);
  line-height: 1.7;
  max-width: 240px;
}

.footer-col h4 {
  font-size: .68rem;
  font-weight: 700;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: var(--gold);
  opacity: 1;
  margin-bottom: 1.5rem;
}

.footer-col ul { list-style: none; }
.footer-col li { margin-bottom: .7rem; }

.footer-col a {
  font-size: .875rem;
  font-weight: 400;
  color: rgba(255,255,255,.7);
  text-decoration: none;
  transition: color .2s;
}

.footer-col a:hover { color: var(--gold-light); }

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: .78rem;
  color: rgba(255,255,255,.5);
}

/* ─── RESPONSIVE ──────────────────────────────── */
@media (max-width: 1024px) {
  .feat-grid, .mod-grid { grid-template-columns: repeat(2, 1fr); }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
  .strip { height: 280px; }
  .feat-card { min-height: 240px; }
}

@media (max-width: 768px) {
  .nav__links, .nav__cta { display: none; }
  .nav__burger { display: flex; }
  .sec__head { grid-template-columns: 1fr; gap: 1.5rem; }
  .feat-grid, .mod-grid { grid-template-columns: 1fr; }
  .strip { grid-template-columns: repeat(2, 1fr); height: 250px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
  .stat-box { padding: 1.75rem 1rem; }
  .about-grid { grid-template-columns: 1fr; gap: 3rem; }
  .about-imgs__badge { right: 0; }
  .about-imgs__sub { margin-left: 0; }
  .hero__stats { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .hstat-line { width: 36px; height: 1px; }
  .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
  .footer-bottom { flex-direction: column; gap: .5rem; text-align: center; }
  .hero__scroll-hint { display: none; }
  .feat-card { min-height: auto; }
}
</style>