
<template>
  <ul class="text-sm text-center" style="color:white; height: 780px; overflow-y: auto; background-color: #283747; font-family: 'cygre', sans-serif; font-size: 14px;">
    <li
      class="hover:text-dark-secondary hover:bg-dark-primary dark:hover:bg-dark-body"
      v-for="(navigation, index) in navigations"
      :key="navigation.name"
      :class="{ 'dark:bg-dark-body': isActive(navigation) "
    >
      <div class="cursor-pointer" @click="clickNavigation(navigation, index)">
        <div class="flex items-center py-3 pl-5 pr-2" :class="{ 'justify-between': hasChild(navigation) ">
          <div>
            <span>
              <i class="w-6 mr-3 shrink-0" :class="navigation.icon"></i>
            </span>
            <span>{{ navigation.label </span>
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
              <span>{{ child.label </span>
            </div>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { useRouter  from 'vue-router';
import { ref  from 'vue';

const router = useRouter();

const navigations = ref([
  {,
  {
    icon: "fas fa-chart-line text-blue-500",
    label: "Dashboard",
    name: "UserDashboard",
    path: "UserDashboard",
    active: false,
  ,
  {,
  {
    icon: "fas fa-file-contract text-yellow-500",
    label: "My Tenders",
    name: "Tenders",
    active: false,
    children: [
      {
        icon: "fas fa-tasks text-blue-500",
        label: "My Assigned Tenders",
        name: "MyTender",
        path: "MyTender",
        active: false,
      ,
      {
        icon: "fas fa-check-circle text-green-500",
        label: "Accept Tender",
        name: "AcceptTender",
        path: "AcceptTender",
        active: false,
      ,
      {
        icon: "fas fa-file-upload text-purple-500",
        label: "Submit Tender",
        name: "SubmitTender",
        path: "SubmitTender",
        active: false,
      ,
      {
        icon: "fas fa-folder-open text-orange-500",
        label: "My Submissions",
        name: "MySubmissions",
        path: "MySubmissions",
        active: false,
      ,
      {
        icon: "fas fa-trophy text-teal-500",
        label: "Awarded Tenders",
        name: "ViewAwaredTender",
        path: "ViewAwaredTender",
        active: false,
      
    ]
  ,
  {
    icon: "fas fa-project-diagram text-emerald-500",
    label: "My Projects",
    name: "Projects",
    active: false,
    children: [
      {
        icon: "fas fa-list text-blue-500",
        label: "My Projects",
        name: "MyProjects",
        path: "MyProjects",
        active: false,
      ,
      {
        icon: "fas fa-check-circle text-green-500",
        label: "Accept Project",
        name: "AcceptAssignedProject",
        path: "AcceptAssignedProject",
        active: false,
      ,
      {
        icon: "fas fa-chart-line text-purple-500",
        label: "Submit Activity",
        name: "SubmitActivity",
        path: "SubmitActivity",
        active: false,
      ,
      {
        icon: "fas fa-eye text-indigo-500",
        label: "Activity Details",
        name: "ActivityDetailsPage",
        path: "ActivityDetailsPage",
        active: false,
      
    ]
  ,
  {
    icon: "fas fa-dollar-sign text-amber-500",
    label: "Quotations",
    name: "Quotations",
    active: false,
    children: [
      {
        icon: "fas fa-plus-circle text-green-500",
        label: "Submit Quotation",
        name: "MySchedules",
        path: "MySchedules",
        active: false,
      ,
      {
        icon: "fas fa-plus text-blue-500",
        label: "Add Schedule",
        name: "AddShedule",
        path: "AddShedule",
        active: false,
      
    ]
  ,
  {
    icon: "fas fa-sync-alt text-cyan-500",
    label: "Updates",
    name: "Updates",
    active: false,
    children: [
      {
        icon: "fas fa-list text-blue-500",
        label: "My Updates",
        name: "UserUpdates",
        path: "UserUpdates",
        active: false,
      ,
      {
        icon: "fas fa-plus-circle text-green-500",
        label: "Submit Update",
        name: "SubmitUpdate",
        path: "SubmitUpdate",
        active: false,
      ,
      {
        icon: "fas fa-edit text-purple-500",
        label: "Edit Update",
        name: "EditUserUpdate",
        path: "EditUserUpdate",
        active: false,
      
    ]
  ,
  {
    icon: "fas fa-receipt text-orange-500",
    label: "Receipts",
    name: "Receipts",
    active: false,
    children: [
      {
        icon: "fas fa-folder-open text-blue-500",
        label: "My Receipts",
        name: "Myreceipts",
        path: "Myreceipts",
        active: false,
      ,
      {
        icon: "fas fa-plus-circle text-green-500",
        label: "Submit Receipt",
        name: "SubmitReceipt",
        path: "SubmitReceipt",
        active: false,
      
    ]
  ,
  {
    icon: "fas fa-calendar-check text-indigo-500",
    label: "Attendance",
    name: "Attendance",
    active: false,
    children: [
      {
        icon: "fas fa-list text-blue-500",
        label: "My Attendance",
        name: "MyAttendance",
        path: "MyAttendance",
        active: false,
      ,
      {
        icon: "fas fa-plus-circle text-green-500",
        label: "Create Attendance",
        name: "CreateAttendance",
        path: "CreateAttendance",
        active: false,
      
    ]
  ,
  {
    icon: "fas fa-file-alt text-purple-500",
    label: "Meeting Minutes",
    name: "Meetings",
    active: false,
    children: [
      {
        icon: "fas fa-list text-blue-500",
        label: "Meeting Minutes",
        name: "MeetingMenutes",
        path: "MeetingMenutes",
        active: false,
      ,
      {
        icon: "fas fa-plus-circle text-green-500",
        label: "Create Minutes",
        name: "CreateMenutes",
        path: "CreateMenutes",
        active: false,
      
    ]
  ,
  {
    icon: "fas fa-chart-bar text-teal-500",
    label: "Analyses",
    name: "Analyses",
    active: false,
    children: [
      {
        icon: "fas fa-plus-circle text-green-500",
        label: "Create Analysis",
        name: "CreateAnalyses",
        path: "CreateAnalyses",
        active: false,
      ,
      {
        icon: "fas fa-folder-open text-blue-500",
        label: "My Analyses",
        name: "UserAnalyses",
        path: "UserAnalyses",
        active: false,
      
    ]
  ,
  {
    icon: "fas fa-file-contract text-rose-500",
    label: "Requests",
    name: "Requests",
    active: false,
    children: [
      {
        icon: "fas fa-folder-open text-blue-500",
        label: "My Requests",
        name: "MyRequests",
        path: "MyRequests",
        active: false,
      ,
      {
        icon: "fas fa-plus-circle text-green-500",
        label: "Apply for Request",
        name: "ApplyForRequest",
        path: "ApplyForRequest",
        active: false,
      
    ]
  ,
  {
    icon: "fas fa-clock text-orange-500",
    label: "Extensions",
    name: "Extensions",
    active: false,
    children: [
      {
        icon: "fas fa-folder-open text-blue-500",
        label: "My Extensions",
        name: "UserExtentions",
        path: "UserExtentions",
        active: false,
      
    ]
  ,
  {
    icon: "fas fa-envelope text-purple-500",
    label: "Appointment Letters",
    name: "Appointments",
    active: false,
    children: [
      {
        icon: "fas fa-folder-open text-blue-500",
        label: "My Letters",
        name: "UserAppointmentLetter",
        path: "UserAppointmentLetter",
        active: false,
      ,
      {
        icon: "fas fa-check-circle text-green-500",
        label: "Accept Letter",
        name: "AcceptAppointmentLetter",
        path: "AcceptAppointmentLetter",
        active: false,
      
    ]
  ,
  {
    icon: "fas fa-user-circle text-gray-500",
    label: "Profile",
    name: "Profile",
    path: "UserProfile1",
    active: false,
  ,
  { icon: 'fas fa-ellipsis-h text-gray-500',
   label: 'Others',
    name: 'Others',
    path: 'Others',
    style: { fontFamily: 'Roboto'  
  ,
]);

const clickNavigation = (navigation, index) => {
  if (hasChild(navigation)) {
    // If the navigation has children, toggle its active state
    navigations.value.forEach((item, idx) => {
      // Close all other navigation menus
      if (idx !== index) item.active = false;
    );
    navigations.value[index].active = !navigations.value[index].active;
   else {
    // If no children, just navigate
    navigateToPath(navigation);
  
;

const navigateToPath = (navigation) => {
  // Navigate to the path of the clicked navigation item
  if (hasPath(navigation)) {
    router.push({ name: navigation.path );
  
;

const navigateToChild = (child) => {
  // Navigate to the path of the clicked child item
  if (hasPath(child)) {
    router.push({ name: child.path );
  
;

const hasPath = (navigation) => navigation.hasOwnProperty('path');
const hasChild = (navigation) => navigation.children && navigation.children.length > 0;
const isActive = (navigation) => navigation.active === true;
</script>

<style scoped>
/* Add a scrollbar style for better visibility */
ul::-webkit-scrollbar {
  width: 8px;


ul::-webkit-scrollbar-thumb {
  background: #555; /* Color of the scrollbar */
  border-radius: 10px; /* Rounded corners */


ul::-webkit-scrollbar-thumb:hover {
  background: #888; /* Color on hover */


/* Hover and active styles */
.text-secondary {
  color: #B3B3B3;


.hover\:text-dark-secondary:hover {
  color: #FFFFFF;


.hover\:bg-dark-primary:hover {
  background-color: #3B3B3B;


.dark\:hover\:bg-dark-body:hover {
  background-color: #2C2C2C;


.hover\:text-darken-secondary:hover {
  color: #E6E6E6;


.hover\:bg-darken-primary:hover {
  background-color: #4B4B4B;


/* Ensure scrollability works in nested lists */
ul {
  max-height: 780px;
  overflow-y: auto;

            label: "Submitted Tenders",
            name: "ReportForTenderDocuSubmission",
            path: "ReportForTenderDocuSubmission",
            active: false,
        ,
```
                "icon": "fas fa-print text-orange-500",  // Lightbulb for ideas/intention, orange for creativity
                "label": "Intentions to Award",
                "name": "IntentionToAwardsReport", 
                "path": "IntentionToAwardsReport",
                "active": false
            ,
            { 
                "icon": "fas fa-print text-purple-500",  // Envelope for letters, purple for communication
                "label": "Awarding Letters",
                "name": "AwardLettersReport",
                "path": "AwardLettersReport",
                "active": false
            ,
            { 
                "icon": "fas fa-print text-teal-500",  // Shield for insurance bond, teal for protection
                "label": "Insurance Bonds",
                "name": "InsuranceBondReport", 
                "path": "InsuranceBondReport",
                "active": false
            ,
            { 
                "icon": "fas fa-print text-indigo-500",  // Lock for security declaration, indigo for trust
                "label": "Security Declarations",
                "name": "SecurityDeclaREports",
                "path": "SecurityDeclaReports",
                "active": false
            ,
          { 
              icon: "fas fa-print text-yellow-500",  // Print icon for printing assigned projects
              label: "Projects",
              name: "ReportForProjects",
              path: "ReportForProjects",
              active: false,
          ,
        
          { 
              icon: "fas fa-print text-brown-500",  // Invoice icon for printing submitted receipts
              label: "Submitted Receipts",
              name: "ReportForSubmittedReceipts",
              path: "ReportForSubmittedReceipts",
              active: false,
          ,
          { 
              icon: "fas fa-print text-pink-500",  // Bullhorn for printing posted updates
              label: "Posted Updates",
              name: "ReportForUpdates",
              path: "ReportForUpdates",
              active: false,
          ,
          { 
              icon: "fas fa-print text-blue-700",  // Calendar icon for printing attendance
              label: "Attendance",
              name: "AdminViewAttendance",
              path: "AdminViewAttendance",
              active: false,
          ,
          { 
              icon: "fas fa-print text-green-700",  // File-alt icon for printing meeting minutes
              label: " Meeting Minutes",
              name: "AdminViewMinutes",
              path: "AdminViewMinutes",
              active: false,
          ,
      ],
  ,
  { icon: 'fas fa-ellipsis-h text-gray-500',
   label: 'Others',
    name: 'Others',
     path: 'Others',
      style: { fontFamily: 'Roboto'  
  ,
]);

const clickNavigation = (navigation, index) => {
  if (hasChild(navigation)) {
    // If the navigation has children, toggle its active state
    navigations.value.forEach((item, idx) => {
      // Close all other navigation menus
      if (idx !== index) item.active = false;
    );
    navigations.value[index].active = !navigations.value[index].active;
   else {
    // If no children, just navigate
    navigateToPath(navigation);
  
;

const navigateToPath = (navigation) => {
  // Navigate to the path of the clicked navigation item
  if (hasPath(navigation)) {
    router.push({ name: navigation.path );
  
;

const navigateToChild = (child) => {
  // Navigate to the path of the clicked child item
  if (hasPath(child)) {
    router.push({ name: child.path );
  
;

const hasPath = (navigation) => navigation.hasOwnProperty('path');
const hasChild = (navigation) => navigation.children && navigation.children.length > 0;
const isActive = (navigation) => navigation.active === true;
</script>

<style scoped>
/* Add a scrollbar style for better visibility */
ul::-webkit-scrollbar {
  width: 8px;


ul::-webkit-scrollbar-thumb {
  background: #555; /* Color of the scrollbar */
  border-radius: 10px; /* Rounded corners */


ul::-webkit-scrollbar-thumb:hover {
  background: #888; /* Color on hover */


/* Hover and active styles */
.text-secondary {
  color: #B3B3B3;


.hover\:text-dark-secondary:hover {
  color: #FFFFFF;


.hover\:bg-dark-primary:hover {
  background-color: #3B3B3B;


.dark\:hover\:bg-dark-body:hover {
  background-color: #2C2C2C;


.hover\:text-darken-secondary:hover {
  color: #E6E6E6;


.hover\:bg-darken-primary:hover {
  background-color: #4B4B4B;


/* Ensure scrollability works in nested lists */
ul {
  max-height: 780px;
  overflow-y: auto;


ul > li {
  overflow: hidden; /* Ensures submenus behave properly */

</style>







