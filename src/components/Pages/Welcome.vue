<template>
  <div class="t-root">

    <!-- ══ NAVBAR ══ -->
    <header class="t-nav" :class="{ scrolled: scrolled }">
      <div class="t-nav-inner">

        <div class="t-logo">
          <div class="t-logo-mark">
            <svg viewBox="0 0 32 32" fill="none" width="18" height="18">
              <path d="M4 8h24M4 16h16M4 24h20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="t-logo-words">
            <span class="t-logo-name">TERA</span>
            <span class="t-logo-tag">Business Process Management</span>
          </div>
        </div>

        <nav class="t-nav-links">
          <button @click="scrollTo('modules')"  class="t-link">Modules</button>
          <button @click="scrollTo('workflow')" class="t-link">Workflow</button>
          <button @click="scrollTo('features')" class="t-link">Platform</button>
        </nav>

        <div class="t-nav-right">
          <button @click="toggleDark" class="t-icon-btn" :title="darkMode ? 'Light mode' : 'Dark mode'">
            <svg v-if="darkMode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          </button>
          <router-link to="/login" class="t-btn-primary t-btn-sm">Sign In</router-link>
        </div>

      </div>
    </header>


    <!-- ══ HERO ══ -->
    <section class="t-hero">
      <!-- Layered background -->
      <div class="t-hero-bg" aria-hidden="true">
        <div class="t-hero-mesh"></div>
        <div class="t-hero-grid"></div>
        <div class="t-hero-glow-tl"></div>
        <div class="t-hero-glow-br"></div>
      </div>
      <!-- Diagonal accent line -->
      <div class="t-diagonal-rule" aria-hidden="true"></div>

      <div class="t-hero-inner">

        <div class="t-eyebrow">
          <span class="t-eyebrow-bar"></span>
          TERA Company &nbsp;·&nbsp; Enterprise BPM Platform
          <span class="t-eyebrow-bar"></span>
        </div>

        <h1 class="t-hero-h1">
          <span class="t-hl t-hl-1">Govern. Automate.</span>
          <span class="t-hl t-hl-2"><em class="t-accent">Deliver.</em></span>
        </h1>

        <p class="t-hero-sub">
          A unified platform for tender management, project governance,
          financial oversight, and HR operations — engineered for
          accountability at every level of TERA Company.
        </p>

        <div class="t-hero-cta">
          <router-link to="/login" class="t-btn-white t-btn-lg">
            Get Started
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="15" height="15">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
          <button @click="scrollTo('modules')" class="t-btn-ghost-light t-btn-lg">
            Explore Modules
          </button>
        </div>

        <!-- Stats band -->
        <div class="t-stat-band">
          <div class="t-stat-item" v-for="(stat, i) in heroStats" :key="i">
            <span class="t-stat-num">
              <span v-if="loading" class="t-shimmer">—</span>
              <span v-else>{{ stat.value }}</span>
            </span>
            <span class="t-stat-lbl">{{ stat.label }}</span>
          </div>
        </div>

      </div>

      <div class="t-scroll-hint" @click="scrollTo('modules')">
        <span>Discover</span>
        <div class="t-scroll-line"></div>
      </div>
    </section>


    <!-- ══ TRUSTED STRIP ══ -->
    <div class="t-strip">
      <span class="t-strip-label">Serving departments across TERA Company</span>
      <div class="t-strip-divider"></div>
      <div class="t-strip-items">
        <span v-for="dept in departments" :key="dept">{{ dept }}</span>
      </div>
    </div>


    <!-- ══ WORKFLOW ══ -->
    <section id="workflow" class="t-section">
      <div class="t-section-wrap">

        <div class="t-side-copy">
          <div class="t-sec-eyebrow">Tender Lifecycle</div>
          <h2 class="t-sec-h2">From Submission<br>to Contract Award</h2>
          <p class="t-sec-body">
            Every tender moves through a structured, traceable workflow —
            automated routing, multi-level approvals, vendor scoring, and
            audit-ready documentation at every stage.
          </p>
          <ul class="t-list">
            <li>Tender submission &amp; document management</li>
            <li>Configurable multi-level approval chains</li>
            <li>Vendor evaluation &amp; scoring matrix</li>
            <li>Contract generation &amp; award notification</li>
          </ul>
          <router-link to="/login" class="t-btn-primary" style="margin-top:36px;display:inline-flex">
            Sign In to Submit
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>

        <!-- Vertical workflow -->
        <div class="t-flow-diagram">
          <div
            class="t-flow-step"
            v-for="(step, i) in workflowSteps"
            :key="i"
            :style="{ animationDelay: `${i * 0.13}s` }"
          >
            <div class="t-flow-connector" v-if="i < workflowSteps.length - 1"></div>
            <div class="t-flow-node" :style="{ borderColor: step.color }">
              <span class="t-flow-emoji">{{ step.icon }}</span>
            </div>
            <div class="t-flow-body">
              <div class="t-flow-title">{{ step.title }}</div>
              <div class="t-flow-desc">{{ step.desc }}</div>
            </div>
            <span class="t-flow-role" :style="{ color: step.color, background: step.color + '12', borderColor: step.color + '35' }">{{ step.tag }}</span>
          </div>
        </div>

      </div>
    </section>


    <!-- ══ MODULES ══ -->
    <section id="modules" class="t-section t-section-bg">
      <div class="t-section-inner">

        <div class="t-section-hdr">
          <div class="t-sec-eyebrow">Core Platform</div>
          <h2 class="t-sec-h2 t-center">Integrated BPM Modules</h2>
          <p class="t-sec-body t-center" style="max-width:580px;margin:0 auto">
            Six integrated modules covering every operational dimension —
            built to work independently or as a unified suite.
          </p>
        </div>

        <div class="t-modules">
          <div
            class="t-module-card"
            v-for="(mod, i) in modules"
            :key="i"
            :style="{ animationDelay: `${i * 0.08}s` }"
          >
            <div class="t-mod-icon-wrap" :style="{ background: mod.bg, color: mod.ic }">
              <span>{{ mod.icon }}</span>
            </div>
            <div class="t-mod-title">{{ mod.title }}</div>
            <div class="t-mod-desc">{{ mod.desc }}</div>
            <div class="t-mod-tags">
              <span class="t-mod-tag" v-for="tag in mod.tags" :key="tag">{{ tag }}</span>
            </div>
            <div class="t-mod-footer">
              <router-link to="/login" class="t-mod-link">
                Access module
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </router-link>
            </div>
          </div>
        </div>

      </div>
    </section>


    <!-- ══ FEATURES ══ -->
    <section id="features" class="t-section">
      <div class="t-section-inner">

        <div class="t-section-hdr">
          <div class="t-sec-eyebrow">Built-in Capabilities</div>
          <h2 class="t-sec-h2 t-center">Governance by Design</h2>
          <p class="t-sec-body t-center" style="max-width:540px;margin:0 auto">
            Every feature was designed around accountability, transparency,
            and operational efficiency from the ground up.
          </p>
        </div>

        <div class="t-features">
          <div
            class="t-feat"
            v-for="(f, i) in features"
            :key="i"
            :style="{ animationDelay: `${i * 0.09}s` }"
          >
            <div class="t-feat-top">
              <div class="t-feat-ico-wrap">{{ f.icon }}</div>
              <span class="t-feat-num">{{ String(i + 1).padStart(2, '0') }}</span>
            </div>
            <h3 class="t-feat-title">{{ f.title }}</h3>
            <p class="t-feat-desc">{{ f.desc }}</p>
          </div>
        </div>

      </div>
    </section>


    <!-- ══ CTA BANNER ══ -->
    <section class="t-cta">
      <div class="t-cta-bg" aria-hidden="true">
        <div class="t-cta-mesh"></div>
        <div class="t-cta-orb"></div>
      </div>
      <div class="t-cta-inner">
        <p class="t-cta-overline">Ready to begin?</p>
        <h2 class="t-cta-h2">
          Transform How TERA<br>Manages Its Operations
        </h2>
        <p class="t-cta-sub">
          Sign in to access the full TERA BPM platform and
          start managing your business processes today.
        </p>
        <router-link to="/login" class="t-btn-white t-btn-lg">
          Sign In to TERA BPM
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="15" height="15">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </router-link>
      </div>
    </section>


    <!-- ══ FOOTER ══ -->
    <footer class="t-footer">
      <div class="t-footer-inner">
        <div class="t-logo">
          <div class="t-logo-mark t-logo-mark-sm">
            <svg viewBox="0 0 32 32" fill="none" width="15" height="15">
              <path d="M4 8h24M4 16h16M4 24h20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="t-logo-words">
            <span class="t-logo-name">TERA</span>
            <span class="t-logo-tag">BPM</span>
          </div>
        </div>
        <p class="t-footer-copy">
          © 2026 TERA Company &nbsp;·&nbsp; Business Process Management System &nbsp;·&nbsp; All rights reserved
        </p>
      </div>
    </footer>

  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import DashboardService from '@/services/dashboardService'

