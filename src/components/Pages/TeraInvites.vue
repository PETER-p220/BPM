<template>
  <div class="events-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-text">
          <h1>Tera Events</h1>
          <p>Events and revenue overview from Tera Invites</p>
        </div>
        <div class="header-actions">
          <span class="last-updated">Updated {{ lastUpdated || '—' }}</span>
          <button class="refresh-btn" @click="fetchInvitesData" :disabled="loading">
            <svg :class="['refresh-icon', { spinning: loading }]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>

    <div class="dashboard-body">

      <!-- Loading -->
      <div v-if="loading" class="state-container">
        <div class="loader"><div class="loader-ring"></div></div>
        <p class="state-text">Loading events data…</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="state-container">
        <div class="error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <p class="state-label">Failed to load data</p>
        <p class="state-text">{{ error }}</p>
        <button class="retry-btn" @click="fetchInvitesData">Try Again</button>
      </div>

      <!-- Content -->
      <div v-else class="content">

        <!-- Metric Cards -->
        <div class="metrics-grid">
          <div class="metric-card" style="--accent: #2563eb">
            <div class="metric-label">Total Invitations</div>
            <div class="metric-value">{{ invitesData.total_invitations || 0 }}</div>
            <div class="metric-sub">all time</div>
          </div>
          <div class="metric-card" style="--accent: #0284c7">
            <div class="metric-label">Accepted</div>
            <div class="metric-value text-green">{{ invitesData.accepted_invitations || 0 }}</div>
            <div class="metric-sub">
              <span class="pill pill-green">{{ acceptedRate }}% rate</span>
            </div>
          </div>
          <div class="metric-card" style="--accent: #0369a1">
            <div class="metric-label">Events This Month</div>
            <div class="metric-value">{{ invitesData.events?.this_month || 0 }}</div>
            <div class="metric-sub">
              <span class="pill pill-blue">{{ invitesData.events?.this_week || 0 }} this week</span>
            </div>
          </div>
          <div class="metric-card" style="--accent: #3b82f6">
            <div class="metric-label">Total Revenue</div>
            <div class="metric-value">{{ formatCurrencyShort(invitesData.revenue?.total) }}</div>
            <div class="metric-sub">
              <span class="pill pill-blue">{{ invitesData.revenue?.currency || 'TZS' }}</span>
            </div>
          </div>
        </div>

        <!-- Two col -->
        <div class="two-col">
          <!-- Event timeline -->
          <div class="panel">
            <div class="panel-header">Event Timeline</div>
            <div class="panel-body">
              <div class="timeline-grid">
                <div class="tl-card">
                  <div class="tl-val">{{ invitesData.events?.this_week || 0 }}</div>
                  <div class="tl-label">This Week</div>
                  <div class="tl-bar"><div class="tl-fill" :style="{ width: weekPercent + '%' }"></div></div>
                </div>
                <div class="tl-card">
                  <div class="tl-val">{{ invitesData.events?.this_month || 0 }}</div>
                  <div class="tl-label">This Month</div>
                  <div class="tl-bar"><div class="tl-fill" :style="{ width: monthPercent + '%' }"></div></div>
                </div>
                <div class="tl-card">
                  <div class="tl-val tl-muted">{{ invitesData.events?.last_month || 0 }}</div>
                  <div class="tl-label">Last Month</div>
                  <div class="tl-bar tl-bar-muted"><div class="tl-fill tl-fill-muted" :style="{ width: lastMonthPercent + '%' }"></div></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Revenue -->
          <div class="panel">
            <div class="panel-header">Revenue Overview</div>
            <div class="panel-body">
              <div class="rev-row rev-row-total">
                <span>Total Revenue</span>
                <span class="text-green">{{ formatCurrency(invitesData.revenue?.total) }}</span>
              </div>
              <div class="rev-row">
                <span>This Month</span>
                <span class="text-blue">{{ formatCurrency(invitesData.revenue?.this_month) }}</span>
              </div>
              <div class="rev-row">
                <span>Last Month</span>
                <span class="text-muted">{{ formatCurrency(invitesData.revenue?.last_month) }}</span>
              </div>
              <div class="rev-row">
                <span>Currency</span>
                <span class="pill pill-blue">{{ invitesData.revenue?.currency || 'TZS' }} · Tanzanian Shilling</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Events Table -->
        <div class="panel">
          <div class="panel-header">
            Recent Events
            <span class="header-count">{{ invitesData.events?.recent?.length || 0 }}</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!invitesData.events?.recent?.length">
                  <td colspan="4" class="empty-row">No recent events found</td>
                </tr>
                <tr v-else v-for="event in invitesData.events?.recent?.slice(0, 5)" :key="event.event_id">
                  <td class="event-name">{{ event.event_name }}</td>
                  <td class="date-cell">{{ formatDate(event.date) }}</td>
                  <td class="location-cell">{{ event.location }}</td>
                  <td><span :class="paymentClass(event.payment_status)">{{ event.payment_status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bottom stats -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-val text-blue">{{ invitesData.revenue?.currency || 'TZS' }}</div>
            <div class="stat-label">Currency</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">{{ formatCurrencyShort(invitesData.revenue?.this_month) }}</div>
            <div class="stat-label">This Month Revenue</div>
          </div>
          <div class="stat-card">
            <div class="stat-val text-blue">{{ invitesData.events?.recent?.length || 0 }}</div>
            <div class="stat-label">Recent Events</div>
          </div>
          <div class="stat-card">
            <div class="stat-val text-green">{{ invitesData.accepted_invitations || 0 }}</div>
            <div class="stat-label">Accepted Invitations</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from '@/axios'

const loading = ref(true)
const error = ref(null)
const invitesData = ref({})
const lastUpdated = ref('')

const acceptedRate = computed(() => {
  const total = invitesData.value.total_invitations || 1
  const accepted = invitesData.value.accepted_invitations || 0
  return Math.round((accepted / total) * 100)
})

const maxEvents = computed(() => {
  const w = invitesData.value.events?.this_week || 0
  const m = invitesData.value.events?.this_month || 0
  const l = invitesData.value.events?.last_month || 0
  return Math.max(w, m, l, 1)
})
const weekPercent      = computed(() => Math.round(((invitesData.value.events?.this_week  || 0) / maxEvents.value) * 100))
const monthPercent     = computed(() => Math.round(((invitesData.value.events?.this_month || 0) / maxEvents.value) * 100))
const lastMonthPercent = computed(() => Math.round(((invitesData.value.events?.last_month || 0) / maxEvents.value) * 100))

const formatCurrency = (amount) => {
  if (!amount) return 'TZS 0'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}
const formatCurrencyShort = (amount) => {
  if (!amount) return '0'
  if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(1) + 'M'
  if (amount >= 1_000) return (amount / 1_000).toFixed(0) + 'K'
  return amount.toString()
}
const formatDate = (d) => {
  if (!d) return 'N/A'
  return new Date(d).toLocaleDateString('en-TZ', { year: 'numeric', month: 'short', day: 'numeric' })
}
const paymentClass = (status) => {
  const base = 'pill'
  switch (status?.toLowerCase()) {
    case 'paid':    return base + ' pill-green'
    case 'pending': return base + ' pill-amber'
    case 'partial': return base + ' pill-blue'
    default:        return base + ' pill-muted'
  }
}

const fetchInvitesData = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await axios.get('api/tera-invites/overview')
    if (res.data.success) {
      invitesData.value = res.data.data || {}
      lastUpdated.value = new Date().toLocaleTimeString()
    } else throw new Error(res.data.message || 'Unknown error')
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to load data'
  } finally {
    loading.value = false
  }
}

