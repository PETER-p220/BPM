<template>
  <div 
    :class="[
      'min-h-screen flex items-center justify-center p-4 transition-colors duration-300',
      isDarkMode ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-slate-50 to-slate-100'
    ]"
  >
    <!-- Theme Toggle Button -->
    <button
      @click="toggleTheme"
      :class="[
        'fixed top-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110',
        isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'
      ]"
      :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    >
      <i :class="isDarkMode ? 'fas fa-sun text-xl' : 'fas fa-moon text-xl'"></i>
    </button>

    <!-- Loading Overlay -->
    <div
      v-if="loading"
      :class="[
        'fixed inset-0 backdrop-blur-sm flex items-center justify-center z-40',
        isDarkMode ? 'bg-black/70' : 'bg-white/80'
      ]"
    >
      <div 
        :class="[
          'rounded-xl shadow-2xl p-8 max-w-md w-full text-center',
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        ]"
      >
        <div class="flex flex-col items-center">
          <img
            class="h-16 w-auto mb-6"
            src="../../assets/images/logo.png"
            alt="TERA Logo"
          />
          <svg
            :class="[
              'w-12 h-12 animate-spin mb-4',
              isDarkMode ? 'text-indigo-500' : 'text-blue-600'
            ]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"
            ></path>
          </svg>
          <h2 
            :class="[
              'text-xl font-semibold mb-2',
              isDarkMode ? 'text-white' : 'text-gray-800'
            ]"
          >
            {{ loadingMessage }}
          </h2>
        </div>
      </div>
    </div>

    <!-- Cookie Consent Modal -->
    <div
      v-if="!cookiesAccepted && !loading"
      :class="[
        'fixed inset-0 flex items-center justify-center z-40 p-4',
        isDarkMode ? 'bg-black/80' : 'bg-gray-900/60'
      ]"
    >
      <div 
        :class="[
          'rounded-xl shadow-2xl p-8 max-w-lg w-full text-center',
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        ]"
      >
        <div 
          :class="[
            'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
            isDarkMode ? 'bg-indigo-900/30' : 'bg-blue-100'
          ]"
        >
          <i 
            :class="[
              'fas fa-cookie-bite text-2xl',
              isDarkMode ? 'text-indigo-400' : 'text-blue-600'
            ]"
          ></i>
        </div>
        <h2 
          :class="[
            'text-2xl font-bold mb-4',
            isDarkMode ? 'text-white' : 'text-gray-800'
          ]"
        >
          Cookie Consent
        </h2>
        <p 
          :class="[
            'mb-6',
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          ]"
        >
          We use cookies to enhance your experience and analyze usage. By continuing, you agree to our use of cookies.
        </p>
        <button
          @click="acceptCookies"
          :class="[
            'w-full font-medium py-3 px-6 rounded-lg transition',
            isDarkMode 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          ]"
        >
          Accept Cookies & Continue
        </button>
      </div>
    </div>

    <!-- Main Login Section -->
    <div
      v-if="cookiesAccepted && !loading"
      :class="[
        'w-full max-w-md mx-auto rounded-2xl shadow-2xl overflow-hidden p-8 md:p-12',
        isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
      ]"
    >
      <!-- Logo / Brand -->
      <div class="flex justify-center mb-8">
        <img
          class="h-20 w-auto"
          src="../../assets/images/logo.png"
          alt="TERA Logo"
        />
      </div>

      <h2 
        :class="[
          'text-2xl font-bold mb-2 text-center',
          isDarkMode ? 'text-white' : 'text-gray-800'
        ]"
      >
        Sign In
      </h2>
      <p 
        :class="[
          'mb-8 text-center',
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        ]"
      >
        Enter your credentials to access your account
      </p>

      <!-- Login Form -->
      <form class="space-y-6" @submit.prevent="LoginMethod">
        <!-- Email -->
        <div>
          <label
            for="email"
            :class="[
              'block text-sm font-medium mb-2',
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            ]"
          >
            Email Address
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i 
                :class="[
                  'fas fa-envelope',
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                ]"
              ></i>
            </div>
            <input
              type="email"
              id="email"
              v-model="email"
              required
              :class="[
                'w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:outline-none transition',
                isDarkMode 
                  ? 'bg-gray-800 border border-gray-700 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-500' 
                  : 'bg-slate-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400'
              ]"
              placeholder="name@company.com"
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label
            for="password"
            :class="[
              'block text-sm font-medium mb-2',
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            ]"
          >
            Password
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i 
                :class="[
                  'fas fa-lock',
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                ]"
              ></i>
            </div>
            <input
              :type="passwordVisible ? 'text' : 'password'"
              id="password"
              v-model="password"
              required
              :class="[
                'w-full pl-10 pr-12 py-3 rounded-lg focus:ring-2 focus:outline-none transition',
                isDarkMode 
                  ? 'bg-gray-800 border border-gray-700 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-500' 
                  : 'bg-slate-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400'
              ]"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              :class="[
                'absolute inset-y-0 right-0 pr-4 flex items-center',
                isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              <i :class="passwordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
            </button>
          </div>
        </div>

        <!-- Forgot Password -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember"
              type="checkbox"
              :class="[
                'h-4 w-4 rounded',
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-indigo-600 focus:ring-indigo-500' 
                  : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
              ]"
            />
            <label 
              for="remember" 
              :class="[
                'ml-2 block text-sm',
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              ]"
            >
              Remember me
            </label>
          </div>
          <a
            href="/reset-password"
            :class="[
              'text-sm hover:underline transition',
              isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-blue-600 hover:text-blue-700'
            ]"
          >
            Forgot password?
          </a>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          :class="[
            'w-full font-medium py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg',
            isDarkMode 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
          ]"
        >
          <span v-if="loading">Signing in...</span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div 
            :class="[
              'w-full border-t',
              isDarkMode ? 'border-gray-700' : 'border-gray-300'
            ]"
          ></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span 
            :class="[
              'px-4',
              isDarkMode ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'
            ]"
          >
            Or continue with
          </span>
        </div>
      </div>

      <!-- Google Login -->
      <button
        @click="loginWithGoogle"
        :disabled="loading"
        :class="[
          'w-full font-medium py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border-2',
          isDarkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700' 
            : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
        ]"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <!-- Footer Text -->
      <p 
        :class="[
          'text-center text-sm mt-8',
          isDarkMode ? 'text-gray-500' : 'text-gray-500'
        ]"
      >
        Business Processes Management System – Version 1.0
      </p>

      <!-- Trust Indicators -->
      <div 
        :class="[
          'mt-6 flex justify-center gap-6 text-sm',
          isDarkMode ? 'text-gray-500' : 'text-gray-400'
        ]"
      >
        <div class="flex items-center gap-2">
          <i class="fas fa-shield-alt"></i>
          <span>Secure</span>
        </div>
        <div class="flex items-center gap-2">
          <i class="fas fa-lock"></i>
          <span>Encrypted</span>
        </div>
        <div class="flex items-center gap-2">
          <i class="fas fa-clock"></i>
          <span>24/7</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axios from '../../axios.js'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const passwordVisible = ref(false)
