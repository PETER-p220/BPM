<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Smart Shelves</h1>
      <p class="text-gray-600">Intelligent inventory management and stock monitoring system</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <span class="ml-3 text-gray-600">Loading Smart Shelves data...</span>
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
          <button @click="fetchSmartShelvesData" class="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Retry
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Inventory Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Total Items</p>
              <p class="text-2xl font-bold text-gray-900">{{ shelvesData.total_items || 0 }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">In Stock</p>
              <p class="text-2xl font-bold text-gray-900">{{ shelvesData.in_stock || 0 }}</p>
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
              <p class="text-sm text-gray-600 mb-1">Low Stock</p>
              <p class="text-2xl font-bold text-gray-900">{{ shelvesData.low_stock || 0 }}</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-full">
              <svg class="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Out of Stock</p>
              <p class="text-2xl font-bold text-gray-900">{{ shelvesData.out_of_stock || 0 }}</p>
            </div>
            <div class="p-3 bg-red-100 rounded-full">
              <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Warehouse Status -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Warehouse Map -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Warehouse Overview</h2>
          <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div class="text-center">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <p class="text-gray-600">Warehouse layout visualization</p>
              <p class="text-sm text-gray-500 mt-2">Smart shelves monitoring</p>
            </div>
          </div>
        </div>

        <!-- Stock Alerts -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Stock Alerts</h2>
          <div class="space-y-3">
            <div v-for="alert in stockAlerts" :key="alert.id" class="flex items-center p-3 rounded-lg" :class="getAlertClass(alert.severity)">
              <div class="flex-shrink-0">
                <svg class="w-5 h-5" :class="getAlertIconColor(alert.severity)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm font-medium">{{ alert.item }}</p>
                <p class="text-xs opacity-75">{{ alert.message }}</p>
              </div>
              <div class="flex-shrink-0">
                <span class="text-xs font-semibold">{{ alert.quantity }} left</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Inventory Table -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Inventory Status</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Level</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in inventoryItems" :key="item.sku">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ item.sku }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.category }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.current_stock }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.min_level }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStockStatusClass(item.status)">
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatTime(item.last_updated) }}
                </td>
              </tr>
            </tbody>
          </table>
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
const shelvesData = ref({})
const stockAlerts = ref([])
const inventoryItems = ref([])

const fetchSmartShelvesData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Simulate Smart Shelves data - replace with actual API call when available
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    shelvesData.value = {
      total_items: 1250,
      in_stock: 980,
      low_stock: 180,
      out_of_stock: 90
    }
    
    // Sample stock alerts
    stockAlerts.value = [
      { id: 1, item: 'Office Paper A4', message: 'Running low on stock', quantity: 15, severity: 'high' },
      { id: 2, item: 'Printer Ink Cartridges', message: 'Below minimum level', quantity: 8, severity: 'medium' },
      { id: 3, item: 'Desk Lamps', message: 'Critical stock level', quantity: 2, severity: 'high' },
      { id: 4, item: 'Filing Cabinets', message: 'Low stock alert', quantity: 12, severity: 'low' }
    ]
    
    // Sample inventory items
    inventoryItems.value = [
      { sku: 'OFF-001', name: 'Office Paper A4', category: 'Stationery', current_stock: 15, min_level: 50, status: 'Low Stock', last_updated: new Date() },
      { sku: 'OFF-002', name: 'Printer Ink', category: 'Supplies', current_stock: 8, min_level: 20, status: 'Low Stock', last_updated: new Date(Date.now() - 300000) },
      { sku: 'FUR-001', name: 'Desk Lamp', category: 'Furniture', current_stock: 2, min_level: 10, status: 'Critical', last_updated: new Date(Date.now() - 600000) },
      { sku: 'FUR-002', name: 'Filing Cabinet', category: 'Furniture', current_stock: 12, min_level: 15, status: 'Low Stock', last_updated: new Date(Date.now() - 120000) },
      { sku: 'ELEC-001', name: 'USB Cable', category: 'Electronics', current_stock: 45, min_level: 30, status: 'In Stock', last_updated: new Date() }
    ]
    
  } catch (err) {
    console.error('Error fetching Smart Shelves data:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to load Smart Shelves data'
  } finally {
    loading.value = false
  }
}

const getAlertClass = (severity) => {
  switch (severity) {
    case 'high':
      return 'bg-red-50 text-red-800'
    case 'medium':
      return 'bg-yellow-50 text-yellow-800'
    case 'low':
      return 'bg-blue-50 text-blue-800'
    default:
      return 'bg-gray-50 text-gray-800'
  }
}

const getAlertIconColor = (severity) => {
  switch (severity) {
    case 'high':
      return 'text-red-600'
    case 'medium':
      return 'text-yellow-600'
    case 'low':
      return 'text-blue-600'
    default:
      return 'text-gray-600'
  }
}

const getStockStatusClass = (status) => {
  const baseClass = 'px-2 py-1 text-xs rounded-full'
  switch (status) {
    case 'In Stock':
      return `${baseClass} bg-green-100 text-green-800`
    case 'Low Stock':
      return `${baseClass} bg-yellow-100 text-yellow-800`
    case 'Critical':
      return `${baseClass} bg-red-100 text-red-800`
    default:
      return `${baseClass} bg-gray-100 text-gray-800`
  }
}

const formatTime = (date) => {
  if (!date) return 'N/A'
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

onMounted(() => {
  fetchSmartShelvesData()
  
  // Auto-refresh every 3 minutes
  const interval = setInterval(fetchSmartShelvesData, 3 * 60 * 1000)
  
  // Cleanup on unmount
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
