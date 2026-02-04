<template>
  <ul class="text-sm text-center" style="color:white;height: 780px; overflow-y: auto; background-color: #283747; font-family: 'Times New Roman', serif; font-size: 14px; font-style: oblique;">
    <li
      class="hover:text-dark-secondary hover:bg-dark-primary dark:hover:bg-dark-body"
      v-for="(navigation, index) in navigations"
      :key="index"
      :class="{ 'dark:bg-dark-body': isActive(navigation) }"
    >
      <!-- Skip separator items -->
      <template v-if="navigation.type === 'separator'">
        <div class="py-2 px-5">
          <div class="border-t border-gray-600"></div>
        </div>
      </template>

      <template v-else>
        <div class="cursor-pointer" @click="clickNavigation(navigation, index)">
          <div class="flex items-center py-3 pl-5 pr-2" :class="{ 'justify-between': hasChild(navigation) }">
            <div>
              <span>
                <i class="w-6 mr-3 shrink-0" :class="navigation.icon"></i>
              </span>
              <span>{{ navigation.label }}</span>
            </div>
            <span v-if="hasChild(navigation)">
              <i class="w-6 mr-3 shrink-0 fas" :class="navigation.active ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
            </span>
          </div>
        </div>

        <!-- Render child list if it has children and the parent is active -->
        <div v-if="hasChild(navigation) && navigation.active">
          <ul class="pl-5">
            <li
              class="cursor-pointer text-secondary hover:text-darken-secondary hover:bg-darken-primary dark:hover:bg-black"
              v-for="child in navigation.children"
              :key="child.name"
              @click="navigateToChild(child)"
            >
              <div class="flex items-center py-2 pl-10 pr-2">
                <span>
                  <i class="w-4 mr-3 shrink-0" :class="child.icon"></i>
                </span>
                <span>{{ child.label }}</span>
              </div>
            </li>
          </ul>
        </div>
      </template>
    </li>
  </ul>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

