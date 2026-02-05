<template>
  <div class="submit-analysis py-8 md:py-12 bg-gray-50 min-h-screen">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Card -->
      <div class="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <!-- Header -->
        <div class="bg-slate-800 px-6 py-5 text-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <i class="fas fa-chart-bar text-xl"></i>
            </div>
            <h2 class="text-xl font-semibold">Submit Analysis</h2>
          </div>

          <router-link
            to="/user/analyses"
            class="p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Close"
          >
            <i class="fas fa-times text-lg"></i>
          </router-link>
        </div>

        <!-- Form Body -->
        <div class="p-6 md:p-8">
          <p class="text-gray-600 mb-8">
            Upload your analysis for the selected project. All required fields are marked with *.
          </p>

          <form @submit.prevent="storeAnalysis" class="space-y-6">
            <!-- Project Selection -->
            <div>
              <label for="project" class="form-label">
                Select Project <span class="text-red-500">*</span>
              </label>
              <select
                id="project"
                v-model="analysisData.project_id"
                class="form-select"
                required
              >
                <option value="" disabled>Select project</option>
                <option v-for="project in projects" :key="project.project_id" :value="project.project_id">
                  {{ project.project_name }}
                </option>
              </select>
            </div>

            <!-- Tender (optional) -->
            <div>
              <label for="tender" class="form-label">Related Tender (Optional)</label>
              <select id="tender" v-model="analysisData.tender_id" class="form-select">
                <option value="">None / Not Applicable</option>
                <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">
                  {{ tender.title }}
                </option>
              </select>
            </div>

            <!-- File Upload -->
            <div>
              <label class="form-label">
                Upload Analysis File (Excel .xlsx/.xls) <span class="text-red-500">*</span>
              </label>
              <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50"
                @dragover.prevent
                @drop.prevent="handleDrop"
                @click="$refs.fileInput.click()"
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept=".xlsx,.xls"
                  class="hidden"
                  @change="handleFileUpload"
                />

                <div v-if="!analysisData.excel_file" class="space-y-2">
                  <i class="fas fa-file-excel text-4xl text-gray-400"></i>
                  <p class="text-sm text-gray-600">
                    Drag & drop Excel file here or <span class="text-blue-600 font-medium">browse</span>
                  </p>
                  <p class="text-xs text-gray-500">.xlsx or .xls only • Max 10MB</p>
                </div>

                <div v-else class="flex items-center justify-center gap-4 text-green-700">
                  <i class="fas fa-file-excel text-4xl"></i>
                  <div class="text-left">
                    <p class="font-medium">{{ analysisData.excel_file.name }}</p>
                    <p class="text-xs text-gray-500">
                      {{ (analysisData.excel_file.size / 1024 / 1024).toFixed(2) }} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    @click="clearFile"
                    class="ml-auto text-red-600 hover:text-red-800"
                  >
                    <i class="fas fa-times-circle"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Optional Fields Group -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label for="serial_number" class="form-label">Serial Number</label>
                <input
                  id="serial_number"
                  v-model="analysisData.serial_number"
                  type="text"
                  class="form-input"
                  placeholder="e.g. SN-001"
                />
              </div>

              <div>
                <label for="item_description" class="form-label">Item Description</label>
                <input
                  id="item_description"
                  v-model="analysisData.item_description"
                  type="text"
                  class="form-input"
                  placeholder="e.g. Concrete Grade 25"
                />
              </div>

              <div>
                <label for="quoted_quantity" class="form-label">Quoted Quantity</label>
                <input
                  id="quoted_quantity"
                  v-model.number="analysisData.quoted_quantity"
                  type="number"
                  min="0"
                  class="form-input"
                  placeholder="e.g. 150"
                />
              </div>

              <div>
                <label for="quoted_unit" class="form-label">Quoted Unit</label>
                <input
                  id="quoted_unit"
                  v-model="analysisData.quoted_unit"
                  type="text"
                  class="form-input"
                  placeholder="e.g. m³, pcs, kg"
                />
              </div>

              <div>
                <label for="quoted_rate" class="form-label">Quoted Rate</label>
                <input
                  id="quoted_rate"
                  v-model.number="analysisData.quoted_rate"
                  type="number"
                  step="0.01"
                  class="form-input"
                  placeholder="e.g. 120000.00"
                />
              </div>

              <div>
                <label for="quoted_amount" class="form-label">Quoted Amount</label>
                <input
                  id="quoted_amount"
                  v-model.number="analysisData.quoted_amount"
                  type="number"
                  step="0.01"
                  class="form-input"
                  placeholder="Calculated or manual"
                />
              </div>

              <div>
                <label for="quantity" class="form-label">Quantity</label>
                <input
                  id="quantity"
                  v-model.number="analysisData.quantity"
                  type="number"
                  min="0"
                  class="form-input"
                  placeholder="e.g. 120"
                />
              </div>

              <div>
                <label for="rate" class="form-label">Rate</label>
                <input
                  id="rate"
                  v-model.number="analysisData.rate"
                  type="number"
                  step="0.01"
                  class="form-input"
                  placeholder="e.g. 115000.00"
                />
              </div>

              <div>
                <label for="amount" class="form-label">Amount</label>
                <input
                  id="amount"
                  v-model.number="analysisData.amount"
                  type="number"
                  step="0.01"
                  class="form-input"
                  placeholder="Calculated or manual"
                />
              </div>

              <div>
                <label for="source" class="form-label">Source</label>
                <input
                  id="source"
                  v-model="analysisData.source"
                  type="text"
                  class="form-input"
                  placeholder="e.g. Supplier XYZ"
                />
              </div>

              <div>
                <label for="urgent_status" class="form-label">Urgent Status</label>
                <select id="urgent_status" v-model="analysisData.urgent_status" class="form-select">
                  <option value="">Not Specified</option>
                  <option value="urgent">Urgent</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                class="btn-primary flex-1 flex items-center justify-center gap-2"
                :disabled="isLoading || !isFormValid"
              >
                <span v-if="isLoading">
                  <i class="fas fa-spinner fa-spin"></i> Submitting........
                </span>
                <span v-else>
                  <i class="fas fa-upload"></i> Submit Analysis 
                </span>
              </button>

              <router-link
                to="/user/analyses"
                class="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <i class="fas fa-times"></i> Cancel
              </router-link>
            </div>
          </form>
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

