<template>
  <div class="p-6 space-y-6 bg-gray-50 min-h-screen">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Project Updates</h1>
        <p class="text-gray-600 mt-1">All updates are listed here</p>
      </div>

      <router-link :to="{ name: 'HodSubmitUpdate' }">
        <button
          class="inline-flex items-center px-5 py-2.5 bg-[#2e4053] hover:bg-[#1f2d3a] text-white font-medium rounded-lg shadow-sm transition-colors"
        >
          <i class="fas fa-plus mr-2"></i>
          Submit New Update
        </button>
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-3xl text-gray-600"></i>
      <p class="mt-3 text-gray-600">Loading updates...</p>
    </div>

    <div v-else-if="groupedUpdates.length === 0" class="text-center py-12 text-gray-500">
      No updates found yet.
    </div>

    <div v-else class="space-y-8">
      <div v-for="(group, index) in groupedUpdates" :key="index">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          {{ group[0].title }}
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="update in group"
            :key="update.chat_id"
            class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer border border-gray-200"
            @click="viewUpdateDetails(update.chat_id)"
          >
            <div class="aspect-[4/3] bg-gray-100">
              <img
                v-if="update.update_photo"
                :src="update.update_photo"
                alt="Update photo"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <i class="fas fa-image text-5xl"></i>
              </div>
            </div>

            <div class="p-4">
              <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2">{{ update.title }}</h3>
              <p class="text-sm text-gray-600 mb-1">By: {{ update.user_name }}</p>
              <p class="text-xs text-gray-500 mb-3">
                {{ formatDate(update.created_at) }}
              </p>

              <p v-if="update.description" class="text-sm text-gray-700 line-clamp-3 mb-4">
                {{ update.description }}
              </p>

              <div class="flex flex-wrap gap-2">
                <button
                  v-if="update.update_file"
                  @click.stop
                  :href="update.update_file"
                  target="_blank"
                  class="inline-flex items-center px-3 py-1.5 text-xs bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                >
                  <i class="fas fa-download mr-1"></i>
                  Download File
                </button>

                <button
                  class="inline-flex items-center px-3 py-1.5 text-xs bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
                  @click.stop="viewUpdateDetails(update.chat_id)"
                >
                  <i class="fas fa-eye mr-1"></i>
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const updates = ref([])
const loading = ref(false)

onMounted(async () => {
  await fetchUpdates()
})

async function fetchUpdates() {
  loading.value = true
  try {
    const response = await axios.get('/api/updates')
    updates.value = response.data.data.map(update => ({
      chat_id: update.chat_id,
      title: update.title,
      user_name: update.user?.name || 'Unknown',
      created_at: update.created_at,
      update_photo: update.update_photo,
      description: update.description,
      update_file: update.update_file,
    }))
  } catch (error) {
    toast.error('Failed to load updates')
    console.error(error)
  } finally {
    loading.value = false
  }
}

function viewUpdateDetails(chat_id) {
  router.push({ name: 'HodEditUpdate', params: { chat_id } })
}

const groupedUpdates = computed(() => {
  const groups = {}
  updates.value.forEach(update => {
    const key = update.title || 'Untitled'
    if (!groups[key]) groups[key] = []
    groups[key].push(update)
  })
  return Object.values(groups)
})

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>