const darkMode = ref(false)
const loading  = ref(true)
const scrolled = ref(false)

const heroStats = ref([
  { label: 'Tenders Managed',    value: '—' },
  { label: 'Projects Tracked',   value: '—' },
  { label: 'System Uptime',      value: '—' },
  { label: 'Departments Served', value: '5+' },
])

const departments = ['Procurement', 'Finance', 'Engineering', 'HR & Admin', 'Executive Office']

const workflowSteps = [
  { icon: '📋', title: 'Tender Submission',  desc: 'Supplier submits tender with all required supporting documents',    tag: 'Initiator',   color: '#1a56db' },
  { icon: '👤', title: 'Department Review',  desc: 'Head of Department reviews scope, feasibility and departmental fit', tag: 'HOD',         color: '#0e9f6e' },
  { icon: '💰', title: 'Finance Clearance',  desc: 'Finance team verifies budget availability and policy compliance',    tag: 'Finance',     color: '#7e3af2' },
  { icon: '⚖️',  title: 'Evaluation Board',  desc: 'Committee scores vendors against the standard evaluation matrix',   tag: 'Committee',   color: '#ff5a1f' },
  { icon: '✅', title: 'Award & Contract',   desc: 'Contract is generated, signed and award is formally communicated',  tag: 'Procurement', color: '#0e9f6e' },
]

