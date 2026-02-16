<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-10 text-center">
        Update Details
      </h1>

      <div
        v-if="chat"
        class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
      >
        <!-- Image Section -->
        <div class="relative">
          <img
            v-if="chat.update_photo"
            :src="chat.update_photo"
            alt="Update photo"
            class="w-full h-80 object-cover transition-transform duration-500 hover:scale-[1.02]"
          />
          <div
            v-else
            class="h-80 bg-gray-100 flex items-center justify-center text-gray-400 text-lg"
          >
            No image available
          </div>
        </div>

        <!-- Content -->
        <div class="p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            {{ chat.title }}
          </h2>

          <div class="space-y-4 text-gray-700">
            <p class="text-sm text-gray-500">
              <span class="font-medium text-gray-700">Created:</span>
              {{ new Date(chat.created_at).toLocaleString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) }}
            </p>

            <div>
              <h3 class="font-medium text-gray-800 mb-2">Description</h3>
              <p class="whitespace-pre-line leading-relaxed">
                {{ chat.description || 'No description provided.' }}
              </p>
            </div>
          </div>

          <!-- Action Button -->
          <div class="mt-8 flex justify-end">
            <button
              @click="showModal = true"
              class="inline-flex items-center px-6 py-3 bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Update
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p class="text-gray-600 text-lg">Loading update details...</p>
      </div>

      <!-- Edit Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
          <div class="px-8 pt-8 pb-6 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-gray-900">
              Edit Update
            </h2>
          </div>

          <form @submit.prevent="saveChanges" class="p-8 space-y-6">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                v-model="form.title"
                type="text"
                id="title"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                v-model="form.description"
                id="description"
                rows="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
              ></textarea>
            </div>

            <div class="flex justify-end gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                @click="cancelEdit"
                class="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                :disabled="isLoading"
                class="inline-flex items-center px-6 py-3 bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="isLoading"
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-if="isLoading">Saving...</span>
                <span v-else>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/axios'

const route = useRoute()
const router = useRouter()
const chat_id = route.params.chat_id

const chat = ref(null)
const showModal = ref(false)
const isLoading = ref(false)
const toast = useToast()

const form = reactive({
  title: '',
  description: ''
})

onMounted(async () => {
  await fetchChatDetails()
})

async function fetchChatDetails() {
  try {
    const response = await axios.get(`api/updates/${chat_id}`)
    if (response.data.status === 'success') {
      const data = response.data.data
      chat.value = {
        update_photo: data.update_photo,
        title: data.title,
        created_at: data.created_at,
        description: data.description
      }
      form.title = data.title
      form.description = data.description
    } else {
      toast.error(response.data.message || 'Failed to load update')
    }
  } catch (error) {
    console.error(error)
    toast.error('Could not load update details')
  }
}

async function saveChanges() {
  if (!form.title.trim()) {
    toast.warning('Title is required')
    return
  }

  isLoading.value = true

  try {
    const response = await axios.put(`/api/updates/${chat_id}`, {
      title: form.title,
      description: form.description
    })

    if (response.data.status === 'success') {
      toast.success('Update saved successfully')
      showModal.value = false

      // Update displayed data
      if (chat.value) {
        chat.value.title = form.title
        chat.value.description = form.description
      }
    } else {
      toast.error(response.data.message || 'Failed to save changes')
    }
  } catch (error) {
    console.error(error)
    toast.error('Error while saving changes')
  } finally {
    isLoading.value = false
  }
}

function cancelEdit() {
  const userRole = localStorage.getItem('userRole')
  if (userRole === '6') {
    router.push('/hr-view-updates')
  } else {
    router.push('/user/update')
  }
}
</script>