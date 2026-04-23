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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2d6aaf]">CEO Workspace</p>
              <h1 class="mt-0.5 text-2xl font-bold tracking-tight text-[#183b63]">Team</h1>
              <p class="mt-1 text-sm text-[#67819d]">Manage system users, assign roles and departments.</p>
            </div>
          </div>
          <button
            @click="openAddModal"
            class="flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(35,96,182,0.3)] transition hover:opacity-90"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add Member
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-3 border-b border-[#dbe7f3] bg-[#f5f9ff] px-6 py-4 sm:grid-cols-4 lg:px-7">
        <div class="rounded-xl border border-[#d0e2f8] bg-white px-4 py-3 shadow-sm">
          <p class="text-xs font-medium text-[#5a7fa8]">Total Users</p>
          <p class="mt-0.5 text-2xl font-bold text-[#183b63]">{{ users.length }}</p>
        </div>
        <div class="rounded-xl border border-[#d0e2f8] bg-white px-4 py-3 shadow-sm">
          <p class="text-xs font-medium text-[#5a7fa8]">Active</p>
          <p class="mt-0.5 text-2xl font-bold text-emerald-600">{{ users.filter(u => u.status === 'active' || u.status === 1).length }}</p>
        </div>
        <div class="rounded-xl border border-[#d0e2f8] bg-white px-4 py-3 shadow-sm">
          <p class="text-xs font-medium text-[#5a7fa8]">Departments</p>
          <p class="mt-0.5 text-2xl font-bold text-[#2f78dd]">{{ departments.length }}</p>
        </div>
        <div class="rounded-xl border border-[#d0e2f8] bg-white px-4 py-3 shadow-sm">
          <p class="text-xs font-medium text-[#5a7fa8]">Showing</p>
          <p class="mt-0.5 text-2xl font-bold text-[#5a7fa8]">{{ filteredUsers.length }}</p>
        </div>
      </div>

      <!-- Search + Filter -->
      <div class="flex flex-col gap-3 border-b border-[#dbe7f3] bg-white px-6 py-3 sm:flex-row sm:items-center lg:px-7">
        <div class="relative max-w-sm flex-1">
          <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8aa7c5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="filter"
            type="search"
            placeholder="Search by name or email..."
            class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] py-2 pl-9 pr-4 text-sm text-[#183b63] placeholder-[#8aa7c5] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20"
          />
        </div>
        <select v-model="roleFilter" class="rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2 text-sm text-[#183b63] outline-none focus:border-[#2f78dd]">
          <option value="">All Roles</option>
          <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.name }}</option>
        </select>
        <select v-model="deptFilter" class="rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2 text-sm text-[#183b63] outline-none focus:border-[#2f78dd]">
          <option value="">All Departments</option>
          <option v-for="d in departments" :key="d.department_id || d.id" :value="d.department_id || d.id">{{ d.name }}</option>
        </select>
      </div>

      <!-- Table -->
      <div class="flex-1 overflow-auto px-6 py-4 lg:px-7">
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-[#d0e2f8] border-t-[#2f78dd]"></div>
        </div>

        <div v-else-if="filteredUsers.length === 0" class="flex flex-col items-center justify-center py-20 text-[#8aa7c5]">
          <svg class="mb-3 h-12 w-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p class="text-sm font-medium">No team members found</p>
        </div>

        <div v-else class="overflow-hidden rounded-2xl border border-[#d9e6f3] shadow-sm">
          <table class="min-w-full divide-y divide-[#e8f0fa]">
            <thead class="bg-[#f0f6ff]">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">#</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">Member</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">Role</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">Department</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">Status</th>
                <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#e8f0fa] bg-white">
              <tr
                v-for="(user, index) in paginatedUsers"
                :key="user.user_id"
                class="cursor-pointer transition hover:bg-[#f5f9ff]"
                @click="openViewModal(user)"
              >
                <td class="px-4 py-3 text-sm text-[#5a7fa8]">{{ (currentPage - 1) * perPage + index + 1 }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2.5">
                    <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#194f92] text-xs font-bold text-white">
                      {{ (user.name || 'U')[0].toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-semibold text-[#183b63]">{{ user.name }}</p>
                      <p class="text-xs text-[#8aa7c5]">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span class="inline-flex rounded-full bg-[#e8f0fa] px-2.5 py-0.5 text-xs font-semibold text-[#194f92]">
                    {{ user.role?.name || user.role || '—' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-[#5a7fa8]">{{ user.department?.name || user.department || '—' }}</td>
                <td class="px-4 py-3">
                  <span :class="user.status === 'active' || user.status === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'" class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize">
                    {{ user.status === 1 ? 'active' : (user.status || 'inactive') }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right" @click.stop>
                  <button
                    @click.stop="toggleMenu(user.user_id, $event)"
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
          <span>Showing {{ (currentPage - 1) * perPage + 1 }}–{{ Math.min(currentPage * perPage, filteredUsers.length) }} of {{ filteredUsers.length }}</span>
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
        <div class="w-full max-w-lg rounded-2xl bg-white shadow-2xl" @click.stop>
          <div class="flex items-center justify-between border-b border-[#e8f0fa] px-6 py-4">
            <h2 class="text-lg font-bold text-[#183b63]">Add Team Member</h2>
            <button @click="showAddModal = false" class="rounded-lg p-1.5 text-[#8aa7c5] hover:bg-[#f0f6ff]">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="space-y-4 px-6 py-5">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Full Name *</label>
                <input v-model="form.name" type="text" placeholder="John Doe" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
              </div>
              <div>
                <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Email *</label>
                <input v-model="form.email" type="email" placeholder="john@example.com" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
              </div>
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Password *</label>
              <input v-model="form.password" type="password" placeholder="Min. 8 characters" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Role *</label>
                <select v-model="form.role_id" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20">
                  <option value="">Select role</option>
                  <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.name }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Department</label>
                <select v-model="form.department_id" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20">
                  <option value="">Select department</option>
                  <option v-for="d in departments" :key="d.department_id || d.id" :value="d.department_id || d.id">{{ d.name }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-3 border-t border-[#e8f0fa] px-6 py-4">
            <button @click="showAddModal = false" class="rounded-xl border border-[#d0e2f8] px-5 py-2 text-sm font-medium text-[#5a7fa8] hover:bg-[#f0f6ff]">Cancel</button>
            <button @click="submitAdd" :disabled="saving" class="flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60">
              <svg v-if="saving" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              Add Member
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
            <h2 class="text-lg font-bold text-[#183b63]">Edit Member</h2>
            <button @click="showEditModal = false" class="rounded-lg p-1.5 text-[#8aa7c5] hover:bg-[#f0f6ff]">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="space-y-4 px-6 py-5">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Full Name *</label>
                <input v-model="form.name" type="text" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
              </div>
              <div>
                <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Email *</label>
                <input v-model="form.email" type="email" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
              </div>
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">New Password <span class="font-normal text-[#8aa7c5]">(leave blank to keep current)</span></label>
              <input v-model="form.password" type="password" placeholder="Leave blank to keep current" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Role *</label>
                <select v-model="form.role_id" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20">
                  <option value="">Select role</option>
                  <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.name }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Department</label>
                <select v-model="form.department_id" class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20">
                  <option value="">Select department</option>
                  <option v-for="d in departments" :key="d.department_id || d.id" :value="d.department_id || d.id">{{ d.name }}</option>
                </select>
              </div>
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
      <div v-if="showViewModal && selectedUser" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl" @click.stop>
          <div class="flex items-center justify-between border-b border-[#e8f0fa] px-6 py-4">
            <h2 class="text-lg font-bold text-[#183b63]">Member Profile</h2>
            <button @click="showViewModal = false" class="rounded-lg p-1.5 text-[#8aa7c5] hover:bg-[#f0f6ff]">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="space-y-3 px-6 py-5">
            <div class="flex items-center gap-4 rounded-xl bg-[#f0f6ff] px-4 py-4">
              <div class="flex h-14 w-14 items-center justify-center rounded-full bg-[#194f92] text-xl font-bold text-white">
                {{ (selectedUser.name || 'U')[0].toUpperCase() }}
              </div>
              <div>
                <p class="font-bold text-[#183b63]">{{ selectedUser.name }}</p>
                <p class="text-sm text-[#8aa7c5]">{{ selectedUser.email }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div class="rounded-xl border border-[#e8f0fa] px-3 py-2.5">
                <p class="text-xs text-[#8aa7c5]">Role</p>
                <p class="mt-0.5 text-sm font-semibold text-[#194f92]">{{ selectedUser.role?.name || selectedUser.role || '—' }}</p>
              </div>
              <div class="rounded-xl border border-[#e8f0fa] px-3 py-2.5">
                <p class="text-xs text-[#8aa7c5]">Status</p>
                <span :class="selectedUser.status === 'active' || selectedUser.status === 1 ? 'text-emerald-600' : 'text-gray-400'" class="mt-0.5 block text-sm font-semibold capitalize">
                  {{ selectedUser.status === 1 ? 'active' : (selectedUser.status || 'inactive') }}
                </span>
              </div>
            </div>
            <div class="rounded-xl border border-[#e8f0fa] px-3 py-2.5">
              <p class="text-xs text-[#8aa7c5]">Department</p>
              <p class="mt-0.5 text-sm font-medium text-[#374b63]">{{ selectedUser.department?.name || selectedUser.department || '—' }}</p>
            </div>
          </div>
          <div class="flex justify-end gap-3 border-t border-[#e8f0fa] px-6 py-4">
            <button @click="showViewModal = false" class="rounded-xl border border-[#d0e2f8] px-5 py-2 text-sm font-medium text-[#5a7fa8] hover:bg-[#f0f6ff]">Close</button>
            <button @click="openEditModal(selectedUser); showViewModal = false" class="rounded-xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-5 py-2 text-sm font-semibold text-white hover:opacity-90">Edit</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Floating action dropdown -->
    <Teleport to="body">
      <div
        v-if="openMenuId !== null && menuUser"
        :style="{ position: 'fixed', top: menuPos.y + 'px', left: (menuPos.x - 160) + 'px', zIndex: 9999 }"
        class="w-40 rounded-xl border border-[#d9e6f3] bg-white py-1 shadow-xl"
        @click.stop
      >
        <button @click="openViewModal(menuUser); openMenuId = null" class="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#374b63] hover:bg-[#f0f6ff]">
          <svg class="h-4 w-4 text-[#2f78dd]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          View
        </button>
        <button @click="openEditModal(menuUser); openMenuId = null" class="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#374b63] hover:bg-[#f0f6ff]">
          <svg class="h-4 w-4 text-[#2f78dd]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Edit
        </button>
        <button @click="deleteUser(menuUser); openMenuId = null" class="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
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

const users = ref([]);
const roles = ref([]);
const departments = ref([]);
const loading = ref(true);
const saving = ref(false);
const filter = ref('');
const roleFilter = ref('');
const deptFilter = ref('');
const currentPage = ref(1);
const perPage = 15;

const showAddModal = ref(false);
const showEditModal = ref(false);
const showViewModal = ref(false);
const selectedUser = ref(null);
const openMenuId = ref(null);
const menuPos = ref({ x: 0, y: 0 });
const menuUser = computed(() => users.value.find(u => u.user_id === openMenuId.value));

const form = ref({ name: '', email: '', password: '', role_id: '', department_id: '' });

onMounted(async () => {
  await Promise.all([fetchUsers(), fetchRoles(), fetchDepartments()]);
});

async function fetchUsers() {
  loading.value = true;
  try {
    const res = await axios.get('/api/all/users');
    users.value = res.data?.users || res.data?.data || [];
  } catch {
    toast.error('Failed to load users');
  } finally {
    loading.value = false;
  }
}

async function fetchRoles() {
  try {
    const res = await axios.get('/api/auth/roles');
    roles.value = res.data?.data || res.data || [];
  } catch { /* non-critical */ }
}

async function fetchDepartments() {
  try {
    const res = await axios.get('/api/departments');
    departments.value = res.data?.data || res.data || [];
  } catch { /* non-critical */ }
}

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const q = filter.value.toLowerCase();
    const matchQ = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    const matchRole = !roleFilter.value || u.role_id == roleFilter.value || u.role?.id == roleFilter.value;
    const matchDept = !deptFilter.value || u.department_id == deptFilter.value || u.department?.id == deptFilter.value;
    return matchQ && matchRole && matchDept;
  });
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / perPage));
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredUsers.value.slice(start, start + perPage);
});

function openAddModal() {
  form.value = { name: '', email: '', password: '', role_id: '', department_id: '' };
  showAddModal.value = true;
}

function openEditModal(user) {
  selectedUser.value = user;
  form.value = {
    name: user.name || '',
    email: user.email || '',
    password: '',
    role_id: user.role_id || user.role?.id || '',
    department_id: user.department_id || user.department?.id || '',
  };
  showEditModal.value = true;
}

function openViewModal(user) {
  selectedUser.value = user;
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
  if (!form.value.name.trim() || !form.value.email.trim() || !form.value.password) {
    toast.warning('Name, email and password are required');
    return;
  }
  if (!form.value.role_id) { toast.warning('Please select a role'); return; }
  saving.value = true;
  try {
    const payload = { ...form.value };
    if (!payload.department_id) delete payload.department_id;
    await axios.post('/api/auth/add-user', payload);
    toast.success('Member added successfully');
    showAddModal.value = false;
    await fetchUsers();
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to add member');
  } finally {
    saving.value = false;
  }
}

async function submitEdit() {
  if (!form.value.name.trim() || !form.value.email.trim()) {
    toast.warning('Name and email are required');
    return;
  }
  saving.value = true;
  try {
    const payload = { ...form.value };
    if (!payload.password) delete payload.password;
    if (!payload.department_id) delete payload.department_id;
    await axios.put(`/api/user/${selectedUser.value.user_id}`, payload);
    toast.success('Member updated successfully');
    showEditModal.value = false;
    await fetchUsers();
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to update member');
  } finally {
    saving.value = false;
  }
}

async function deleteUser(user) {
  const result = await Swal.fire({
    title: 'Remove Member?',
    text: `"${user.name}" will be permanently removed from the system.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e53e3e',
    cancelButtonColor: '#718096',
    confirmButtonText: 'Yes, remove',
  });
  if (!result.isConfirmed) return;
  try {
    await axios.delete(`/api/auth/user/${user.user_id}`);
    toast.success('Member removed');
    await fetchUsers();
  } catch {
    toast.error('Failed to remove member');
  }
}

document.addEventListener('click', () => { openMenuId.value = null; });
</script>
