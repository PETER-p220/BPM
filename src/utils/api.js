// API Utility with Caching and Request Optimization
import axios from '@/axios'

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const cache = new Map()

// Request deduplication
const pendingRequests = new Map()

// Cache helpers
const getCachedData = (key) => {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}

const clearCache = (pattern) => {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key)
      }
    }
  } else {
    cache.clear()
  }
}

// Optimized request function with caching and deduplication
export const optimizedRequest = async (url, options = {}) => {
  const cacheKey = `${url}:${JSON.stringify(options)}`
  
  // Check cache first
  const cachedData = getCachedData(cacheKey)
  if (cachedData && !options.skipCache) {
    return cachedData
  }

  // Check if request is already pending
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)
  }

  // Make the request
  const requestPromise = axios(url, options)
    .then(response => {
      const data = response.data
      
      // Cache successful responses
      if (!options.skipCache) {
        setCachedData(cacheKey, data)
      }
      
      return data
    })
    .catch(error => {
      // Don't cache errors
      throw error
    })
    .finally(() => {
      // Clean up pending request
      pendingRequests.delete(cacheKey)
    })

  // Store pending request
  pendingRequests.set(cacheKey, requestPromise)

  return requestPromise
}

// Batch multiple requests
export const batchRequests = async (requests) => {
  const results = await Promise.allSettled(
    requests.map(({ url, options }) => optimizedRequest(url, options))
  )
  
  return results.map((result, index) => ({
    url: requests[index].url,
    status: result.status,
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason : null
  }))
}

// Request with retry
export const requestWithRetry = async (url, options = {}, maxRetries = 3) => {
  let lastError
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await optimizedRequest(url, options)
    } catch (error) {
      lastError = error
      
      // Don't retry on 4xx errors
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }
  
  throw lastError
}

// Export cache utilities
export { clearCache }

// Request interceptor for logging
axios.interceptors.request.use(
  (config) => {
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for logging and performance monitoring
axios.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime
    
    // Log slow requests
    if (duration > 2000) {
      console.warn(`Slow API request: ${response.config.url} took ${duration}ms`)
    }
    
    return response
  },
  (error) => {
    // Log errors
    console.error(`API request failed: ${error.config?.url}`, error)
    return Promise.reject(error)
  }
)

export default {
  optimizedRequest,
  batchRequests,
  requestWithRetry,
  clearCache
}
