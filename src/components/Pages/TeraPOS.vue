<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Tera POS System</h1>
      <p class="text-gray-600">Point of Sale and payment processing overview from Terapay</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <span class="ml-3 text-gray-600">Loading POS data...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 class="text-red-800 font-medium">Error Loading Data</h3>
          <p class="text-red-600 text-sm">{{ error }}</p>
          <button @click="fetchPOSData" class="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Retry
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Total Shops</p>
              <p class="text-2xl font-bold text-gray-900">{{ posData.shops?.total || 0 }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Active Subscriptions</p>
              <p class="text-2xl font-bold text-gray-900">{{ posData.subscriptions?.active_total || 0 }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">This Month Shops</p>
              <p class="text-2xl font-bold text-gray-900">{{ posData.shops?.this_month || 0 }}</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-full">
              <svg class="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(posData.revenue?.total) }}</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Shop & Subscription Overview -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Shop & Subscription Overview</h2>
          <div class="h-64 flex items-center justify-center">
            <div class="text-center">
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="text-center">
                  <div class="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {{ posData.shops?.this_week || 0 }}
                  </div>
                  <p class="text-sm text-gray-600 mt-2">This Week Shops</p>
                </div>
                <div class="text-center">
                  <div class="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    {{ posData.subscriptions?.this_week || 0 }}
                  </div>
                  <p class="text-sm text-gray-600 mt-2">This Week Subscriptions</p>
                </div>
                <div class="text-center">
                  <div class="w-16 h-16 mx-auto bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                    {{ posData.shops?.this_month || 0 }}
                  </div>
                  <p class="text-sm text-gray-600 mt-2">This Month Shops</p>
                </div>
                <div class="text-center">
                  <div class="w-16 h-16 mx-auto bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {{ posData.subscriptions?.active_total || 0 }}
                  </div>
                  <p class="text-sm text-gray-600 mt-2">Active Subscriptions</p>
                </div>
              </div>
              <p class="text-sm text-gray-500">Shop and subscription metrics</p>
            </div>
          </div>
        </div>

        <!-- Revenue Overview -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h2>
          <div class="space-y-4">
            <div class="flex justify-between items-center py-2 border-b">
              <span class="text-gray-600">Total Revenue</span>
              <span class="font-bold text-green-600">{{ formatCurrency(posData.revenue?.total) }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b">
              <span class="text-gray-600">This Week</span>
              <span class="font-semibold text-blue-600">{{ formatCurrency(posData.revenue?.this_week) }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b">
              <span class="text-gray-600">This Month</span>
              <span class="font-semibold text-purple-600">{{ formatCurrency(posData.revenue?.this_month) }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b">
              <span class="text-gray-600">Last Month</span>
              <span class="font-semibold text-orange-600">{{ formatCurrency(posData.revenue?.last_month) }}</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-gray-600">Currency</span>
              <span class="font-semibold text-gray-900">{{ posData.currency || 'TZS' }} - Tanzanian Shilling</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Shops Table -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Shops</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="posData.shops?.recent?.length === 0">
                <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">
                  No recent shops found
                </td>
              </tr>
              <tr v-else v-for="shop in posData.shops?.recent?.slice(0, 5)" :key="shop.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ shop.name || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(shop.created_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Subscription Overview -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Subscription Overview</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <p class="text-3xl font-bold text-green-600 mb-2">{{ posData.subscriptions?.active_total || 0 }}</p>
            <p class="text-gray-600">Active Subscriptions</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <p class="text-3xl font-bold text-blue-600 mb-2">{{ posData.subscriptions?.this_month || 0 }}</p>
            <p class="text-gray-600">This Month</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <p class="text-3xl font-bold text-red-600 mb-2">{{ posData.subscriptions?.pending_overdue || 0 }}</p>
            <p class="text-gray-600">Pending Overdue</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'

const loading = ref(true)
const error = ref(null)
const posData = ref({})
const lastUpdated = ref('')
const responseTime = ref(0)

const getPercentage = (value) => {
  const total = posData.value.shops?.total || 1
  return Math.round((value || 0) / total * 100)
}

const formatCurrency = (amount) => {
  if (!amount) return 'TZS 0'
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-TZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTransactionStatusClass = (status) => {
  const baseClass = 'px-2 py-1 text-xs rounded-full'
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'success':
      return `${baseClass} bg-green-100 text-green-800`
    case 'pending':
      return `${baseClass} bg-yellow-100 text-yellow-800`
    case 'failed':
    case 'error':
      return `${baseClass} bg-red-100 text-red-800`
    case 'cancelled':
      return `${baseClass} bg-gray-100 text-gray-800`
    default:
      return `${baseClass} bg-gray-100 text-gray-800`
  }
}

const fetchPOSData = async () => {
  loading.value = true
  error.value = null

  try {
    const res = await axios.get('api/tera-pos/overview')

    if (res.data.success) {
      console.log('Raw POS API Response:', res.data)
      console.log('POS Data:', res.data.data)
      
      posData.value = res.data.data || {}
      responseTime.value = res.data.response_time || 0
      lastUpdated.value = res.data.last_updated 
        ? new Date(res.data.last_updated).toLocaleString()
        : new Date().toLocaleString()
    } else {
      console.log('POS API Error Response:', res.data)
      throw new Error(res.data.message || 'Unknown error')
    }
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.message || err.message || 'Failed to load POS data'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPOSData()

  // Auto refresh every 3 minutes
  const interval = setInterval(fetchPOSData, 3 * 60 * 1000)
  return () => clearInterval(interval)
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
