<template>
  <div class="analyses-page min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl space-y-6">

      <!-- Header + Filter + Export -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Project Analyses</h1>
          <p class="mt-1.5 text-sm text-gray-600">
            Review quoted vs actual costs and approve or reject project analyses
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Export Buttons -->
          <div class="flex gap-2">
            <button
              @click="exportToExcel"
              :disabled="!allProjects.length || loading"
              class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Export to Excel"
            >
              <i class="fas fa-file-excel text-green-600"></i>
              <span class="hidden sm:inline">Excel</span>
            </button>
            <button
              @click="exportToPDF"
              :disabled="!allProjects.length || loading"
              class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Export to PDF"
            >
              <i class="fas fa-file-pdf text-red-600"></i>
              <span class="hidden sm:inline">PDF</span>
            </button>
          </div>

          <!-- Search -->
          <div class="relative w-full sm:w-80">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i class="fa fa-search text-gray-400"></i>
            </div>
            <input
              v-model.trim="filter"
              type="search"
              placeholder="Search project name..."
              class="block w-full rounded-lg border border-gray-300 pl-10 py-2.5 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-24">
        <div class="flex items-center gap-3 text-gray-500">
          <i class="fa fa-spinner fa-spin text-2xl"></i>
          <span class="text-lg">Loading project analyses...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!filteredProjects.length"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
      >
        <i class="fa fa-folder-open text-6xl text-gray-300 mb-6 block"></i>
        <h3 class="text-xl font-medium text-gray-900 mb-2">
          {{ filter ? 'No matching projects found' : 'No analyses available' }}
        </h3>
        <p class="text-gray-600">
          {{ filter ? 'Try a different search term' : 'New analyses will appear here once submitted' }}
        </p>
      </div>

      <!-- ══════════════════════════════════════════════
           PROJECTS SUMMARY TABLE
      ══════════════════════════════════════════════ -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 flex items-center justify-between">
          <h2 class="text-base font-semibold text-white flex items-center gap-2">
            <i class="fas fa-table"></i>
            All Project Analyses
          </h2>
          <span class="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
            {{ filteredProjects.length }} of {{ allProjects.length }} projects
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="th" style="min-width:50px;">#</th>
                <th class="th" style="min-width:220px;">Project Name</th>
                <th class="th text-center" style="min-width:130px;">Manager</th>
                <th class="th text-center" style="min-width:110px;">Status</th>
                <th class="th text-center" style="min-width:80px;">Items</th>
                <th class="th text-right" style="min-width:150px;">VAT Excl</th>
                <th class="th text-right" style="min-width:150px;">VAT Incl</th>
                <th class="th text-right" style="min-width:150px;">Projected Profit</th>
                <th class="th text-center" style="min-width:120px;">Created</th>
                <th class="th text-center" style="min-width:130px;">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(project, index) in filteredProjects"
                :key="project.project_id"
                class="hover:bg-blue-50/40 transition-colors duration-150"
              >
                <!-- # -->
                <td class="td text-center text-gray-400 font-medium text-xs">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>

                <!-- Project Name -->
                <td class="td">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i class="fas fa-folder text-slate-500 text-sm"></i>
                    </div>
                    <div class="font-semibold text-gray-900 leading-tight">
                      {{ project.project?.project_name || 'Unnamed Project' }}
                    </div>
                  </div>
                </td>

                <!-- Manager -->
                <td class="td text-center">
                  <div class="flex items-center justify-center gap-1.5">
                    <div class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <i class="fas fa-user text-gray-500 text-xs"></i>
                    </div>
                    <span class="text-sm text-gray-700">{{ project.user?.name || '—' }}</span>
                  </div>
                </td>

                <!-- Status -->
                <td class="td text-center">
                  <span :class="statusBadgeClass(project.status)" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border">
                    <i :class="statusIconClass(project.status)" class="mr-1 text-xs"></i>
                    {{ project.status }}
                  </span>
                </td>

                <!-- Items -->
                <td class="td text-center">
                  <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {{ project.items?.length || 0 }}
                  </span>
                </td>

                <!-- VAT Excl -->
                <td class="td text-right font-medium text-blue-700 tabular-nums">
                  {{ formatCurrency(project.total_amount_vat_excl) }}
                </td>

                <!-- VAT Incl -->
                <td class="td text-right font-medium text-green-700 tabular-nums">
                  {{ formatCurrency(project.total_amount_vat_incl) }}
                </td>

                <!-- Projected Profit -->
                <td class="td text-right tabular-nums">
                  <span :class="parseFloat(project.projected_profit || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'" class="font-semibold">
                    {{ formatCurrency(project.projected_profit) }}
                  </span>
                  <div class="text-xs text-gray-400">({{ project.projected_profit_percentage || 0 }}%)</div>
                </td>

                <!-- Created -->
                <td class="td text-center text-sm text-gray-600">
                  {{ formatDate(project.created_at) }}
                </td>

                <!-- Actions -->
                <td class="td text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      @click="openDetailModal(project)"
                      class="view-btn group"
                      title="View full analysis"
                    >
                      <i class="fas fa-eye mr-1.5 group-hover:scale-110 transition-transform duration-150"></i>
                      View
                    </button>
                    <button
                      v-if="project.status === 'pending'"
                      @click="openApprovalDialog(project.project_id)"
                      class="review-btn"
                      title="Review project"
                    >
                      <i class="fa fa-check-circle mr-1.5"></i>
                      Review
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="allProjects.length > itemsPerPage" class="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>
        <span class="text-sm text-gray-700 font-medium px-4">
          Page <strong>{{ currentPage }}</strong> of {{ Math.ceil(allProjects.length / itemsPerPage) }}
        </span>
        <button
          :disabled="currentPage * itemsPerPage >= allProjects.length"
          @click="changePage(currentPage + 1)"
          class="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════
         FULL PROJECT DETAIL MODAL
    ══════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showDetailModal && detailProject"
          class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/50 backdrop-blur-sm"
          @click.self="closeDetailModal"
        >
          <div class="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[88vh] flex flex-col overflow-hidden">

            <!-- Modal Header -->
            <div class="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 flex-shrink-0">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <h2 class="text-lg font-semibold text-white truncate">
                    {{ detailProject.project?.project_name || 'Unnamed Project' }}
                  </h2>
                  <div class="flex flex-wrap gap-4 text-sm text-gray-300 mt-1">
                    <div class="flex items-center gap-1.5">
                      <i class="fas fa-user-circle"></i>
                      <span>{{ detailProject.user?.name || '—' }}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="fas fa-calendar-alt"></i>
                      <span>Created: {{ formatDate(detailProject.created_at) }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3 flex-shrink-0">
                  <span :class="statusBadgeClass(detailProject.status)" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm">
                    <i :class="statusIconClass(detailProject.status)" class="mr-1"></i>
                    {{ detailProject.status }}
                  </span>
                  <!-- Review button inside modal for pending -->
                  <button
                    v-if="detailProject.status === 'pending'"
                    @click="openApprovalDialog(detailProject.project_id)"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                  >
                    <i class="fa fa-check-circle"></i>
                    Review
                  </button>
                  <button
                    @click="closeDetailModal"
                    class="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                    title="Close"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <!-- Rejection Reason -->
              <div
                v-if="detailProject.status === 'rejected' && detailProject.reason_for_reject"
                class="mt-3 bg-red-900/20 border border-red-400/30 rounded-lg p-3"
              >
                <p class="text-sm text-red-200">
                  <i class="fas fa-exclamation-circle mr-2"></i>
                  <strong>Reason for rejection:</strong> {{ detailProject.reason_for_reject }}
                </p>
              </div>
            </div>

            <!-- Modal Scrollable Body -->
            <div class="overflow-y-auto flex-1 p-6 space-y-6">

              <!-- Financial Summary -->
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div class="fin-card bg-blue-50 border-blue-200">
                  <p class="fin-label text-blue-600">VAT Excl</p>
                  <p class="fin-value text-blue-900">{{ formatCurrency(detailProject.total_amount_vat_excl) }}</p>
                </div>
                <div class="fin-card bg-green-50 border-green-200">
                  <p class="fin-label text-green-600">VAT Incl</p>
                  <p class="fin-value text-green-900">{{ formatCurrency(detailProject.total_amount_vat_incl) }}</p>
                </div>
                <div class="fin-card bg-purple-50 border-purple-200">
                  <p class="fin-label text-purple-600">Amount Needed</p>
                  <p class="fin-value text-purple-900">{{ formatCurrency(detailProject.total_amount_needed) }}</p>
                </div>
                <div class="fin-card bg-orange-50 border-orange-200">
                  <p class="fin-label text-orange-600">Contingency</p>
                  <p class="fin-value text-orange-900">{{ formatCurrency(detailProject.site_contingency) }}</p>
                </div>
                <div class="fin-card bg-indigo-50 border-indigo-200">
                  <p class="fin-label text-indigo-600">Total Investment</p>
                  <p class="fin-value text-indigo-900">{{ formatCurrency(detailProject.total_investment) }}</p>
                </div>
                <div class="fin-card bg-emerald-50 border-emerald-200">
                  <p class="fin-label text-emerald-600">Projected Profit</p>
                  <p class="fin-value" :class="detailProject.projected_profit >= 0 ? 'text-emerald-700' : 'text-red-600'">
                    {{ formatCurrency(detailProject.projected_profit) }}
                    <span class="text-xs font-normal opacity-80 ml-1">({{ detailProject.projected_profit_percentage || '—' }}%)</span>
                  </p>
                </div>
              </div>

              <!-- Analysis Items Table -->
              <div class="border border-gray-200 rounded-lg overflow-hidden">
                <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <i class="fas fa-list"></i>
                    Analysis Items
                  </h3>
                  <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {{ detailProject.items?.length || 0 }} items
                  </span>
                </div>

                <div v-if="detailProject.items?.length" class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-100">
                      <tr>
                        <th class="th" style="min-width:60px;">S/N</th>
                        <th class="th" style="min-width:260px;">Description</th>
                        <th class="th text-center" colspan="4">
                          <div class="text-xs font-semibold text-blue-700 mb-1">QUOTED PRICES (VAT EXCL)</div>
                        </th>
                        <th class="th text-center" colspan="3">
                          <div class="text-xs font-semibold text-green-700 mb-1">BUYING PRICES (VAT INCL)</div>
                        </th>
                        <th class="th" style="min-width:110px;">Source</th>
                        <th class="th text-center" style="min-width:90px;">Urgent</th>
                      </tr>
                      <tr class="bg-gray-50">
                        <th class="th-sub"></th>
                        <th class="th-sub"></th>
                        <th class="th-sub">Q. Qty</th>
                        <th class="th-sub">Unit</th>
                        <th class="th-sub">Q. Rate</th>
                        <th class="th-sub">Q. Amount</th>
                        <th class="th-sub">Qty</th>
                        <th class="th-sub">Rate</th>
                        <th class="th-sub">Amount</th>
                        <th class="th-sub"></th>
                        <th class="th-sub"></th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 text-sm text-gray-700">
                      <tr
                        v-for="item in detailProject.items"
                        :key="item.analysis_id"
                        class="hover:bg-gray-50/60 transition-colors"
                        :class="item.serial_number === 'No' ? 'bg-blue-50/50 border-t-2 border-blue-200' : ''"
                      >
                        <td class="td text-center font-medium" :class="item.serial_number === 'No' ? 'text-blue-900' : ''">
                          {{ item.serial_number || '—' }}
                        </td>
                        <td class="td" :class="item.serial_number === 'No' ? 'font-semibold text-blue-900' : ''">
                          <div class="max-w-xs truncate" :title="item.item_description">
                            {{ item.item_description || '—' }}
                          </div>
                        </td>
                        <td class="td text-center">{{ item.quoted_quantity || '—' }}</td>
                        <td class="td text-center">
                          <span v-if="item.quoted_unit" class="px-2 py-0.5 bg-gray-100 rounded text-xs">{{ item.quoted_unit }}</span>
                          <span v-else class="text-gray-400">—</span>
                        </td>
                        <td class="td text-right tabular-nums">{{ formatCurrency(item.quoted_rate) }}</td>
                        <td class="td text-right font-medium text-blue-700 tabular-nums">{{ formatCurrency(item.quoted_amount) }}</td>
                        <td class="td text-center">{{ item.quantity || '—' }}</td>
                        <td class="td text-right tabular-nums">{{ formatCurrency(item.rate) }}</td>
                        <td class="td text-right font-medium text-green-700 tabular-nums">{{ formatCurrency(item.amount) }}</td>
                        <td class="td text-center text-xs text-gray-600">{{ item.source || '—' }}</td>
                        <td class="td text-center">
                          <span
                            v-if="item.urgent_status"
                            :class="{
                              'bg-red-100 text-red-700 font-semibold': item.urgent_status.toLowerCase() === 'yes',
                              'bg-gray-100 text-gray-600': item.urgent_status.toLowerCase() !== 'yes'
                            }"
                            class="px-2 py-0.5 rounded-full text-xs"
                          >
                            {{ item.urgent_status }}
                          </span>
                          <span v-else class="text-gray-400">—</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div v-else class="p-8 text-center bg-gray-50">
                  <i class="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
                  <p class="text-gray-500 text-sm">No analysis items found for this project</p>
                </div>
              </div>

            </div><!-- end scrollable body -->
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══════════════════════════════════════════════
         APPROVAL MODAL
    ══════════════════════════════════════════════ -->
    <div
      v-if="showDialog"
      class="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4"
      @click.self="closeDialog"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        <div class="p-6 border-b">
          <h2 class="text-xl font-semibold text-gray-900">Review Project Analysis</h2>
        </div>

        <div class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Decision</label>
            <select
              v-model="approvalStatus"
              class="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 outline-none transition-colors"
            >
              <option value="approved">Approve</option>
              <option value="rejected">Reject</option>
            </select>
          </div>

          <div v-if="approvalStatus === 'rejected'">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Reason for Rejection <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model.trim="rejectionReason"
              rows="4"
              class="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-red-500 focus:ring-red-500 outline-none resize-y transition-colors"
              placeholder="Please explain the reason clearly..."
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            @click="closeDialog"
            class="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="submitApproval"
            :disabled="approvalStatus === 'rejected' && !rejectionReason.trim()"
            class="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-colors"
            :class="{
              'bg-green-600 hover:bg-green-700': approvalStatus === 'approved',
              'bg-red-600 hover:bg-red-700': approvalStatus === 'rejected',
              'opacity-60 cursor-not-allowed': approvalStatus === 'rejected' && !rejectionReason.trim()
            }"
          >
            <i class="fa fa-check" v-if="approvalStatus === 'approved'"></i>
            <i class="fa fa-ban" v-else></i>
            {{ approvalStatus === 'approved' ? 'Approve' : 'Reject' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const toast = useToast()

const analyses = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 8
const loading = ref(false)

const showDialog = ref(false)
const selectedProjectId = ref(null)
const approvalStatus = ref('approved')
const rejectionReason = ref('')

const showDetailModal = ref(false)
const detailProject = ref(null)

onMounted(async () => {
  await fetchAnalyses()
})

async function fetchAnalyses() {
  loading.value = true
  try {
    const res = await axios.get('/api/analysis')
    if (res.data?.status === 200 && Array.isArray(res.data.data)) {
      analyses.value = groupByProject(res.data.data)
    } else {
      throw new Error('Invalid response format')
    }
  } catch (err) {
    handleError(err)
  } finally {
    loading.value = false
  }
}

function groupByProject(data) {
  const grouped = {}
  data.forEach(item => {
    const pid = item.project_id
    if (!grouped[pid]) {
      grouped[pid] = {
        project_id: pid,
        project: item.project,
        user: item.user,
        created_at: item.created_at,
        status: item.status,
        reason_for_reject: item.reason_for_reject,
        total_amount_vat_excl: 0,
        total_amount_vat_incl: 0,
        total_amount_needed: 0,
        site_contingency: 0,
        total_investment: 0,
        projected_profit: 0,
        projected_profit_percentage: 0,
        items: []
      }
    }
    grouped[pid].items.push(item)
    const quotedAmount = parseFloat(item.quoted_amount || (item.quantity * item.rate) || 0)
    const buyingAmount = parseFloat(item.amount || 0)
    const vatRate = 0.18
    const vatAmount = quotedAmount * vatRate
    grouped[pid].total_amount_vat_excl += quotedAmount
    grouped[pid].total_amount_vat_incl += quotedAmount + vatAmount
    grouped[pid].total_amount_needed += buyingAmount
    grouped[pid].site_contingency += quotedAmount * 0.1
    grouped[pid].total_investment += quotedAmount * 1.2
    grouped[pid].projected_profit += quotedAmount - buyingAmount
  })
  Object.values(grouped).forEach(project => {
    if (project.total_amount_vat_incl > 0) {
      project.projected_profit_percentage = Math.round((project.projected_profit / project.total_amount_vat_incl) * 100 * 100) / 100
    }
  })
  return Object.values(grouped)
}

function openDetailModal(project) {
  detailProject.value = project
  showDetailModal.value = true
  document.body.style.overflow = 'hidden'
}

function closeDetailModal() {
  showDetailModal.value = false
  detailProject.value = null
  document.body.style.overflow = ''
}

const allProjects = computed(() =>
  analyses.value.filter(p =>
    p.project?.project_name?.toLowerCase().includes(filter.value.toLowerCase().trim())
  )
)

const filteredProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return allProjects.value.slice(start, start + itemsPerPage)
})

