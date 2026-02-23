<template>
  <div class="dash">

    <!-- Header -->
    <header class="dash-header">
      <div class="dash-header__left">
        <div class="dash-header__eyebrow">Analytics</div>
        <h1 class="dash-header__title">Dashboard Overview</h1>
      </div>
      <div class="dash-header__right">
        <div class="kpi-chip">
          <span class="kpi-chip__label">Total Items</span>
          <strong class="kpi-chip__value">{{ totalItems }}</strong>
        </div>
        <div class="kpi-chip kpi-chip--accent">
          <span class="kpi-chip__label">Completion</span>
          <strong class="kpi-chip__value">{{ completionRate }}%</strong>
        </div>
      </div>
    </header>

    <!-- Stat Cards -->
    <section class="stats-grid">

      <!-- Tenders -->
      <div class="stat-card" style="--accent:#2563eb">
        <div class="stat-card__head">
          <div class="stat-card__icon">
            <i class="fas fa-file-contract"></i>
          </div>
          <div class="stat-card__meta">
            <h3 class="stat-card__title">Tenders</h3>
            <span class="stat-card__count">{{ totalAssignedTenders }} Total</span>
          </div>
          <button class="stat-card__nav" @click="navigate('tenders')" aria-label="Go to Tenders">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        <div class="stat-card__body">
          <template v-if="isLoading.tenders">
            <div class="state-loading"><div class="loader"></div><span>Loading…</span></div>
          </template>
          <template v-else-if="errorMessage.tenders">
            <div class="state-error">
              <i class="fas fa-exclamation-triangle"></i>
              <span>{{ errorMessage.tenders }}</span>
              <button class="btn-retry" @click="retryFetch('tenders')"><i class="fas fa-redo"></i> Retry</button>
            </div>
          </template>
          <template v-else>
            <div class="metrics">
              <div class="metric metric--blue">
                <span class="metric__val">{{ totalTenderSubmissions }}</span>
                <span class="metric__lbl">Submitted</span>
              </div>
              <div class="metric">
                <span class="metric__val">{{ totalOnProgressTenders }}</span>
                <span class="metric__lbl">In Progress</span>
              </div>
              <div class="metric metric--amber">
                <span class="metric__val">{{ totalDeadlineReachedTenders }}</span>
                <span class="metric__lbl">Due Soon</span>
              </div>
              <div class="metric metric--red">
                <span class="metric__val">{{ totalExpiredTenders }}</span>
                <span class="metric__lbl">Expired</span>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Quotations -->
      <div class="stat-card" style="--accent:#0891b2">
        <div class="stat-card__head">
          <div class="stat-card__icon">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="stat-card__meta">
            <h3 class="stat-card__title">Quotations</h3>
            <span class="stat-card__count">{{ totalPriceSchedules }} Total</span>
          </div>
          <button class="stat-card__nav" @click="navigate('quotations')" aria-label="Go to Quotations">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        <div class="stat-card__body">
          <template v-if="isLoading.priceSchedules">
            <div class="state-loading"><div class="loader"></div><span>Loading…</span></div>
          </template>
          <template v-else-if="errorMessage.priceSchedules">
            <div class="state-error">
              <i class="fas fa-exclamation-triangle"></i>
              <span>{{ errorMessage.priceSchedules }}</span>
              <button class="btn-retry" @click="retryFetch('priceSchedules')"><i class="fas fa-redo"></i> Retry</button>
            </div>
          </template>
          <template v-else>
            <div class="metrics">
              <div class="metric metric--blue">
                <span class="metric__val">{{ totalPriceSchedules }}</span>
                <span class="metric__lbl">Submitted</span>
              </div>
              <div class="metric metric--green">
                <span class="metric__val">{{ totalPassedPriceSchedules }}</span>
                <span class="metric__lbl">Approved</span>
              </div>
              <div class="metric metric--red">
                <span class="metric__val">{{ totalRejectedPriceSchedules }}</span>
                <span class="metric__lbl">Rejected</span>
              </div>
              <div class="metric metric--purple">
                <span class="metric__val">{{ quotationApprovalRate }}%</span>
                <span class="metric__lbl">Success Rate</span>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Analyses -->
      <div class="stat-card" style="--accent:#059669">
        <div class="stat-card__head">
          <div class="stat-card__icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="stat-card__meta">
            <h3 class="stat-card__title">Analyses</h3>
            <span class="stat-card__count">{{ totalProjectAnalyses }} Total</span>
          </div>
          <button class="stat-card__nav" @click="navigate('analyses')" aria-label="Go to Analyses">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        <div class="stat-card__body">
          <template v-if="isLoading.analyses">
            <div class="state-loading"><div class="loader"></div><span>Loading…</span></div>
          </template>
          <template v-else-if="errorMessage.analyses">
            <div class="state-error">
              <i class="fas fa-exclamation-triangle"></i>
              <span>{{ errorMessage.analyses }}</span>
              <button class="btn-retry" @click="retryFetch('analyses')"><i class="fas fa-redo"></i> Retry</button>
            </div>
          </template>
          <template v-else>
            <div class="metrics">
              <div class="metric metric--blue">
                <span class="metric__val">{{ totalProjectAnalyses }}</span>
                <span class="metric__lbl">Submitted</span>
              </div>
              <div class="metric metric--green">
                <span class="metric__val">{{ totalPassedAnalyses }}</span>
                <span class="metric__lbl">Approved</span>
              </div>
              <div class="metric metric--red">
                <span class="metric__val">{{ totalRejectedAnalyses }}</span>
                <span class="metric__lbl">Rejected</span>
              </div>
              <div class="metric metric--purple">
                <span class="metric__val">{{ analysisApprovalRate }}%</span>
                <span class="metric__lbl">Success Rate</span>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Projects -->
      <div class="stat-card" style="--accent:#d97706">
        <div class="stat-card__head">
          <div class="stat-card__icon">
            <i class="fas fa-project-diagram"></i>
          </div>
          <div class="stat-card__meta">
            <h3 class="stat-card__title">Projects</h3>
            <span class="stat-card__count">{{ totalUserProjects }} Total</span>
          </div>
          <button class="stat-card__nav" @click="navigate('projects')" aria-label="Go to Projects">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        <div class="stat-card__body">
          <template v-if="isLoading.projects">
            <div class="state-loading"><div class="loader"></div><span>Loading…</span></div>
          </template>
          <template v-else-if="errorMessage.projects">
            <div class="state-error">
              <i class="fas fa-exclamation-triangle"></i>
              <span>{{ errorMessage.projects }}</span>
              <button class="btn-retry" @click="retryFetch('projects')"><i class="fas fa-redo"></i> Retry</button>
            </div>
          </template>
          <template v-else>
            <div class="metrics">
              <div class="metric metric--blue">
                <span class="metric__val">{{ totalUserProjects }}</span>
                <span class="metric__lbl">Assigned</span>
              </div>
              <div class="metric">
                <span class="metric__val">{{ totalOnProgressProjects }}</span>
                <span class="metric__lbl">Active</span>
              </div>
              <div class="metric metric--green">
                <span class="metric__val">{{ totalCompletedProjects }}</span>
                <span class="metric__lbl">Completed</span>
              </div>
              <div class="metric metric--red">
                <span class="metric__val">{{ totalFailedProjects }}</span>
                <span class="metric__lbl">Failed</span>
              </div>
            </div>
          </template>
        </div>
      </div>

    </section>

    <!-- Analytics -->
    <section v-if="hasAnyData" class="analytics">
      <div class="analytics__header">
        <h2 class="analytics__title">Performance Analytics</h2>
        <div class="tab-group">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="charts-grid">
        <!-- Donut -->
        <div class="chart-card">
          <div class="chart-card__head">
            <h3 class="chart-card__title">Work Distribution</h3>
            <span class="chart-card__sub">By category</span>
          </div>
          <apexchart type="donut" :options="workDistributionOptions" :series="workDistributionSeries" height="280" />
        </div>

        <!-- Stacked bar -->
        <div class="chart-card">
          <div class="chart-card__head">
            <h3 class="chart-card__title">Status Overview</h3>
            <span class="chart-card__sub">Current state</span>
          </div>
          <apexchart type="bar" :options="statusOverviewOptions" :series="statusOverviewSeries" height="280" />
        </div>

        <!-- Approval rate - wide -->
        <div class="chart-card chart-card--wide">
          <div class="chart-card__head">
            <h3 class="chart-card__title">Approval Rate Analysis</h3>
            <span class="chart-card__sub">Success metrics</span>
          </div>
          <apexchart type="bar" :options="approvalRateOptions" :series="approvalRateSeries" height="280" />
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/axios';

