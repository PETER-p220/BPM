<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col border border-gray-200" style="max-height: 92vh;">

        <!-- Modal Header -->
        <div class="bg-white border-b border-gray-200 px-7 py-5 flex-shrink-0">
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-start gap-4 min-w-0">
              <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                  <line x1="9" y1="15" x2="15" y2="15" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                </svg>
              </div>
              <div class="min-w-0">
                <h2 class="text-xl font-bold text-gray-900">Register New Tender</h2>
                <p class="mt-1 text-sm text-gray-500">Capture source, schedule, and attachment details in one step.</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="addTender"
                :disabled="isLoading"
                class="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
              >
                <svg v-if="!isLoading" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 6 9 17l-5-5"/>
                </svg>
                <svg v-else class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" stroke-opacity=".25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"/>
                </svg>
                {{ isLoading ? 'Saving…' : 'Save Tender' }}
              </button>
              <button
                @click="closeModal"
                class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="flex-1 overflow-y-auto px-7 py-6">
          <div class="grid h-full grid-cols-[1.2fr_0.8fr] gap-6">
            <!-- Form Card -->
            <div class="grid grid-cols-2 gap-x-5 gap-y-4 rounded-xl border border-gray-200 bg-white p-5">

              <!-- Row 1: Title + Number -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wide text-gray-700">Tender Title</label>
                <input
                  type="text"
                  class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/25"
                  placeholder="e.g. Supply of Office Equipment"
                  v-model="newTenderData.title"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wide text-gray-700">Tender Number</label>
                <input
                  type="text"
                  class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/25"
                  placeholder="e.g. TDR-2024-089"
                  v-model="newTenderData.tender_number"
                />
              </div>

              <!-- Row 2: Source + Entity -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wide text-gray-700">Tender Source</label>
                <input
                  type="text"
                  class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/25"
                  placeholder="e.g. Government Portal"
                  v-model="newTenderData.tender_source"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wide text-gray-700">Procurement Entity</label>
                <input
                  type="text"
                  class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/25"
                  placeholder="e.g. Ministry of Finance"
                  v-model="newTenderData.procurement_entity"
                />
              </div>

              <!-- Row 3: Type + Publication Date -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wide text-gray-500">Tender Type</label>
                <div class="relative">
                  <select
                    class="h-10 w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-9 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    v-model="newTenderData.tender_type"
                  >
                    <option value="" disabled>Select a type…</option>
                    <option value="goods">Goods</option>
                    <option value="works">Works</option>
                    <option value="consultancy">Consultancy</option>
                    <option value="non-consultancy">Non-Consultancy</option>
                  </select>
                  <svg class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m6 9 6 6 6-6"/>
                  </svg>
                </div>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wide text-gray-700">Date of Publication</label>
                <input
                  type="date"
                  style="color-scheme: light;"
                  class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/25"
                  v-model="newTenderData.date_of_Publication"
                />
              </div>

              <!-- Row 4: Bid Submission + Expiration -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wide text-gray-700">Bid Submission Date</label>
                <input
                  type="date"
                  style="color-scheme: light;"
                  class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/25"
                  v-model="newTenderData.bid_submission"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wide text-gray-700">Expiration Date</label>
                <input
                  type="date"
                  style="color-scheme: light;"
                  class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/25"
                  v-model="newTenderData.expired_at"
                />
              </div>
            </div>

            <!-- Attachment Panel -->
            <div class="flex min-h-0 flex-col rounded-xl border border-gray-200 bg-white p-5">
              <div>
                <h3 class="text-base font-bold text-gray-900">Attachment</h3>
                <p class="mt-1 text-xs text-gray-600">Drop the tender document here or browse from your computer.</p>
              </div>

              <div
                class="mt-4 flex min-h-0 flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-5 text-center transition-all"
                :class="dragover ? 'border-blue-600 bg-blue-50' : selectedFileName ? 'border-blue-500 bg-white' : 'border-gray-300 bg-white hover:border-blue-600 hover:bg-blue-50'"
                @dragover.prevent="dragover = true"
                @dragleave.prevent="dragover = false"
                @drop.prevent="handleDrop"
                @click="triggerFileInput"
              >
                <input ref="fileInput" type="file" style="display:none" @change="handleFileUpload" />

                <div v-if="!selectedFileName" class="flex flex-col items-center">
                  <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                  </div>
                  <p class="mt-4 text-sm font-semibold text-gray-900">Drag and drop your tender file</p>
                  <p class="mt-1 text-xs text-gray-600">or <span class="font-semibold text-blue-600 underline underline-offset-2">browse from device</span></p>
                  <p class="mt-4 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-[11px] font-medium text-blue-700">PDF, DOC, DOCX, XLS up to 10 MB</p>
                </div>

                <div v-else class="flex w-full flex-col items-start rounded-lg border border-gray-200 bg-white p-4 text-left" @click.stop>
                  <div class="flex w-full items-center gap-3">
                    <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-sm font-semibold text-gray-900">{{ selectedFileName }}</p>
                      <p class="mt-0.5 text-xs text-gray-500">{{ selectedFileSize }}</p>
                    </div>
                    <button
                      @click.stop="removeFile"
                      class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 transition-colors hover:bg-red-100"
                    >
                      <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6 6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                  <div class="mt-3 flex w-full items-center justify-between rounded-lg bg-green-50 px-3 py-2">
                    <span class="text-xs font-medium text-green-700">Ready for upload</span>
                    <span class="text-xs font-semibold text-green-600">Attached</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>


