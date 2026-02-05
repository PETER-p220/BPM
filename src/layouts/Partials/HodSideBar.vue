<template>
  <div class="h-full bg-gradient-to-b from-[#1a2332] to-[#283747] text-white">
    <!-- Sidebar Header -->
    <div class="p-6 border-b border-gray-700/50">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <i class="fas fa-user-tie text-white"></i>
        </div>
        <div>
          <h3 class="font-semibold text-white">HOD Portal</h3>
          <p class="text-xs text-gray-400">Department Management</p>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="p-4 space-y-2">
      <div
        v-for="(nav, index) in navigations"
        :key="index"
        class="transition-all duration-200"
      >
        <!-- Separator -->
        <div v-if="nav.type === 'separator'" class="py-3">
          <div class="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        </div>

        <!-- Menu Item -->
        <div v-else>
          <div
            @click="handleClick(nav, index)"
            class="group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/10"
            :class="{ 
              'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30': !hasChildren(nav) && isCurrentRoute(nav.name),
              'bg-white/5': hasChildren(nav) && nav.active
            }"
          >
            <div class="flex items-center space-x-3">
              <div class="relative">
                <i 
                  class="text-lg transition-all duration-200" 
                  :class="[
                    nav.icon,
                    !hasChildren(nav) && isCurrentRoute(nav.name) ? 'text-indigo-400 scale-110' : 'text-gray-300 group-hover:text-white'
                  ]"
                ></i>
                <div 
                  v-if="!hasChildren(nav) && isCurrentRoute(nav.name)" 
                  class="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
                ></div>
              </div>
              <span class="font-medium transition-colors duration-200"
                :class="{
                  'text-indigo-300': !hasChildren(nav) && isCurrentRoute(nav.name),
                  'text-gray-200 group-hover:text-white': hasChildren(nav) || !isCurrentRoute(nav.name)
                }"
              >
                {{ nav.label }}
              </span>
            </div>

            <i
              v-if="hasChildren(nav)"
              class="fas text-xs transition-all duration-300 text-gray-400"
              :class="nav.active ? 'fa-chevron-down rotate-180' : 'fa-chevron-right'"
            />
          </div>

          <!-- Children Submenu -->
          <div 
            v-if="hasChildren(nav) && nav.active" 
            class="mt-2 ml-4 space-y-1 overflow-hidden animate-in slide-in-from-top-2 duration-200"
          >
            <div
              v-for="(child, childIndex) in nav.children"
              :key="childIndex"
              @click="navigate(child)"
              class="group flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/10 hover:translate-x-1"
              :class="{ 
                'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-l-2 border-indigo-400': isCurrentRoute(child.name)
              }"
            >
              <i 
                class="text-sm transition-colors duration-200 w-4"
                :class="[
                  child.icon,
                  isCurrentRoute(child.name) ? 'text-indigo-400' : 'text-gray-400 group-hover:text-white'
                ]"
              ></i>
              <span class="text-sm transition-colors duration-200"
                :class="{
                  'text-indigo-300 font-medium': isCurrentRoute(child.name),
                  'text-gray-300 group-hover:text-white': !isCurrentRoute(child.name)
                }"
              >
                {{ child.label }}
              </span>
              <div 
                v-if="isCurrentRoute(child.name)" 
                class="ml-auto w-1.5 h-1.5 bg-indigo-400 rounded-full"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const currentRoute = useRoute()

const navigations = ref([
  {
    icon: 'fas fa-tachometer-alt text-blue-400',
    label: 'Dashboard',
    name: 'HodDashboard',
  },

  { type: 'separator' },                                            

  {
    icon: 'fas fa-file-contract text-red-400',
    label: 'Tenders',
    active: false,
    children: [
      { icon: 'fas fa-list-ul', label: 'Assigned Tenders', name: 'HodTenders' },
      { icon: 'fas fa-paper-plane', label: 'Submitted Tenders', name: 'HodViewSubmittedTenders' },
      { icon: 'fas fa-trophy', label: 'Awarded Tenders', name: 'HodViewAwardedTenders' },
    ],
  },

  { type: 'separator' },

  {
    icon: 'fas fa-project-diagram text-teal-400',
    label: 'Projects',
    active: false,
    children: [
      { icon: 'fas fa-list', label: 'Assigned Projects', name: 'HodViewProjects' },
      { icon: 'fas fa-tasks', label: 'Project Activities', name: 'HodActivities' },
    ],
  },

  { type: 'separator' },

  {
    icon: 'fas fa-inbox text-cyan-400',
    label: 'Requests & Schedules',
    active: false,
    children: [
      { icon: 'fas fa-list-ul', label: 'All Requests', name: 'HodGetAllRequests' },
      { icon: 'fas fa-file-invoice-dollar', label: 'Price Schedules', name: 'HodPriceSchedules' },
      { icon: 'fas fa-chart-bar', label: 'Project Analyses', name: 'HodViewAnalyses' },
    ],
  },

  { type: 'separator' },

  {
    icon: 'fas fa-upload text-blue-400',
    label: 'Updates',
    active: false,
    children: [
      { icon: 'fas fa-plus-circle', label: 'Submit Update', name: 'HodSubmitUpdate' },
      { icon: 'fas fa-list', label: 'View / Manage Updates', name: 'HodViewUpdate' },
    ],
  },

  {
    icon: 'fas fa-users text-indigo-400',
    label: 'Meetings',
    active: false,
    children: [
      { icon: 'fas fa-user-check', label: 'Manage Attendance', name: 'HodManageAllAttendance' },
      { icon: 'fas fa-plus', label: 'Create Attendance', name: 'HodCreateAttendance' },
      { icon: 'fas fa-file-alt', label: 'Meeting Minutes', name: 'HodGetMinutes' },
      { icon: 'fas fa-plus', label: 'Create Minutes', name: 'HodCreateUpdate' },
    ],
  },
])

function handleClick(item, index) {
  if (item.type === 'separator') return

  if (hasChildren(item)) {
    // Close other groups
    navigations.value.forEach((n, i) => {
      if (i !== index) n.active = false
    })
    item.active = !item.active
  } else {
    navigate(item)
  }
}

function navigate(item) {
  if (item.name) {
    router.push({ name: item.name })
  }
}

const hasChildren = (item) => item.children && item.children.length > 0

const isCurrentRoute = (name) => currentRoute.name === name

// Optional: Auto-expand parent when child route is active
watch(
  () => currentRoute.name,
  (newName) => {
    navigations.value.forEach((parent) => {
      if (hasChildren(parent)) {
        parent.active = parent.children.some(child => child.name === newName)
      }
    })
  },
  { immediate: true }
)
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Animations */
@keyframes slide-in-from-top {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation-fill-mode: both;
}

.slide-in-from-top-2 {
  animation-name: slide-in-from-top;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, opacity, transform, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>