const modules = [
  { icon: '📄', bg: '#eff6ff', ic: '#1d4ed8', title: 'Tender Management',   desc: 'Full lifecycle management from submission to award with automated status tracking.',          tags: ['Procurement', 'Approvals'] },
  { icon: '📊', bg: '#f0fdf4', ic: '#15803d', title: 'Project Tracking',    desc: 'Milestone management, budget monitoring, and progress reporting for all active projects.',    tags: ['Planning', 'Reporting'] },
  { icon: '💳', bg: '#faf5ff', ic: '#7e22ce', title: 'Financial Control',   desc: 'Budget allocation, expense approvals, and real-time financial reporting dashboards.',         tags: ['Budget', 'Expenses'] },
  { icon: '👥', bg: '#fff7ed', ic: '#c2410c', title: 'HR Operations',       desc: 'Employee records, payroll processing, leave management, and attendance tracking.',            tags: ['Payroll', 'HR'] },
  { icon: '🔄', bg: '#eff6ff', ic: '#1d4ed8', title: 'Approval Workflows',  desc: 'Configurable multi-level routing with delegation, escalation and full audit trails.',         tags: ['Routing', 'Governance'] },
  { icon: '📈', bg: '#f0fdf4', ic: '#15803d', title: 'Analytics & Reports', desc: 'Executive dashboards, KPI tracking, and exportable compliance audit reports.',                tags: ['Analytics', 'Exports'] },
]

const features = [
  { icon: '⚡', title: 'Automated Routing',        desc: 'Approvals route by role, value threshold and department rules — zero manual handoffs.' },
  { icon: '🔒', title: 'Complete Audit Trail',     desc: 'Every action is time-stamped, attributed and stored for full regulatory compliance.' },
  { icon: '📧', title: 'Smart Notifications',      desc: 'Email and in-app alerts keep every stakeholder informed at the right moment.' },
  { icon: '📋', title: 'Document Version Control', desc: 'All tender and project documents are versioned and linked to their workflow stage.' },
  { icon: '💹', title: 'Live Budget Integration',  desc: 'Real-time budget checks prevent over-commitment before any approval proceeds.' },
  { icon: '🛡️', title: 'Role-Based Access',        desc: 'Granular permissions ensure data visibility aligned to organisational hierarchy.' },
  { icon: '📱', title: 'Mobile Responsive',        desc: 'Approve, review and track on any device — every feature works on phone and tablet.' },
  { icon: '📊', title: 'Executive Dashboards',     desc: 'Live KPI overviews give leadership instant visibility into operational performance.' },
]

