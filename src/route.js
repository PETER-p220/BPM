import { createRouter, createWebHistory } from "vue-router";
import AuthLayout from '@layouts/Auth.vue';
import AuthLayout1 from '@layouts/Auth1.vue';
import AuthLayout2 from '@layouts/Auth2.vue';
import AuthLayout3 from '@layouts/Auth3.vue';
import AuthLayout4 from '@layouts/Auth4.vue';
import AuthLayout5 from '@layouts/Auth5.vue';
import GuestLayout from '@layouts/Guest.vue';
import ErrorLayout from '@layouts/Error.vue';

import Login from '@components/Pages/Login.vue';
import Register from '@components/Pages/Register.vue';
import Password from '@components/Pages/Password.vue';
import Dashboard from '@components/Pages/Dashboard.vue';
import Table from '@components/Pages/Table.vue';
import Form from '@components/Pages/Form.vue';
import Card from '@components/Pages/Card.vue';
import Error404 from '@components/Pages/Error404.vue';
import ResetPasswordRequest from '@layouts/ResetPasswordRequest.vue';
import ResetPasswordPage from '@layouts/ResetPasswordPage.vue';
import UserProfile from '@layouts/UserProfile.vue';
import UserProfile1 from '@layouts/UserProfile1.vue';
import AllUsers from '@layouts/users/AllUsers.vue';
import AddUser from '@layouts/users/AddUser.vue';
import EditUser from '@layouts/users/EditUser.vue';
import AuditTrail from '@layouts/auditTrail/AuditTrail.vue';
import Roles from '@layouts/roles/Roles.vue';
import EditRole from '@layouts/roles/EditRole.vue';
import AddRole from '@layouts/roles/AddRole.vue';
import AllVenuesVue from "./layouts/venues/AllVenues.vue";
import AddVenueVue from "./layouts/venues/AddVenue.vue";
import EditVenueVue from "./layouts/venues/EditVenue.vue";
import BookingClientsVue from "./layouts/bookVenue/BookingClients.vue";
import EditBookingClientVue from "./layouts/bookVenue/EditBookingClient.vue";
import AllordersVue from "./layouts/orders/Allorders.vue";
import EditorderVue from "./layouts/orders/Editorder.vue";
import UserDashboardVue from "@components/Pages/UserDashboard.vue";
import EditEventVue from "./layouts/events/EditEvent.vue";
import AllEventsVue from "./layouts/events/AllEvents.vue";
import InviteesVue from "./layouts/invitees/Invitees.vue";
import CardsVue from "./layouts/cards/Cards.vue";
import AddCardVue from "./layouts/cards/AddCard.vue";
import EditCardVue from "./layouts/cards/EditCard.vue";
import EditExpenseVue from "./layouts/expenses/EditExpense.vue";
import ExpensesVue from "./layouts/expenses/Expenses.vue";
import AllPaymentsVue from "./layouts/allpayments/AllPayments.vue";
import AddNewPaymentVue from "./layouts/allpayments/AddNewPayment.vue";
import EditNewPaymentVue from "./layouts/allpayments/EditNewPayment.vue";
import TendersDashboard from "./components/Pages/TendersDashboard.vue";
import UserProfile2 from "./layouts/UserProfile2.vue";
import UserProfile3 from "./layouts/UserProfile3.vue";
import HodDashboard from "./components/Pages/HodDashboard.vue";
import DepartmentsVue from "./layouts/department/Departments.vue";
import CreateDepartmentVue from "./layouts/department/CreateDepartment.vue";
import EditDepartmentVue from "./layouts/department/EditDepartment.vue";
import TendersVue from "./layouts/tenders/Tenders.vue";
import CreateTenderVue from "./layouts/tenders/CreateTender.vue";
import EditTenderVue from "./layouts/tenders/EditTender.vue";
import AllAssignedTendersVue from "./layouts/assignTenders/AllAssignedTenders.vue";
import AssignTenderVue from "./layouts/assignTenders/AssignTender.vue";
import EditAssignedTenderVue from "./layouts/assignTenders/EditAssignedTender.vue";
import MyTenderVue from "./layouts/assignTenders/MyTender.vue";
import AcceptTenderVue from "./layouts/assignTenders/AcceptTender.vue";
import HodTendersVue from "./layouts/assignTenders/HodTenders.vue";
import MySubmissionsVue from "./layouts/tenderSubmissions/MySubmissions.vue";
import SubmitTenderVue from "./layouts/tenderSubmissions/SubmitTender.vue";
import TendersDocSubmissionVue from "./layouts/tenderSubmissions/TendersDocSubmission.vue";
import AcceptSubmissionVue from "./layouts/tenderSubmissions/AcceptSubmission.vue";
import AllAssignedProjectsVue from "./layouts/assignProjects/AllAssignedProjects.vue";
import AssignProjectVue from "./layouts/assignProjects/AssignProject.vue";
import EditAssignedProjectVue from "./layouts/assignProjects/EditAssignedProject.vue";
import HodViewProjectsVue from "./layouts/assignProjects/HodViewProjects.vue";
import ApproveAssignedProjectVue from "./layouts/assignProjects/ApproveAssignedProject.vue";
import MyProjectsVue from "./layouts/assignProjects/MyProjects.vue";
import AcceptAssignedProjectVue from "./layouts/assignProjects/AcceptAssignedProject.vue";
import MyRequestsVue from "./layouts/requests/MyRequests.vue";
import ApplyForRequestVue from "./layouts/requests/ApplyForRequest.vue";
import EditRequestForProjectVue from "./layouts/requests/EditRequestForProject.vue";
import AllRequestsVue from "./layouts/requests/ApproveAllRequests.vue";
import AccountantDashbaordVue from "./components/Pages/AccountantDashbaord.vue";
import UserProfile4Vue from "./layouts/UserProfile4.vue";
import ApproveRequestVue from "./layouts/requests/ApproveRequest.vue";
import SubmitActivityVue from "./layouts/project_activities/SubmitActivity.vue";
import ActivityDetailsPageVue from "./layouts/project_activities/ActivityDetailsPage.vue";
import HodApproveActivityVue from "./layouts/project_activities/HodApproveActivity.vue";
import ApproveActivityVue from "./layouts/project_activities/ApproveActivity.vue";
import UserUpdatesVue from "./layouts/allUpdates/UserUpdates.vue";
import SubmitUpdateVue from "./layouts/allUpdates/SubmitUpdate.vue";
import EditUserUpdateVue from "./layouts/allUpdates/EditUserUpdate.vue";
import HodViewUpdateVue from "./layouts/allUpdates/HodViewUpdate.vue";
import HodSubmitUpdateVue from "./layouts/allUpdates/HodSubmitUpdate.vue";
import HodEditUpdateVue from "./layouts/allUpdates/HodEditUpdate.vue";
import TenderUserViewUpdatesVue from "./layouts/allUpdates/TenderUserViewUpdates.vue";
import TenderUserSubmitUpdatesVue from "./layouts/allUpdates/TenderUserSubmitUpdates.vue";
import TenderUserEditUpdatesVue from "./layouts/allUpdates/TenderUserEditUpdates.vue";
import AccntantViewUpdateVue from "./layouts/allUpdates/AccntantViewUpdate.vue";
import AccntantEditUpdateVue from "./layouts/allUpdates/AccntantEditUpdate.vue";
import AccntantSubmitUpdateVue from "./layouts/allUpdates/AccntantCreateUpdate.vue";
import MySchedulesVue from "./layouts/priceshedules/MySchedules.vue";
import AddSheduleVue from "./layouts/priceshedules/AddShedule.vue";
import ManageAwardedTenders from "./layouts/awardedtenders/ManageAwardedTenders.vue";
import CreateAwardedTender from "./layouts/awardedtenders/CreateAwardedTender.vue";
import EditAwardedTender from "./layouts/awardedtenders/EditAwardedTender.vue";
import Myreceipts from "./layouts/receipts/Myreceipts.vue";
import SubmitReceipt from "./layouts/receipts/SubmitReceipt.vue";
import MyAttendance from "./layouts/attendance/MyAttendance.vue";
import CreateAttendance from "./layouts/attendance/CreateAttendance.vue";
import MeetingMenutes from "./layouts/meetingMenutes/MeetingMenutes.vue";
import CreateMenutes from "./layouts/meetingMenutes/CreateMenutes.vue";
import ViewAwaredTender from "./layouts/awardedtenders/ViewAwaredTender.vue";
import AdminGetTenders from "./layouts/tenders/AdminGetTenders.vue";
import AdminCreateTender from "./layouts/tenders/AdminCreateTender.vue";
import AdminEditTender from "./layouts/tenders/AdminEditTender.vue";
import AdminassignTender from "./layouts/assignTenders/AdminassignTender.vue";
import AdminViewAssignedTenders from "./layouts/assignTenders/AdminViewAssignedTenders.vue";
import AdminEditAssignedTender from "./layouts/assignTenders/AdminEditAssignedTender.vue";
import AdminViewSubmittedTenders from "./layouts/tenderSubmissions/AdminViewSubmittedTenders.vue";
import AdminEditAwardedTender from "./layouts/awardedtenders/AdminEditAwardedTender.vue";
import AdminCreateAwardedTender from "./layouts/awardedtenders/AdminCreateAwardedTender.vue";
import AdminManageAwardedTenders from "./layouts/awardedtenders/AdminManageAwardedTenders.vue";
import AdminViewProjectRequests from "./layouts/requests/AdminViewProjectRequests.vue";
import AdminApproveRequest from "./layouts/requests/AdminApproveRequest.vue";
import AdminAssignProjectToUser from "./layouts/assignProjects/AdminAssignProjectToUser.vue";
import AdminViewAssignedProjects from "./layouts/assignProjects/AdminViewAssignedProjects.vue";
import AdminEditAssignedProject from "./layouts/assignProjects/AdminEditAssignedProject.vue";
import AdminViewALlProjectActivities from "./layouts/project_activities/ViewProjectActivities.vue";
import AdminGetActivityDetailsPage from "./layouts/project_activities/AdminGetActivityDetailsPage.vue";
import CreateReceipt from "./layouts/receipts/CreateReceipt.vue";
import AdminGetAllreceipts from "./layouts/receipts/AdminGetAllreceipts.vue";
import AdminGetUpdates from "./layouts/allUpdates/AdminGetUpdates.vue";
import AdminCreateUpdate from "./layouts/allUpdates/AdminCreateUpdate.vue";
import AdminEditUpdate from "./layouts/updates/AdminEditUpdate.vue";
import AdminPostedEditUpdate from "./layouts/allUpdates/AdminPostedEditUpdate.vue";
import AdminViewAttendance from "./layouts/attendance/AdminViewAttendance.vue";
import AdminViewMinutes from "./layouts/meetingMenutes/AdminViewMinutes.vue";
import TenderUserViewActivity from "./layouts/project_activities/TenderUserViewActivity.vue";
import TenderUserViewActivityDetail from "./layouts/project_activities/TenderUserViewActivityDetail.vue";
import AdminViewAllProjectActivities from "./layouts/project_activities/AdminViewAllProjectActivities.vue";
import TenderUserVGetAllReceipts from "./layouts/receipts/TenderUserVGetAllReceipts.vue";
import TenderUserViewAttendance from "./layouts/attendance/TenderUserViewAttendance.vue";
import TenderUserViewMinutes from "./layouts/meetingMenutes/TenderUserViewMinutes.vue";
import TenderUserGetALlRequests from "./layouts/requests/TenderUserGetALlRequests.vue";
import AccntntCreateAttendance from "./layouts/attendance/AccntntCreateAttendance.vue";
import AccountantGetAttendance from "./layouts/attendance/AccountantGetAttendance.vue";
import AccontntGetMinutes from "./layouts/meetingMenutes/AccontntGetMinutes.vue";
import AccontntCreateUpdate from "./layouts/meetingMenutes/AccontntCreateUpdate.vue";
import AccntntGetALlReceipts from "./layouts/receipts/AccntntGetALlReceipts.vue";
import HodGetAllRequests from "./layouts/requests/HodGetAllRequests.vue";
import HodCreateAttendance from "./layouts/attendance/HodCreateAttendance.vue";
import HodManageAllAttendance from "./layouts/attendance/HodManageAllAttendance.vue";
import HodGetMinutes from "./layouts/meetingMenutes/HodGetMinutes.vue";
import HodCreateUpdate from "./layouts/meetingMenutes/HodCreateUpdate.vue";
import HodViewSubmittedTenders from "./layouts/tenderSubmissions/HodViewSubmittedTenders.vue";
import HodViewAwardedTenders from "./layouts/awardedtenders/HodViewAwardedTenders.vue";
import AdminManageSchedule from "./layouts/priceshedules/AdminManageSchedule.vue";
import ApproveScedule from "./layouts/priceshedules/ApproveRejectSchedule.vue";
import ApproveSchedule from "./layouts/priceshedules/ApproveRejectSchedule.vue";
import ApproveRejectSchedule from "./layouts/priceshedules/ApproveRejectSchedule.vue";
import ViewRequests from "./layouts/requests/ViewRequests.vue";
import ApproveAllRequests from "./layouts/requests/ApproveAllRequests.vue";
import AccntantCreateUpdate from "./layouts/allUpdates/AccntantCreateUpdate.vue";
import TendersReport from "./layouts/tenders/TendersReport.vue";
import ReportForAssignsTenders from "./layouts/assignTenders/ReportForAssignsTenders.vue";
import ReportForTenderDocuSubmission from "./layouts/tenderSubmissions/ReportForTenderDocuSubmission.vue";
import ReportForProjects from "./layouts/assignProjects/ReportForProjects.vue";
import ReportForReceipts from "./layouts/receipts/ReportForSubmittedReceipts.vue";
import ReportForSbumittedReceipts from "./layouts/receipts/ReportForSubmittedReceipts.vue";
import ReportForSubmittedReceipts from "./layouts/receipts/ReportForSubmittedReceipts.vue";
import ReportForUpdates from "./layouts/allUpdates/ReportForUpdates.vue";
import GoogleCallback from "./components/Pages/GoogleCallback.vue";
import CreateIntentioToAward from "./layouts/awards/createIntentioToAward.vue";
import ViewIntentionToAwards from "./layouts/awards/ViewIntentionToAwards.vue";
import CreateAwardLetter from "./layouts/awards/createAwardLetter.vue";
import ViewAwardLetter from "./layouts/awards/ViewAwardLetter.vue";
import CreateInsuranceBond from "./layouts/perfomances/createInsuranceBond.vue";
import InsuranceBond from "./layouts/perfomances/insuranceBond.vue";
import SecurityDeclaration from "./layouts/perfomances/securityDeclaration.vue";
import CreateSecurityDeclaration from "./layouts/perfomances/createSecurityDeclaration.vue";
import AdminViewIntentions from "./layouts/awards/AdminViewIntentions.vue";
import AdminViewAwardedLetters from "./layouts/awards/AdminViewAwardedLetters.vue";
import AdminViewSecurityDeclaration from "./layouts/perfomances/AdminViewSecurityDeclaration.vue";
import AdminViewInsuranceBond from "./layouts/perfomances/AdminViewInsuranceBond.vue";
import AppointmentLetters from "./layouts/appointmentLetter/AppointmentLetters.vue";
import CreateAppointmentLetter from "./layouts/appointmentLetter/CreateAppointmentLetter.vue";
import AcceptAppointmentLetter from "./layouts/appointmentLetter/AcceptAppointmentLetter.vue";
import UserAppointmentLetter from "./layouts/appointmentLetter/UserAppointmentLetter.vue";
import Analyses from "./layouts/analyses/Analyses.vue";
import ApproveAnalyses from "./layouts/analyses/ApproveAnalyses.vue";
import CreateAnalyses from "./layouts/analyses/CreateAnalyses.vue";
import UserAnalyses from "./layouts/analyses/UserAnalyses.vue";
import UserExtentions from "./layouts/extend-request/UserExtentions.vue";
import CreateExtention from "./layouts/extend-request/CreateExtention.vue";
import Extentions from "./layouts/extend-request/Extentions.vue";
import ExtendedProjects from "./layouts/extend-projectTime/ExtendedProjects.vue";
import ExtendProject from "./layouts/extend-projectTime/ExtendProject.vue";
import IntentionToAwardsReport from "./layouts/awards/IntentionToAwardsReport.vue";
import AwardLettersReport from "./layouts/attendance/awardLettersReport.vue";
import InsuranceBondReport from "./layouts/perfomances/InsuranceBondReport.vue";
import SecurityDeclaREports from "./layouts/perfomances/securityDeclaREports.vue";
import HrtDashbaord from "./components/Pages/HrDashbaord.vue";
import HrDashbaord from "./components/Pages/HrDashbaord.vue";
import UserProfile5 from "./layouts/UserProfile5.vue";
import ManageContracts from "./layouts/contracts/ManageContracts.vue";
import EditContract from "./layouts/contracts/EditContract.vue";
import RegisterContract from "./layouts/contracts/RegisterContract.vue";
import HrManageProject from "./layouts/assignProjects/HrManageProject.vue";
import HrAssignProject from "./layouts/assignProjects/HrAssignProject.vue";
import HrEditProject from "./layouts/assignProjects/HrEditProject.vue";
import HrViewReisteredTenders from "./layouts/tenders/HrViewReisteredTenders.vue";
import HrViewSubmittedTenders from "./layouts/tenderSubmissions/HrViewSubmittedTenders.vue";
import MyPortofolio from "./layouts/assignProjects/ProjectPortofolio.vue";
import ProjectPortofolio from "./layouts/assignProjects/ProjectPortofolio.vue";
import HrViewExtentions from "./layouts/requests/HrViewExtentions.vue";
import HrViewProjectRequests from "./layouts/requests/HrViewProjectRequests.vue";
import AdminViewProjectPortofolio from "./layouts/assignProjects/AdminViewProjectPortofolio.vue";
import AccViewPortofolio from "./layouts/assignProjects/AccViewPortofolio.vue";
import AccViewAnalysis from "./layouts/analyses/AccViewAnalysis.vue";
import Followup from "./layouts/assignProjects/Followup.vue";
import UpdateFollowup from "./layouts/assignProjects/UpdateFollowup.vue";
import AccManageRequests from "./layouts/requests/AccManageRequests.vue";
import AccManageExtendedRequests from "./layouts/extend-request/AccManageExtendedRequests.vue";

