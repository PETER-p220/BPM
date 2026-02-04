<template>
    <div class="p-4 space-y-4"  style="font-family: 'cygre', serif; font-size: 17px">
      <PageHeader subtitle="Projects activities">
        <div class="flex flex-col sm:flex-row sm:space-x-2">
        </div>
      </PageHeader>
  
      <div class="py-5 space-y-3">
        <!-- Loop through projects and display activities grouped by project_name -->
        <div
          v-for="(groupedProjects, index) in groupedProjects"
          :key="index"
        >
          <h3 class="mb-4 text-xl font-semibold">{{ groupedProjects[0].project_name }}</h3>
          <div class="flex flex-wrap gap-4">
            <!-- Loop through each activity of the same project_name -->
            <div
              v-for="(project, projectIndex) in groupedProjects"
              :key="projectIndex"
              class="w-full p-4 bg-white shadow-md cursor-pointer sm:w-1/2 md:w-1/4 hover:shadow-xl"
              @click="viewProjectActivities(project.activity_id)"
            >
              <div class="flex flex-col">
                <img v-if="project.activity_photo" :src="project.activity_photo" class="object-cover w-full h-48 mb-4" alt="Activity Image" />
                <div class="mb-2 text-lg font-semibold text-teal-700"><strong class="font-semibold">Activity:</strong>{{ project.activity_name }}</div>
                <div class="mb-2 text-sm font-semibold text-blue-500">Project: {{ project.project_name }}</div>
                <button class="text-xs text-gray-700"  style="width:180px;background-color:#f4d03f;color:white;border-radius:17px">  <strong class="font-semibold text-white">Task Status:</strong> {{ project.task_status }}</button>
                <br>
                <button class="text-xs text-gray-700"  style="width:180px;background-color:#e74c3c;color:white;border-radius:17px">  <strong class="font-semibold text-white">IsViewed:</strong> {{ project.is_viewed }}</button>
                <hr>
                <br>
                <p class="text-xs text-gray-700"><strong class="font-semibold text-gray-900 ">Description:</strong> {{ project.description }}</p>
                <BaseButton @click="viewProjectActivities(project.activity_id)" class="mt-2" style="background-color: #2e4053;">
                  More Details.. <i class="fas fa-eye"></i>
                </BaseButton>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from '@/axios';
  import { useToast } from 'vue-toastification';
  
  const router = useRouter();
  const toast = useToast();
  const projects = ref([]);
  
  // Fetch data when component is mounted
  onMounted(async () => {
    await fetchProjects();
  });
  
  // Fetch project data
  async function fetchProjects() {
    try {
      const response = await axios.get('api/all/project/activities');
      projects.value = response.data.activities.map(activity => ({
        activity_id: activity.activity_id,
        activity_name: activity.activity_category,
        project_name: activity.project.project_name,
        description: activity.description,
        activity_photo: activity.activity_photo,
        is_viewed:activity.is_viewed,
        task_status :activity.task_status,
        project_id: activity.project.project_id,
      }));
    } catch (error) {
      handleError(error);
    }
  }
  
  // Navigate to project details page with activity_id
  function viewProjectActivities(activity_id) {
    router.push({ name: 'TenderUserViewActivityDetail', params: { activity_id } });
  }
  
  // Group projects by project_name
  const groupedProjects = computed(() => {
    const groups = {};
    projects.value.forEach(project => {
      if (!groups[project.project_name]) {
        groups[project.project_name] = [];
      }
      groups[project.project_name].push(project);
    });
    return Object.values(groups);
  });
  
  // Handle errors and display as toast messages
  function handleError(error) {
    let message = 'An unexpected error occurred';
    if (error.response) {
      message = error.response.data.message || error.response.statusText;
    } else if (error.request) {
      message = 'No response from the server. Please check your connection.';
    } else {
      message = error.message;
    }
    toast.error(message);
  }
  </script>
  