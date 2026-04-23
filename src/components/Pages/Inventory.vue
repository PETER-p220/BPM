<template>
  <div class="inventory-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-text">
          <h1>Inventory Management</h1>
          <p>Real-time stock insights across all showrooms</p>
        </div>
        <button class="refresh-btn" @click="fetchInventoryData" :disabled="loading">
          <svg :class="['refresh-icon', { spinning: loading }]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 4v6h-6M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <div class="dashboard-body">

      <!-- Loading -->
      <div v-if="loading" class="state-container">
        <div class="loader">
          <div class="loader-ring"></div>
        </div>
        <p class="state-text">Loading inventory data…</p>
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
        <button class="retry-btn" @click="fetchInventoryData">Try Again</button>
      </div>

      <!-- Content -->
      <div v-else class="content">

        <!-- Metric Cards -->
        <div class="metrics-grid">
          <div class="metric-card metric-primary">
            <div class="metric-label">This Week · Collected</div>
            <div class="metric-value">{{ formatCurrency(inventoryData.thisWeek?.collections?.totalCollected || 0) }}</div>
            <div class="metric-sub">
              <span class="pill pill-green">{{ inventoryData.thisWeek?.collections?.collectionRate || '0%' }}</span>
              collection rate
            </div>
          </div>

          <div class="metric-card metric-secondary">
            <div class="metric-label">This Month · Collected</div>
            <div class="metric-value">{{ formatCurrency(inventoryData.thisMonth?.collections?.totalCollected || 0) }}</div>
            <div class="metric-sub">
              <span class="pill pill-blue">{{ inventoryData.thisMonth?.collections?.salesCount || 0 }} sales</span>
              completed
            </div>
          </div>

          <div class="metric-card metric-alert">
            <div class="metric-label">Out of Stock · Critical</div>
            <div class="metric-value metric-value-red">{{ inventoryData.stockAlerts?.outOfStockCount || 0 }}</div>
            <div class="metric-sub">
              <span class="pill pill-red">Immediate action</span>
            </div>
          </div>

          <div class="metric-card metric-warning">
            <div class="metric-label">Low Stock · Warning</div>
            <div class="metric-value metric-value-amber">{{ inventoryData.stockAlerts?.lowStockCount || 0 }}</div>
            <div class="metric-sub">
              <span class="pill pill-amber">Reorder soon</span>
            </div>
          </div>
        </div>

        <!-- Stock Lists -->
        <div class="stock-grid">
          <!-- Out of Stock -->
          <div class="stock-panel">
            <div class="panel-header panel-header-red">
              <div class="panel-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                Out of Stock
              </div>
              <span class="badge badge-red">{{ inventoryData.stockAlerts?.outOfStock?.length || 0 }}</span>
            </div>
            <div class="panel-body">
              <div v-if="!inventoryData.stockAlerts?.outOfStock?.length" class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <p>All items in stock</p>
              </div>
              <div v-else class="item-list">
                <div
                  v-for="item in inventoryData.stockAlerts?.outOfStock"
                  :key="`${item.modelNumber}-${item.showroom}`"
                  class="stock-item stock-item-red"
                >
                  <div class="item-info">
                    <div class="item-name">{{ item.product }}</div>
                    <div class="item-meta">{{ item.modelNumber }} · {{ item.showroom }}</div>
                    <div class="item-location">{{ item.location }}</div>
                  </div>
                  <div class="item-stock">
                    <div class="stock-count stock-count-red">0</div>
                    <div class="stock-min">Min {{ item.minimumLevel }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Low Stock -->
          <div class="stock-panel">
            <div class="panel-header panel-header-amber">
              <div class="panel-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Low Stock
              </div>
              <span class="badge badge-amber">{{ inventoryData.stockAlerts?.lowStock?.length || 0 }}</span>
            </div>
            <div class="panel-body">
              <div v-if="!inventoryData.stockAlerts?.lowStock?.length" class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <p>All items well stocked</p>
              </div>
              <div v-else class="item-list">
                <div
                  v-for="item in inventoryData.stockAlerts?.lowStock"
                  :key="`${item.modelNumber}-${item.showroom}`"
                  class="stock-item stock-item-amber"
                >
                  <div class="item-info">
                    <div class="item-name">{{ item.product }}</div>
                    <div class="item-meta">{{ item.modelNumber }} · {{ item.showroom }}</div>
                    <div class="item-location">{{ item.location }}</div>
                  </div>
                  <div class="item-stock">
                    <div class="stock-count stock-count-amber">{{ item.currentStock }}</div>
                    <div class="stock-min">Min {{ item.minimumLevel }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Summary -->
        <div class="finance-panel">
          <div class="finance-header">Financial Summary</div>
          <div class="finance-grid">
            <div class="finance-col">
              <div class="finance-period">This Week</div>
              <div class="finance-row"><span>Total Invoiced</span><span>{{ formatCurrency(inventoryData.thisWeek?.collections?.totalInvoiced || 0) }}</span></div>
              <div class="finance-row"><span>Total Collected</span><span class="text-green">{{ formatCurrency(inventoryData.thisWeek?.collections?.totalCollected || 0) }}</span></div>
              <div class="finance-row"><span>Net Available</span><span class="text-blue">{{ formatCurrency(inventoryData.thisWeek?.netAvailable || 0) }}</span></div>
            </div>
            <div class="finance-divider"></div>
            <div class="finance-col">
              <div class="finance-period">This Month</div>
              <div class="finance-row"><span>Total Invoiced</span><span>{{ formatCurrency(inventoryData.thisMonth?.collections?.totalInvoiced || 0) }}</span></div>
              <div class="finance-row"><span>Total Collected</span><span class="text-green">{{ formatCurrency(inventoryData.thisMonth?.collections?.totalCollected || 0) }}</span></div>
              <div class="finance-row"><span>Net Available</span><span class="text-blue">{{ formatCurrency(inventoryData.thisMonth?.netAvailable || 0) }}</span></div>
            </div>
            <div class="finance-divider"></div>
            <div class="finance-col">
              <div class="finance-period">Outstanding</div>
              <div class="finance-row"><span>Pending</span><span class="text-amber">{{ formatCurrency(inventoryData.thisWeek?.collections?.outstanding?.pending || 0) }}</span></div>
              <div class="finance-row"><span>Overdue</span><span class="text-red">{{ formatCurrency(inventoryData.thisWeek?.collections?.outstanding?.overdue || 0) }}</span></div>
              <div class="finance-row finance-row-total"><span>Total Outstanding</span><span>{{ formatCurrency(inventoryData.thisWeek?.collections?.outstanding?.total || 0) }}</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axios from '@/axios'

const toast = useToast()
const loading = ref(true)
const error = ref(null)
const inventoryData = ref({
  thisWeek: {},
  thisMonth: {},
  stockAlerts: { outOfStock: [], lowStock: [] }
})

onMounted(async () => { await fetchInventoryData() })

async function fetchInventoryData() {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get('api/inventory/overview', { timeout: 10000 })
    if (response.data?.success) {
      inventoryData.value = response.data.data
      toast.success('Inventory data loaded')
    } else {
      throw new Error('Invalid response format')
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to connect'
    toast.error('Failed to load inventory data')
  } finally {
    loading.value = false
  }
}

function formatCurrency(amount) {
  if (!amount) return 'TZS 0'
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency', currency: 'TZS',
    minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(amount)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

/* ── Base ── */
.inventory-dashboard {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #edf4fb;
  min-height: 100vh;
  color: #183b63;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── Header ── */
.dashboard-header {
  background: linear-gradient(135deg, #174278 0%, #1f5aa5 58%, #163d71 100%);
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 1px 0 rgba(255,255,255,0.08), 0 4px 20px rgba(23,66,120,0.35);
}
.header-content {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 0;
}
.header-text h1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: -0.025em;
  margin: 0;
}
.header-text p {
  font-size: 0.775rem;
  color: rgba(255,255,255,0.65);
  margin: 0.125rem 0 0;
}
.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  padding: 0.45rem 0.9rem;
  border-radius: 7px;
  font-size: 0.775rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  font-family: inherit;
}
.refresh-btn:hover { background: rgba(255,255,255,0.18); }
.refresh-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.refresh-icon { width: 13px; height: 13px; }
.refresh-icon.spinning { animation: spin 1s linear infinite; }

/* ── Body ── */
.dashboard-body {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
}

/* ── States ── */
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  gap: 0.75rem;
  text-align: center;
}
.loader { width: 44px; height: 44px; position: relative; }
.loader-ring {
  width: 100%;
  height: 100%;
  border: 2.5px solid #dbeafe;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
.error-icon { width: 44px; height: 44px; color: #ef4444; }
.state-label { font-weight: 600; color: #183b63; font-size: 0.95rem; margin: 0; }
.state-text { color: #67819d; font-size: 0.85rem; margin: 0; }
.retry-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
}

/* ── Content ── */
.content { display: flex; flex-direction: column; gap: 1.25rem; }

/* ── Metrics ── */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.metric-card {
  background: #fff;
  border-radius: 28px;
  padding: 1.375rem 1.5rem;
  border: 1px solid #d9e6f3;
  position: relative;
  overflow: hidden;
  transition: transform 0.18s, box-shadow 0.18s;
}
.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 34px rgba(18,58,99,0.08);
}
.metric-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
}
.metric-primary::before   { background: linear-gradient(90deg, #2563eb, #60a5fa); }
.metric-secondary::before { background: linear-gradient(90deg, #0ea5e9, #38bdf8); }
.metric-alert::before     { background: linear-gradient(90deg, #ef4444, #f87171); }
.metric-warning::before   { background: linear-gradient(90deg, #f59e0b, #fcd34d); }

.metric-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #67819d;
  margin-bottom: 0.75rem;
}
.metric-value {
  font-size: 1.375rem;
  font-weight: 600;
  color: #183b63;
  letter-spacing: -0.025em;
  margin-bottom: 0.75rem;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.metric-value-red   { color: #ef4444; }
.metric-value-amber { color: #f59e0b; }
.metric-sub {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.775rem;
  color: #67819d;
}

/* ── Pills ── */
.pill {
  display: inline-block;
  padding: 0.175rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
}
.pill-green { background: #dcfce7; color: #15803d; }
.pill-blue  { background: #edf4ff; color: #1f5aa5; }
.pill-red   { background: #fee2e2; color: #dc2626; }
.pill-amber { background: #fef3c7; color: #d97706; }

/* ── Stock Panels ── */
.stock-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.stock-panel {
  background: #fff;
  border-radius: 28px;
  border: 1px solid #d9e6f3;
  overflow: hidden;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid #e6eef7;
}
.panel-header-red   { background: #fff5f5; }
.panel-header-amber { background: #fffbeb; }
.panel-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #183b63;
}
.panel-title svg { width: 15px; height: 15px; }
.panel-header-red   .panel-title svg { stroke: #ef4444; }
.panel-header-amber .panel-title svg { stroke: #f59e0b; }
.badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.175rem 0.5rem;
  border-radius: 999px;
}
.badge-red   { background: #fee2e2; color: #dc2626; }
.badge-amber { background: #fef3c7; color: #d97706; }

.panel-body { padding: 1rem 1.25rem; max-height: 320px; overflow-y: auto; }
.panel-body::-webkit-scrollbar { width: 4px; }
.panel-body::-webkit-scrollbar-track { background: transparent; }
.panel-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  color: #67819d;
}
.empty-state svg { width: 30px; height: 30px; stroke: #22c55e; }
.empty-state p { margin: 0; font-size: 0.83rem; }

.item-list { display: flex; flex-direction: column; gap: 0.5rem; }
.stock-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 0.9rem;
  border-radius: 9px;
  border: 1px solid transparent;
}
.stock-item-red   { background: #fff5f5; border-color: #fecaca; }
.stock-item-amber { background: #fffbeb; border-color: #fde68a; }

.item-info { flex: 1; }
.item-name { font-size: 0.83rem; font-weight: 600; color: #183b63; }
.item-meta { font-size: 0.73rem; color: #67819d; margin-top: 0.15rem; }
.item-location { font-size: 0.7rem; color: #67819d; margin-top: 0.1rem; }
.item-stock { text-align: right; }
.stock-count { font-size: 1.375rem; font-weight: 600; line-height: 1; font-variant-numeric: tabular-nums; }
.stock-count-red   { color: #ef4444; }
.stock-count-amber { color: #f59e0b; }
.stock-min { font-size: 0.68rem; color: #67819d; margin-top: 0.15rem; }

/* ── Finance Panel ── */
.finance-panel {
  background: #fff;
  border-radius: 28px;
  border: 1px solid #d9e6f3;
  overflow: hidden;
}
.finance-header {
  padding: 0.875rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #183b63;
  border-bottom: 1px solid #e6eef7;
  background: #f7fbff;
  letter-spacing: -0.01em;
}
.finance-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  padding: 1.5rem;
}
.finance-col { display: flex; flex-direction: column; gap: 0.55rem; }
.finance-divider { width: 1px; background: #e6eef7; margin: 0 2rem; }
.finance-period {
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #1f5aa5;
  margin-bottom: 0.2rem;
}
.finance-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #67819d;
}
.finance-row span:last-child {
  font-size: 0.8rem;
  color: #183b63;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.finance-row-total {
  padding-top: 0.5rem;
  border-top: 1px solid #e6eef7;
  margin-top: 0.2rem;
}
.finance-row-total span:last-child { color: #183b63; font-weight: 700; }

.text-green { color: #16a34a !important; }
.text-blue  { color: #1f5aa5 !important; }
.text-amber { color: #d97706 !important; }
.text-red   { color: #dc2626 !important; }

/* ── Animations ── */
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .metrics-grid { grid-template-columns: repeat(2, 1fr); }
  .finance-grid { grid-template-columns: 1fr; }
  .finance-divider { display: none; }
  .finance-col { padding: 0.5rem 0; border-bottom: 1px solid #f1f5f9; }
  .finance-col:last-child { border-bottom: none; }
}
@media (max-width: 640px) {
  .dashboard-body { padding: 1rem; }
  .metrics-grid { grid-template-columns: 1fr 1fr; }
  .stock-grid { grid-template-columns: 1fr; }
  .header-text p { display: none; }
}
</style>