<template>
  <div class="min-h-screen bg-[#edf4fb] px-4 py-4 lg:px-5 projects-page-shell">
    <div class="projects-frame mx-auto flex max-w-[1580px] flex-col overflow-hidden rounded-[34px] border border-[#d9e6f3] bg-white/90 shadow-[0_28px_70px_rgba(18,58,99,0.14)] backdrop-blur-sm">

      <!-- Header -->
      <div class="relative overflow-hidden border-b border-[#dbe7f3] bg-[linear-gradient(135deg,#eef5ff_0%,#ffffff_46%,#f7fbff_100%)] px-6 py-5 lg:px-7">
        <div class="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-[#dce9fb] blur-3xl"></div>
        <div class="relative flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white shadow-[0_16px_34px_rgba(35,96,182,0.26)]">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2d6aaf]">CEO Workspace</p>
              <h1 class="mt-0.5 text-2xl font-bold tracking-tight text-[#183b63]">Company Projects</h1>
              <p class="mt-1 text-sm text-[#67819d]">View, manage, and assign all company projects in one place.</p>
            </div>
          </div>
          <button
            @click="openAddModal"
            class="flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(35,96,182,0.3)] transition hover:opacity-90"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Project
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-3 border-b border-[#dbe7f3] bg-[#f5f9ff] px-6 py-4 sm:grid-cols-4 lg:px-7">
        <div class="rounded-xl border border-[#d0e2f8] bg-white px-4 py-3 shadow-sm">
          <p class="text-xs font-medium text-[#5a7fa8]">Total</p>
          <p class="mt-0.5 text-2xl font-bold text-[#183b63]">{{ projects.length }}</p>
        </div>
        <div class="rounded-xl border border-[#d0e2f8] bg-white px-4 py-3 shadow-sm">
          <p class="text-xs font-medium text-[#5a7fa8]">Active</p>
          <p class="mt-0.5 text-2xl font-bold text-emerald-600">{{ countByStatus('active') }}</p>
        </div>
        <div class="rounded-xl border border-[#d0e2f8] bg-white px-4 py-3 shadow-sm">
          <p class="text-xs font-medium text-[#5a7fa8]">Completed</p>
          <p class="mt-0.5 text-2xl font-bold text-blue-600">{{ countByStatus('completed') }}</p>
        </div>
        <div class="rounded-xl border border-[#d0e2f8] bg-white px-4 py-3 shadow-sm">
          <p class="text-xs font-medium text-[#5a7fa8]">Pending</p>
          <p class="mt-0.5 text-2xl font-bold text-amber-500">{{ countByStatus('pending') }}</p>
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
            placeholder="Search projects..."
            class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] py-2 pl-9 pr-4 text-sm text-[#183b63] placeholder-[#8aa7c5] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="flex-1 overflow-auto px-6 py-4 lg:px-7">
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-[#d0e2f8] border-t-[#2f78dd]"></div>
        </div>

        <div v-else-if="filteredProjects.length === 0" class="flex flex-col items-center justify-center py-20 text-[#8aa7c5]">
          <svg class="mb-3 h-12 w-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p class="text-sm font-medium">No projects found</p>
        </div>

        <div v-else class="overflow-hidden rounded-2xl border border-[#d9e6f3] shadow-sm">
          <table class="min-w-full divide-y divide-[#e8f0fa]">
            <thead class="bg-[#f0f6ff]">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">#</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">Project Name</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">Project Manager</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">Status</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">Start Date</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">End Date</th>
                <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#e8f0fa] bg-white">
              <tr
                v-for="(project, index) in paginatedProjects"
                :key="project.id"
                class="cursor-pointer transition hover:bg-[#f5f9ff]"
                @click="openViewModal(project)"
              >
                <td class="px-4 py-3 text-sm text-[#5a7fa8]">{{ (currentPage - 1) * perPage + index + 1 }}</td>
                <td class="px-4 py-3">
                  <p class="font-semibold text-[#183b63]">{{ project.project_name }}</p>
                </td>
                <td class="px-4 py-3 text-sm text-[#374b63]">{{ project.user?.name || '—' }}</td>
                <td class="px-4 py-3">
                  <span :class="statusBadge(project.project_status)" class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize">
                    {{ project.project_status || 'pending' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-[#5a7fa8]">{{ formatDate(project.start_date) }}</td>
                <td class="px-4 py-3 text-sm text-[#5a7fa8]">{{ formatDate(project.end_date) }}</td>
                <td class="px-4 py-3 text-right" @click.stop>
                  <button
                    @click.stop="toggleMenu(project.project_id || project.id, $event)"
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
          <span>Showing {{ (currentPage - 1) * perPage + 1 }}–{{ Math.min(currentPage * perPage, filteredProjects.length) }} of {{ filteredProjects.length }}</span>
          <div class="flex gap-1">
            <button @click="currentPage--" :disabled="currentPage === 1" class="rounded-lg border border-[#d0e2f8] px-3 py-1 disabled:opacity-40 hover:bg-[#f0f6ff]">‹</button>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="rounded-lg border border-[#d0e2f8] px-3 py-1 disabled:opacity-40 hover:bg-[#f0f6ff]">›</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay backdrop -->
    <div v-if="showAddModal || showEditModal || showViewModal" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" @click="closeAllModals"></div>

    <!-- ADD MODAL -->
    <Teleport to="body">
      <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="w-full max-w-lg rounded-2xl bg-white shadow-2xl" @click.stop>
          <div class="flex items-center justify-between border-b border-[#e8f0fa] px-6 py-4">
            <h2 class="text-lg font-bold text-[#183b63]">New Project</h2>
            <button @click="showAddModal = false" class="rounded-lg p-1.5 text-[#8aa7c5] hover:bg-[#f0f6ff]">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="space-y-4 px-6 py-5">
            <div>
              <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Project Name *</label>
              <input v-model="form.project_name" type="text" placeholder="Enter project name" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Start Date</label>
                <input v-model="form.start_date" type="date" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
              </div>
              <div>
                <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">End Date</label>
                <input v-model="form.end_date" type="date" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
              </div>
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Status</label>
              <select v-model="form.project_status" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20">
                <option value="on-progress">On Progress</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Assign Project Manager (optional)</label>
              <select v-model="form.user_id" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20">
                <option value="">— None —</option>
                <option v-for="u in users" :key="u.user_id" :value="u.user_id">{{ u.name }}</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-3 border-t border-[#e8f0fa] px-6 py-4">
            <button @click="showAddModal = false" class="rounded-xl border border-[#d0e2f8] px-5 py-2 text-sm font-medium text-[#5a7fa8] hover:bg-[#f0f6ff]">Cancel</button>
            <button @click="submitAdd" :disabled="saving" class="flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60">
              <svg v-if="saving" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              Create Project
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- EDIT MODAL -->
    <Teleport to="body">
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="w-full max-w-lg rounded-2xl bg-white shadow-2xl" @click.stop>
          <div class="flex items-center justify-between border-b border-[#e8f0fa] px-6 py-4">
            <h2 class="text-lg font-bold text-[#183b63]">Edit Project</h2>
            <button @click="showEditModal = false" class="rounded-lg p-1.5 text-[#8aa7c5] hover:bg-[#f0f6ff]">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="space-y-4 px-6 py-5">
            <div>
              <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Project Name *</label>
              <input v-model="form.project_name" type="text" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Start Date</label>
                <input v-model="form.start_date" type="date" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
              </div>
              <div>
                <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">End Date</label>
                <input v-model="form.end_date" type="date" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
              </div>
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Status</label>
              <select v-model="form.project_status" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20">
                <option value="on-progress">On Progress</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Project Manager</label>
              <select v-model="form.user_id" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20">
                <option value="">— None —</option>
                <option v-for="u in users" :key="u.user_id" :value="u.user_id">{{ u.name }}</option>
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
      <div v-if="showViewModal && selectedProject" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl" @click.stop>
          <div class="flex items-center justify-between border-b border-[#e8f0fa] px-6 py-4">
            <h2 class="text-lg font-bold text-[#183b63]">Project Details</h2>
            <button @click="showViewModal = false" class="rounded-lg p-1.5 text-[#8aa7c5] hover:bg-[#f0f6ff]">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="space-y-3 px-6 py-5">
            <div class="flex items-center gap-3 rounded-xl bg-[#f0f6ff] px-4 py-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2f78dd]/10">
                <svg class="h-5 w-5 text-[#2f78dd]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <div>
                <p class="text-xs text-[#8aa7c5]">Project</p>
                <p class="font-semibold text-[#183b63]">{{ selectedProject.project_name }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div class="rounded-xl border border-[#e8f0fa] px-3 py-2.5">
                <p class="text-xs text-[#8aa7c5]">Status</p>
                <span :class="statusBadge(selectedProject.project_status)" class="mt-0.5 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize">{{ selectedProject.project_status || 'pending' }}</span>
              </div>
              <div class="rounded-xl border border-[#e8f0fa] px-3 py-2.5">
                <p class="text-xs text-[#8aa7c5]">Project Manager</p>
                <p class="mt-0.5 text-sm font-medium text-[#374b63]">{{ selectedProject.user?.name || '—' }}</p>
              </div>
              <div class="rounded-xl border border-[#e8f0fa] px-3 py-2.5">
                <p class="text-xs text-[#8aa7c5]">Start Date</p>
                <p class="mt-0.5 text-sm font-medium text-[#374b63]">{{ formatDate(selectedProject.start_date) }}</p>
              </div>
              <div class="rounded-xl border border-[#e8f0fa] px-3 py-2.5">
                <p class="text-xs text-[#8aa7c5]">End Date</p>
                <p class="mt-0.5 text-sm font-medium text-[#374b63]">{{ formatDate(selectedProject.end_date) }}</p>
              </div>
            </div>
            <div class="rounded-xl border border-[#e8f0fa] px-3 py-2.5">
              <p class="text-xs text-[#8aa7c5]">Created By</p>
              <p class="mt-0.5 text-sm font-medium text-[#374b63]">{{ selectedProject.created_by || '—' }}</p>
            </div>
          </div>
          <div class="flex justify-end gap-3 border-t border-[#e8f0fa] px-6 py-4">
            <button @click="showViewModal = false" class="rounded-xl border border-[#d0e2f8] px-5 py-2 text-sm font-medium text-[#5a7fa8] hover:bg-[#f0f6ff]">Close</button>
            <button @click="openEditModal(selectedProject); showViewModal = false" class="rounded-xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-5 py-2 text-sm font-semibold text-white hover:opacity-90">Edit</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Floating action dropdown -->
    <Teleport to="body">
      <div
        v-if="openMenuId !== null && menuProject"
        :style="{ position: 'fixed', top: menuPos.y + 'px', left: (menuPos.x - 160) + 'px', zIndex: 9999 }"
        class="w-40 rounded-xl border border-[#d9e6f3] bg-white py-1 shadow-xl"
        @click.stop
      >
        <button @click="openViewModal(menuProject); openMenuId = null" class="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#374b63] hover:bg-[#f0f6ff]">
          <svg class="h-4 w-4 text-[#2f78dd]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          View
        </button>
        <button @click="openEditModal(menuProject); openMenuId = null" class="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#374b63] hover:bg-[#f0f6ff]">
          <svg class="h-4 w-4 text-[#2f78dd]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Edit
        </button>
        <button @click="deleteProject(menuProject); openMenuId = null" class="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
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

const projects = ref([]);
const users = ref([]);
const loading = ref(true);
const saving = ref(false);
const filter = ref('');
const currentPage = ref(1);
const perPage = 15;

const showAddModal = ref(false);
const showEditModal = ref(false);
const showViewModal = ref(false);
const selectedProject = ref(null);
const openMenuId = ref(null);
const menuPos = ref({ x: 0, y: 0 });
const menuProject = computed(() => projects.value.find(p => (p.project_id || p.id) === openMenuId.value));

const form = ref({
  project_name: '',
  start_date: '',
  end_date: '',
  project_status: 'pending',
  user_id: '',
});

onMounted(async () => {
  await Promise.all([fetchProjects(), fetchUsers()]);
});

async function fetchProjects() {
  loading.value = true;
  try {
    const res = await axios.get('/api/projects');
    projects.value = res.data?.data || res.data || [];
  } catch {
    toast.error('Failed to load projects');
  } finally {
    loading.value = false;
  }
}

async function fetchUsers() {
  try {
    const res = await axios.get('/api/all/users');
    users.value = res.data?.users || [];
  } catch {
    // non-critical
  }
}

const filteredProjects = computed(() => {
  const q = filter.value.toLowerCase();
  if (!q) return projects.value;
  return projects.value.filter(p =>
    p.project_name?.toLowerCase().includes(q) ||
    p.project_status?.toLowerCase().includes(q) ||
    p.user?.name?.toLowerCase().includes(q)
  );
});

const totalPages = computed(() => Math.ceil(filteredProjects.value.length / perPage));
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredProjects.value.slice(start, start + perPage);
});

function countByStatus(status) {
  return projects.value.filter(p => p.project_status === status).length;
}

function statusBadge(status) {
  const map = {
    active: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-blue-100 text-blue-700',
    failed: 'bg-red-100 text-red-700',
    pending: 'bg-amber-100 text-amber-700',
  };
  return map[status] || map.pending;
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function resetForm() {
  form.value = { project_name: '', start_date: '', end_date: '', project_status: 'on-progress', user_id: '' };
}

function openAddModal() {
  resetForm();
  showAddModal.value = true;
}

function openEditModal(project) {
  selectedProject.value = project;
  form.value = {
    project_name: project.project_name || '',
    start_date: project.start_date || '',
    end_date: project.end_date || '',
    project_status: project.project_status || 'pending',
    user_id: project.user_id || project.user?.user_id || '',
  };
  showEditModal.value = true;
}

function openViewModal(project) {
  selectedProject.value = project;
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
  if (!form.value.project_name.trim()) {
    toast.warning('Project name is required');
    return;
  }
  saving.value = true;
  try {
    const payload = { ...form.value };
    if (!payload.user_id) delete payload.user_id;
    const authUser = JSON.parse(localStorage.getItem('user') || '{}');
    payload.created_by = authUser?.name || 'CEO';
    await axios.post('/api/projects', payload);
    toast.success('Project created successfully');
    showAddModal.value = false;
    await fetchProjects();
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to create project');
  } finally {
    saving.value = false;
  }
}

async function submitEdit() {
  if (!form.value.project_name.trim()) {
    toast.warning('Project name is required');
    return;
  }
  saving.value = true;
  try {
    const id = selectedProject.value.id || selectedProject.value.project_id;
    const payload = { ...form.value };
    if (!payload.user_id) delete payload.user_id;
    await axios.put(`/api/projects/${id}`, payload);
    toast.success('Project updated successfully');
    showEditModal.value = false;
    await fetchProjects();
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to update project');
  } finally {
    saving.value = false;
  }
}

async function deleteProject(project) {
  const result = await Swal.fire({
    title: 'Delete Project?',
    text: `"${project.project_name}" will be permanently removed.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e53e3e',
    cancelButtonColor: '#718096',
    confirmButtonText: 'Yes, delete it',
  });
  if (!result.isConfirmed) return;
  try {
    const id = project.id || project.project_id;
    await axios.delete(`/api/projects/${id}`);
    toast.success('Project deleted');
    await fetchProjects();
  } catch {
    toast.error('Failed to delete project');
  }
}

document.addEventListener('click', () => { openMenuId.value = null; });
</script>
