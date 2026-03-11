<template>
  <div class="dash-root">
    <div class="dash-inner">

      <!-- ── Header ── -->
      <div class="dash-header">
        <div>
          <div class="dash-eyebrow">TENDER MANAGEMENT</div>
          <h1 class="dash-title">Dashboard Overview</h1>
        </div>
        <button @click="fetchDashboardData" :disabled="isLoading" class="dash-refresh-btn">
          <svg :class="isLoading ? 'spin' : ''" class="dash-refresh-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ isLoading ? 'Loading…' : 'Refresh' }}
        </button>
      </div>

      <!-- ── Loading skeleton ── -->
      <div v-if="isLoading" class="quick-grid">
        <div v-for="i in 4" :key="i" class="skeleton"></div>
      </div>

      <!-- ── Error ── -->
      <div v-else-if="error" class="error-card">
        <div class="error-icon">⚠</div>
        <p class="error-title">Failed to load dashboard</p>
        <p class="error-sub">{{ error }}</p>
        <button @click="fetchDashboardData" class="error-retry">Retry</button>
      </div>

      <!-- ── Content ── -->
      <div v-else class="dash-content">

        <!-- Quick stat chips -->
        <div class="quick-grid">
          <QuickStat label="Total Tenders"   :value="dashboardData.tenders.registered"  color="indigo" />
          <QuickStat label="Active Projects" :value="dashboardData.projects.inProgress"  color="amber" />
          <QuickStat label="Awards"          :value="dashboardData.awards.total"          color="teal" />
          <QuickStat label="Updates"         :value="dashboardData.updates.total"         color="purple" />
        </div>

        <!-- Section cards -->
        <div class="cards-grid">

          <!-- Tenders -->
          <SectionCard title="Tenders" :total="dashboardData.tenders.registered" unit="Registered" color="indigo">
            <MetricRow label="Assigned"    :value="dashboardData.tenders.assigned"         color="indigo" />
            <MetricRow label="Submitted"   :value="dashboardData.tenders.submitted"         color="teal" />
            <MetricRow label="In Progress" :value="dashboardData.tenders.inProgress"        color="amber" />
            <MetricRow label="Due Soon"    :value="dashboardData.tenders.deadlineReached"   color="amber" />
            <MetricRow label="Expired"     :value="dashboardData.tenders.expired"           color="red" />
            <template #footer>
              <ProgressBar label="Submission Rate" :pct="tenderSubmissionRate" color="indigo" />
            </template>
          </SectionCard>

          <!-- Awards & Performance -->
          <SectionCard title="Awards & Performance" :total="dashboardData.awards.total" unit="Total" color="amber">
            <MetricRow label="Intentions"  :value="dashboardData.awards.intentions"                    color="amber" />
            <MetricRow label="Letters"     :value="dashboardData.awards.letters"                       color="indigo" />
            <MetricRow label="Bonds"       :value="dashboardData.performances.insuranceBonds"          color="teal" />
            <MetricRow label="Security"    :value="dashboardData.performances.securityDeclarations"    color="purple" />
            <MetricRow label="Updates"     :value="dashboardData.updates.total"                        color="amber" />
            <MetricRow label="Recent"      :value="dashboardData.updates.recent"                       color="gray" />
          </SectionCard>

          <!-- Projects -->
          <SectionCard title="Projects" :total="dashboardData.projects.total" unit="Total" color="teal">
            <MetricRow label="In Progress" :value="dashboardData.projects.inProgress" color="amber" />
            <MetricRow label="Completed"   :value="dashboardData.projects.completed"  color="teal" />
            <MetricRow label="Failed"      :value="dashboardData.projects.failed"     color="red" />
            <template #footer>
              <ProgressBar label="Success Rate" :pct="projectSuccessRate" color="teal" />
            </template>
          </SectionCard>

        </div>

        <!-- System Overview -->
        <div class="overview-card">
          <div class="overview-header">
            <div>
              <p class="overview-title">System Overview</p>
              <p class="overview-sub">Overall completion across all modules</p>
            </div>
            <span class="overview-badge">{{ overallCompletion }}% complete</span>
          </div>

          <div class="summary-grid">
            <SummaryTile label="Tenders"     :value="dashboardData.tenders.registered"   color="indigo" />
            <SummaryTile label="Awards"      :value="dashboardData.awards.total"          color="amber" />
            <SummaryTile label="Performance" :value="dashboardData.performances.total"    color="teal" />
            <SummaryTile label="Updates"     :value="dashboardData.updates.total"         color="purple" />
          </div>

          <div class="overall-bar-wrap">
            <div class="overall-bar-labels">
              <span>Overall Completion</span>
              <span class="overall-bar-pct">{{ overallCompletion }}%</span>
            </div>
            <div class="overall-bar-track">
              <div class="overall-bar-fill" :style="{ width: overallCompletion + '%' }"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { optimizedRequest } from '@/utils/api'

