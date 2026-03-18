<template>

  <div

    class="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-300"

    :class="isDarkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-black' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'"

  >

    <!-- Theme Toggle (discreet corner) -->

    <button

      @click="toggleTheme"

      class="fixed top-5 right-5 z-50 p-2.5 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"

      :class="isDarkMode ? 'bg-gray-800/80 text-amber-300 hover:bg-gray-700/80' : 'bg-white/90 text-gray-700 hover:bg-gray-100 shadow-sm'"

      :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"

    >

      <i :class="['text-lg', isDarkMode ? 'fas fa-sun' : 'fas fa-moon']"></i>

    </button>



    <!-- Main Card -->

    <div

      class="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl transition-all duration-500"

      :class="isDarkMode 

        ? 'bg-gray-900/95 border border-gray-800/60 backdrop-blur-sm' 

        : 'bg-white/95 border border-gray-200/80 backdrop-blur-sm'"

    >

      <!-- Header / Branding -->

      <div class="px-8 pt-10 pb-6 text-center">

        <img

          class="mx-auto h-14 w-auto mb-6 drop-shadow-md"

          src="../../assets/images/logo.png"

          alt="TERA Logo"

        />

        <h1 class="text-2xl font-bold tracking-tight" :class="isDarkMode ? 'text-white' : 'text-gray-900'">

          TERA Business Processes

        </h1>

        <p class="mt-2 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">

          Sign in to manage your operations

        </p>

      </div>



      <!-- Form -->

      <div class="px-8 pb-10">

        <form @submit.prevent="LoginMethod" class="space-y-6">

          <!-- Email -->

          <div>

            <label

              for="email"

              class="block text-sm font-medium mb-1.5 transition-colors"

              :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"

            >

              Email Address

            </label>

            <div class="relative">

              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">

                <i class="fas fa-envelope text-base" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'"></i>

              </div>

              <input

                id="email"

                v-model="email"

                type="email"

                autocomplete="email"

                required

                class="block w-full pl-11 pr-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all text-sm"

                :class="isDarkMode 

                  ? 'bg-gray-800/60 border-gray-700 text-white placeholder-gray-500 focus:ring-indigo-500/50 focus:border-indigo-500' 

                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-indigo-500/40 focus:border-indigo-500'"

                placeholder="name@company.com"

              />

            </div>

          </div>



          <!-- Password -->

          <div>

            <label

              for="password"

              class="block text-sm font-medium mb-1.5 transition-colors"

              :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"

            >

              Password

            </label>

            <div class="relative">

              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">

                <i class="fas fa-lock text-base" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'"></i>

              </div>

              <input

                :type="passwordVisible ? 'text' : 'password'"

                id="password"

                v-model="password"

                autocomplete="current-password"

                required

                class="block w-full pl-11 pr-11 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all text-sm"

                :class="isDarkMode 

                  ? 'bg-gray-800/60 border-gray-700 text-white placeholder-gray-500 focus:ring-indigo-500/50 focus:border-indigo-500' 

                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-indigo-500/40 focus:border-indigo-500'"

                placeholder="••••••••"

              />

              <button

                type="button"

                @click="passwordVisible = !passwordVisible"

                class="absolute inset-y-0 right-0 pr-3.5 flex items-center"

              >

                <i

                  :class="[

                    'text-base transition-colors',

                    isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700',

                    passwordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'

                  ]"

                ></i>

              </button>

            </div>

          </div>



          <!-- Remember & Forgot -->

          <div class="flex items-center justify-between text-sm">

            <label class="flex items-center cursor-pointer">

              <input

                type="checkbox"

                class="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"

              />

              <span class="ml-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">

                Remember me

              </span>

            </label>



            <a

              href="/reset-password"

              class="font-medium hover:underline transition-colors"

              :class="isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'"

            >

              Forgot password?

            </a>

          </div>



          <!-- Submit -->

          <button

            type="submit"

            :disabled="loading"

            class="w-full py-3.5 px-6 font-medium rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-base"

            :class="loading 

              ? 'bg-gray-600 cursor-not-allowed' 

              : isDarkMode 

                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-700/20' 

                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'"

          >

            <span v-if="loading">

              <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">

                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>

                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"/>

              </svg>

              Signing in...

            </span>

            <span v-else>Sign In</span>

          </button>

        </form>



        <!-- Footer -->

        <div class="mt-10 text-center text-xs" :class="isDarkMode ? 'text-gray-500' : 'text-gray-500'">

          TERA Business Processes Management System — Version 1.0

          <div class="mt-1.5 flex justify-center gap-6 text-xs">

            <span>© 2026 TERA</span>

            <a href="#" class="hover:text-indigo-400 transition-colors">Privacy</a>

            <a href="#" class="hover:text-indigo-400 transition-colors">Terms</a>

          </div>

        </div>

      </div>

    </div>

  </div>

</template>



<script setup>

import { ref, onMounted } from 'vue'

import { useToast } from 'vue-toastification'

import axios from '@/axios'

import { useRouter } from 'vue-router'



const router = useRouter()

const toast = useToast()



const email = ref('')

const password = ref('')

const passwordVisible = ref(false)

const loading = ref(false)

const isDarkMode = ref(true)



onMounted(() => {

  // Load saved theme

  const saved = localStorage.getItem('theme_preference')

  if (saved) isDarkMode.value = saved === 'dark'

})



const toggleTheme = () => {

  isDarkMode.value = !isDarkMode.value

  localStorage.setItem('theme_preference', isDarkMode.value ? 'dark' : 'light')

}



const LoginMethod = async () => {

  if (!email.value.trim() || !password.value) {

    toast.warning('Please enter your email and password')

    return

  }



  loading.value = true



  try {

    const response = await axios.post('/api/auth/login', {

      email: email.value.trim(),

      password: password.value

    })



    const { token, user, role_id } = response.data



    localStorage.setItem('token', token)

    localStorage.setItem('user', JSON.stringify(user))

    localStorage.setItem('role_id', String(role_id))



    toast.success(`Welcome back, ${user.name}`)



    const roleRoutes = {

      1: '/dashboard',

      2: '/hod/dashboard',

      3: '/user/dashboard',

      4: '/tenders/dashboard',

      5: '/accountDash',

      6: '/hrDash',

      7: '/ceo/dashboard'

    }



    const route = roleRoutes[Number(role_id)]

    if (route) {

      await router.replace(route)

    } else {

      toast.error('Unknown user role')

      await router.replace('/')

    }

  } catch (err) {

    const msg = err.response?.data?.message || 'Login failed. Please check your credentials.'

    toast.error(msg)

  } finally {

    loading.value = false

  }

}

</script>



<style scoped>

/* Smooth theme transitions */

* {

  transition-property: background-color, border-color, color, box-shadow;

  transition-duration: 300ms;

  transition-timing-function: ease;

}



/* Input focus glow */

input:focus {

  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);

}



/* Scrollbar styling */

::-webkit-scrollbar {

  width: 6px;

}

::-webkit-scrollbar-track {

  background: transparent;

}

::-webkit-scrollbar-thumb {

  background: rgba(100, 116, 139, 0.4);

  border-radius: 3px;

}

.dark ::-webkit-scrollbar-thumb {

  background: rgba(148, 163, 184, 0.4);

}

</style>