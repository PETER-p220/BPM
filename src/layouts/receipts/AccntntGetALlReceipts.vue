<template>
  <div class="min-h-screen pb-12" style="background: radial-gradient(circle at top right, rgba(48,120,221,0.08), transparent 22%), linear-gradient(180deg, #eff5fb 0%, #eaf1f8 100%);">
    <!-- Sticky Header -->
    <div class="sticky top-0 z-10 border-b px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8"
         style="background: rgba(255,255,255,0.92); border-color: #d9e6f3;">
      <div class="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight" style="color:#183b63;">Receipts</h1>
          <p class="mt-1 text-sm" style="color:#67819d;">{{ filteredReceipts.length }} receipts found</p>
        </div>
        <div class="flex w-full items-center gap-4 sm:w-auto">
          <div class="relative flex-1 sm:w-72 sm:flex-none">
            <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="h-4 w-4" style="color:#9ab8d8;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input v-model="filter" type="search" placeholder="Search receipts..."
                   class="w-full rounded-[10px] py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
                   style="border: 1.5px solid #d6e4f2; background: #f8fbff; color: #183b63;" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24">
        <svg class="mb-4 h-10 w-10 animate-spin" style="color:#2f78dd;" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-base font-semibold" style="color:#183b63;">Loading receipts...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredReceipts.length === 0"
           class="rounded-[24px] border border-dashed py-24 text-center"
           style="border-color:#d9e6f3; background:#fff;">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style="background:#e9f2ff;">
          <svg class="h-8 w-8" style="color:#2b74d7;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold" style="color:#183b63;">No receipts found</h3>
        <p class="mt-1 text-sm" style="color:#8aa0b7;">
          {{ filter ? 'Try adjusting your search' : 'No receipts have been submitted yet' }}
        </p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-hidden rounded-[24px] border border-[#d9e6f3] bg-white shadow-[0_28px_70px_rgba(18,58,99,0.12)]">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead style="background: #f3f8ff;">
              <tr style="border-bottom: 1px solid #dce9f7;">
                <th class="w-16 px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">#</th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Submitted By</th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Description</th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Receipt File</th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Submitted At</th>
              </tr>
            </thead>
            <tbody class="divide-y" style="border-color: #e8f0f8;">
              <tr v-for="(receipt, index) in paginatedReceipts" :key="receipt.receipt_id"
                  class="cursor-pointer transition-colors hover:bg-[#f0f7ff]"
                  @click="openViewer(receipt)">
                <td class="whitespace-nowrap px-6 py-4 text-sm" style="color:#8aa0b7;">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 text-sm font-semibold" style="color:#183b63;">
                  {{ receipt.user_name || '—' }}
                </td>
                <td class="max-w-md truncate px-6 py-4 text-sm" style="color:#4e6781;">
                  {{ receipt.description || 'No description' }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm">
                  <div v-if="receipt.receipt_file" class="flex items-center gap-2">
                    <button @click.stop="openViewer(receipt)"
                            class="inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-semibold transition-colors"
                            style="background:#edf4ff; border:1px solid #c3d9f7; color:#1f5aa6;">
                      <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button @click.stop="downloadReceipt(receipt.receipt_file, receipt.description || 'receipt')"
                            class="inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-semibold transition-colors"
                            style="background: #f3f8ff; border: 1px solid #d7e4f1; color: #2d6aaf;">
                      <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </div>
                  <span v-else class="text-xs italic" style="color:#8aa0b7;">No file</span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm" style="color:#7a93af;">
                  {{ formatDate(receipt.created_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-6 py-4" style="border-top: 1px solid #e8f0f8; background: #fbfdff;">
          <div class="text-sm" style="color:#7a93af;">
            Showing
            <span class="font-semibold" style="color:#183b63;">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>–
            <span class="font-semibold" style="color:#183b63;">{{ Math.min(currentPage * itemsPerPage, filteredReceipts.length) }}</span> of
            <span class="font-semibold" style="color:#183b63;">{{ filteredReceipts.length }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)"
                    class="flex h-9 w-9 items-center justify-center rounded-[8px] transition-all disabled:opacity-40"
                    style="border: 1px solid #d9e6f3; color: #7a93af;">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button :disabled="currentPage * itemsPerPage >= filteredReceipts.length" @click="changePage(currentPage + 1)"
                    class="flex h-9 w-9 items-center justify-center rounded-[8px] transition-all disabled:opacity-40"
                    style="border: 1px solid #d9e6f3; color: #7a93af;">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Receipt Viewer Lightbox -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="viewingReceipt" class="fixed inset-0 z-50 flex items-center justify-center p-4"
           style="background: rgba(5,20,45,0.88); backdrop-filter: blur(8px);"
           @click.self="viewingReceipt = null">
        <div class="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[24px] bg-white"
             style="box-shadow: 0 40px 100px rgba(0,0,0,0.45);">
          <!-- Header -->
          <div class="flex shrink-0 items-center justify-between px-5 py-3.5"
               style="border-bottom: 1px solid #e8f0f8; background: linear-gradient(135deg,#eef5ff 0%,#ffffff 100%);">
            <div class="flex items-center gap-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-[10px] text-white"
                   style="background: linear-gradient(135deg,#194f92,#2f78dd);">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-bold" style="color:#183b63;">Receipt Preview</p>
                <p v-if="viewingReceipt.user_name" class="mt-0.5 text-xs" style="color:#7a93af;">{{ viewingReceipt.user_name }} &middot; {{ formatDate(viewingReceipt.created_at) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <a :href="viewingReceipt.receipt_file" target="_blank" download
                 class="inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-semibold"
                 style="background:#f3f8ff; border:1px solid #d7e4f1; color:#2d6aaf;">
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </a>
              <button @click="viewingReceipt = null"
                      class="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-[#eef5ff]" style="color:#7a93af;">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <!-- Description banner -->
          <div v-if="viewingReceipt.description" class="shrink-0 px-5 py-2.5" style="background:#f3f8ff; border-bottom:1px solid #e8f0f8;">
            <p class="text-xs" style="color:#4e6781;">{{ viewingReceipt.description }}</p>
          </div>
          <!-- Image / PDF body -->
          <div class="flex flex-1 items-center justify-center overflow-auto" style="background:#f0f4f9; min-height:200px;">
            <img v-if="isImageUrl(viewingReceipt.receipt_file)"
                 :src="viewingReceipt.receipt_file"
                 class="max-h-[75vh] object-contain p-4"
                 alt="Receipt" />
            <iframe v-else
                    :src="viewingReceipt.receipt_file"
                    class="h-[75vh] w-full border-0"
                    title="Receipt document"></iframe>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/axios'
import { saveAs } from 'file-saver'
import { useToast } from 'vue-toastification'

const toast = useToast()

const receipts = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const loading = ref(false)
const viewingReceipt = ref(null)

onMounted(() => {
  fetchReceipts()
})

async function fetchReceipts() {
  loading.value = true
  try {
    const { data } = await axios.get('api/receipts')
    receipts.value = data.data || []
  } catch (err) {
    console.error(err)
    toast.error('Failed to load receipts')
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function downloadReceipt(url, description = 'receipt') {
  if (!url) {
    toast.warning('No receipt file available')
    return
  }

  try {
    const response = await axios.get(url, { responseType: 'blob' })

    const contentType = response.headers['content-type'] || ''
    const extension = contentType.includes('pdf') ? 'pdf' :
                      contentType.includes('image') ? 'jpg' : 'file'

    const safeName = description
      .replace(/[^a-z0-9]/gi, '_')
      .substring(0, 40) || 'receipt'

    const fileName = `${safeName}_${new Date().toISOString().slice(0,10)}.${extension}`

    saveAs(response.data, fileName)
    toast.success('Download started')
  } catch (err) {
    console.error('Download failed:', err)
    toast.error('Could not download receipt. File may be unavailable.')
  }
}

const filteredReceipts = computed(() => {
  if (!filter.value.trim()) return receipts.value

  const term = filter.value.toLowerCase()
  return receipts.value.filter(r =>
    (r.user_name || '').toLowerCase().includes(term) ||
    (r.description || '').toLowerCase().includes(term) ||
    (r.created_at || '').toLowerCase().includes(term)
  )
})

const paginatedReceipts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredReceipts.value.slice(start, start + itemsPerPage)
})

function changePage(page) {
  if (page < 1 || page > Math.ceil(filteredReceipts.value.length / itemsPerPage)) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function openViewer(receipt) {
  if (receipt.receipt_file) viewingReceipt.value = receipt
}

function isImageUrl(url) {
  if (!url) return false
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>