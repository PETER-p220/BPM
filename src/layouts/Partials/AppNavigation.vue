

<template>
  <ul class="text-sm text-center" style="color:white; height: 780px; overflow-y: auto; background-color: #283747; font-family: 'cygre', sans-serif; font-size: 14px;">
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
    name: "Dashboard",
    path: "UserDashboard",
    active: false,
},
{},
{
    "icon": "fas fa-file-contract text-yellow-400",
    "label": "Tenders",
    "name": "TendersManagement",
    "active": false,
    "children": [
      {
        "icon": "fas fa-tasks text-blue-500",
        "label": "Assigned Tenders",
        "name": "UserAssignedTenders",
        "path": "MyTender",
        "active": false
      },
      {
        "icon": "fas fa-paper-plane text-green-600",
        "label": "Submit Tender",
        "name": "UserTenderSubmissions",
        "path": "MySubmissions",
        "active": false
      },
      {
        "icon": "fas fa-calculator text-purple-500",
        "label": "Submit Quotation",
        "name": "UserQuotations",
        "path": "MySchedules",
        "active": false
      }
    ]
  },
  {
    "icon": "fas fa-project-diagram text-teal-500",
    "label": "Projects",
    "name": "ProjectsManagement",
    "active": false,
    "children": [
      {
        "icon": "fas fa-file-signature text-indigo-500",
        "label": "Appointment Letter",
        "name": "UserAppointmentLetter",
        "path": "UserAppointmentLetter",
        "active": false
      },
      {
        "icon": "fas fa-tasks text-blue-500",
        "label": "Assigned Projects",
        "name": "UserAssignedProjects",
        "path": "MyProjects",
        "active": false
      },
      {
        "icon": "fas fa-chart-bar text-purple-500",
        "label": "Submit Analysis",
        "name": "UserAnalysisSubmissions",
        "path": "UserAnalyses",
        "active": false
      },
      {
        "icon": "fas fa-envelope text-orange-500",
        "label": "Submit Request",
        "name": "UserRequests",
        "path": "MyRequests",
        "active": false
      },
      {
        "icon": "fas fa-clock text-yellow-600",
        "label": "Extend Request",
        "name": "UserExtensionRequests",
        "path": "UserExtentions",
        "active": false
      }
    ]
  },
  {
    "icon": "fas fa-file-invoice text-teal-500",
    "label": "Receipts",
    "name": "ReceiptsManagement",
    "active": false,
    "children": [
      {
        "icon": "fas fa-upload text-yellow-500",
        "label": "Submit Receipt",
        "name": "UserSubmitReceipt",
        "path": "SubmitReceipt",
        "active": false
      },
      {
        "icon": "fas fa-search text-blue-500",
        "label": "Manage Receipts",
        "name": "UserManageReceipts",
        "path": "Myreceipts",
        "active": false
      }
    ]
  },
  {
    "icon": "fas fa-file-upload text-green-500",
    "label": "Updates",
    "name": "UpdatesManagement",
    "active": false,
    "children": [
      {
        "icon": "fas fa-plus text-yellow-500",
        "label": "Create Update",
        "name": "UserCreateUpdate",
        "path": "SubmitUpdate",
        "active": false
      },
      {
        "icon": "fas fa-eye text-blue-500",
        "label": "Manage Updates",
        "name": "UserManageUpdates",
        "path": "UserUpdates",
        "active": false
      }
    ]
  },
  {
    "icon": "fas fa-calendar-alt text-indigo-500",
    "label": "Meetings",
    "name": "MeetingsManagement",
    "active": false,
    "children": [
      {
        "icon": "fas fa-plus text-purple-500",
        "label": "Create Attendance",
        "name": "UserCreateAttendance",
        "path": "MyAttendance",
        "active": false
      },
      {
        "icon": "fas fa-plus text-green-500",
        "label": "Create Minutes",
        "name": "UserCreateMinutes",
        "path": "MeetingMenutes",
        "active": false
      }
    ]
  },
{ icon: 'fas fa-ellipsis-h text-gray-500',
 label: 'Others',
  name: 'Others',
   path: 'Others',
    style: { fontFamily: 'Roboto' } 
}
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
