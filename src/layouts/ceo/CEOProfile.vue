<template>
  <div class="min-h-screen bg-[#edf4fb] px-4 py-4 lg:px-5">
    <div class="mx-auto flex max-w-[1100px] flex-col overflow-hidden rounded-[34px] border border-[#d9e6f3] bg-white/90 shadow-[0_28px_70px_rgba(18,58,99,0.14)] backdrop-blur-sm">

      <!-- Header -->
      <div class="relative overflow-hidden border-b border-[#dbe7f3] bg-[linear-gradient(135deg,#eef5ff_0%,#ffffff_46%,#f7fbff_100%)] px-6 py-5 lg:px-7">
        <div class="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-[#dce9fb] blur-3xl"></div>
        <div class="relative flex items-center gap-4">
          <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white text-xl font-bold shadow-[0_16px_34px_rgba(35,96,182,0.26)]">
            {{ getInitials(userData.name) }}
          </div>
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2d6aaf]">CEO Workspace</p>
            <h1 class="mt-0.5 text-2xl font-bold tracking-tight text-[#183b63]">{{ userData.name || 'Profile' }}</h1>
            <p class="mt-1 text-sm text-[#67819d]">{{ userData.category }} · {{ userData.department }}</p>
          </div>
        </div>

        <!-- Tabs -->
        <div class="relative mt-5 flex gap-1">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'rounded-lg px-4 py-2 text-sm font-semibold transition',
              activeTab === tab.key
                ? 'bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white shadow-sm'
                : 'text-[#5a7fa8] hover:bg-[#e8f0fa]'
            ]"
          >{{ tab.label }}</button>
        </div>
      </div>

      <!-- ─── PROFILE TAB ─── -->
      <div v-if="activeTab === 'profile'" class="px-6 py-6 lg:px-8">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">

          <!-- Summary cards -->
          <div class="col-span-1 flex flex-col gap-4">
            <div v-for="card in summaryCards" :key="card.label" class="rounded-2xl border border-[#d0e2f8] bg-[#f5f9ff] p-4">
              <p class="text-xs font-medium text-[#5a7fa8]">{{ card.label }}</p>
              <p class="mt-1 text-lg font-bold text-[#183b63]">{{ card.value }}</p>
            </div>
          </div>

          <!-- Form -->
          <div class="col-span-2">
            <form @submit.prevent="saveProfile" class="space-y-5 rounded-2xl border border-[#d0e2f8] bg-white p-6">
              <div class="flex items-center justify-between">
                <h2 class="text-base font-bold text-[#183b63]">Personal Information</h2>
                <div class="flex gap-2">
                  <button v-if="!isEditing" type="button" @click="refreshProfile" :disabled="isRefreshing"
                    class="rounded-lg border border-[#d0e2f8] p-2 text-[#5a7fa8] hover:bg-[#f0f6ff] disabled:opacity-50">
                    <svg :class="isRefreshing ? 'animate-spin' : ''" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button v-if="!isEditing" type="button" @click="isEditing = true"
                    class="flex items-center gap-2 rounded-lg bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Full Name</label>
                  <input v-model="userData.name" :readonly="!isEditing" type="text"
                    class="w-full rounded-lg border border-[#d0e2f8] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20"
                    :class="!isEditing ? 'bg-[#f5f9ff]' : 'bg-white'" />
                </div>
                <div class="col-span-2">
                  <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Email Address</label>
                  <input v-model="userData.email" :readonly="!isEditing" type="email"
                    class="w-full rounded-lg border border-[#d0e2f8] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20"
                    :class="!isEditing ? 'bg-[#f5f9ff]' : 'bg-white'" />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Department</label>
                  <input v-model="userData.department" :readonly="!isEditing" type="text"
                    class="w-full rounded-lg border border-[#d0e2f8] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20"
                    :class="!isEditing ? 'bg-[#f5f9ff]' : 'bg-white'" />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Role</label>
                  <input v-model="userData.category" readonly type="text"
                    class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none" />
                  <p class="mt-1 text-[11px] text-[#8aa7c5]">Cannot be changed</p>
                </div>
              </div>

              <!-- Password section (only when editing) -->
              <div v-if="isEditing">
                <div class="mb-3 border-t border-[#e8f0fa] pt-4">
                  <p class="text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">Change Password (optional)</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">New Password</label>
                    <input v-model="passwordData.new_password" type="password" placeholder="New password"
                      class="w-full rounded-lg border border-[#d0e2f8] bg-white px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
                  </div>
                  <div>
                    <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Confirm Password</label>
                    <input v-model="passwordData.new_password_confirmation" type="password" placeholder="Confirm"
                      class="w-full rounded-lg border border-[#d0e2f8] bg-white px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
                  </div>
                </div>
              </div>

              <div v-if="isEditing" class="flex justify-end gap-3 border-t border-[#e8f0fa] pt-4">
                <button type="button" @click="cancelEdit" class="rounded-xl border border-[#d0e2f8] px-5 py-2 text-sm font-medium text-[#5a7fa8] hover:bg-[#f0f6ff]">Cancel</button>
                <button type="submit" :disabled="isSaving"
                  class="flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">
                  <svg v-if="isSaving" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  {{ isSaving ? 'Saving…' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- ─── BRANCHES TAB ─── -->
      <div v-if="activeTab === 'branches'" class="px-6 py-6 lg:px-8">

        <!-- Branch top bar -->
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="text-base font-bold text-[#183b63]">Branches / Locations</h2>
            <p class="text-sm text-[#67819d]">Manage branches used as locations when adding departments.</p>
          </div>
          <button @click="openBranchAdd"
            class="flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Branch
          </button>
        </div>

        <!-- Branch stats -->
        <div class="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div class="rounded-xl border border-[#d0e2f8] bg-[#f5f9ff] px-4 py-3 shadow-sm">
            <p class="text-xs font-medium text-[#5a7fa8]">Total Branches</p>
            <p class="mt-0.5 text-2xl font-bold text-[#183b63]">{{ branches.length }}</p>
          </div>
          <div class="rounded-xl border border-[#d0e2f8] bg-[#f5f9ff] px-4 py-3 shadow-sm">
            <p class="text-xs font-medium text-[#5a7fa8]">With Address</p>
            <p class="mt-0.5 text-2xl font-bold text-[#2f78dd]">{{ branches.filter(b => b.address).length }}</p>
          </div>
        </div>

        <!-- Branch search -->
        <div class="mb-3">
          <div class="relative max-w-sm">
            <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8aa7c5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input v-model="branchFilter" type="search" placeholder="Search branches…"
              class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] py-2 pl-9 pr-4 text-sm text-[#183b63] placeholder-[#8aa7c5] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
          </div>
        </div>

        <!-- Branch list -->
        <div v-if="branchLoading" class="flex items-center justify-center py-20">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-[#d0e2f8] border-t-[#2f78dd]"></div>
        </div>
        <div v-else-if="filteredBranches.length === 0" class="flex flex-col items-center justify-center py-16 text-[#8aa7c5]">
          <svg class="mb-3 h-12 w-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p class="text-sm font-medium">No branches found</p>
        </div>
        <div v-else class="overflow-hidden rounded-xl border border-[#d9e6f3]">
          <table class="w-full text-left">
            <thead class="bg-[#f0f6ff]">
              <tr>
                <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">#</th>
                <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">Branch Name</th>
                <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">Address</th>
                <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#e8f0fa]">
              <tr v-for="(branch, idx) in filteredBranches" :key="branch.branch_id" class="transition-colors hover:bg-[#f8fbff]">
                <td class="px-4 py-3 text-sm text-[#8aa7c5]">{{ idx + 1 }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#e8f0fa]">
                      <svg class="h-4 w-4 text-[#2f78dd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span class="font-medium text-[#183b63]">{{ branch.name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-[#5a7fa8]">{{ branch.address || '—' }}</td>
                <td class="px-4 py-3 text-right" @click.stop>
                  <button @click.stop="toggleBranchMenu(branch.branch_id, $event)"
                    class="rounded-lg p-1.5 text-[#8aa7c5] transition hover:bg-[#e8f0fa] hover:text-[#183b63]">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Floating branch action dropdown -->
    <Teleport to="body">
      <div
        v-if="branchMenuId !== null && menuBranch"
        :style="{ position: 'fixed', top: branchMenuPos.y + 'px', left: (branchMenuPos.x - 160) + 'px', zIndex: 9999 }"
        class="w-40 rounded-xl border border-[#d9e6f3] bg-white py-1 shadow-xl"
        @click.stop
      >
        <button @click="openBranchEdit(menuBranch); branchMenuId = null"
          class="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#374b63] hover:bg-[#f0f6ff]">
          <svg class="h-4 w-4 text-[#2f78dd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        <button @click="deleteBranch(menuBranch); branchMenuId = null"
          class="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </Teleport>

    <!-- Branch Add Modal -->
    <Teleport to="body">
      <div v-if="showBranchAdd" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40" @click="showBranchAdd = false"></div>
        <div class="relative w-full max-w-md rounded-2xl bg-white shadow-2xl" @click.stop>
          <div class="flex items-center justify-between border-b border-[#e8f0fa] px-6 py-4">
            <h2 class="text-lg font-bold text-[#183b63]">Add Branch</h2>
            <button @click="showBranchAdd = false" class="rounded-lg p-1.5 text-[#8aa7c5] hover:bg-[#f0f6ff]">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="space-y-4 px-6 py-5">
            <div>
              <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Branch Name *</label>
              <input v-model="branchForm.name" type="text" placeholder="e.g. Head Office"
                class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Address (optional)</label>
              <input v-model="branchForm.address" type="text" placeholder="e.g. 123 Main St, Block A"
                class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
            </div>
          </div>
          <div class="flex justify-end gap-3 border-t border-[#e8f0fa] px-6 py-4">
            <button @click="showBranchAdd = false" class="rounded-xl border border-[#d0e2f8] px-5 py-2 text-sm font-medium text-[#5a7fa8] hover:bg-[#f0f6ff]">Cancel</button>
            <button @click="submitBranchAdd" :disabled="branchSaving"
              class="flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">
              <svg v-if="branchSaving" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Add Branch
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Branch Edit Modal -->
    <Teleport to="body">
      <div v-if="showBranchEdit" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40" @click="showBranchEdit = false"></div>
        <div class="relative w-full max-w-md rounded-2xl bg-white shadow-2xl" @click.stop>
          <div class="flex items-center justify-between border-b border-[#e8f0fa] px-6 py-4">
            <h2 class="text-lg font-bold text-[#183b63]">Edit Branch</h2>
            <button @click="showBranchEdit = false" class="rounded-lg p-1.5 text-[#8aa7c5] hover:bg-[#f0f6ff]">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="space-y-4 px-6 py-5">
            <div>
              <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Branch Name *</label>
              <input v-model="branchForm.name" type="text"
                class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Address (optional)</label>
              <input v-model="branchForm.address" type="text"
                class="w-full rounded-lg border border-[#d0e2f8] bg-[#f5f9ff] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20" />
            </div>
          </div>
          <div class="flex justify-end gap-3 border-t border-[#e8f0fa] px-6 py-4">
            <button @click="showBranchEdit = false" class="rounded-xl border border-[#d0e2f8] px-5 py-2 text-sm font-medium text-[#5a7fa8] hover:bg-[#f0f6ff]">Cancel</button>
            <button @click="submitBranchEdit" :disabled="branchSaving"
              class="flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">
              <svg v-if="branchSaving" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Save Changes
            </button>
          </div>
        </div>
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

const activeTab = ref('profile');
const tabs = [
  { key: 'profile', label: 'Profile' },
  { key: 'branches', label: 'Branches' },
];

// ─── PROFILE ───────────────────────────────────────────
const userData = ref({ name: '', email: '', category: '', status: '', department: '' });
const originalUserData = ref({});
const passwordData = ref({ new_password: '', new_password_confirmation: '' });
const isEditing = ref(false);
const isRefreshing = ref(false);
const isSaving = ref(false);

const summaryCards = computed(() => [
  { label: 'Account Type', value: userData.value.category || 'N/A' },
  { label: 'Department',   value: userData.value.department || 'N/A' },
  { label: 'Status',       value: userData.value.status || 'Active' },
]);

function getInitials(name) {
  if (!name || name === 'N/A') return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

async function refreshProfile() {
  isRefreshing.value = true;
  try {
    await fetchUserProfile();
    toast.success('Refreshed!');
  } finally {
    setTimeout(() => { isRefreshing.value = false; }, 500);
  }
}

async function fetchUserProfile() {
  try {
    const { data } = await axios.get('api/user/profile');
    userData.value = {
      name:       data.name       || 'N/A',
      email:      data.email      || 'N/A',
      category:   data.category   || 'N/A',
      status:     data.status     || 'N/A',
      department: data.department || 'N/A',
    };
    originalUserData.value = { ...userData.value };
  } catch {
    toast.error('Failed to load profile');
  }
}

async function saveProfile() {
  isSaving.value = true;
  try {
    await axios.post('api/update-profile', {
      name:                      userData.value.name,
      email:                     userData.value.email,
      department:                userData.value.department,
      new_password:              passwordData.value.new_password,
      new_password_confirmation: passwordData.value.new_password_confirmation,
    });
    toast.success('Profile updated!');
    isEditing.value = false;
    originalUserData.value = { ...userData.value };
    passwordData.value = { new_password: '', new_password_confirmation: '' };
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to update profile');
  } finally {
    isSaving.value = false;
  }
}

function cancelEdit() {
  userData.value = { ...originalUserData.value };
  passwordData.value = { new_password: '', new_password_confirmation: '' };
  isEditing.value = false;
}

// ─── BRANCHES ──────────────────────────────────────────
const branches = ref([]);
const branchLoading = ref(false);
const branchFilter = ref('');
const branchSaving = ref(false);
const showBranchAdd = ref(false);
const showBranchEdit = ref(false);
const selectedBranch = ref(null);
const branchForm = ref({ name: '', address: '' });
const branchMenuId = ref(null);
const branchMenuPos = ref({ x: 0, y: 0 });

const filteredBranches = computed(() => {
  const q = branchFilter.value.toLowerCase();
  if (!q) return branches.value;
  return branches.value.filter(b =>
    b.name?.toLowerCase().includes(q) || b.address?.toLowerCase().includes(q)
  );
});

const menuBranch = computed(() => branches.value.find(b => b.branch_id === branchMenuId.value));

function toggleBranchMenu(id, event) {
  if (branchMenuId.value === id) { branchMenuId.value = null; return; }
  const rect = event.currentTarget.getBoundingClientRect();
  const menuH = 80;
  const y = (window.innerHeight - rect.bottom) >= menuH ? rect.bottom + 4 : rect.top - menuH - 4;
  branchMenuPos.value = { x: rect.right, y };
  branchMenuId.value = id;
}

async function fetchBranches() {
  branchLoading.value = true;
  try {
    const res = await axios.get('/api/branches');
    branches.value = res.data?.data || res.data || [];
  } catch {
    toast.error('Failed to load branches');
  } finally {
    branchLoading.value = false;
  }
}

function openBranchAdd() {
  branchForm.value = { name: '', address: '' };
  showBranchAdd.value = true;
}

function openBranchEdit(branch) {
  selectedBranch.value = branch;
  branchForm.value = { name: branch.name, address: branch.address || '' };
  showBranchEdit.value = true;
}

async function submitBranchAdd() {
  if (!branchForm.value.name.trim()) { toast.warning('Branch name is required'); return; }
  branchSaving.value = true;
  try {
    await axios.post('/api/branches', branchForm.value);
    toast.success('Branch added');
    showBranchAdd.value = false;
    await fetchBranches();
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to add branch');
  } finally {
    branchSaving.value = false;
  }
}

async function submitBranchEdit() {
  if (!branchForm.value.name.trim()) { toast.warning('Branch name is required'); return; }
  branchSaving.value = true;
  try {
    await axios.put(`/api/branches/${selectedBranch.value.branch_id}`, branchForm.value);
    toast.success('Branch updated');
    showBranchEdit.value = false;
    await fetchBranches();
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to update branch');
  } finally {
    branchSaving.value = false;
  }
}

async function deleteBranch(branch) {
  const result = await Swal.fire({
    title: 'Delete Branch?',
    text: `"${branch.name}" will be permanently deleted.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e53e3e',
    cancelButtonColor: '#a0aec0',
    confirmButtonText: 'Yes, delete',
  });
  if (!result.isConfirmed) return;
  try {
    await axios.delete(`/api/branches/${branch.branch_id}`);
    toast.success('Branch deleted');
    await fetchBranches();
  } catch {
    toast.error('Failed to delete branch');
  }
}

document.addEventListener('click', () => { branchMenuId.value = null; });

onMounted(async () => {
  await Promise.all([fetchUserProfile(), fetchBranches()]);
});
</script>
