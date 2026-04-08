<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Tera Events Dashboard</h1>
      <p class="text-gray-600">Overview of events and revenue metrics from Tera Invites system</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <span class="ml-3 text-gray-600">Loading invitation data...</span>
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
          <button @click="fetchInvitesData" class="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
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
              <p class="text-sm text-gray-600 mb-1">Total Invitations</p>
              <p class="text-2xl font-bold text-gray-900">{{ invitesData.total_invitations || 0 }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Accepted</p>
              <p class="text-2xl font-bold text-gray-900">{{ invitesData.accepted_invitations || 0 }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">This Month</p>
              <p class="text-2xl font-bold text-gray-900">{{ invitesData.events?.this_month || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(invitesData.revenue?.total) }}</p>
            </div>
            <div class="p-3 bg-red-100 rounded-full">
              <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Event Timeline Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Event Timeline Distribution</h2>
          <div class="h-64 flex items-center justify-center">
            <div class="text-center">
              <div class="grid grid-cols-3 gap-4 mb-4">
                <div class="text-center">
                  <div class="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    {{ invitesData.events?.this_week || 0 }}
                  </div>
                  <p class="text-sm text-gray-600 mt-2">This Week</p>
                </div>
                <div class="text-center">
                  <div class="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {{ invitesData.events?.this_month || 0 }}
                  </div>
                  <p class="text-sm text-gray-600 mt-2">This Month</p>
                </div>
                <div class="text-center">
                  <div class="w-16 h-16 mx-auto bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {{ invitesData.events?.last_month || 0 }}
                  </div>
                  <p class="text-sm text-gray-600 mt-2">Last Month</p>
                </div>
              </div>
              <p class="text-sm text-gray-500">Event distribution across time periods</p>
            </div>
          </div>
        </div>

        <!-- Revenue Overview -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h2>
          <div class="space-y-4">
            <div class="flex justify-between items-center py-2 border-b">
              <span class="text-gray-600">Total Revenue</span>
              <span class="font-bold text-green-600">{{ formatCurrency(invitesData.revenue?.total) }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b">
              <span class="text-gray-600">This Month</span>
              <span class="font-semibold text-blue-600">{{ formatCurrency(invitesData.revenue?.this_month) }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b">
              <span class="text-gray-600">Last Month</span>
              <span class="font-semibold text-purple-600">{{ formatCurrency(invitesData.revenue?.last_month) }}</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-gray-600">Currency</span>
              <span class="font-semibold text-gray-900">{{ invitesData.revenue?.currency || 'TZS' }} - Tanzanian Shilling</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Events Table -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Events</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="event in invitesData.events?.recent?.slice(0, 5)" :key="event.event_id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ event.event_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(event.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ event.location }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getPaymentStatusClass(event.payment_status)">
                    {{ event.payment_status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Additional Stats -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Detailed Statistics</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <p class="text-3xl font-bold text-indigo-600 mb-2">{{ invitesData.revenue?.currency || 'TZS' }}</p>
            <p class="text-gray-600">Currency</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <p class="text-3xl font-bold text-purple-600 mb-2">{{ formatCurrency(invitesData.revenue?.this_month) }}</p>
            <p class="text-gray-600">This Month Revenue</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <p class="text-3xl font-bold text-orange-600 mb-2">{{ invitesData.events?.recent?.length || 0 }}</p>
            <p class="text-gray-600">Recent Events</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'   // or use Laravel's global axios if you have it set up

const loading = ref(true)
const error = ref(null)
const invitesData = ref({})
const lastUpdated = ref('')
const responseTime = ref(0)

const getPercentage = (value) => {
  const total = invitesData.value.events?.total || 1
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
    day: 'numeric'
  })
}

const getPaymentStatusClass = (status) => {
  const baseClass = 'px-2 py-1 text-xs rounded-full'
  switch (status?.toLowerCase()) {
    case 'paid':
      return `${baseClass} bg-green-100 text-green-800`
    case 'pending':
      return `${baseClass} bg-yellow-100 text-yellow-800`
    case 'draft':
      return `${baseClass} bg-gray-100 text-gray-800`
    case 'partial':
      return `${baseClass} bg-blue-100 text-blue-800`
    default:
      return `${baseClass} bg-gray-100 text-gray-800`
  }
}

// New fetch function - calls YOUR Laravel endpoint
const fetchInvitesData = async () => {
  loading.value = true
  error.value = null

  try {
    const res = await axios.get('api/tera-invites/overview')   // or '/api/tera-invites/overview'

    if (res.data.success) {
      invitesData.value = res.data.data || {}
      responseTime.value = res.data.response_time || 0
      lastUpdated.value = res.data.last_updated 
        ? new Date(res.data.last_updated).toLocaleString()
        : new Date().toLocaleString()
    } else {
      throw new Error(res.data.message || 'Unknown error')
    }
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.message || err.message || 'Failed to load data'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchInvitesData()

  // Auto refresh every 5 minutes
  const interval = setInterval(fetchInvitesData, 5 * 60 * 1000)
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
