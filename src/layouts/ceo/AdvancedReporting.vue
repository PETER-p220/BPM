<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 font-['DM_Sans',sans-serif]">
    <!-- ── Top Bar ─────────────────────────────────────────────── -->
    <div class="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900 dark:text-white">Advanced Reporting</h1>
              <p class="text-sm text-slate-500 dark:text-slate-400">Custom Reports & Analytics</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
              <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <select v-model="selectedReportType" class="bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none">
                <option value="all">All Reports</option>
                <option value="financial">Financial</option>
                <option value="performance">Performance</option>
                <option value="operational">Operational</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <button @click="openReportBuilder" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
              + Create Report
            </button>
            <button @click="showScheduleModal = true" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors">
              Schedule Reports
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p class="mt-4 text-slate-600 dark:text-slate-400">Loading reports…</p>
        </div>
      </div>

      <div v-else class="space-y-8">
        <!-- Quick + Scheduled grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Reports</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="template in reportTemplates" :key="template.id"
                   @click="useTemplate(template)"
                   class="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all cursor-pointer">
                <div class="flex items-start gap-3">
                  <div :class="template.iconBg" class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5" :class="template.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="template.icon" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-slate-900 dark:text-white">{{ template.name }}</h3>
                    <p class="text-sm text-slate-500 mt-1">{{ template.description }}</p>
                    <div class="flex items-center gap-2 mt-2 text-xs">
                      <span class="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">{{ template.type }}</span>
                      <span class="text-slate-400">{{ template.estimatedTime }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Scheduled Reports</h2>
            <div class="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <div class="space-y-3">
                <div v-for="item in scheduledReports" :key="item.id"
                     class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div>
                    <p class="text-sm font-medium text-slate-900 dark:text-white">{{ item.name }}</p>
                    <p class="text-xs text-slate-500">{{ item.schedule }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span :class="item.statusColor" class="text-xs px-2 py-1 rounded-full">
                      {{ item.status }}
                    </span>
                    <button @click="editScheduled(item)" class="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded">
                      <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <button @click="showScheduleModal = true" class="w-full mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
                + Schedule New Report
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Reports -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Recent Reports</h2>
            <div class="flex flex-col sm:flex-row gap-3">
              <input v-model="searchReports" type="text" placeholder="Search reports…" 
                     class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm w-full sm:w-64">
              <select v-model="filterByStatus" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm">
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full min-w-[900px]">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-700">
                  <th class="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Report</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Generated</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Format</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Size</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                <tr v-for="report in filteredRecentReports" :key="report.id">
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-3">
                      <div :class="report.iconBg" class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4" :class="report.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="report.icon" />
                        </svg>
                      </div>
                      <div>
                        <div class="font-medium text-slate-900 dark:text-white">{{ report.name }}</div>
                        <div class="text-xs text-slate-500">{{ report.description }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <span class="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">
                      {{ report.type }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{{ report.generatedAt }}</td>
                  <td class="py-3 px-4 text-sm uppercase text-slate-600 dark:text-slate-400">{{ report.format }}</td>
                  <td class="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{{ report.size }}</td>
                  <td class="py-3 px-4">
                    <span :class="report.statusColor" class="text-xs px-2 py-1 rounded-full">
                      {{ report.status }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-2">
                      <button @click="downloadReport(report)" :disabled="report.status !== 'completed'"
                              class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors">
                        <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                      <button @click="shareReport(report)" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 107.311 5.233l-6.632-3.316m0 0a3 3 0 00-5.367 2.684 3 3 0 005.367-2.684z" />
                        </svg>
                      </button>
                      <button @click="deleteReport(report)" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Builder Modal -->
    <div v-if="showReportBuilder" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <div class="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">Create New Report</h3>
          <button @click="closeReportBuilder" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <svg class="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-6">
          <!-- Configuration -->
          <section class="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-slate-50/40 dark:bg-slate-900/30">
            <h4 class="font-semibold mb-4 text-slate-900 dark:text-white">Basic Settings</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Report Name</label>
                <input v-model="reportBuilder.name" type="text" required placeholder="e.g. Monthly Performance Q1"
                       class="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Report Type</label>
                <select v-model="reportBuilder.type" class="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
                  <option value="financial">Financial</option>
                  <option value="performance">Performance</option>
                  <option value="operational">Operational</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Date Range</label>
                <select v-model="reportBuilder.dateRange" class="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Export Format</label>
                <select v-model="reportBuilder.format" class="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
                  <option value="pdf">PDF Document</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="csv">CSV File</option>
                </select>
              </div>
            </div>
          </section>

          <!-- Data Sources & Metrics (simplified for speed) -->
          <section class="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-slate-50/40 dark:bg-slate-900/30">
            <h4 class="font-semibold mb-4 text-slate-900 dark:text-white">What to include</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 class="text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Data Sources</h5>
                <div class="space-y-2 max-h-48 overflow-y-auto pr-2">
                  <label v-for="source in availableDataSources" :key="source.id" class="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-lg transition-colors">
                    <input type="checkbox" :value="source.id" v-model="reportBuilder.dataSources" class="rounded text-indigo-600">
                    <span class="text-sm text-slate-700 dark:text-slate-300">{{ source.name }}</span>
                  </label>
                </div>
              </div>
              <div>
                <h5 class="text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Key Metrics</h5>
                <div class="space-y-2 max-h-48 overflow-y-auto pr-2">
                  <label v-for="metric in availableMetrics" :key="metric.id" class="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-lg transition-colors">
                    <input type="checkbox" :value="metric.id" v-model="reportBuilder.metrics" class="rounded text-indigo-600">
                    <span class="text-sm text-slate-700 dark:text-slate-300">{{ metric.name }}</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          <!-- Visualizations -->
          <section class="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-slate-50/40 dark:bg-slate-900/30">
            <h4 class="font-semibold mb-4 text-slate-900 dark:text-white">Visualizations</h4>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <label v-for="viz in visualizationOptions" :key="viz.id"
                     class="flex flex-col items-center gap-2 p-3 border border-slate-200 dark:border-slate-600 rounded-xl cursor-pointer hover:border-indigo-500 transition-colors"
                     :class="{ 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30': reportBuilder.visualizations.includes(viz.id) }">
                <input type="checkbox" :value="viz.id" v-model="reportBuilder.visualizations" class="sr-only">
                <svg class="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="viz.icon" />
                </svg>
                <span class="text-sm font-medium">{{ viz.name }}</span>
              </label>
            </div>
          </section>

          <!-- Preview area -->
          <div v-if="showPreview && reportBuilder.visualizations.length" class="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-white dark:bg-slate-900">
            <h4 class="font-semibold mb-4 text-slate-900 dark:text-white">Preview</h4>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div v-for="viz in reportBuilder.visualizations" :key="viz" class="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <h5 class="text-sm font-medium mb-3 capitalize">{{ viz.replace('area','Area ') }} Chart</h5>
                <canvas :ref="el => setPreviewCanvasRef(viz, el)" class="w-full h-64"></canvas>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button @click="closeReportBuilder" class="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button @click="generatePreview" :disabled="generatingPreview" 
                    class="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              <span v-if="generatingPreview">Generating…</span>
              <span v-else>Preview</span>
            </button>
            <button @click="generateReport" :disabled="!reportBuilder.name || !reportBuilder.metrics.length || generating"
                    class="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              <span v-if="generating">Creating…</span>
              <span v-else>Generate Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Schedule Modal (kept simple) -->
    <div v-if="showScheduleModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div class="p-6 space-y-5">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">Schedule Report</h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Template</label>
              <select v-model="scheduleForm.templateId" required class="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
                <option value="">Select template…</option>
                <option v-for="t in reportTemplates" :key="t.id" :value="t.id">{{ t.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Frequency</label>
              <select v-model="scheduleForm.frequency" class="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Recipients (comma separated)</label>
              <textarea v-model="scheduleForm.recipients" rows="3" placeholder="email1@company.com, email2@company.com"
                        class="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"></textarea>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button @click="showScheduleModal = false" class="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
              Cancel
            </button>
            <button @click="scheduleReport" class="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

// ── State ────────────────────────────────────────────────────────────────
const loading              = ref(false)
const selectedReportType   = ref('all')
const showReportBuilder    = ref(false)
const showScheduleModal    = ref(false)
const searchReports        = ref('')
const filterByStatus       = ref('all')
const showPreview          = ref(false)
const generating           = ref(false)
const generatingPreview    = ref(false)

const previewCanvases      = ref({})
const previewCharts        = ref({})

const reportBuilder = ref({
  name:          '',
  type:          'financial',
  dateRange:     '30d',
  format:        'pdf',
  dataSources:   [],
  metrics:       [],
  visualizations: []
})

const scheduleForm = ref({
  templateId: '',
  frequency:  'weekly',
  recipients: ''
})

// ── Data ────────────────────────────────────────────────────────────────
const reportTemplates = ref([])

const scheduledReports = ref([])

const recentReports = ref([])

const availableDataSources = ref([
  { id:'financial', name:'Financial Data' },
  { id:'projects',  name:'Projects' },
  { id:'users',     name:'User Activity' }
])

const availableMetrics = ref([
  { id:'revenue',     name:'Total Revenue' },
  { id:'profit',      name:'Profit Margin' },
  { id:'growth',      name:'Growth Rate' },
  { id:'utilization', name:'Resource Utilization' }
])

const visualizationOptions = ref([
  { id:'bar',  name:'Bar',  icon:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { id:'line', name:'Line', icon:'M7 12l3-3 3 3 4-3M4 20h16M4 12h16m-7-6v-6' },
  { id:'pie',  name:'Pie',  icon:'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' }
])

// ── Computed ─────────────────────────────────────────────────────────────
const filteredRecentReports = computed(() => {
  let items = recentReports.value

  if (selectedReportType.value !== 'all') {
    items = items.filter(r => r.type.toLowerCase() === selectedReportType.value.toLowerCase())
  }
  if (filterByStatus.value !== 'all') {
    items = items.filter(r => r.status === filterByStatus.value)
  }
  if (searchReports.value.trim()) {
    const term = searchReports.value.toLowerCase()
    items = items.filter(r => 
      r.name.toLowerCase().includes(term) || 
      r.description?.toLowerCase().includes(term)
    )
  }
  return items
})

// ── Actions ──────────────────────────────────────────────────────────────
function openReportBuilder() {
  reportBuilder.value = {
    name: '',
    type: 'financial',
    dateRange: '30d',
    format: 'pdf',
    dataSources: [],
    metrics: [],
    visualizations: []
  }
  showPreview.value = false
  showReportBuilder.value = true
}

function closeReportBuilder() {
  showReportBuilder.value = false
  showPreview.value = false
  destroyPreviewCharts()
}

function setPreviewCanvasRef(viz, el) {
  if (el) previewCanvases.value[viz] = el
}

async function generatePreview() {
  if (!reportBuilder.value.visualizations.length) return

  generatingPreview.value = true
  showPreview.value = true

  await nextTick()
  destroyPreviewCharts()

  for (const viz of reportBuilder.value.visualizations) {
    const canvas = previewCanvases.value[viz]
    if (!canvas) continue

    const Chart = (await import('chart.js/auto')).default

    previewCharts.value[viz] = new Chart(canvas, {
      type: viz === 'area' ? 'line' : viz,
      data: getMockChartData(viz),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } }
      }
    })
  }

  generatingPreview.value = false
}

function destroyPreviewCharts() {
  Object.values(previewCharts.value).forEach(chart => chart?.destroy())
  previewCharts.value = {}
}

const getMockTableData = async () => {
  const data = []
  const { metrics, dataSources } = reportBuilder.value
  
  // Fetch real data based on selected sources
  if (dataSources.includes('Projects')) {
    try {
      const projectsResponse = await axios.get('/api/projects')
      const projects = projectsResponse.data
      
      metrics.forEach(metric => {
        switch(metric) {
          case 'revenue':
            const totalValue = projects.reduce((sum, p) => sum + (p.value || 0), 0)
            data.push({
              Metric: 'Total Project Value',
              Value: totalValue,
              Change: '+' + (Math.random() * 20 + 5).toFixed(1) + '%'
            })
            break
          case 'projects':
            const activeProjects = projects.filter(p => p.project_status === 'active').length
            data.push({
              Metric: 'Active Projects',
              Value: activeProjects,
              Change: '+' + (Math.random() * 5 + 1).toFixed(0)
            })
            break
          case 'efficiency':
            const completed = projects.filter(p => p.project_status === 'completed').length
            const total = projects.length
            const completionRate = total > 0 ? Math.round((completed/total)*100) : 0
            data.push({
              Metric: 'Project Completion Rate',
              Value: completionRate + '%',
              Change: '+' + (Math.random() * 10 + 2).toFixed(1) + '%'
            })
            break
        }
      })
    } catch (error) {
      console.error('Failed to fetch projects data:', error)
      toast.error('Failed to fetch projects data')
    }
  }
  
  if (dataSources.includes('Tenders')) {
    try {
      const tendersResponse = await axios.get('/api/tenders')
      const tenders = tendersResponse.data
      
      data.push({
        Metric: 'Total Tenders',
        Value: tenders.length,
        Change: '+' + (Math.random() * 8 + 1).toFixed(0)
      })
    } catch (error) {
      console.error('Failed to fetch tenders data:', error)
      toast.error('Failed to fetch tenders data')
    }
  }
  
  if (dataSources.includes('Users')) {
    try {
      const usersResponse = await axios.get('/api/all/users')
      const users = usersResponse.data
      
      data.push({
        Metric: 'Team Members',
        Value: users.length,
        Change: '+' + (Math.random() * 3 + 1).toFixed(0)
      })
    } catch (error) {
      console.error('Failed to fetch users data:', error)
      toast.error('Failed to fetch users data')
    }
  }
  
  // Return empty array if no data was fetched
  return data
}

const getMockChartData = (type) => {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const datasets = reportBuilder.value.metrics.map(metric => ({
    label: metric.charAt(0).toUpperCase() + metric.slice(1),
    data: labels.map(() => Math.floor(Math.random() * 10000) + 1000),
    backgroundColor: metric === 'revenue' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(16, 185, 129, 0.5)',
    borderColor: metric === 'revenue' ? 'rgb(59, 130, 246)' : 'rgb(16, 185, 129)',
    borderWidth: 2
  }))
  return { labels, datasets }
}

async function generateReport() {
  if (!reportBuilder.value.name || !reportBuilder.value.metrics.length) {
    toast.error('Name and at least one metric required')
    return
  }

  generating.value = true

  const report = {
    id: Date.now(),
    name: reportBuilder.value.name,
    type: reportBuilder.value.type.charAt(0).toUpperCase() + reportBuilder.value.type.slice(1),
    generatedAt: new Date().toLocaleDateString('en-GB'),
    format: reportBuilder.value.format,
    size: 'Generating…',
    status: 'processing',
    statusColor: 'text-amber-600 bg-amber-100/30',
    description: 'Custom report',
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-600'
  }

  recentReports.value.unshift(report)

  try {
    // ── Lazy load libraries only when exporting ───────────────────────
    const [{ default: Chart }, { default: jsPDF }, XLSX] = await Promise.all([
      import('chart.js/auto'),
      import('jspdf'),
      import('xlsx')
    ])

    const tableData = await getMockTableData()

    const filename = report.name.replace(/\s+/g,'_') + '_' + new Date().toISOString().slice(0,10)

    if (reportBuilder.value.format === 'pdf') {
      const doc = new jsPDF()
      doc.setFontSize(16)
      doc.text(report.name, 14, 20)
      doc.setFontSize(11)
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30)

      let y = 45
      tableData.forEach(row => {
        doc.text(`${row.Metric}: ${row.Value} (${row.Change})`, 14, y)
        y += 8
      })

      // Add charts if any
      if (reportBuilder.value.visualizations.length) {
        await nextTick()
        for (const viz of reportBuilder.value.visualizations) {
          const tempCanvas = document.createElement('canvas')
          tempCanvas.width = 900
          tempCanvas.height = 450
          const ctx = tempCanvas.getContext('2d')
          new Chart(ctx, {
            type: viz === 'area' ? 'line' : viz,
            data: getMockChartData(viz),
            options: { responsive: false, animation: false }
          })

          const imgData = tempCanvas.toDataURL('image/png')
          if (y > 240) { doc.addPage(); y = 20 }
          doc.addImage(imgData, 'PNG', 14, y, 180, 90)
          y += 100
        }
      }

      doc.save(filename + '.pdf')
    } 
    else if (['excel','csv'].includes(reportBuilder.value.format)) {
      const ws = XLSX.utils.json_to_sheet(tableData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Report')
      XLSX.writeFile(wb, filename + (reportBuilder.value.format === 'excel' ? '.xlsx' : '.csv'))
    }

    // Success
    report.status = 'completed'
    report.statusColor = 'text-green-600 bg-green-100/30'
    report.size = (Math.random()*2.5 + 0.8).toFixed(1) + ' MB'
    toast.success('Report created')

  } catch (err) {
    console.error(err)
    report.status = 'failed'
    report.statusColor = 'text-red-600 bg-red-100/30'
    toast.error('Failed to generate report')
  } finally {
    generating.value = false
    closeReportBuilder()
  }
}

function scheduleReport() {
  toast.success('Report scheduled (mock)')
  showScheduleModal.value = false
}

function downloadReport(report) {
  if (report.status !== 'completed') return toast.warning('Report not ready yet')
  toast.info(`Downloading ${report.name}… (mock)`)
}

function shareReport(report) {
  toast.info(`Sharing link for ${report.name}… (mock)`)
}

function deleteReport(report) {
  if (!confirm(`Delete "${report.name}"?`)) return
  recentReports.value = recentReports.value.filter(r => r.id !== report.id)
  toast.success('Report removed')
}

function editScheduled() {
  toast.info('Edit scheduled report – coming soon')
}

function useTemplate(template) {
  reportBuilder.value.name = template.name + ' – Custom'
  reportBuilder.value.type = template.type.toLowerCase()
  reportBuilder.value.visualizations = ['bar']
  reportBuilder.value.metrics = ['revenue','profit']
  openReportBuilder()
}

onMounted(() => {
  // Component mounted - no fake loading needed
})

onUnmounted(() => {
  destroyPreviewCharts()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
</style>