/* ── Data ── */
const totalAssignedTenders       = ref(0);
const totalTenderSubmissions     = ref(0);
const totalOnProgressTenders     = ref(0);
const totalDeadlineReachedTenders = ref(0);
const totalExpiredTenders        = ref(0);

const totalProjectAnalyses  = ref(0);
const totalPassedAnalyses   = ref(0);
const totalRejectedAnalyses = ref(0);

const totalPriceSchedules        = ref(0);
const totalPassedPriceSchedules  = ref(0);
const totalRejectedPriceSchedules = ref(0);

const totalUserProjects       = ref(0);
const totalCompletedProjects  = ref(0);
const totalOnProgressProjects = ref(0);
const totalFailedProjects     = ref(0);

const isLoading = ref({ tenders: true, priceSchedules: true, analyses: true, projects: true });
const errorMessage = ref({ tenders: '', priceSchedules: '', analyses: '', projects: '' });

const activeTab = ref('overview');
const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'week',     label: 'This Week' },
  { key: 'month',    label: 'This Month' },
];

/* ── Computed ── */
const totalItems = computed(() =>
  totalAssignedTenders.value + totalPriceSchedules.value +
  totalProjectAnalyses.value + totalUserProjects.value
);

const completionRate = computed(() => {
  const done  = totalTenderSubmissions.value + totalPassedPriceSchedules.value +
                totalPassedAnalyses.value + totalCompletedProjects.value;
  const total = totalItems.value;
  return total > 0 ? Math.round((done / total) * 100) : 0;
});

