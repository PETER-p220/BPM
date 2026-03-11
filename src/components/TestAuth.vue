<template>
  <div class="test-auth-container" style="padding: 20px; max-width: 600px; margin: 0 auto;">
    <h2>Authentication Test</h2>
    
    <div style="margin: 20px 0;">
      <button @click="testCORS" style="padding: 10px 20px; margin-right: 10px;">
        Test CORS
      </button>
      <button @click="testLogin" style="padding: 10px 20px; margin-right: 10px;">
        Test Login
      </button>
      <button @click="testAuth" style="padding: 10px 20px;">
        Test Auth
      </button>
    </div>
    
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3>Results:</h3>
      <pre>{{ results }}</pre>
    </div>
    
    <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3>Current Token:</h3>
      <p>{{ token ? 'Token exists' : 'No token' }}</p>
      <p v-if="token">Token length: {{ token.length }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '@/axios'

const results = ref([])
const token = ref(localStorage.getItem('token'))

const addResult = (message, data = null) => {
  results.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    data: data ? JSON.stringify(data, null, 2) : null
  })
  if (results.value.length > 10) {
    results.value.pop()
  }
}

const testCORS = async () => {
  try {
    addResult('Testing CORS...')
    const response = await axios.get('/test-cors')
    addResult('CORS Test Success', response.data)
  } catch (error) {
    addResult('CORS Test Failed', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      headers: error.response?.headers
    })
  }
}

const testLogin = async () => {
  try {
    addResult('Testing login with sample credentials...')
    const response = await axios.post('/auth/login', {
      email: 'test@example.com',
      password: 'password'
    })
    addResult('Login Response', response.data)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      token.value = response.data.token
      addResult('Token saved to localStorage')
    }
  } catch (error) {
    addResult('Login Failed', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    })
  }
}

const testAuth = async () => {
  try {
    addResult('Testing authenticated endpoint...')
    const response = await axios.get('/user/profile')
    addResult('Auth Test Success', response.data)
  } catch (error) {
    addResult('Auth Test Failed', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    })
  }
}
</script>
