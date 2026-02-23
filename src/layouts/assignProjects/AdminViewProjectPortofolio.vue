<template>
  <div class="min-h-screen bg-[#f5f6fa] dark:bg-[#0d0f14] transition-colors duration-300">
    <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Engineers with Projects</h1>
          <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Overview of engineers and their assigned projects</p>
        </div>
        <div class="flex gap-2">
          <button @click="exportToExcel" :disabled="isExporting || isLoading || !filteredUsers.length"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 transition-all">
            <svg class="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </button>
          <button @click="exportToPDF" :disabled="isExporting || isLoading || !filteredUsers.length"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 transition-all">
            <svg class="h-3.5 w-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </button>
        </div>
      </div>

      <!-- Search -->
      <div class="mb-4 relative max-w-xs">
        <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="filter" type="text" placeholder="Search name or email…"
          class="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-8 text-sm text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 shadow-sm" />
        <button v-if="filter" @click="filter = ''" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="rounded-xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-700/50 dark:bg-gray-900 py-20 text-center">
        <div class="inline-block h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-teal-500 mb-2"></div>
        <p class="text-sm text-gray-400">Loading engineers…</p>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredUsers.length === 0" class="rounded-xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-700/50 dark:bg-gray-900 py-16 text-center">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ filter ? 'No engineers match your search.' : 'No engineers with projects yet.' }}</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-700/50 dark:bg-gray-900">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
                <th class="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 w-10">#</th>
                <th class="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Engineer</th>
                <th class="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Email</th>
                <th class="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-gray-400">Total</th>
                <th class="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-amber-500/80">Progress</th>
                <th class="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-teal-500/80">Done</th>
                <th class="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-rose-400/80">Failed</th>
                <th class="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-gray-400">Status</th>
                <th class="px-5 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-800/60">
              <tr v-for="(user, index) in paginatedUsers" :key="user.user_id"
                class="hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition-colors">
                <td class="px-5 py-3.5 text-xs text-gray-400">{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-2.5">
                    <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {{ getInitials(user.name) }}
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ user.name || '—' }}</p>
                      <p v-if="user.role || user.department" class="text-xs text-gray-400">{{ user.role || user.department }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{{ user.email || '—' }}</td>
                <td class="px-5 py-3.5 text-center">
                  <span class="inline-flex h-6 min-w-[26px] items-center justify-center rounded-md bg-gray-100 px-1.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">{{ user.total_projects || 0 }}</span>
                </td>
                <td class="px-5 py-3.5 text-center">
                  <span class="inline-flex h-6 min-w-[26px] items-center justify-center rounded-md bg-amber-50 px-1.5 text-xs font-semibold text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">{{ user.on_progress_projects || 0 }}</span>
                </td>
                <td class="px-5 py-3.5 text-center">
                  <span class="inline-flex h-6 min-w-[26px] items-center justify-center rounded-md bg-teal-50 px-1.5 text-xs font-semibold text-teal-600 dark:bg-teal-900/20 dark:text-teal-400">{{ user.completed_projects || 0 }}</span>
                </td>
                <td class="px-5 py-3.5 text-center">
                  <span class="inline-flex h-6 min-w-[26px] items-center justify-center rounded-md bg-rose-50 px-1.5 text-xs font-semibold text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">{{ user.failed_projects || 0 }}</span>
                </td>
                <td class="px-5 py-3.5 text-center">
                  <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                    :class="user.status === 'is_active'
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'">
                    {{ user.status === 'is_active' ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-5 py-3.5 text-right">
                  <button @click="openModal(user)"
                    class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all shadow-sm">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredUsers.length > itemsPerPage" class="mt-5 flex items-center justify-between">
        <p class="text-xs text-gray-400">
          {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} of {{ filteredUsers.length }}
        </p>
        <div class="flex items-center gap-1">
          <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 transition-all">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button v-for="page in visiblePages" :key="page" @click="changePage(page)"
            :class="['flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold transition-all',
              page === currentPage ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800']">
            {{ page }}
          </button>
          <button :disabled="currentPage >= totalPages" @click="changePage(currentPage + 1)"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 transition-all">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ===== MODAL ===== -->
    <Transition name="modal">
      <div v-if="selectedUser"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
        @click="closeModal">
        <div
          class="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden"
          @click.stop>

          <!-- Modal Header -->
          <div class="flex items-center gap-4 px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
            <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow">
              {{ getInitials(selectedUser.name) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-base font-bold text-gray-900 dark:text-gray-100 truncate">{{ selectedUser.name || '—' }}</p>
              <p class="text-xs text-gray-400 truncate">{{ selectedUser.email || '—' }}</p>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                :class="selectedUser.status === 'is_active'
                  ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'">
                {{ selectedUser.status === 'is_active' ? 'Active' : 'Inactive' }}
              </span>
              <button @click="closeModal"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 transition-all">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Scrollable Body -->
          <div class="flex-1 overflow-y-auto px-6 py-5 space-y-6">

            <!-- Info tiles -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <InfoTile label="Role" :value="selectedUser.role" />
              <InfoTile label="Department" :value="selectedUser.department" />
              <InfoTile label="In Progress" :value="selectedUser.on_progress_projects" color="amber" />
              <InfoTile label="Completed" :value="selectedUser.completed_projects" color="teal" />
            </div>

            <!-- Projects -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <p class="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Projects</p>
                <span class="text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5">{{ selectedUser.projects?.length || 0 }}</span>
              </div>

              <div v-if="selectedUser.projects?.length" class="space-y-2.5">
                <div v-for="project in selectedUser.projects" :key="project.project_id"
                  class="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">

                  <!-- Project header -->
                  <div class="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
                    <div class="flex items-center gap-2 min-w-0">
                      <span class="h-1.5 w-1.5 rounded-full flex-shrink-0" :class="statusDot(project.project_status)"></span>
                      <span class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{{ project.project_name || 'Untitled Project' }}</span>
                    </div>
                    <StatusBadge :value="project.project_status" />
                  </div>

                  <!-- Project fields -->
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3.5 px-4 py-4">
                    <ProjectField label="Start Date" :value="formatDate(project.start_date)" />
                    <ProjectField label="End Date" :value="formatDate(project.end_date)" />
                    <ProjectField label="Extended Date" :value="formatDate(project.extended_date)" />
                    <ProjectField label="Created By" :value="project.created_by" />
                    <ProjectField label="Members" :value="project.members?.length ? project.members.join(', ') : 'None'" />
                    <ProjectField v-if="project.follow_up" label="Follow Up" :value="project.follow_up" />
                  </div>

                  <!-- Contract / Tender -->
                  <div v-if="project.contract || project.tender"
                    class="border-t border-gray-100 dark:border-gray-800 px-4 py-3 bg-gray-50/50 dark:bg-gray-800/20 flex flex-wrap gap-6">
                    <div v-if="project.contract">
                      <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Contract</p>
                      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ project.contract.title || '—' }}</p>
                      <StatusBadge v-if="project.contract.status" :value="project.contract.status" class="mt-1" />
                    </div>
                    <div v-if="project.tender">
                      <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Tender</p>
                      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ project.tender.title || '—' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 py-10 text-center">
                <p class="text-sm text-gray-400">No projects assigned</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex-shrink-0 border-t border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-end">
            <button @click="closeModal"
              class="rounded-lg border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-all">
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const toast = useToast()
const users = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const selectedUser = ref(null)
const isLoading = ref(false)
const isExporting = ref(false)

onMounted(() => fetchUsers())

async function fetchUsers() {
  isLoading.value = true
  try {
    const response = await axios.get('/api/users-with-project-summary')
    if (response.data.status) {
      users.value = response.data.data || []
    } else {
      throw new Error(response.data.message)
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to load engineers data')
  } finally {
    isLoading.value = false
  }
}

const filteredUsers = computed(() => {
  const term = filter.value.toLowerCase().trim()
  if (!term) return users.value
  return users.value.filter(u =>
    u.name?.toLowerCase().includes(term) ||
    u.email?.toLowerCase().includes(term)
  )
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredUsers.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage) || 1)

const visiblePages = computed(() => {
  const total = totalPages.value, cur = currentPage.value
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  if (cur <= 3) return [1, 2, 3, 4, 5]
  if (cur >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total]
  return [cur - 2, cur - 1, cur, cur + 1, cur + 2].filter(p => p >= 1 && p <= total)
})

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

function openModal(user) {
  selectedUser.value = { ...user, projects: user.projects || [] }
  document.body.style.overflow = 'hidden'
}
function closeModal() {
  selectedUser.value = null
  document.body.style.overflow = ''
}
function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}
function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
}
function statusDot(val) {
  const v = (val || '').toLowerCase()
  if (v.includes('complete') || v.includes('done') || v.includes('active')) return 'bg-teal-500'
  if (v.includes('progress') || v.includes('ongoing') || v.includes('pending')) return 'bg-amber-400'
  if (v.includes('fail') || v.includes('cancel')) return 'bg-rose-500'
  return 'bg-gray-400'
}

async function exportToExcel() {
  isExporting.value = true
  try {
    const rows = filteredUsers.value.map((u, i) => ({
      No: i + 1, Name: u.name || '—', Email: u.email || '—',
      Status: u.status === 'is_active' ? 'Active' : 'Inactive',
      Role: u.role || '—', Department: u.department || '—',
      'Total Projects': u.total_projects || 0, 'On Progress': u.on_progress_projects || 0,
      Completed: u.completed_projects || 0, Failed: u.failed_projects || 0
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Engineers')
    XLSX.writeFile(wb, `Engineers_With_Projects_${new Date().toISOString().slice(0, 10)}.xlsx`)
    toast.success('Exported successfully')
  } catch { toast.error('Export failed') } finally { isExporting.value = false }
}

function exportToPDF() {
  isExporting.value = true
  try {
    const doc = new jsPDF()
    doc.setFontSize(14)
    doc.text('Engineers With Projects', 14, 18)
    autoTable(doc, {
      head: [['No', 'Name', 'Email', 'Status', 'Role', 'Dept', 'Total', 'Progress', 'Done', 'Failed']],
      body: filteredUsers.value.map((u, i) => [
        i + 1, u.name || '—', u.email || '—',
        u.status === 'is_active' ? 'Active' : 'Inactive',
        u.role || '—', u.department || '—',
        u.total_projects || 0, u.on_progress_projects || 0,
        u.completed_projects || 0, u.failed_projects || 0
      ]),
      startY: 26,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [15, 118, 110], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    })
    doc.save(`Engineers_With_Projects_${new Date().toISOString().slice(0, 10)}.pdf`)
    toast.success('Exported successfully')
  } catch { toast.error('Export failed') } finally { isExporting.value = false }
}
</script>

<script>
const StatusBadge = {
  props: ['value'],
  template: `<span v-if="value" :class="cls" class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold">{{ value }}</span>`,
  computed: {
    cls() {
      const v = (this.value || '').toLowerCase()
      if (v.includes('active') || v.includes('complete') || v.includes('done'))
        return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
      if (v.includes('progress') || v.includes('ongoing') || v.includes('pending'))
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
      if (v.includes('fail') || v.includes('cancel') || v.includes('inactive'))
        return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
    }
  }
}

const InfoTile = {
  props: ['label', 'value', 'color'],
  template: `
    <div :class="bg" class="rounded-lg px-3.5 py-3 border">
      <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{{ label }}</p>
      <p :class="vc" class="text-sm font-bold truncate">{{ value ?? '—' }}</p>
    </div>
  `,
  computed: {
    bg() {
      return { amber: 'bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-800/20', teal: 'bg-teal-50 border-teal-100 dark:bg-teal-900/10 dark:border-teal-800/20' }[this.color]
        || 'bg-gray-50 border-gray-100 dark:bg-gray-800/40 dark:border-gray-700/50'
    },
    vc() {
      return { amber: 'text-amber-600 dark:text-amber-400', teal: 'text-teal-600 dark:text-teal-400' }[this.color] || 'text-gray-800 dark:text-gray-100'
    }
  }
}

const ProjectField = {
  props: ['label', 'value'],
  template: `
    <div>
      <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{{ label }}</p>
      <p class="text-sm text-gray-700 dark:text-gray-300">{{ value || '—' }}</p>
    </div>
  `
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.overflow-y-auto::-webkit-scrollbar { width: 4px; }
.overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
.overflow-y-auto::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 9999px; }
.dark .overflow-y-auto::-webkit-scrollbar-thumb { background: #374151; }
</style>