<template>
    <div class="login-container">
      <h1>Processing Google Login...</h1>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p>Please wait while we log you in.</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from '../../axios.js'; // Ensure this path is correct
  import { useRouter } from 'vue-router';
  
  // Reactive state for error messages
  const errorMessage = ref('');
  const router = useRouter();
  
  onMounted(async () => {
    try {
      // Log query params for debugging
      const queryParams = router.currentRoute.value.query;
      console.log('Callback query params:', queryParams);
  
      // Ensure 'code' is present from Google redirect
      if (!queryParams.code) {
        throw new Error('No authorization code received from Google.');
      }
  
      // Send callback request to backend
      const response = await axios.get('/api/auth/google/callback', {
        params: queryParams,
      });
  
      // Validate response structure
      if (response.data && response.data.token && response.data.user) {
        const { token, user, role_id } = response.data;
  
        // Store token and user in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
  
        // Navigate based on role_id
        switch (parseInt(role_id)) {
          case 1:
            router.push('/dashboard');
            break;
          case 2:
            router.push('/tenders/dashboard');
            break;
          case 3:
            router.push('/user/dashboard');
            break;
          case 4:
            router.push('/accountDash');
            break;
          default:
            router.push('/');
            break;
        }
      } else {
        throw new Error('Invalid response from server.');
      }
    } catch (error) {
      // Enhanced error handling
      const message =
        error.response?.data?.message ||
        error.message ||
        'Google login failed. Please try again.';
      console.error('Google login failed:', error);
      errorMessage.value = message;
  
      // Delay redirect to show error to user
      setTimeout(() => {
        router.push('/');
      }, 2000); // 2-second delay
    }
  });
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  
  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  p {
    font-size: 16px;
  }
  </style>