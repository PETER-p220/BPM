<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Project Activities</h1>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Overview of all registered project activities — grouped by project
      </p>
    </div>

    <!-- Loading / Empty State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="text-gray-500 dark:text-gray-400 animate-pulse">
        Loading project activities...
      </div>
    </div>

    <div v-else-if="groupedProjects.length === 0" class="text-center py-20 text-gray-500 dark:text-gray-400">
      No activities found at the moment.
    </div>

    <!-- Grouped Activities -->
    <div v-else class="space-y-10">
      <div v-for="(group, index) in groupedProjects" :key="index">
        <h2 class="mb-5 text-xl font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
          {{ group[0].project_name }}
        </h2>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div
            v-for="activity in group"
            :key="activity.activity_id"
            class="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
            @click="viewProjectActivities(activity.activity_id)"
          >
            <!-- Image -->
            <div class="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700">
              <img
                v-if="activity.activity_photo"
                :src="activity.activity_photo"
                alt="Activity photo"
                class="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                @error="handleImageError"
              />
              <div
                v-else
                class="w-full h-48 flex items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700"
              >
                <svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <!-- Content -->
            <div class="p-5">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                {{ activity.activity_name || 'Unnamed Activity' }}
              </h3>

              <div class="space-y-2.5 mt-3">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Status:</span>
                  <span :class="getStatusClasses(activity.task_status)" class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ activity.task_status || 'Not Set' }}
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Viewed:</span>
                  <span :class="getViewedClasses(activity.is_viewed)" class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ activity.is_viewed ? 'Yes' : 'No' }}
                  </span>
                </div>
              </div>

              <p class="mt-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {{ activity.description || 'No description provided.' }}
              </p>

              <div class="mt-5">
                <button
                  class="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  View Details <span class="ml-1">→</span>
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();

const projects = ref([]);
const loading = ref(false);

onMounted(async () => {
  await fetchProjects();
});

async function fetchProjects() {
  loading.value = true;
  try {
    const response = await axios.get('api/all/project/activities');
    projects.value = (response.data.activities || []).map(act => ({
      activity_id: act.activity_id,
      activity_name: act.activity_category || act.activity_name,
      project_name: act.project?.project_name || 'Unknown Project',
      description: act.description || '',
      activity_photo: act.activity_photo,
      is_viewed: !!act.is_viewed,
      task_status: act.task_status || 'Pending',
      project_id: act.project?.project_id
    }));
  } catch (error) {
    handleError(error);
  } finally {
    loading.value = false;
  }
}

function viewProjectActivities(activityId) {
  router.push({
    name: 'AdminViewAllActivityDetailsPage',
    params: { activity_id: activityId }
  });
}

const groupedProjects = computed(() => {
  const groups = {};
  projects.value.forEach(activity => {
    const key = activity.project_name;
    if (!groups[key]) groups[key] = [];
    groups[key].push(activity);
  });
  return Object.values(groups);
});

function getStatusClasses(status) {
  const s = (status || '').toLowerCase();
  if (s === 'completed' || s === 'done') return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300';
  if (s === 'in progress' || s === 'ongoing') return 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300';
  if (s === 'delayed' || s === 'behind') return 'bg-orange-100 text-orange-800 dark:bg-orange-800/30 dark:text-orange-300';
  if (s === 'not started' || s === 'pending') return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  return 'bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-300';
}

function getViewedClasses(viewed) {
  return viewed
    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800/30 dark:text-emerald-300'
    : 'bg-rose-100 text-rose-800 dark:bg-rose-800/30 dark:text-rose-300';
}

function handleImageError(e) {
  e.target.src = '/placeholder-image.jpg'; // You can add a fallback image path
  e.target.alt = 'Image failed to load';
}

function handleError(error) {
  let msg = 'Something went wrong';
  if (error.response?.data?.message) msg = error.response.data.message;
  else if (error.message) msg = error.message;
  toast.error(msg);
}
</script>