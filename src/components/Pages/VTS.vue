<template>
  <div class="vts-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-text">
          <h1>Vehicle Tracking System</h1>
          <p>Real-time fleet management and monitoring</p>
        </div>
        <div class="header-actions">
          <div class="status-info">
            <div class="status-dot">
              <span class="dot-pulse"></span>
              <span>{{ isStale ? 'Cached' : 'Live' }}</span>
            </div>
            <div class="cache-status" v-if="isCached">
              <span class="cache-badge">{{ isStale ? 'Stale' : 'Cached' }}</span>
            </div>
          </div>
          <div class="refresh-info">
            <span class="last-updated">Updated {{ lastUpdated || 'never' }}</span>
            <button class="refresh-btn" @click="fetchVTSData" :disabled="loading">
              <svg :class="['refresh-icon', { spinning: loading }]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-body">

      <!-- Loading -->
      <div v-if="loading" class="state-container">
        <div class="loader"><div class="loader-ring"></div></div>
        <p class="state-text">Loading fleet data…</p>
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
        <button class="retry-btn" @click="fetchVTSData">Try Again</button>
      </div>

      <!-- Content -->
      <div v-else class="content">

        <!-- Key Performance Indicators -->
        <div class="kpi-section">
          <div class="section-header">
            <h2>Fleet Overview</h2>
            <p>Real-time vehicle tracking and system performance metrics</p>
          </div>
          <div class="metrics-grid">
            <div class="metric-card" style="--accent: #1f5aa5">
              <div class="metric-label">Total Vehicles</div>
              <div class="metric-value">{{ vtsData.system_overview?.total_vehicles || 0 }}</div>
              <div class="metric-sub">
                <span class="pill pill-brand">{{ vtsData.dashboard_statistics?.vehicles_tracked || 0 }} tracked</span>
              </div>
            </div>
            <div class="metric-card" style="--accent: #059669">
              <div class="metric-label">Active Routes</div>
              <div class="metric-value">{{ vtsData.active_routes || 0 }}</div>
              <div class="metric-sub">
                <span class="pill pill-green">{{ vtsData.total_distance || 0 }} km today</span>
              </div>
            </div>
            <div class="metric-card" style="--accent: #163d71">
              <div class="metric-label">Tracking Devices</div>
              <div class="metric-value">{{ vtsData.system_overview?.total_devices || 0 }}</div>
              <div class="metric-sub">
                <span class="pill pill-brand">{{ vtsData.device_history?.total_dispatched || 0 }} dispatched</span>
              </div>
            </div>
            <div class="metric-card" style="--accent: #4a8ce3">
              <div class="metric-label">Total Revenue</div>
              <div class="metric-value">{{ formatCurrencyShort(vtsData.accounts_finance_summary?.total_revenue_tzs) }}</div>
              <div class="metric-sub">
                <span class="pill pill-brand">{{ vtsData.accounts_finance_summary?.total_invoices || 0 }} invoices</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Operations Dashboard -->
        <div class="operations-section">
          <div class="section-header">
            <h2>Operations Dashboard</h2>
            <p>System performance and business metrics</p>
          </div>
          <div class="middle-grid">
            <div class="panel">
              <div class="panel-header">User Activity</div>
              <div class="panel-body">
                <div class="stat-row">
                  <span class="stat-label">Total Users</span>
                  <span class="stat-value">{{ vtsData.system_overview?.total_users || 0 }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Active</span>
                  <span class="stat-value text-green">{{ vtsData.system_overview?.active_users || 0 }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Inactive</span>
                  <span class="stat-value text-red">{{ (vtsData.system_overview?.total_users - vtsData.system_overview?.active_users) || 0 }}</span>
                </div>
                <div class="user-bar-wrap">
                  <div class="user-bar">
                    <div class="user-bar-fill" :style="{ width: userActivePercent + '%' }"></div>
                  </div>
                  <span class="bar-label">{{ userActivePercent }}% active</span>
                </div>
              </div>
            </div>

            <div class="panel">
              <div class="panel-header">Financial Overview</div>
              <div class="panel-body">
                <div class="stat-row">
                  <span class="stat-label">Total Revenue</span>
                  <span class="stat-value text-green">{{ formatCurrencyShort(vtsData.accounts_finance_summary?.total_revenue_tzs) }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Paid Invoices</span>
                  <span class="stat-value text-green">{{ vtsData.accounts_finance_summary?.paid_invoices || 0 }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Unpaid Invoices</span>
                  <span class="stat-value text-red">{{ vtsData.accounts_finance_summary?.unpaid_invoices || 0 }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Total Debts</span>
                  <span class="stat-value text-red">{{ vtsData.system_overview?.total_tdebts || 0 }}</span>
                </div>
              </div>
            </div>

            <div class="panel">
              <div class="panel-header">Route Analytics</div>
              <div class="panel-body">
                <div class="stat-row">
                  <span class="stat-label">Distance Today</span>
                  <span class="stat-value">{{ vtsData.total_distance || 0 }} <span class="unit">km</span></span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Avg Speed</span>
                  <span class="stat-value">{{ vtsData.average_speed || 0 }} <span class="unit">km/h</span></span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Fuel Consumption</span>
                  <span class="stat-value">{{ vtsData.fuel_consumption || 0 }} <span class="unit">L</span></span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Master Devices</span>
                  <span class="stat-value">{{ vtsData.device_history?.master_devices || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Business Metrics -->
        <div class="business-section">
          <div class="section-header">
            <h2>Business Operations</h2>
            <p>Customer and service management metrics</p>
          </div>
          <div class="metrics-grid">
            <div class="metric-card" style="--accent: #0284c7">
              <div class="metric-label">Total Customers</div>
              <div class="metric-value">{{ vtsData.system_overview?.total_customers || 0 }}</div>
              <div class="metric-sub">
                <span class="pill pill-green">{{ vtsData.teratrack_summary?.total_teratrack_customers || 0 }} teratrack</span>
              </div>
            </div>
            <div class="metric-card" style="--accent: #dc2626">
              <div class="metric-label">Service Requisitions</div>
              <div class="metric-value">{{ vtsData.system_overview?.total_requisitions || 0 }}</div>
              <div class="metric-sub">service requests</div>
            </div>
            <div class="metric-card" style="--accent: #7c3aed">
              <div class="metric-label">Total Dispatched</div>
              <div class="metric-value">{{ vtsData.system_overview?.total_dispatched || 0 }}</div>
              <div class="metric-sub">active deployments</div>
            </div>
            <div class="metric-card" style="--accent: #ea580c">
              <div class="metric-label">Teratrack VRN</div>
              <div class="metric-value">{{ vtsData.teratrack_summary?.total_teratrack_vrn || 0 }}</div>
              <div class="metric-sub">registered vehicles</div>
            </div>
          </div>
        </div>

        <!-- Recent Activity Tables -->
        <div class="activity-section">
          <div class="section-header">
            <h2>Recent Activity</h2>
            <p>Latest vehicle inspections and dispatch operations</p>
          </div>
          <div class="two-col">
            <div class="panel">
              <div class="panel-header">
                Recent Checklists
                <span class="header-count">{{ vtsData.recent_checklists?.length || 0 }}</span>
              </div>
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr><th>Vehicle ID</th><th>RBT Status</th><th>Battery</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    <tr v-if="!vtsData.recent_checklists?.length">
                      <td colspan="4" class="empty-row">No recent checklists found</td>
                    </tr>
                    <tr v-else v-for="checklist in vtsData.recent_checklists?.slice(0, 5)" :key="checklist.id || checklist.vehicle_id">
                      <td class="mono-cell">{{ checklist.vehicle_id }}</td>
                      <td><span class="pill pill-green">{{ checklist.rbt_status }}</span></td>
                      <td><span class="pill pill-brand">{{ checklist.batt_status }}</span></td>
                      <td class="date-cell">{{ formatDate(checklist.created_at) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="panel">
              <div class="panel-header">
                Dispatch History
                <span class="header-count">{{ vtsData.dispatch_history?.length || 0 }}</span>
              </div>
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr><th>Dispatch ID</th><th>User ID</th><th>Requisition</th><th>Status</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    <tr v-if="!vtsData.dispatch_history?.length">
                      <td colspan="5" class="empty-row">No dispatch history found</td>
                    </tr>
                    <tr v-else v-for="dispatch in vtsData.dispatch_history?.slice(0, 5)" :key="dispatch.dispatch_id">
                      <td class="mono-cell">#{{ dispatch.dispatch_id }}</td>
                      <td>{{ dispatch.user_id }}</td>
                      <td>{{ dispatch.requisition_id }}</td>
                      <td><span class="pill pill-green">{{ dispatch.status }}</span></td>
                      <td class="date-cell">{{ formatDate(dispatch.created_at) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- System Status -->
        <div class="status-section">
          <div class="panel">
            <div class="panel-header">System Status</div>
            <div class="panel-body">
              <div class="status-grid">
                <div class="status-item">
                  <span class="status-label">Checklists Completed</span>
                  <span class="status-value">{{ vtsData.system_overview?.total_checklists || 0 }}</span>
                </div>
                <div class="status-item">
                  <span class="status-label">Job Cards Active</span>
                  <span class="status-value">{{ vtsData.system_overview?.total_job_cards || 0 }}</span>
                </div>
                <div class="status-item">
                  <span class="status-label">Assignments Pending</span>
                  <span class="status-value">{{ vtsData.system_overview?.total_assignments || 0 }}</span>
                </div>
              </div>
            </div>
            <div class="panel-footer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              All systems operational · Updated {{ new Date().toLocaleTimeString() }}
            </div>
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
const vtsData = ref({})
const isCached = ref(false)
const isStale = ref(false)
const lastUpdated = ref('')

const userActivePercent = computed(() => {
  const total = vtsData.value.system_overview?.total_users || 1
  const active = vtsData.value.system_overview?.active_users || 0
  return Math.round((active / total) * 100)
})

const formatCurrencyShort = (amount) => {
  if (!amount) return '0'
  const num = parseFloat(amount)
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(0) + 'K'
  return num.toString()
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-TZ', { year: 'numeric', month: 'short', day: 'numeric' })
}

const fetchVTSData = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get('api/vts/dashboard', { timeout: 30000 })
    if (response.data?.success) {
      vtsData.value = response.data.data
      isCached.value = response.data.cached || false
      isStale.value = response.data.stale || false
      lastUpdated.value = response.data.last_updated || new Date().toLocaleTimeString()
      if (response.data.warning) console.warn('VTS:', response.data.warning)
    } else throw new Error('Invalid response format')
  } catch (err) {
    error.value = err.code === 'ECONNABORTED'
      ? 'VTS service is taking longer than expected. Please try again in a moment.'
      : err.response?.data?.message || err.message || 'Failed to connect to VTS API'
  } finally {
    loading.value = false
  }
}

let interval
onMounted(() => { fetchVTSData(); interval = setInterval(fetchVTSData, 5 * 60 * 1000) })
onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

.vts-dashboard {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #edf4fb;
  min-height: 100vh;
  color: #183b63;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── Header — mirrors sidebar gradient ── */
.dashboard-header {
  background: linear-gradient(135deg, #174278 0%, #1f5aa5 58%, #163d71 100%);
  padding: 0 2rem;
  position: sticky; top: 0; z-index: 10;
  box-shadow: 0 1px 0 rgba(255,255,255,0.07), 0 4px 20px rgba(23,66,120,0.35);
}
.header-content {
  max-width: 1280px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.125rem 0;
}
.header-text h1 { font-size: 1.2rem; font-weight: 600; color: #fff; letter-spacing: -0.025em; margin: 0; }
.header-text p  { font-size: 0.75rem; color: rgba(255,255,255,0.65); margin: 0.1rem 0 0; }
.header-actions { display: flex; align-items: center; justify-content: flex-end; gap: 1rem; flex: 1; padding-left: 2rem; }
.status-info { display: flex; align-items: center; gap: 0.5rem; }
.status-dot  { display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; color: rgba(255,255,255,0.68); font-weight: 450; }
.dot-pulse   { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; animation: pulse-ring 1.5s ease-out infinite; }
.cache-badge { font-size: 0.68rem; font-weight: 600; padding: 0.18rem 0.48rem; border-radius: 4px; background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.9); }
.refresh-info { display: flex; align-items: center; gap: 0.75rem; }
.last-updated { font-size: 0.72rem; color: rgba(255,255,255,0.45); }
.refresh-btn {
  display: flex; align-items: center; gap: 0.4rem;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
  color: #fff; padding: 0.44rem 0.88rem; border-radius: 8px;
  font-size: 0.775rem; font-weight: 500; cursor: pointer;
  transition: background 0.15s; font-family: inherit;
}
.refresh-btn:hover { background: rgba(255,255,255,0.17); }
.refresh-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.refresh-icon { width: 13px; height: 13px; }
.refresh-icon.spinning { animation: spin 1s linear infinite; }

/* ── Body ── */
.dashboard-body { max-width: 1280px; margin: 0 auto; padding: 1.75rem 2rem; }

/* ── States ── */
.state-container { display: flex; flex-direction: column; align-items: center; padding: 5rem 2rem; gap: 0.75rem; text-align: center; }
.loader { width: 44px; height: 44px; }
.loader-ring { width: 100%; height: 100%; border: 2.5px solid #dbeafe; border-top-color: #1f5aa5; border-radius: 50%; animation: spin 0.9s linear infinite; }
.error-icon { width: 44px; height: 44px; color: #ef4444; }
.state-label { font-weight: 600; font-size: 0.95rem; margin: 0; }
.state-text  { color: #67819d; font-size: 0.84rem; margin: 0; }
.retry-btn   { margin-top: 0.5rem; padding: 0.48rem 1.2rem; background: #1f5aa5; color: #fff; border: none; border-radius: 8px; font-size: 0.84rem; font-weight: 500; cursor: pointer; font-family: inherit; }

/* ── Content ── */
.content { display: flex; flex-direction: column; gap: 1.25rem; }

/* ── Metric Cards ── */
.metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.metric-card { background: #fff; border-radius: 28px; padding: 1.375rem 1.5rem; border: 1px solid #d9e6f3; position: relative; overflow: hidden; transition: transform 0.18s, box-shadow 0.18s; }
.metric-card:hover { transform: translateY(-2px); box-shadow: 0 16px 34px rgba(18,58,99,0.08); }
.metric-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--accent); }
.metric-label { font-size: 0.69rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #67819d; margin-bottom: 0.55rem; }
.metric-value { font-size: 1.875rem; font-weight: 600; color: #183b63; letter-spacing: -0.03em; line-height: 1; font-variant-numeric: tabular-nums; }
.metric-sub   { margin-top: 0.6rem; display: flex; align-items: center; gap: 0.4rem; font-size: 0.76rem; color: #67819d; }

/* ── Panels ── */
.middle-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.two-col     { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.panel { background: #fff; border-radius: 28px; border: 1px solid #d9e6f3; overflow: hidden; display: flex; flex-direction: column; }
.panel-header { padding: 0.825rem 1.25rem; font-size: 0.8rem; font-weight: 600; color: #183b63; border-bottom: 1px solid #e6eef7; background: #f7fbff; display: flex; align-items: center; justify-content: space-between; letter-spacing: -0.01em; }
.header-count { background: #edf4ff; color: #1f5aa5; font-size: 0.68rem; font-weight: 700; padding: 0.18rem 0.5rem; border-radius: 999px; }
.panel-body   { padding: 1rem 1.25rem; flex: 1; display: flex; flex-direction: column; gap: 0.35rem; }
.panel-footer { padding: 0.65rem 1.25rem; border-top: 1px solid #e6eef7; font-size: 0.72rem; color: #67819d; display: flex; align-items: center; gap: 0.4rem; background: #f7fbff; }
.panel-footer svg { width: 13px; height: 13px; stroke: #4a8ce3; }

/* ── Stat rows ── */
.stat-row { display: flex; justify-content: space-between; align-items: center; padding: 0.32rem 0; border-bottom: 1px solid #f7fbff; }
.stat-row:last-of-type { border-bottom: none; }
.stat-label { font-size: 0.79rem; color: #67819d; }
.stat-value { font-size: 0.86rem; font-weight: 600; color: #183b63; font-variant-numeric: tabular-nums; }
.unit       { font-size: 0.67rem; color: #67819d; font-weight: 400; }
.text-green { color: #16a34a !important; }
.text-red   { color: #dc2626 !important; }
.text-brand { color: #1f5aa5 !important; }

/* ── User bar ── */
.user-bar-wrap { margin-top: 0.5rem; }
.user-bar      { height: 5px; background: #e2e8f0; border-radius: 3px; overflow: hidden; margin-bottom: 0.28rem; }
.user-bar-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #174278, #4a8ce3); transition: width 0.6s ease; }
.bar-label     { font-size: 0.69rem; color: #67819d; }

/* ── Pills ── */
.pill       { display: inline-block; padding: 0.17rem 0.48rem; border-radius: 999px; font-size: 0.69rem; font-weight: 600; }
.pill-green { background: #dcfce7; color: #15803d; }
.pill-brand { background: #edf4ff; color: #174278; }

/* ── Table ── */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
thead th { padding: 0.65rem 1.25rem; text-align: left; font-size: 0.67rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: #67819d; background: #f7fbff; border-bottom: 1px solid #d9e6f3; }
tbody td  { padding: 0.78rem 1.25rem; font-size: 0.82rem; border-bottom: 1px solid #f7fbff; }
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover { background: #f7fbff; }
.mono-cell { font-variant-numeric: tabular-nums; font-weight: 500; }
.date-cell { color: #67819d; font-size: 0.76rem; font-variant-numeric: tabular-nums; }
.empty-row { text-align: center; color: #67819d; padding: 2rem; font-size: 0.82rem; }

/* ── Map ── */
.map-panel { min-height: 260px; }
.map-placeholder { flex: 1; position: relative; overflow: hidden; background: linear-gradient(135deg, #eff6ff 0%, #edf4ff 100%); min-height: 200px; }
.map-grid-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(74,140,227,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(74,140,227,0.07) 1px, transparent 1px); background-size: 28px 28px; }
.map-content { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.35rem; }
.map-content svg  { width: 36px; height: 36px; stroke: #4a8ce3; }
.map-content p    { font-size: 0.875rem; font-weight: 600; color: #1f5aa5; margin: 0; }
.map-content span { font-size: 0.74rem; color: #67819d; }

/* ── Animations ── */
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(74,222,128,0.6); } 100% { box-shadow: 0 0 0 8px rgba(74,222,128,0); } }

/* ── Section Headers ── */
.section-header {
  margin-bottom: 1.5rem;
}
.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #183b63;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.025em;
}
.section-header p {
  font-size: 0.875rem;
  color: #67819d;
  margin: 0;
  line-height: 1.5;
}

/* ── Section Layouts ── */
.kpi-section,
.operations-section,
.business-section,
.activity-section,
.status-section {
  margin-bottom: 2rem;
}

/* ── Status Grid ── */
.status-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
  background: #f7fbff;
  border-radius: 16px;
  border: 1px solid #e6eef7;
}
.status-label {
  font-size: 0.75rem;
  color: #67819d;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
.status-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #183b63;
  font-variant-numeric: tabular-nums;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .metrics-grid { grid-template-columns: repeat(2, 1fr); }
  .middle-grid  { grid-template-columns: 1fr 1fr; }
  .bottom-grid, .two-col { grid-template-columns: 1fr; }
  .status-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .dashboard-body { padding: 1rem; }
  .metrics-grid { grid-template-columns: 1fr 1fr; }
  .two-col { grid-template-columns: 1fr; }
  .header-text p, .last-updated { display: none; }
  .section-header h2 { font-size: 1.25rem; }
  .section-header p { font-size: 0.8rem; }
}
</style>