const toast = useToast()
const router = useRouter()

const analysisData = ref({
  project_id: '',
  tender_id: '',
  excel_file: null,
  // Optional fields from migration
  serial_number: '',
  item_description: '',
  quoted_quantity: null,
  quoted_unit: '',
  quoted_rate: null,
  quoted_amount: null,
  quantity: null,
  rate: null,
  amount: null,
  source: '',
  urgent_status: '',
})

const projects = ref([])
const tenders = ref([]) // optional
const isLoading = ref(false)
const fileInput = ref(null)

onMounted(async () => {
  await fetchProjects()
  await fetchTenders() // optional
})

async function fetchProjects() {
  try {
    const response = await axios.get('api/dropdown/projects')
    projects.value = response.data?.data || []
  } catch (error) {
    toast.error('Failed to load projects')
  }
}

async function fetchTenders() {
  try {
    const response = await axios.get('api/dropdown/tender')
    tenders.value = response.data?.data || []
  } catch (error) {
    // silent fail – tender is optional
  }
}

const isFormValid = computed(() => {
  return (
    analysisData.value.project_id &&
    analysisData.value.excel_file
  )
})

function handleFileUpload(e) {
  const file = e.target.files[0]
  validateAndSetFile(file)
}

function handleDrop(e) {
  e.preventDefault()
  const file = e.dataTransfer.files[0]
  validateAndSetFile(file)
}

function validateAndSetFile(file) {
  if (!file) return

  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel' // .xls
  ]

  if (!validTypes.includes(file.type)) {
    toast.error('Only Excel files (.xlsx or .xls) are allowed')
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    toast.error('File size must not exceed 10MB')
    return
  }

  analysisData.value.excel_file = file
}

function clearFile() {
  analysisData.value.excel_file = null
  fileInput.value.value = ''
}

async function storeAnalysis() {
  if (!isFormValid.value) {
    toast.warning('Please select a project and upload an Excel file')
    return
  }

  isLoading.value = true

  try {
    const formData = new FormData()
    formData.append('project_id', analysisData.value.project_id)

    if (analysisData.value.tender_id) {
      formData.append('tender_id', analysisData.value.tender_id)
    }

    formData.append('excel_file', analysisData.value.excel_file)

    // Optional fields - now properly connected to backend
    if (analysisData.value.serial_number) formData.append('serial_number', analysisData.value.serial_number)
    if (analysisData.value.item_description) formData.append('item_description', analysisData.value.item_description)
    if (analysisData.value.quoted_quantity) formData.append('quoted_quantity', analysisData.value.quoted_quantity)
    if (analysisData.value.quoted_unit) formData.append('quoted_unit', analysisData.value.quoted_unit)
    if (analysisData.value.quoted_rate) formData.append('quoted_rate', analysisData.value.quoted_rate)
    if (analysisData.value.quoted_amount) formData.append('quoted_amount', analysisData.value.quoted_amount)
    if (analysisData.value.quantity) formData.append('quantity', analysisData.value.quantity)
    if (analysisData.value.rate) formData.append('rate', analysisData.value.rate)
    if (analysisData.value.amount) formData.append('amount', analysisData.value.amount)
    if (analysisData.value.source) formData.append('source', analysisData.value.source)
    if (analysisData.value.urgent_status) formData.append('urgent_status', analysisData.value.urgent_status)

    const response = await axios.post('/api/analysis', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    toast.success(response.data.message || `Analysis submitted successfully (${response.data.rows_imported || 0} rows imported)`)
    router.push('/user/analyses')
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to submit analysis'
    toast.error(message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Form Controls */
.form-label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Buttons */
.btn-primary {
  background: #1e293b;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary:hover {
  background: #0f172a;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* Page Layout */
.submit-analysis {
  background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
}
</style>