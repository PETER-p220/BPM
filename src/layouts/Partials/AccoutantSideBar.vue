
  <template>
    <ul class="text-sm text-center" style="color:white; height: 780px; overflow-y: auto; background-color: #283747; font-family: 'cygre', sans-serif; font-size: 14px">
      <li
        class="hover:text-dark-secondary hover:bg-dark-primary dark:hover:bg-dark-body"
        v-for="(navigation, index) in navigations"
        :key="navigation.name"
        :class="{ 'dark:bg-dark-body': isActive(navigation) }"
      >
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
      </li>
    </ul>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';
  
  const router = useRouter();
  
  const navigations = ref([
  {},
  {
    icon: "fas fa-chart-line text-blue-500",
    label: "Dashboard",
    name: "AccountantDashbaord",
    path: "AccountantDashbaord",
    active: false,
  },
  {},
  {
    "icon": "fas fa-project-diagram text-orange-500",
    "label": "Projects",
    "name": "Projects",
    "active": false,
    "children": [
      {
        "icon": "fas fa-chart-bar text-green-500",
        "label": "Analysis",
        "name": "AccViewAnalysis",
        "path": "AccViewAnalysis",
        "active": false
      },
      {
        "icon": "fas fa-folder-open text-green-500",
        "label": "Project Portfolio",
        "name": "AccViewPortfolio",
        "path": "AccViewPortofolio",
        "active": false
      },
      {
        "icon": "fas fa-money-check-alt text-green-500",
        "label": "Payment Follow-Up",
        "name": "AccFollowUp",
        "path": "AccFollowUp",
        "active": false
      }
    ]
  },
  {
    "icon": "fas fa-inbox text-orange-500",
    "label": "Requests",
    "name": "RequestsManagement",
    "active": false,
    "children": [
      {
        "icon": "fas fa-check-circle text-green-500",
        "label": "Approve Requests",
        "name": "AccManageRequests",
        "path": "AccManageRequests",
        "active": false
      },
      {
        "icon": "fas fa-clock text-green-500",
        "label": "Approve Extension Requests",
        "name": "AccManageExtendedRequests",
        "path": "AccManageExtendedRequests",
        "active": false
      }
    ]
  },
  {
    "icon": "fas fa-receipt text-yellow-500",
    "label": "Receipts Management",
    "name": "ReceiptsManagement",
    "active": false,
    "children": [
      {
        "icon": "fas fa-file-invoice text-green-500",
        "label": "View Receipts",
        "name": "AccntntGetALlReceipts",
        "path": "AccntntGetALlReceipts",
        "active": false
      }
    ]
  },
  {
    "icon": "fas fa-sync-alt text-blue-500",
    "label": "Updates Management",
    "name": "UpdatesManagement",
    "active": false,
    "children": [
      {
        "icon": "fas fa-plus-circle text-yellow-500",
        "label": "Submit Update",
        "name": "AccntantCreateUpdate",
        "path": "AccntantCreateUpdate",
        "active": false
      },
      {
        "icon": "fas fa-tasks text-blue-500",
        "label": "Manage Updates",
        "name": "AccntantViewUpdate",
        "path": "AccntantViewUpdate",
        "active": false
      }
    ]
  },
  {
    "icon": "fas fa-calendar-alt text-indigo-500",
    "label": "Meetings Management",
    "name": "MeetingsManagement",
    "active": false,
    "children": [
      {
        "icon": "fas fa-user-check text-purple-500",
        "label": "Create Attendance",
        "name": "AccntntCreateAttendance",
        "path": "AccntntCreateAttendance",
        "active": false
      },
      {
        "icon": "fas fa-file-alt text-green-500",
        "label": "Create Minutes",
        "name": "AccntntCreateMinutes",
        "path": "AccntntCreateMinutes",
        "active": false
      }
    ]
  },

  { icon: 'fas fa-ellipsis-h text-gray-500',
     label: 'Others',
      name: 'Others',
       path: 'Others',
        style: { fontFamily: 'Roboto' } 
    },
  ]);
  
  const clickNavigation = (navigation, index) => {
    if (hasChild(navigation)) {
      // If the navigation has children, toggle its active state
      navigations.value.forEach((item, idx) => {
        // Close all other navigation menus
        if (idx !== index) item.active = false;
      });
      navigations.value[index].active = !navigations.value[index].active;
    } else {
      // If no children, just navigate
      navigateToPath(navigation);
    }
  };
  
  const navigateToPath = (navigation) => {
    // Navigate to the path of the clicked navigation item
    if (hasPath(navigation)) {
      router.push({ name: navigation.path });
    }
  };
  
  const navigateToChild = (child) => {
    // Navigate to the path of the clicked child item
    if (hasPath(child)) {
      router.push({ name: child.path });
    }
  };
  
  const hasPath = (navigation) => navigation.hasOwnProperty('path');
  const hasChild = (navigation) => navigation.children && navigation.children.length > 0;
  const isActive = (navigation) => navigation.active === true;
  </script>
  
  <style scoped>
  /* Add a scrollbar style for better visibility */
  ul::-webkit-scrollbar {
    width: 8px;
  }
  
  ul::-webkit-scrollbar-thumb {
    background: #555; /* Color of the scrollbar */
    border-radius: 10px; /* Rounded corners */
  }
  
  ul::-webkit-scrollbar-thumb:hover {
    background: #888; /* Color on hover */
  }
  
  /* Hover and active styles */
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
  
  /* Ensure scrollability works in nested lists */
  ul {
    max-height: 780px;
    overflow-y: auto;
  }
  
  ul > li {
    overflow: hidden; /* Ensures submenus behave properly */
  }
  </style>
  