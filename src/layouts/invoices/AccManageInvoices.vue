<template>
  <div class="invoice-root">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-eyebrow">Finance · Accountant</div>
        <h1 class="header-title">Invoice Management</h1>
        <p class="header-sub">Create, send and track accountant invoices</p>
      </div>
      <button @click="openCreateDialog" class="btn-primary">
        New Invoice
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div v-for="stat in statCards" :key="stat.label" class="stat-card">
        <div class="stat-label">{{ stat.label }}</div>
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-bar" :style="{ width: stat.barWidth || '40%', background: stat.barColor || '#1e3a8a' }"></div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="search-wrap">
        <input
          v-model="filter"
          type="text"
          placeholder="Search by number, client, item…"
          class="search-input"
        />
        <button v-if="filter" @click="filter = ''" class="search-clear">×</button>
      </div>

      <div class="toolbar-right">
        <select v-model="statusFilter" @change="currentPage = 1" class="filter-select">
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button @click="exportToExcel" class="btn-outline">Excel</button>
        <button @click="exportToPDF" class="btn-outline">PDF</button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrap">
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th class="th-slim">#</th>
              <th>Inv. No.</th>
              <th>Title</th>
              <th>Client</th>
              <th>TIN</th>
              <th>VRN</th>
              <th>Description</th>
              <th class="th-num">Cars</th>
              <th class="th-num">Months</th>
              <th>UOM</th>
              <th class="th-num">Unit Price</th>
              <th class="th-num">Gross</th>
              <th class="th-num th-total">Total</th>
              <th class="th-center">Status</th>
              <th class="th-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(invoice, index) in paginatedInvoices"
              :key="invoice.id"
              class="table-row"
            >
              <td class="td-muted td-slim">{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
              <td class="td-invno">{{ invoice.invoice_number }}</td>
              <td class="td-medium">{{ invoice.title || '—' }}</td>
              <td class="td-bold">{{ invoice.client_name }}</td>
              <td class="td-muted">{{ invoice.tin || '—' }}</td>
              <td class="td-muted">{{ invoice.vrn || '—' }}</td>
              <td class="td-desc" :title="invoice.item_description">{{ invoice.item_description || '—' }}</td>
              <td class="td-num">{{ invoice.number_of_cars || '—' }}</td>
              <td class="td-num">{{ invoice.period_months || '—' }}</td>
              <td><span class="uom-tag">{{ invoice.uom || '—' }}</span></td>
              <td class="td-num td-mono">{{ formatCurrency(invoice.unit_price) }}</td>
              <td class="td-num td-mono">{{ formatCurrency(invoice.gross_value) }}</td>
              <td class="td-num td-total-val">{{ formatCurrency(invoice.total_amount) }}</td>
              <td class="td-center">
                <span :class="['status-badge', 'status-' + invoice.status]">
                  {{ invoice.status ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) : 'N/A' }}
                </span>
              </td>
              <td class="td-center">
                <div class="action-group">
                  <button @click="openEditDialog(invoice)" class="act-btn act-edit">Edit</button>
                  <button @click="downloadInvoice(invoice.id)" class="act-btn act-pdf">PDF</button>
                  <button v-if="invoice.status === 'draft'" @click="sendInvoice(invoice.id)" class="act-btn act-send">Send</button>
                  <button v-if="invoice.status === 'sent'" @click="openMarkPaidDialog(invoice)" class="act-btn act-paid">Paid</button>
                  <button v-if="['draft', 'cancelled'].includes(invoice.status)" @click="deleteInvoice(invoice.id)" class="act-btn act-del">Del</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="paginatedInvoices.length === 0" class="empty-state">
        <div class="empty-title">{{ filter ? 'No matching invoices' : 'No invoices yet' }}</div>
        <div class="empty-sub">{{ filter ? 'Try adjusting your search or filter.' : 'Create your first invoice to get started.' }}</div>
        <button v-if="filter" @click="filter = ''" class="btn-outline mt-3">Clear Search</button>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredInvoices.length > itemsPerPage" class="pagination">
      <span class="pagination-info">
        {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredInvoices.length) }}
        of {{ filteredInvoices.length }}
      </span>
      <div class="pagination-nav">
        <button :disabled="currentPage === 1" @click="currentPage--" class="pg-btn">Prev</button>
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="typeof page === 'number' && changePage(page)"
          :class="['pg-btn', page === currentPage ? 'pg-active' : '', typeof page !== 'number' ? 'pg-ellipsis' : '']"
          :disabled="typeof page !== 'number'"
        >{{ page }}</button>
        <button :disabled="currentPage >= Math.ceil(filteredInvoices.length / itemsPerPage)" @click="currentPage++" class="pg-btn">Next</button>
      </div>
    </div>

    <!-- ── Create / Edit Dialog ── -->
    <Transition name="fade">
      <div v-if="showDialog" class="dialog-overlay" @click.self="closeDialog">
        <div class="dialog-box dialog-lg">
          <div class="dialog-header">
            <div>
              <div class="dialog-eyebrow">{{ isEditing ? 'Editing' : 'New' }}</div>
              <h2 class="dialog-title">{{ isEditing ? 'Edit Invoice' : 'Create Invoice' }}</h2>
            </div>
            <button @click="closeDialog" class="dialog-close">×</button>
          </div>

          <div class="dialog-body">
            <form @submit.prevent="submitInvoice" class="form-grid-2col">
              <!-- Client Info -->
              <div class="form-section">
                <div class="form-section-title">Client Information</div>
                <div class="form-row-2">
                  <div class="form-field">
                    <label class="field-label">Invoice Number <span class="req">*</span></label>
                    <input v-model="form.invoice_number" type="text" required class="field-input" />
                  </div>
                  <div class="form-field">
                    <label class="field-label">Title</label>
                    <input v-model="form.title" type="text" class="field-input" placeholder="Invoice title" />
                  </div>
                  <div class="form-field">
                    <label class="field-label">Client Name <span class="req">*</span></label>
                    <input v-model="form.client_name" type="text" required class="field-input" />
                  </div>
                  <div class="form-field">
                    <label class="field-label">Client Email</label>
                    <input v-model="form.client_email" type="email" class="field-input" />
                  </div>
                  <div class="form-field">
                    <label class="field-label">Client Phone <span class="req">*</span></label>
                    <input v-model="form.client_phone" type="tel" required class="field-input" placeholder="+255 …" />
                  </div>
                  <div class="form-field">
                    <label class="field-label">TIN</label>
                    <input v-model="form.tin" type="text" class="field-input" placeholder="Tax Identification Number" />
                  </div>
                  <div class="form-field">
                    <label class="field-label">VRN</label>
                    <input v-model="form.vrn" type="text" class="field-input" placeholder="VAT Registration Number" />
                  </div>
                  <div class="form-field form-field-full">
                    <label class="field-label">Address</label>
                    <textarea v-model="form.address" rows="2" class="field-input field-textarea"></textarea>
                  </div>
                </div>
              </div>

              <!-- Service Details -->
              <div class="form-section">
                <div class="form-section-title">Service Details</div>
                <div class="form-row-2">
                  <div class="form-field form-field-full">
                    <label class="field-label">Item Description <span class="req">*</span></label>
                    <textarea v-model="form.item_description" rows="3" required class="field-input field-textarea"></textarea>
                  </div>
                  <div class="form-field">
                    <label class="field-label">No. of Cars <span class="req">*</span></label>
                    <input v-model.number="form.number_of_cars" type="number" min="0" required @input="calculateTotals" class="field-input" />
                  </div>
                  <div class="form-field">
                    <label class="field-label">Period (Months) <span class="req">*</span></label>
                    <input v-model.number="form.period_months" type="number" min="0" step="0.01" required @input="calculateTotals" class="field-input" />
                  </div>
                  <div class="form-field">
                    <label class="field-label">UOM <span class="req">*</span></label>
                    <select v-model="form.uom" required class="field-input field-select">
                      <option value="">Select UOM</option>
                      <option value="per_bus">Per Bus</option>
                      <option value="per_fleet">Per Fleet</option>
                      <option value="per_month">Per Month</option>
                      <option value="per_year">Per Year</option>
                      <option value="per_trip">Per Trip</option>
                      <option value="per_day">Per Day</option>
                    </select>
                  </div>
                  <div class="form-field">
                    <label class="field-label">Unit Price (TZS) <span class="req">*</span></label>
                    <input v-model.number="form.unit_price" type="number" min="0" step="0.01" required @input="calculateTotals" class="field-input" placeholder="0.00" />
                  </div>
                  <div class="form-field">
                    <label class="field-label">VAT Rate (%)</label>
                    <input v-model.number="form.tax_rate" type="number" step="0.01" min="0" max="100" @input="calculateTotals" class="field-input" placeholder="18" />
                  </div>
                  <div class="form-field">
                    <label class="field-label">Invoice Date <span class="req">*</span></label>
                    <input v-model="form.invoice_date" type="date" required class="field-input" />
                  </div>
                  <div class="form-field">
                    <label class="field-label">Due Date <span class="req">*</span></label>
                    <input v-model="form.due_date" type="date" required class="field-input" />
                  </div>
                </div>
              </div>

              <!-- Totals -->
              <div class="totals-strip">
                <div class="totals-item">
                  <span class="totals-label">Gross Value</span>
                  <span class="totals-val">{{ formatCurrency(form.gross_value) }}</span>
                </div>
                <div class="totals-divider"></div>
                <div class="totals-item">
                  <span class="totals-label">VAT Amount</span>
                  <span class="totals-val totals-vat">{{ formatCurrency(form.tax_amount) }}</span>
                </div>
                <div class="totals-divider"></div>
                <div class="totals-item totals-total">
                  <span class="totals-label">Total Amount</span>
                  <span class="totals-val totals-big">{{ formatCurrency(form.total_amount) }}</span>
                </div>
              </div>

              <div class="dialog-footer">
                <button type="button" @click="closeDialog" class="btn-ghost">Cancel</button>
                <button type="submit" :disabled="isSubmitting" class="btn-primary">
                  {{ isSubmitting ? 'Saving…' : (isEditing ? 'Update Invoice' : 'Create Invoice') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Send Dialog ── -->
    <Transition name="fade">
      <div v-if="showSendDialog" class="dialog-overlay" @click.self="showSendDialog = false">
        <div class="dialog-box dialog-sm">
          <div class="dialog-header">
            <div>
              <div class="dialog-eyebrow">Action</div>
              <h2 class="dialog-title">Send Invoice</h2>
            </div>
            <button @click="showSendDialog = false" class="dialog-close">×</button>
          </div>
          <div class="dialog-body">
            <div class="form-field">
              <label class="field-label">Send Method <span class="req">*</span></label>
              <div class="method-grid">
                <button
                  v-for="m in sendMethods"
                  :key="m.value"
                  type="button"
                  @click="sendForm.send_method = m.value"
                  :class="['method-btn', sendForm.send_method === m.value ? 'method-active' : '']"
                >{{ m.label }}</button>
              </div>
            </div>
            <div class="form-field mt-4">
              <label class="field-label">Personal Message</label>
              <textarea v-model="sendForm.message" rows="3" placeholder="Add a personal message…" class="field-input field-textarea"></textarea>
            </div>
            <div class="info-strip mt-4">
              Sending via <strong>{{ sendForm.send_method === 'both' ? 'Email & WhatsApp' : sendForm.send_method === 'email' ? 'Email' : 'WhatsApp' }}</strong>
            </div>
            <div class="dialog-footer mt-4">
              <button @click="showSendDialog = false" class="btn-ghost">Cancel</button>
              <button @click="submitSendInvoice" :disabled="isSubmitting" class="btn-primary">
                {{ isSubmitting ? 'Sending…' : 'Send Invoice' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Mark Paid Dialog ── -->
    <Transition name="fade">
      <div v-if="showMarkPaidDialog" class="dialog-overlay" @click.self="showMarkPaidDialog = false">
        <div class="dialog-box dialog-sm">
          <div class="dialog-header">
            <div>
              <div class="dialog-eyebrow">Action</div>
              <h2 class="dialog-title">Mark as Paid</h2>
            </div>
            <button @click="showMarkPaidDialog = false" class="dialog-close">×</button>
          </div>
          <div class="dialog-body">
            <div class="form-row-2">
              <div class="form-field">
                <label class="field-label">Payment Date <span class="req">*</span></label>
                <input v-model="paidForm.payment_date" type="date" required class="field-input" />
              </div>
              <div class="form-field">
                <label class="field-label">Payment Method <span class="req">*</span></label>
                <select v-model="paidForm.payment_method" required class="field-input field-select">
                  <option value="">Select method</option>
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="cheque">Cheque</option>
                  <option value="credit_card">Credit Card</option>
                </select>
              </div>
              <div class="form-field form-field-full">
                <label class="field-label">Payment Reference</label>
                <input v-model="paidForm.payment_reference" type="text" placeholder="Transaction reference" class="field-input" />
              </div>
            </div>
            <div class="dialog-footer mt-4">
              <button @click="showMarkPaidDialog = false" class="btn-ghost">Cancel</button>
              <button @click="submitMarkPaid" :disabled="isSubmitting" class="btn-success">
                {{ isSubmitting ? 'Processing…' : 'Confirm Payment' }}
              </button>
            </div>
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
const toast = useToast()

const invoices = ref([])
const filter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const stats = ref({})
const showDialog = ref(false)
const showSendDialog = ref(false)
const showMarkPaidDialog = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const selectedInvoice = ref(null)

const sendMethods = [
  { label: 'Email', value: 'email' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Both', value: 'both' },
]

const statCards = computed(() => [
  { label: 'Total Invoices', value: stats.value.total_invoices || 0, barWidth: '60%', barColor: '#1e3a8a' },
  { label: 'Paid', value: stats.value.paid_invoices || 0, barWidth: '45%', barColor: '#15803d' },
  { label: 'Pending', value: (stats.value.draft_invoices || 0) + (stats.value.sent_invoices || 0), barWidth: '35%', barColor: '#b45309' },
  { label: 'Total Revenue', value: formatCurrency(stats.value.total_amount || 0), barWidth: '80%', barColor: '#6d28d9' },
])

const sendForm = ref({ send_method: 'email', message: '' })
const paidForm = ref({ payment_date: '', payment_method: '', payment_reference: '' })

const form = ref({
  invoice_number: '', title: '', client_name: '', client_email: '', client_phone: '',
  tin: '', address: '', vrn: '', item_description: '', number_of_cars: 0,
  period_months: 0, uom: '', unit_price: 0, tax_rate: 18,
  gross_value: 0, tax_amount: 0, total_amount: 0, invoice_date: '', due_date: '', notes: ''
})

const filteredInvoices = computed(() => {
  let result = invoices.value || []
  if (filter.value.trim()) {
    const q = filter.value.toLowerCase().trim()
    result = result.filter(inv =>
      inv.invoice_number?.toLowerCase().includes(q) ||
      inv.title?.toLowerCase().includes(q) ||
      inv.client_name?.toLowerCase().includes(q) ||
      inv.item_description?.toLowerCase().includes(q)
    )
  }
  if (statusFilter.value) result = result.filter(inv => inv.status === statusFilter.value)
  return result
})

const paginatedInvoices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredInvoices.value.slice(start, start + itemsPerPage)
})

const visiblePages = computed(() => {
  const totalPages = Math.ceil((filteredInvoices.value?.length || 0) / itemsPerPage)
  const current = currentPage.value
  const delta = 2
  const range = []
  const result = []
  for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) range.push(i)
  if (current - delta > 2) result.push(1, '...')
  else result.push(1)
  result.push(...range)
  if (current + delta < totalPages - 1) result.push('...', totalPages)
  else if (totalPages > 1) result.push(totalPages)
  return [...new Set(result)]
})

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount || 0)
}