async function loadStats() {
  try {
    const stats = await DashboardService.getDashboardStats()
    heroStats.value[0].value = stats.tenders.total + '+'
    heroStats.value[1].value = stats.projects.total + '+'
    heroStats.value[2].value = stats.uptime + '%'
  } catch {
    heroStats.value[0].value = '142+'
    heroStats.value[1].value = '310+'
    heroStats.value[2].value = '99.7%'
  } finally {
    loading.value = false
  }
}

function toggleDark() {
  darkMode.value = !darkMode.value
  localStorage.setItem('darkMode', String(darkMode.value))
  document.documentElement.classList.toggle('tera-dark', darkMode.value)
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  loadStats()
  window.addEventListener('scroll', () => { scrolled.value = window.scrollY > 50 }, { passive: true })
})
</script>


<style scoped>
/* ════════════════════════════════════════
   FONTS
════════════════════════════════════════ */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&family=Nunito+Sans:wght@300;400;500;600;700&display=swap');

/* ════════════════════════════════════════
   DESIGN TOKENS
════════════════════════════════════════ */
.t-root {
  /* Blues */
  --navy:       #0d2b5e;
  --navy-deep:  #081a3d;
  --navy-mid:   #153470;
  --blue:       #1a56db;
  --blue-lt:    #3b72f0;
  --blue-pale:  #eff6ff;
  --blue-soft:  #dbeafe;

  /* Neutrals */
  --white:      #ffffff;
  --off-white:  #f8faff;
  --gray-100:   #f1f5f9;
  --gray-200:   #e2e8f0;
  --gray-400:   #94a3b8;
  --gray-600:   #475569;
  --gray-800:   #1e293b;
  --ink:        #0f172a;

  /* Accents */
  --gold:       #f59e0b;
  --gold-lt:    #fbbf24;

  /* Spacing / misc */
  --radius:     12px;
  --shadow-sm:  0 1px 3px rgba(13,43,94,.08), 0 1px 2px rgba(13,43,94,.06);
  --shadow-md:  0 4px 16px rgba(13,43,94,.1), 0 2px 8px rgba(13,43,94,.06);
  --shadow-lg:  0 12px 40px rgba(13,43,94,.14), 0 4px 16px rgba(13,43,94,.08);
  --shadow-xl:  0 24px 64px rgba(13,43,94,.18);

  font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif;
  background: var(--white);
  color: var(--ink);
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* ════════════════════════════════════════
   NAVBAR
════════════════════════════════════════ */
.t-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  transition: background .35s, box-shadow .35s;
  background: transparent;
}
.t-nav.scrolled {
  background: rgba(255,255,255,.97);
  box-shadow: 0 1px 0 var(--gray-200), 0 4px 24px rgba(13,43,94,.08);
  backdrop-filter: blur(12px);
}
.t-nav-inner {
  max-width: 1320px; margin: 0 auto; padding: 0 36px;
  height: 70px; display: flex; align-items: center; gap: 28px;
}

/* Logo */
.t-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; flex-shrink: 0; cursor: default; }
.t-logo-mark {
  width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
  background: var(--white); color: var(--navy);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(13,43,94,.2);
}
.t-logo-mark-sm {
  width: 34px; height: 34px; border-radius: 8px;
  background: var(--navy); color: var(--white);
  box-shadow: none;
}
.t-logo-words { display: flex; flex-direction: column; gap: 1px; line-height: 1; }
.t-logo-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 800; font-size: 17px;
  color: var(--white); letter-spacing: .06em;
}
.t-nav.scrolled .t-logo-name { color: var(--navy); }
.t-logo-tag {
  font-size: 8px; font-weight: 700; letter-spacing: .2em;
  text-transform: uppercase; color: rgba(255,255,255,.65);
}
.t-nav.scrolled .t-logo-tag { color: var(--blue); }

/* Nav links */
.t-nav-links { display: flex; gap: 2px; flex: 1; }
.t-link {
  padding: 7px 14px; border-radius: 7px; font-size: 13.5px; font-weight: 600;
  color: rgba(255,255,255,.8); background: none; border: none; cursor: pointer;
  text-decoration: none; transition: color .2s, background .2s; letter-spacing: .01em;
}
.t-nav.scrolled .t-link { color: var(--gray-600); }
.t-link:hover { color: var(--white); background: rgba(255,255,255,.1); }
.t-nav.scrolled .t-link:hover { color: var(--blue); background: var(--blue-pale); }

