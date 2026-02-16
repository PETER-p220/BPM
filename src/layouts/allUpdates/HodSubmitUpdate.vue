<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl">
      <!-- Card -->
      <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <!-- Header -->
        <div class="flex items-center justify-between bg-indigo-700 px-6 py-4 text-white">
          <div class="flex items-center gap-3">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <h2 class="text-lg font-semibold">Submit Project Update</h2>
          </div>
          <button
            @click="closeOrCancel"
            class="rounded-full p-2 hover:bg-indigo-800 transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="submitUpdate" class="p-6 space-y-6">
          <!-- Multiple Titles / Updates -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Update Titles <span class="text-red-500 text-xs">*</span>
            </label>
            <div v-for="(title, index) in updateData.titles" :key="index" class="flex items-center gap-3 mb-3">
              <input
                v-model="updateData.titles[index]"
                type="text"
                placeholder="e.g. Completed foundation work"
                class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                :class="{ 'border-red-500': titleErrors[index] }"
              />
              <button
                type="button"
                @click="removeTitle(index)"
                class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition p-1"
                :disabled="updateData.titles.length === 1"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6" />
                </svg>
              </button>
            </div>

            <button
              type="button"
              @click="addTitle"
              class="mt-1 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add another update title
            </button>

            <p v-if="titleErrors.some(e => e)" class="mt-1 text-sm text-red-600 dark:text-red-400">
              All titles must be filled.
            </p>
          </div>

          <!-- Photo Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Update Photo (optional)
            </label>
            <div class="flex items-center gap-4">
              <label
                class="cursor-pointer flex-1 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 py-8 text-center hover:border-indigo-500 transition group"
              >
                <input type="file" accept="image/*" class="hidden" @change="handlePhotoUpload" />
                <div class="space-y-2">
                  <svg class="mx-auto h-10 w-10 text-gray-400 group-hover:text-indigo-500 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload photo or drag & drop
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, max 5MB
                  </p>
                </div>
              </label>

              <div v-if="photoPreview" class="w-32 h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 flex-shrink-0">
                <img :src="photoPreview" alt="Preview" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <!-- File Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Supporting Document (PDF, Excel, Word, etc.) — optional
            </label>
            <label class="cursor-pointer block rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 py-8 text-center hover:border-indigo-500 transition group">
              <input type="file" class="hidden" @change="handleFileUpload" />
              <div class="space-y-2">
                <svg class="mx-auto h-10 w-10 text-gray-400 group-hover:text-indigo-500 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Click to upload file or drag & drop
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ fileName || 'Any file type, max 10MB' }}
                </p>
              </div>
            </label>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description / Remarks
            </label>
            <textarea
              id="description"
              v-model="updateData.description"
              rows="5"
              placeholder="Provide details about the progress, challenges, next steps..."
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition resize-y"
            ></textarea>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col sm:flex-row sm:justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="closeOrCancel"
              class="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>

            <button
              type="submit"
              :disabled="isLoading || !isFormValid"
              class="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
            >
              <span v-if="isLoading">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              <span v-else>
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </span>
              {{ isLoading ? 'Submitting...' : 'Submit Update' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();

const updateData = ref({
  titles: [''],
  description: '',
  update_photo: null,
  update_file: null,
});

const photoPreview = ref(null);
const fileName = ref('');
const isLoading = ref(false);
const titleErrors = ref([]);

const isFormValid = computed(() => {
  return updateData.value.titles.every(t => t.trim() !== '');
});

function addTitle() {
  updateData.value.titles.push('');
}

function removeTitle(index) {
  if (updateData.value.titles.length > 1) {
    updateData.value.titles.splice(index, 1);
    titleErrors.value.splice(index, 1);
  }
}

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image size should be less than 5MB');
    return;
  }

  updateData.value.update_photo = file;
  photoPreview.value = URL.createObjectURL(file);
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    toast.error('File size should be less than 10MB');
    return;
  }

  updateData.value.update_file = file;
  fileName.value = file.name;
}

async function submitUpdate() {
  if (!isFormValid.value) {
    titleErrors.value = updateData.value.titles.map(t => !t.trim());
    toast.error('Please fill in all update titles');
    return;
  }

  isLoading.value = true;

  try {
    const formData = new FormData();

    updateData.value.titles.forEach((title, i) => {
      formData.append(`titles[${i}]`, title.trim());
    });

    if (updateData.value.description.trim()) {
      formData.append('description', updateData.value.description.trim());
    }

    if (updateData.value.update_photo) {
      formData.append('update_photo', updateData.value.update_photo);
    }

    if (updateData.value.update_file) {
      formData.append('update_file', updateData.value.update_file);
    }

    const response = await axios.post('/api/updates', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    toast.success(response.data.message || 'Update submitted successfully');
    router.push('/hodview-updates');
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to submit update';
    toast.error(msg);
  } finally {
    isLoading.value = false;
  }
}

function closeOrCancel() {
  router.push('/hodview-updates');
}
</script>