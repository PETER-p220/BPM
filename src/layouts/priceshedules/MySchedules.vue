<template>
  <div class="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Quotations</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage and view all your quotations
        </p>
      </div>

      <router-link to="/submit-shedule">
        <button
          class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2 shadow-md"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Quotation
        </button>
      </router-link>
    </div>

    <!-- Search & Filter -->
    <div class="bg-white dark:bg-gray-900 shadow-sm rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <div class="relative flex-1">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            v-model="filter"
            placeholder="Search by tender title..."
            class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white dark:bg-gray-900 shadow-sm rounded-xl p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-indigo-600 border-gray-200 dark:border-gray-700"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading quotations...</p>
    </div>

    <!-- Quotations List -->
    <div v-else-if="filteredTenders.length > 0" class="space-y-6">
      <div
        v-for="tender in filteredTenders"
        :key="tender.tender_id"
        class="bg-white dark:bg-gray-900 shadow-sm rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
      >
        <!-- Card Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <svg class="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ tender.tender.title }}
            </h3>

            <div class="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ tender.user?.name || 'N/A' }}
              </span>
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDate(tender.created_at) }}
              </span>
            </div>
          </div>

          <span
            :class="[
              'inline-flex px-4 py-1.5 rounded-full text-sm font-medium',
              tender.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' :
              tender.status === 'passed' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
              'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
            ]"
          >
            <svg class="w-4 h-4 mr-1.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="statusIcon(tender.status)" />
            </svg>
            {{ tender.status }}
          </span>
        </div>

        <!-- Rejection Reason -->
        <div
          v-if="tender.status === 'rejected' && tender.reason_for_reject"
          class="px-6 py-4 bg-red-50 dark:bg-red-950/30 border-t border-red-100 dark:border-red-900/30 flex items-start gap-3"
        >
          <svg class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p class="font-medium text-red-800 dark:text-red-300">Rejection Reason:</p>
            <p class="text-red-700 dark:text-red-200 mt-1">{{ tender.reason_for_reject }}</p>
          </div>
        </div>

        <!-- Financial Summary -->
        <div class="px-6 py-6 border-t border-gray-200 dark:border-gray-800">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Financial Summary
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Amount (VAT Excl)</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {{ formatCurrency(tender.total_amount_vat_excl) }}
              </p>
            </div>

            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Amount (VAT Incl)</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {{ formatCurrency(tender.total_amount_vat_incl) }}
              </p>
            </div>

            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p class="text-sm text-gray-500 dark:text-gray-400">Amount Needed</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {{ formatCurrency(tender.total_amount_needed) }}
              </p>
            </div>

            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p class="text-sm text-gray-500 dark:text-gray-400">Site Contingency</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {{ formatCurrency(tender.site_contingency) }}
              </p>
            </div>

            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Investment</p>
              <p class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {{ formatCurrency(tender.total_investment) }}
              </p>
            </div>

            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p class="text-sm text-gray-500 dark:text-gray-400">Projected Profit</p>
              <p class="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
                {{ formatCurrency(tender.projected_profit) }}
                <span class="text-sm ml-2">({{ tender.projected_profit_percentage }}%)</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Schedule Items -->
        <div class="px-6 py-6 border-t border-gray-200 dark:border-gray-800">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Schedule Items
          </h4>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th colspan="6" class="px-6 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-950/30">
                    QUOTED PRICES (VAT EXCL)
                  </th>
                  <th colspan="5" class="px-6 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-950/30">
                    BUYING PRICES (VAT INCL)
                  </th>
                </tr>
                <tr class="bg-gray-100 dark:bg-gray-800">
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">S/N</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Description</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Q. Qty</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Unit</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">Q. Rate</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">Q. Amount</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Qty</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">Rate</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Source</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Urgent</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="item in tender.items" :key="item.price_schedule_id">
                  <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ item.serial_number || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate" :title="item.item_description">
                    {{ item.item_description || 'N/A' }}
                  </td>
                  <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{{ item.quoted_quantity || '—' }}</td>
                  <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{{ item.quoted_unit || '—' }}</td>
                  <td class="px-4 py-3 text-right text-sm text-gray-700 dark:text-gray-300">{{ formatCurrency(item.quoted_rate) }}</td>
                  <td class="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(item.quoted_amount) }}</td>
                  <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{{ item.quantity || '—' }}</td>
                  <td class="px-4 py-3 text-right text-sm text-gray-700 dark:text-gray-300">{{ formatCurrency(item.rate) }}</td>
                  <td class="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(item.amount) }}</td>
                  <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ item.source || 'N/A' }}</td>
                  <td class="px-4 py-3 text-center">
                    <span
                      v-if="item.urgent_status"
                      :class="[
                        'inline-flex px-2.5 py-1 text-xs font-medium rounded-full',
                        item.urgent_status.toLowerCase() === 'yes'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                      ]"
                    >
                      {{ item.urgent_status }}
                    </span>
                    <span v-else class="text-gray-500 dark:text-gray-400 text-xs">N/A</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white dark:bg-gray-900 shadow-sm rounded-xl p-12 text-center">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
        No quotations found
      </h3>
      <p class="text-gray-500 dark:text-gray-400">
        Create a new quotation to get started
      </p>
    </div>

    <!-- Pagination -->
    <div v-if="filteredTenders.length > 0" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ filteredTenders.length }} of {{ schedules.length }} quotations
      </p>

      <div class="flex items-center gap-2">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
        >
          Previous
        </button>

        <span class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Page {{ currentPage }}
        </span>

        <button
          :disabled="currentPage >= totalPages"
          @click="changePage(currentPage + 1)"
          class="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'