function generateInvoiceNumber() {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
  return `INV-${year}-${random}`
}

function calculateTotals() {
  const cars = Number(form.value.number_of_cars) || 0
  const months = Number(form.value.period_months) || 0
  const price = Number(form.value.unit_price) || 0
  const rate = Number(form.value.tax_rate) || 0
  form.value.gross_value = cars * months * price
  form.value.tax_amount = form.value.gross_value * (rate / 100)
  form.value.total_amount = form.value.gross_value + form.value.tax_amount
}

function openCreateDialog() {
  isEditing.value = false
  selectedInvoice.value = null
  form.value = {
    invoice_number: generateInvoiceNumber(), title: '', client_name: '', client_email: '',
    client_phone: '', tin: '', address: '', vrn: '', item_description: '', number_of_cars: 0,
    period_months: 0, uom: '', unit_price: 0, tax_rate: 18, gross_value: 0, tax_amount: 0,
    total_amount: 0,
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: ''
  }
  showDialog.value = true
}

function openEditDialog(invoice) {
  isEditing.value = true
  selectedInvoice.value = invoice
  form.value = { ...invoice }
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
  isEditing.value = false
  selectedInvoice.value = null
}

async function submitInvoice() {
  isSubmitting.value = true
  try {
    if (isEditing.value) {
      await axios.put(`/api/accountant/invoices/${selectedInvoice.value.id}`, form.value)
      toast.success('Invoice updated')
    } else {
      await axios.post('/api/accountant/invoices', form.value)
      toast.success('Invoice created')
    }
    closeDialog()
    await fetchInvoices()
    await fetchStatistics()
  } catch (err) {
    toast.error('Failed to save invoice')
  } finally {
    isSubmitting.value = false
  }
}

