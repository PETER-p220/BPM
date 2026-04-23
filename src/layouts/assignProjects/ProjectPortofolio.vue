<template>
  <div class="min-h-screen font-['DM_Sans',sans-serif] transition-colors duration-300" style="background:radial-gradient(circle at top right,rgba(48,120,221,0.08),transparent 22%),linear-gradient(180deg,#eff5fb 0%,#eaf1f8 100%)">
    <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="mb-8 rounded-2xl px-6 py-5 shadow-sm border border-[#dce7f3]" style="background:linear-gradient(135deg,#eef5ff 0%,#ffffff 46%,#f7fbff 100%)">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-xl md:text-2xl font-bold text-[#183b63]">Engineers with Projects</h1>
            <p class="text-[13px] text-[#7a93af]">Project assignments and performance overview</p>
          </div>
          <div class="flex gap-2" v-if="filteredUsers.length">
            <button @click="exportToExcel" :disabled="exporting"
              class="px-4 py-2.5 rounded-xl font-semibold text-sm border border-[#1f9d8b]/30 text-[#1f9d8b] bg-[#edfaf7] hover:bg-[#d4f3ec] transition-all flex items-center gap-2">
              <svg class="h-3.5 w-3.5 text-[#1f9d8b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Excel
            </button>
            <button @click="exportToPDF" :disabled="exporting"
              class="px-4 py-2.5 rounded-xl font-semibold text-sm border border-[#e87461]/30 text-[#e87461] bg-[#fef2f0] hover:bg-[#fde3df] transition-all flex items-center gap-2">
              <svg class="h-3.5 w-3.5 text-[#e87461]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Search -->
      <div class="mb-4 relative max-w-xs">
        <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a4b8cf]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="filter" type="text" placeholder="Search name or email…"
          class="w-full rounded-xl border border-[#d9e6f3] bg-white py-2 pl-9 pr-8 text-sm text-[#183b63] placeholder:text-[#a4b8cf] focus:border-[#2f78dd] focus:outline-none focus:ring-2 focus:ring-[#2f78dd]/20 shadow-sm" />
        <button v-if="filter" @click="filter = ''" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a4b8cf] hover:text-[#183b63]">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-hidden rounded-2xl border border-[#dce7f3] bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-[#edf2fa] bg-[#f7faff]">
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac] w-10">#</th>
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Engineer</th>
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Email</th>
                <th class="px-5 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Total</th>
                <th class="px-5 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-500/80">Progress</th>
                <th class="px-5 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1f9d8b]">Done</th>
                <th class="px-5 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-400/80">Failed</th>
                <th class="px-5 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#edf2fa]">
              <tr v-for="(user, index) in paginatedUsers" :key="user.user_id"
                class="hover:bg-[#f7faff] transition-colors">
                <td class="px-5 py-3.5 text-xs text-[#67819d]">{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-2.5">
                    <div class="h-8 w-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style="background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);">
                      {{ getInitials(user.name) }}
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-[#183b63]">{{ user.name || '—' }}</p>
                      <p v-if="user.role || user.department" class="text-xs text-[#7a93af]">{{ user.role || user.department }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-3.5 text-sm text-[#4a6a8a]">{{ user.email || '—' }}</td>
                <td class="px-5 py-3.5 text-center">
                  <span class="inline-flex h-6 min-w-[26px] items-center justify-center rounded-md bg-[#edf4fb] px-1.5 text-xs font-semibold text-[#2f78dd]">{{ user.total_projects || 0 }}</span>
                </td>
                <td class="px-5 py-3.5 text-center">
                  <span class="inline-flex h-6 min-w-[26px] items-center justify-center rounded-md bg-amber-50 px-1.5 text-xs font-semibold text-amber-600">{{ user.on_progress_projects || 0 }}</span>
                </td>
                <td class="px-5 py-3.5 text-center">
                  <span class="inline-flex h-6 min-w-[26px] items-center justify-center rounded-md bg-[#edfaf7] px-1.5 text-xs font-semibold text-[#1f9d8b]">{{ user.completed_projects || 0 }}</span>
                </td>
                <td class="px-5 py-3.5 text-center">
                  <span class="inline-flex h-6 min-w-[26px] items-center justify-center rounded-md bg-rose-50 px-1.5 text-xs font-semibold text-rose-600">{{ user.failed_projects || 0 }}</span>
                </td>
                <td class="px-5 py-3.5 text-right">
                  <button @click="openModal(user)"
                    class="rounded-xl border border-[#d9e6f3] bg-white px-3 py-1.5 text-xs font-semibold text-[#4a6a8a] hover:bg-[#f7faff] hover:border-[#2f78dd]/30 transition-all shadow-sm">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty -->
        <div v-if="!isLoading && paginatedUsers.length === 0" class="py-16 text-center">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style="background:#edf4fb;">
            <i class="fas fa-users text-xl" style="color:#a4b8cf;"></i>
          </div>
          <p class="text-sm font-medium text-[#7a93af]">{{ filter ? 'No engineers match your search.' : 'No engineers found.' }}</p>
        </div>
        <div v-else-if="isLoading" class="py-16 text-center">
          <div class="inline-block h-7 w-7 animate-spin rounded-full border-4 border-[#edf2fa] border-t-[#2f78dd] mb-2"></div>
          <p class="text-sm text-[#7a93af]">Loading…</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredUsers.length > itemsPerPage" class="mt-5 flex items-center justify-between">
        <p class="text-xs text-[#7a93af]">
          {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} of {{ filteredUsers.length }}
        </p>
        <div class="flex items-center gap-1">
          <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)"
            class="flex h-7 w-7 items-center justify-center rounded-xl border border-[#d9e6f3] text-[#4a6a8a] hover:bg-[#f7faff] disabled:opacity-30 transition-all">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button v-for="page in visiblePages" :key="page" @click="changePage(page)"
            :class="['flex h-7 w-7 items-center justify-center rounded-xl text-xs font-semibold transition-all',
              page === currentPage ? 'text-white border-[#2f78dd] shadow-md' : 'border border-[#d9e6f3] text-[#4a6a8a] hover:bg-[#f7faff]']"
            :style="page === currentPage ? 'background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);' : ''">
            {{ page }}
          </button>
          <button :disabled="currentPage >= totalPages" @click="changePage(currentPage + 1)"
            class="flex h-7 w-7 items-center justify-center rounded-xl border border-[#d9e6f3] text-[#4a6a8a] hover:bg-[#f7faff] disabled:opacity-30 transition-all">
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
          class="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#dce7f3]"
          @click.stop>

          <!-- Modal Header -->
          <div class="flex items-center gap-4 px-6 py-5 border-b border-[#edf2fa] flex-shrink-0">
            <div class="h-11 w-11 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow" style="background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);">
              {{ getInitials(selectedUser.name) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-base font-bold text-[#183b63] truncate">{{ selectedUser.name || '—' }}</p>
              <p class="text-xs text-[#7a93af] truncate">{{ selectedUser.email || '—' }}</p>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <StatusBadge :value="selectedUser.status" />
              <button @click="closeModal"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-[#a4b8cf] hover:bg-[#f7faff] hover:text-[#183b63] transition-all">
                <svg class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Scrollable Body -->
          <div class="flex-1 overflow-y-auto px-6 py-5 space-y-6">

            <!-- Info Row -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <InfoTile label="Role" :value="selectedUser.role" />
              <InfoTile label="Department" :value="selectedUser.department" />
              <InfoTile label="In Progress" :value="selectedUser.on_progress_projects" color="amber" />
              <InfoTile label="Completed" :value="selectedUser.completed_projects" color="teal" />
            </div>

            <!-- Projects -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <p class="text-xs font-bold uppercase tracking-widest text-[#7d94ac]">Projects</p>
                <span class="text-xs font-semibold text-[#4a6a8a] bg-[#edf4fb] rounded-full px-2 py-0.5">{{ selectedUser.projects?.length || 0 }}</span>
              </div>

              <div v-if="selectedUser.projects?.length" class="space-y-2.5">
                <div v-for="project in selectedUser.projects" :key="project.project_id"
                  class="rounded-xl border border-[#edf2fa] overflow-hidden">

                  <!-- Project title row -->
                  <div class="flex items-center justify-between px-4 py-3 bg-[#f7faff]">
                    <div class="flex items-center gap-2 min-w-0">
                      <span class="h-1.5 w-1.5 rounded-full flex-shrink-0" :class="statusDot(project.project_status)"></span>
                      <span class="text-sm font-semibold text-[#183b63] truncate">{{ project.project_name || 'Unnamed' }}</span>
                    </div>
                    <StatusBadge :value="project.project_status" />
                  </div>

                  <!-- Project detail grid -->
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3.5 px-4 py-4">
                    <ProjectField label="Start Date" :value="formatDate(project.start_date)" />
                    <ProjectField label="End Date" :value="formatDate(project.end_date)" />
                    <ProjectField label="Extended Date" :value="formatDate(project.extended_date)" />
                    <ProjectField label="Follow Up" :value="project.follow_up" />
                    <ProjectField label="Created By" :value="project.created_by" />
                    <ProjectField label="Members" :value="project.members?.length ? project.members.join(', ') : 'None'" />
                    <ProjectField v-if="project.contract?.title" label="Contract" :value="project.contract.title" />
                    <ProjectField v-if="project.contract?.status" label="Contract Status" :value="project.contract.status" :badge="true" />
                  </div>
                </div>
              </div>

              <div v-else class="rounded-xl border border-dashed border-[#d9e6f3] py-10 text-center">
                <p class="text-sm text-[#7a93af]">No projects assigned</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex-shrink-0 border-t border-[#edf2fa] px-6 py-4 flex justify-end">
            <button @click="closeModal"
              class="rounded-xl border border-[#d9e6f3] px-5 py-2 text-sm font-semibold text-[#4a6a8a] hover:bg-[#f7faff] transition-all">
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
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
const exporting = ref(false)
const isLoading = ref(false)

onMounted(() => fetchUsers())

async function fetchUsers() {
  isLoading.value = true
  try {
    const { data } = await axios.get('/api/users-with-project-summary')
    if (data.status) users.value = data.data || []
  } catch {
    toast.error('Failed to load engineer data')
  } finally {
    isLoading.value = false
  }
}

const filteredUsers = computed(() => {
  if (!filter.value.trim()) return users.value
  const term = filter.value.toLowerCase()
  return users.value.filter(u =>
    (u.name || '').toLowerCase().includes(term) ||
    (u.email || '').toLowerCase().includes(term)
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
function exportToExcel() {
  exporting.value = true
  try {
    const rows = filteredUsers.value.map((u, i) => ({
      No: i + 1, Name: u.name || '—', Email: u.email || '—', Status: u.status || '—',
      Role: u.role || '—', Department: u.department || '—',
      'Total Projects': u.total_projects || 0, 'On Progress': u.on_progress_projects || 0,
      Completed: u.completed_projects || 0, Failed: u.failed_projects || 0
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Engineers')
    XLSX.writeFile(wb, 'engineers_with_projects.xlsx')
    toast.success('Exported successfully')
  } catch { toast.error('Export failed') } finally { exporting.value = false }
}
function exportToPDF() {
  exporting.value = true
  try {
    const doc = new jsPDF()
    autoTable(doc, {
      head: [['No', 'Name', 'Email', 'Status', 'Role', 'Dept', 'Total', 'Progress', 'Done', 'Failed']],
      body: filteredUsers.value.map((u, i) => [
        i + 1, u.name || '—', u.email || '—', u.status || '—', u.role || '—', u.department || '—',
        u.total_projects || 0, u.on_progress_projects || 0, u.completed_projects || 0, u.failed_projects || 0
      ]),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [25, 79, 146], textColor: 255 },
      margin: { top: 20 }
    })
    doc.save('engineers_with_projects.pdf')
    toast.success('Exported successfully')
  } catch { toast.error('Export failed') } finally { exporting.value = false }
}
</script>

<script>
const StatusBadge = {
  props: ['value'],
  template: `
    <span v-if="value" :class="cls" class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold">{{ value }}</span>
  `,
  computed: {
    cls() {
      const v = (this.value || '').toLowerCase()
      if (v.includes('active') || v.includes('complete') || v.includes('done'))
        return 'bg-[#edfaf7] text-[#1f9d8b]'
      if (v.includes('progress') || v.includes('ongoing') || v.includes('pending'))
        return 'bg-amber-50 text-amber-700'
      if (v.includes('fail') || v.includes('cancel') || v.includes('inactive'))
        return 'bg-rose-50 text-rose-700'
      return 'bg-[#edf4fb] text-[#4a6a8a]'
    }
  }
}

const InfoTile = {
  props: ['label', 'value', 'color'],
  template: `
    <div :class="bg" class="rounded-lg px-3.5 py-3 border">
      <p class="text-[10px] font-bold uppercase tracking-wider text-[#7d94ac] mb-0.5">{{ label }}</p>
      <p :class="vc" class="text-sm font-bold truncate">{{ value ?? '—' }}</p>
    </div>
  `,
  computed: {
    bg() {
      return {
        amber: 'bg-amber-50 border-amber-100',
        teal:  'bg-[#edfaf7] border-[#1f9d8b]/20',
      }[this.color] || 'bg-[#f7faff] border-[#edf2fa]'
    },
    vc() {
      return {
        amber: 'text-amber-600',
        teal:  'text-[#1f9d8b]',
      }[this.color] || 'text-[#183b63]'
    }
  }
}

const ProjectField = {
  props: ['label', 'value', 'badge'],
  components: { StatusBadge },
  template: `
    <div>
      <p class="text-[10px] font-bold uppercase tracking-wider text-[#7d94ac] mb-0.5">{{ label }}</p>
      <StatusBadge v-if="badge" :value="value" />
      <p v-else class="text-sm text-[#4a6a8a]">{{ value || '—' }}</p>
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