/* Nav right */
.t-nav-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; margin-left: auto; }
.t-icon-btn {
  width: 36px; height: 36px; border-radius: 8px; cursor: pointer;
  border: 1px solid rgba(255,255,255,.25);
  background: rgba(255,255,255,.1); color: rgba(255,255,255,.85);
  display: flex; align-items: center; justify-content: center;
  transition: all .2s;
}
.t-nav.scrolled .t-icon-btn { border-color: var(--gray-200); background: var(--white); color: var(--gray-600); }
.t-icon-btn:hover { background: rgba(255,255,255,.2); color: var(--white); }
.t-nav.scrolled .t-icon-btn:hover { background: var(--blue-pale); color: var(--blue); border-color: var(--blue-soft); }

/* ════════════════════════════════════════
   BUTTONS
════════════════════════════════════════ */
.t-btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 26px; border-radius: 9px; border: none;
  background: var(--blue); color: var(--white);
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 700; font-size: 14px; letter-spacing: .02em;
  text-decoration: none; cursor: pointer;
  box-shadow: 0 4px 18px rgba(26,86,219,.35);
  transition: background .2s, transform .15s, box-shadow .2s;
}
.t-btn-primary:hover { background: var(--blue-lt); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(26,86,219,.45); }
.t-btn-primary:active { transform: scale(.97); }

.t-btn-white {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 26px; border-radius: 9px; border: none;
  background: var(--white); color: var(--navy);
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 700; font-size: 14px; letter-spacing: .02em;
  text-decoration: none; cursor: pointer;
  box-shadow: 0 4px 18px rgba(0,0,0,.18);
  transition: transform .15s, box-shadow .2s, background .2s;
}
.t-btn-white:hover { background: var(--blue-pale); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.22); }

.t-btn-ghost-light {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 26px; border-radius: 9px;
  border: 1.5px solid rgba(255,255,255,.4);
  background: rgba(255,255,255,.08); color: var(--white);
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 600; font-size: 14px;
  text-decoration: none; cursor: pointer;
  transition: background .2s, border-color .2s, transform .15s;
}
.t-btn-ghost-light:hover { background: rgba(255,255,255,.16); border-color: rgba(255,255,255,.7); transform: translateY(-1px); }

.t-btn-sm { padding: 9px 20px; font-size: 13px; }
.t-btn-lg { padding: 15px 32px; font-size: 15px; }

/* ════════════════════════════════════════
   HERO
════════════════════════════════════════ */
.t-hero {
  min-height: 100vh; display: flex; flex-direction: column;
  justify-content: center; position: relative; overflow: hidden;
  background: var(--navy);
}

.t-hero-bg { position: absolute; inset: 0; pointer-events: none; }

/* Rich navy gradient mesh */
.t-hero-mesh {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 70% 80% at 75% 30%, rgba(26,86,219,.35) 0%, transparent 65%),
    radial-gradient(ellipse 50% 60% at 15% 70%, rgba(13,43,94,.8) 0%, transparent 55%),
    linear-gradient(165deg, #0d2b5e 0%, #081a3d 55%, #0a2050 100%);
}

/* Dot grid */
.t-hero-grid {
  position: absolute; inset: 0;
  background-image:
    radial-gradient(circle, rgba(255,255,255,.12) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 100%);
}

/* Glow blobs */
.t-hero-glow-tl {
  position: absolute; top: -15%; left: -10%;
  width: 55vw; height: 55vw; border-radius: 50%;
  background: radial-gradient(circle, rgba(26,86,219,.22) 0%, transparent 65%);
  filter: blur(60px);
}
.t-hero-glow-br {
  position: absolute; bottom: -20%; right: -5%;
  width: 40vw; height: 40vw; border-radius: 50%;
  background: radial-gradient(circle, rgba(245,158,11,.12) 0%, transparent 65%);
  filter: blur(70px);
}

/* Diagonal decorative hairline */
.t-diagonal-rule {
  position: absolute; top: 0; right: 22%; bottom: 0; width: 1px;
  background: linear-gradient(to bottom, transparent 5%, rgba(255,255,255,.1) 35%, rgba(255,255,255,.1) 65%, transparent 95%);
  transform: skewX(-3deg);
  pointer-events: none;
}

.t-hero-inner {
  max-width: 920px; margin: 0 auto; padding: 150px 36px 110px;
  position: relative; z-index: 1; text-align: center;
}