const baseURL = '/';

const routes = [
    {
        path: '/',
        redirect: { name: 'Login' },
    },
    // ADMIN LAYOUT (role_id: 1)
    {
        path: '/',
        name: 'Auth',
        component: AuthLayout,
        meta: { allowedRoles: [1] },
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: Dashboard,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'profile',
                name: 'UserProfile',
                component: UserProfile,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'users',
                name: 'AllUsers',
                component: AllUsers,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'add-user',
                name: 'AddUser',
                component: AddUser,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/edit-user/:user_id',  
                name: 'EditUser',
                component: EditUser,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'audit-trail',
                name: 'AuditTrail',
                component: AuditTrail,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'roles',
                name: 'Roles',
                component: Roles,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'add-role',
                name: 'AddRole',
                component: AddRole,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/edit-role/:role_id',
                name: 'EditRole',
                component: EditRole,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'departments',
                name: 'Departments',
                component: DepartmentsVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'create-department',
                name: 'CreateDepartments',
                component: CreateDepartmentVue,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/edit-department/:department_id',
                name: 'EditDepartment',
                component: EditDepartmentVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'venues',
                name: 'Venues',
                component: AllVenuesVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'add-venue',
                name: 'AddVenue',
                component: AddVenueVue,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/edit-venue/:venue_id',
                name: 'EditVenue',
                component: EditVenueVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'requests',
                name: 'BookingClients',
                component: BookingClientsVue,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/edit-book/:book_id',
                name: 'EditBookingClient',
                component: EditBookingClientVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'orders',
                name: 'Orders',
                component: AllordersVue,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/edit-order/:order_id',
                name: 'Editorder',
                component: EditorderVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/events',
                name: 'AllEvents',
                component: AllEventsVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/invitees',
                name: 'Invitees',
                component: InviteesVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'all-payments',
                name: 'AllPayments',
                component: AllPaymentsVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/addnewpayment',
                name: 'AddNewPayment',
                component: AddNewPaymentVue,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/edit/payment/:payment_id',
                name: 'EditNewPayment',
                component: EditNewPaymentVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'cards',
                name: 'Cards',
                component: CardsVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'add-card',
                name: 'AddCard',
                component: AddCardVue,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/edit-card/:card_id',
                name: 'EditCard',
                component: EditCardVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'expenses',
                name: 'Expenses',
                component: ExpensesVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/edit-expenses/:request_id',
                name: 'EditExpense',
                component: EditExpenseVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'adminview-createtender',
                name: 'AdminCreateTender',
                component: AdminCreateTender,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'adminview-tenders',
                name: 'AdminGetTenders',
                component: AdminGetTenders,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/admin/edit-tender/:tender_id',
                name: 'AdminEditTender',
                component: AdminEditTender,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'admin-assigntender',
                name: 'AdminassignTender',
                component: AdminassignTender,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'adminview-assignedtenders',
                name: 'AdminViewAssignedTenders',
                component: AdminViewAssignedTenders,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/admin/edit-assignedtender/:assign_id',
                name: 'AdminEditAssignedTender',
                component: AdminEditAssignedTender,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'adminview-submittedtenders',
                name: 'AdminViewSubmittedTenders',
                component: AdminViewSubmittedTenders,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'admin-create-awardedtender',
                name: 'AdminCreateAwardedTender',
                component: AdminCreateAwardedTender,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'adminview-awardedtender',
                name: 'AdminManageAwardedTenders',
                component: AdminManageAwardedTenders,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/admin/edit-awardedtender/:award_id',
                name: 'AdminEditAwardedTender',
                component: AdminEditAwardedTender,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'adminview-projectsrequests',
                name: 'AdminViewProjectRequests',
                component: AdminViewProjectRequests,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/admin/approve-request/:request_id',
                name: 'AdminApproveRequest',
                component: AdminApproveRequest,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'adminview-assignedprojects',
                name: 'AdminViewAssignedProjects',
                component: AdminViewAssignedProjects,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'admin-assignproject',
                name: 'AdminAssignProjectToUser',
                component: AdminAssignProjectToUser,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/admin/assigned-project/:project_id',
                name: 'AdminEditAssignedProject',
                component: AdminEditAssignedProject,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'admin-view/projectActivities',
                name: 'AdminViewAllProjectActivities',
                component: AdminViewAllProjectActivities,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/edit/project-activity/:activity_id',
                name: 'AdminGetActivityDetailsPage',
                component: AdminGetActivityDetailsPage,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/assign-project',
                name: 'AdminAssignProjectToUser',
                component: AdminAssignProjectToUser,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/admin/create-receipt',
                name: 'CreateReceipt',
                component: CreateReceipt,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'admin-view/receipts',
                name: 'AdminGetAllreceipts',
                component: AdminGetAllreceipts,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'admin-view/updates',
                name: 'AdminGetUpdates',
                component: AdminGetUpdates,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'admin/create-update',
                name: 'AdminCreateUpdate',
                component: AdminCreateUpdate,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/admin-edit/update/:chat_id',
                name: 'AdminPostedEditUpdate',
                component: AdminPostedEditUpdate,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'admin/print-attendance',
                name: 'AdminViewAttendance',
                component: AdminViewAttendance,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'admin/print-minutes',
                name: 'AdminViewMinutes',
                component: AdminViewMinutes,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'all-schedules',
                name: 'AdminManageSchedule',
                component: AdminManageSchedule,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/approve/schedule/:schedule_id',
                name: 'ApproveRejectSchedule',
                component: ApproveRejectSchedule,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/view/all-requests',
                name: 'ViewRequests',
                component: ViewRequests,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path:'/tenders-report',
                name:'TendersReport',
                component: TendersReport,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path:'/report-for/assigned-tenders',
                name:'ReportForAssignsTenders',
                component: ReportForAssignsTenders,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path:'/report-for/assigned-tenders',
                name:'ReportForTenderDocuSubmission',
                component:ReportForTenderDocuSubmission,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path:'/report-for/projects',
                name:'ReportForProjects',
                component:ReportForProjects,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path:'/report-for/submittedreceipts',
                name:'ReportForSubmittedReceipts',
                component: ReportForSubmittedReceipts,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path:'/report-for/updates',
                name:'ReportForUpdates',
                component: ReportForUpdates,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path:'/view/tenders',
                name:'AdminGetTenders',
                component: AdminGetTenders,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path:'/view/assigned-tenders',
                name:' AdminViewAssignedTenders',
                component:  AdminViewAssignedTenders,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path:'/view/submitted-tenders',
                name:'AdminViewSubmittedTenders',
                component:  AdminViewSubmittedTenders,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path:'/view/intetions',
                name:'AdminViewIntentions',
                component:  AdminViewIntentions,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path:'/view/awarding-letters',
                name:'AdminViewAwardedLetters',
                component:  AdminViewAwardedLetters,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path:'/view/security-desclaration',
                name:'AdminViewSecurityDeclaration',
                component:   AdminViewSecurityDeclaration,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path:'/view/insurance-bond',
                name:'AdminViewInsuranceBond',
                component:  AdminViewInsuranceBond,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path:'/quotations',
                name:'AdminManageSchedule',
                component:  AdminManageSchedule,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path:'/create-appointment-letter',
                name:'CreateAppointmentLetter',
                component:  CreateAppointmentLetter,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path:'/appointment-letters',
                name:'AppointmentLetters',
                component:  AppointmentLetters,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path:'/assigned-projects',
                name:'AllAssignedProjects',
                component:AllAssignedProjectsVue,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path:'/assign-project',
                name:'AssignProject',
                component:AssignProjectVue,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/edit-assignedproject/:project_id',
                name: 'EditAssignedProject',
                component: EditAssignedProjectVue,  
                props: true,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path:'/analyses',
                name:'Analyses',
                component: Analyses,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/approve-analysis/:analysis_id',
                name:'ApproveAnalyses',
                component: ApproveAnalyses,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/all-requests',
                name:'AdminViewProjectRequests',
                component: AdminViewProjectRequests,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/all/extentions-for-project',
                name:'Extentions',
                component: Extentions,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/extended-project',
                name:'ExtendedProjects',
                component: ExtendedProjects,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/extend-project',
                name:'ExtendProject',
                component: ExtendProject,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/intention-reports',
                name:'IntentionToAwardsReport',
                component: IntentionToAwardsReport,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/insurance-bond/reports',
                name:'InsuranceBondReport',
                component: InsuranceBondReport,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/awards-reports',
                name:'AwardLettersReport',
                component:AwardLettersReport,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/s-declaration-reports',
                name:'SecurityDeclaReports',
                component: SecurityDeclaREports,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: '/project-portofolio',
                name:'AdminViewProjectPortofolio',
                component: AdminViewProjectPortofolio,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'table',
                name: 'Table',
                component: Table,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'form',
                name: 'Form',
                component: Form,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
            {
                path: 'card',
                name: 'Card',
                component: Card,
                meta: { requiresAuth: true, allowedRoles: [1] }
            },
        ],
    },

    // USER LAYOUT (role_id: 3)
    {
        path: '/',
        name: 'Auth1',
        component: AuthLayout1,
        meta: { allowedRoles: [3] },
        children: [
            {
                path: '/user/dashboard',
                name: 'UserDashboard',
                component: UserDashboardVue,
                meta: { requiresAuth: true, allowedRoles: [3] }
            },
            {
                path: 'userprofile',
                name: 'UserProfile1',
                component: UserProfile1,
                meta: { requiresAuth: true, allowedRoles: [3] }
            },
            {
                path: 'my-tender',
                name: 'MyTender',
                component: MyTenderVue,
                meta: { requiresAuth: true, allowedRoles: [3] }
            },
            {
                path: '/accept-tender/:assign_id',
                name: 'AcceptTender',
                component: AcceptTenderVue,  
                props: true,
                meta: { requiresAuth: true, allowedRoles: [3] }
            },
            {
                path: 'submitted-tenders',
                name: 'MySubmissions',
                component: MySubmissionsVue,
                meta: { requiresAuth: true, allowedRoles: [3] }
            },
            {
                path: '/submit/tender',
                name: 'SubmitTender',
                component: SubmitTenderVue,
                meta: { requiresAuth: true, allowedRoles: [3] }
            },
            {
                path: '/my/projects',
                name: 'MyProjects',
                component: MyProjectsVue,
                meta: { requiresAuth: true, allowedRoles: [3] }
            },
            {
                path: '/eccept/reject/:project_id',
                name: 'AcceptAssignedProject',
                component: AcceptAssignedProjectVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [3] }
            },
            {
                path:'/submit-activity',
                name:'SubmitActivity',
                component: SubmitActivityVue,
                props:true,
               meta: { requiresAuth: true, allowedRoles: [3] }
            },
            {
                path:'/activity-details/:activity_id',
                name:'ActivityDetailsPage',
                component: ActivityDetailsPageVue,
                props:true,
               meta: { requiresAuth: true, allowedRoles: [3] }
            },
            {
                path:'/user/update',
                name:'UserUpdates',
                component: UserUpdatesVue,
                props:true,
               meta: { requiresAuth: true, allowedRoles: [3] }
            },
            {
                path:'/submit-update',
                name:'SubmitUpdate',
                component: SubmitUpdateVue,
                props:true,
               meta: { requiresAuth: true, allowedRoles: [3] }
            },
            {
                path:'/edituser-update/:chat_id',
                name:'EditUserUpdate',
                component: EditUserUpdateVue,
                props:true,
               meta: { requiresAuth: true, allowedRoles: [3] }
            },
            {
                path:'/user/schedules',
                name:'MySchedules',
                component: MySchedulesVue,
                props:true,
               meta: { requiresAuth: true, allowedRoles: [3] }
            },
            {
                path:'/submit-shedule',
                name:'AddShedule',
                component: AddSheduleVue,
                props:true,
               meta: { requiresAuth: true, allowedRoles: [3] }
            },
            {
                path:'/my/receipt',
                name:'Myreceipts',
                component:Myreceipts,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [3] }
            },
            {
                path:'/submit-receipt',
                name:'SubmitReceipt',
                component: SubmitReceipt,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [3] }
            },
            {
                path:'/attendance',
                name:'MyAttendance',
                component: MyAttendance,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [3] }
            },
            {
                path:'/create/userattendance',
                name:'CreateAttendance',
                component: CreateAttendance,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [3] }
            },
            {
                path:'/meetingmenutes',
                name:'MeetingMenutes',
                component: MeetingMenutes,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [3] }
            },
            {
                path:'/create/meetingmenutes',
                name:'CreateMenutes',
                component: CreateMenutes,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [3] }
            },
            {
                path:'/user/view-awardedtenders',
                name:'ViewAwaredTender',
                component: ViewAwaredTender,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [3] }
            },
            {
                path: '/accept/:letter_id',
                name: 'AcceptAppointmentLetter',
                component: AcceptAppointmentLetter,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [3] }
            }, 
            {
                path:'/user/appointment-letters',
                name:'UserAppointmentLetter',
                component:  UserAppointmentLetter,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [3] }
            },
            {
                path:'/create/analysis',
                name:'CreateAnalyses',
                component: CreateAnalyses,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [3] }
            },
            {
                path:'/user/analyses',
                name:'UserAnalyses',
                component: UserAnalyses,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [3] }
            },
            {
                path:'/user/requests',
                name:'MyRequests',
                component: MyRequestsVue,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [3] }
            },
            {
                path:'/apply-for/request',
                name:'ApplyForRequest',
                component: ApplyForRequestVue,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [3] }
            },
            {
                path:'/user/extentions-for-project',
                name:'UserExtentions',
                component: UserExtentions,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [3] }
            },
            {
                path:'/create/extentions-for-project',
                name:'CreateExtention',
                component: CreateExtention,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [3] }
            },
        ],
    },

    // TENDERS LAYOUT (role_id: 4)
    {
        path: '/',
        name: 'Auth2',
        component: AuthLayout2,
        meta: { allowedRoles: [4] },
        children: [
            {
                path: '/tenders/dashboard',
                name: 'TendersDashboard',
                component: TendersDashboard,
                meta: { requiresAuth: true, allowedRoles: [4] }
            },
            {
                path: 'tendersprofile',
                name: 'UserProfile2',
                component: UserProfile2,
                meta: { requiresAuth: true, allowedRoles: [4] }
            },
            {
                path: '/tenders',
                name: 'Tenders',
                component: TendersVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [4] }
            },
            {
                path: 'create-tender',
                name: 'CreateTender',
                component: CreateTenderVue,
                meta: { requiresAuth: true, allowedRoles: [4] }
            },
            {
                path: '/edit-tender/:tender_id',
                name: 'EditTender',
                component: EditTenderVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [4] }
            },
            {
                path: '/assigned-tenders',
                name: 'AllAssignedTenders',
                component: AllAssignedTendersVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [4] }
            },
            {
                path: 'assign-tender',
                name: 'AssignTender',
                component: AssignTenderVue,
                meta: { requiresAuth: true, allowedRoles: [4] }
            },
            {
                path: '/edit-assigned/:assign_id',
                name: 'EditAssignedTender',
                component: EditAssignedTenderVue,  
                props: true,
                meta: { requiresAuth: true, allowedRoles: [4] }
            },
            {
                path: 'tenders-submitted',
                name: 'TendersDocSubmission',
                component: TendersDocSubmissionVue,
                meta: { requiresAuth: true, allowedRoles: [4] }
            },
            {
                path: '/accept-submission/:submission_id',
                name: 'AcceptSubmission',
                component: AcceptSubmissionVue,  
                props: true,
                meta: { requiresAuth: true, allowedRoles: [4] }
            },
            {
                path:'/tenderuser-viewupdate',
                name:'TenderUserViewUpdates',
                component:TenderUserViewUpdatesVue,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [4] }
            },
            {
                path:'/tenderuser-submitupdate',
                name:'TenderUserSubmitUpdates',
                component:TenderUserSubmitUpdatesVue,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [4] }
            },
            {
                path: '/tenderuser-editupdate/:chat_id',
                name: 'TenderUserEditUpdates',
                component: TenderUserEditUpdatesVue,  
                props: true,
                meta: { requiresAuth: true, allowedRoles: [4] }
            },
            {
                path:'/awarded/tenders',
                name:'ManageAwardedTenders',
                component:ManageAwardedTenders,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [4] }
            },
            {
                path:'/create-awardedtender',
                name:'CreateAwardedTender',
                component:CreateAwardedTender,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [4] }
            },
            {
                path: '/edit-award/:award_id',
                name: 'EditAwardedTender',
                component: EditAwardedTender,  
                props: true,
                meta: { requiresAuth: true, allowedRoles: [4] }
            },
            {
                path: 'tenderuser/view-activityDetail',
                name: 'TenderUserViewActivity',
                component: TenderUserViewActivity,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [4] }
            },
            {
                path: '/tenderuser-view/activity-Byid/:activity_id',
                name: 'TenderUserViewActivityDetail',
                component: TenderUserViewActivityDetail,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [4] }
            },
            {
                path:'/tenderuser-view/receipts',
                name:'TenderUserVGetAllReceipts',
                component: TenderUserVGetAllReceipts,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [4] }
            },
            {
                path:'/tenderuser-view/updates',
                name:'TenderUserViewAttendance',
                component: TenderUserViewAttendance,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [4] }
            },
            {
                path:'/tenderuser-view/minutes',
                name:'TenderUserViewMinutes',
                component: TenderUserViewMinutes,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [4] }
            },
            {
                path:'/tenderuses-get/allrequests',
                name:'TenderUserGetALlRequests',
                component: TenderUserGetALlRequests,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [4] }
            },
            {
                path: 'create/intention-to-award',
                name: 'createIntentioToAward',
                component: CreateIntentioToAward,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [4] }
            },
            {
                path:'/intention-to-award',
                name:'ViewIntentionToAwards',
                component: ViewIntentionToAwards,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [4] }
            },
            {
                path: 'create/awarding-letter',  
                name: 'createAwardLetter',
                component: CreateAwardLetter,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [4] }
            },
            {
                path:'/awarding-letter',
                name:'ViewAwardLetter',
                component: ViewAwardLetter,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [4] }
            },
            {
                path: 'create/insurance-bond',  
                name: 'createInsuranceBond',
                component: CreateInsuranceBond,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [4] }
            },
            {
                path:'/insurance-bond',
                name:'insuranceBond',
                component: InsuranceBond,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [4] }
            },
            {
                path: 'create/security-declaration',  
                name: 'createSecurityDeclaration',
                component: CreateSecurityDeclaration,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [4] }
            },
            {
                path:'/security-declaration',
                name:'securityDeclaration',
                component: SecurityDeclaration,
                props:true,
                meta:{ requiresAuth: true, allowedRoles: [4] }
            },
        ],
    },

    // HOD LAYOUT (role_id: 2)
    {
        path: '/',
        name: 'Auth3',
        component: AuthLayout3,
        meta: { allowedRoles: [2] },
        children: [
            {
                path: '/hod/dashboard',
                name: 'HodDashboard',
                component: HodDashboard,
                meta: { requiresAuth: true, allowedRoles: [2] }
            },
            {
                path: 'hod/profile',
                name: 'UserProfile3',
                component: UserProfile3,
                meta: { requiresAuth: true, allowedRoles: [2] }
            },
            {
                path: 'hod-tenders',
                name: 'HodTenders',
                component: HodTendersVue,
                meta: { requiresAuth: true, allowedRoles: [2] }
            },
            // ─── ADD THESE 3 ROUTES into the Auth3 (HOD) children array ───
// Paste them before the closing ] of the HOD children block,
// i.e. right after the 'HodViewAwardedTenders' route.

            // Price Schedules list view for HOD
            {
                path: 'hod/price-schedules',
                name: 'HodPriceSchedules',
                component: MySchedulesVue,              // reuses the same schedule list component
                meta: { requiresAuth: true, allowedRoles: [2] }
            },

            // Project Analyses list view for HOD
            {
                path: 'hod/analyses',
                name: 'HodViewAnalyses',
                component: Analyses,                    // reuses the Analyses list component
                meta: { requiresAuth: true, allowedRoles: [2] }
            },

            // Project Activities list view for HOD (the sidebar needs a list page, not the approve-by-id page)
            {
                path: 'hod/activities',
                name: 'HodActivities',
                component: AdminViewALlProjectActivities,  // reuses the activities list component
                meta: { requiresAuth: true, allowedRoles: [2] }
            },
            {
                path: '/hod/projects',
                name: 'HodViewProjects',
                component: HodViewProjectsVue,
                meta: { requiresAuth: true, allowedRoles: [2] }
            },
            {
                path: '/hod/approve-project/:project_id',
                name: 'ApproveAssignedProject',
                component: ApproveAssignedProjectVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [2] }
            },
            {
                path: '/hod/approve-activity/:activity_id',
                name: 'HodApproveActivity',
                component: HodApproveActivityVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [2] }
            },
            {
                path: 'hod/view-update',
                name: 'HodViewUpdate',
                component: HodViewUpdateVue,
                meta: { requiresAuth: true, allowedRoles: [2] }
            },
            {
                path: 'hod/submit-update',
                name: 'HodSubmitUpdate',
                component: HodSubmitUpdateVue,
                meta: { requiresAuth: true, allowedRoles: [2] }
            },
            {
                path: '/hod/edit-update/:chat_id',
                name: 'HodEditUpdate',
                component: HodEditUpdateVue,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [2] }
            },
            {
                path: 'hod/get-requests',
                name: 'HodGetAllRequests',
                component: HodGetAllRequests,
                meta: { requiresAuth: true, allowedRoles: [2] }
            },
            {
                path: 'hod/create-attendance',
                name: 'HodCreateAttendance',
                component: HodCreateAttendance,
                meta: { requiresAuth: true, allowedRoles: [2] }
            },
            {
                path: 'hod/manage-attendance',
                name: 'HodManageAllAttendance',
                component: HodManageAllAttendance,
                meta: { requiresAuth: true, allowedRoles: [2] }
            },
            {
                path: 'hod/get-minutes',
                name: 'HodGetMinutes',
                component: HodGetMinutes,
                meta: { requiresAuth: true, allowedRoles: [2] }
            },
            {
                path: 'hod/create-minutes',
                name: 'HodCreateUpdate',
                component: HodCreateUpdate,
                meta: { requiresAuth: true, allowedRoles: [2] }
            },
            {
                path: 'hod/submitted-tenders',
                name: 'HodViewSubmittedTenders',
                component: HodViewSubmittedTenders,
                meta: { requiresAuth: true, allowedRoles: [2] }
            },
            {
                path: 'hod/awarded-tenders',
                name: 'HodViewAwardedTenders',
                component: HodViewAwardedTenders,
                meta: { requiresAuth: true, allowedRoles: [2] }
            }
        ]
    },

    // ACCOUNTANT LAYOUT (role_id: 5)
    {
        path: '/',
        name: 'Auth4',
        component: AuthLayout4,
        meta: { allowedRoles: [5] },
        children: [
            {
                path: '/accountDash',
                name: 'AccountantDashbaord',
                component: AccountantDashbaordVue,
                meta: { requiresAuth: true, allowedRoles: [5] }
            },
            {
                path: '/approve/all/requests',
                name: 'ApproveAllRequests',
                component: ApproveAllRequests,
                meta: { requiresAuth: true, allowedRoles: [5] }
            },
            {
                path: '/edit/projectrequest/:request_id',
                name: 'ApproveRequest',
                component: ApproveRequestVue,  
                props: true,
                meta: { requiresAuth: true, allowedRoles: [5] }
            },
            {
                path: '/accntant/profile',  
                name: 'UserProfile4',
                component: UserProfile4Vue,
                meta: { requiresAuth: true, allowedRoles: [5] }
            },
            {
                path: '/accntnant-view-update', 
                name: 'AccntantViewUpdate',
                component: AccntantViewUpdateVue,
                meta: { requiresAuth: true, allowedRoles: [5] }
            },
            {
                path: '/accntnant/submit-update',
                name: 'AccntantCreateUpdate',
                component: AccntantCreateUpdate,
                meta: { requiresAuth: true, allowedRoles: [5] }
            },
            {
                path: '/accntnantedit-update/:chat_id',
                name: 'AccntantEditUpdate',
                component: AccntantEditUpdateVue,  
                props: true,
                meta: { requiresAuth: true, allowedRoles: [5] }
            },
            {
                path: '/accountant-create-attendance',
                name: 'AccntntCreateAttendance',
                component: AccntntCreateAttendance,
                meta: { requiresAuth: true, allowedRoles: [5] }
            },
            {
                path: '/account-view-attendance',
                name: 'AccountantGetAttendance',
                component: AccountantGetAttendance,
                meta: { requiresAuth: true, allowedRoles: [5] }
            },
            {
                path: '/accountant-create-minutes',
                name: 'AccontntCreateUpdate',
                component: AccontntCreateUpdate,
                meta: { requiresAuth: true, allowedRoles: [5] }
            },
            {
                path: '/account-view-minutes',
                name: 'AccontntGetMinutes',
                component: AccontntGetMinutes,
                meta: { requiresAuth: true, allowedRoles: [5] }
            },
            {
                path: '/account/view-receipt',
                name: 'AccntntGetALlReceipts',
                component: AccntntGetALlReceipts,
                meta: { requiresAuth: true, allowedRoles: [5] }
            },
            {
                path: '/view-portofolio',
                name: 'AccViewPortofolio',
                component: AccViewPortofolio,
                meta: { requiresAuth: true, allowedRoles: [5] }
            },
            {
                path: '/view-analysis',
                name: 'AccViewAnalysis',
                component: AccViewAnalysis,
                meta: { requiresAuth: true, allowedRoles: [5] }
            },
            {
                path: '/follow-up',
                name: 'Followup',
                component: Followup,
                meta: { requiresAuth: true, allowedRoles: [5] }
            },
            {
                path: '/edit/follow-up/:project_id',
                name: 'UpdateFollowup',
                component:  UpdateFollowup,  
                props: true,
                meta: { requiresAuth: true, allowedRoles: [5] }
            },
            {
                path: '/approve/request',
                name: 'AccManageRequests',
                component:  AccManageRequests,  
                props: true,
                meta: { requiresAuth: true, allowedRoles: [5] }
            },
            {
                path: '/approve/extended-request',
                name: 'AccManageExtendedRequests',
                component:  AccManageExtendedRequests,  
                props: true,
                meta: { requiresAuth: true, allowedRoles: [5] }
            },
        ],
    },

    // HR LAYOUT (role_id: 6)
    {
        path: '/',
        name: 'Auth5',
        component: AuthLayout5,
        meta: { allowedRoles: [6] },
        children: [
            {
                path: '/hrDash',
                name: 'HrDashbaord',
                component: HrDashbaord,
                meta: { requiresAuth: true, allowedRoles: [6] }
            },
            {
                path: '/hr/profile',  
                name: 'UserProfile5',
                component: UserProfile5,
                meta: { requiresAuth: true, allowedRoles: [6] }
            },
            {
                path: '/contracts', 
                name: 'ManageContracts',
                component: ManageContracts,
                meta: { requiresAuth: true, allowedRoles: [6] }
            },
            {
                path: '/edit-contract/:contract_id',
                name: 'EditContract',
                component: EditContract,  
                props: true,
                meta: { requiresAuth: true, allowedRoles: [6] }
            },
            {
                path: '/register-contract',
                name: 'RegisterContract',
                component: RegisterContract,
                meta: { requiresAuth: true, allowedRoles: [6] }
            },
            {
                path: '/assign/project',
                name: 'HrAssignProject',
                component: HrAssignProject,
                meta: { requiresAuth: true, allowedRoles: [6] }
            },
            {
                path: '/manage/projects',
                name: 'HrManageProject',
                component: HrManageProject,
                meta: { requiresAuth: true, allowedRoles: [6] }
            },
            {
                path: '/edit-project/:project_id',
                name: 'HrEditProject',
                component: HrEditProject,  
                props: true,
                meta: { requiresAuth: true, allowedRoles: [6] }
            },
            {
                path: '/view-tenders',
                name: 'HrViewReisteredTenders',
                component: HrViewReisteredTenders,
                props: true,
                meta: { requiresAuth: true, allowedRoles: [6] }
            },
            {
                path: 'view/tenders-submitted',
                name: 'HrViewSubmittedTenders',
                component: HrViewSubmittedTenders,
                meta: { requiresAuth: true, allowedRoles: [6] }
            },
            {
                path: 'view/portofolio',
                name: 'ProjectPortofolio',
                component:  ProjectPortofolio,
                meta: { requiresAuth: true, allowedRoles: [6] }
            },
            {
                path: 'extention-for/projects',
                name: 'HrViewExtentions',
                component:  HrViewExtentions,
                meta: { requiresAuth: true, allowedRoles: [6] }
            },
            {
                path: 'request-for/projects',
                name: 'HrViewProjectRequests',
                component:  HrViewProjectRequests,
                meta: { requiresAuth: true, allowedRoles: [6] }
            },
        ],
    },

    // GUEST LAYOUT (No authentication required)
    {
        path: '/',
        component: GuestLayout,
        children: [
            {
                path: '/',          
                name: 'Login',
                component: Login,
            },
            {
                path: 'register',
                name: 'Register',
                component: Register,
            },
            {
                path: '/auth/google/callback',
                name: 'GoogleCallback',
                component: GoogleCallback,
            },
            {
                path: 'password',
                name: 'Password',
                component: Password,
            },
            {
                path: 'reset-password',
                name: 'ResetPasswordRequest',
                component: ResetPasswordRequest,
            },
            {
                path: 'update-password',
                name: 'ResetPasswordPage',
                component: ResetPasswordPage,
            },
        ]
    },

    // ERROR LAYOUT
    {
        path: '/error',
        name: 'Error',
        component: ErrorLayout,
        children: [
            {
                path: '404',
                name: 'Error404',
                component: Error404,
            },
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'Error404' }
    }
];

