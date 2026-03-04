<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Project Activities</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Overview of all ongoing and completed activities across projects
          </p>
        </div>
        <!-- Vous pouvez ajouter des filtres ou un bouton "Nouvelle activité" ici -->
      </div>

      <!-- Loading / Empty / Content -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="n in 8" :key="n" class="animate-pulse bg-white dark:bg-gray-800 rounded-xl shadow h-96"></div>
      </div>

      <div v-else-if="groupedProjects.length === 0" class="text-center py-20">
        <div class="inline-block p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-4 text-xl font-semibold text-gray-900 dark:text-white">No activities found</h3>
          <p class="mt-2 text-gray-500 dark:text-gray-400">There are currently no project activities to display.</p>
        </div>
      </div>

      <div v-else class="space-y-12">
        <section v-for="(group, index) in groupedProjects" :key="index">
          <h2 class="mb-5 text-2xl font-bold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
            {{ group[0].project_name }}
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="activity in group"
              :key="activity.activity_id"
              @click="viewProjectActivities(activity.activity_id)"
              class="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              tabindex="0"
            >
              <!-- Image -->
              <div class="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  v-if="activity.activity_photo"
                  :src="activity.activity_photo"
                  alt="Activity"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div v-else class="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                  <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                <!-- Status badge overlay -->
                <div class="absolute top-4 right-4">
                  <span
                    :class="statusBadgeClasses(activity.task_status)"
                    class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm"
                  >
                    {{ formatStatus(activity.task_status) }}
                  </span>
                </div>

                <!-- Viewed indicator -->
                <div v-if="activity.is_viewed === 'Yes'" class="absolute top-4 left-4">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300">
                    Viewed
                  </span>
                </div>
              </div>

              <!-- Content -->
              <div class="p-5">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {{ activity.activity_name }}
                </h3>

                <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                  {{ activity.description || 'No description available' }}
                </p>

                <div class="flex items-center justify-between">
                  <BaseButton
                    variant="primary"
                    size="sm"
                    @click.stop="viewProjectActivities(activity.activity_id)"
                  >
                    View Details
                    <svg class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </BaseButton>

                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    ID: {{ activity.activity_id }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
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

const projects = ref([])
const loading = ref(true)

onMounted(async () => {
  await fetchProjects()
})

async function fetchProjects() {
  loading.value = true
  try {
    const response = await axios.get('/api/all/project/activities') // ← corrigez le chemin si besoin (supprimez le 'api/' si déjà dans baseURL)
    projects.value = response.data.activities.map(activity => ({
      activity_id: activity.activity_id,
      activity_name: activity.activity_category || 'Unnamed Activity',
      project_name: activity.project?.project_name || '—',
      description: activity.description || '',
      activity_photo: activity.activity_photo,
      is_viewed: activity.is_viewed,
      task_status: activity.task_status,
      project_id: activity.project?.project_id,
    }))
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

function viewProjectActivities(activity_id) {
  router.push({ name: 'TenderUserViewActivityDetail', params: { activity_id } })
}

const groupedProjects = computed(() => {
  const groups = {}
  projects.value.forEach(act => {
    if (!groups[act.project_name]) groups[act.project_name] = []
    groups[act.project_name].push(act)
  })
  return Object.values(groups)
})

function handleError(error) {
  const message = error.response?.data?.message || 'Failed to load project activities'
  toast.error(message)
}

// ── Helpers ────────────────────────────────────────────────────────────────
function formatStatus(status) {
  if (!status) return 'Unknown'
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

function statusBadgeClasses(status) {
  const s = (status || '').toLowerCase()
  if (s.includes('complete') || s.includes('done')) return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
  if (s.includes('in progress') || s.includes('ongoing')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
  if (s.includes('pending') || s.includes('waiting')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
  if (s.includes('delayed') || s.includes('issue')) return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}
</script>