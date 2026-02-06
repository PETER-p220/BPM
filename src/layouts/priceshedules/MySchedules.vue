<template>
  <div class="quotations-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <i class="fas fa-file-invoice-dollar"></i>
            Quotations
          </h1>
          <p class="page-subtitle">Manage and view all quotations</p>
        </div>
        <div class="header-right">
          <router-link to="/submit-shedule">
            <button class="btn btn-primary">
              <i class="fas fa-plus"></i>
              <span>Create New Quotation</span>
            </button>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="filters-section">
      <div class="search-wrapper">
        <i class="fas fa-search search-icon"></i>
        <input
          type="text"
          v-model="filter"
          placeholder="Search by tender title..."
          class="search-input"
        />
      </div>
    </div>

    <!-- Quotations List -->
    <div class="quotations-list">
      <div
        v-for="tender in filteredTenders"
        :key="tender.tender_id"
        class="quotation-card"
      >
        <!-- Card Header -->
        <div class="card-header">
          <div class="card-header-left">
            <h3 class="tender-title">
              <i class="fas fa-file-contract"></i>
              {{ tender.tender.title }}
            </h3>
            <div class="card-meta">
              <span class="meta-item">
                <i class="fas fa-user"></i>
                {{ tender.user?.name || 'N/A' }}
              </span>
              <span class="meta-item">
                <i class="fas fa-calendar"></i>
                {{ formatDate(tender.created_at) }}
              </span>
            </div>
          </div>
          <div class="card-header-right">
            <span :class="['status-badge', `status-${tender.status}`]">
              <i :class="statusIcon(tender.status)"></i>
              {{ tender.status }}
            </span>
          </div>
        </div>

        <!-- Rejection Reason -->
        <div v-if="tender.status === 'rejected' && tender.reason_for_reject" class="rejection-notice">
          <i class="fas fa-exclamation-triangle"></i>
          <span><strong>Rejection Reason:</strong> {{ tender.reason_for_reject }}</span>
        </div>

        <!-- Financial Summary -->
        <div class="financial-summary">
          <h4 class="summary-title">
            <i class="fas fa-chart-line"></i>
            Financial Summary
          </h4>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">Total Amount (VAT Excl)</span>
              <span class="summary-value">{{ formatCurrency(tender.total_amount_vat_excl) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Total Amount (VAT Incl)</span>
              <span class="summary-value">{{ formatCurrency(tender.total_amount_vat_incl) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Amount Needed</span>
              <span class="summary-value">{{ formatCurrency(tender.total_amount_needed) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Site Contingency</span>
              <span class="summary-value">{{ formatCurrency(tender.site_contingency) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Total Investment</span>
              <span class="summary-value highlight">{{ formatCurrency(tender.total_investment) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Projected Profit</span>
              <span class="summary-value profit">
                {{ formatCurrency(tender.projected_profit) }}
                <span class="profit-percentage">({{ tender.projected_profit_percentage }}%)</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Schedule Items Table -->
        <div class="schedule-section">
          <h4 class="schedule-title">
            <i class="fas fa-list-ul"></i>
            Schedule Items
          </h4>
          <div class="table-wrapper">
            <table class="schedule-table">
              <thead>
                <tr class="group-header">
                  <th colspan="6" class="group-cell quoted-group">QUOTED PRICES (VAT EXCL)</th>
                  <th colspan="5" class="group-cell buying-group">BUYING PRICES (VAT INCL)</th>
                </tr>
                <tr>
                  <th class="th-sn">S/N</th>
                  <th class="th-desc">Description</th>
                  <th class="th-qty">Q. Qty</th>
                  <th class="th-unit">Unit</th>
                  <th class="th-rate">Q. Rate</th>
                  <th class="th-amount">Q. Amount</th>
                  <th class="th-qty">Qty</th>
                  <th class="th-rate">Rate</th>
                  <th class="th-amount">Amount</th>
                  <th class="th-source">Source</th>
                  <th class="th-urgent">Urgent</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in tender.items" :key="item.price_schedule_id">
                  <td class="td-sn">{{ item.serial_number }}</td>
                  <td class="td-desc" :title="item.item_description">{{ item.item_description || 'N/A' }}</td>
                  <td class="td-qty">{{ item.quoted_quantity || '-' }}</td>
                  <td class="td-unit">{{ item.quoted_unit || '-' }}</td>
                  <td class="td-rate">{{ formatCurrency(item.quoted_rate) }}</td>
                  <td class="td-amount">{{ formatCurrency(item.quoted_amount) }}</td>
                  <td class="td-qty">{{ item.quantity || '-' }}</td>
                  <td class="td-rate">{{ formatCurrency(item.rate) }}</td>
                  <td class="td-amount">{{ formatCurrency(item.amount) }}</td>
                  <td class="td-source">{{ item.source || 'N/A' }}</td>
                  <td class="td-urgent">
                    <span v-if="item.urgent_status" :class="['urgent-badge', item.urgent_status.toLowerCase()]">
                      {{ item.urgent_status }}
                    </span>
                    <span v-else class="text-muted">N/A</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!filteredTenders.length" class="empty-state">
        <i class="fas fa-folder-open"></i>
        <p>No quotations found for the current filter.</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination-section" v-if="filteredTenders.length">
      <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="pagination-btn"
      >
        <i class="fas fa-chevron-left"></i>
        Previous
      </button>
      <span class="pagination-info">
        Page <strong>{{ currentPage }}</strong> of <strong>{{ totalPages }}</strong>
      </span>
      <button
        :disabled="currentPage >= totalPages"
        @click="changePage(currentPage + 1)"
        class="pagination-btn"
      >
        Next
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const schedules = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const toast = useToast();

onMounted(async () => {
  await fetchSchedules();
});

async function fetchSchedules() {
  try {
    const response = await axios.get('/api/user-schedule');
    if (response.data.status === 200 && Array.isArray(response.data.data)) {
      const groupedSchedules = groupByTender(response.data.data);
      schedules.value = groupedSchedules;
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    handleError(error);
  }
}

function groupByTender(data) {
  const grouped = {};
  data.forEach(item => {
    const tenderId = item.tender_id;
    if (!grouped[tenderId]) {
      grouped[tenderId] = {
        tender_id: tenderId,
        tender: item.tender,
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
      };
    }

    if (item.total_amount_vat_excl && !grouped[tenderId].total_amount_vat_excl) {
      grouped[tenderId].total_amount_vat_excl = item.total_amount_vat_excl;
      grouped[tenderId].total_amount_vat_incl = item.total_amount_vat_incl;
      grouped[tenderId].total_amount_needed = item.total_amount_needed;
      grouped[tenderId].site_contingency = item.site_contingency;
      grouped[tenderId].total_investment = item.total_investment;
      grouped[tenderId].projected_profit = item.projected_profit;
      grouped[tenderId].projected_profit_percentage = item.projected_profit_percentage;
    }

    if (item.item_description || item.serial_number.match(/^[A-M\s]+$/)) {
      grouped[tenderId].items.push(item);
    }
  });

  return Object.values(grouped);
}

const allTenders = computed(() =>
  schedules.value.filter(tender =>
    tender.tender?.title?.toLowerCase().includes(filter.value.toLowerCase()) || !filter.value
  )
);

const filteredTenders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return allTenders.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(allTenders.value.length / itemsPerPage));

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatCurrency(value) {
  if (!value) return 'N/A';
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 2
  }).format(value);
}

function statusIcon(status) {
  const icons = {
    pending: 'fas fa-clock',
    passed: 'fas fa-check-circle',
    rejected: 'fas fa-times-circle'
  };
  return icons[status] || 'fas fa-circle';
}

function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response) {
    message = error.response.data.message || error.response.statusText;
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
}

function changePage(page) {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
</script>

<style scoped>
.quotations-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 1.5rem;
  background: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Page Header */
.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-title i {
  color: #3b82f6;
  font-size: 1.75rem;
}

.page-subtitle {
  color: #64748b;
  font-size: 0.9375rem;
  margin: 0;
}

.btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  transform: translateY(-1px);
}

/* Filters Section */
.filters-section {
  background: white;
  border-radius: 10px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.search-wrapper {
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.875rem;
}

.search-input {
  width: 100%;
  padding: 0.625rem 0.875rem 0.625rem 2.75rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Quotations List */
.quotations-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.quotation-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.2s ease;
}

.quotation-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Card Header */
.card-header {
  padding: 1.25rem 1.5rem;
  background: linear-gradient(to bottom, #f8fafc, white);
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.tender-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tender-title i {
  color: #3b82f6;
  font-size: 1rem;
}

.card-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #64748b;
  font-size: 0.8125rem;
}

.meta-item i {
  color: #94a3b8;
  font-size: 0.75rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  text-transform: capitalize;
}

.status-pending {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
  border: 1px solid #fbbf24;
}

.status-passed {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
  border: 1px solid #10b981;
}

.status-rejected {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #991b1b;
  border: 1px solid #ef4444;
}

/* Rejection Notice */
.rejection-notice {
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border-left: 4px solid #ef4444;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #991b1b;
  font-size: 0.875rem;
}

.rejection-notice i {
  font-size: 1.125rem;
  flex-shrink: 0;
}

/* Financial Summary */
.financial-summary {
  padding: 1.5rem;
  background: #fafbfc;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

.summary-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #334155;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.summary-title i {
  color: #3b82f6;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.summary-item {
  background: white;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.summary-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.summary-value {
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
}

.summary-value.highlight {
  color: #3b82f6;
  font-size: 1.125rem;
}

.summary-value.profit {
  color: #10b981;
  font-size: 1.125rem;
}

.profit-percentage {
  font-size: 0.875rem;
  color: #059669;
  margin-left: 0.375rem;
}

/* Schedule Section */
.schedule-section {
  padding: 1.5rem;
}

.schedule-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #334155;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.schedule-title i {
  color: #3b82f6;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}

.schedule-table thead {
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  position: sticky;
  top: 0;
  z-index: 10;
}

.group-header th {
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
  border-bottom: 2px solid #cbd5e1;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.quoted-group {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #1e40af;
  border-right: 1px solid #93c5fd;
}

.buying-group {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
}

.schedule-table th {
  padding: 0.75rem 0.875rem;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.schedule-table tbody tr {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s ease;
}

.schedule-table tbody tr:hover {
  background: #f8fafc;
}

.schedule-table td {
  padding: 0.75rem 0.875rem;
  color: #475569;
  border-bottom: 1px solid #f1f5f9;
}

.td-sn {
  font-weight: 600;
  color: #1e293b;
  width: 60px;
}

.td-desc {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.td-qty, .td-unit {
  text-align: center;
  width: 80px;
}

.td-rate, .td-amount {
  text-align: right;
  font-weight: 500;
  width: 120px;
}

.td-source, .td-urgent {
  width: 100px;
}

.urgent-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.urgent-badge.yes {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #991b1b;
  border: 1px solid #ef4444;
}

.urgent-badge.no {
  background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
  color: #3730a3;
  border: 1px solid #6366f1;
}

.text-muted {
  color: #94a3b8;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
}

.empty-state i {
  font-size: 4rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #64748b;
  font-size: 1rem;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.pagination-btn {
  padding: 0.625rem 1.25rem;
  background: white;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #3b82f6;
  color: #3b82f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #64748b;
  font-size: 0.875rem;
}

.pagination-info strong {
  color: #1e293b;
  font-weight: 600;
}

/* Scrollbar */
.table-wrapper::-webkit-scrollbar {
  height: 8px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive */
@media (max-width: 768px) {
  .quotations-container {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
  
  .card-header {
    flex-direction: column;
  }
}
</style>