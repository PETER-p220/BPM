import axios from 'axios'
import AuthStorage from './utils/authStorage'

const instance = axios.create({
  baseURL: 'http://localhost:8000/',
  // baseURL: 'https://bpm.teratech.co.tz/',
})

// Add a request interceptor to include the token in headers
instance.interceptors.request.use((config) => {
  const token = AuthStorage.getItem('token'); // Use optimized storage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Attach token to headers
  }
  return config;
}, (error) => {
  return Promise.reject(error); // Handle any errors that occur
});

// Response interceptor to handle unauthorized access
instance.interceptors.response.use(response => {
  return response; // Return the response if successful
}, error => {
  if (error.response && error.response.status === 401) {
    console.error('Unauthorized, redirecting to login');
    AuthStorage.clearAuth(); // Use optimized storage
    window.location.href = '/'; // Redirect to login page
  }
  return Promise.reject(error); // Handle any other errorsyy
});

export default instance;






