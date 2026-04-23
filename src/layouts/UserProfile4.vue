<template>
  <div class="px-4 py-4 lg:px-6" style="font-family:'DM Sans',sans-serif;">
    <div class="mx-auto flex max-w-[960px] flex-col overflow-hidden rounded-[34px] border border-[#d9e6f3] bg-white/90 shadow-[0_28px_70px_rgba(18,58,99,0.14)] backdrop-blur-sm">

      <!-- ── Hero Header ────────────────────────────────────────────── -->
      <div class="relative overflow-hidden border-b border-[#dbe7f3] px-6 py-5 lg:px-7" style="background:linear-gradient(135deg,#eef5ff 0%,#ffffff 46%,#f7fbff 100%);">
        <div class="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-[#dce9fb] blur-3xl"></div>
        <div class="relative flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[20px] text-white text-xl font-bold shadow-[0_16px_34px_rgba(35,96,182,0.26)]" style="background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);">
              {{ getInitials(userData.name) }}
            </div>
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2d6aaf]">My Profile</p>
              <h1 class="mt-0.5 text-2xl font-bold tracking-tight text-[#183b63]">{{ userData.name || 'Profile' }}</h1>
              <p class="mt-1 text-sm text-[#67819d]">{{ userData.category }} · {{ userData.department }}</p>
            </div>
          </div>
          <button @click="closeModal" class="flex h-9 w-9 items-center justify-center rounded-[11px] border border-[#d0e2f8] text-[#67819d] transition hover:bg-[#eef5ff] hover:text-[#183b63]">
            <i class="fas fa-arrow-left text-xs"></i>
          </button>
        </div>
      </div>

      <!-- ── Content ────────────────────────────────────────────────── -->
      <div class="px-6 py-6 lg:px-8">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">

          <!-- Summary cards -->
          <div class="col-span-1 flex flex-col gap-4">
            <div v-for="card in summaryCards" :key="card.label" class="rounded-2xl border border-[#d0e2f8] bg-[#f5f9ff] p-4">
              <div class="mb-2.5 flex h-9 w-9 items-center justify-center rounded-[10px]" :style="'background:'+card.bg">
                <i :class="card.icon" style="font-size:14px;" :style="'color:'+card.color"></i>
              </div>
              <p class="text-xs font-medium text-[#5a7fa8]">{{ card.label }}</p>
              <p class="mt-0.5 truncate text-sm font-bold text-[#183b63]">{{ card.value }}</p>
            </div>

            <!-- Status badge -->
            <div class="flex items-center gap-3 rounded-2xl border border-[#d0e2f8] bg-[#f5f9ff] p-4">
              <span class="h-3 w-3 flex-shrink-0 rounded-full" style="background:#38a169;"></span>
              <div>
                <p class="text-xs font-medium text-[#5a7fa8]">Account Status</p>
                <p class="mt-0.5 text-sm font-bold text-[#183b63]">{{ userData.status || 'Active' }}</p>
              </div>
            </div>
          </div>

          <!-- Form -->
          <div class="col-span-2">
            <form @submit.prevent="saveProfile" class="space-y-5 rounded-2xl border border-[#d0e2f8] bg-white p-6">

              <!-- Form header -->
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
                    class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                    style="background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);">
                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                </div>
              </div>

              <!-- Fields -->
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Full Name <span class="text-red-500">*</span></label>
                  <input v-model="userData.name" :readonly="!isEditing" type="text"
                    class="w-full rounded-lg border border-[#d0e2f8] px-3 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20"
                    :class="!isEditing ? 'bg-[#f5f9ff]' : 'bg-white'" />
                </div>
                <div class="col-span-2">
                  <label class="mb-1 block text-xs font-semibold text-[#5a7fa8]">Email Address <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <input v-model="userData.email" :readonly="!isEditing || !canEditEmail" type="email"
                      class="w-full rounded-lg border border-[#d0e2f8] px-3 py-2.5 pr-9 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20"
                      :class="(!isEditing || !canEditEmail) ? 'bg-[#f5f9ff]' : 'bg-white'" />
                    <button v-if="!isEditing" type="button" @click="copyToClipboard(userData.email)"
                      class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8aa7c5] hover:text-[#2f78dd]" title="Copy email">
                      <i class="fas fa-copy text-xs"></i>
                    </button>
                  </div>
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

              <!-- Password (edit mode only) -->
              <div v-if="isEditing">
                <div class="mb-3 border-t border-[#e8f0fa] pt-4">
                  <p class="text-xs font-semibold uppercase tracking-wider text-[#5a7fa8]">Change Password <span class="font-normal normal-case text-[#8aa7c5]">(optional)</span></p>
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
                <div class="mt-3 flex items-start gap-2 rounded-xl border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-xs text-[#92400e]">
                  <i class="fas fa-info-circle mt-0.5 flex-shrink-0"></i>
                  At least 8 characters with uppercase, lowercase, numbers, and special characters.
                </div>
              </div>

              <!-- Actions -->
              <div v-if="isEditing" class="flex justify-end gap-3 border-t border-[#e8f0fa] pt-4">
                <button type="button" @click="cancelEdit"
                  class="rounded-xl border border-[#d0e2f8] px-5 py-2 text-sm font-medium text-[#5a7fa8] hover:bg-[#f0f6ff]">
                  Cancel
                </button>
                <button type="submit" :disabled="isLoading"
                  class="flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
                  style="background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);">
                  <svg v-if="isLoading" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  {{ isLoading ? 'Saving…' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();

const isRefreshing = ref(false);
const isEditing    = ref(false);
const isLoading    = ref(false);
const canEditEmail = ref(false);

const userData = ref({ name:'', email:'', category:'', status:'', department:'' });
const originalUserData = ref({});
const passwordData = ref({ new_password:'', new_password_confirmation:'' });

const summaryCards = computed(() => [
  { label:'Account Type', value: userData.value.category  || 'N/A', icon:'fas fa-user-shield', color:'#2f78dd', bg:'#deebfd' },
  { label:'Department',   value: userData.value.department || 'N/A', icon:'fas fa-building',    color:'#7c3aed', bg:'#f3edfb' },
]);

onMounted(fetchUserProfile);

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
  } catch (e) { handleError(e); }
}

function getInitials(name) {
  if (!name || name === 'N/A') return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

async function copyToClipboard(text) {
  try { await navigator.clipboard.writeText(text); toast.success('Email copied!'); }
  catch { toast.error('Failed to copy'); }
}

async function refreshProfile() {
  isRefreshing.value = true;
  try { await fetchUserProfile(); toast.success('Refreshed!'); }
  catch (e) { handleError(e); }
  finally { setTimeout(() => isRefreshing.value = false, 500); }
}

async function saveProfile() {
  isLoading.value = true;
  try {
    const res = await axios.post('api/update-profile', {
      name:                         userData.value.name,
      email:                        userData.value.email,
      department:                   userData.value.department,
      new_password:                 passwordData.value.new_password,
      new_password_confirmation:    passwordData.value.new_password_confirmation,
    });
    if (res.data.status === 200 || res.data.success) {
      toast.success('Profile updated!');
      isEditing.value = false;
      originalUserData.value = { ...userData.value };
      passwordData.value = { new_password:'', new_password_confirmation:'' };
    } else {
      toast.error(res.data.message || 'Failed to update profile');
    }
  } catch (e) { handleError(e); }
  finally { isLoading.value = false; }
}

function cancelEdit() {
  userData.value = { ...originalUserData.value };
  passwordData.value = { new_password:'', new_password_confirmation:'' };
  isEditing.value = false;
  toast.info('Changes cancelled');
}

function closeModal() { router.go(-1); }

function handleError(error) {
  const message =
    error.response?.data?.message ||
    error.response?.statusText ||
    (error.request ? 'No response from server.' : error.message) ||
    'An unexpected error occurred';
  toast.error(message);
  console.error(error);
}
</script>

<style scoped>
input:focus { outline: none; }
button:not(:disabled):active { transform: scale(.98); }
button:disabled { opacity:.6; cursor:not-allowed; }
</style>