function formatDate(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatCurrency(value) {
  if (value == null || isNaN(value)) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
}

function statusBadgeClass(status) {
  const map = {
    pending:  'bg-amber-100 text-amber-800 border-amber-200',
    approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    rejected: 'bg-rose-100 text-rose-800 border-rose-200'
  }
  return map[status] || 'bg-gray-100 text-gray-700 border-gray-200'
}

function statusIconClass(status) {
  const map = { pending: 'fas fa-clock', approved: 'fas fa-check-circle', rejected: 'fas fa-times-circle' }
  return map[status] || 'fas fa-question-circle'
}

function handleError(error) {
  let msg = 'An unexpected error occurred'
  if (error?.response) {
    if (error.response.status === 404) {
      msg = error.response.data.message || 'Resource not found or already processed'
    } else if (error.response.status === 422) {
      msg = 'Validation error: ' + Object.values(error.response.data.errors || {}).flat().join(', ')
    } else {
      msg = error.response.data?.message || error.response.statusText
    }
  } else if (error?.request) {
    msg = 'No response from server. Check your connection.'
  } else {
    msg = error.message || 'Unknown error'
  }
  toast.error(msg)
}

function changePage(page) {
  const maxPage = Math.ceil(allProjects.value.length / itemsPerPage)
  if (page >= 1 && page <= maxPage) currentPage.value = page
}

function openApprovalDialog(projectId) {
  selectedProjectId.value = projectId
  approvalStatus.value = 'approved'
  rejectionReason.value = ''
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
  selectedProjectId.value = null
}

async function submitApproval() {
  if (approvalStatus.value === 'rejected' && !rejectionReason.value.trim()) {
    toast.warning('Please provide a rejection reason')
    return
  }
  try {
    const payload = {
      project_id: selectedProjectId.value,
      status: approvalStatus.value,
      reason_for_reject: approvalStatus.value === 'rejected' ? rejectionReason.value.trim() : null
    }
    const res = await axios.post('/api/approve-analysis', payload)
    if (res.data?.status === 200) {
      toast.success(res.data.message || 'Status updated successfully')
      await fetchAnalyses()
      closeDialog()
      // Refresh detailProject if it was the one reviewed
      if (detailProject.value?.project_id === selectedProjectId.value) {
        detailProject.value = analyses.value.find(p => p.project_id === selectedProjectId.value) || null
      }
    } else {
      throw new Error(res.data?.message || 'Operation failed')
    }
  } catch (err) {
    handleError(err)
  }
}

function exportToExcel() {
  if (!allProjects.value.length) { toast.warning('No data to export'); return }
  try {
    const exportData = []
    allProjects.value.forEach(project => {
      project.items.forEach(item => {
        exportData.push({
          'S/N': item.serial_number || '',
          'Project Name': project.project?.project_name || '',
          'Project Manager': project.user?.name || '',
          'Status': project.status || '',
          'Created Date': formatDate(project.created_at),
          'Item Description': item.item_description || '',
          'Quoted Quantity': item.quoted_quantity || '',
          'Quoted Unit': item.quoted_unit || '',
          'Quoted Rate': item.quoted_rate || 0,
          'Quoted Amount': item.quoted_amount || 0,
          'Buying Quantity': item.quantity || '',
          'Buying Rate': item.rate || 0,
          'Buying Amount': item.amount || 0,
          'Source': item.source || '',
          'Urgent Status': item.urgent_status || '',
          'Total VAT Excl': project.total_amount_vat_excl || 0,
          'Total VAT Incl': project.total_amount_vat_incl || 0,
          'Amount Needed': project.total_amount_needed || 0,
          'Site Contingency': project.site_contingency || 0,
          'Total Investment': project.total_investment || 0,
          'Projected Profit': project.projected_profit || 0,
          'Profit %': project.projected_profit_percentage || 0
        })
      })
    })
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Project Analyses')
    worksheet['!cols'] = [
      { wch: 8 }, { wch: 25 }, { wch: 20 }, { wch: 12 }, { wch: 15 },
      { wch: 40 }, { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 18 },
      { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 12 }, { wch: 12 },
      { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 18 }, { wch: 20 },
      { wch: 18 }, { wch: 10 }
    ]
    XLSX.writeFile(workbook, `Project_Analyses_${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Excel file exported successfully')
  } catch (error) {
    toast.error('Failed to export Excel file')
  }
}

function exportToPDF() {
  if (!allProjects.value.length) { toast.warning('No data to export'); return }
  try {
    const doc = new jsPDF('l', 'mm', 'a4')
    doc.setFontSize(20)
    doc.setTextColor(31, 41, 55)
    doc.text('Project Analyses Report', 14, 20)
    doc.setFontSize(10)
    doc.setTextColor(107, 114, 128)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28)
    doc.text(`Total Projects: ${allProjects.value.length}`, 14, 33)
    doc.text(`Total Items: ${allProjects.value.reduce((sum, p) => sum + p.items.length, 0)}`, 14, 38)
    let yPosition = 50
    allProjects.value.forEach((project, projectIndex) => {
      if (yPosition > 180) { doc.addPage(); yPosition = 20 }
      doc.setFontSize(14)
      doc.setTextColor(31, 41, 55)
      doc.text(`${projectIndex + 1}. ${project.project?.project_name || 'Unnamed Project'}`, 14, yPosition)
      yPosition += 8
      doc.setFontSize(10)
      doc.setTextColor(107, 114, 128)
      doc.text(`Manager: ${project.user?.name || '—'} | Status: ${project.status || '—'} | Created: ${formatDate(project.created_at)}`, 14, yPosition)
      yPosition += 6
      doc.text(`VAT Excl: ${formatCurrency(project.total_amount_vat_excl)} | VAT Incl: ${formatCurrency(project.total_amount_vat_incl)} | Investment: ${formatCurrency(project.total_investment)} | Profit: ${formatCurrency(project.projected_profit)} (${project.projected_profit_percentage || '—'}%)`, 14, yPosition)
      yPosition += 10
      if (project.items.length > 0) {
        const tableData = project.items.map(item => [
          item.serial_number || '',
          (item.item_description || '').substring(0, 30) + ((item.item_description || '').length > 30 ? '...' : ''),
          item.quoted_quantity || '',
          formatCurrency(item.quoted_rate),
          formatCurrency(item.quoted_amount),
          item.quantity || '',
          formatCurrency(item.rate),
          formatCurrency(item.amount),
          item.source || '',
          item.urgent_status || ''
        ])
        autoTable(doc, {
          head: [['S/N', 'Description', 'Q. Qty', 'Q. Rate', 'Q. Amount', 'Qty', 'Rate', 'Amount', 'Source', 'Urgent']],
          body: tableData,
          startY: yPosition,
          theme: 'grid',
          headStyles: { fillColor: [59, 130, 246], fontSize: 8, fontStyle: 'bold', cellPadding: 2 },
          styles: { fontSize: 7, cellPadding: 2, lineColor: [229, 231, 235], lineWidth: 0.1 },
          alternateRowStyles: { fillColor: [249, 250, 251] },
          columnStyles: {
            0: { cellWidth: 10 }, 1: { cellWidth: 35 }, 2: { cellWidth: 15 },
            3: { cellWidth: 20 }, 4: { cellWidth: 20 }, 5: { cellWidth: 12 },
            6: { cellWidth: 18 }, 7: { cellWidth: 20 }, 8: { cellWidth: 15 }, 9: { cellWidth: 15 }
          }
        })
        yPosition = doc.lastAutoTable.finalY + 10
      } else {
        doc.text('No items found for this project', 14, yPosition)
        yPosition += 10
      }
      if (project.status === 'rejected' && project.reason_for_reject) {
        doc.setTextColor(220, 38, 38)
        doc.text(`Rejection Reason: ${project.reason_for_reject}`, 14, yPosition)
        yPosition += 8
        doc.setTextColor(0, 0, 0)
      }
      yPosition += 10
    })
    doc.save(`Project_Analyses_${new Date().toISOString().split('T')[0]}.pdf`)
    toast.success('PDF file exported successfully')
  } catch (error) {
    toast.error('Failed to export PDF file')
  }
}
</script>

<style scoped>
.th {
  @apply px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider;
}

.th-sub {
  @apply px-4 py-2 text-left text-xs font-medium text-gray-600;
}

.td {
  @apply px-4 py-3 text-sm text-gray-900 whitespace-nowrap;
}

/* View Button */
.view-btn {
  @apply inline-flex items-center px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200 shadow-sm;
}

/* Review Button */
.review-btn {
  @apply inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 shadow-sm;
}

/* Financial card in modal */
.fin-card {
  @apply border rounded-lg p-4;
}

.fin-label {
  @apply text-xs font-semibold uppercase tracking-wide mb-1;
}

.fin-value {
  @apply text-base font-bold;
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}

/* Scrollbars */
.overflow-x-auto::-webkit-scrollbar { height: 8px; }
.overflow-x-auto::-webkit-scrollbar-thumb { background-color: #cbd5e0; border-radius: 4px; }
.overflow-x-auto::-webkit-scrollbar-track { background-color: #f7fafc; }
.overflow-y-auto::-webkit-scrollbar { width: 6px; }
.overflow-y-auto::-webkit-scrollbar-thumb { background-color: #cbd5e0; border-radius: 4px; }
.overflow-y-auto::-webkit-scrollbar-track { background-color: #f7fafc; }

/* Modal transition */
.modal-enter-active,
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from,
.modal-leave-to { opacity: 0; }
</style>