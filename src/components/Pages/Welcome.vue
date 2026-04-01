<template>
  <div class="root" :class="{ dark: darkMode }">

    <!-- ══ NAVBAR ══ -->
    <header class="nav" :class="{ scrolled }">
      <div class="nav-inner">
        <div class="logo">
          <div class="logo-icon">
            <svg viewBox="0 0 36 36" fill="none" width="18" height="18">
              <rect x="2" y="4" width="14" height="10" rx="2" fill="currentColor" opacity=".9"/>
              <rect x="20" y="4" width="14" height="10" rx="2" fill="currentColor" opacity=".5"/>
              <rect x="2" y="22" width="14" height="10" rx="2" fill="currentColor" opacity=".5"/>
              <rect x="20" y="22" width="14" height="10" rx="2" fill="currentColor" opacity=".9"/>
              <path d="M16 9h4M16 27h4M9 14v8M27 14v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="logo-text">
            <span class="logo-name">TERA</span>
            <span class="logo-tag">Process Intelligence</span>
          </div>
        </div>

        <nav class="nav-links">
          <button @click="scrollTo('solutions')" class="nav-link">Solutions</button>
          <button @click="scrollTo('workflow')"  class="nav-link">Workflow</button>
          <button @click="scrollTo('modules')"   class="nav-link">Modules</button>
          <button @click="scrollTo('platform')"  class="nav-link">Platform</button>
        </nav>

        <div class="nav-actions">
          <button @click="toggleDark" class="icon-btn">
            <svg v-if="darkMode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15">
              <circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          </button>
          <router-link to="/login" class="btn-ghost">Sign In</router-link>
          <router-link to="/login" class="btn-primary">
            Request Access
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </router-link>
        </div>
      </div>
    </header>


    <!-- ══ HERO ══ -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-grid"></div>
        <div class="hero-radial"></div>
        <div class="hero-lines">
          <div class="h-line" v-for="i in 6" :key="i" :style="{ left: (i * 14) + '%', animationDelay: (i * 0.3) + 's' }"></div>
        </div>
      </div>

      <div class="hero-inner">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          Enterprise-Grade &nbsp;·&nbsp; Audit-Ready &nbsp;·&nbsp; Multi-Department
        </div>

        <h1 class="hero-title">
          <span class="title-line">Streamline Every</span>
          <span class="title-line title-accent">Business Process.</span>
          <span class="title-line">At Scale.</span>
        </h1>

        <p class="hero-body">
          TERA BPM unifies tender management, project governance, financial control,
          and HR operations into a single traceable system — giving leadership
          complete visibility over every process, every approval, every outcome.
        </p>

        <div class="hero-actions">
          <router-link to="/login" class="btn-cta">
            Start Managing Processes
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </router-link>
          <button @click="scrollTo('workflow')" class="btn-learn">
            See How It Works
          </button>
        </div>

        <div class="hero-kpis">
          <div class="kpi" v-for="(s, i) in heroStats" :key="i">
            <div class="kpi-val">
              <span v-if="loading" class="shimmer">—</span>
              <span v-else>{{ s.value }}</span>
            </div>
            <div class="kpi-label">{{ s.label }}</div>
          </div>
        </div>
      </div>

      <!-- Right diagram -->
      <div class="hero-diagram" aria-hidden="true">
        <div class="diagram-card" v-for="(step, i) in diagramSteps" :key="i"
          :style="{ animationDelay: (i * 0.18 + 0.6) + 's', top: (i * 88) + 'px' }">
          <div class="dc-bar" :style="{ background: step.color }"></div>
          <div class="dc-content">
            <div class="dc-stage">{{ step.stage }}</div>
            <div class="dc-title">{{ step.title }}</div>
          </div>
          <div class="dc-status" :style="{ color: step.color }">{{ step.status }}</div>
        </div>
        <div class="diagram-line" v-for="i in 3" :key="'l'+i"
          :style="{ top: (i * 88 - 8) + 'px' }"></div>
      </div>
    </section>


    <!-- ══ DEPT STRIP ══ -->
    <div class="dept-strip">
      <span class="ds-label">Deployed across</span>
      <div class="ds-divider"></div>
      <div class="ds-items">
        <span v-for="d in departments" :key="d">{{ d }}</span>
      </div>
    </div>


    <!-- ══ VALUE PROPS ══ -->
    <section id="solutions" class="section bg-light">
      <div class="container">
        <div class="section-head">
          <div class="eyebrow">Why TERA BPM</div>
          <h2 class="section-title">One System. Every Process.<br>Zero Accountability Gaps.</h2>
          <p class="section-sub">
            Purpose-built for organisations that cannot afford process failures —
            where every decision must be traceable and every workflow must be governed.
          </p>
        </div>
        <div class="value-grid">
          <div class="value-card" v-for="(v, i) in valueProps" :key="i"
            :style="{ animationDelay: (i * 0.1) + 's' }">
            <div class="vc-icon" :style="{ color: v.color, background: v.color + '15' }">{{ v.icon }}</div>
            <h3 class="vc-title">{{ v.title }}</h3>
            <p class="vc-body">{{ v.body }}</p>
          </div>
        </div>
      </div>
    </section>


    <!-- ══ WORKFLOW ══ -->
    <section id="workflow" class="section bg-dark">
      <div class="container">
        <div class="workflow-layout">
          <div class="wf-copy">
            <div class="eyebrow eyebrow-lt">Tender Lifecycle</div>
            <h2 class="section-title on-dark">Structured Workflows.<br>Governed Approvals.</h2>
            <p class="section-sub on-dark">
              Every tender progresses through a controlled, multi-stage process —
              from submission through departmental review, financial clearance,
              competitive evaluation, to formal contract award.
            </p>
            <ul class="check-list">
              <li>Structured tender submission with document checklists</li>
              <li>Configurable multi-level approval routing by role and value</li>
              <li>Vendor scoring matrix with weighted evaluation criteria</li>
              <li>Automated contract generation and award notifications</li>
              <li>Full audit trail — every action timestamped and attributed</li>
            </ul>
            <router-link to="/login" class="btn-primary mt-lg">
              Submit a Tender
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </router-link>
          </div>

          <div class="wf-steps">
            <div class="wf-step" v-for="(step, i) in workflowSteps" :key="i"
              :style="{ animationDelay: (i * 0.12) + 's' }">
              <div class="wf-connector" v-if="i < workflowSteps.length - 1"
                :style="{ borderColor: step.color + '40' }"></div>
              <div class="wf-num" :style="{ borderColor: step.color, color: step.color }">
                {{ String(i + 1).padStart(2, '0') }}
              </div>
              <div class="wf-body">
                <div class="wf-title">{{ step.title }}</div>
                <div class="wf-desc">{{ step.desc }}</div>
              </div>
              <span class="wf-badge"
                :style="{ color: step.color, background: step.color + '18', border: '1px solid ' + step.color + '35' }">
                {{ step.tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- ══ MODULES ══ -->
    <section id="modules" class="section bg-light">
      <div class="container">
        <div class="section-head">
          <div class="eyebrow">Core Platform</div>
          <h2 class="section-title">Six Integrated Modules.<br>One Unified Platform.</h2>
          <p class="section-sub">
            Each module operates independently or as part of the full suite —
            covering every dimension of business process management.
          </p>
        </div>
        <div class="modules-grid">
          <div class="mod-card" v-for="(m, i) in modules" :key="i"
            :style="{ animationDelay: (i * 0.09) + 's' }">
            <div class="mod-top">
              <div class="mod-icon" :style="{ background: m.bg, color: m.ic }">{{ m.icon }}</div>
              <div class="mod-tags">
                <span class="mod-tag" v-for="t in m.tags" :key="t">{{ t }}</span>
              </div>
            </div>
            <h3 class="mod-title">{{ m.title }}</h3>
            <p class="mod-desc">{{ m.desc }}</p>
            <router-link to="/login" class="mod-link">
              Access module
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </router-link>
          </div>
        </div>
      </div>
    </section>


    <!-- ══ PLATFORM FEATURES ══ -->
    <section id="platform" class="section bg-mid">
      <div class="container">
        <div class="section-head">
          <div class="eyebrow">Platform Capabilities</div>
          <h2 class="section-title">Governance Built Into<br>Every Layer</h2>
          <p class="section-sub" style="max-width:520px;margin:0 auto">
            Compliance, traceability and security are not add-ons —
            they are the foundation every feature is built on.
          </p>
        </div>
        <div class="feat-grid">
          <div class="feat-item" v-for="(f, i) in features" :key="i"
            :style="{ animationDelay: (i * 0.07) + 's' }">
            <div class="feat-ico">{{ f.icon }}</div>
            <div class="feat-body">
              <h3 class="feat-title">{{ f.title }}</h3>
              <p class="feat-desc">{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- ══ CTA ══ -->
    <section class="cta-wrap">
      <div class="cta-grid-bg"></div>
      <div class="cta-inner">
        <div class="cta-label">Ready to transform operations?</div>
        <h2 class="cta-title">Every Business Process.<br>Governed. Traceable. Efficient.</h2>
        <p class="cta-sub">
          Join TERA Company departments already using the BPM platform
          to eliminate bottlenecks and ensure full accountability.
        </p>
        <div class="cta-actions">
          <router-link to="/login" class="btn-cta">
            Access the Platform
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </router-link>
          <button @click="scrollTo('modules')" class="btn-learn btn-learn-inv">Explore Modules</button>
        </div>
      </div>
    </section>


    <!-- ══ FOOTER ══ -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="logo" style="margin-bottom:14px">
            <div class="logo-icon logo-icon-sm">
              <svg viewBox="0 0 36 36" fill="none" width="15" height="15">
                <rect x="2" y="4" width="14" height="10" rx="2" fill="currentColor" opacity=".9"/>
                <rect x="20" y="4" width="14" height="10" rx="2" fill="currentColor" opacity=".5"/>
                <rect x="2" y="22" width="14" height="10" rx="2" fill="currentColor" opacity=".5"/>
                <rect x="20" y="22" width="14" height="10" rx="2" fill="currentColor" opacity=".9"/>
                <path d="M16 9h4M16 27h4M9 14v8M27 14v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="logo-text">
              <span class="logo-name ftr-name">TERA</span>
              <span class="logo-tag ftr-tag">BPM Platform</span>
            </div>
          </div>
          <p class="footer-desc">
            Enterprise Business Process Management for TERA Company —
            unifying tender, project, finance and HR operations.
          </p>
        </div>
        <div class="footer-cols">
          <div class="footer-col" v-for="col in footerLinks" :key="col.label">
            <div class="fc-label">{{ col.label }}</div>
            <div class="fc-links">
              <router-link to="/login" class="fc-link" v-for="l in col.links" :key="l">{{ l }}</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bar">
        © 2026 TERA Company &nbsp;·&nbsp; Business Process Management System &nbsp;·&nbsp; All rights reserved
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
  { label: 'Tenders Processed',  value: '—' },
  { label: 'Active Projects',    value: '—' },
  { label: 'System Uptime',      value: '—' },
  { label: 'Departments Served', value: '5+' },
])

const diagramSteps = [
  { stage: 'Stage 01', title: 'Tender Submission Received',  status: 'Submitted', color: '#2563eb' },
  { stage: 'Stage 02', title: 'Department Head Review',      status: 'In Review', color: '#d97706' },
  { stage: 'Stage 03', title: 'Finance Clearance Check',     status: 'Pending',   color: '#7c3aed' },
  { stage: 'Stage 04', title: 'Contract Award & Issuance',   status: 'Approved',  color: '#059669' },
]

const departments = ['Procurement', 'Finance', 'Engineering', 'HR & Administration', 'Executive Office']

const valueProps = [
  { icon: '📋', color: '#2563eb', title: 'Process Standardisation',      body: 'Define and enforce standard operating procedures across all departments — eliminating ad-hoc workflows and inconsistent approvals.' },
  { icon: '🔍', color: '#059669', title: 'End-to-End Traceability',      body: 'Every action, approval and document change is logged with user identity, timestamp and rationale — providing a complete audit trail.' },
  { icon: '⏱',  color: '#d97706', title: 'Cycle Time Reduction',         body: 'Automated routing and smart escalations cut approval cycle times by removing manual handoffs and chasing between departments.' },
  { icon: '📊', color: '#7c3aed', title: 'Executive Visibility',         body: 'Real-time dashboards give leadership a live view of process health — bottlenecks, overdue approvals and budget utilisation.' },
  { icon: '🛡️', color: '#dc2626', title: 'Compliance Assurance',         body: 'Built-in policy controls and approval thresholds ensure every transaction complies with procurement and financial regulations.' },
  { icon: '🔗', color: '#0891b2', title: 'Cross-Department Integration', body: 'Tender, finance, HR and project modules share a unified data layer — eliminating silos and ensuring consistent information.' },
]

const workflowSteps = [
  { title: 'Tender Submission',    desc: 'Vendor or internal department submits a tender with all mandatory documentation and compliance declarations.',   tag: 'Initiator',   color: '#3b82f6' },
  { title: 'Head of Department',   desc: 'The relevant HOD reviews the submission for scope alignment, departmental feasibility and budget fit.',           tag: 'HOD Review',  color: '#06b6d4' },
  { title: 'Finance Clearance',    desc: 'Finance verifies budget availability, checks expenditure policy and confirms funding source before proceeding.', tag: 'Finance',     color: '#8b5cf6' },
  { title: 'Evaluation Committee', desc: 'A cross-functional committee applies the standard vendor scoring matrix and documents evaluation outcomes.',     tag: 'Committee',   color: '#f59e0b' },
  { title: 'Award & Contract',     desc: 'Procurement issues the formal award letter, generates the contract and notifies all stakeholders.',              tag: 'Procurement', color: '#10b981' },
]

const modules = [
  { icon: '📄', bg: '#eff6ff', ic: '#1d4ed8', title: 'Tender Management',      desc: 'Manage the full tender lifecycle from receipt to award with structured stages, document control and automated status tracking.',   tags: ['Procurement', 'Approval'] },
  { icon: '📊', bg: '#f0fdf4', ic: '#15803d', title: 'Project Tracking',       desc: 'Track milestones, budgets and deliverables across all active projects with real-time progress reporting and escalation alerts.',     tags: ['Planning', 'Reporting'] },
  { icon: '💳', bg: '#faf5ff', ic: '#6d28d9', title: 'Financial Control',      desc: 'Enforce budget allocation policies, manage expense approvals and produce financial dashboards for executive decision-making.',        tags: ['Budget', 'Compliance'] },
  { icon: '👥', bg: '#fff7ed', ic: '#b45309', title: 'HR & People Ops',        desc: 'Centralise employee records, manage payroll workflows, administer leave and track attendance within a governed system.',             tags: ['Payroll', 'HR'] },
  { icon: '🔄', bg: '#ecfdf5', ic: '#065f46', title: 'Approval Workflows',     desc: 'Design and deploy configurable multi-level approval chains with delegation rules, escalation timers and a full audit trail.',        tags: ['Routing', 'Governance'] },
  { icon: '📈', bg: '#fefce8', ic: '#854d0e', title: 'Analytics & Compliance', desc: 'Generate executive KPI dashboards, process performance reports and exportable compliance documentation for audits.',                tags: ['Analytics', 'Audit'] },
]

const features = [
  { icon: '⚡', title: 'Role-Based Routing',            desc: 'Approvals automatically route to the correct approver based on role, department and transaction value — no manual forwarding.' },
  { icon: '🔒', title: 'Immutable Audit Log',           desc: 'Every state change, approval, rejection and comment is permanently recorded with user identity and timestamp for regulatory compliance.' },
  { icon: '📧', title: 'Contextual Notifications',      desc: 'System-generated alerts inform the right stakeholders at the right time — pending actions, approaching deadlines and decisions.' },
  { icon: '📁', title: 'Document Version Control',      desc: 'All submitted documents are versioned, linked to their workflow stage and preserved for the full retention period.' },
  { icon: '💹', title: 'Pre-Commitment Budget Checks',  desc: 'Real-time budget availability checks run before any approval proceeds — preventing financial over-commitment at source.' },
  { icon: '🛡️', title: 'Least-Privilege Access',        desc: 'Granular role-based permission controls ensure each user sees only the data and actions their position authorises.' },
  { icon: '📱', title: 'Any Device, Any Location',      desc: 'Approve, review and submit from desktop, tablet or mobile — the full platform is optimised for every screen size.' },
  { icon: '📊', title: 'Live Process Dashboards',       desc: 'Executive dashboards provide live insight into bottlenecks, cycle times and process compliance across all departments.' },
]

const footerLinks = [
  { label: 'Modules',  links: ['Tender Management', 'Project Tracking', 'Financial Control', 'HR Operations'] },
  { label: 'Platform', links: ['Approval Workflows', 'Audit & Compliance', 'Analytics', 'Document Control'] },
  { label: 'Company',  links: ['About TERA', 'Departments', 'Support', 'System Status'] },
]

async function loadStats() {
  try {
    const s = await DashboardService.getDashboardStats()
    heroStats.value[0].value = s.tenders.total + '+'
    heroStats.value[1].value = s.projects.total + '+'
    heroStats.value[2].value = s.uptime + '%'
  } catch {
    heroStats.value[0].value = '142+'
    heroStats.value[1].value = '37'
    heroStats.value[2].value = '99.8%'
  } finally { loading.value = false }
}

function toggleDark() {
  darkMode.value = !darkMode.value
  localStorage.setItem('tera-dark', String(darkMode.value))
}
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
onMounted(() => {
  const saved = localStorage.getItem('tera-dark')
  if (saved === 'true') darkMode.value = true
  loadStats()
  window.addEventListener('scroll', () => { scrolled.value = window.scrollY > 50 }, { passive: true })
})
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

/* ══ TOKENS ══ */
.root {
  --primary:      #1a3faa;
  --primary-dk:   #0e2570;
  --primary-lt:   #2f5be0;
  --primary-pale: #eef2ff;
  --primary-soft: #c7d2fe;

  --teal:   #0891b2;
  --green:  #059669;
  --amber:  #d97706;
  --red:    #dc2626;
  --violet: #7c3aed;

  --ink:       #0e1b2e;
  --ink-alt:   #1c2d42;
  --gray-700:  #3d4f63;
  --gray-500:  #6b7e95;
  --gray-300:  #c4cdd8;
  --gray-100:  #edf1f5;
  --gray-50:   #f5f7fa;
  --white:     #ffffff;

  --surface:     #ffffff;
  --surface-alt: #f5f7fa;
  --border:      #dde3eb;
  --text:        var(--ink);
  --muted:       var(--gray-500);

  --ff-h:    'DM Serif Display', Georgia, serif;
  --ff-body: 'IBM Plex Sans', 'Helvetica Neue', sans-serif;
  --ff-mono: 'IBM Plex Mono', monospace;

  --r-sm: 6px;
  --r-md: 10px;
  --r-lg: 14px;
  --r-xl: 20px;

  font-family: var(--ff-body);
  background: var(--surface);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

.root.dark {
  --surface:     #0c1422;
  --surface-alt: #101d30;
  --border:      rgba(255,255,255,.08);
  --text:        #d4e0ed;
  --muted:       #617a96;
  --ink:         #d4e0ed;
  --ink-alt:     #b8ccdf;
  --gray-50:     #101d30;
  --gray-100:    #162032;
  --gray-300:    rgba(255,255,255,.1);
  --gray-700:    #8fa5bc;
  --primary-pale:#0d1d45;
  --primary-soft:rgba(47,91,224,.3);
  --white:       #141f32;
}

/* ══ NAV ══ */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 300;
  transition: background .3s, border-color .3s;
  border-bottom: 1px solid transparent;
}
.nav.scrolled {
  background: rgba(255,255,255,.97);
  border-color: var(--border);
  backdrop-filter: blur(20px);
}
.dark .nav.scrolled {
  background: rgba(12,20,34,.97);
  border-color: var(--border);
}
.nav-inner {
  max-width: 1340px; margin: 0 auto; padding: 0 48px;
  height: 66px; display: flex; align-items: center; gap: 36px;
}
.logo { display: flex; align-items: center; gap: 13px; flex-shrink: 0; }
.logo-icon {
  width: 38px; height: 38px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,.15); color: #fff;
  border: 1px solid rgba(255,255,255,.2); transition: all .2s;
}
.logo-icon-sm {
  width: 32px; height: 32px; border-radius: 8px;
  background: var(--primary-pale); color: var(--primary);
  border: 1px solid var(--primary-soft);
}
.nav.scrolled .logo-icon {
  background: var(--primary-pale); color: var(--primary);
  border-color: var(--primary-soft);
}
.logo-text { display: flex; flex-direction: column; gap: 2px; }
.logo-name {
  font-family: var(--ff-h); font-size: 18px; color: #fff;
  letter-spacing: .02em; line-height: 1;
}
.ftr-name { color: var(--ink) !important; }
.dark .ftr-name { color: var(--text) !important; }
.nav.scrolled .logo-name { color: var(--ink); }
.dark .nav.scrolled .logo-name { color: var(--text); }
.logo-tag {
  font-family: var(--ff-mono); font-size: 8px; font-weight: 500;
  letter-spacing: .14em; text-transform: uppercase;
  color: rgba(255,255,255,.5); line-height: 1;
}
.ftr-tag { color: var(--primary) !important; }
.nav.scrolled .logo-tag { color: var(--primary); }
.dark .nav.scrolled .logo-tag { color: var(--primary-soft); }