const quotationApprovalRate = computed(() => {
  const t = totalPriceSchedules.value;
  return t > 0 ? Math.round((totalPassedPriceSchedules.value / t) * 100) : 0;
});

const analysisApprovalRate = computed(() => {
  const t = totalProjectAnalyses.value;
  return t > 0 ? Math.round((totalPassedAnalyses.value / t) * 100) : 0;
});

const hasAnyData = computed(() =>
  totalAssignedTenders.value > 0 || totalPriceSchedules.value > 0 ||
  totalProjectAnalyses.value > 0 || totalUserProjects.value > 0
);

/* ── Chart configs (defined once, no reactivity overhead) ── */
const CHART_FONT = "'DM Sans', sans-serif";
const CHART_COLORS = ['#2563eb', '#0891b2', '#059669', '#d97706'];
const GRID = { borderColor: '#f0f0f0', strokeDashArray: 4 };
const LABEL_STYLE = { fontSize: '11px', fontWeight: '500', colors: '#6b7280' };

const workDistributionSeries = computed(() => [
  totalAssignedTenders.value,
  totalPriceSchedules.value,
  totalProjectAnalyses.value,
  totalUserProjects.value,
]);

const workDistributionOptions = {
  chart: { type: 'donut', fontFamily: CHART_FONT, toolbar: { show: false }, animations: { speed: 400 } },
  labels: ['Tenders', 'Quotations', 'Analyses', 'Projects'],
  colors: CHART_COLORS,
  legend: { position: 'bottom', fontSize: '11px', fontWeight: 500 },
  dataLabels: {
    enabled: true,
    formatter: val => Math.round(val) + '%',
    style: { fontSize: '11px', fontWeight: '600' },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '68%',
        labels: {
          show: true,
          total: { show: true, label: 'Total', fontSize: '12px', fontWeight: '600', color: '#111' },
          value: { fontSize: '20px', fontWeight: '700', color: '#111' },
        },
      },
    },
  },
  stroke: { width: 2, colors: ['#fff'] },
  tooltip: { y: { formatter: val => val + ' items' } },
};