<script setup>
import { ref } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()
const fileInput = ref(null)
const dragover = ref(false)
const selectedFileName = ref('')
const selectedFileSize = ref('')

const newTenderData = ref({
  title: '',
  tender_source: '',
  procurement_entity: '',
  tender_number: '',
  tender_type: '',
  date_of_Publication: '',
  expired_at: '',
  bid_submission: '',
  attachment: null,
})
const isLoading = ref(false)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) setFile(file)
}

function handleDrop(event) {
  dragover.value = false
  const file = event.dataTransfer.files[0]
  if (file) setFile(file)
}

function setFile(file) {
  newTenderData.value.attachment = file
  selectedFileName.value = file.name
  selectedFileSize.value = file.size > 1024 * 1024
    ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
    : (file.size / 1024).toFixed(0) + ' KB'
}

function removeFile() {
  newTenderData.value.attachment = null
  selectedFileName.value = ''
  selectedFileSize.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

async function addTender() {
  isLoading.value = true
  try {
    const formData = new FormData()
    formData.append('title',                newTenderData.value.title)
    formData.append('tender_source',        newTenderData.value.tender_source)
    formData.append('procurement_entity',   newTenderData.value.procurement_entity)
    formData.append('tender_number',        newTenderData.value.tender_number)
    formData.append('tender_type',          newTenderData.value.tender_type)
    formData.append('date_of_Publication',  newTenderData.value.date_of_Publication)
    formData.append('expired_at',           newTenderData.value.expired_at)
    formData.append('bid_submission',       newTenderData.value.bid_submission)
    if (newTenderData.value.attachment) {
      formData.append('attachment', newTenderData.value.attachment)
    }

    const response = await axios.post('/api/tenders', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    if (response.data.status === 'success') {
      toast.success(response.data.message)
      resetForm()
    } else {
      toast.error(response.data.message)
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      Object.values(error.response.data.errors).flat().forEach(msg => toast.error(msg))
    } else {
      toast.error('An error occurred while creating the tender.')
    }
  } finally {
    isLoading.value = false
  }
}

function resetForm() {
  newTenderData.value = {
    title: '', tender_source: '', procurement_entity: '',
    tender_number: '', tender_type: '', date_of_Publication: '',
    expired_at: '', bid_submission: '', attachment: null,
  }
  removeFile()
}

function closeModal() {
  router.back()
}
</script>
