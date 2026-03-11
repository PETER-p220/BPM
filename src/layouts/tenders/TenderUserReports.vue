<template>
  <div class="reports-shell">
    

    <!-- Main -->
    <main class="main-content">

      <!-- Top bar -->
      <header class="topbar">
        <div>
          <h1 class="page-title">Tender Reports</h1>
          <p class="page-sub">Monitor, filter, and export tender activity</p>
        </div>
        <button @click="generateReport" class="btn-primary">
          <i class="fas fa-download"></i> Export CSV
        </button>
      </header>

      <!-- Summary cards -->
      <section class="summary-grid">
        <div class="stat-card">
          <div class="stat-icon icon-blue"><i class="fas fa-file-contract"></i></div>
          <div>
            <p class="stat-label">Total Tenders</p>
            <p class="stat-value">{{ summary.total_tenders }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon icon-green"><i class="fas fa-check-circle"></i></div>
          <div>
            <p class="stat-label">Completed</p>
            <p class="stat-value">{{ summary.completed_tenders }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon icon-amber"><i class="fas fa-clock"></i></div>
          <div>
            <p class="stat-label">In Progress</p>
            <p class="stat-value">{{ summary.in_progress_tenders }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon icon-violet"><i class="fas fa-trophy"></i></div>
          <div>
            <p class="stat-label">Awarded</p>
            <p class="stat-value">{{ summary.awarded_tenders }}</p>
          </div>
        </div>
      </section>

      <!-- Filter panel -->
      <section class="filter-panel">
        <div class="filter-grid">
          <div class="field">
            <label class="field-label">Report Type</label>
            <select v-model="filters.report_type" class="field-input">
              <option value="">All Reports</option>
              <option value="assigned">Assigned Tenders</option>
              <option value="submitted">Submitted Tenders</option>
              <option value="awarded">Awarded Tenders</option>
              <option value="performance">Performance Reports</option>
            </select>
          </div>
          <div class="field">
            <label class="field-label">Date From</label>
            <input v-model="filters.date_from" type="date" class="field-input" />
          </div>
          <div class="field">
            <label class="field-label">Date To</label>
            <input v-model="filters.date_to" type="date" class="field-input" />
          </div>
          <div class="field">
            <label class="field-label">Status</label>
            <select v-model="filters.status" class="field-input">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div class="filter-actions">
          <button @click="applyFilters" class="btn-primary btn-sm">Apply Filters</button>
          <button @click="resetFilters" class="btn-ghost btn-sm">Reset</button>
        </div>
      </section>

      <!-- Table -->
      <section class="table-panel">
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Tender ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tender in reports" :key="tender.id" class="table-row">
                <td class="td-mono">{{ tender.tender_id }}</td>
                <td class="td-title">{{ tender.title }}</td>
                <td>{{ tender.tender_type }}</td>
                <td><span :class="['badge', getBadgeClass(tender.status)]">{{ tender.status }}</span></td>
                <td>{{ formatDate(tender.date_created) }}</td>
                <td>{{ formatDate(tender.deadline) }}</td>
                <td class="td-actions">
                  <button @click="viewDetails(tender)" class="action-link">View</button>
                  <button @click="downloadReport(tender)" class="action-link action-dl">Download</button>
                </td>
              </tr>
              <tr v-if="reports.length === 0">
                <td colspan="7" class="empty-state">No tender records found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <p class="pag-info">
            Showing {{ (currentPage - 1) * perPage + 1 }}–{{ Math.min(currentPage * perPage, totalRecords) }} of {{ totalRecords }} results
          </p>
          <div class="pag-controls">
            <button @click="previousPage" :disabled="currentPage === 1" class="pag-btn">
              <i class="fas fa-chevron-left"></i> Prev
            </button>
            <span class="pag-current">{{ currentPage }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="pag-btn">
              Next <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();
const loading = ref(false);

const filters = ref({ report_type: '', date_from: '', date_to: '', status: '' });
const reports = ref([]);
const summary = ref({ total_tenders: 0, completed_tenders: 0, in_progress_tenders: 0, awarded_tenders: 0 });
const currentPage = ref(1);
const perPage = ref(10);
const totalRecords = ref(0);
const totalPages = ref(0);

const getTenderStatus = (tender) => {
  if (tender.expired_at && new Date(tender.expired_at) < new Date()) return 'expired';
  if (tender.bid_submission) {
    const sub = new Date(tender.bid_submission);
    if (sub < new Date()) return 'completed';
    if (sub > new Date()) return 'in-progress';
  }
  return tender.date_of_Publication ? 'in-progress' : 'pending';
};

const getBadgeClass = (status) => ({
  completed: 'badge-green', 'in-progress': 'badge-amber', pending: 'badge-gray',
  awarded: 'badge-violet', expired: 'badge-red', cancelled: 'badge-red',
}[status] || 'badge-gray');

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const applyFilters = async () => { currentPage.value = 1; await fetchReports(); };
const resetFilters = () => { filters.value = { report_type: '', date_from: '', date_to: '', status: '' }; applyFilters(); };

const generateReport = async () => {
  try {
    loading.value = true;
    const h = ['Tender ID','Title','Type','Status','Date Created','Deadline','Procurement Entity','Source','Publication Date','Bid Submission'];
    const rows = reports.value.map(t => [
      `"${t.tender_id}"`,`"${t.title}"`,`"${t.tender_type}"`,`"${t.status}"`,
      `"${formatDate(t.date_created)}"`,`"${formatDate(t.deadline)}"`,
      `"${t.procurement_entity||''}"`,`"${t.tender_source||''}"`,
      `"${formatDate(t.date_of_publication)}"`,`"${formatDate(t.bid_submission)}"`
    ].join(','));
    const csv = [h.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: `tender_report_${new Date().toISOString().split('T')[0]}.csv` });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast.success('Report exported successfully!');
  } catch { toast.error('Export failed.'); } finally { loading.value = false; }
};

const viewDetails = (tender) => router.push({ name: 'EditTender', params: { tender_id: tender.id } });

const downloadReport = async (tender) => {
  try {
    if (!tender.attachment) { toast.info('No attachment available for this tender.'); return; }
    const res = await axios.get(`/api/tenders/${tender.id}/download`, { responseType: 'blob' });
    const url = URL.createObjectURL(new Blob([res.data]));
    const a = Object.assign(document.createElement('a'), { href: url, download: `tender_${tender.tender_id}.pdf` });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast.success('Downloaded!');
  } catch { toast.error('Download failed.'); }
};

const previousPage = () => { if (currentPage.value > 1) { currentPage.value--; fetchReports(); } };
const nextPage = () => { if (currentPage.value < totalPages.value) { currentPage.value++; fetchReports(); } };

const fetchReports = async () => {
  try {
    loading.value = true;
    const res = await axios.get('/api/tenders', { params: { page: currentPage.value, per_page: perPage.value, ...filters.value } });
    if (res.data.status) {
      const data = res.data.data || [];
      reports.value = data.map(t => ({
        id: t.tender_id, tender_id: t.tender_number || t.tender_id,
        title: t.title, tender_type: t.tender_type,
        status: getTenderStatus(t), date_created: t.created_at,
        deadline: t.expired_at || t.bid_submission,
        procurement_entity: t.procurement_entity, tender_source: t.tender_source,
        date_of_publication: t.date_of_Publication, bid_submission: t.bid_submission,
        attachment: t.attachment
      }));
      summary.value = {
        total_tenders: data.length,
        completed_tenders: data.filter(t => getTenderStatus(t) === 'completed').length,
        in_progress_tenders: data.filter(t => getTenderStatus(t) === 'in-progress').length,
        awarded_tenders: data.filter(t => getTenderStatus(t) === 'awarded').length
      };
      totalRecords.value = data.length;
      totalPages.value = Math.ceil(data.length / perPage.value) || 1;
    }
  } catch { toast.error('Failed to load reports.'); } finally { loading.value = false; }
};

onMounted(fetchReports);
</script>

<style scoped>
@import url('https://fonts.2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.reports-shell {
  display: flex;
  min-height: 100vh;
  background: #f4f4f0;
  font-family: 'Sora', sans-serif;
  color: #1a1a1a;
}

/* ── Sidebar ── */
.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #0f1117;
  display: flex;
  flex-direction: column;
  padding: 28px 0;
  position: sticky;
  top: 0;
  height: 100vh;
}
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 24px 32px;
  border-bottom: 1px solid #ffffff12;
}
.brand-mark {
  background: #2ecc71;
  color: #0f1117;
  font-weight: 700;
  font-size: 12px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: 'IBM Plex Mono', monospace;
}
.brand-label { color: #fff; font-size: 14px; font-weight: 600; letter-spacing: -0.01em; }
.sidebar-nav { display: flex; flex-direction: column; padding: 20px 12px; gap: 2px; }
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  color: #8e8ea0;
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
}
.nav-item i { width: 16px; font-size: 13px; }
.nav-item:hover { background: #ffffff0d; color: #ccc; }
.nav-item.active { background: #ffffff14; color: #fff; }

/* ── Main ── */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 32px 36px;
  gap: 24px;
}

/* ── Topbar ── */
.topbar { display: flex; align-items: flex-start; justify-content: space-between; }
.page-title { font-size: 26px; font-weight: 700; letter-spacing: -0.03em; }
.page-sub { font-size: 13.5px; color: #888; margin-top: 3px; }

/* ── Buttons ── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
  transition: background 0.15s;
}
.btn-primary:hover { background: #2a2a2a; }
.btn-primary.btn-sm { padding: 8px 14px; font-size: 13px; }

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: transparent;
  color: #555;
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
  transition: background 0.15s;
}
.btn-ghost:hover { background: #eee; }
.btn-ghost.btn-sm { padding: 8px 14px; font-size: 13px; }

/* ── Summary cards ── */
.summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: box-shadow 0.15s;
}
.stat-card:hover { box-shadow: 0 4px 16px #0000000a; }
.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.icon-blue  { background: #eff6ff; color: #2563eb; }
.icon-green { background: #f0fdf4; color: #16a34a; }
.icon-amber { background: #fffbeb; color: #d97706; }
.icon-violet{ background: #f5f3ff; color: #7c3aed; }
.stat-label { font-size: 11.5px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.stat-value { font-size: 28px; font-weight: 700; letter-spacing: -0.03em; margin-top: 2px; }

/* ── Filter panel ── */
.filter-panel {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  align-items: flex-end;
  gap: 20px;
  flex-wrap: wrap;
}
.filter-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; flex: 1; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 11.5px; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.05em; }
.field-input {
  border: 1px solid #d4d4d4;
  border-radius: 7px;
  padding: 9px 12px;
  font-size: 13.5px;
  font-family: 'Sora', sans-serif;
  color: #111;
  background: #fafafa;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  -webkit-appearance: none;
}
.field-input:focus { border-color: #111; box-shadow: 0 0 0 3px #1111110f; background: #fff; }
.filter-actions { display: flex; gap: 8px; }

/* ── Table ── */
.table-panel { background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden; }
.table-scroll { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.data-table thead { background: #f8f8f6; border-bottom: 1px solid #e5e5e5; }
.data-table th {
  padding: 13px 18px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}
.table-row { border-bottom: 1px solid #f0f0ee; transition: background 0.1s; }
.table-row:last-child { border-bottom: none; }
.table-row:hover { background: #fafaf8; }
.data-table td { padding: 14px 18px; color: #1a1a1a; vertical-align: middle; }
.td-mono { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; color: #555; }
.td-title { font-weight: 500; max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.td-actions { display: flex; gap: 12px; }

/* ── Badges ── */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 600;
  text-transform: capitalize;
}
.badge-green  { background: #dcfce7; color: #15803d; }
.badge-amber  { background: #fef9c3; color: #92400e; }
.badge-gray   { background: #f3f4f6; color: #4b5563; }
.badge-violet { background: #ede9fe; color: #6d28d9; }
.badge-red    { background: #fee2e2; color: #b91c1c; }

/* ── Action links ── */
.action-link {
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
  color: #2563eb;
  padding: 0;
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: text-decoration-color 0.15s;
}
.action-link:hover { text-decoration-color: currentColor; }
.action-dl { color: #16a34a; }
.empty-state { text-align: center; padding: 48px; color: #aaa; font-size: 14px; }

/* ── Pagination ── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #f0f0ee;
}
.pag-info { font-size: 13px; color: #888; }
.pag-controls { display: flex; align-items: center; gap: 10px; }
.pag-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #fff;
  border: 1px solid #d4d4d4;
  border-radius: 7px;
  padding: 7px 13px;
  font-size: 13px;
  font-weight: 500;
  color: #444;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
  transition: background 0.12s;
}
.pag-btn:hover:not(:disabled) { background: #f5f5f5; }
.pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pag-current { font-size: 13px; font-family: 'IBM Plex Mono', monospace; color: #555; min-width: 52px; text-align: center; }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .summary-grid { grid-template-columns: repeat(2, 1fr); }
  .filter-grid { grid-template-columns: repeat(2, 1fr); }
}

</style>