const statusOverviewSeries = computed(() => [
  {
    name: 'Completed',
    data: [
      totalTenderSubmissions.value, totalPassedPriceSchedules.value,
      totalPassedAnalyses.value, totalCompletedProjects.value,
    ],
  },
  {
    name: 'In Progress',
    data: [totalOnProgressTenders.value, 0, 0, totalOnProgressProjects.value],
  },
  {
    name: 'Issues',
    data: [
      totalDeadlineReachedTenders.value + totalExpiredTenders.value,
      totalRejectedPriceSchedules.value,
      totalRejectedAnalyses.value,
      totalFailedProjects.value,
    ],
  },
]);

const statusOverviewOptions = {
  chart: { type: 'bar', fontFamily: CHART_FONT, toolbar: { show: false }, stacked: true, animations: { speed: 400 } },
  colors: ['#059669', '#2563eb', '#ef4444'],
  plotOptions: { bar: { borderRadius: 3, columnWidth: '52%' } },
  xaxis: { categories: ['Tenders', 'Quotations', 'Analyses', 'Projects'], labels: { style: LABEL_STYLE } },
  yaxis: { labels: { style: LABEL_STYLE } },
  legend: { position: 'top', fontSize: '11px', fontWeight: 500, horizontalAlign: 'right' },
  dataLabels: { enabled: false },
  grid: GRID,
  tooltip: { y: { formatter: val => val + ' items' } },
};

const approvalRateSeries = computed(() => {
  const qt = totalPriceSchedules.value || 1;
  const at = totalProjectAnalyses.value || 1;
  return [
    {
      name: 'Approved',
      data: [
        Math.round((totalPassedPriceSchedules.value / qt) * 100),
        Math.round((totalPassedAnalyses.value / at) * 100),
      ],
    },
    {
      name: 'Rejected',
      data: [
        Math.round((totalRejectedPriceSchedules.value / qt) * 100),
        Math.round((totalRejectedAnalyses.value / at) * 100),
      ],
    },
  ];
});

const approvalRateOptions = {
  chart: { type: 'bar', fontFamily: CHART_FONT, toolbar: { show: false }, animations: { speed: 400 } },
  colors: ['#059669', '#ef4444'],
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 3,
      barHeight: '48%',
      dataLabels: { position: 'top' },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: val => val + '%',
    offsetX: 22,
    style: { fontSize: '11px', fontWeight: '600', colors: ['#1f2937'] },
  },
  xaxis: {
    categories: ['Quotations', 'Analyses'],
    labels: { formatter: val => val + '%', style: LABEL_STYLE },
    max: 100,
  },
  yaxis: { labels: { style: LABEL_STYLE } },
  legend: { position: 'top', fontSize: '11px', fontWeight: 500, horizontalAlign: 'right' },
  grid: GRID,
  tooltip: { y: { formatter: val => val + '%' } },
};

/* ── API ── */
const fetchTenderCounts = async () => {
  isLoading.value.tenders = true;
  errorMessage.value.tenders = '';
  try {
    const [a, b, c, d, e] = await Promise.all([
      axios.get('/api/count/assigned-tenders'),
      axios.get('/api/count/submitted/tender'),
      axios.get('/api/count/on-progress/tender'),
      axios.get('/api/count/deadline-reached/tenders'),
      axios.get('/api/count/expire-tenders'),
    ]);
    totalAssignedTenders.value        = a.data.assignedCount || 0;
    totalTenderSubmissions.value      = b.data.submittedCount || 0;
    totalOnProgressTenders.value      = c.data.onProgressCount || 0;
    totalDeadlineReachedTenders.value = d.data.expired_tenders || 0;
    totalExpiredTenders.value         = e.data.expired_tenders || 0;
  } catch {
    errorMessage.value.tenders = 'Failed to load';
  } finally {
    isLoading.value.tenders = false;
  }
};

