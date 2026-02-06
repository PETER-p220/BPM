<template>
  <div class="flex flex-col h-full bg-gray-900 text-gray-200">
    <!-- Sidebar Header / Logo (optional) -->
    <div class="p-6 border-b border-gray-800">
      <h2 class="text-xl font-semibold tracking-tight text-white">
        Tender Management
      </h2>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
      <ul class="space-y-1">
        <li v-for="(item, index) in navigations" :key="item.name || index">
          <!-- Parent Item -->
          <div
            class="group flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors"
            :class="[
              isActive(item) || item.active
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
            ]"
            @click="clickNavigation(item, index)"
          >
            <div class="flex items-center">
              <i :class="[item.icon, 'w-5 h-5 mr-3 shrink-0']"></i>
              <span class="text-sm font-medium">{{ item.label }}</span>
            </div>

            <i
              v-if="hasChild(item)"
              class="fas w-4 h-4 transition-transform"
              :class="item.active ? 'fa-chevron-down' : 'fa-chevron-right'"
            ></i>
          </div>

          <!-- Children (submenu) -->
          <ul
            v-if="hasChild(item) && item.active"
            class="mt-1 ml-4 space-y-1 border-l border-gray-700 pl-3"
          >
            <li v-for="child in item.children" :key="child.name">
              <div
                class="flex items-center px-4 py-2.5 rounded-lg cursor-pointer text-sm transition-colors"
                :class="[
                  child.path && $route.name === child.path
                    ? 'bg-indigo-600/20 text-indigo-400 font-medium'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                ]"
                @click="navigateToChild(child)"
              >
                <i :class="[child.icon, 'w-4 h-4 mr-3 shrink-0']"></i>
                <span>{{ child.label }}</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </nav>

    <!-- Footer / Others section (optional) -->
    <div class="p-4 border-t border-gray-800 text-xs text-gray-500">
      © {{ new Date().getFullYear() }} Tender System
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const navigations = ref([
  {
    icon: 'fas fa-chart-line',
    label: 'Dashboard',
    name: 'Dashboard',
    path: 'TendersDashboard',
    active: false,
  },

  {
    icon: 'fas fa-file-contract',
    label: 'Tenders',
    name: 'Tenders Management',
    active: false,
    children: [
      {
        icon: 'fas fa-pen-square',
        label: 'Register Tender',
        name: 'Tenders',
        path: 'Tenders',
      },
      {
        icon: 'fas fa-tasks',
        label: 'Assign Tender',
        name: 'AllAssignedTenders',
        path: 'AllAssignedTenders',
      },
      {
        icon: 'fas fa-folder-open',
        label: 'Submitted Tenders',
        name: 'TendersDocSubmission',
        path: 'TendersDocSubmission',
      },
    ],
  },

  {
    icon: 'fas fa-trophy',
    label: 'Awards',
    name: 'Awards',
    active: false,
    children: [
      {
        icon: 'fas fa-lightbulb',
        label: 'Intentions to Award',
        name: 'ViewIntentionToAwards',
        path: 'ViewIntentionToAwards',
      },
      {
        icon: 'fas fa-envelope',
        label: 'Awarding Letters',
        name: 'ViewAwardLetter',
        path: 'ViewAwardLetter',
      },
    ],
  },

  {
    icon: 'fas fa-chart-line',
    label: 'Performances',
    name: 'Performances',
    active: false,
    children: [
      {
        icon: 'fas fa-shield-alt',
        label: 'Insurance Bonds',
        name: 'insuranceBond',
        path: 'insuranceBond',
      },
      {
        icon: 'fas fa-lock',
        label: 'Security Declarations',
        name: 'securityDeclaration',
        path: 'securityDeclaration',
      },
    ],
  },

  {
    icon: 'fas fa-ellipsis-h',
    label: 'Others',
    name: 'Others',
    path: 'Others',
  },
]);

const clickNavigation = (item, index) => {
  if (hasChild(item)) {
    // Close all other menus
    navigations.value.forEach((nav, i) => {
      if (i !== index) nav.active = false;
    });
    // Toggle current
    item.active = !item.active;
  } else if (hasPath(item)) {
    navigateToPath(item);
  }
};

const navigateToPath = (item) => {
  if (item.path) {
    router.push({ name: item.path });
  }
};

const navigateToChild = (child) => {
  if (child.path) {
    router.push({ name: child.path });
  }
};

const hasChild = (item) => item.children && item.children.length > 0;
const hasPath = (item) => !!item.path;

// Improved active check: parent or child matches current route
const isActive = (item) => {
  if (item.path && route.name === item.path) return true;
  if (hasChild(item)) {
    return item.children.some((child) => child.path && route.name === child.path);
  }
  return false;
};
</script>

<style scoped>
/* Custom scrollbar */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #1f2937;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>                                                            