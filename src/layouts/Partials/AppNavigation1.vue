
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
      path: "Dashboard",
      active: false,
  },
  {},
  {
      icon: 'fas fa-user-cog text-red-500',
      label: 'Users & Departments',
      name: 'ManageRoles',
      active: false,
      children: [
          {
              icon: 'fas fa-users text-yellow-500',
              label: 'Manage Roles',
              name: 'Roles',
              path: 'Roles',
              active: false,
          },
          {
              icon: 'fas fa-users-cog text-purple-500',
              label: 'Manage Users',
              name: 'AllUsers',
              path: 'AllUsers',
              active: false,
          },
          {
              icon: 'fas fa-tasks text-blue-500',
              label: 'Manage Departments',
              name: 'Departments',
              path: 'Departments',
              active: false,
          },
          {
  icon: 'fas fa-user-clock text-red-500', 
  label: 'User Logs',
  name: 'AuditTrail',
  path: 'AuditTrail',
  active: false,
}


          
      ],
  },

  {
    icon: "fas fas fa-file-contract text-yellow-400",  // Changed to a clipboard icon for management
    label: "Tenders",
    name: "Tenders Management",
    active: false,
    children: [
        { 
            icon: "fas fa-pen-square text-blue-500",  // Changed to a pencil square for registration
            label: "Registered Tender",
            name: "AdminGetTenders", 
            path: "AdminGetTenders",
            active: false,
        },
        { 
            icon: "fas fa-tasks text-blue-500",  // Changed to tasks for assignment
            label: "Assigned Tender",
            name: " AdminViewAssignedTenders",
            path: " AdminViewAssignedTenders",
            active: false,
        },
        { 
            icon: "fas fa-folder-open text-green-500",  // Eye icon remains appropriate for viewing
            label: "Submitted Tenders",
            name: "AdminViewSubmittedTenders",
            path: "AdminViewSubmittedTenders",
            active: false,
        },
    ],
},