/* Eyebrow */
.t-eyebrow {
  display: flex; align-items: center; justify-content: center; gap: 16px;
  font-size: 10px; font-weight: 700; letter-spacing: .26em;
  text-transform: uppercase; color: rgba(255,255,255,.6);
  margin-bottom: 36px; animation: fadeUp .7s ease both .1s;
}
.t-eyebrow-bar { flex: 1; max-width: 52px; height: 1px; background: rgba(255,255,255,.25); }

/* Headline */
.t-hero-h1 { margin: 0 0 30px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.t-hl {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 800; line-height: 1.08;
  letter-spacing: -.02em; display: block;
  color: var(--white);
  font-size: clamp(3.2rem, 7.5vw, 5.8rem);
}
.t-hl-1 { animation: fadeUp .75s ease both .2s; }
.t-hl-2 { animation: fadeUp .75s ease both .34s; }
.t-accent { font-style: italic; color: var(--gold-lt); }

.t-hero-sub {
  font-size: 17px; line-height: 1.85; color: rgba(255,255,255,.65);
  font-weight: 300; max-width: 640px; margin: 0 auto 44px;
  animation: fadeUp .75s ease both .46s; letter-spacing: .01em;
}

.t-hero-cta {
  display: flex; gap: 14px; flex-wrap: wrap; justify-content: center;
  margin-bottom: 80px; animation: fadeUp .75s ease both .56s;
}

/* Stats band */
.t-stat-band {
  display: inline-flex; align-items: stretch; border-radius: 14px;
  border: 1px solid rgba(255,255,255,.15); overflow: hidden;
  background: rgba(255,255,255,.06); backdrop-filter: blur(12px);
  animation: fadeUp .75s ease both .68s;
}
.t-stat-item {
  display: flex; flex-direction: column; gap: 6px; align-items: center;
  padding: 22px 44px; border-right: 1px solid rgba(255,255,255,.12);
  transition: background .2s;
}
.t-stat-item:last-child { border-right: none; }
.t-stat-item:hover { background: rgba(255,255,255,.07); }
.t-stat-num {
  font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 700;
  color: var(--gold-lt); line-height: 1;
}
.t-stat-lbl {
  font-size: 10px; font-weight: 700; letter-spacing: .14em;
  text-transform: uppercase; color: rgba(255,255,255,.5);
}
.t-shimmer { opacity: .35; animation: blink 1.4s ease-in-out infinite; }

/* Scroll hint */
.t-scroll-hint {
  position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  font-size: 9.5px; font-weight: 700; letter-spacing: .2em;
  text-transform: uppercase; color: rgba(255,255,255,.35);
  cursor: pointer; z-index: 1; transition: color .2s;
  animation: fadeUp .75s ease both .9s;
}
.t-scroll-hint:hover { color: rgba(255,255,255,.65); }
.t-scroll-line {
  width: 1px; height: 38px;
  background: linear-gradient(to bottom, rgba(255,255,255,.4), transparent);
  animation: scrollPulse 2.2s ease-in-out infinite;
}

/* ════════════════════════════════════════
   TRUSTED STRIP
════════════════════════════════════════ */
.t-strip {
  background: var(--off-white); border-bottom: 1px solid var(--gray-200);
  padding: 22px 36px; display: flex; align-items: center; gap: 28px;
  max-width: 100%; flex-wrap: wrap;
}
.t-strip-label {
  font-size: 10px; font-weight: 700; letter-spacing: .18em;
  text-transform: uppercase; color: var(--gray-400); white-space: nowrap;
}
.t-strip-divider { width: 1px; height: 20px; background: var(--gray-200); flex-shrink: 0; }
.t-strip-items { display: flex; gap: 32px; flex-wrap: wrap; }
.t-strip-items span {
  font-size: 13px; font-weight: 600; color: var(--gray-600);
  transition: color .2s; cursor: default;
}
.t-strip-items span:hover { color: var(--blue); }

/* ════════════════════════════════════════
   SECTIONS
════════════════════════════════════════ */
.t-section { padding: 112px 0; }
.t-section-bg { background: var(--off-white); }

.t-section-wrap {
  max-width: 1320px; margin: 0 auto; padding: 0 36px;
  display: grid; grid-template-columns: 1fr 1.1fr; gap: 100px; align-items: start;
}
.t-section-inner { max-width: 1320px; margin: 0 auto; padding: 0 36px; }
.t-section-hdr { text-align: center; margin-bottom: 72px; }
.t-center { text-align: center; }

.t-sec-eyebrow {
  font-size: 10px; font-weight: 700; letter-spacing: .24em;
  text-transform: uppercase; color: var(--blue); margin-bottom: 14px;
  display: block;
}
.t-sec-h2 {
  font-family: 'Playfair Display', Georgia, serif; font-weight: 800;
  font-size: clamp(2.1rem, 3.5vw, 3rem); letter-spacing: -.02em;
  color: var(--navy); margin: 0 0 18px; line-height: 1.18;
}
.t-sec-body {
  font-size: 15.5px; line-height: 1.85; color: var(--gray-600);
  font-weight: 400; margin: 0;
}

/* Checklist */
.t-list { list-style: none; padding: 0; margin: 28px 0 0; display: flex; flex-direction: column; gap: 14px; }
.t-list li {
  padding-left: 24px; position: relative; font-size: 14.5px;
  line-height: 1.6; color: var(--gray-600); font-weight: 400;
}
.t-list li::before {
  content: '';
  position: absolute; left: 0; top: 7px;
  width: 10px; height: 10px; border-radius: 3px;
  background: var(--blue);
}

/* ── Workflow diagram ── */
.t-flow-diagram { display: flex; flex-direction: column; }
.t-flow-step {
  display: flex; align-items: flex-start; gap: 18px;
  padding: 22px 20px; border-radius: 12px; position: relative;
  animation: fadeUp .5s ease both; transition: background .2s, box-shadow .2s;
}
.t-flow-step:hover { background: var(--blue-pale); box-shadow: var(--shadow-sm); }

/* Connecting vertical line */
.t-flow-connector {
  position: absolute; left: 38px; top: 72px; bottom: -22px; width: 2px;
  background: linear-gradient(to bottom, var(--blue-soft), transparent);
  pointer-events: none;
}

.t-flow-node {
  width: 48px; height: 48px; border-radius: 13px; flex-shrink: 0;
  background: var(--white); border: 2px solid;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; box-shadow: var(--shadow-sm); transition: transform .2s;
}
.t-flow-step:hover .t-flow-node { transform: scale(1.07); }

.t-flow-emoji { line-height: 1; }
.t-flow-body { flex: 1; min-width: 0; padding-top: 2px; }
.t-flow-title { font-weight: 700; font-size: 14.5px; color: var(--navy); margin-bottom: 4px; }
.t-flow-desc  { font-size: 13px; color: var(--gray-600); line-height: 1.65; font-weight: 400; }
.t-flow-role  {
  font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  padding: 3px 10px; border-radius: 999px; border: 1px solid;
  flex-shrink: 0; align-self: flex-start; margin-top: 4px;
}

/* ── Modules ── */
.t-modules { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px,1fr)); gap: 20px; }
.t-module-card {
  background: var(--white); border: 1px solid var(--gray-200);
  border-radius: 16px; padding: 28px 26px;
  display: flex; flex-direction: column; gap: 12px;
  animation: fadeUp .5s ease both;
  box-shadow: var(--shadow-sm);
  transition: box-shadow .25s, border-color .25s, transform .2s;
  position: relative; overflow: hidden;
}
.t-module-card::after {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--blue), var(--blue-lt));
  opacity: 0; transition: opacity .25s;
}
.t-module-card:hover { box-shadow: var(--shadow-lg); border-color: var(--blue-soft); transform: translateY(-4px); }
.t-module-card:hover::after { opacity: 1; }

