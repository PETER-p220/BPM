/**
 * Optimized Authentication Service
 * Handles login/logout with better performance and error handling
 */

import AuthStorage from './authStorage'
import { optimizedRequest } from './api';

class AuthService {
  constructor() {
    this.requestTimeout = 15000; // 15 seconds timeout
    this.maxRetries = 2;
  }

  // Optimized login with timeout and retry
  async login(credentials, retryCount = 0) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

    try {
      const response = await optimizedRequest('/api/auth/login', {
        method: 'POST',
        data: credentials,
        signal: controller.signal,
        timeout: this.requestTimeout
      });

      clearTimeout(timeoutId);
      
      const { token, user, role_id } = response;
      
      // Batch set all auth data at once
      AuthStorage.setBatch({
        token,
        user: JSON.stringify(user),
        role_id: String(role_id)
      });

      return { success: true, user, role_id, token };
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Retry logic
      if (retryCount < this.maxRetries && this.shouldRetry(error)) {
        console.log(`Retrying login attempt ${retryCount + 1}`);
        await this.delay(1000 * (retryCount + 1));
        return this.login(credentials, retryCount + 1);
      }
      
      throw this.formatError(error);
    }
  }

  // Optimized logout with cleanup
  async logout() {
    try {
      // Show immediate feedback
      this.showLogoutFeedback();
      
      // Parallel operations for faster logout
      const [logoutResponse] = await Promise.allSettled([
        optimizedRequest('/api/auth/logout', {
          method: 'POST',
          data: {},
          timeout: 5000
        }),
        this.delay(100) // Small delay for visual feedback
      ]);

      // Clear auth data in batch
      AuthStorage.clearAuth();
      
      return { success: true };
      
    } catch (error) {
      // Still clear local data even if API fails
      AuthStorage.clearAuth();
      
      throw this.formatError(error);
    }
  }

  // Check if error should trigger retry
  shouldRetry(error) {
    if (!error.response) return false;
    
    const status = error.response.status;
    return status >= 500 || status === 408; // Server errors or timeout
  }

  // Show logout feedback
  showLogoutFeedback() {
    // Add visual feedback that logout is happening
    const loadingEl = document.createElement('div');
    loadingEl.className = 'fixed top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg z-50';
    loadingEl.innerHTML = 'Signing out...';
    document.body.appendChild(loadingEl);
    
    // Remove after redirect
    setTimeout(() => {
      if (document.body.contains(loadingEl)) {
        document.body.removeChild(loadingEl);
      }
    }, 2000);
  }

  // Format error consistently
  formatError(error) {
    if (error.response) {
      return {
        message: error.response.data?.message || 'Request failed',
        status: error.response.status,
        code: error.response.data?.code
      };
    }
    
    return {
      message: error.message || 'Network error',
      status: 0,
      code: 'NETWORK_ERROR'
    };
  }

  // Utility delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Check authentication status
  isAuthenticated() {
    return AuthStorage.isAuthenticated();
  }

  // Get current user
  getCurrentUser() {
    return AuthStorage.getUser();
  }

  // Get current role
  getCurrentRole() {
    return AuthStorage.getRoleId();
  }
}

export default new AuthService();