let interval
onMounted(() => { fetchInvitesData(); interval = setInterval(fetchInvitesData, 5 * 60 * 1000) })
onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

.events-dashboard {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #edf4fb; min-height: 100vh; color: #183b63;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Header */
.dashboard-header { background: linear-gradient(135deg, #174278 0%, #1f5aa5 58%, #163d71 100%); padding: 0 2rem; position: sticky; top: 0; z-index: 10; box-shadow: 0 1px 0 rgba(255,255,255,0.08), 0 4px 20px rgba(23,66,120,0.35); }
.header-content { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 1.125rem 0; }
.header-text h1 { font-size: 1.25rem; font-weight: 600; color: #fff; letter-spacing: -0.025em; margin: 0; }
.header-text p  { font-size: 0.775rem; color: rgba(255,255,255,0.65); margin: 0.125rem 0 0; }
.header-actions { display: flex; align-items: center; gap: 0.75rem; }
.last-updated { font-size: 0.73rem; color: rgba(255,255,255,0.5); font-weight: 400; }
.refresh-btn { display: flex; align-items: center; gap: 0.4rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 0.45rem 0.9rem; border-radius: 7px; font-size: 0.775rem; font-weight: 500; cursor: pointer; font-family: inherit; transition: background 0.15s; }
.refresh-btn:hover { background: rgba(255,255,255,0.18); }
.refresh-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.refresh-icon { width: 13px; height: 13px; }
.refresh-icon.spinning { animation: spin 1s linear infinite; }

.dashboard-body { max-width: 1280px; margin: 0 auto; padding: 2rem; }

/* States */
.state-container { display: flex; flex-direction: column; align-items: center; padding: 5rem 2rem; gap: 0.75rem; text-align: center; }
.loader { width: 44px; height: 44px; }
.loader-ring { width: 100%; height: 100%; border: 2.5px solid #dbeafe; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.9s linear infinite; }
.error-icon { width: 44px; height: 44px; color: #ef4444; }
.state-label { font-weight: 600; font-size: 0.95rem; margin: 0; }
.state-text { color: #67819d; font-size: 0.85rem; margin: 0; }
.retry-btn { margin-top: 0.5rem; padding: 0.5rem 1.25rem; background: #2563eb; color: #fff; border: none; border-radius: 7px; font-size: 0.85rem; font-weight: 500; cursor: pointer; font-family: inherit; }

.content { display: flex; flex-direction: column; gap: 1.25rem; }

/* Metrics */
.metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.metric-card { background: #fff; border-radius: 28px; padding: 1.375rem 1.5rem; border: 1px solid #d9e6f3; position: relative; overflow: hidden; transition: transform 0.18s, box-shadow 0.18s; }
.metric-card:hover { transform: translateY(-2px); box-shadow: 0 16px 34px rgba(18,58,99,0.08); }
.metric-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--accent); }
.metric-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #67819d; margin-bottom: 0.6rem; }
.metric-value { font-size: 1.875rem; font-weight: 600; color: #183b63; letter-spacing: -0.03em; line-height: 1; margin-bottom: 0.75rem; font-variant-numeric: tabular-nums; }
.metric-sub { font-size: 0.775rem; color: #67819d; display: flex; align-items: center; gap: 0.4rem; }

/* Panels */
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.panel { background: #fff; border-radius: 28px; border: 1px solid #d9e6f3; overflow: hidden; }
.panel-header { padding: 0.875rem 1.25rem; font-size: 0.8rem; font-weight: 600; color: #183b63; border-bottom: 1px solid #e6eef7; background: #f7fbff; display: flex; align-items: center; justify-content: space-between; letter-spacing: -0.01em; }
.header-count { background: #edf4ff; color: #1f5aa5; font-size: 0.7rem; font-weight: 700; padding: 0.175rem 0.5rem; border-radius: 999px; }
.panel-body { padding: 1.25rem; }

/* Timeline */
.timeline-grid { display: flex; flex-direction: column; gap: 1rem; }
.tl-val { font-size: 1.5rem; font-weight: 600; color: #1f5aa5; line-height: 1; font-variant-numeric: tabular-nums; }
.tl-muted { color: #67819d !important; }
.tl-label { font-size: 0.73rem; color: #67819d; margin: 0.2rem 0 0.45rem; }
.tl-bar { height: 5px; background: #edf4ff; border-radius: 3px; overflow: hidden; }
.tl-bar-muted { background: #f7fbff; }
.tl-fill { height: 100%; background: linear-gradient(90deg, #174278, #4a8ce3); border-radius: 3px; transition: width 0.6s ease; }
.tl-fill-muted { background: #cbd5e1; }

/* Revenue rows */
.rev-row { display: flex; justify-content: space-between; align-items: center; padding: 0.55rem 0; border-bottom: 1px solid #f7fbff; font-size: 0.83rem; color: #67819d; }
.rev-row:last-child { border-bottom: none; }
.rev-row span:last-child { font-size: 0.8rem; font-weight: 600; color: #183b63; font-variant-numeric: tabular-nums; }
.rev-row-total span:last-child { font-size: 0.95rem; }

/* Table */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
thead th { padding: 0.65rem 1.25rem; text-align: left; font-size: 0.68rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: #67819d; background: #f7fbff; border-bottom: 1px solid #d9e6f3; }
tbody td { padding: 0.8rem 1.25rem; font-size: 0.83rem; border-bottom: 1px solid #f7fbff; }
tbody tr:hover { background: #f7fbff; }
.event-name { font-weight: 500; color: #183b63; }
.date-cell, .location-cell { color: #67819d; font-size: 0.775rem; }
.empty-row { text-align: center; color: #67819d; padding: 2rem; font-size: 0.83rem; }

/* Bottom stats */
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.stat-card { background: #fff; border-radius: 28px; border: 1px solid #d9e6f3; padding: 1.5rem; text-align: center; }
.stat-val { font-size: 1.625rem; font-weight: 600; color: #183b63; line-height: 1; margin-bottom: 0.4rem; font-variant-numeric: tabular-nums; }
.stat-label { font-size: 0.75rem; color: #67819d; }

/* Pills */
.pill { display: inline-block; padding: 0.175rem 0.5rem; border-radius: 999px; font-size: 0.7rem; font-weight: 600; }
.pill-blue  { background: #edf4ff; color: #1f5aa5; }
.pill-green { background: #dcfce7; color: #15803d; }
.pill-amber { background: #fef3c7; color: #d97706; }
.pill-muted { background: #f7fbff; color: #67819d; }

/* Colors */
.text-green { color: #16a34a !important; }
.text-blue  { color: #1f5aa5 !important; }
.text-muted { color: #67819d !important; }

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .metrics-grid { grid-template-columns: repeat(2, 1fr); }
  .two-col { grid-template-columns: 1fr; }
  .stats-row { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .dashboard-body { padding: 1rem; }
  .metrics-grid { grid-template-columns: 1fr 1fr; }
  .stats-row { grid-template-columns: 1fr 1fr; }
  .header-text p, .last-updated { display: none; }
}
</style>