const isLoading = ref(true)
const error = ref(null)

const dashboardData = ref({
  tenders:      { registered: 0, assigned: 0, submitted: 0, inProgress: 0, deadlineReached: 0, expired: 0 },
  projects:     { total: 0, inProgress: 0, completed: 0, failed: 0 },
  awards:       { total: 0, intentions: 0, letters: 0 },
  performances: { total: 0, insuranceBonds: 0, securityDeclarations: 0 },
  updates:      { total: 0, recent: 0 }
})

const tenderSubmissionRate = computed(() => {
  const t = dashboardData.value.tenders.registered
  return t > 0 ? Math.round((dashboardData.value.tenders.submitted / t) * 100) : 0
})
const projectSuccessRate = computed(() => {
  const t = dashboardData.value.projects.total
  return t > 0 ? Math.round((dashboardData.value.projects.completed / t) * 100) : 0
})
const overallCompletion = computed(() => {
  const total = dashboardData.value.tenders.registered + dashboardData.value.projects.total +
    dashboardData.value.awards.total + dashboardData.value.performances.total
  if (!total) return 0
  const done = dashboardData.value.tenders.submitted + dashboardData.value.projects.completed +
    dashboardData.value.awards.letters
  return Math.round((done / total) * 100)
})

// Optimized fetch with parallel requests using API utility
const fetchDashboardData = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // Make requests in parallel using optimized API (handles caching automatically)
    const [dashboardResponse, updatesResponse] = await Promise.allSettled([
      optimizedRequest('api/dashboard/stats'),
      optimizedRequest('api/my/updates').catch(() => ({ data: [] }))
    ]);

    // Process dashboard data
    if (dashboardResponse.status === 'fulfilled') {
      const d = dashboardResponse.value.data.data || dashboardResponse.value.data;
      
      // Process updates data
      let userUpdates = { total: 0, recent: 0 };
      if (updatesResponse.status === 'fulfilled') {
        const updatesData = updatesResponse.value.data.data || [];
        userUpdates.total = updatesData.length;
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        userUpdates.recent = updatesData.filter(u => new Date(u.created_at) >= sevenDaysAgo).length;
      }

      const processedData = {
        tenders:      { registered: +d.tenders?.registered||0, assigned: +d.tenders?.assigned||0, submitted: +d.tenders?.submitted||0, inProgress: +d.tenders?.inProgress||0, deadlineReached: +d.tenders?.deadlineReached||0, expired: +d.tenders?.expired||0 },
        projects:     { total: +d.projects?.total||0, inProgress: +d.projects?.inProgress||0, completed: +d.projects?.completed||0, failed: +d.projects?.failed||0 },
        awards:       { total: +d.awards?.total||0, intentions: +d.awards?.intentions||0, letters: +d.awards?.letters||0 },
        performances: { total: (+d.performances?.insuranceBonds||0)+(+d.performances?.securityDeclarations||0), insuranceBonds: +d.performances?.insuranceBonds||0, securityDeclarations: +d.performances?.securityDeclarations||0 },
        updates: userUpdates
      };

      dashboardData.value = processedData;
    } else {
      throw new Error('Dashboard data fetch failed');
    }
  } catch (_) {
    error.value = 'Failed to load dashboard data. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Auto-refresh with reduced frequency
let refreshInterval = null;
const startAutoRefresh = () => {
  // Refresh every 5 minutes instead of frequently
  refreshInterval = setInterval(() => {
    fetchDashboardData();
  }, 5 * 60 * 1000);
};

const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

onMounted(() => {
  fetchDashboardData();
  startAutoRefresh();
});

onUnmounted(() => {
  stopAutoRefresh();
});
</script>

<script>
/* ── Color palette ─────────────────────────────────────────────────── */
const C = {
  indigo: { chip: '#eef2ff', chipText: '#4338ca', chipBorder: '#c7d2fe', val: '#4338ca', bar: ['#6366f1','#818cf8'], badge: '#e0e7ff', badgeText: '#4338ca', tile: '#eef2ff', tileBorder: '#c7d2fe' },
  amber:  { chip: '#fffbeb', chipText: '#b45309', chipBorder: '#fde68a', val: '#d97706', bar: ['#f59e0b','#fcd34d'], badge: '#fef3c7', badgeText: '#b45309', tile: '#fffbeb', tileBorder: '#fde68a' },
  teal:   { chip: '#f0fdfa', chipText: '#0f766e', chipBorder: '#99f6e4', val: '#0d9488', bar: ['#14b8a6','#5eead4'], badge: '#ccfbf1', badgeText: '#0f766e', tile: '#f0fdfa', tileBorder: '#99f6e4' },
  red:    { chip: '#fff1f2', chipText: '#be123c', chipBorder: '#fecdd3', val: '#e11d48', bar: ['#f43f5e','#fb7185'], badge: '#ffe4e6', badgeText: '#be123c', tile: '#fff1f2', tileBorder: '#fecdd3' },
  purple: { chip: '#faf5ff', chipText: '#7e22ce', chipBorder: '#e9d5ff', val: '#9333ea', bar: ['#a855f7','#c084fc'], badge: '#f3e8ff', badgeText: '#7e22ce', tile: '#faf5ff', tileBorder: '#e9d5ff' },
  gray:   { chip: '#f8fafc', chipText: '#475569', chipBorder: '#e2e8f0', val: '#475569', bar: ['#94a3b8','#cbd5e1'], badge: '#f1f5f9', badgeText: '#475569', tile: '#f8fafc', tileBorder: '#e2e8f0' },
}

export default {
  components: {

    QuickStat: {
      props: ['label','value','color'],
      setup(p) { return { c: C[p.color] || C.gray } },
      template: `
        <div :style="{ background: c.chip, border: '1px solid ' + c.chipBorder }" style="border-radius:12px;padding:14px 16px;">
          <p style="font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:1.1px;color:#94a3b8;margin:0 0 5px;">{{ label }}</p>
          <p :style="{ color: c.val }" style="font-size:22px;font-weight:800;margin:0;font-variant-numeric:tabular-nums;line-height:1;">{{ value }}</p>
        </div>
      `
    },

    SectionCard: {
      props: ['title','total','unit','color'],
      setup(p) { return { c: C[p.color] || C.gray } },
      template: `
        <div style="background:#fff;border:1px solid #e8ecf0;border-radius:14px;padding:20px;display:flex;flex-direction:column;box-shadow:0 2px 12px rgba(0,0,0,0.04);">
          <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:14px;margin-bottom:14px;border-bottom:1px solid #f1f5f9;">
            <p style="font-size:13.5px;font-weight:800;color:#0f172a;margin:0;letter-spacing:-0.2px;">{{ title }}</p>
            <span :style="{ background: c.badge, color: c.badgeText }" style="border-radius:6px;padding:3px 9px;font-size:10.5px;font-weight:700;">{{ total }} {{ unit }}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;flex:1;">
            <slot />
          </div>
          <div v-if="$slots.footer" style="margin-top:14px;padding-top:14px;border-top:1px solid #f1f5f9;">
            <slot name="footer" />
          </div>
        </div>
      `
    },

    MetricRow: {
      props: ['label','value','color'],
      setup(p) { return { c: C[p.color] || C.gray } },
      template: `
        <div :style="{ background: c.tile, border: '1px solid ' + c.tileBorder }" style="border-radius:9px;padding:10px 12px;">
          <p style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#94a3b8;margin:0 0 3px;">{{ label }}</p>
          <p :style="{ color: c.val }" style="font-size:14px;font-weight:800;margin:0;font-variant-numeric:tabular-nums;">{{ value }}</p>
        </div>
      `
    },

    ProgressBar: {
      props: ['label','pct','color'],
      setup(p) { return { c: C[p.color] || C.gray } },
      template: `
        <div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;">
            <span style="font-size:11px;color:#94a3b8;">{{ label }}</span>
            <span style="font-size:11px;font-weight:800;color:#0f172a;">{{ pct }}%</span>
          </div>
          <div style="height:5px;border-radius:99px;background:#f1f5f9;overflow:hidden;">
            <div :style="{ width: pct + '%', background: 'linear-gradient(90deg,' + c.bar[0] + ',' + c.bar[1] + ')' }"
              style="height:100%;border-radius:99px;transition:width .7s ease;"></div>
          </div>
        </div>
      `
    },

    SummaryTile: {
      props: ['label','value','color'],
      setup(p) { return { c: C[p.color] || C.gray } },
      template: `
        <div :style="{ background: c.chip, border: '1px solid ' + c.chipBorder }" style="border-radius:10px;padding:14px 12px;text-align:center;">
          <p :style="{ color: c.val }" style="font-size:26px;font-weight:800;margin:0;font-variant-numeric:tabular-nums;line-height:1;">{{ value }}</p>
          <p style="font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.9px;color:#94a3b8;margin:5px 0 0;">{{ label }}</p>
        </div>
      `
    },

  }
}
</script>

<style scoped>
@import url('https://fonts.2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');

/* ── Page ──────────────────────────────────────────── */
.dash-root {
  min-height: 100vh;
  background: #f6f7fb;
  padding: 32px 16px;
  font-family: 'DM Sans', sans-serif;
}
.dash-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ── Header ────────────────────────────────────────── */
.dash-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.dash-eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.3px;
  color: #94a3b8;
  margin-bottom: 4px;
}
.dash-title {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.4px;
}
.dash-refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  transition: all 0.15s;
}
.dash-refresh-btn:hover:not(:disabled) {
  border-color: #bfdbfe;
  color: #1e40af;
  box-shadow: 0 2px 8px rgba(37,99,235,0.1);
}
.dash-refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.dash-refresh-icon { width: 14px; height: 14px; }

