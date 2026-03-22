<template>
  <div class="page" style="font-family: 'cygre', sans-serif; background: var(--bg-page, #f5f6f7); min-height: 100vh;">
    <!-- Header -->
    <div style="background: #fff; border-bottom: 1px solid #e8e8e8; padding: 0.875rem 1.5rem; display: flex; align-items: center; gap: 0.75rem; position: sticky; top: 0; z-index: 10;">
      <button @click="goBack" style="width:32px;height:32px;border-radius:8px;border:1px solid #e0e0e0;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#666;flex-shrink:0;">
        <i class="fa fa-arrow-left" style="font-size:12px;"></i>
      </button>
      <div>
        <h1 style="font-size:15px;font-weight:600;color:#1a1a1a;margin:0;">Create Tender Update</h1>
        <p style="font-size:12px;color:#888;margin:2px 0 0;">Submit updates for tender activities</p>
      </div>
    </div>

    <!-- Form -->
    <div style="max-width: 600px; margin: 1.5rem auto; padding: 0 1.25rem 2rem;">
      <form @submit.prevent="submitUpdate">
        <div style="background:#fff;border:1px solid #e8e8e8;border-radius:12px;overflow:hidden;">
          <div style="padding:1.25rem;display:flex;flex-direction:column;gap:1rem;">

            <!-- Title -->
            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:0.375rem;text-transform:uppercase;letter-spacing:0.04em;">
                Title <span style="color:#e53e3e;">*</span>
              </label>
              <input
                type="text"
                v-model="form.titles[0]"
                placeholder="Enter a clear, descriptive title"
                :style="inputStyle(showErrors && !form.titles[0])"
              />
              <p v-if="showErrors && !form.titles[0]" style="font-size:11px;color:#e53e3e;margin:3px 0 0;">Title is required</p>
            </div>

            <!-- Description -->
            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:0.375rem;text-transform:uppercase;letter-spacing:0.04em;">
                Description <span style="color:#e53e3e;">*</span>
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                placeholder="Provide detailed information about this update..."
                :style="inputStyle(showErrors && !form.description) + 'resize:none;line-height:1.6;'"
              ></textarea>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:3px;">
                <p v-if="showErrors && !form.description" style="font-size:11px;color:#e53e3e;margin:0;">Description is required</p>
                <span style="font-size:11px;color:#aaa;margin-left:auto;">{{ form.description.length }} chars</span>
              </div>
            </div>

            <!-- Priority -->
            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:0.375rem;text-transform:uppercase;letter-spacing:0.04em;">Priority</label>
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;">
                <div
                  v-for="p in priorities"
                  :key="p.value"
                  @click="form.priority = p.value"
                  :style="priorityStyle(p.value)"
                >
                  <span :style="'width:7px;height:7px;border-radius:50%;background:'+p.color+';display:inline-block;margin-right:5px;'"></span>
                  <span style="font-size:13px;font-weight:500;">{{ p.label }}</span>
                </div>
              </div>
            </div>

            <div style="height:1px;background:#f0f0f0;margin:0 -1.25rem;"></div>

            <!-- Attachments -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.625rem;">
              <!-- Photo -->
              <div>
                <label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:0.375rem;text-transform:uppercase;letter-spacing:0.04em;">Photo</label>
                <div
                  :style="uploadZoneStyle(!!photoPreview)"
                  style="position:relative;overflow:hidden;"
                >
                  <input
                    type="file"
                    @change="handlePhotoChange"
                    accept="image/*"
                    style="position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;"
                  />
                  <div v-if="!photoPreview" style="text-align:center;padding:0.75rem 0;">
                    <i class="fas fa-image" style="font-size:18px;color:#ccc;display:block;margin-bottom:4px;"></i>
                    <span style="font-size:11px;color:#aaa;">JPG, PNG · max 10MB</span>
                  </div>
                  <div v-else style="text-align:center;padding:0.5rem;">
                    <img :src="photoPreview" style="max-height:56px;border-radius:6px;display:block;margin:0 auto 4px;" />
                    <span style="font-size:10px;color:#3b7a57;display:block;word-break:break-all;">{{ form.update_photo?.name }}</span>
                    <button type="button" @click.stop="removePhoto"
                      style="position:absolute;top:5px;right:5px;width:18px;height:18px;border-radius:50%;background:#fee2e2;border:none;cursor:pointer;font-size:9px;color:#c53030;display:flex;align-items:center;justify-content:center;">
                      ✕
                    </button>
                  </div>
                </div>
              </div>

              <!-- File -->
              <div>
                <label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:0.375rem;text-transform:uppercase;letter-spacing:0.04em;">Document</label>
                <div
                  :style="uploadZoneStyle(!!form.update_file)"
                  style="position:relative;overflow:hidden;"
                >
                  <input
                    type="file"
                    id="update_file"
                    @change="handleFileChange"
                    accept=".pdf,.xlsx,.csv,.docx,.doc,.xls,.ppt,.pptx"
                    style="position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;"
                  />
                  <div v-if="!form.update_file" style="text-align:center;padding:0.75rem 0;">
                    <i class="fas fa-file-alt" style="font-size:18px;color:#ccc;display:block;margin-bottom:4px;"></i>
                    <span style="font-size:11px;color:#aaa;">PDF, Word, Excel · 10MB</span>
                  </div>
                  <div v-else style="text-align:center;padding:0.75rem 0.5rem;">
                    <i class="fas fa-check-circle" style="font-size:18px;color:#3b7a57;display:block;margin-bottom:4px;"></i>
                    <span style="font-size:10px;color:#3b7a57;word-break:break-all;display:block;">{{ form.update_file.name }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div style="display:flex;justify-content:space-between;align-items:center;padding:0.875rem 1.25rem;background:#fafafa;border-top:1px solid #f0f0f0;">
            <button
              type="button"
              @click="goBack"
              :disabled="isSubmitting"
              style="font-size:13px;font-weight:500;color:#666;background:transparent;border:1px solid #e0e0e0;border-radius:8px;padding:0.5rem 1rem;cursor:pointer;"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              style="font-size:13px;font-weight:600;color:#fff;background:#2e4053;border:none;border-radius:8px;padding:0.5rem 1.25rem;cursor:pointer;display:flex;align-items:center;gap:0.5rem;opacity:1;"
              :style="isSubmitting ? 'opacity:0.6;cursor:not-allowed;' : ''"
            >
              <i :class="isSubmitting ? 'fas fa-spinner fa-spin' : 'fas fa-paper-plane'" style="font-size:12px;"></i>
              {{ isSubmitting ? 'Submitting...' : 'Submit Update' }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Success Modal -->
    <Transition name="modal">
      <div
        v-if="showSuccessModal"
        style="position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(0,0,0,0.45);"
        @click.self="closeSuccessModal"
      >
        <div style="background:#fff;border-radius:14px;width:100%;max-width:340px;padding:1.75rem;text-align:center;">
          <div style="width:48px;height:48px;border-radius:50%;background:#d1fae5;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">
            <i class="fas fa-check" style="font-size:20px;color:#059669;"></i>
          </div>
          <h3 style="font-size:16px;font-weight:600;color:#1a1a1a;margin:0 0 0.375rem;">Update Submitted!</h3>
          <p style="font-size:13px;color:#888;line-height:1.5;margin:0 0 1.25rem;">Visible to all team members now.</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
            <button @click="createAnother" style="font-size:13px;font-weight:500;color:#555;background:#fff;border:1px solid #e0e0e0;border-radius:8px;padding:0.625rem;cursor:pointer;">
              + Create Another
            </button>
            <button @click="viewUpdates" style="font-size:13px;font-weight:600;color:#fff;background:#2e4053;border:none;border-radius:8px;padding:0.625rem;cursor:pointer;">
              View Updates
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();

const priorities = [
  { value: 'low',    label: 'Low',    color: '#38a169' },
  { value: 'medium', label: 'Medium', color: '#d69e2e' },
  { value: 'high',   label: 'High',   color: '#e53e3e' },
];

const form = ref({
  titles: [''],
  description: '',
  priority: 'low',
  update_photo: null,
  update_file: null,
});

const isSubmitting  = ref(false);
const showErrors    = ref(false);
const photoPreview  = ref(null);
const showSuccessModal = ref(false);

const inputStyle = (hasError) =>
  `width:100%;padding:0.6rem 0.75rem;font-size:14px;border:1px solid ${hasError ? '#e53e3e' : '#e0e0e0'};border-radius:8px;outline:none;color:#1a1a1a;background:#fff;transition:border-color .15s;box-sizing:border-box;`;

const uploadZoneStyle = (active) =>
  `border:1.5px dashed ${active ? '#68d391' : '#d4d4d4'};border-radius:8px;background:${active ? '#f0fff4' : '#fafafa'};min-height:88px;cursor:pointer;transition:all .15s;`;

const priorityStyle = (val) =>
  `display:flex;align-items:center;padding:0.5rem 0.75rem;border-radius:8px;border:1px solid ${form.value.priority === val ? '#2e4053' : '#e0e0e0'};background:${form.value.priority === val ? '#f0f4f8' : '#fff'};cursor:pointer;transition:all .15s;user-select:none;`;

const submitUpdate = async () => {
  showErrors.value = true;
  if (!form.value.titles[0]?.trim() || !form.value.description?.trim()) {
    toast.error('Please fill in all required fields');
    return;
  }
  isSubmitting.value = true;
  try {
    const fd = new FormData();
    form.value.titles.forEach((t, i) => { if (t?.trim()) fd.append(`titles[${i}]`, t.trim()); });
    fd.append('description', form.value.description.trim());
    fd.append('priority', form.value.priority);
    if (form.value.update_photo) fd.append('update_photo', form.value.update_photo);
    if (form.value.update_file)  fd.append('update_file',  form.value.update_file);

    const res = await axios.post('/api/updates', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    if (res.data.status === 'success' || res.status === 200 || res.status === 201) {
      showSuccessModal.value = true;
    } else {
      toast.error(res.data.message || 'Failed to submit update');
    }
  } catch (err) {
    const msg = err.response?.data?.message || (err.request ? 'No response from server.' : 'An error occurred');
    toast.error(msg);
  } finally {
    isSubmitting.value = false;
  }
};

const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (!['image/jpeg','image/jpg','image/png','image/gif','image/webp'].includes(file.type)) {
    toast.error('Please upload a valid image file'); e.target.value = ''; return;
  }
  if (file.size > 10 * 1024 * 1024) { toast.error('Image must be under 10MB'); e.target.value = ''; return; }
  form.value.update_photo = file;
  const reader = new FileReader();
  reader.onload = (ev) => { photoPreview.value = ev.target.result; };
  reader.readAsDataURL(file);
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const valid = [
    'application/pdf','application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/csv',
  ];
  if (!valid.includes(file.type)) { toast.error('Please upload a valid document file'); e.target.value = ''; return; }
  if (file.size > 10 * 1024 * 1024) { toast.error('File must be under 10MB'); e.target.value = ''; return; }
  form.value.update_file = file;
};

const removePhoto = () => {
  form.value.update_photo = null;
  photoPreview.value = null;
  const el = document.getElementById('update_photo');
  if (el) el.value = '';
};

const resetForm = () => {
  form.value = { titles: [''], description: '', priority: 'low', update_photo: null, update_file: null };
  photoPreview.value = null;
  showErrors.value = false;
  ['update_photo','update_file'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
};

const closeSuccessModal = () => { showSuccessModal.value = false; resetForm(); };
const createAnother    = () => { showSuccessModal.value = false; resetForm(); toast.success('Ready for new update!'); };
const viewUpdates      = () => { showSuccessModal.value = false; router.push('/tenderuser-viewupdate'); };
const goBack           = () => router.push('/tenderuser-viewupdate');
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>