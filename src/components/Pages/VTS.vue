<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Vehicle Tracking System (VTS)</h1>
      <p class="text-gray-600">Real-time vehicle monitoring and fleet management overview</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <span class="ml-3 text-gray-600">Loading VTS data...</span>
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
          <button @click="fetchVTSData" class="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Retry
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Fleet Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Total Vehicles</p>
              <p class="text-2xl font-bold text-gray-900">{{ vtsData.total_vehicles || 0 }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Active</p>
              <p class="text-2xl font-bold text-gray-900">{{ vtsData.active_vehicles || 0 }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Idle</p>
              <p class="text-2xl font-bold text-gray-900">{{ vtsData.idle_vehicles || 0 }}</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-full">
              <svg class="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Maintenance</p>
              <p class="text-2xl font-bold text-gray-900">{{ vtsData.maintenance_vehicles || 0 }}</p>
            </div>
            <div class="p-3 bg-red-100 rounded-full">
              <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Maps and Tracking -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Live Map -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Live Vehicle Tracking</h2>
          <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div class="text-center">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
              </svg>
              <p class="text-gray-600">Interactive map view</p>
              <p class="text-sm text-gray-500 mt-2">Real-time vehicle positions</p>
            </div>
          </div>
        </div>

        <!-- Route Statistics -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Route Statistics</h2>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Total Distance Today</span>
              <span class="font-semibold">{{ vtsData.total_distance || 0 }} km</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Average Speed</span>
              <span class="font-semibold">{{ vtsData.average_speed || 0 }} km/h</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Fuel Consumption</span>
              <span class="font-semibold">{{ vtsData.fuel_consumption || 0 }} L</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Active Routes</span>
              <span class="font-semibold">{{ vtsData.active_routes || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Vehicle Status Table -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Vehicle Activity</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Update</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="vehicle in recentVehicles" :key="vehicle.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ vehicle.plate_number || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(vehicle.status)">
                    {{ vehicle.status || 'Unknown' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ vehicle.location || 'Unknown' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ vehicle.speed || 0 }} km/h
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatTime(vehicle.last_update) }}
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
import { ref, onMounted, computed } from 'vue'
import axios from '@/axios'

const loading = ref(true)
const error = ref(null)
const vtsData = ref({})
const recentVehicles = ref([])

const fetchVTSData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Simulate VTS data - replace with actual API call when available
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    vtsData.value = {
      total_vehicles: 45,
      active_vehicles: 32,
      idle_vehicles: 8,
      maintenance_vehicles: 5,
      total_distance: 1250,
      average_speed: 45,
      fuel_consumption: 320,
      active_routes: 12
    }
    
    // Sample recent vehicle data
    recentVehicles.value = [
      { id: 1, plate_number: 'TZA 1234', status: 'Active', location: 'Dar es Salaam', speed: 65, last_update: new Date() },
      { id: 2, plate_number: 'TZA 5678', status: 'Idle', location: 'Arusha', speed: 0, last_update: new Date(Date.now() - 300000) },
      { id: 3, plate_number: 'TZA 9012', status: 'Maintenance', location: 'Workshop', speed: 0, last_update: new Date(Date.now() - 600000) },
      { id: 4, plate_number: 'TZA 3456', status: 'Active', location: 'Mwanza', speed: 55, last_update: new Date(Date.now() - 120000) },
      { id: 5, plate_number: 'TZA 7890', status: 'Active', location: 'Dodoma', speed: 70, last_update: new Date() }
    ]
    
  } catch (err) {
    console.error('Error fetching VTS data:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to load VTS data'
  } finally {
    loading.value = false
  }
}

const getStatusClass = (status) => {
  const baseClass = 'px-2 py-1 text-xs rounded-full'
  switch (status?.toLowerCase()) {
    case 'active':
      return `${baseClass} bg-green-100 text-green-800`
    case 'idle':
      return `${baseClass} bg-yellow-100 text-yellow-800`
    case 'maintenance':
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
  fetchVTSData()
  
  // Auto-refresh every 2 minutes
  const interval = setInterval(fetchVTSData, 2 * 60 * 1000)
  
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