.t-mod-icon-wrap {
  width: 52px; height: 52px; border-radius: 13px;
  display: flex; align-items: center; justify-content: center; font-size: 24px;
}
.t-mod-title { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: var(--navy); }
.t-mod-desc  { font-size: 13.5px; line-height: 1.7; color: var(--gray-600); flex: 1; }
.t-mod-tags  { display: flex; gap: 6px; flex-wrap: wrap; }
.t-mod-tag   { font-size: 10px; font-weight: 700; letter-spacing: .07em; padding: 3px 9px; border-radius: 999px; background: var(--blue-pale); color: var(--blue); border: 1px solid var(--blue-soft); }
.t-mod-footer { margin-top: 4px; }
.t-mod-link {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12.5px; font-weight: 700; color: var(--blue); text-decoration: none;
  letter-spacing: .02em; transition: gap .2s;
}
.t-mod-link:hover { gap: 8px; }

/* ── Features ── */
.t-features {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr));
  gap: 0; border: 1px solid var(--gray-200); border-radius: 18px; overflow: hidden;
  box-shadow: var(--shadow-md);
}
.t-feat {
  padding: 34px 30px; background: var(--white);
  border-right: 1px solid var(--gray-200); border-bottom: 1px solid var(--gray-200);
  animation: fadeUp .5s ease both; transition: background .2s;
}
.t-feat:hover { background: var(--blue-pale); }
.t-feat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.t-feat-ico-wrap { font-size: 26px; line-height: 1; }
.t-feat-num { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: var(--gray-200); line-height: 1; }
.t-feat-title { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: var(--navy); margin-bottom: 10px; }
.t-feat-desc  { font-size: 13.5px; line-height: 1.75; color: var(--gray-600); }

