<template>
  <div style="font-family:'cygre',sans-serif;background:#f5f6f7;min-height:100vh;">

    <!-- Header -->
    <div style="background:#fff;border-bottom:1px solid #e8e8e8;padding:0.875rem 1.5rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10;">
      <div>
        <h1 style="font-size:15px;font-weight:600;color:#1a1a1a;margin:0;">Profile Settings</h1>
        <p style="font-size:12px;color:#888;margin:2px 0 0;">Manage your account information</p>
      </div>
      <button @click="closeModal" style="width:32px;height:32px;border-radius:8px;border:1px solid #e0e0e0;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#666;">
        <i class="fas fa-times" style="font-size:12px;"></i>
      </button>
    </div>

    <div style="max-width:600px;margin:1.5rem auto;padding:0 1.25rem 2rem;">

      <!-- Profile Card -->
      <div style="background:#fff;border:1px solid #e8e8e8;border-radius:12px;overflow:hidden;">

        <!-- Avatar + Name Row -->
        <div style="padding:1.25rem;display:flex;align-items:center;gap:1rem;border-bottom:1px solid #f0f0f0;">
          <div style="width:48px;height:48px;border-radius:50%;background:#2e4053;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:600;flex-shrink:0;">
            {{ getInitials(userData.name) }}
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:15px;font-weight:600;color:#1a1a1a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ userData.name || '—' }}</div>
            <div style="font-size:12px;color:#888;margin-top:2px;display:flex;align-items:center;gap:0.5rem;">
              <span>{{ userData.category || 'N/A' }}</span>
              <span style="color:#ddd;">·</span>
              <span>{{ userData.department || 'N/A' }}</span>
              <span style="color:#ddd;">·</span>
              <span style="display:inline-flex;align-items:center;gap:4px;">
                <span style="width:6px;height:6px;border-radius:50%;background:#38a169;display:inline-block;"></span>
                {{ userData.status || 'Active' }}
              </span>
            </div>
          </div>
          <div style="display:flex;gap:0.5rem;flex-shrink:0;">
            <button v-if="!isEditing" @click="refreshProfile" :disabled="isRefreshing"
              style="width:32px;height:32px;border-radius:8px;border:1px solid #e0e0e0;background:transparent;cursor:pointer;color:#666;display:flex;align-items:center;justify-content:center;">
              <i class="fas fa-sync-alt" :class="{'fa-spin':isRefreshing}" style="font-size:11px;"></i>
            </button>
            <button v-if="!isEditing" @click="editProfile"
              style="font-size:12px;font-weight:600;color:#fff;background:#2e4053;border:none;border-radius:8px;padding:0 0.875rem;height:32px;cursor:pointer;display:flex;align-items:center;gap:5px;">
              <i class="fas fa-edit" style="font-size:11px;"></i> Edit
            </button>
          </div>
        </div>

        <form @submit.prevent="saveProfile">
          <div style="padding:1.25rem;display:flex;flex-direction:column;gap:1rem;">

            <!-- Personal Info -->
            <div style="font-size:11px;font-weight:600;color:#aaa;text-transform:uppercase;letter-spacing:.05em;">Personal Information</div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
              <!-- Full Name -->
              <div style="grid-column:span 2;">
                <label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:.35rem;">Full Name <span style="color:#e53e3e;">*</span></label>
                <input type="text" v-model="userData.name" :readonly="!isEditing"
                  :style="fieldStyle(!isEditing)" placeholder="Enter your full name" />
              </div>

              <!-- Email -->
              <div style="grid-column:span 2;position:relative;">
                <label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:.35rem;">Email Address <span style="color:#e53e3e;">*</span></label>
                <input type="email" v-model="userData.email" :readonly="!isEditing || !canEditEmail"
                  :style="fieldStyle(!isEditing || !canEditEmail)" placeholder="your.email@company.com"
                  style="padding-right:2.25rem;" />
                <button v-if="!isEditing" type="button" @click="copyToClipboard(userData.email)"
                  style="position:absolute;right:8px;bottom:9px;background:transparent;border:none;cursor:pointer;color:#aaa;font-size:12px;"
                  title="Copy email"><i class="fas fa-copy"></i></button>
              </div>

              <!-- Department -->
              <div>
                <label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:.35rem;">Department</label>
                <input type="text" v-model="userData.department" :readonly="!isEditing"
                  :style="fieldStyle(!isEditing)" placeholder="e.g. Engineering" />
              </div>

              <!-- Role -->
              <div>
                <label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:.35rem;">Role</label>
                <input type="text" v-model="userData.category" readonly :style="fieldStyle(true)" />
                <p style="font-size:11px;color:#aaa;margin:3px 0 0;">Cannot be changed</p>
              </div>
            </div>

            <div style="height:1px;background:#f0f0f0;"></div>

            <!-- Security -->
            <div style="font-size:11px;font-weight:600;color:#aaa;text-transform:uppercase;letter-spacing:.05em;">Security</div>

            <div v-if="!isEditing" style="font-size:13px;color:#999;background:#fafafa;border:1px solid #f0f0f0;border-radius:8px;padding:.75rem 1rem;display:flex;align-items:center;gap:.5rem;">
              <i class="fas fa-lock" style="font-size:12px;"></i>
              Click Edit to change your password
            </div>

            <div v-if="isEditing" style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
              <div>
                <label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:.35rem;">New Password</label>
                <input type="password" v-model="passwordData.new_password" :style="fieldStyle(false)" placeholder="New password" />
              </div>
              <div>
                <label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:.35rem;">Confirm Password</label>
                <input type="password" v-model="passwordData.new_password_confirmation" :style="fieldStyle(false)" placeholder="Confirm password" />
              </div>
              <div style="grid-column:span 2;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:.625rem .875rem;font-size:12px;color:#92400e;display:flex;align-items:flex-start;gap:.5rem;">
                <i class="fas fa-info-circle" style="margin-top:1px;flex-shrink:0;"></i>
                At least 8 characters with uppercase, lowercase, numbers, and special characters.
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div v-if="isEditing" style="display:flex;justify-content:space-between;align-items:center;padding:.875rem 1.25rem;background:#fafafa;border-top:1px solid #f0f0f0;">
            <button type="button" @click="cancelEdit"
              style="font-size:13px;font-weight:500;color:#666;background:#fff;border:1px solid #e0e0e0;border-radius:8px;padding:.5rem 1rem;cursor:pointer;">
              Cancel
            </button>
            <button type="submit" :disabled="isLoading"
              style="font-size:13px;font-weight:600;color:#fff;background:#2e4053;border:none;border-radius:8px;padding:.5rem 1.25rem;cursor:pointer;display:flex;align-items:center;gap:.5rem;"
              :style="isLoading ? 'opacity:.6;cursor:not-allowed;' : ''">
              <i :class="isLoading ? 'fas fa-spinner fa-spin' : 'fas fa-save'" style="font-size:11px;"></i>
              {{ isLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Summary Cards -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin-top:.875rem;">
        <div v-for="card in summaryCards" :key="card.label"
          style="background:#fff;border:1px solid #e8e8e8;border-radius:10px;padding:.875rem 1rem;">
          <div :style="'width:32px;height:32px;border-radius:8px;background:'+card.bg+';display:flex;align-items:center;justify-content:center;margin-bottom:.625rem;'">
            <i :class="card.icon" :style="'font-size:13px;color:'+card.color+';'"></i>
          </div>
          <p style="font-size:11px;color:#aaa;margin:0 0 2px;">{{ card.label }}</p>
          <p style="font-size:14px;font-weight:600;color:#1a1a1a;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ card.value }}</p>
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
  { label:'Account Type', value: userData.value.category || 'N/A', icon:'fas fa-user-shield', color:'#3b82f6', bg:'#eff6ff' },
  { label:'Department',   value: userData.value.department || 'N/A', icon:'fas fa-building',    color:'#7c3aed', bg:'#f5f3ff' },
  { label:'Status',       value: userData.value.status || 'N/A',    icon:'fas fa-circle-check', color:'#16a34a', bg:'#f0fdf4' },
]);

const fieldStyle = (readonly) =>
  `width:100%;padding:.575rem .75rem;font-size:13px;border:1px solid #e0e0e0;border-radius:8px;outline:none;color:#1a1a1a;background:${readonly ? '#fafafa' : '#fff'};cursor:${readonly ? 'default' : 'text'};box-sizing:border-box;transition:border-color .15s;`;

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

function editProfile() { isEditing.value = true; }

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
input:focus { border-color: #2e4053 !important; box-shadow: 0 0 0 3px rgba(46,64,83,.08); }
button:not(:disabled):active { transform: scale(.98); }
button:disabled { opacity:.6; cursor:not-allowed; }
</style>