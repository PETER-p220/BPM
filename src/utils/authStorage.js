/**
 * Optimized Authentication Storage Utility
 * Reduces localStorage operations and improves performance
 */

class AuthStorage {
  constructor() {
    this.cache = new Map();
    this.initialized = false;
  }

  // Initialize with cached values
  init() {
    if (this.initialized) return;
    
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const role_id = localStorage.getItem('role_id');
      const theme = localStorage.getItem('theme_preference');
      
      if (token) this.cache.set('token', token);
      if (user) this.cache.set('user', user);
      if (role_id) this.cache.set('role_id', role_id);
      if (theme) this.cache.set('theme_preference', theme);
      
      this.initialized = true;
    } catch (error) {
      console.warn('AuthStorage init failed:', error);
    }
  }

  // Get cached value or fallback to localStorage
  getItem(key) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    try {
      const value = localStorage.getItem(key);
      if (value !== null) {
        this.cache.set(key, value);
      }
      return value;
    } catch (error) {
      console.warn(`Failed to get ${key}:`, error);
      return null;
    }
  }

  // Set value in both cache and localStorage
  setItem(key, value) {
    this.cache.set(key, value);
    
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Failed to set ${key}:`, error);
    }
  }

  // Remove value from both cache and localStorage
  removeItem(key) {
    this.cache.delete(key);
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove ${key}:`, error);
    }
  }

  // Batch operations for better performance
  setBatch(items) {
    const operations = [];
    
    items.forEach((value, key) => {
      this.cache.set(key, value);
      operations.push(() => localStorage.setItem(key, value));
    });

    try {
      operations.forEach(op => op());
    } catch (error) {
      console.warn('Batch set failed:', error);
    }
  }

  clearBatch(keys) {
    const operations = [];
    
    keys.forEach(key => {
      this.cache.delete(key);
      operations.push(() => localStorage.removeItem(key));
    });

    try {
      operations.forEach(op => op());
    } catch (error) {
      console.warn('Batch clear failed:', error);
    }
  }

  // Clear all auth data
  clearAuth() {
    this.cache.clear();
    this.clearBatch(['token', 'user', 'role_id']);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getItem('token');
  }

  // Get user data
  getUser() {
    const userStr = this.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get role ID
  getRoleId() {
    return this.getItem('role_id');
  }
}

export default new AuthStorage();
