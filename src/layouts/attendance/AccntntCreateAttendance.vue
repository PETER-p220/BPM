<template>
  <div class="min-h-screen page-bg" style="font-family: 'DM Sans', sans-serif;">
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <div class="relative z-10 min-h-screen flex items-start justify-center px-4 py-12 sm:py-20">
      <div class="w-full max-w-lg">
        <div class="form-card fade-up">

          <!-- Header -->
          <div class="card-header">
            <div class="header-left">
              <div class="header-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              </div>
              <div>
                <h2 class="card-title">Create Attendance</h2>
                <p class="card-subtitle">Mark engineer presence for today</p>
              </div>
            </div>
            <router-link to="/account-view-attendance" class="close-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </router-link>
          </div>

          <div class="card-divider"></div>

          <!-- Body -->
          <div class="card-body">
            <!-- Engineer -->
            <div class="field-group">
              <label class="field-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="8" r="4"/></svg>
                Engineer
              </label>
              <div class="select-wrap">
                <select v-model="attendanceData.attenda_id" class="styled-select">
                  <option value="" disabled>Choose an engineer…</option>
                  <option v-for="user in engineers" :key="user.user_id" :value="user.user_id">{{ user.name }}</option>
                </select>
                <svg class="select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <!-- Status Chips -->
            <div class="field-group">
              <label class="field-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Attendance Status
              </label>
              <div class="chip-row">
                <button type="button" class="chip chip-present" :class="{ active: attendanceData.is_present === 'present' }" @click="attendanceData.is_present = 'present'">
                  <span class="chip-dot dot-green"></span> Present
                </button>
                <button type="button" class="chip chip-absent" :class="{ active: attendanceData.is_present === 'not-present' }" @click="attendanceData.is_present = 'not-present'">
                  <span class="chip-dot dot-red"></span> Not Present
                </button>
              </div>
            </div>

            <!-- Reason -->
            <div class="field-group reason-field" :class="{ visible: attendanceData.is_present === 'not-present' }">
              <label class="field-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Reason for Absence
              </label>
              <textarea v-model="attendanceData.if_not_present_and_have_reason" rows="3" placeholder="Briefly describe the reason…" class="styled-textarea"></textarea>
            </div>

            <!-- Actions -->
            <div class="actions">
              <button @click="submitAttendance" class="btn-submit" :disabled="isLoading">
                <span class="btn-glow"></span>
                <span v-if="!isLoading" class="btn-inner">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Submit Attendance
                </span>
                <span v-else class="btn-inner">
                  <svg class="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/></svg>
                  Processing…
                </span>
              </button>
              <router-link to="/account-view-attendance" class="btn-cancel">Cancel</router-link>
            </div>
          </div>
        </div>

        <p class="bottom-hint">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Attendance records cannot be edited after submission.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();
const attendanceData = ref({ attenda_id:'', is_present:'present', if_not_present_and_have_reason:'' });
const engineers = ref([]);
const isLoading = ref(false);

onMounted(async () => { await fetchEngineers(); });

async function fetchEngineers() {
  try { const r = await axios.get('api/dropdown/engineer'); engineers.value = r.data.users; }
  catch (e) { handleError(e); }
}

async function submitAttendance() {
  isLoading.value = true;
  if (!attendanceData.value.attenda_id || !attendanceData.value.is_present) { toast.error('Please select an engineer and attendance status'); isLoading.value = false; return; }
  try {
    const r = await axios.post('api/attendances', attendanceData.value);
    toast.success(r.data.message);
    attendanceData.value = { attenda_id:'', is_present:'present', if_not_present_and_have_reason:'' };
    router.push('/accountant-create-attendance');
  } catch (e) { handleError(e); }
  finally { isLoading.value = false; }
}

function handleError(e) {
  toast.error(e.response?.data?.message || (e.request ? 'No response from the server.' : e.message) || 'An unexpected error occurred');
}
</script>

<style scoped>
.page-bg{background:#f4f5f7;min-height:100vh}
.blob{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none}
.blob-1{width:480px;height:480px;background:radial-gradient(circle,rgba(79,70,229,.1) 0%,transparent 70%);top:-200px;right:-140px}
.blob-2{width:340px;height:340px;background:radial-gradient(circle,rgba(124,58,237,.08) 0%,transparent 70%);bottom:-100px;left:-80px}
.blob-3{width:260px;height:260px;background:radial-gradient(circle,rgba(14,165,233,.06) 0%,transparent 70%);top:45%;left:15%}

.fade-up{animation:fadeUp .42s cubic-bezier(.4,0,.2,1) both}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}