const fetchPriceScheduleCounts = async () => {
  isLoading.value.priceSchedules = true;
  errorMessage.value.priceSchedules = '';
  try {
    const [a, b, c] = await Promise.all([
      axios.get('/api/user/price-schedules/count'),
      axios.get('/api/user/price-schedules/passed/count'),
      axios.get('/api/user/price-schedules/rejected/count'),
    ]);
    totalPriceSchedules.value         = a.data.total_count || 0;
    totalPassedPriceSchedules.value   = b.data.passed_count || 0;
    totalRejectedPriceSchedules.value = c.data.rejected_count || 0;
  } catch {
    errorMessage.value.priceSchedules = 'Failed to load';
  } finally {
    isLoading.value.priceSchedules = false;
  }
};

const fetchAnalysisCounts = async () => {
  isLoading.value.analyses = true;
  errorMessage.value.analyses = '';
  try {
    const [a, b, c] = await Promise.all([
      axios.get('/api/logged/user-analyses/count'),
      axios.get('/api/user-analyses/approved/count'),
      axios.get('/api/user-analyses/rejected/count'),
    ]);
    totalProjectAnalyses.value  = a.data.total_count || 0;
    totalPassedAnalyses.value   = b.data.approved_count || 0;
    totalRejectedAnalyses.value = c.data.rejected_count || 0;
  } catch {
    errorMessage.value.analyses = 'Failed to load';
  } finally {
    isLoading.value.analyses = false;
  }
};

const fetchProjectCounts = async () => {
  isLoading.value.projects = true;
  errorMessage.value.projects = '';
  try {
    const [a, b, c, d] = await Promise.all([
      axios.get('/api/count/user/all-projects'),
      axios.get('/api/count/user/completed-project'),
      axios.get('/api/count/user/on-progress-projects'),
      axios.get('/api/count/users/failed-projects'),
    ]);
    totalUserProjects.value       = a.data.total_projects || 0;
    totalCompletedProjects.value  = b.data.total_completed_projects || 0;
    totalOnProgressProjects.value = c.data.total_on_progress_projects || 0;
    totalFailedProjects.value     = d.data.total_failed_projects || 0;
  } catch {
    errorMessage.value.projects = 'Failed to load';
  } finally {
    isLoading.value.projects = false;
  }
};

const retryFetch = (section) => ({
  tenders: fetchTenderCounts,
  priceSchedules: fetchPriceScheduleCounts,
  analyses: fetchAnalysisCounts,
  projects: fetchProjectCounts,
}[section]?.());

const navigate = (section) => console.log('Navigate to:', section);

onMounted(() => {
  Promise.all([
    fetchTenderCounts(),
    fetchPriceScheduleCounts(),
    fetchAnalysisCounts(),
    fetchProjectCounts(),
  ]);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

/* ── Variables ── */
:root {
  --white: #ffffff;
  --bg:    #f7f7f7;
  --border:#e8e8e8;
  --text:  #111111;
  --muted: #6b6b6b;
  --radius:10px;
  --card-shadow: 0 1px 3px rgba(0,0,0,.06), 0 2px 8px rgba(0,0,0,.04);
}

/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Container ── */
.dash {
  min-height: 100vh;
  background: var(--bg);
  padding: 24px;
  font-family: 'DM Sans', sans-serif;
  color: var(--text);
  /* GPU layer for the whole page */
  will-change: auto;
}

/* ── Header ── */
.dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px 24px;
  margin-bottom: 20px;
  box-shadow: var(--card-shadow);
}

.dash-header__eyebrow {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 4px;
}

.dash-header__title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -.025em;
  color: var(--text);
}

.dash-header__right {
  display: flex;
  gap: 10px;
}

.kpi-chip {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 8px 14px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  min-width: 100px;
}