// Create the router instance
const router = createRouter({
    history: createWebHistory(baseURL),
    routes: routes
});

// Role-based dashboard mapping
const roleDashboards = {
    1: '/dashboard',           // Admin
    2: '/hod/dashboard',       // HOD
    3: '/user/dashboard',      // User
    4: '/tenders/dashboard',   // Tenders
    5: '/accountDash',         // Accountant
    6: '/hrDash'              // HR
};

// Navigation guard to check authentication and role-based access
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const role_id = parseInt(localStorage.getItem('role_id'));

    console.log('Navigation Guard:', {
        to: to.path,
        toName: to.name,
        from: from.path,
        role_id,
        token: !!token,
        requiresAuth: to.meta.requiresAuth,
        allowedRoles: to.meta.allowedRoles
    });

    // If route requires auth and no token, redirect to login
    if (to.meta.requiresAuth && !token) {
        console.log('No token, redirecting to login');
        next({ path: '/' });
        return;
    }

    // If user is authenticated
    if (token && role_id) {
        // If user is on login page but already authenticated, redirect to their dashboard
        if (to.path === '/' || to.name === 'Login') {
            const dashboardPath = roleDashboards[role_id];
            console.log(`Authenticated user on login page, redirecting to: ${dashboardPath}`);
            next({ path: dashboardPath });
            return;
        }

        // Check if the route has role restrictions
        if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(role_id)) {
            console.log(`Role ${role_id} not allowed to access ${to.path}`);
            const correctDashboard = roleDashboards[role_id];
            console.log(`Redirecting to correct dashboard: ${correctDashboard}`);
            next({ path: correctDashboard });
            return;
        }

        // Check if user is trying to access a layout they shouldn't
        const currentLayout = to.matched[0]?.name;
        const parentLayoutAllowedRoles = to.matched[0]?.meta?.allowedRoles;
        
        if (currentLayout && parentLayoutAllowedRoles && !parentLayoutAllowedRoles.includes(role_id)) {
            console.log(`Role ${role_id} cannot access layout ${currentLayout}`);
            const correctDashboard = roleDashboards[role_id];
            console.log(`Redirecting to correct dashboard: ${correctDashboard}`);
            next({ path: correctDashboard });
            return;
        }
    }

    next();
});

export default router;