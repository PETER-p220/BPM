<template>
  <div class="bg-gray-100 login" style="font-family: Garamond, serif;">
    <!-- Loading Overlay for Sign-in Process -->
    <div v-if="loading" class="loading-overlay flex items-center justify-center">
      <div class="shadow-lg p-6 bg-white rounded-lg text-white flex flex-col items-center justify-center max-w-md mx-auto" style="background-color: #5499c7;">
        <svg class="w-16 h-16 animate-spin mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"></path>
        </svg>
        <h1 class="text-lg font-bold mt-4 text-center">
          <img class="inline w-10 h-10 mr-2" src="../../assets/images/logo.png" alt="Logo" />
          {{ loadingMessage }}
        </h1>
        <img class="h-20 mx-auto mt-4" src="../../assets/images/logo.png" alt="Logo" />
      </div>
    </div>

    <!-- Show login section only if cookies are accepted -->
    <section v-if="cookiesAccepted && !loading" class="flex items-center h-screen bg-gray-100 dark:bg-gray-900">
      <!-- Left Image Section -->
      <div class="hidden w-1/2 h-full bg-center bg-cover md:block" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;">
        <img src="../../assets/images/bpmhomeimg.svg" alt="Logo" style="box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;" />
      </div>

      <!-- Right Login Form Section -->
      <div class="flex items-center justify-center w-full h-full px-4 py-6 bg-white md:w-1/2 form-container" style="box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px;">
        <div class="w-full max-w-md p-8 space-y-4 bg-white rounded-lg" style="box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;">
          <a href="/" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img class="h-20 mx-auto text-center w-30" src="../../assets/images/logo.png" alt="Logo" />
          </a>

          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <!-- Email/Password Form -->
            <form class="space-y-4 md:space-y-6" @submit.prevent="LoginMethod">
              <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style="font-family: 'Lora', serif">Your email</label>
                <input type="email" name="email" id="email" class="border text-gray-800 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required v-model="email" />
              </div>
              <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style="font-family: 'Lora', serif">Password</label>
                <div class="relative">
                  <input :type="passwordVisible ? 'text' : 'password'" name="password" id="password" placeholder="••••••••" class="border border-gray-600 text-gray-800 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500" required v-model="password" />
                  <span class="absolute transform -translate-y-1/2 cursor-pointer right-3 top-1/2" @click="togglePasswordVisibility">
                    <i :class="passwordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                  </span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <a href="/reset-password" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500" style="font-family: 'Lora', serif">Forgot password?</a>
              </div>
              <button type="submit" class="relative w-full text-white bg-gray-800 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:hover:bg-primary-700 dark:focus:ring-primary-800" :disabled="loading" style="background-color: #283747;">
                <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
                  <svg class="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"></path>
                  </svg>
                </span>
                <span v-else>Login</span>
              </button>
            </form>

            <!-- Google OAuth Button -->
            <div class="mt-6">
              <button @click="loginWithGoogle" class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center">
                <i class="fas fa-sign-in-alt text-xl text-white mr-2"></i>
                Continue with Google
              </button>
            </div>
          </div>
          <p class="text-center" style="color:#1c2833; font-weight:bold; font-family: 'Lora', serif; font-style:italic;">Business processes management system, version-1.0</p>
        </div>
      </div>
    </section>

    <!-- Cookie Consent Banner -->
    <div v-if="!cookiesAccepted && !loading" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <h2 class="text-lg font-bold mb-4">Cookie Consent Required</h2>
        <p class="mb-4">We use cookies to improve your experience. Please accept cookies to continue.</p>
        <button @click="acceptCookies" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Accept Cookies</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import axios from '../../axios.js'; 
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const passwordVisible = ref(false);
const loading = ref(true);
const loadingMessage = ref('WELCOME TO TERA BUSINESS PROCESSES MANAGEMENT SYSTEM');
const cookiesAccepted = ref(false);
const toast = useToast();
const router = useRouter();

onMounted(() => {
  cookiesAccepted.value = localStorage.getItem('cookie_consent') === 'true';
  setTimeout(() => {
    loading.value = false;
  }, 2000);
});

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const LoginMethod = async () => {
  loading.value = true;
  loadingMessage.value = 'Signing you in...';
  
  try {
    const response = await axios.post('api/auth/login', {
      email: email.value,
      password: password.value,
    });

    const token = response.data.token;
    const user = response.data.user;
    // Use Number() to ensure proper conversion
    const role_id = Number(response.data.role_id || user.role_id);

    console.log('Login successful:', {
      role_id,
      type: typeof role_id,
      user: user.name,
      email: user.email
    });

    // Store authentication data BEFORE navigation
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role_id', String(role_id));

    // Use router.replace to prevent back button issues
    if (role_id === 1) {
        console.log('Redirecting to admin dashboard');
        await router.replace('/dashboard');
    } else if (role_id === 2) {
        console.log('Redirecting to HOD dashboard');
        await router.replace('/hod/dashboard');
    } else if (role_id === 3) {
        console.log('Redirecting to user dashboard');
        await router.replace('/user/dashboard');
    } else if (role_id === 4) {
        console.log('Redirecting to tenders dashboard');
        await router.replace('/tenders/dashboard');
    } else if (role_id === 5) {
        console.log('Redirecting to accountant dashboard');
        await router.replace('/accountDash');
    } else if (role_id === 6) {
        console.log('Redirecting to HR dashboard');
        await router.replace('/hrDash');
    } else {
        console.error('Unknown role_id:', role_id);
        toast.error('Invalid user role. Please contact support.');
        await router.replace('/');
    }
  } catch (error) {
    console.error("Login error:", error.response?.data || error);
    toast.error(error.response?.data.message || "Login failed.");
  } finally {
    loading.value = false;
    loadingMessage.value = 'WELCOME TO TERA BUSINESS PROCESSES MANAGEMENT SYSTEM';
  }
};

const loginWithGoogle = async () => {
  loading.value = true;
  loadingMessage.value = 'Redirecting to Google...';
  
  try {
    const response = await axios.get('/api/auth/google/redirect');
    
    if (response.data.token) {
      const token = response.data.token;
      const user = response.data.user;
      const role_id = Number(response.data.role_id);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role_id', String(role_id));

      console.log('Google login successful:', { role_id, user: user.name });

      if (role_id === 1) {
          await router.replace('/dashboard'); //admin
      } else if (role_id === 2) {
          await router.replace('/hod/dashboard'); //hod
      } else if (role_id === 3) {
          await router.replace('/user/dashboard'); //engineer
      } else if (role_id === 4) {
          await router.replace('/tenders/dashboard'); //tenders
      } else if (role_id === 5) {
          await router.replace('/accountDash'); //accountant
      } else if (role_id === 6) {
          await router.replace('/hrDash'); //hr
      }
    } else if (response.data.url) {
      window.location.href = response.data.url;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Google login failed:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || 'Google login failed. Please try again.';
    toast.error(errorMessage);
  } finally {
    if (!response?.data?.url) {
      loading.value = false;
      loadingMessage.value = 'WELCOME TO TERA BUSINESS PROCESSES MANAGEMENT SYSTEM';
    }
  }
};

const acceptCookies = async () => {
  try {
    await axios.post('/api/accept-cookies');
    localStorage.setItem('cookie_consent', 'true');
    cookiesAccepted.value = true;
  } catch (error) {
    console.error('Error accepting cookies:', error);
    toast.error('Failed to accept cookies. Please try again.');
  }
};
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}
</style>