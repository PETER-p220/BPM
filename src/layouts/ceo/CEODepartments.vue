<template>
  <div class="min-h-screen bg-[#edf4fb] px-4 py-4 lg:px-5">
    <div class="mx-auto flex max-w-[1580px] flex-col overflow-hidden rounded-[34px] border border-[#d9e6f3] bg-white/90 shadow-[0_28px_70px_rgba(18,58,99,0.14)] backdrop-blur-sm">

      <!-- Header -->
      <div class="relative overflow-hidden border-b border-[#dbe7f3] bg-[linear-gradient(135deg,#eef5ff_0%,#ffffff_46%,#f7fbff_100%)] px-6 py-5 lg:px-7">
        <div class="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-[#dce9fb] blur-3xl"></div>
        <div class="relative flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white shadow-[0_16px_34px_rgba(35,96,182,0.26)]">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2d6aaf]">CEO Workspace</p>
              <h1 class="mt-0.5 text-2xl font-bold tracking-tight text-[#183b63]">Departments</h1>
              <p class="mt-1 text-sm text-[#67819d]">Manage all company departments and their locations.</p>
            </div>
          </div>
          <button
            @click="openAddModal"
            class="flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(35,96,182,0.3)] transition hover:opacity-90"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Department
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-3 border-b border-[#dbe7f3] bg-[#f5f9ff] px-6 py-4 sm:grid-cols-3 lg:px-7">
        <div class="rounded-xl border border-[#d0e2f8] bg-white px-4 py-3 shadow-sm">
          <p class="text-xs font-medium text-[#5a7fa8]">Total Departments</p>
          <p class="mt-0.5 text-2xl font-bold text-[#183b63]">{{ departments.length }}</p>
        </div>
        <div class="rounded-xl border border-[#d0e2f8] bg-white px-4 py-3 shadow-sm">
          <p class="text-xs font-medium text-[#5a7fa8]">With Location</p>
          <p class="mt-0.5 text-2xl font-bold text-emerald-600">{{ departments.filter(d => d.location).length }}</p>
        </div>
        <div class="rounded-xl border border-[#d0e2f8] bg-white px-4 py-3 shadow-sm">
          <p class="text-xs font-medium text-[#5a7fa8]">Showing</p>
          <p class="mt-0.5 text-2xl font-bold text-[#2f78dd]">{{ filteredDepartments.length }}</p>
        </div>
      </div>

      <!-- Search -->
      <div class="border-b border-[#dbe7f3] bg-white px-6 py-3 lg:px-7">
        <div class="relative max-w-sm">
          <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8aa7c5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="filter"
            type="search"
            placeholder="Search departments..."
            class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] py-2 pl-9 pr-4 text-sm text-[#183b63] placeholder-[#8aa7c5] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="flex-1 overflow-auto px-6 py-4 lg:px-7">
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-[#d0e2f8] border-t-[#2f78dd]"></div>
        </div>

        <div v-else-if="filteredDepartments.length === 0" class="flex flex-col items-center justify-center py-20 text-[#8aa7c5]">
          <svg class="mb-3 h-12 w-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p class="text-sm font-medium">No departments found</p>
        </div>

        <div v-else class="overflow-hidden rounded-2xl border border-[#d9e6f3] shadow-sm">
          <table class="min-w-full divide-y divide-[#e8f0fa]">
            <thead class="bg-[#f0f6ff]">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">#</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">Department Name</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">Location</th>
                <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#e8f0fa] bg-white">
              <tr
                v-for="(dept, index) in paginatedDepartments"
                :key="dept.department_id || dept.id"
                class="cursor-pointer transition hover:bg-[#f5f9ff]"
                @click="openViewModal(dept)"
              >
                <td class="px-4 py-3 text-sm text-[#5a7fa8]">{{ (currentPage - 1) * perPage + index + 1 }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f0fa]">
                      <svg class="h-4 w-4 text-[#2f78dd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <p class="font-semibold text-[#183b63]">{{ dept.name }}</p>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-[#5a7fa8]">{{ dept.location || '—' }}</td>
                <td class="px-4 py-3 text-right" @click.stop>
                  <button
                    @click.stop="toggleMenu(dept.department_id || dept.id, $event)"
                    class="rounded-lg p-1.5 text-[#8aa7c5] transition hover:bg-[#e8f0fa] hover:text-[#183b63]"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-4 flex items-center justify-between text-sm text-[#5a7fa8]">
          <span>Showing {{ (currentPage - 1) * perPage + 1 }}–{{ Math.min(currentPage * perPage, filteredDepartments.length) }} of {{ filteredDepartments.length }}</span>
          <div class="flex gap-1">
            <button @click="currentPage--" :disabled="currentPage === 1" class="rounded-lg border border-[#d0e2f8] px-3 py-1 disabled:opacity-40 hover:bg-[#f0f6ff]">‹</button>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="rounded-lg border border-[#d0e2f8] px-3 py-1 disabled:opacity-40 hover:bg-[#f0f6ff]">›</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div v-if="showAddModal || showEditModal || showViewModal" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" @click="closeAllModals"></div>

    <!-- ADD MODAL -->
    <Teleport to="body">
      <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl" @click.stop>
          <div class="flex items-center justify-between border-b border-[#e8f0fa] px-6 py-4">
            <h2 class="text-lg font-bold text-[#183b63]">New Department</h2>
            <button @click="showAddModal = false" class="rounded-lg p-1.5 text-[#8aa7c5] hover:bg-[#f0f6ff]">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="space-y-4 px-6 py-5">
            <div>
              <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Department Name *</label>
              <input v-model="form.name" type="text" placeholder="e.g. Engineering" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Location / Branch</label>
              <select v-model="form.location" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20">
                <option value="">— Select Branch —</option>
                <option v-for="b in branches" :key="b.branch_id" :value="b.name">{{ b.name }}</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-3 border-t border-[#e8f0fa] px-6 py-4">
            <button @click="showAddModal = false" class="rounded-xl border border-[#d0e2f8] px-5 py-2 text-sm font-medium text-[#5a7fa8] hover:bg-[#f0f6ff]">Cancel</button>
            <button @click="submitAdd" :disabled="saving" class="flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60">
              <svg v-if="saving" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              Create
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- EDIT MODAL -->
    <Teleport to="body">
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl" @click.stop>
          <div class="flex items-center justify-between border-b border-[#e8f0fa] px-6 py-4">
            <h2 class="text-lg font-bold text-[#183b63]">Edit Department</h2>
            <button @click="showEditModal = false" class="rounded-lg p-1.5 text-[#8aa7c5] hover:bg-[#f0f6ff]">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="space-y-4 px-6 py-5">
            <div>
              <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Department Name *</label>
              <input v-model="form.name" type="text" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Location / Branch</label>
              <select v-model="form.location" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20">
                <option value="">— Select Branch —</option>
                <option v-for="b in branches" :key="b.branch_id" :value="b.name">{{ b.name }}</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-3 border-t border-[#e8f0fa] px-6 py-4">
            <button @click="showEditModal = false" class="rounded-xl border border-[#d0e2f8] px-5 py-2 text-sm font-medium text-[#5a7fa8] hover:bg-[#f0f6ff]">Cancel</button>
            <button @click="submitEdit" :disabled="saving" class="flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60">
              <svg v-if="saving" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- VIEW MODAL -->
    <Teleport to="body">
      <div v-if="showViewModal && selectedDept" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="w-full max-w-sm rounded-2xl bg-white shadow-2xl" @click.stop>
          <div class="flex items-center justify-between border-b border-[#e8f0fa] px-6 py-4">
            <h2 class="text-lg font-bold text-[#183b63]">Department Details</h2>
            <button @click="showViewModal = false" class="rounded-lg p-1.5 text-[#8aa7c5] hover:bg-[#f0f6ff]">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="space-y-3 px-6 py-5">
            <div class="flex items-center gap-3 rounded-xl bg-[#f0f6ff] px-4 py-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2f78dd]/10">
                <svg class="h-5 w-5 text-[#2f78dd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-[#8aa7c5]">Name</p>
                <p class="font-semibold text-[#183b63]">{{ selectedDept.name }}</p>
              </div>
            </div>
            <div class="rounded-xl border border-[#e8f0fa] px-4 py-3">
              <p class="text-xs text-[#8aa7c5]">Location</p>
              <p class="mt-0.5 font-medium text-[#374b63]">{{ selectedDept.location || '—' }}</p>
            </div>
          </div>
          <div class="flex justify-end gap-3 border-t border-[#e8f0fa] px-6 py-4">
            <button @click="showViewModal = false" class="rounded-xl border border-[#d0e2f8] px-5 py-2 text-sm font-medium text-[#5a7fa8] hover:bg-[#f0f6ff]">Close</button>
            <button @click="openEditModal(selectedDept); showViewModal = false" class="rounded-xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-5 py-2 text-sm font-semibold text-white hover:opacity-90">Edit</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Floating action dropdown -->
    <Teleport to="body">
      <div
        v-if="openMenuId !== null && menuDept"
        :style="{ position: 'fixed', top: menuPos.y + 'px', left: (menuPos.x - 160) + 'px', zIndex: 9999 }"
        class="w-40 rounded-xl border border-[#d9e6f3] bg-white py-1 shadow-xl"
        @click.stop
      >
        <button @click="openViewModal(menuDept); openMenuId = null" class="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#374b63] hover:bg-[#f0f6ff]">
          <svg class="h-4 w-4 text-[#2f78dd]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          View
        </button>
        <button @click="openEditModal(menuDept); openMenuId = null" class="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#374b63] hover:bg-[#f0f6ff]">
          <svg class="h-4 w-4 text-[#2f78dd]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Edit
        </button>
        <button @click="deleteDepartment(menuDept); openMenuId = null" class="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          Delete
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import Swal from 'sweetalert2';

const toast = useToast();

const departments = ref([]);
const branches = ref([]);
const loading = ref(true);
const saving = ref(false);
const filter = ref('');
const currentPage = ref(1);
const perPage = 15;

const showAddModal = ref(false);
const showEditModal = ref(false);
const showViewModal = ref(false);
const selectedDept = ref(null);
const openMenuId = ref(null);
const menuPos = ref({ x: 0, y: 0 });
const menuDept = computed(() => departments.value.find(d => (d.department_id || d.id) === openMenuId.value));

const form = ref({ name: '', location: '' });

onMounted(async () => {
  await Promise.all([fetchDepartments(), fetchBranches()]);
});

async function fetchBranches() {
  try {
    const res = await axios.get('/api/branches');
    branches.value = res.data?.data || res.data || [];
  } catch (e) {
    console.warn('Failed to load branches', e);
  }
}

async function fetchDepartments() {
  loading.value = true;
  try {
    const res = await axios.get('/api/departments');
    departments.value = res.data?.data || res.data || [];
  } catch {
    toast.error('Failed to load departments');
  } finally {
    loading.value = false;
  }
}

const filteredDepartments = computed(() => {
  const q = filter.value.toLowerCase();
  if (!q) return departments.value;
  return departments.value.filter(d =>
    d.name?.toLowerCase().includes(q) || d.location?.toLowerCase().includes(q)
  );
});

const totalPages = computed(() => Math.ceil(filteredDepartments.value.length / perPage));
const paginatedDepartments = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredDepartments.value.slice(start, start + perPage);
});

function openAddModal() {
  form.value = { name: '', location: '' };
  showAddModal.value = true;
}

function openEditModal(dept) {
  selectedDept.value = dept;
  form.value = { name: dept.name || '', location: dept.location || '' };
  showEditModal.value = true;
}

function openViewModal(dept) {
  selectedDept.value = dept;
  showViewModal.value = true;
}

function closeAllModals() {
  showAddModal.value = false;
  showEditModal.value = false;
  showViewModal.value = false;
  openMenuId.value = null;
}

function toggleMenu(id, event) {
  if (openMenuId.value === id) { openMenuId.value = null; return; }
  const rect = event.currentTarget.getBoundingClientRect();
  const menuH = 120;
  const y = (window.innerHeight - rect.bottom) >= menuH ? rect.bottom + 4 : rect.top - menuH - 4;
  menuPos.value = { x: rect.right, y };
  openMenuId.value = id;
}

async function submitAdd() {
  if (!form.value.name.trim()) { toast.warning('Name is required'); return; }
  saving.value = true;
  try {
    await axios.post('/api/departments', form.value);
    toast.success('Department created');
    showAddModal.value = false;
    await fetchDepartments();
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to create department');
  } finally {
    saving.value = false;
  }
}

async function submitEdit() {
  if (!form.value.name.trim()) { toast.warning('Name is required'); return; }
  saving.value = true;
  try {
    const id = selectedDept.value.department_id || selectedDept.value.id;
    await axios.put(`/api/departments/${id}`, form.value);
    toast.success('Department updated');
    showEditModal.value = false;
    await fetchDepartments();
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to update department');
  } finally {
    saving.value = false;
  }
}

async function deleteDepartment(dept) {
  const result = await Swal.fire({
    title: 'Delete Department?',
    text: `"${dept.name}" will be permanently removed.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e53e3e',
    cancelButtonColor: '#718096',
    confirmButtonText: 'Yes, delete',
  });
  if (!result.isConfirmed) return;
  try {
    const id = dept.department_id || dept.id;
    await axios.delete(`/api/departments/${id}`);
    toast.success('Department deleted');
    await fetchDepartments();
  } catch {
    toast.error('Failed to delete department');
  }
}

document.addEventListener('click', () => { openMenuId.value = null; });
</script>
