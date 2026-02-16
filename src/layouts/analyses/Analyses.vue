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

      <!-- Project List -->
      <div v-else class="space-y-6">
        <div
          v-for="project in filteredProjects"
          :key="project.project_id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-150"
        >
          <!-- Project Header -->
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-5 sm:p-6 border-b bg-gray-50/70">
            <div class="space-y-2">
              <h3 class="text-xl font-semibold text-gray-900 leading-tight">
                {{ project.project?.project_name || 'Unnamed Project' }}
              </h3>
              <div class="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                <div>
                  Manager:
                  <span class="font-medium text-gray-800">{{ project.user?.name || '—' }}</span>
                </div>
                <div>
                  Created:
                  <span class="font-medium text-gray-800">{{ formatDate(project.created_at) }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-4 flex-shrink-0">
              <span
                :class="statusBadgeClass(project.status)"
                class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border"
              >
                {{ project.status }}
              </span>

              <button
                v-if="project.status === 'pending'"
                @click="openApprovalDialog(project.project_id)"
                class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <i class="fa fa-check-circle"></i>
                Review
              </button>
            </div>
          </div>

          <!-- Financial Summary -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 p-5 sm:p-6 border-b bg-gray-50/40 text-sm">
            <div>
              <p class="text-gray-500 mb-0.5">VAT Excl</p>
              <p class="font-medium">{{ formatCurrency(project.total_amount_vat_excl) }}</p>
            </div>
            <div>
              <p class="text-gray-500 mb-0.5">VAT Incl</p>
              <p class="font-medium">{{ formatCurrency(project.total_amount_vat_incl) }}</p>
            </div>
            <div>
              <p class="text-gray-500 mb-0.5">Amount Needed</p>
              <p class="font-medium">{{ formatCurrency(project.total_amount_needed) }}</p>
            </div>
            <div>
              <p class="text-gray-500 mb-0.5">Contingency</p>
              <p class="font-medium">{{ formatCurrency(project.site_contingency) }}</p>
            </div>
            <div>
              <p class="text-gray-500 mb-0.5">Total Investment</p>
              <p class="font-medium">{{ formatCurrency(project.total_investment) }}</p>
            </div>
            <div>
              <p class="text-gray-500 mb-0.5">Projected Profit</p>
              <p class="font-medium text-emerald-700">
                {{ formatCurrency(project.projected_profit) }}
                <span class="text-xs ml-1 opacity-90">({{ project.projected_profit_percentage || '—' }}%)</span>
              </p>
            </div>
          </div>

          <!-- Rejection Reason -->
          <div
            v-if="project.status === 'rejected' && project.reason_for_reject"
            class="px-6 py-4 bg-red-50/70 border-t border-red-100 text-sm text-red-800"
          >
            <strong class="text-red-900">Reason for rejection:</strong>
            {{ project.reason_for_reject }}
          </div>

          <!-- Analysis Items Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-14">S/N</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[280px]">Description</th>
                  <th class="px-3 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">Q. Qty</th>
                  <th class="px-2 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">Unit</th>
                  <th class="px-4 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Q. Rate</th>
                  <th class="px-5 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">Q. Amount</th>
                  <th class="px-3 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">Qty</th>
                  <th class="px-4 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Rate</th>
                  <th class="px-5 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">Amount</th>
                  <th class="px-4 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">Source</th>
                  <th class="px-3 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">Urgent</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-sm text-gray-700">
                <tr v-for="item in project.items" :key="item.analysis_id" class="hover:bg-gray-50/60 transition-colors">
                  <td class="px-5 py-3.5 whitespace-nowrap">{{ item.serial_number || '—' }}</td>
                  <td class="px-5 py-3.5 max-w-xs truncate">{{ item.item_description || '—' }}</td>
                  <td class="px-3 py-3.5 text-center">{{ item.quoted_quantity || '—' }}</td>
                  <td class="px-2 py-3.5 text-center">{{ item.quoted_unit || '—' }}</td>
                  <td class="px-4 py-3.5 text-right tabular-nums">{{ formatCurrency(item.quoted_rate) }}</td>
                  <td class="px-5 py-3.5 text-right font-medium tabular-nums">{{ formatCurrency(item.quoted_amount) }}</td>
                  <td class="px-3 py-3.5 text-center">{{ item.quantity || '—' }}</td>
                  <td class="px-4 py-3.5 text-right tabular-nums">{{ formatCurrency(item.rate) }}</td>
                  <td class="px-5 py-3.5 text-right font-medium tabular-nums">{{ formatCurrency(item.amount) }}</td>
                  <td class="px-4 py-3.5 text-center">{{ item.source || '—' }}</td>
                  <td class="px-3 py-3.5 text-center">
                    <span
                      v-if="item.urgent_status"
                      :class="{
                        'text-red-700 font-medium': item.urgent_status.toLowerCase() === 'yes',
                        'text-gray-600': item.urgent_status.toLowerCase() !== 'yes'
                      }"
                    >
                      {{ item.urgent_status }}
                    </span>
                    <span v-else>—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="allProjects.length > itemsPerPage" class="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
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

    <!-- Approval Modal -->
    <div
      v-if="showDialog"
      class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
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
        total_amount_vat_excl: null,
        total_amount_vat_incl: null,
        total_amount_needed: null,
        site_contingency: null,
        total_investment: null,
        projected_profit: null,
        projected_profit_percentage: null,
        items: []
      }
    }

    // Set totals only once (assuming they're the same per project)
    if (item.total_amount_vat_excl && !grouped[pid].total_amount_vat_excl) {
      grouped[pid].total_amount_vat_excl = item.total_amount_vat_excl
      grouped[pid].total_amount_vat_incl = item.total_amount_vat_incl
      grouped[pid].total_amount_needed = item.total_amount_needed
      grouped[pid].site_contingency = item.site_contingency
      grouped[pid].total_investment = item.total_investment
      grouped[pid].projected_profit = item.projected_profit
      grouped[pid].projected_profit_percentage = item.projected_profit_percentage
    }

    // Only add items that look like real analysis rows
    if (item.item_description || item.serial_number?.match(/^[A-M\s]+$/)) {
      grouped[pid].items.push(item)
    }
  })
  return Object.values(grouped)
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
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatCurrency(value) {
  if (value == null || isNaN(value)) return '—'
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

function statusBadgeClass(status) {
  const map = {
    pending:  'bg-amber-100 text-amber-800 border-amber-200',
    approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    rejected: 'bg-rose-100 text-rose-800 border-rose-200'
  }
  return map[status] || 'bg-gray-100 text-gray-700 border-gray-200'
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
  if (page >= 1 && page <= maxPage) {
    currentPage.value = page
  }
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
    } else {
      throw new Error(res.data?.message || 'Operation failed')
    }
  } catch (err) {
    handleError(err)
  }
}