/* Card */
.form-card{background:#fff;border:1px solid #e5e7eb;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.07)}

/* Header */
.card-header{display:flex;align-items:center;justify-content:space-between;padding:20px 24px 16px}
.header-left{display:flex;align-items:center;gap:14px}
.header-icon{width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#4f46e5,#7c3aed);display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 3px 14px rgba(79,70,229,.3);flex-shrink:0}
.card-title{font-size:17px;font-weight:680;color:#1f2937;letter-spacing:-.02em}
.card-subtitle{font-size:13px;color:#9ca3af;margin-top:2px}
.close-btn{width:34px;height:34px;border-radius:10px;border:1px solid #eee;background:#fafafa;display:flex;align-items:center;justify-content:center;color:#9ca3af;text-decoration:none;transition:background .18s,border-color .18s,color .18s}
.close-btn:hover{background:#fef2f2;border-color:#fecaca;color:#dc2626}

.card-divider{height:1px;background:linear-gradient(90deg,transparent,#eee 20%,#eee 80%,transparent);margin:0 24px}

/* Body */
.card-body{padding:24px;display:flex;flex-direction:column;gap:22px}
.field-group{display:flex;flex-direction:column;gap:8px}
.field-label{display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:650;color:#6b7280;letter-spacing:.01em}

/* Select */
.select-wrap{position:relative}
.styled-select{width:100%;appearance:none;-webkit-appearance:none;padding:12px 40px 12px 16px;border-radius:12px;border:1px solid #e2e4e8;background:#fafafa;color:#374151;font-size:14px;font-family:inherit;outline:none;cursor:pointer;transition:border-color .2s,box-shadow .2s}
.styled-select:focus{border-color:rgba(79,70,229,.45);box-shadow:0 0 0 3px rgba(79,70,229,.13)}
.select-arrow{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:#9ca3af;pointer-events:none}

/* Chips */
.chip-row{display:flex;gap:10px}
.chip{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:11px 16px;border-radius:12px;border:1px solid #e5e7eb;background:#fafafa;color:#6b7280;font-size:14px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .2s cubic-bezier(.4,0,.2,1)}
.chip:hover{border-color:#d1d5db;background:#f3f4f6}
.chip-present.active{background:#ecfdf5;border-color:#a7f3d0;color:#059669;box-shadow:0 0 0 3px rgba(16,185,129,.12)}
.chip-absent.active{background:#fef2f2;border-color:#fca5a5;color:#dc2626;box-shadow:0 0 0 3px rgba(239,68,68,.1)}
.chip-dot{width:8px;height:8px;border-radius:50%}
.dot-green{background:#10b981}
.dot-red{background:#ef4444}
.chip-present.active .dot-green{box-shadow:0 0 5px rgba(16,185,129,.5)}
.chip-absent.active .dot-red{box-shadow:0 0 5px rgba(239,68,68,.5)}

/* Reason (animated reveal) */
.reason-field{max-height:0;overflow:hidden;opacity:0;transition:max-height .38s cubic-bezier(.4,0,.2,1),opacity .3s ease .06s,margin .38s cubic-bezier(.4,0,.2,1);margin-bottom:-22px}
.reason-field.visible{max-height:200px;opacity:1;margin-bottom:0}
.styled-textarea{width:100%;padding:12px 16px;border-radius:12px;border:1px solid #e2e4e8;background:#fafafa;color:#374151;font-size:14px;font-family:inherit;resize:vertical;outline:none;transition:border-color .2s,box-shadow .2s;line-height:1.55}
.styled-textarea::placeholder{color:#9ca3af}
.styled-textarea:focus{border-color:rgba(79,70,229,.45);box-shadow:0 0 0 3px rgba(79,70,229,.13)}

/* Actions */
.actions{display:flex;align-items:center;gap:14px;margin-top:4px}
.btn-submit{position:relative;display:inline-flex;align-items:center;justify-content:center;flex:1;padding:13px 24px;border-radius:12px;border:none;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;font-size:14px;font-weight:650;font-family:inherit;cursor:pointer;overflow:hidden;transition:transform .18s,box-shadow .18s,filter .18s;box-shadow:0 4px 18px rgba(79,70,229,.35)}
.btn-submit:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 24px rgba(79,70,229,.45)}
.btn-submit:disabled{filter:brightness(.7);cursor:not-allowed}
.btn-glow{position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.2),transparent 55%);pointer-events:none}
.btn-inner{position:relative;z-index:1;display:flex;align-items:center;gap:8px}
.spin-icon{animation:spinA .8s linear infinite}
@keyframes spinA{to{transform:rotate(360deg)}}
.btn-cancel{padding:13px 20px;border-radius:12px;border:1px solid #e5e7eb;background:#fafafa;color:#6b7280;font-size:14px;font-weight:600;font-family:inherit;text-decoration:none;transition:background .18s,border-color .18s,color .18s;white-space:nowrap}
.btn-cancel:hover{background:#f3f4f6;border-color:#d1d5db;color:#374151}

/* Hint */
.bottom-hint
{display:flex;
align-items:center;
justify-content:center;
gap:7px;
margin-top:18px;
font-size:12px;
color:#9ca3af;
text-align:center
}
</style>