{
        "icon": "fas fa-trophy text-yellow-400",  // Trophy for awards, yellow for achievement
        "label": "Awards",
        "name": "Awards",
        "active": false,
        "children": [
            { 
                "icon": "fas fa-lightbulb text-orange-500",  // Lightbulb for ideas/intention, orange for creativity
                "label": "Intentions to Award",
                "name": "AdminViewIntentions", 
                "path": "AdminViewIntentions",
                "active": false
            },
            { 
                "icon": "fas fa-envelope text-purple-500",  // Envelope for letters, purple for communication
                "label": "Awarding Letters",
                "name": "AdminViewAwardedLetters",
                "path": "AdminViewAwardedLetters",
                "active": false
            }
        ]
    },
    {
        "icon": "fas fa-chart-line text-red-400",  // Chart line for performances, red for impact
        "label": "Performances",
        "name": "Performances",
        "active": false,
        "children": [
            { 
                "icon": "fas fa-shield-alt text-teal-500",  // Shield for insurance bond, teal for protection
                "label": "Insurance Bonds",
                "name": "AdminViewInsuranceBond", 
                "path": "AdminViewInsuranceBond",
                "active": false
            },
            { 
                "icon": "fas fa-lock text-indigo-500",  // Lock for security declaration, indigo for trust
                "label": "Security Declarations",
                "name": "AdminViewSecurityDeclaration",
                "path": "AdminViewSecurityDeclaration",
                "active": false
            },
           
        ]
    },

    {
      icon: "text-silver-300 fas fa-dollar-sign",
      label: "Quotations",
      name: "ProjectRequests",
      active: false,
      children: [
      {
    icon: "fas fa-check-circle text-green-500",
    label: "Approve Quotation",
    name: "AdminManageSchedule",
    path: "AdminManageSchedule",
    active: false
}
      ],
  },
  {
        icon: "fas fa-project-diagram text-teal-500",
        label: "Projects",
        name: "Projects Management",
        active: false,
        children: [
          
        {
    icon: "fas fa-envelope text-blue-600",
    label: "Send Appointment Letter",
    name: "AppointmentLetters",
    path: "AppointmentLetters",
    active: false
  },
  {
    icon: "fas fa-project-diagram text-indigo-600",
    label: "Assign Projects",
    name: "AllAssignedProjects",
    path: "AllAssignedProjects",
    active: false
  },
   {
    icon: "fas fa-project-diagram text-indigo-600",
    label: "Project Portofolio",
    name: "AdminViewProjectPortofolio",
    path: "AdminViewProjectPortofolio",
    active: false
  },
  {
    icon: "fas fa-check-circle text-green-600",
    label: "Approve Analyses",
    name: "Analyses",
    path: "Analyses",
    active: false
  },
  {
    icon: "fas fa-thumbs-up text-teal-600",
    label: "Requests",
    name: "AdminViewProjectRequests",
    path: "AdminViewProjectRequests",
    active: false
  },
  {
    icon: "fas fa-hourglass-half text-purple-600",
    label: "Extensions for Requests",
    name: "Extentions",
    path: "Extentions",
    active: false
  },
  {
    icon: "fas fa-clock text-orange-600",
    label: "Extend Project Timeline",
    name: "ExtendedProjects",
    path: "ExtendedProjects",
    active: false
  }
        ],
    },


  
  {
      icon: "fas fa-clipboard-list text-red-500",  // Clipboard icon for management
      label: "Print Reports Here",
      name: "Tenders Management",
      active: false,
      children: [
          { 
              icon: "fas fa-print text-blue-500",  // Changed to a print icon for printing registered tenders
              label: " Registered Tenders",
              name: "TendersReport", 
              path: "TendersReport",
              active: false,
          },
          { 
            icon: "fas fa-print text-blue-500",  // Changed to tasks for assignment
            label: "Assigned Tender",
            name: "ReportForAssignsTenders",
            path: "ReportForAssignsTenders",
            active: false,
        },
        { 
            icon: "fas fa-print text-green-500",  // Eye icon remains appropriate for viewing
            label: "Submitted Tenders",
            name: "ReportForTenderDocuSubmission",
            path: "ReportForTenderDocuSubmission",
            active: false,
        },
        { 
                "icon": "fas fa-print text-orange-500",  // Lightbulb for ideas/intention, orange for creativity
                "label": "Intentions to Award",
                "name": "IntentionToAwardsReport", 
                "path": "IntentionToAwardsReport",
                "active": false
            },
            { 
                "icon": "fas fa-print text-purple-500",  // Envelope for letters, purple for communication
                "label": "Awarding Letters",
                "name": "AwardLettersReport",
                "path": "AwardLettersReport",
                "active": false
            },
            { 
                "icon": "fas fa-print text-teal-500",  // Shield for insurance bond, teal for protection
                "label": "Insurance Bonds",
                "name": "InsuranceBondReport", 
                "path": "InsuranceBondReport",
                "active": false
            },
            { 
                "icon": "fas fa-print text-indigo-500",  // Lock for security declaration, indigo for trust
                "label": "Security Declarations",
                "name": "SecurityDeclaREports",
                "path": "SecurityDeclaReports",
                "active": false
            },
          { 
              icon: "fas fa-print text-yellow-500",  // Print icon for printing assigned projects
              label: "Projects",
              name: "ReportForProjects",
              path: "ReportForProjects",
              active: false,
          },
        
          { 
              icon: "fas fa-print text-brown-500",  // Invoice icon for printing submitted receipts
              label: "Submitted Receipts",
              name: "ReportForSubmittedReceipts",
              path: "ReportForSubmittedReceipts",
              active: false,
          },
          { 
              icon: "fas fa-print text-pink-500",  // Bullhorn for printing posted updates
              label: "Posted Updates",
              name: "ReportForUpdates",
              path: "ReportForUpdates",
              active: false,
          },
          { 
              icon: "fas fa-print text-blue-700",  // Calendar icon for printing attendance
              label: "Attendance",
              name: "AdminViewAttendance",
              path: "AdminViewAttendance",
              active: false,
          },
          { 
              icon: "fas fa-print text-green-700",  // File-alt icon for printing meeting minutes
              label: " Meeting Minutes",
              name: "AdminViewMinutes",
              path: "AdminViewMinutes",
              active: false,
          },
      ],
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







