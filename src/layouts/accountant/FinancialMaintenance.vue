<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 font-['DM_Sans',sans-serif]">
    <!-- Top Navigation -->
    <div class="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900 dark:text-white">Financial Maintenance</h1>
              <p class="text-sm text-slate-500 dark:text-slate-400">System maintenance and configuration</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <button @click="runMaintenance" :disabled="maintenanceRunning" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 text-white text-sm font-medium rounded-lg transition-colors">
              <span v-if="maintenanceRunning">Running...</span>
              <span v-else>Run Maintenance</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- System Status -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">System Health</p>
              <p class="text-2xl font-bold" :class="systemHealth.status === 'healthy' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ systemHealth.status }}
              </p>
            </div>
            <div class="w-12 h-12 rounded-lg flex items-center justify-center" :class="systemHealth.status === 'healthy' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'">
              <svg class="w-6 h-6" :class="systemHealth.status === 'healthy' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="systemHealth.status === 'healthy'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Last check: {{ formatDateTime(systemHealth.lastCheck) }}
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Data Integrity</p>
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ dataIntegrity.score }}%</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 text-xs text-slate-500 dark:text-slate-400">
            {{ dataIntegrity.issues }} issues found
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Last Backup</p>
              <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ lastBackup.status }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
          </div>
          <div class="mt-4 text-xs text-slate-500 dark:text-slate-400">
            {{ formatDateTime(lastBackup.timestamp) }}
          </div>
        </div>
      </div>

      <!-- Maintenance Tasks -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Automated Tasks -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Automated Tasks</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Scheduled maintenance tasks</p>
          </div>
          
          <div class="p-6 space-y-4">
            <div v-for="task in automatedTasks" :key="task.id" class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="getTaskColor(task.status)">
                  <svg class="w-5 h-5" :class="getTaskTextColor(task.status)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-slate-900 dark:text-white">{{ task.name }}</h3>
                  <p class="text-sm text-slate-500 dark:text-slate-400">{{ task.description }}</p>
                  <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Next run: {{ formatDateTime(task.nextRun) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button @click="toggleTask(task)" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors" :class="task.enabled ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-600'">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="task.enabled ? 'translate-x-6' : 'translate-x-1'" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Manual Tasks -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Manual Tasks</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">On-demand maintenance operations</p>
          </div>
          
          <div class="p-6 space-y-4">
            <div v-for="task in manualTasks" :key="task.id" class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                  <svg class="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-slate-900 dark:text-white">{{ task.name }}</h3>
                  <p class="text-sm text-slate-500 dark:text-slate-400">{{ task.description }}</p>
                  <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Last run: {{ task.lastRun ? formatDateTime(task.lastRun) : 'Never' }}</p>
                </div>
              </div>
              <button @click="runManualTask(task)" :disabled="task.running" class="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 text-white text-sm font-medium rounded-lg transition-colors">
                <span v-if="task.running">Running...</span>
                <span v-else>Run</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- System Logs -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">System Logs</h2>
            <div class="flex items-center gap-2">
              <select v-model="logLevel" @change="loadLogs" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="">All Levels</option>
                <option value="error">Error</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
              </select>
              <button @click="clearLogs" class="px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 text-sm font-medium rounded-lg transition-colors">
                Clear Logs
              </button>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto max-h-96">
          <div class="p-4 space-y-2">
            <div v-if="logs.length === 0" class="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
              No logs available
            </div>
            <div v-for="log in logs" :key="log.id" class="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
              <div class="w-2 h-2 rounded-full mt-2 flex-shrink-0" :class="getLogLevelColor(log.level)"></div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ formatDateTime(log.timestamp) }}</span>
                  <span class="text-xs px-2 py-1 rounded-full font-medium" :class="getLogLevelBadgeColor(log.level)">{{ log.level.toUpperCase() }}</span>
                </div>
                <p class="text-sm text-slate-900 dark:text-white break-words">{{ log.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axios from '@/axios'

const toast = useToast()

// State
const maintenanceRunning = ref(false)
const logLevel = ref('')
const logs = ref([])

const systemHealth = ref({
  status: 'healthy',
  lastCheck: new Date()
})

const dataIntegrity = ref({
  score: 98,
  issues: 2
})

const lastBackup = ref({
  status: 'Completed',
  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
})

const automatedTasks = ref([
  {
    id: 1,
    name: 'Data Backup',
    description: 'Automatic daily backup of financial data',
    status: 'active',
    enabled: true,
    nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  {
    id: 2,
    name: 'Data Validation',
    description: 'Validate data integrity and consistency',
    status: 'active',
    enabled: true,
    nextRun: new Date(Date.now() + 6 * 60 * 60 * 1000)
  },
  {
    id: 3,
    name: 'Log Cleanup',
    description: 'Clean up old system logs',
    status: 'inactive',
    enabled: false,
    nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
])

const manualTasks = ref([
  {
    id: 1,
    name: 'Database Optimization',
    description: 'Optimize database performance',
    lastRun: null,
    running: false
  },
  {
    id: 2,
    name: 'Cache Clear',
    description: 'Clear system cache',
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
    running: false
  },
  {
    id: 3,
    name: 'Rebuild Indexes',
    description: 'Rebuild database indexes',
    lastRun: null,
    running: false
  }
])

// Methods
const runMaintenance = async () => {
  maintenanceRunning.value = true
  
  try {
    const response = await axios.post('api/financial/maintenance/run')
    
    if (response.data.status === 'success') {
      toast.success('Maintenance completed successfully')
      loadSystemStatus()
      loadLogs()
    } else {
      toast.error(response.data.message || 'Maintenance failed')
    }
  } catch (error) {
    console.error('Error running maintenance:', error)
    toast.error('Failed to run maintenance')
  } finally {
    maintenanceRunning.value = false
  }
}

const toggleTask = async (task) => {
  try {
    task.enabled = !task.enabled
    const response = await axios.put(`api/financial/maintenance/tasks/${task.id}`, {
      enabled: task.enabled
    })
    
    if (response.data.status === 'success') {
      toast.success(`Task ${task.enabled ? 'enabled' : 'disabled'} successfully`)
    } else {
      task.enabled = !task.enabled // Revert on failure
      toast.error(response.data.message || 'Failed to update task')
    }
  } catch (error) {
    task.enabled = !task.enabled // Revert on failure
    console.error('Error toggling task:', error)
    toast.error('Failed to update task')
  }
}

const runManualTask = async (task) => {
  task.running = true
  
  try {
    const response = await axios.post(`api/financial/maintenance/tasks/${task.id}/run`)
    
    if (response.data.status === 'success') {
      toast.success(`${task.name} completed successfully`)
      task.lastRun = new Date()
      loadLogs()
    } else {
      toast.error(response.data.message || `${task.name} failed`)
    }
  } catch (error) {
    console.error('Error running manual task:', error)
    toast.error(`Failed to run ${task.name}`)
  } finally {
    task.running = false
  }
}

const loadSystemStatus = async () => {
  try {
    const response = await axios.get('api/financial/maintenance/status')
    const data = response.data.data
    
    systemHealth.value = data.systemHealth || systemHealth.value
    dataIntegrity.value = data.dataIntegrity || dataIntegrity.value
    lastBackup.value = data.lastBackup || lastBackup.value
  } catch (error) {
    console.error('Error loading system status:', error)
  }
}

const loadLogs = async () => {
  try {
    const params = logLevel.value ? `?level=${logLevel.value}` : ''
    const response = await axios.get(`api/financial/maintenance/logs${params}`)
    logs.value = response.data.data || []
  } catch (error) {
    console.error('Error loading logs:', error)
    logs.value = []
  }
}

const clearLogs = async () => {
  if (!confirm('Are you sure you want to clear all logs?')) return
  
  try {
    const response = await axios.delete('api/financial/maintenance/logs')
    
    if (response.data.status === 'success') {
      toast.success('Logs cleared successfully')
      logs.value = []
    } else {
      toast.error(response.data.message || 'Failed to clear logs')
    }
  } catch (error) {
    console.error('Error clearing logs:', error)
    toast.error('Failed to clear logs')
  }
}

const formatDateTime = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString()
}

const getTaskColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 dark:bg-green-900/30'
    case 'inactive':
      return 'bg-slate-100 dark:bg-slate-600'
    default:
      return 'bg-slate-100 dark:bg-slate-600'
  }
}

const getTaskTextColor = (status) => {
  switch (status) {
    case 'active':
      return 'text-green-600 dark:text-green-400'
    case 'inactive':
      return 'text-slate-600 dark:text-slate-400'
    default:
      return 'text-slate-600 dark:text-slate-400'
  }
}

const getLogLevelColor = (level) => {
  switch (level) {
    case 'error':
      return 'bg-red-500'
    case 'warning':
      return 'bg-amber-500'
    case 'info':
      return 'bg-blue-500'
    case 'debug':
      return 'bg-slate-500'
    default:
      return 'bg-slate-500'
  }
}

const getLogLevelBadgeColor = (level) => {
  switch (level) {
    case 'error':
      return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30'
    case 'warning':
      return 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30'
    case 'info':
      return 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30'
    case 'debug':
      return 'text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-700'
    default:
      return 'text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-700'
  }
}

// Lifecycle
onMounted(() => {
  loadSystemStatus()
  loadLogs()
})
</script>

<style scoped>
@import url('https://fonts.2?family=DM+Sans:wght@400;500;600;700&display=swap');
</style>
