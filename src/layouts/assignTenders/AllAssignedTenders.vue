<template>
  <div class="min-h-screen bg-[#edf4fb] px-4 py-4 lg:px-5">
    <div class="mx-auto max-w-[1580px]">

      <!-- Header -->
      <div class="mb-5 flex items-start justify-between gap-4">
        <div class="flex min-w-0 items-start gap-4">
          <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white shadow-[0_16px_34px_rgba(35,96,182,0.26)]">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <div class="min-w-0">
            <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2d6aaf]">Engineer Portal</p>
            <h1 class="mt-1 text-2xl font-bold tracking-tight text-[#183b63] lg:text-[28px]">Assigned Tenders</h1>
            <p class="mt-1.5 max-w-2xl text-sm leading-6 text-[#67819d]">View and manage tenders assigned to engineers</p>
          </div>
        </div>
        <router-link to="/assign-tender">
          <button class="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(35,96,182,0.24)] transition-all hover:brightness-105">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Assign Tender
          </button>
        </router-link>
      </div>

      <!-- Search -->
      <div class="mb-4 rounded-2xl border border-[#d9e6f3] bg-white/95 px-5 py-3 shadow-[0_8px_18px_rgba(18,58,99,0.05)]">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#87a0bb]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input v-model="filter" type="text" placeholder="Search by title, engineer, or tender number..."
            class="w-full rounded-xl border border-[#d7e4f1] bg-white px-4 py-2.5 pl-10 text-sm text-[#183b63] placeholder-[#99afc5] shadow-[inset_0_1px_2px_rgba(14,40,79,0.04)] focus:border-[#2b74d7] focus:outline-none focus:ring-4 focus:ring-[#2b74d7]/12" />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <div class="h-10 w-10 animate-spin rounded-full border-[3px] border-[#2b74d7] border-t-transparent"></div>
        <p class="mt-4 text-sm text-[#7a93af]">Loading assigned tenders...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="paginatedData.length === 0" class="rounded-[24px] border border-[#d9e6f3] bg-white p-12 text-center shadow-sm">
        <div class="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#e9f2ff] shadow-inner">
          <svg class="w-7 h-7 text-[#2b74d7]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
        </div>
        <p class="text-sm font-semibold text-[#183b63]">No assigned tenders found</p>
        <p class="mt-1 text-xs text-[#8aa0b7]">{{ filter ? 'Try adjusting your search.' : 'Get started by assigning a new tender.' }}</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-hidden rounded-[24px] border border-[#d9e6f3] bg-white shadow-[0_14px_34px_rgba(18,58,99,0.08)]">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-[#e6eef7] bg-[#f7faff]">
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">No</th>
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Title</th>
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Type</th>
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Procurement Entity</th>
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Number</th>
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Published</th>
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Submission</th>
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Status</th>
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Engineer</th>
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">File</th>
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#edf2f7]">
              <tr v-for="(tender, index) in paginatedData" :key="tender.assign_id" class="transition-colors hover:bg-[#f7faff]">
                <td class="px-5 py-3.5 text-[#7d94ac]">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="px-5 py-3.5 font-semibold text-[#183b63]">{{ tender.title || '—' }}</td>
                <td class="px-5 py-3.5 capitalize text-[#4d6782]">{{ tender.tender_type || '—' }}</td>
                <td class="px-5 py-3.5 text-[#4d6782]">{{ tender.procurement_entity || '—' }}</td>
                <td class="px-5 py-3.5 text-[#4d6782]">{{ tender.tender_number || '—' }}</td>
                <td class="px-5 py-3.5 text-[#6f86a0]">{{ formatDate(tender.date_of_Publication) }}</td>
                <td class="px-5 py-3.5 text-[#6f86a0]">{{ formatDate(tender.bid_submission) }}</td>
                <td class="px-5 py-3.5"><span :class="getStatusClass(tender)" class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold">{{ getStatusText(tender) }}</span></td>
                <td class="px-5 py-3.5 text-[#4d6782]">{{ tender.user_name || '—' }}</td>
                <td class="px-5 py-3.5">
                  <button v-if="tender.attachment" @click="downloadFile(tender.attachment)" class="rounded-xl border border-[#d5e3f0] bg-[#f7faff] px-3 py-1 text-xs font-semibold text-[#1f5aa6] hover:bg-[#eef5ff]">Download</button>
                  <span v-else class="text-[#a3b5c8]">—</span>
                </td>
                <td class="px-5 py-3.5">
                  <button @click="editAssignedTender(tender.assign_id)" class="rounded-xl border border-[#d5e3f0] bg-[#f7faff] px-3 py-1 text-xs font-semibold text-[#1f5aa6] hover:bg-[#eef5ff]" title="Edit">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between border-t border-[#e6eef7] bg-[#f9fbff] px-5 py-3">
          <p class="text-xs text-[#7a93af]">{{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredData.length) }} of {{ filteredData.length }}</p>
          <div class="flex items-center gap-1">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="rounded-lg border border-[#d7e4f1] p-1.5 text-[#6f86a0] hover:bg-[#f3f8ff] disabled:opacity-40">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span class="px-2 text-xs font-medium text-[#4d6782]">{{ currentPage }}</span>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage * itemsPerPage >= filteredData.length" class="rounded-lg border border-[#d7e4f1] p-1.5 text-[#6f86a0] hover:bg-[#f3f8ff] disabled:opacity-40">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const assignedTenders = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const isLoading = ref(false)

onMounted(() => {
  fetchData()
})

async function fetchData() {
  isLoading.value = true
  try {
    const response = await axios.get('api/assign/tender')
    assignedTenders.value = response.data.data.map(t => ({
      assign_id: t.assign_id,
      title: t.tender?.title || '—',
      tender_type: t.tender?.tender_type || '—',
      procurement_entity: t.tender?.procurement_entity || '—',
      tender_number: t.tender?.tender_number || '—',
      date_of_Publication: t.tender?.date_of_Publication || null,
      bid_submission: t.tender?.bid_submission || null,
      expired_at: t.tender?.expired_at || null,
      user_name: t.user?.name || '—',
      attachment: t.tender?.attachment || null,
      is_assigned: t.is_assigned
    }))
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to load assigned tenders')
  } finally {
    isLoading.value = false
  }
}

const filteredData = computed(() => {
  const term = filter.value.toLowerCase().trim()
  if (!term) return assignedTenders.value

  return assignedTenders.value.filter(t =>
    t.title.toLowerCase().includes(term) ||
    t.user_name.toLowerCase().includes(term) ||
    t.tender_number.toLowerCase().includes(term)
  )
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredData.value.slice(start, start + itemsPerPage)
})

function changePage(page) {
  if (page < 1 || page > Math.ceil(filteredData.value.length / itemsPerPage)) return
  currentPage.value = page
}

function getStatusText(tender) {
  if (tender.is_assigned === 'submitted') return 'Submitted'
  if (tender.is_assigned === 'awarded') return 'Awarded'
  if (tender.is_assigned === 'approved') return 'Approved'
  if (tender.is_assigned === 'rejected') return 'Rejected'
  if (tender.is_assigned === 'quoted') return 'Quoted'
  return 'Due: ' + formatDate(tender.expired_at)
}

function getStatusClass(tender) {
  if (tender.is_assigned === 'submitted') return 'bg-emerald-100 text-emerald-700'
  if (tender.is_assigned === 'awarded') return 'bg-[#e6f7f4] text-[#166d62]'
  if (tender.is_assigned === 'approved') return 'bg-green-100 text-green-700'
  if (tender.is_assigned === 'rejected') return 'bg-red-100 text-red-700'
  if (tender.is_assigned === 'quoted') return 'bg-indigo-100 text-indigo-700'
  if (!tender.expired_at) return 'bg-[#edf4ff] text-[#2d6aaf]'
  const now = new Date()
  const expiry = new Date(tender.expired_at)
  const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
  if (now > expiry) return 'bg-red-100 text-red-700'
  if (diffDays <= 3) return 'bg-amber-100 text-amber-700'
  if (diffDays <= 7) return 'bg-amber-50 text-amber-600'
  return 'bg-green-100 text-green-700'
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function downloadFile(url) {
  if (!url) {
    toast.error('No file available')
    return
  }

  window.open(url, '_blank')
}

function editAssignedTender(assignId) {
  router.push({ name: 'EditAssignedTender', params: { assign_id: assignId } })
}
</script>