.kpi-chip--accent {
  background: #111;
  border-color: #111;
}

.kpi-chip--accent .kpi-chip__label,
.kpi-chip--accent .kpi-chip__value { color: #fff; }

.kpi-chip__label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 2px;
}

.kpi-chip__value {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -.02em;
  color: var(--text);
}

/* ── Stats grid ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

/* ── Stat card ── */
.stat-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--card-shadow);
  /* top accent line via ::before */
  position: relative;
  /* Avoid expensive repaints on hover */
  contain: layout style;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: var(--accent, #2563eb);
}

.stat-card__head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 16px 12px;
  border-bottom: 1px solid #f3f3f3;
}

.stat-card__icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--accent, #2563eb) 10%, white);
  color: var(--accent, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.stat-card__meta { flex: 1; min-width: 0; }

.stat-card__title {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -.01em;
}

.stat-card__count {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: var(--muted);
  letter-spacing: .04em;
}

.stat-card__nav {
  width: 28px;
  height: 28px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--white);
  color: var(--muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  transition: color .15s, border-color .15s, transform .15s;
  flex-shrink: 0;
}

.stat-card__nav:hover {
  color: var(--accent, #2563eb);
  border-color: var(--accent, #2563eb);
  transform: translateX(2px);
}

.stat-card__body {
  padding: 14px 16px 16px;
  min-height: 130px;
}

/* ── States ── */
.state-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100px;
  color: var(--muted);
  font-size: 12px;
}

.loader {
  width: 22px;
  height: 22px;
  border: 2px solid #e5e5e5;
  border-top-color: #555;
  border-radius: 50%;
  animation: spin .65s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.state-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 12px;
  background: #fff5f5;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #b91c1c;
  font-size: 12px;
  text-align: center;
}

.state-error i { font-size: 16px; }

.btn-retry {
  padding: 4px 10px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
}

/* ── Metrics ── */
.metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.metric {
  display: flex;
  flex-direction: column;
  padding: 10px 11px;
  background: #fafafa;
  border-radius: 7px;
  border-left: 3px solid #d1d5db;
}

.metric--blue   { border-left-color: #2563eb; }
.metric--green  { border-left-color: #059669; }
.metric--amber  { border-left-color: #d97706; }
.metric--red    { border-left-color: #dc2626; }
.metric--purple { border-left-color: #7c3aed; }

.metric__val {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -.02em;
  line-height: 1;
  color: var(--text);
}

.metric__lbl {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .05em;
  text-transform: uppercase;
  color: var(--muted);
  margin-top: 3px;
}

/* ── Analytics ── */
.analytics { }

.analytics__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 22px;
  margin-bottom: 14px;
  box-shadow: var(--card-shadow);
}

.analytics__title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -.015em;
}

.tab-group {
  display: flex;
  gap: 6px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 3px;
}

.tab-btn {
  padding: 5px 14px;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
  transition: background .15s, color .15s;
}

.tab-btn--active {
  background: var(--white);
  color: var(--text);
  box-shadow: 0 1px 3px rgba(0,0,0,.08);
}

/* ── Charts ── */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.chart-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px 20px 12px;
  box-shadow: var(--card-shadow);
  contain: layout style;
}

.chart-card--wide {
  grid-column: 1 / -1;
}

.chart-card__head {
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f3f3f3;
}

.chart-card__title {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -.01em;
  margin-bottom: 2px;
}

.chart-card__sub {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: var(--muted);
  letter-spacing: .06em;
  text-transform: uppercase;
}

/* ── Responsive ── */
@media (max-width: 1280px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 1024px) {
  .charts-grid { grid-template-columns: 1fr; }
  .chart-card--wide { grid-column: 1; }
}

@media (max-width: 768px) {
  .dash { padding: 14px; }
  .dash-header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .dash-header__right { width: 100%; }
  .kpi-chip { flex: 1; }
  .stats-grid { grid-template-columns: 1fr; }
  .analytics__header { flex-direction: column; align-items: flex-start; gap: 10px; }
}
</style>