.nav-links { display: flex; gap: 2px; flex: 1; }
.nav-link {
  padding: 7px 14px; border-radius: var(--r-sm);
  font-family: var(--ff-body); font-size: 13.5px; font-weight: 500;
  color: rgba(255,255,255,.7); background: none; border: none; cursor: pointer;
  text-decoration: none; transition: color .2s, background .2s;
}
.nav.scrolled .nav-link { color: var(--gray-700); }
.dark .nav.scrolled .nav-link { color: var(--muted); }
.nav-link:hover { color: #fff; background: rgba(255,255,255,.1); }
.nav.scrolled .nav-link:hover { color: var(--primary); background: var(--primary-pale); }
.dark .nav.scrolled .nav-link:hover { color: var(--text); background: rgba(255,255,255,.05); }

.nav-actions { display: flex; align-items: center; gap: 10px; margin-left: auto; flex-shrink: 0; }
.icon-btn {
  width: 34px; height: 34px; border-radius: var(--r-sm);
  border: 1px solid rgba(255,255,255,.2);
  background: rgba(255,255,255,.08); color: rgba(255,255,255,.75);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .2s;
}
.nav.scrolled .icon-btn { border-color: var(--border); background: var(--surface); color: var(--gray-700); }
.dark .nav.scrolled .icon-btn { background: var(--surface-alt); color: var(--muted); }
.icon-btn:hover { background: rgba(255,255,255,.18); color: #fff; }
.nav.scrolled .icon-btn:hover { background: var(--primary-pale); color: var(--primary); border-color: var(--primary-soft); }

/* ══ BUTTONS ══ */
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 22px; border-radius: var(--r-md);
  background: var(--primary); color: #fff; border: none;
  font-family: var(--ff-body); font-size: 13.5px; font-weight: 600;
  letter-spacing: .01em; text-decoration: none; cursor: pointer;
  transition: background .2s, transform .15s;
}
.btn-primary:hover { background: var(--primary-lt); transform: translateY(-1px); }
.btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px; border-radius: var(--r-md);
  background: transparent; color: rgba(255,255,255,.75);
  border: 1px solid rgba(255,255,255,.25);
  font-family: var(--ff-body); font-size: 13.5px; font-weight: 500;
  text-decoration: none; cursor: pointer; transition: all .2s;
}
.nav.scrolled .btn-ghost { color: var(--gray-700); border-color: var(--border); }
.btn-ghost:hover { background: rgba(255,255,255,.1); color: #fff; border-color: rgba(255,255,255,.5); }
.nav.scrolled .btn-ghost:hover { background: var(--gray-100); color: var(--ink); }
.btn-cta {
  display: inline-flex; align-items: center; gap: 9px;
  padding: 14px 30px; border-radius: var(--r-md);
  background: var(--primary); color: #fff; border: none;
  font-family: var(--ff-body); font-size: 15px; font-weight: 600;
  text-decoration: none; cursor: pointer; letter-spacing: .01em;
  transition: background .2s, transform .15s;
}
.btn-cta:hover { background: var(--primary-lt); transform: translateY(-2px); }
.btn-learn {
  display: inline-flex; align-items: center; gap: 9px;
  padding: 14px 30px; border-radius: var(--r-md);
  background: rgba(255,255,255,.08); color: #fff;
  border: 1.5px solid rgba(255,255,255,.3);
  font-family: var(--ff-body); font-size: 15px; font-weight: 500;
  cursor: pointer; transition: all .2s;
}
.btn-learn:hover { background: rgba(255,255,255,.14); border-color: rgba(255,255,255,.6); transform: translateY(-1px); }
.btn-learn-inv {
  color: var(--text); border-color: var(--border); background: var(--surface-alt);
}
.btn-learn-inv:hover { background: var(--gray-100); border-color: var(--gray-300); color: var(--ink); }
.mt-lg { margin-top: 36px; }

/* ══ HERO ══ */
.hero {
  min-height: 100vh; position: relative; overflow: hidden;
  background: var(--primary-dk);
  display: grid; grid-template-columns: 1fr 400px; align-items: center;
}
.hero-bg { position: absolute; inset: 0; pointer-events: none; }
.hero-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%);
}
.hero-radial {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 55% 80% at 25% 50%, rgba(47,91,224,.28) 0%, transparent 65%);
}
.hero-lines { position: absolute; inset: 0; overflow: hidden; }
.h-line {
  position: absolute; top: 0; bottom: 0; width: 1px;
  background: linear-gradient(to bottom,
    transparent 0%, rgba(255,255,255,.05) 25%,
    rgba(255,255,255,.05) 75%, transparent 100%);
  animation: lineFade 5s ease-in-out infinite alternate;
}
@keyframes lineFade { from { opacity: .3; } to { opacity: .8; } }