async function fetchInvoices() {
  try {
    const res = await axios.get('/api/accountant/invoices')
    invoices.value = res.data.data || []
  } catch (err) {
    toast.error('Failed to load invoices')
  }
}

async function fetchStatistics() {
  try {
    const res = await axios.get('/api/accountant/statistics')
    stats.value = res.data.data || {}
  } catch (err) {}
}

function sendInvoice(id) {
  selectedInvoice.value = id
  sendForm.value = { send_method: 'email', message: '' }
  showSendDialog.value = true
}

async function submitSendInvoice() {
  isSubmitting.value = true
  try {
    const response = await axios.post(`/api/accountant/invoices/${selectedInvoice.value}/send`, sendForm.value)
    if (response.data.success) {
      toast.success('Invoice sent successfully')
      showSendDialog.value = false
      await fetchInvoices()
      await fetchStatistics()
      if (response.data.results?.whatsapp_url) window.open(response.data.results.whatsapp_url, '_blank')
    } else {
      toast.error(response.data.message)
    }
  } catch (err) {
    toast.error('Failed to send invoice')
  } finally {
    isSubmitting.value = false
  }
}

async function deleteInvoice(id) {
  if (!confirm('Are you sure you want to delete this invoice?')) return
  try {
    await axios.delete(`/api/accountant/invoices/${id}`)
    toast.success('Invoice deleted')
    await fetchInvoices()
    await fetchStatistics()
  } catch (err) {
    toast.error('Failed to delete invoice')
  }
}