/* ── Skeleton ──────────────────────────────────────── */
.skeleton {
  height: 72px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e8ecf0;
  animation: pulse 1.4s ease-in-out infinite;
}
@keyframes pulse {
  0%,100% { opacity: 1; }
  50%      { opacity: 0.45; }
}

/* ── Error card ────────────────────────────────────── */
.error-card {
  background: #fff;
  border: 1px solid #e8ecf0;
  border-radius: 14px;
  padding: 56px 24px;
  text-align: center;
}
.error-icon  { font-size: 28px; margin-bottom: 10px; }
.error-title { font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 5px; }
.error-sub   { font-size: 12px; color: #94a3b8; margin: 0 0 16px; }
.error-retry {
  background: #0f172a;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 9px 20px;
  font-size: 12px;
  font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: background 0.15s;
}
.error-retry:hover { background: #1e3a8a; }

/* ── Content ───────────────────────────────────────── */
.dash-content { display: flex; flex-direction: column; gap: 20px; }

/* ── Quick stats grid ──────────────────────────────── */
.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
@media (max-width: 640px) { .quick-grid { grid-template-columns: repeat(2, 1fr); } }

/* ── Cards grid ────────────────────────────────────── */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 1024px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px)  { .cards-grid { grid-template-columns: 1fr; } }

/* ── Overview card ─────────────────────────────────── */
.overview-card {
  background: #fff;
  border: 1px solid #e8ecf0;
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}
.overview-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
  gap: 12px;
}
.overview-title { font-size: 13.5px; font-weight: 800; color: #0f172a; margin: 0 0 3px; letter-spacing: -0.2px; }
.overview-sub   { font-size: 11.5px; color: #94a3b8; margin: 0; }
.overview-badge {
  background: #f1f5f9;
  color: #475569;
  border-radius: 99px;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 18px;
}
@media (max-width: 640px) { .summary-grid { grid-template-columns: repeat(2, 1fr); } }

.overall-bar-wrap {}
.overall-bar-labels {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 11.5px;
  color: #94a3b8;
}
.overall-bar-pct { font-weight: 800; color: #0f172a; }
.overall-bar-track {
  height: 6px;
  background: #f1f5f9;
  border-radius: 99px;
  overflow: hidden;
}
.overall-bar-fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, #1e3a8a, #6366f1);
  transition: width 0.7s ease;
}

/* ── Spin animation ────────────────────────────────── */
.spin {
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>