const toast = useToast()

const schedules = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const isLoading = ref(false)

onMounted(async () => {
  await fetchSchedules()
})

async function fetchSchedules() {
  isLoading.value = true
  try {
    const response = await axios.get('/api/user-schedule')
    if (response.data.status === 200 && Array.isArray(response.data.data)) {
      const grouped = groupByTender(response.data.data)
      schedules.value = grouped
    } else {
      throw new Error('Invalid API response format')
    }
  } catch (error) {
    toast.error(error.message || 'Failed to load quotations')
  } finally {
    isLoading.value = false
  }
}

function groupByTender(data) {
  const grouped = {}
  data.forEach(item => {
    const tenderId = item.tender_id
    if (!grouped[tenderId]) {
      grouped[tenderId] = {
        tender_id: tenderId,
        tender: item.tender,
        user: item.user,
        created_at: item.created_at,
        status: item.status,
        reason_for_reject: item.reason_for_reject,
        total_amount_vat_excl: item.total_amount_vat_excl,
        total_amount_vat_incl: item.total_amount_vat_incl,
        total_amount_needed: item.total_amount_needed,
        site_contingency: item.site_contingency,
        total_investment: item.total_investment,
        projected_profit: item.projected_profit,
        projected_profit_percentage: item.projected_profit_percentage,
        items: []
      }
    }

    // Add schedule item
    if (item.item_description || item.serial_number) {
      grouped[tenderId].items.push(item)
    }
  })

  return Object.values(grouped)
}

const allTenders = computed(() =>
  schedules.value.filter(tender =>
    tender.tender?.title?.toLowerCase().includes(filter.value.toLowerCase()) || !filter.value
  )
)

const filteredTenders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return allTenders.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(allTenders.value.length / itemsPerPage))

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

function formatCurrency(value) {
  if (!value) return 'N/A'
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 2
  }).format(value)
}

function statusIcon(status) {
  const icons = {
    pending: 'fas fa-clock',
    passed: 'fas fa-check-circle',
    rejected: 'fas fa-times-circle'
  }
  return icons[status] || 'fas fa-circle'
}

function changePage(page) {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>