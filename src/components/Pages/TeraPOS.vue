<template>
  <div class="pos-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-text">
          <h1>Tera POS System</h1>
          <p>Point of sale and payment processing overview</p>
        </div>
        <div class="header-actions">
          <span class="last-updated">Updated {{ lastUpdated || '—' }}</span>
          <button class="refresh-btn" @click="fetchPOSData" :disabled="loading">
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
        <p class="state-text">Loading POS data…</p>
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
        <button class="retry-btn" @click="fetchPOSData">Try Again</button>
      </div>

      <!-- Content -->
      <div v-else class="content">

        <!-- Metric Cards -->
        <div class="metrics-grid">
          <div class="metric-card" style="--accent: #2563eb">
            <div class="metric-label">Total Shops</div>
            <div class="metric-value">{{ posData.shops?.total || 0 }}</div>
            <div class="metric-sub">
              <span class="pill pill-blue">{{ posData.shops?.this_month || 0 }} this month</span>
            </div>
          </div>
          <div class="metric-card" style="--accent: #0284c7">
            <div class="metric-label">Active Subscriptions</div>
            <div class="metric-value">{{ posData.subscriptions?.active_total || 0 }}</div>
            <div class="metric-sub">
              <span class="pill pill-green">{{ posData.subscriptions?.this_week || 0 }} this week</span>
            </div>
          </div>
          <div class="metric-card" style="--accent: #0369a1">
            <div class="metric-label">Monthly Shops</div>
            <div class="metric-value">{{ posData.shops?.this_month || 0 }}</div>
            <div class="metric-sub">
              <span class="pill pill-blue">{{ posData.shops?.this_week || 0 }} this week</span>
            </div>
          </div>
          <div class="metric-card" style="--accent: #3b82f6">
            <div class="metric-label">Total Revenue</div>
            <div class="metric-value">{{ formatCurrencyShort(posData.revenue?.total) }}</div>
            <div class="metric-sub">
              <span class="pill pill-blue">{{ posData.currency || 'TZS' }}</span>
            </div>
          </div>
        </div>

        <!-- Middle Row -->
        <div class="two-col">
          <!-- Shop & Sub metrics -->
          <div class="panel">
            <div class="panel-header">Shop &amp; Subscription Metrics</div>
            <div class="panel-body">
              <div class="bubble-grid">
                <div class="bubble">
                  <div class="bubble-val">{{ posData.shops?.this_week || 0 }}</div>
                  <div class="bubble-label">Shops<br>This Week</div>
                </div>
                <div class="bubble">
                  <div class="bubble-val">{{ posData.subscriptions?.this_week || 0 }}</div>
                  <div class="bubble-label">Subscriptions<br>This Week</div>
                </div>
                <div class="bubble">
                  <div class="bubble-val">{{ posData.shops?.this_month || 0 }}</div>
                  <div class="bubble-label">Shops<br>This Month</div>
                </div>
                <div class="bubble bubble-accent">
                  <div class="bubble-val">{{ posData.subscriptions?.active_total || 0 }}</div>
                  <div class="bubble-label">Active<br>Subscriptions</div>
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
                <span class="text-green">{{ formatCurrency(posData.revenue?.total) }}</span>
              </div>
              <div class="rev-row">
                <span>This Week</span>
                <span class="text-blue">{{ formatCurrency(posData.revenue?.this_week) }}</span>
              </div>
              <div class="rev-row">
                <span>This Month</span>
                <span>{{ formatCurrency(posData.revenue?.this_month) }}</span>
              </div>
              <div class="rev-row">
                <span>Last Month</span>
                <span class="text-muted">{{ formatCurrency(posData.revenue?.last_month) }}</span>
              </div>
              <div class="rev-row">
                <span>Currency</span>
                <span class="pill pill-blue">{{ posData.currency || 'TZS' }} · Tanzanian Shilling</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Shops Table -->
        <div class="panel">
          <div class="panel-header">
            Recent Shops
            <span class="header-count">{{ posData.shops?.recent?.length || 0 }}</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Shop Name</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!posData.shops?.recent?.length">
                  <td colspan="3" class="empty-row">No recent shops found</td>
                </tr>
                <tr v-else v-for="shop in posData.shops?.recent?.slice(0, 5)" :key="shop.id">
                  <td class="shop-name">{{ shop.name || 'N/A' }}</td>
                  <td><span class="pill pill-green">Active</span></td>
                  <td class="date-cell">{{ formatDate(shop.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Subscription Summary -->
        <div class="sub-grid">
          <div class="sub-card">
            <div class="sub-val text-green">{{ posData.subscriptions?.active_total || 0 }}</div>
            <div class="sub-label">Active Subscriptions</div>
          </div>
          <div class="sub-card">
            <div class="sub-val text-blue">{{ posData.subscriptions?.this_month || 0 }}</div>
            <div class="sub-label">This Month</div>
          </div>
          <div class="sub-card">
            <div class="sub-val text-red">{{ posData.subscriptions?.pending_overdue || 0 }}</div>
            <div class="sub-label">Pending Overdue</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from '@/axios'

const loading = ref(true)
const error = ref(null)
const posData = ref({})
const lastUpdated = ref('')

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

const fetchPOSData = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await axios.get('api/tera-pos/overview')
    if (res.data.success) {
      posData.value = res.data.data || {}
      lastUpdated.value = new Date().toLocaleTimeString()
    } else throw new Error(res.data.message || 'Unknown error')
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to load POS data'
  } finally {
    loading.value = false
  }
}

let interval
onMounted(() => { fetchPOSData(); interval = setInterval(fetchPOSData, 3 * 60 * 1000) })
onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

.pos-dashboard {
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
.state-label { font-weight: 600; color: #183b63; font-size: 0.95rem; margin: 0; }
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
.metric-sub { display: flex; align-items: center; gap: 0.4rem; font-size: 0.775rem; color: #67819d; }

/* Panels */
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.panel { background: #fff; border-radius: 28px; border: 1px solid #d9e6f3; overflow: hidden; }
.panel-header { padding: 0.875rem 1.25rem; font-size: 0.8rem; font-weight: 600; color: #183b63; border-bottom: 1px solid #e6eef7; background: #f7fbff; display: flex; align-items: center; justify-content: space-between; letter-spacing: -0.01em; }
.header-count { background: #edf4ff; color: #1f5aa5; font-size: 0.7rem; font-weight: 700; padding: 0.175rem 0.5rem; border-radius: 999px; }
.panel-body { padding: 1.25rem; }

/* Bubble grid */
.bubble-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem; }
.bubble { background: #f7fbff; border-radius: 20px; padding: 1.125rem; text-align: center; border: 1px solid #d9e6f3; }
.bubble-accent { background: linear-gradient(135deg, #174278 0%, #1f5aa5 58%, #163d71 100%); border-color: #174278; }
.bubble-accent .bubble-val { color: #fff; }
.bubble-accent .bubble-label { color: rgba(255,255,255,0.7); }
.bubble-val { font-size: 1.625rem; font-weight: 600; color: #1f5aa5; line-height: 1; font-variant-numeric: tabular-nums; }
.bubble-label { font-size: 0.7rem; color: #67819d; margin-top: 0.35rem; line-height: 1.4; }

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
.shop-name { font-weight: 500; color: #183b63; }
.date-cell { color: #67819d; font-size: 0.775rem; font-variant-numeric: tabular-nums; }
.empty-row { text-align: center; color: #67819d; padding: 2rem; font-size: 0.83rem; }

/* Sub cards */
.sub-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.sub-card { background: #fff; border-radius: 28px; border: 1px solid #d9e6f3; padding: 1.5rem; text-align: center; }
.sub-val { font-size: 2.25rem; font-weight: 600; color: #183b63; line-height: 1; margin-bottom: 0.5rem; font-variant-numeric: tabular-nums; }
.sub-label { font-size: 0.775rem; color: #67819d; }

/* Pills */
.pill { display: inline-block; padding: 0.175rem 0.5rem; border-radius: 999px; font-size: 0.7rem; font-weight: 600; }
.pill-blue  { background: #edf4ff; color: #1f5aa5; }
.pill-green { background: #dcfce7; color: #15803d; }

/* Colors */
.text-green { color: #16a34a !important; }
.text-blue  { color: #1f5aa5 !important; }
.text-red   { color: #dc2626 !important; }
.text-muted { color: #67819d !important; }

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .metrics-grid { grid-template-columns: repeat(2, 1fr); }
  .two-col { grid-template-columns: 1fr; }
  .sub-grid { grid-template-columns: 1fr 1fr 1fr; }
}
@media (max-width: 640px) {
  .dashboard-body { padding: 1rem; }
  .metrics-grid { grid-template-columns: 1fr 1fr; }
  .sub-grid { grid-template-columns: 1fr; }
  .header-text p, .last-updated { display: none; }
}
</style>