const navigations = ref([
  // ──── DASHBOARD ────
  {
    icon: "fas fa-chart-line text-blue-500",
    label: "Dashboard",
    name: "Dashboard",
    path: "HodDashboard",          // ✅ matches router name: 'HodDashboard'
    active: false,
  },

  { type: 'separator' },           // clean visual divider instead of empty {}

  // ──── TENDERS ────
  {
    icon: "fas fa-tasks text-red-500",
    label: "Assigned Tenders",
    name: "Assigned Tenders",
    active: false,
    children: [
      {
        icon: "fas fa-tasks text-blue-500",
        label: "View Assigned Tenders",
        name: "HodTenders",
        path: "HodTenders",        // ✅ matches router name: 'HodTenders'
        active: false,
      },
    ],
  },
  {
    icon: "fas fa-tasks text-green-500",
    label: "Submitted Tenders",
    name: "Submitted Tenders",
    active: false,
    children: [
      {
        icon: "fas fa-tasks text-blue-500",
        label: "View Submitted Tenders",
        name: "HodViewSubmittedTenders",
        path: "HodViewSubmittedTenders", // ✅ matches router name: 'HodViewSubmittedTenders'
        active: false,
      },
    ],
  },
  {
    icon: "fas fa-tasks text-yellow-500",
    label: "Awarded Tenders",
    name: "Awarded Tenders",
    active: false,
    children: [
      {
        icon: "fas fa-eye text-blue-500",
        label: "View Awarded Tenders",
        name: "HodViewAwardedTenders",
        path: "HodViewAwardedTenders",   // ✅ matches router name: 'HodViewAwardedTenders'
        active: false,
      },
    ],
  },

  { type: 'separator' },

  // ──── PROJECTS ────
  {
    icon: "fas fa-tasks text-teal-500",
    label: "Assigned Projects",
    name: "Assigned Projects",
    active: false,
    children: [
      {
        icon: "fas fa-tasks text-blue-500",
        label: "Manage Assigned Projects",
        name: "HodViewProjects",
        path: "HodViewProjects",         // ✅ matches router name: 'HodViewProjects'
        active: false,
      },
    ],
  },
  {
    icon: "fas fa-calendar-alt text-purple-500",
    label: "Projects Activities",
    name: "Projects Activities",
    active: false,
    children: [
      {
        icon: "fas fa-tasks text-blue-500",
        label: "Manage Activities",
        name: "HodActivities",
        path: "HodActivities",          // ✅ NEW route — see router fix below
        active: false,
      },
    ],
  },

  { type: 'separator' },

  // ──── REQUESTS & SCHEDULES ────
  {
    icon: "fas fa-layer-group text-teal-500",
    label: "Requests Management",
    name: "Requests Management",
    active: false,
    children: [
      {
        icon: "fas fa-eye text-green-500",
        label: "View Requests",
        name: "HodGetAllRequests",
        path: "HodGetAllRequests",      // ✅ matches router name: 'HodGetAllRequests'
        active: false,
      },
    ],
  },
  {
    icon: "fas fa-layer-group text-pink-500",
    label: "Price Schedules",
    name: "Price Schedules",
    active: false,
    children: [
      {
        icon: "fas fa-eye text-green-500",
        label: "View Price Schedules",
        name: "HodPriceSchedules",
        path: "HodPriceSchedules",      // ✅ NEW route — see router fix below
        active: false,
      },
    ],
  },
  {
    icon: "fas fa-chart-pie text-pink-500",
    label: "Project Analyses",
    name: "Project Analyses",
    active: false,
    children: [
      {
        icon: "fas fa-eye text-green-500",
        label: "View Analyses",
        name: "HodViewAnalyses",
        path: "HodViewAnalyses",        // ✅ NEW route — see router fix below
        active: false,
      },
    ],
  },

  { type: 'separator' },

  // ──── UPDATES & MEETINGS ────
  {
    icon: "fas fa-file-upload text-blue-500",
    label: "Updates Management",
    name: "Updates Management",
    active: false,
    children: [
      {
        icon: "fas fa-receipt text-yellow-500",
        label: "Submit Update",
        name: "HodSubmitUpdate",
        path: "HodSubmitUpdate",        // ✅ matches router name: 'HodSubmitUpdate'
        active: false,
      },
      {
        icon: "fas fa-tasks text-blue-500",
        label: "Manage Updates",
        name: "HodViewUpdate",
        path: "HodViewUpdate",          // ✅ matches router name: 'HodViewUpdate'
        active: false,
      },
    ],
  },
  {
    icon: "fas fa-calendar-alt text-indigo-500",
    label: "Meetings Management",
    name: "Meetings Management",
    active: false,
    children: [
      {
        icon: "fas fa-user-check text-purple-500",
        label: "Manage Attendance",
        name: "HodManageAllAttendance",
        path: "HodManageAllAttendance", // ✅ matches router name: 'HodManageAllAttendance'
        active: false,
      },
      {
        icon: "fas fa-plus text-purple-500",
        label: "Create Attendance",
        name: "HodCreateAttendance",
        path: "HodCreateAttendance",    // ✅ matches router name: 'HodCreateAttendance'
        active: false,
      },
      {
        icon: "fas fa-file-alt text-green-500",
        label: "View Minutes",
        name: "HodGetMinutes",
        path: "HodGetMinutes",          // ✅ matches router name: 'HodGetMinutes'
        active: false,
      },
      {
        icon: "fas fa-plus text-green-500",
        label: "Create Minutes",
        name: "HodCreateUpdate",
        path: "HodCreateUpdate",        // ✅ matches router name: 'HodCreateUpdate'
        active: false,
      },
    ],
  },
]);

const clickNavigation = (navigation, index) => {
  if (navigation.type === 'separator') return;

  if (hasChild(navigation)) {
    navigations.value.forEach((item, idx) => {
      if (idx !== index) item.active = false;
    });
    navigations.value[index].active = !navigations.value[index].active;
  } else {
    navigateToPath(navigation);
  }
};

const navigateToPath = (navigation) => {
  if (hasPath(navigation)) {
    router.push({ name: navigation.path });
  }
};

const navigateToChild = (child) => {
  if (hasPath(child)) {
    router.push({ name: child.path });
  }
};

const hasPath = (navigation) => navigation.hasOwnProperty('path');
const hasChild = (navigation) => navigation.children && navigation.children.length > 0;
const isActive = (navigation) => navigation.active === true;
</script>

<style scoped>
ul::-webkit-scrollbar {
  width: 8px;
}

ul::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 10px;
}

ul::-webkit-scrollbar-thumb:hover {
  background: #888;
}

.text-secondary {
  color: #B3B3B3;
}

.hover\:text-dark-secondary:hover {
  color: #FFFFFF;
}

.hover\:bg-dark-primary:hover {
  background-color: #3B3B3B;
}

.dark\:hover\:bg-dark-body:hover {
  background-color: #2C2C2C;
}

.hover\:text-darken-secondary:hover {
  color: #E6E6E6;
}

.hover\:bg-darken-primary:hover {
  background-color: #4B4B4B;
}

ul {
  max-height: 780px;
  overflow-y: auto;
}

ul > li {
  overflow: hidden;
}
</style>