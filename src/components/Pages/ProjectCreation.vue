<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <h1 class="text-3xl font-bold mb-8">Create New Project</h1>
      
      <div class="grid grid-cols-3 gap-8">
        <!-- Form -->
        <div class="col-span-2 space-y-6">
          <!-- Project Details -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-xl font-semibold mb-4">Project Details</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">Project Name</label>
                <input v-model="project.name" required class="w-full border rounded-lg px-4 py-2" />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Description</label>
                <textarea v-model="project.description" rows="4" required class="w-full border rounded-lg px-4 py-2"></textarea>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-2">Priority</label>
                  <select v-model="project.priority" required class="w-full border rounded-lg px-4 py-2">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium mb-2">Status</label>
                  <select v-model="project.status" required class="w-full border rounded-lg px-4 py-2">
                    <option value="planning">Planning</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-2">Start Date</label>
                  <input v-model="project.startDate" type="date" required class="w-full border rounded-lg px-4 py-2" />
                </div>
                
                <div>
                  <label class="block text-sm font-medium mb-2">End Date</label>
                  <input v-model="project.endDate" type="date" required class="w-full border rounded-lg px-4 py-2" />
                </div>
              </div>
            </div>
          </div>

          <!-- Team Assignment -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-xl font-semibold mb-4">Team Assignment</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">Project Manager</label>
                <select v-model="project.manager" required class="w-full border rounded-lg px-4 py-2">
                  <option value="">Select Manager</option>
                  <option v-for="user in teamMembers" :key="user.id" :value="user.id">
                    {{ user.name }} - {{ user.role }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Team Members</label>
                <div v-for="member in project.team" :key="member.id" class="flex items-center gap-4 mb-2">
                  <select v-model="member.id" class="flex-1 border rounded-lg px-4 py-2">
                    <option value="">Select Member</option>
                    <option v-for="user in availableTeamMembers" :key="user.id" :value="user.id">
                      {{ user.name }} - {{ user.role }}
                    </option>
                  </select>
                  <input v-model="member.role" placeholder="Role in project" class="flex-1 border rounded-lg px-4 py-2" />
                  <button type="button" @click="removeTeamMember(member.id)" class="text-red-500 hover:text-red-700">
                    Remove
                  </button>
                </div>
                <button type="button" @click="addTeamMember" class="text-indigo-600 hover:text-indigo-700">
                  + Add Team Member
                </button>
              </div>
            </div>
          </div>

          <!-- Budget & Resources -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-xl font-semibold mb-4">Budget & Resources</h2>
            
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-2">Total Budget</label>
                  <input v-model="project.budget" type="number" required class="w-full border rounded-lg px-4 py-2" />
                </div>
                
                <div>
                  <label class="block text-sm font-medium mb-2">Currency</label>
                  <select v-model="project.currency" required class="w-full border rounded-lg px-4 py-2">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Resources Required</label>
                <textarea v-model="project.resources" rows="3" placeholder="List required resources..." class="w-full border rounded-lg px-4 py-2"></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="font-semibold mb-4">Quick Actions</h3>
            <div class="space-y-2">
              <button @click="saveDraft" class="w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-50">
                💾 Save Draft
              </button>
              <button @click="previewProject" class="w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-50">
                👁️ Preview
              </button>
              <button @click="createTemplate" class="w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-50">
                📋 Create Template
              </button>
            </div>
          </div>

          <!-- Project Summary -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="font-semibold mb-4">Project Summary</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span>Duration:</span>
                <span>{{ calculateDuration() }} days</span>
              </div>
              <div class="flex justify-between">
                <span>Team Size:</span>
                <span>{{ project.team.length }} members</span>
              </div>
              <div class="flex justify-between">
                <span>Priority:</span>
                <span class="capitalize">{{ project.priority }}</span>
              </div>
              <div class="flex justify-between">
                <span>Budget:</span>
                <span>{{ project.currency }} {{ project.budget }}</span>
              </div>
            </div>
          </div>

          <!-- Submit -->
          <button @click="createProject" :disabled="loading" class="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            {{ loading ? 'Creating...' : 'Create Project' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)

const project = ref({
  name: '',
  description: '',
  priority: 'medium',
  status: 'planning',
  startDate: '',
  endDate: '',
  manager: '',
  team: [{ id: '', role: '' }],
  budget: '',
  currency: 'USD',
  resources: ''
})

const teamMembers = ref([
  { id: 1, name: 'John Doe', role: 'Project Manager' },
  { id: 2, name: 'Jane Smith', role: 'Developer' },
  { id: 3, name: 'Mike Johnson', role: 'Designer' },
  { id: 4, name: 'Sarah Wilson', role: 'QA Engineer' }
])

const availableTeamMembers = computed(() => {
  const assignedIds = project.value.team.map(m => m.id).filter(Boolean)
  return teamMembers.value.filter(member => !assignedIds.includes(member.id))
})

function addTeamMember() {
  project.value.team.push({ id: '', role: '' })
}

function removeTeamMember(id) {
  project.value.team = project.value.team.filter(member => member.id !== id)
}

function calculateDuration() {
  if (!project.value.startDate || !project.value.endDate) return 0
  const start = new Date(project.value.startDate)
  const end = new Date(project.value.endDate)
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
}

function saveDraft() {
  localStorage.setItem('projectDraft', JSON.stringify(project.value))
  alert('Draft saved!')
}

function previewProject() {
  alert('Preview functionality would open a modal')
}

function createTemplate() {
  alert('Template functionality would save as reusable template')
}

async function createProject() {
  loading.value = true
  try {
    // API call would go here
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('Project created successfully!')
    router.push('/projects')
  } catch (error) {
    alert('Error creating project')
  } finally {
    loading.value = false
  }
}
</script>
