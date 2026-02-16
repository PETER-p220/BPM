<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <i class="fas fa-users-cog"></i>
            Role Assignment Guide
          </h2>
          <button 
            @click="$emit('close')"
            class="text-white hover:text-gray-200 transition-colors"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Introduction -->
        <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 class="text-lg font-semibold text-blue-900 mb-2">Understanding User Roles</h3>
          <p class="text-sm text-blue-700">
            Each role in the system has specific permissions and access to different dashboards. 
            When creating a new user, select the appropriate role based on their job responsibilities.
          </p>
        </div>

        <!-- Roles Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Admin Role -->
          <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-user-shield text-red-600 text-xl"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-900">ADMIN</h4>
                <span class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Role ID: 1</span>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-3">System Administrator with full access to all features</p>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <i class="fas fa-desktop text-gray-400 text-xs"></i>
                <span class="text-xs font-medium text-gray-700">Dashboard:</span>
                <span class="text-xs bg-gray-100 px-2 py-0.5 rounded">Dashboard.vue</span>
              </div>
              <div class="text-xs text-gray-600">
                <strong>Access:</strong> All system features, user management, system configuration
              </div>
            </div>
          </div>

          <!-- HOD Role -->
          <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-user-tie text-purple-600 text-xl"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-900">HOD</h4>
                <span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Role ID: 2</span>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-3">Head of Department overseeing department processes</p>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <i class="fas fa-desktop text-gray-400 text-xs"></i>
                <span class="text-xs font-medium text-gray-700">Dashboard:</span>
                <span class="text-xs bg-gray-100 px-2 py-0.5 rounded">HodDashboard.vue</span>
              </div>
              <div class="text-xs text-gray-600">
                <strong>Access:</strong> Department management, approvals, reporting
              </div>
            </div>
          </div>

          <!-- Tender Role -->
          <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-file-contract text-green-600 text-xl"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-900">TENDER</h4>
                <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Role ID: 6</span>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-3">Manages tender creation, evaluation, and awarding</p>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <i class="fas fa-desktop text-gray-400 text-xs"></i>
                <span class="text-xs font-medium text-gray-700">Dashboard:</span>
                <span class="text-xs bg-gray-100 px-2 py-0.5 rounded">HrDashbaord.vue</span>
              </div>
              <div class="text-xs text-gray-600">
                <strong>Access:</strong> Tender management, evaluation, awarding processes
              </div>
            </div>
          </div>

          <!-- HR Role -->
          <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-users text-yellow-600 text-xl"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-900">HR</h4>
                <span class="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Role ID: 7</span>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-3">Handles human resources and employee management</p>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <i class="fas fa-desktop text-gray-400 text-xs"></i>
                <span class="text-xs font-medium text-gray-700">Dashboard:</span>
                <span class="text-xs bg-gray-100 px-2 py-0.5 rounded">HrDashbaord.vue</span>
              </div>
              <div class="text-xs text-gray-600">
                <strong>Access:</strong> Employee management, payroll, attendance
              </div>
            </div>
          </div>

          <!-- Engineer Role -->
          <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-hard-hat text-blue-600 text-xl"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-900">ENGINEER</h4>
                <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Role ID: 3</span>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-3">Technical execution and project delivery</p>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <i class="fas fa-desktop text-gray-400 text-xs"></i>
                <span class="text-xs font-medium text-gray-700">Dashboard:</span>
                <span class="text-xs bg-gray-100 px-2 py-0.5 rounded">UserDashboard.vue</span>
              </div>
              <div class="text-xs text-gray-600">
                <strong>Access:</strong> Project execution, maintenance, technical tasks
              </div>
            </div>
          </div>

          <!-- Accountant Role -->
          <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-calculator text-orange-600 text-xl"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-900">ACCOUNTANT</h4>
                <span class="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Role ID: 4</span>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-3">Handles financial transactions and budgeting</p>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <i class="fas fa-desktop text-gray-400 text-xs"></i>
                <span class="text-xs font-medium text-gray-700">Dashboard:</span>
                <span class="text-xs bg-gray-100 px-2 py-0.5 rounded">AccountantDashbaord.vue</span>
              </div>
              <div class="text-xs text-gray-600">
                <strong>Access:</strong> Financial transactions, budgeting, payments
              </div>
            </div>
          </div>

          <!-- Staff Role -->
          <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-user text-gray-600 text-xl"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-900">STAFF</h4>
                <span class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">Role ID: 5</span>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-3">Regular staff with basic access</p>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <i class="fas fa-desktop text-gray-400 text-xs"></i>
                <span class="text-xs font-medium text-gray-700">Dashboard:</span>
                <span class="text-xs bg-gray-100 px-2 py-0.5 rounded">TendersDashboard.vue</span>
              </div>
              <div class="text-xs text-gray-600">
                <strong>Access:</strong> Assigned business processes and tasks
              </div>
            </div>
          </div>
        </div>

        <!-- Best Practices -->
        <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 class="text-lg font-semibold text-green-900 mb-3">Best Practices for Role Assignment</h3>
          <ul class="space-y-2 text-sm text-green-700">
            <li class="flex items-start gap-2">
              <i class="fas fa-check-circle text-green-600 mt-0.5"></i>
              <span><strong>Admin:</strong> Only assign to trusted system administrators who need full system access</span>
            </li>
            <li class="flex items-start gap-2">
              <i class="fas fa-check-circle text-green-600 mt-0.5"></i>
              <span><strong>HOD:</strong> For department heads who need to oversee team activities</span>
            </li>
            <li class="flex items-start gap-2">
              <i class="fas fa-check-circle text-green-600 mt-0.5"></i>
              <span><strong>Tender:</strong> For staff managing procurement and tender processes</span>
            </li>
            <li class="flex items-start gap-2">
              <i class="fas fa-check-circle text-green-600 mt-0.5"></i>
              <span><strong>HR:</strong> For human resources and personnel management</span>
            </li>
            <li class="flex items-start gap-2">
              <i class="fas fa-check-circle text-green-600 mt-0.5"></i>
              <span><strong>Engineer:</strong> For technical staff and project implementers</span>
            </li>
            <li class="flex items-start gap-2">
              <i class="fas fa-check-circle text-green-600 mt-0.5"></i>
              <span><strong>Accountant:</strong> For finance and accounting staff</span>
            </li>
            <li class="flex items-start gap-2">
              <i class="fas fa-check-circle text-green-600 mt-0.5"></i>
              <span><strong>User:</strong> For general staff with limited, task-specific access</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex justify-end">
          <button 
            @click="$emit('close')"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])
</script>

<style scoped>
/* Custom scrollbar for modal */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