function openMarkPaidDialog(invoice) {
  selectedInvoice.value = invoice
  paidForm.value = { payment_date: new Date().toISOString().split('T')[0], payment_method: '', payment_reference: '' }
  showMarkPaidDialog.value = true
}

async function submitMarkPaid() {
  isSubmitting.value = true
  try {
    await axios.post(`/api/accountant/invoices/${selectedInvoice.value.id}/mark-paid`, paidForm.value)
    toast.success('Invoice marked as paid')
    showMarkPaidDialog.value = false
    await fetchInvoices()
    await fetchStatistics()
  } catch (err) {
    toast.error('Failed to mark as paid')
  } finally {
    isSubmitting.value = false
  }
}

function changePage(page) {
  if (typeof page === 'number') currentPage.value = page
}

async function exportToExcel() {
  try {
    const response = await axios.get('/api/accountant/invoices/export/excel', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = 'invoices_' + new Date().toISOString().split('T')[0] + '.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Excel exported')
  } catch (err) {
    toast.error('Failed to export Excel')
  }
}

async function exportToPDF() {
  try {
    const response = await axios.get('/api/accountant/invoices/export/pdf')
    if (response.data.success) {
      const data = response.data.data
      showPDFModal(createInvoiceListHTML(data), data.filename || 'invoices-report.pdf', true)
      toast.success('Invoice list loaded')
    }
  } catch (err) {
    toast.error('Failed to load invoice list')
  }
}

async function downloadInvoice(id) {
  try {
    const response = await axios.get(`/api/accountant/invoices/${id}/download`)
    if (response.data.success) {
      const invoiceData = response.data.data
      showPDFModal(createInvoiceHTML(invoiceData), invoiceData.filename || `invoice-${invoiceData.invoice?.invoice_number}.pdf`, false)
      toast.success('Invoice loaded')
    }
  } catch (err) {
    toast.error('Failed to load invoice')
  }
}

function showPDFModal(html, filename, landscape) {
  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;'
  const container = document.createElement('div')
  container.style.cssText = 'background:white;border-radius:8px;max-width:96%;max-height:96%;overflow:auto;display:flex;flex-direction:column;'
  const toolbar = document.createElement('div')
  toolbar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid #e2e8f0;gap:8px;position:sticky;top:0;background:white;z-index:1;'
  toolbar.innerHTML = `
    <span style="font-weight:700;font-size:13px;color:#1e293b;">${filename}</span>
    <div style="display:flex;gap:8px;">
      <button id="pdf-download" style="background:#1e3a8a;color:white;border:none;padding:7px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;">Download PDF</button>
      <button id="pdf-close" style="background:#f1f5f9;color:#475569;border:none;padding:7px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;">Close</button>
    </div>`
  const contentWrapper = document.createElement('div')
  contentWrapper.style.cssText = 'padding:20px;overflow:auto;'
  contentWrapper.innerHTML = html
  container.appendChild(toolbar)
  container.appendChild(contentWrapper)
  overlay.appendChild(container)
  document.body.appendChild(overlay)
  document.getElementById('pdf-close').onclick = () => overlay.remove()
  document.getElementById('pdf-download').onclick = async () => {
    const el = contentWrapper.firstElementChild
    await printElement(el, filename, landscape)
  }
}

