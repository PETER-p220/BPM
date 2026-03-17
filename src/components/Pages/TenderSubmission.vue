<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold mb-8">Submit Tender</h1>
      
      <form @submit.prevent="submitTender" class="space-y-6">
        <!-- Basic Info -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Tender Title</label>
              <input v-model="form.title" required class="w-full border rounded-lg px-4 py-2" />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Reference Number</label>
              <input v-model="form.reference" required class="w-full border rounded-lg px-4 py-2" />
            </div>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Description</label>
            <textarea v-model="form.description" rows="4" required class="w-full border rounded-lg px-4 py-2"></textarea>
          </div>
          
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Category</label>
              <select v-model="form.category" required class="w-full border rounded-lg px-4 py-2">
                <option value="">Select Category</option>
                <option value="construction">Construction</option>
                <option value="it">IT Services</option>
                <option value="consulting">Consulting</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Budget Range</label>
              <input v-model="form.budget" type="number" required class="w-full border rounded-lg px-4 py-2" />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Deadline</label>
              <input v-model="form.deadline" type="date" required class="w-full border rounded-lg px-4 py-2" />
            </div>
          </div>
        </div>

        <!-- Documents -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Required Documents</h2>
          
          <div class="space-y-4">
            <div v-for="(doc, index) in form.documents" :key="index" class="flex items-center gap-4">
              <input v-model="doc.name" placeholder="Document name" class="flex-1 border rounded-lg px-4 py-2" />
              <input type="file" @change="handleFileUpload($event, index)" class="border rounded-lg px-4 py-2" />
              <button type="button" @click="removeDocument(index)" class="text-red-500 hover:text-red-700">
                Remove
              </button>
            </div>
            
            <button type="button" @click="addDocument" class="text-indigo-600 hover:text-indigo-700">
              + Add Document
            </button>
          </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-end gap-4">
          <button type="button" @click="$router.go(-1)" class="px-6 py-2 border rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" :disabled="loading" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            {{ loading ? 'Submitting...' : 'Submit Tender' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)

const form = ref({
  title: '',
  reference: '',
  description: '',
  category: '',
  budget: '',
  deadline: '',
  documents: [{ name: '', file: null }]
})

function addDocument() {
  form.value.documents.push({ name: '', file: null })
}

function removeDocument(index) {
  form.value.documents.splice(index, 1)
}

function handleFileUpload(event, index) {
  form.value.documents[index].file = event.target.files[0]
  form.value.documents[index].name = event.target.files[0].name
}

async function submitTender() {
  loading.value = true
  try {
    // API call would go here
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('Tender submitted successfully!')
    router.push('/tenders')
  } catch (error) {
    alert('Error submitting tender')
  } finally {
    loading.value = false
  }
}
</script>