.hero-inner {
  padding: 160px 48px 120px 80px; position: relative; z-index: 2;
}
.hero-badge {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--ff-mono); font-size: 10px; font-weight: 500;
  letter-spacing: .14em; text-transform: uppercase;
  color: rgba(255,255,255,.45); margin-bottom: 36px;
  animation: fadeUp .7s ease both .1s;
}
.badge-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #34d399; flex-shrink: 0;
}
.hero-title { margin: 0 0 26px; }
.title-line {
  display: block; font-family: var(--ff-h);
  font-size: clamp(2.6rem, 5vw, 4.6rem);
  line-height: 1.1; letter-spacing: -.02em; color: #fff;
}
.title-line:nth-child(1) { animation: fadeUp .75s ease both .15s; }
.title-line:nth-child(2) { animation: fadeUp .75s ease both .28s; }
.title-line:nth-child(3) { animation: fadeUp .75s ease both .41s; }
.title-accent { color: #93c5fd; font-style: italic; }
.hero-body {
  font-size: 16px; line-height: 1.85; color: rgba(255,255,255,.52);
  font-weight: 300; max-width: 540px; margin: 0 0 40px;
  animation: fadeUp .75s ease both .5s;
}
.hero-actions {
  display: flex; gap: 12px; flex-wrap: wrap;
  margin-bottom: 68px; animation: fadeUp .75s ease both .6s;
}
.hero-kpis {
  display: flex; border: 1px solid rgba(255,255,255,.1);
  border-radius: var(--r-lg); overflow: hidden;
  background: rgba(255,255,255,.04); backdrop-filter: blur(8px);
  width: fit-content; animation: fadeUp .75s ease both .7s;
}
.kpi {
  padding: 20px 34px; border-right: 1px solid rgba(255,255,255,.08);
  transition: background .2s;
}
.kpi:last-child { border-right: none; }
.kpi:hover { background: rgba(255,255,255,.05); }
.kpi-val {
  font-family: var(--ff-h); font-size: 2rem;
  color: #93c5fd; line-height: 1; margin-bottom: 6px;
}
.kpi-label {
  font-family: var(--ff-mono); font-size: 9px; font-weight: 500;
  letter-spacing: .15em; text-transform: uppercase; color: rgba(255,255,255,.3);
}
.shimmer { opacity: .3; animation: blink 1.4s ease-in-out infinite; }

/* Right diagram panel */
.hero-diagram {
  position: relative; z-index: 2;
  padding: 40px 48px 40px 0; height: 460px;
}
.diagram-card {
  position: absolute; left: 0; right: 48px;
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: var(--r-lg); padding: 14px 16px;
  display: flex; align-items: center; gap: 13px;
  backdrop-filter: blur(14px);
  animation: slideIn .5s ease both;
}
@keyframes slideIn {
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
}
.dc-bar { width: 4px; height: 34px; border-radius: 2px; flex-shrink: 0; }
.dc-content { flex: 1; min-width: 0; }
.dc-stage {
  font-family: var(--ff-mono); font-size: 9px; font-weight: 500;
  letter-spacing: .12em; text-transform: uppercase;
  color: rgba(255,255,255,.33); margin-bottom: 3px;
}
.dc-title { font-size: 13px; font-weight: 500; color: rgba(255,255,255,.82); }
.dc-status { font-family: var(--ff-mono); font-size: 10px; font-weight: 500; flex-shrink: 0; }
.diagram-line {
  position: absolute; left: 22px; width: 1px; height: 16px;
  background: rgba(255,255,255,.12); pointer-events: none;
}

/* ══ DEPT STRIP ══ */
.dept-strip {
  background: var(--surface-alt); border-bottom: 1px solid var(--border);
  padding: 18px 80px; display: flex; align-items: center; gap: 24px; flex-wrap: wrap;
}
.ds-label {
  font-family: var(--ff-mono); font-size: 9.5px; font-weight: 500;
  letter-spacing: .16em; text-transform: uppercase; color: var(--muted); white-space: nowrap;
}
.ds-divider { width: 1px; height: 16px; background: var(--border); flex-shrink: 0; }
.ds-items { display: flex; gap: 28px; flex-wrap: wrap; }
.ds-items span {
  font-size: 13px; font-weight: 500; color: var(--gray-700); cursor: default; transition: color .2s;
}
.dark .ds-items span { color: var(--muted); }
.ds-items span:hover { color: var(--primary); }

/* ══ SECTIONS ══ */
.section { padding: 108px 0; }
.bg-light { background: var(--surface); }
.bg-mid   { background: var(--surface-alt); }
.bg-dark  { background: var(--ink-alt); }
.dark .bg-dark { background: #090f1c; }
.container { max-width: 1340px; margin: 0 auto; padding: 0 80px; }
.section-head { text-align: center; margin-bottom: 68px; }

.eyebrow {
  font-family: var(--ff-mono); font-size: 10px; font-weight: 500;
  letter-spacing: .22em; text-transform: uppercase;
  color: var(--primary); margin-bottom: 14px; display: block;
}
.eyebrow-lt { color: #7dd3fc; }
.section-title {
  font-family: var(--ff-h); font-size: clamp(2rem, 3.5vw, 3rem);
  letter-spacing: -.022em; color: var(--ink); margin: 0 0 18px; line-height: 1.2;
}
.section-title.on-dark { color: #fff; }
.dark .section-title { color: var(--text); }
.section-sub {
  font-size: 15.5px; line-height: 1.85; color: var(--muted); font-weight: 300; margin: 0;
}
.section-sub.on-dark { color: rgba(255,255,255,.45); }
.check-list { list-style: none; padding: 0; margin: 26px 0 0; display: flex; flex-direction: column; gap: 12px; }
.check-list li {
  padding-left: 22px; position: relative;
  font-size: 14.5px; line-height: 1.65; color: rgba(255,255,255,.55); font-weight: 300;
}
.check-list li::before {
  content: ''; position: absolute; left: 0; top: 9px;
  width: 8px; height: 8px; border-radius: 2px; background: #34d399;
}

/* Value grid */
.value-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px;
}
.value-card {
  background: var(--surface-alt); border: 1px solid var(--border);
  border-radius: var(--r-lg); padding: 28px 26px;
  display: flex; flex-direction: column; gap: 13px;
  animation: fadeUp .5s ease both; transition: border-color .25s, transform .2s;
}
.value-card:hover { border-color: var(--primary-soft); transform: translateY(-3px); }
.dark .value-card { background: var(--surface-alt); }
.dark .value-card:hover { border-color: rgba(47,91,224,.35); }
.vc-icon {
  width: 46px; height: 46px; border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center; font-size: 21px; flex-shrink: 0;
}
.vc-title { font-family: var(--ff-h); font-size: 16px; color: var(--ink); margin: 0; }
.dark .vc-title { color: var(--text); }
.vc-body { font-size: 13.5px; line-height: 1.75; color: var(--muted); margin: 0; }

/* Workflow */
.workflow-layout { display: grid; grid-template-columns: 1fr 1.1fr; gap: 96px; align-items: start; }
.wf-copy { padding-top: 6px; }
.wf-steps { display: flex; flex-direction: column; }
.wf-step {
  display: flex; align-items: flex-start; gap: 18px;
  padding: 17px 14px; border-radius: var(--r-md); position: relative;
  animation: fadeUp .5s ease both; transition: background .2s;
}
.wf-step:hover { background: rgba(255,255,255,.04); }
.wf-connector {
  position: absolute; left: 35px; top: 64px; bottom: -17px; width: 1px;
  border-left: 1.5px dashed; pointer-events: none;
}
.wf-num {
  width: 44px; height: 44px; border-radius: var(--r-md); flex-shrink: 0;
  border: 1.5px solid; background: rgba(255,255,255,.04);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--ff-mono); font-size: 13px; font-weight: 500;
  transition: transform .2s;
}
.wf-step:hover .wf-num { transform: scale(1.06); }
.wf-body { flex: 1; min-width: 0; padding-top: 2px; }
.wf-title { font-weight: 600; font-size: 14px; color: rgba(255,255,255,.88); margin-bottom: 4px; }
.wf-desc  { font-size: 13px; color: rgba(255,255,255,.4); line-height: 1.65; font-weight: 300; }
.wf-badge {
  font-family: var(--ff-mono); font-size: 9.5px; font-weight: 500;
  letter-spacing: .1em; text-transform: uppercase;
  padding: 3px 10px; border-radius: 999px; flex-shrink: 0;
  align-self: flex-start; margin-top: 4px;
}

/* Modules */
.modules-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 18px; }
.mod-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r-lg); padding: 26px 24px;
  display: flex; flex-direction: column; gap: 12px;
  animation: fadeUp .5s ease both; transition: border-color .25s, transform .2s;
}
.mod-card:hover { border-color: var(--primary-soft); transform: translateY(-3px); }
.dark .mod-card { background: var(--surface-alt); }
.dark .mod-card:hover { border-color: rgba(47,91,224,.3); }
.mod-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.mod-icon {
  width: 46px; height: 46px; border-radius: var(--r-md); font-size: 21px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.mod-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.mod-tag {
  font-family: var(--ff-mono); font-size: 9.5px; font-weight: 500; letter-spacing: .06em;
  padding: 3px 9px; border-radius: 999px;
  background: var(--primary-pale); color: var(--primary); border: 1px solid var(--primary-soft);
}
.dark .mod-tag { background: rgba(26,63,170,.2); color: #93c5fd; border-color: rgba(26,63,170,.3); }
.mod-title { font-family: var(--ff-h); font-size: 16px; color: var(--ink); margin: 0; }
.dark .mod-title { color: var(--text); }
.mod-desc { font-size: 13.5px; line-height: 1.75; color: var(--muted); flex: 1; }
.mod-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12.5px; font-weight: 600; color: var(--primary);
  text-decoration: none; transition: gap .2s;
}
.dark .mod-link { color: #93c5fd; }
.mod-link:hover { gap: 9px; }

/* Features */
.feat-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1px; background: var(--border);
  border: 1px solid var(--border); border-radius: var(--r-xl); overflow: hidden;
}
.feat-item {
  display: flex; gap: 18px; align-items: flex-start;
  padding: 28px 24px; background: var(--surface-alt);
  animation: fadeUp .5s ease both; transition: background .2s;
}
.feat-item:hover { background: var(--surface); }
.dark .feat-item { background: var(--surface); }
.dark .feat-item:hover { background: var(--surface-alt); }
.feat-ico { font-size: 20px; line-height: 1; flex-shrink: 0; margin-top: 2px; }
.feat-title { font-family: var(--ff-h); font-size: 15px; color: var(--ink); margin: 0 0 8px; }
.dark .feat-title { color: var(--text); }
.feat-desc { font-size: 13.5px; line-height: 1.75; color: var(--muted); margin: 0; }

/* ══ CTA ══ */
.cta-wrap {
  padding: 116px 80px; position: relative; overflow: hidden;
  background: var(--primary-dk);
}
.cta-grid-bg {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
  background-size: 56px 56px;
}
.cta-inner {
  max-width: 760px; margin: 0 auto; position: relative; z-index: 1;
  text-align: center; display: flex; flex-direction: column; align-items: center;
}
.cta-label {
  font-family: var(--ff-mono); font-size: 9.5px; font-weight: 500;
  letter-spacing: .2em; text-transform: uppercase; color: #7dd3fc; margin-bottom: 22px;
}
.cta-title {
  font-family: var(--ff-h); font-size: clamp(2.1rem, 4vw, 3.3rem);
  color: #fff; line-height: 1.18; letter-spacing: -.02em; margin: 0 0 20px;
}
.cta-sub {
  font-size: 15.5px; line-height: 1.85; color: rgba(255,255,255,.42);
  max-width: 500px; margin: 0 auto 44px; font-weight: 300;
}
.cta-actions { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }

/* ══ FOOTER ══ */
.footer { background: var(--surface); border-top: 1px solid var(--border); }
.footer-inner {
  max-width: 1340px; margin: 0 auto; padding: 64px 80px;
  display: grid; grid-template-columns: 320px 1fr; gap: 80px;
}
.footer-desc { font-size: 13.5px; line-height: 1.8; color: var(--muted); max-width: 270px; margin: 0; }
.footer-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
.footer-col  { display: flex; flex-direction: column; gap: 14px; }
.fc-label {
  font-family: var(--ff-mono); font-size: 9.5px; font-weight: 500;
  letter-spacing: .18em; text-transform: uppercase; color: var(--ink);
}
.dark .fc-label { color: var(--muted); }
.fc-links { display: flex; flex-direction: column; gap: 9px; }
.fc-link { font-size: 13.5px; color: var(--muted); text-decoration: none; transition: color .2s; }
.fc-link:hover { color: var(--primary); }
.footer-bar {
  border-top: 1px solid var(--border); padding: 20px 80px;
  font-family: var(--ff-mono); font-size: 10.5px; letter-spacing: .03em;
  color: var(--muted); max-width: 100%;
}

/* ══ KEYFRAMES ══ */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes blink {
  0%, 100% { opacity: .25; }
  50%       { opacity: .7; }
}

/* ══ RESPONSIVE ══ */
@media (max-width: 1100px) {
  .hero { grid-template-columns: 1fr; }
  .hero-diagram { display: none; }
  .workflow-layout { grid-template-columns: 1fr; gap: 56px; }
  .footer-inner { grid-template-columns: 1fr; gap: 48px; }
}
@media (max-width: 860px) {
  .nav-links { display: none; }
  .container, .hero-inner, .dept-strip, .cta-wrap, .footer-inner, .footer-bar { padding-left: 24px; padding-right: 24px; }
  .section { padding: 72px 0; }
  .hero-inner { padding: 130px 24px 100px; }
  .hero-kpis { flex-wrap: wrap; max-width: 100%; }
  .kpi { flex: 1; min-width: 130px; }
  .footer-cols { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 540px) {
  .title-line { font-size: 2.4rem; }
  .hero-actions { flex-direction: column; align-items: stretch; }
  .hero-actions a, .hero-actions button { justify-content: center; }
  .footer-cols { grid-template-columns: 1fr; }
  .cta-actions { flex-direction: column; align-items: stretch; }
  .cta-actions a, .cta-actions button { justify-content: center; }
}
</style>