async function printElement(element, filename, landscape = false) {
  try {
    try {
      const html2pdf = (await import('html2pdf.js')).default
      const opt = {
        margin: landscape ? [8, 6, 10, 6] : [10, 8, 12, 8],
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2.5, useCORS: true, logging: false, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: landscape ? 'landscape' : 'portrait', compressPDF: true },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }
      const blob = await html2pdf().set(opt).from(element).outputPdf('blob')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = filename
      document.body.appendChild(a); a.click()
      document.body.removeChild(a); URL.revokeObjectURL(url)
      toast.success('PDF downloaded')
      return
    } catch (e) {}
    const pw = window.open('', '_blank', 'width=900,height=700')
    if (!pw) { toast.error('Popup blocked'); return }
    pw.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${filename}</title>
      <style>@page{size:A4 ${landscape?'landscape':'portrait'};margin:${landscape?'8mm 6mm':'10mm 8mm'}}body{margin:0;font-family:Arial,sans-serif;font-size:10pt;-webkit-print-color-adjust:exact;print-color-adjust:exact}*{box-sizing:border-box}table{border-collapse:collapse}tr,td,th{page-break-inside:avoid}</style>
      </head><body>${element.outerHTML}<script>setTimeout(()=>window.print(),1200)<\/script></body></html>`)
    pw.document.close()
  } catch (err) {
    toast.error('PDF generation failed')
  }
}

function createInvoiceHTML(data) {
  const { invoice, company, status_badge, client_info, tax_info, notes } = data
  const fc = (v) => new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(v || 0)
  return `
  <div style="width:190mm;margin:0 auto;background:#fff;font-family:Arial,Helvetica,sans-serif;font-size:10pt;color:#1e293b;">
    <div style="height:4px;background:linear-gradient(90deg,#1e3a8a,#3b82f6);"></div>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:20px 28px 14px;border-bottom:1px solid #e2e8f0;">
      <div style="display:flex;align-items:flex-start;gap:14px;">
        <div style="width:56px;height:56px;background:#f8fafc;border-radius:6px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
          <img src="/images/tera.jpeg" alt="Logo" style="max-width:100%;max-height:100%;object-fit:contain;" onerror="this.style.display='none'" />
        </div>
        <div>
          <div style="font-size:14px;font-weight:800;color:#1e3a8a;text-transform:uppercase;letter-spacing:0.5px;">${company?.name || ''}</div>
          <div style="font-size:8px;color:#64748b;margin-top:3px;line-height:1.5;">${(company?.address || '').replace(/\n/g,'<br>')}${company?.contacts ? '<br>' + company.contacts : ''}</div>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:26px;font-weight:900;color:#1e3a8a;letter-spacing:-1px;">INVOICE</div>
        <div style="font-size:11px;font-weight:700;color:#475569;">#${invoice?.invoice_number || ''}</div>
        <span style="display:inline-block;margin-top:5px;padding:2px 10px;border-radius:3px;font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;background:${status_badge?.bg || '#f1f5f9'};color:${status_badge?.fg || '#475569'};">
          ${status_badge?.text || invoice?.status || ''}
        </span>
      </div>
    </div>
    <div style="display:flex;background:#f8fafc;border-bottom:1px solid #e2e8f0;">
      <div style="padding:9px 18px;border-right:1px solid #e2e8f0;flex:1;"><div style="font-size:7px;font-weight:700;text-transform:uppercase;color:#94a3b8;letter-spacing:0.8px;">Invoice Date</div><div style="font-size:10px;font-weight:700;color:#1e293b;margin-top:2px;">${invoice?.invoice_date || ''}</div></div>
      <div style="padding:9px 18px;border-right:1px solid #e2e8f0;flex:1;"><div style="font-size:7px;font-weight:700;text-transform:uppercase;color:#94a3b8;letter-spacing:0.8px;">Due Date</div><div style="font-size:10px;font-weight:700;color:#1e293b;margin-top:2px;">${invoice?.due_date || ''}</div></div>
      <div style="padding:9px 18px;flex:1;"><div style="font-size:7px;font-weight:700;text-transform:uppercase;color:#94a3b8;letter-spacing:0.8px;">VAT Rate</div><div style="font-size:10px;font-weight:700;color:#1e293b;margin-top:2px;">${invoice?.tax_rate || 0}%</div></div>
    </div>
    <div style="display:flex;padding:16px 28px;border-bottom:1px solid #e2e8f0;">
      <div style="flex:1;padding-right:18px;border-right:1px solid #e2e8f0;">
        <div style="font-size:7px;font-weight:800;text-transform:uppercase;color:#b45309;border-bottom:1.5px solid #b45309;padding-bottom:3px;margin-bottom:7px;">Bill To</div>
        <div style="font-weight:700;color:#1e3a8a;font-size:10px;margin-bottom:4px;">${invoice?.client_name || ''}</div>
        ${(client_info || []).map(i => `<div style="display:flex;gap:6px;margin-bottom:2px;"><span style="font-size:8.5px;font-weight:700;color:#475569;min-width:50px;">${i.label}</span><span style="font-size:8.5px;color:#64748b;">${i.value}</span></div>`).join('')}
      </div>
      <div style="flex:1;padding:0 18px;border-right:1px solid #e2e8f0;">
        <div style="font-size:7px;font-weight:800;text-transform:uppercase;color:#b45309;border-bottom:1.5px solid #b45309;padding-bottom:3px;margin-bottom:7px;">Tax Details</div>
        ${(tax_info || []).map(i => `<div style="display:flex;gap:6px;margin-bottom:2px;"><span style="font-size:8.5px;font-weight:700;color:#475569;min-width:40px;">${i.label}</span><span style="font-size:8.5px;color:#64748b;">${i.value}</span></div>`).join('')}
      </div>
      <div style="flex:1;padding-left:18px;">
        <div style="font-size:7px;font-weight:800;text-transform:uppercase;color:#b45309;border-bottom:1.5px solid #b45309;padding-bottom:3px;margin-bottom:7px;">Amount Due</div>
        <div style="font-size:16px;font-weight:900;color:#1e3a8a;">${fc(invoice?.total_amount)}</div>
      </div>
    </div>
    <div style="padding:16px 28px;">
      <div style="font-size:7px;font-weight:800;text-transform:uppercase;color:#b45309;border-bottom:1.5px solid #b45309;padding-bottom:3px;margin-bottom:8px;">Items & Services</div>
      <table style="width:100%;border-collapse:collapse;font-size:9px;">
        <thead><tr style="background:#1e3a8a;color:#fff;">
          <th style="padding:7px 10px;text-align:left;font-size:7.5px;text-transform:uppercase;">Description</th>
          <th style="padding:7px 10px;text-align:center;font-size:7.5px;text-transform:uppercase;">Cars</th>
          <th style="padding:7px 10px;text-align:center;font-size:7.5px;text-transform:uppercase;">Period</th>
          <th style="padding:7px 10px;text-align:right;font-size:7.5px;text-transform:uppercase;">Unit Price</th>
          <th style="padding:7px 10px;text-align:right;font-size:7.5px;text-transform:uppercase;">Subtotal</th>
        </tr></thead>
        <tbody><tr style="background:#f8fafc;">
          <td style="padding:9px 10px;border-bottom:1px solid #e2e8f0;"><div style="font-weight:700;">${invoice?.item_description || ''}</div><div style="font-size:8px;color:#64748b;margin-top:1px;">${invoice?.uom ? 'UOM: ' + invoice.uom : ''}</div></td>
          <td style="padding:9px 10px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:600;">${invoice?.number_of_cars || 1}</td>
          <td style="padding:9px 10px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:600;">${invoice?.period_months || ''} mo</td>
          <td style="padding:9px 10px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:600;">${fc(invoice?.unit_price)}</td>
          <td style="padding:9px 10px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:800;color:#1e3a8a;">${fc(invoice?.gross_value)}</td>
        </tr></tbody>
      </table>
      <div style="display:flex;justify-content:flex-end;margin-top:10px;">
        <div style="width:220px;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;">
          <div style="display:flex;justify-content:space-between;padding:6px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;"><span style="font-size:9px;color:#64748b;">Subtotal</span><span style="font-size:9px;font-weight:700;">${fc(invoice?.gross_value)}</span></div>
          <div style="display:flex;justify-content:space-between;padding:6px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;"><span style="font-size:9px;color:#64748b;">VAT (${invoice?.tax_rate || 0}%)</span><span style="font-size:9px;font-weight:700;">${fc(invoice?.tax_amount)}</span></div>
          <div style="display:flex;justify-content:space-between;padding:9px 12px;background:#1e3a8a;"><span style="font-size:8.5px;font-weight:700;text-transform:uppercase;color:#fff;">Amount Due</span><span style="font-size:13px;font-weight:900;color:#fff;">${fc(invoice?.total_amount)}</span></div>
        </div>
      </div>
      ${notes || invoice?.notes ? `<div style="margin-top:14px;"><div style="font-size:7px;font-weight:800;text-transform:uppercase;color:#b45309;border-bottom:1.5px solid #b45309;padding-bottom:3px;margin-bottom:5px;">Notes</div><div style="font-size:9px;color:#64748b;line-height:1.5;">${notes || invoice?.notes}</div></div>` : ''}
    </div>
    <div style="padding:10px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:8px;color:#94a3b8;margin-top:auto;">
      <span>Thank you for your business.</span><span>Generated: ${new Date().toLocaleDateString()}</span>
    </div>
    <div style="height:3px;background:linear-gradient(90deg,#b45309,#1e3a8a);"></div>
  </div>`
}

function createInvoiceListHTML(data) {
  const { invoices: invs, company, generated, total_records, grand_total } = data
  const fc = (v) => new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(v || 0)
  return `
  <div style="font-family:Arial,sans-serif;font-size:9px;color:#1e293b;padding:12px 16px;width:270mm;margin:0 auto;">
    <div style="height:3px;background:linear-gradient(90deg,#1e3a8a,#b45309);margin-bottom:12px;"></div>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
      <div><div style="font-size:13px;font-weight:800;color:#1e3a8a;">${company?.name || ''}</div><div style="font-size:7.5px;color:#94a3b8;margin-top:2px;">${company?.address || ''}</div></div>
      <div style="text-align:right;font-size:8px;color:#475569;line-height:1.5;"><div style="font-size:10px;font-weight:700;color:#1e3a8a;">TAX INVOICE REPORT</div><div>Generated: ${generated}</div><div>Records: ${total_records} · Grand Total: <strong>${fc(grand_total)}</strong></div></div>
    </div>
    <div style="border-top:1.5px solid #e2e8f0;margin-bottom:7px;"></div>
    <table style="width:100%;border-collapse:collapse;font-size:8px;">
      <thead><tr style="background:#1e3a8a;color:#fff;">
        <th style="padding:6px 7px;text-align:left;font-size:7px;text-transform:uppercase;">Invoice No.</th>
        <th style="padding:6px 7px;text-align:left;font-size:7px;text-transform:uppercase;">Client</th>
        <th style="padding:6px 7px;text-align:left;font-size:7px;text-transform:uppercase;">Description</th>
        <th style="padding:6px 7px;text-align:right;font-size:7px;text-transform:uppercase;">Cars</th>
        <th style="padding:6px 7px;text-align:right;font-size:7px;text-transform:uppercase;">Period</th>
        <th style="padding:6px 7px;text-align:right;font-size:7px;text-transform:uppercase;">Unit Price</th>
        <th style="padding:6px 7px;text-align:right;font-size:7px;text-transform:uppercase;">Tax</th>
        <th style="padding:6px 7px;text-align:right;font-size:7px;text-transform:uppercase;">Total</th>
        <th style="padding:6px 7px;text-align:left;font-size:7px;text-transform:uppercase;">Date</th>
        <th style="padding:6px 7px;text-align:center;font-size:7px;text-transform:uppercase;">Status</th>
      </tr></thead>
      <tbody>
        ${(invs || []).map((inv, idx) => {
          const statusColors = { paid: ['#dcfce7','#15803d'], sent: ['#dbeafe','#1d4ed8'], cancelled: ['#fee2e2','#b91c1c'], draft: ['#f1f5f9','#64748b'] }
          const [bg, fg] = statusColors[inv.status] || statusColors.draft
          const desc = (inv.item_description || '').substring(0, 38) + (inv.item_description?.length > 38 ? '…' : '')
          return `<tr style="border-bottom:1px solid #e2e8f0;${idx % 2 === 0 ? 'background:#f8fafc;' : ''}">
            <td style="padding:5px 7px;font-weight:700;color:#1e3a8a;">${inv.invoice_number}</td>
            <td style="padding:5px 7px;font-weight:600;">${inv.client_name}</td>
            <td style="padding:5px 7px;color:#475569;">${desc}</td>
            <td style="padding:5px 7px;text-align:right;">${inv.number_of_cars}</td>
            <td style="padding:5px 7px;text-align:right;">${inv.period_months}</td>
            <td style="padding:5px 7px;text-align:right;">${fc(inv.unit_price)}</td>
            <td style="padding:5px 7px;text-align:right;">${fc(inv.tax_amount)}</td>
            <td style="padding:5px 7px;text-align:right;font-weight:800;color:#1e3a8a;">${fc(inv.total_amount)}</td>
            <td style="padding:5px 7px;color:#64748b;">${inv.invoice_date}</td>
            <td style="padding:5px 7px;text-align:center;"><span style="background:${bg};color:${fg};padding:2px 6px;border-radius:3px;font-size:7px;font-weight:700;text-transform:uppercase;">${inv.status}</span></td>
          </tr>`
        }).join('')}
      </tbody>
      <tfoot><tr style="background:#f1f5f9;border-top:2px solid #1e3a8a;">
        <td colspan="7" style="padding:6px 7px;font-weight:700;color:#1e3a8a;font-size:8.5px;text-align:right;text-transform:uppercase;">Grand Total</td>
        <td style="padding:6px 7px;font-weight:900;color:#1e3a8a;font-size:10px;text-align:right;">${fc(grand_total)}</td>
        <td colspan="2"></td>
      </tr></tfoot>
    </table>
    <div style="margin-top:10px;display:flex;justify-content:space-between;font-size:7.5px;color:#94a3b8;">
      <span>${company?.name || ''} — Confidential Invoice Report</span><span>Generated: ${generated}</span>
    </div>
    <div style="height:2px;background:linear-gradient(90deg,#b45309,#1e3a8a);margin-top:8px;"></div>
  </div>`
}

onMounted(() => {
  fetchInvoices()
  fetchStatistics()
})
</script>

<style scoped>
@import url('https://fonts.2?family=Sora:wght@300;400;500;600;700;800&display=swap');

/* ─── Root ─────────────────────────────────────── */
.invoice-root {
  font-family: 'Sora', sans-serif;
  min-height: 100vh;
  background: #f6f7fb;
  padding: 32px 28px;
  color: #1e293b;
}

/* ─── Page Header ───────────────────────────────── */
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 16px;
  flex-wrap: wrap;
}
.header-eyebrow {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #94a3b8;
  margin-bottom: 4px;
}
.header-title {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
  margin: 0;
}
.header-sub {
  font-size: 12px;
  color: #64748b;
  margin-top: 3px;
}

/* ─── Stat Cards ─────────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}
@media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 500px) { .stats-grid { grid-template-columns: 1fr; } }

.stat-card {
  background: #fff;
  border: 1px solid #e8ecf0;
  border-radius: 10px;
  padding: 16px 18px 14px;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
}
.stat-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.07);
  transform: translateY(-1px);
}
.stat-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #94a3b8;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
  line-height: 1;
  margin-bottom: 14px;
}
.stat-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  border-radius: 0 2px 0 0;
  transition: width 0.6s ease;
}

/* ─── Toolbar ────────────────────────────────────── */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.search-wrap {
  position: relative;
  flex: 1;
  max-width: 380px;
}
.search-input {
  width: 100%;
  border: 1px solid #dde1e7;
  border-radius: 8px;
  background: #fff;
  padding: 9px 36px 9px 14px;
  font-size: 13px;
  font-family: 'Sora', sans-serif;
  color: #1e293b;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.search-input:focus { border-color: #1e3a8a; box-shadow: 0 0 0 3px rgba(30,58,138,0.08); }
.search-input::placeholder { color: #b0b8c4; }
.search-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #94a3b8;
  line-height: 1;
}
.toolbar-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.filter-select {
  border: 1px solid #dde1e7;
  border-radius: 8px;
  background: #fff;
  padding: 9px 14px;
  font-size: 12px;
  font-family: 'Sora', sans-serif;
  color: #475569;
  outline: none;
  cursor: pointer;
}
.filter-select:focus { border-color: #1e3a8a; }

/* ─── Buttons ────────────────────────────────────── */
.btn-primary {
  background: #1e3a8a;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 700;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
  letter-spacing: 0.01em;
}
.btn-primary:hover { background: #1e40af; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

.btn-success {
  background: #15803d;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 700;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-success:hover { background: #166534; }
.btn-success:disabled { opacity: 0.55; cursor: not-allowed; }

.btn-ghost {
  background: transparent;
  color: #64748b;
  border: 1px solid #dde1e7;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-ghost:hover { background: #f1f5f9; }

.btn-outline {
  background: #fff;
  color: #475569;
  border: 1px solid #dde1e7;
  border-radius: 8px;
  padding: 9px 16px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.btn-outline:hover { background: #f8fafc; border-color: #b0b8c4; }

/* ─── Table ──────────────────────────────────────── */
.table-wrap {
  background: #fff;
  border: 1px solid #e8ecf0;
  border-radius: 12px;
  overflow: hidden;
}
.table-scroll { overflow-x: auto; }
.table-scroll::-webkit-scrollbar { height: 5px; }
.table-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}
.data-table thead tr {
  background: #f8fafc;
  border-bottom: 1.5px solid #e2e8f0;
}
.data-table th {
  padding: 11px 14px;
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: #64748b;
  white-space: nowrap;
}
.th-slim { width: 36px; }
.th-num { text-align: right; }
.th-center { text-align: center; }
.th-total { background: rgba(30,58,138,0.04); color: #1e3a8a; }

.table-row { transition: background 0.12s; border-bottom: 1px solid #f1f5f9; }
.table-row:last-child { border-bottom: none; }
.table-row:hover { background: #fafbff; }

.data-table td {
  padding: 11px 14px;
  white-space: nowrap;
  vertical-align: middle;
}
.td-slim { width: 36px; }
.td-muted { color: #94a3b8; font-size: 12px; }
.td-invno { font-weight: 700; color: #1e3a8a; font-size: 12px; }
.td-medium { color: #475569; font-size: 12px; }
.td-bold { font-weight: 600; color: #0f172a; }
.td-num { text-align: right; font-weight: 500; }
.td-mono { font-variant-numeric: tabular-nums; }
.td-desc { max-width: 180px; overflow: hidden; text-overflow: ellipsis; color: #64748b; font-size: 12px; }
.td-center { text-align: center; }
.td-total-val { font-weight: 800; color: #1e3a8a; font-size: 13px; background: rgba(30,58,138,0.03); }

.uom-tag {
  background: #f1f5f9;
  color: #64748b;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

/* ─── Status Badge ───────────────────────────────── */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: capitalize;
}
.status-draft  { background: #f1f5f9; color: #475569; }
.status-sent   { background: #dbeafe; color: #1d4ed8; }
.status-paid   { background: #dcfce7; color: #15803d; }
.status-cancelled { background: #fee2e2; color: #b91c1c; }

/* ─── Action Buttons ─────────────────────────────── */
.action-group { display: flex; gap: 4px; justify-content: center; align-items: center; }
.act-btn {
  padding: 4px 9px;
  border: none;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 700;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.15s;
  letter-spacing: 0.2px;
}
.act-btn:hover { opacity: 0.85; transform: translateY(-1px); }
.act-edit { background: #1e3a8a; color: #fff; }
.act-pdf  { background: #4f46e5; color: #fff; }
.act-send { background: #0f766e; color: #fff; }
.act-paid { background: #7c3aed; color: #fff; }
.act-del  { background: #dc2626; color: #fff; }

/* ─── Empty State ─────────────────────────────────── */
.empty-state {
  padding: 60px 24px;
  text-align: center;
}
.empty-title { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
.empty-sub { font-size: 12.5px; color: #94a3b8; }
.mt-3 { margin-top: 12px; }

/* ─── Pagination ─────────────────────────────────── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18px;
  flex-wrap: wrap;
  gap: 10px;
}
.pagination-info { font-size: 12px; color: #64748b; }
.pagination-nav { display: flex; align-items: center; gap: 4px; }
.pg-btn {
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  color: #475569;
  cursor: pointer;
  transition: all 0.12s;
  min-width: 36px;
  text-align: center;
}
.pg-btn:hover:not(:disabled) { background: #f8fafc; border-color: #c0c8d4; }
.pg-btn:disabled { opacity: 0.45; cursor: default; }
.pg-active { background: #1e3a8a !important; color: #fff !important; border-color: #1e3a8a !important; }
.pg-ellipsis { border: none; background: transparent; cursor: default; color: #94a3b8; }

/* ─── Dialogs ─────────────────────────────────────── */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.65);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
}
.dialog-box {
  background: #fff;
  border-radius: 14px;
  width: 100%;
  max-height: 92vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.dialog-lg { max-width: 900px; }
.dialog-sm { max-width: 460px; }

.dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #e8ecf0;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 2;
}
.dialog-eyebrow {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #94a3b8;
  margin-bottom: 3px;
}
.dialog-title {
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.3px;
}
.dialog-close {
  background: #f1f5f9;
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.12s;
}
.dialog-close:hover { background: #e2e8f0; }

.dialog-body { padding: 20px 24px; }
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 16px;
}

/* ─── Form ────────────────────────────────────────── */
.form-grid-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 32px;
}
.form-grid-2col .totals-strip,
.form-grid-2col .dialog-footer { grid-column: 1 / -1; }
@media (max-width: 700px) { .form-grid-2col { grid-template-columns: 1fr; } }

.form-section { padding-bottom: 8px; }
.form-section-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #94a3b8;
  border-bottom: 1.5px solid #e8ecf0;
  padding-bottom: 8px;
  margin-bottom: 14px;
}
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (max-width: 500px) { .form-row-2 { grid-template-columns: 1fr; } }

.form-field { display: flex; flex-direction: column; gap: 4px; }
.form-field-full { grid-column: 1 / -1; }

.field-label {
  font-size: 11px;
  font-weight: 600;
  color: #475569;
  letter-spacing: 0.2px;
}
.req { color: #dc2626; }

.field-input {
  border: 1px solid #dde1e7;
  border-radius: 7px;
  background: #fafbfc;
  padding: 8px 12px;
  font-size: 13px;
  font-family: 'Sora', sans-serif;
  color: #1e293b;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  width: 100%;
  box-sizing: border-box;
}
.field-input:focus { border-color: #1e3a8a; box-shadow: 0 0 0 3px rgba(30,58,138,0.08); background: #fff; }
.field-input::placeholder { color: #c0c8d4; }
.field-textarea { resize: none; }
.field-select { cursor: pointer; }
.mt-4 { margin-top: 16px; }

/* ─── Totals Strip ───────────────────────────────── */
.totals-strip {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e8ecf0;
  border-radius: 10px;
  padding: 16px 24px;
  gap: 0;
  margin: 8px 0 4px;
}
.totals-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.totals-total { flex: 1.2; }
.totals-divider {
  width: 1px;
  height: 40px;
  background: #e2e8f0;
  margin: 0 16px;
}
.totals-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #94a3b8; }
.totals-val { font-size: 16px; font-weight: 800; color: #0f172a; font-variant-numeric: tabular-nums; }
.totals-vat { color: #b45309; }
.totals-big { font-size: 20px; color: #1e3a8a; }

/* ─── Send Method ─────────────────────────────────── */
.method-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 6px; }
.method-btn {
  padding: 9px 6px;
  border: 1.5px solid #dde1e7;
  border-radius: 7px;
  background: #fff;
  font-size: 12px;
  font-weight: 700;
  font-family: 'Sora', sans-serif;
  color: #64748b;
  cursor: pointer;
  transition: all 0.12s;
  text-align: center;
}
.method-btn:hover { border-color: #1e3a8a; color: #1e3a8a; }
.method-active { border-color: #1e3a8a !important; background: #eff4ff !important; color: #1e3a8a !important; }

/* ─── Info Strip ─────────────────────────────────── */
.info-strip {
  background: #eff4ff;
  border: 1px solid #c7d7fc;
  border-radius: 7px;
  padding: 9px 14px;
  font-size: 12px;
  color: #1e3a8a;
}

/* ─── Transitions ────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>