const loading = ref(true)
const loadingMessage = ref('WELCOME TO TERA BUSINESS PROCESSES MANAGEMENT SYSTEM')
const cookiesAccepted = ref(false)
const isDarkMode = ref(true) // Default to dark mode
const toast = useToast()
const router = useRouter()

onMounted(() => {
  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme_preference')
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  }
  
  cookiesAccepted.value = localStorage.getItem('cookie_consent') === 'true'
  setTimeout(() => {
    loading.value = false
  }, 2000)
})

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme_preference', isDarkMode.value ? 'dark' : 'light')
}

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const LoginMethod = async () => {
  loading.value = true
  loadingMessage.value = 'Signing you in...'

  try {
    const response = await axios.post('api/auth/login', {
      email: email.value,
      password: password.value,
    })

    const token = response.data.token
    const user = response.data.user
    const role_id = Number(response.data.role_id || user.role_id)

    console.log('Login successful:', {
      role_id,
      type: typeof role_id,
      user: user.name,
      email: user.email
    })

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('role_id', String(role_id))

    toast.success(`Welcome back, ${user.name}!`)

    const routes = {
      1: '/dashboard',
      2: '/hod/dashboard',
      3: '/user/dashboard',
      4: '/tenders/dashboard',
      5: '/accountDash',
      6: '/hrDash'
    }

    if (routes[role_id]) {
      console.log(`Redirecting to ${routes[role_id]}`)
      await router.replace(routes[role_id])
    } else {
      console.error('Unknown role_id:', role_id)
      toast.error('Invalid user role. Please contact support.')
      await router.replace('/')
    }
  } catch (error) {
    console.error("Login error:", error.response?.data || error)
    toast.error(error.response?.data.message || "Login failed.")
  } finally {
    loading.value = false
    loadingMessage.value = 'WELCOME TO TERA BUSINESS PROCESSES MANAGEMENT SYSTEM'
  }
}

const loginWithGoogle = async () => {
  loading.value = true
  loadingMessage.value = 'Redirecting to Google...'

  try {
    const response = await axios.get('/api/auth/google/redirect')

    if (response.data.token) {
      const token = response.data.token
      const user = response.data.user
      const role_id = Number(response.data.role_id)

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('role_id', String(role_id))

      console.log('Google login successful:', { role_id, user: user.name })
      toast.success(`Welcome, ${user.name}!`)

      const routes = {
        1: '/dashboard',
        2: '/hod/dashboard',
        3: '/user/dashboard',
        4: '/tenders/dashboard',
        5: '/accountDash',
        6: '/hrDash'
      }

      if (routes[role_id]) {
        await router.replace(routes[role_id])
      }
    } else if (response.data.url) {
      window.location.href = response.data.url
    } else {
      throw new Error('Invalid response from server')
    }
  } catch (error) {
    console.error('Google login failed:', error.response?.data || error.message)
    const errorMessage = error.response?.data?.message || 'Google login failed. Please try again.'
    toast.error(errorMessage)
    loading.value = false
    loadingMessage.value = 'WELCOME TO TERA BUSINESS PROCESSES MANAGEMENT SYSTEM'
  }
}

const acceptCookies = async () => {
  try {
    await axios.post('/api/accept-cookies')
    localStorage.setItem('cookie_consent', 'true')
    cookiesAccepted.value = true
    toast.success('Cookies accepted successfully!')
  } catch (error) {
    console.error('Error accepting cookies:', error)
    toast.error('Failed to accept cookies. Please try again.')
  }
}
</script>

<style scoped>
/* Smooth transitions for theme switching */
* {
  transition-property: background-color, border-color, color;
  transition-duration: 300ms;
  transition-timing-function: ease-in-out;
}

/* Custom scrollbar for dark mode */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}
</style>