// Export Functions
function exportToExcel() {
  if (!allProjects.value.length) {
    toast.warning('No data to export')
    return
  }

  try {
    const exportData = []
    
    allProjects.value.forEach((project, pIndex) => {
      project.items.forEach((item, itemIndex) => {
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
    
    // Auto-size columns
    const colWidths = [
      { wch: 8 },   // S/N
      { wch: 25 },  // Project Name
      { wch: 20 },  // Project Manager
      { wch: 12 },  // Status
      { wch: 15 },  // Created Date
      { wch: 40 },  // Item Description
      { wch: 15 },  // Quoted Quantity
      { wch: 12 },  // Quoted Unit
      { wch: 15 },  // Quoted Rate
      { wch: 18 },  // Quoted Amount
      { wch: 15 },  // Buying Quantity
      { wch: 15 },  // Buying Rate
      { wch: 18 },  // Buying Amount
      { wch: 12 },  // Source
      { wch: 12 },  // Urgent Status
      { wch: 15 },  // Total VAT Excl
      { wch: 15 },  // Total VAT Incl
      { wch: 18 },  // Amount Needed
      { wch: 18 },  // Site Contingency
      { wch: 20 },  // Total Investment
      { wch: 18 },  // Projected Profit
      { wch: 10 }   // Profit %
    ]
    worksheet['!cols'] = colWidths
    
    const fileName = `Project_Analyses_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(workbook, fileName)
    
    toast.success('Excel file exported successfully')
  } catch (error) {
    console.error('Export error:', error)
    toast.error('Failed to export Excel file')
  }
}

function exportToPDF() {
  if (!allProjects.value.length) {
    toast.warning('No data to export')
    return
  }

  try {
    const doc = new jsPDF('l', 'mm', 'a4')
    
    // Header
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
      // Check if we need a new page
      if (yPosition > 180) {
        doc.addPage()
        yPosition = 20
      }
      
      // Project Header
      doc.setFontSize(14)
      doc.setTextColor(31, 41, 55)
      doc.text(`${projectIndex + 1}. ${project.project?.project_name || 'Unnamed Project'}`, 14, yPosition)
      yPosition += 8
      
      doc.setFontSize(10)
      doc.setTextColor(107, 114, 128)
      doc.text(`Manager: ${project.user?.name || '—'} | Status: ${project.status || '—'} | Created: ${formatDate(project.created_at)}`, 14, yPosition)
      yPosition += 6
      
      // Financial Summary
      doc.text(`VAT Excl: ${formatCurrency(project.total_amount_vat_excl)} | VAT Incl: ${formatCurrency(project.total_amount_vat_incl)} | Investment: ${formatCurrency(project.total_investment)} | Profit: ${formatCurrency(project.projected_profit)} (${project.projected_profit_percentage || '—'}%)`, 14, yPosition)
      yPosition += 10
      
      // Items Table
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
          headStyles: { 
            fillColor: [59, 130, 246],
            fontSize: 8,
            fontStyle: 'bold',
            cellPadding: 2
          },
          styles: { 
            fontSize: 7,
            cellPadding: 2,
            lineColor: [229, 231, 235],
            lineWidth: 0.1
          },
          alternateRowStyles: {
            fillColor: [249, 250, 251]
          },
          columnStyles: {
            0: { cellWidth: 10 },  // S/N
            1: { cellWidth: 35 },  // Description
            2: { cellWidth: 15 },  // Q. Qty
            3: { cellWidth: 20 },  // Q. Rate
            4: { cellWidth: 20 },  // Q. Amount
            5: { cellWidth: 12 },  // Qty
            6: { cellWidth: 18 },  // Rate
            7: { cellWidth: 20 },  // Amount
            8: { cellWidth: 15 },  // Source
            9: { cellWidth: 15 }   // Urgent
          }
        })
        
        yPosition = doc.lastAutoTable.finalY + 10
      } else {
        doc.text('No items found for this project', 14, yPosition)
        yPosition += 10
      }
      
      // Add space between projects
      yPosition += 10
      
      // Add rejection reason if present
      if (project.status === 'rejected' && project.reason_for_reject) {
        doc.setTextColor(220, 38, 38)
        doc.text(`Rejection Reason: ${project.reason_for_reject}`, 14, yPosition)
        yPosition += 8
        doc.setTextColor(0, 0, 0)
      }
      
      yPosition += 5
    })
    
    const fileName = `Project_Analyses_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
    
    toast.success('PDF file exported successfully')
  } catch (error) {
    console.error('Export error:', error)
    toast.error('Failed to export PDF file')
  }
}
</script>

<style scoped>
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>