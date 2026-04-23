<template>
  <div class="min-h-screen bg-[#edf4fb] px-4 py-4 lg:px-5 dashboard-shell">
    <div class="dashboard-frame mx-auto flex min-h-[calc(100vh-32px)] max-w-[1580px] flex-col overflow-hidden rounded-[34px] border border-[#d9e6f3] bg-white/84 shadow-[0_28px_70px_rgba(18,58,99,0.14)] backdrop-blur-sm">

      <!-- ── HERO ── -->
      <div class="dashboard-hero relative overflow-hidden border-b border-[#dbe7f3] bg-[linear-gradient(135deg,#eef5ff_0%,#ffffff_46%,#f7fbff_100%)] px-6 py-5 lg:px-7">
        <div class="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-[#dce9fb] blur-3xl"></div>
        <div class="pointer-events-none absolute right-6 top-3 h-24 w-24 opacity-35" style="background-image: radial-gradient(#2b74d7 1.2px, transparent 1.2px); background-size: 10px 10px;"></div>

        <div class="relative flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div class="flex min-w-0 items-start gap-4">
            <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white shadow-[0_16px_34px_rgba(35,96,182,0.26)]">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2d6aaf]">Finance Workspace</p>
              <h1 class="mt-1 text-2xl font-bold tracking-tight text-[#183b63] lg:text-[28px]">Accountant Dashboard</h1>
              <p class="mt-1.5 max-w-3xl text-sm leading-6 text-[#67819d]">Track budget flow, payment status, receipts, and financial compliance from a single working surface.</p>
            </div>
          </div>
          <div class="flex shrink-0 items-center gap-3">
            <div class="flex items-center gap-2 rounded-2xl border border-[#d8e8f8] bg-[#f0f6ff] px-4 py-2 text-sm text-[#3a6ea8]">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="font-medium">{{ today }}</span>
            </div>
          </div>
        </div>

        <!-- Stats cards -->
        <div class="relative mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div class="analytics-card analytics-card--budget p-5 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p v-if="loading" class="animate-pulse"><span class="inline-block h-6 w-28 rounded bg-white/30"></span></p>
                <p v-else class="text-xl font-bold">{{ formatCurrency(stats.totalBudget) }}</p>
                <p class="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/72">Total Budget</p>
              </div>
              <div class="analytics-card__icon">
                <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
            <div class="mt-3 h-1 rounded-full bg-white/20">
              <div class="h-1 rounded-full bg-white/70" :style="{ width: spentPercent + '%' }"></div>
            </div>
            <p class="mt-1.5 text-[11px] text-white/68">{{ spentPercent }}% utilised</p>
          </div>

          <div class="analytics-card analytics-card--payments p-5 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p v-if="loading" class="animate-pulse"><span class="inline-block h-6 w-20 rounded bg-white/30"></span></p>
                <p v-else class="text-xl font-bold">{{ formatCurrency(stats.totalPayments) }}</p>
                <p class="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/72">Total Payments</p>
              </div>
              <div class="analytics-card__icon">
                <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="analytics-card analytics-card--receipts p-5 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p v-if="loading" class="animate-pulse"><span class="inline-block h-6 w-12 rounded bg-white/30"></span></p>
                <p v-else class="text-xl font-bold">{{ stats.totalReceipts ?? 0 }}</p>
                <p class="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/72">Receipts Submitted</p>
              </div>
              <div class="analytics-card__icon">
                <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="analytics-card analytics-card--pending p-5 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p v-if="loading" class="animate-pulse"><span class="inline-block h-6 w-12 rounded bg-white/30"></span></p>
                <p v-else class="text-xl font-bold">{{ stats.pendingRequests ?? 0 }}</p>
                <p class="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/72">Pending Requests</p>
              </div>
              <div class="analytics-card__icon">
                <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── BODY ── -->
      <div class="dashboard-body grid flex-1 grid-cols-1 gap-4 bg-[linear-gradient(180deg,#fbfdff_0%,#f7fbff_100%)] p-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.95fr)]">

        <!-- LEFT column -->
        <div class="grid min-h-0 grid-cols-1 gap-4">

          <!-- Recent Payments -->
          <section class="workspace-panel flex min-h-0 flex-col overflow-hidden rounded-[28px] border border-[#dce7f3] bg-white shadow-[0_16px_34px_rgba(18,58,99,0.08)]">
            <div class="workspace-panel__header flex items-center justify-between gap-4 border-b border-[#e6eef7] px-5 py-4">
              <div>
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Financial Activity</p>
                <h2 class="mt-1 text-base font-bold text-[#183b63]">Recent Payments</h2>
              </div>
              <router-link to="/all-payments" class="rounded-xl bg-[#edf4ff] px-3 py-1.5 text-xs font-semibold text-[#1f5aa6] transition hover:bg-[#ddeeff]">
                View all
              </router-link>
            </div>

            <div v-if="loading" class="flex-1 space-y-3 px-5 py-4">
              <div v-for="i in 5" :key="i" class="animate-pulse rounded-2xl border border-[#e3edf7] bg-white p-4">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-2xl bg-[#dfeaf6]"></div>
                  <div class="flex-1">
                    <div class="mb-2 h-4 w-2/3 rounded bg-[#dfeaf6]"></div>
                    <div class="h-3 w-1/3 rounded bg-[#edf3fa]"></div>
                  </div>
                  <div class="h-5 w-20 rounded bg-[#edf3fa]"></div>
                </div>
              </div>
            </div>

            <div v-else-if="recentPayments.length === 0" class="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
              <div class="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#e9f2ff] shadow-inner">
                <svg class="h-7 w-7 text-[#2b74d7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-sm font-semibold text-[#183b63]">No payments recorded yet</p>
              <p class="mt-1 text-xs text-[#8aa0b7]">Payments will appear here once they are submitted.</p>
            </div>

            <div v-else class="panel-scroll flex-1 overflow-y-auto px-5 py-4">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-[#edf2f7] text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#88a0b8]">
                    <th class="px-2 py-3">Description</th>
                    <th class="px-2 py-3">Amount</th>
                    <th class="px-2 py-3">Type</th>
                    <th class="px-2 py-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in recentPayments" :key="p.id" class="border-b border-[#f2f6fb] text-[#4e6781] transition-colors hover:bg-[#fbfdff]">
                    <td class="px-2 py-3.5">
                      <p class="font-semibold text-[#183b63]">{{ p.description || 'Payment' }}</p>
                      <p class="mt-0.5 text-xs text-[#8aa0b7]">Ref #{{ p.id }}</p>
                    </td>
                    <td class="px-2 py-3.5 font-semibold text-[#183b63]">{{ formatCurrency(p.amount) }}</td>
                    <td class="px-2 py-3.5">
                      <span class="rounded-full bg-[#edf4ff] px-2.5 py-1 text-[11px] font-semibold text-[#1f5aa6]">
                        {{ p.payment_type || 'General' }}
                      </span>
                    </td>
                    <td class="px-2 py-3.5 text-right text-xs text-[#7a93af]">{{ formatDate(p.created_at) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Budget Allocations -->
          <section class="workspace-panel overflow-hidden rounded-[28px] border border-[#dce7f3] bg-white shadow-[0_16px_34px_rgba(18,58,99,0.08)]">
            <div class="workspace-panel__header flex items-center justify-between gap-4 border-b border-[#e6eef7] px-5 py-4">
              <div>
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Budget Tracking</p>
                <h2 class="mt-1 text-base font-bold text-[#183b63]">Budget Allocations</h2>
              </div>
              <router-link to="/acc-budgets" class="rounded-xl bg-[#edf4ff] px-3 py-1.5 text-xs font-semibold text-[#1f5aa6] transition hover:bg-[#ddeeff]">
                Manage
              </router-link>
            </div>
            <div class="px-5 py-4">
              <div v-if="loading" class="space-y-3">
                <div v-for="i in 4" :key="i" class="animate-pulse rounded-2xl border border-[#e3edf7] p-4">
                  <div class="mb-2 h-4 w-1/2 rounded bg-[#dfeaf6]"></div>
                  <div class="h-2 w-full rounded bg-[#edf3fa]"></div>
                </div>
              </div>
              <div v-else-if="budgetAllocations.length === 0" class="py-8 text-center">
                <p class="text-sm text-[#8aa0b7]">No budget allocations found.</p>
              </div>
              <div v-else class="space-y-3">
                <div v-for="b in budgetAllocations" :key="b.id" class="rounded-[22px] border border-[#e6eef7] bg-[#fbfdff] p-4">
                  <div class="flex items-center justify-between">
                    <div class="min-w-0">
                      <p class="truncate text-sm font-semibold text-[#183b63]">{{ b.label || b.department?.name || 'Allocation' }}</p>
                      <p class="mt-0.5 text-xs text-[#8aa0b7]">{{ formatCurrency(b.amount) }} allocated</p>
                    </div>
                    <span class="ml-3 rounded-full px-2.5 py-1 text-[11px] font-semibold" :class="getAllocationColor(b.allocation_type)">
                      {{ b.allocation_type || 'General' }}
                    </span>
                  </div>
                  <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e6eef7]">
                    <div class="h-1.5 rounded-full bg-[linear-gradient(90deg,#194f92,#2f78dd)]" :style="{ width: Math.min(100, b.utilisation ?? 60) + '%' }"></div>
                  </div>
                  <p class="mt-1.5 text-[11px] text-[#8aa0b7]">{{ b.utilisation ?? '—' }}% utilised</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- RIGHT column -->
        <div class="grid min-h-0 grid-cols-1 gap-4">

          <!-- Financial Summary -->
          <section class="workspace-panel rounded-[28px] border border-[#dce7f3] bg-white p-5 shadow-[0_16px_34px_rgba(18,58,99,0.08)]">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Overview</p>
                <h2 class="mt-1 text-base font-bold text-[#183b63]">Financial Summary</h2>
              </div>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-3">
              <div class="rounded-[22px] border border-[#e6eef7] bg-[#fbfdff] p-4">
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Budget Spent</p>
                <p class="mt-2 text-lg font-bold text-[#183b63]">{{ formatCurrency(stats.totalSpent) }}</p>
              </div>
              <div class="rounded-[22px] border border-[#e6eef7] bg-[#fbfdff] p-4">
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Remaining</p>
                <p class="mt-2 text-lg font-bold text-[#1a7a3c]">{{ formatCurrency(stats.totalBudget - stats.totalSpent) }}</p>
              </div>
              <div class="rounded-[22px] border border-[#e6eef7] bg-[#fbfdff] p-4">
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Receipts</p>
                <p class="mt-2 text-lg font-bold text-[#183b63]">{{ stats.totalReceipts ?? 0 }}</p>
              </div>
              <div class="rounded-[22px] border border-[#e6eef7] bg-[#fbfdff] p-4">
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Pending</p>
                <p class="mt-2 text-lg font-bold text-[#a64a1f]">{{ stats.pendingRequests ?? 0 }}</p>
              </div>
            </div>
          </section>

       
          <!-- Recent Receipts -->
          <section class="workspace-panel overflow-hidden rounded-[28px] border border-[#dce7f3] bg-white shadow-[0_16px_34px_rgba(18,58,99,0.08)]">
            <div class="workspace-panel__header flex items-center justify-between gap-4 border-b border-[#e6eef7] px-5 py-4">
              <div>
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Submissions</p>
                <h2 class="mt-1 text-base font-bold text-[#183b63]">Recent Receipts</h2>
              </div>
              <router-link to="/my-receipts" class="rounded-xl bg-[#edf4ff] px-3 py-1.5 text-xs font-semibold text-[#1f5aa6] transition hover:bg-[#ddeeff]">
                View all
              </router-link>
            </div>
            <div class="px-5 py-4">
              <div v-if="loading" class="space-y-3">
                <div v-for="i in 3" :key="i" class="animate-pulse rounded-2xl border border-[#e3edf7] p-3">
                  <div class="h-4 w-2/3 rounded bg-[#dfeaf6]"></div>
                </div>
              </div>
              <div v-else-if="recentReceipts.length === 0" class="py-6 text-center">
                <p class="text-sm text-[#8aa0b7]">No receipts found.</p>
              </div>
              <div v-else class="space-y-2">
                <div v-for="r in recentReceipts" :key="r.id" class="flex items-center justify-between rounded-[18px] border border-[#e6eef7] bg-[#fbfdff] px-4 py-3">
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-[#183b63]">{{ r.description || 'Receipt #' + r.id }}</p>
                    <p class="mt-0.5 text-xs text-[#8aa0b7]">{{ formatDate(r.created_at) }}</p>
                  </div>
                  <span class="ml-3 shrink-0 text-sm font-bold text-[#183b63]">{{ formatCurrency(r.amount) }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { optimizedRequest } from '@/utils/api'
import { useToast } from 'vue-toastification'

const toast = useToast()
const loading = ref(true)

const stats = ref({
  totalBudget: 0,
  totalSpent: 0,
  totalPayments: 0,
  totalReceipts: 0,
  pendingRequests: 0,
})

const recentPayments = ref([])
const budgetAllocations = ref([])
const recentReceipts = ref([])

const today = computed(() => {
  return new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
})

const spentPercent = computed(() => {
  if (!stats.value.totalBudget) return 0
  return Math.min(100, Math.round((stats.value.totalSpent / stats.value.totalBudget) * 100))
})

const quickLinks = [
  { to: '/all-payments', label: 'All Payments', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { to: '/add-payment', label: 'Add Payment', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
  { to: '/my-receipts', label: 'My Receipts', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z' },
  { to: '/submit-receipt', label: 'Submit Receipt', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
  { to: '/acc-budgets', label: 'Budget Allocations', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { to: '/all-requests', label: 'Pending Requests', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
]

function formatCurrency(val) {
  if (!val && val !== 0) return '—'
  return 'TZS ' + Number(val).toLocaleString('en-TZ')
}

function formatDate(val) {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getAllocationColor(type) {
  const map = {
    Department: 'bg-[#edf4ff] text-[#1f5aa6]',
    Project: 'bg-[#f0f9f0] text-[#1a7a3c]',
    'Awarded Tender': 'bg-[#fdf4e7] text-[#a06b10]',
  }
  return map[type] || 'bg-[#f3f4f6] text-[#4b5563]'
}

async function loadDashboard() {
  loading.value = true
  try {
    const [overviewRes, paymentsRes, receiptsRes] = await Promise.allSettled([
      optimizedRequest('/api/budget/overview'),
      optimizedRequest('/api/payments'),
      optimizedRequest('/api/receipts'),
    ])

    if (overviewRes.status === 'fulfilled') {
      const d = overviewRes.value
      stats.value.totalBudget = d.total_allocated ?? d.total_budget ?? 0
      stats.value.totalSpent = d.total_spent ?? 0
      stats.value.pendingRequests = d.pending_requests ?? d.pending_approvals ?? 0
      budgetAllocations.value = (d.allocations ?? d.recent_allocations ?? []).slice(0, 6)
    }

    if (paymentsRes.status === 'fulfilled') {
      const data = paymentsRes.value
      const list = Array.isArray(data) ? data : (data.data ?? data.payments ?? [])
      recentPayments.value = list.slice(0, 8)
      stats.value.totalPayments = list.reduce((s, p) => s + Number(p.amount || 0), 0)
    }

    if (receiptsRes.status === 'fulfilled') {
      const data = receiptsRes.value
      const list = Array.isArray(data) ? data : (data.data ?? data.receipts ?? [])
      recentReceipts.value = list.slice(0, 5)
      stats.value.totalReceipts = list.length
    }
  } catch (err) {
    toast.error('Failed to load dashboard data')
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>

<style scoped>
.dashboard-shell {
  background:
    radial-gradient(circle at top right, rgba(48, 120, 221, 0.08), transparent 22%),
    radial-gradient(circle at bottom left, rgba(23, 66, 120, 0.06), transparent 28%),
    #edf4fb;
}

.analytics-card {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  box-shadow: 0 14px 28px rgba(18, 58, 99, 0.14);
}

.analytics-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 60%);
  pointer-events: none;
}

.analytics-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.18);
  flex-shrink: 0;
}

.analytics-card--budget  { background: linear-gradient(135deg, #164c93 0%, #2f78dd 100%); }
.analytics-card--payments { background: linear-gradient(135deg, #164c93 0%, #2f78dd 100%); }
.analytics-card--receipts { background: linear-gradient(135deg, #164c93 0%, #2f78dd 100%); }
.analytics-card--pending  { background: linear-gradient(135deg, #164c93 0%, #2f78dd 100%); }

.workspace-panel__header {
  background: linear-gradient(135deg, #f8fbff 0%, #ffffff 100%);
}

.panel-scroll::-webkit-scrollbar { width: 4px; }
.panel-scroll::-webkit-scrollbar-track { background: transparent; }
.panel-scroll::-webkit-scrollbar-thumb { background: rgba(30, 77, 142, 0.18); border-radius: 9999px; }
</style>