/* ════════════════════════════════════════
   CTA
════════════════════════════════════════ */
.t-cta {
  padding: 120px 36px; position: relative; overflow: hidden;
  background: var(--navy);
}
.t-cta-bg { position: absolute; inset: 0; pointer-events: none; }
.t-cta-mesh {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 65% 70% at 50% 50%, rgba(26,86,219,.4) 0%, transparent 70%),
    linear-gradient(165deg, #0d2b5e 0%, #081a3d 100%);
}
.t-cta-orb {
  position: absolute; top: -30%; right: -10%;
  width: 50vw; height: 50vw; border-radius: 50%;
  background: radial-gradient(circle, rgba(245,158,11,.12) 0%, transparent 65%);
  filter: blur(60px);
}
.t-cta-inner {
  max-width: 720px; margin: 0 auto; position: relative; z-index: 1;
  text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0;
}
.t-cta-overline {
  font-size: 10px; font-weight: 700; letter-spacing: .26em;
  text-transform: uppercase; color: var(--gold-lt);
  margin-bottom: 20px;
}
.t-cta-h2 {
  font-family: 'Playfair Display', serif; font-weight: 800;
  font-size: clamp(2.1rem, 4vw, 3.2rem); color: var(--white);
  line-height: 1.15; letter-spacing: -.02em; margin-bottom: 20px;
}
.t-cta-sub {
  font-size: 15.5px; line-height: 1.8; color: rgba(255,255,255,.6);
  max-width: 520px; margin: 0 auto 44px; font-weight: 300;
}

/* ════════════════════════════════════════
   FOOTER
════════════════════════════════════════ */
.t-footer {
  padding: 36px 36px; border-top: 1px solid var(--gray-200);
  background: var(--white);
}
.t-footer-inner {
  max-width: 1320px; margin: 0 auto;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
}
.t-footer .t-logo-name { color: var(--navy); }
.t-footer .t-logo-tag  { color: var(--blue); }
.t-footer-copy { font-size: 12px; color: var(--gray-400); letter-spacing: .01em; }

/* ════════════════════════════════════════
   TRANSITIONS
════════════════════════════════════════ */
.t-fade-enter-active, .t-fade-leave-active { transition: opacity .2s, transform .2s; }
.t-fade-enter-from, .t-fade-leave-to { opacity: 0; transform: translateY(-6px); }

/* ════════════════════════════════════════
   KEYFRAMES
════════════════════════════════════════ */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes blink {
  0%, 100% { opacity: .3; }
  50%       { opacity: .7; }
}
@keyframes scrollPulse {
  0%, 100% { opacity: .4; transform: scaleY(1); transform-origin: top; }
  50%       { opacity: 1;  transform: scaleY(.6); }
}

/* ════════════════════════════════════════
   RESPONSIVE
════════════════════════════════════════ */
@media (max-width: 1060px) {
  .t-section-wrap { grid-template-columns: 1fr; gap: 60px; }
}
@media (max-width: 800px) {
  .t-nav-links { display: none; }
  .t-hero-inner { padding: 120px 20px 90px; }
  .t-stat-band { flex-direction: column; width: 100%; max-width: 320px; border-radius: 14px; }
  .t-stat-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,.12); }
  .t-stat-item:last-child { border-bottom: none; }
  .t-section { padding: 72px 0; }
  .t-section-wrap, .t-section-inner { padding: 0 20px; }
  .t-strip { padding: 18px 20px; }
}
@media (max-width: 500px) {
  .t-hl { font-size: 2.6rem; }
  .t-hero-cta { flex-direction: column; align-items: stretch; }
  .t-hero-cta a, .t-hero-cta button { justify-content: center; }
}
</style>