// Dashboard API Service
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

class DashboardService {
  // Get auth token
  getAuthToken() {
    return localStorage.getItem('token')
  }

  // Get dashboard statistics
  async getDashboardStats() {
    // Use mock data in development or when no auth
    if (USE_MOCK_DATA) {
      console.log('Using mock dashboard data')
      return {
        tenders: { active: 24, total: 500 },
        projects: { active: 18, total: 1200 },
        approvals: { pending: 7 },
        completion: { rate: 94 }
      }
    }

    try {
      const token = this.getAuthToken()
      if (!token) {
        console.log('No token found, returning mock data')
        return {
          tenders: { active: 24, total: 500 },
          projects: { active: 18, total: 1200 },
          approvals: { pending: 7 },
          completion: { rate: 94 }
        }
      }

      const response = await axios.get(`${API_BASE}/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      // Return mock data as fallback
      return {
        tenders: { active: 24, total: 500 },
        projects: { active: 18, total: 1200 },
        approvals: { pending: 7 },
          completion: { rate: 94 }
      }
    }
  }

  // Get recent activities
  async getRecentActivities() {
    try {
      const response = await axios.get(`${API_BASE}/dashboard/activities`)
      return response.data
    } catch (error) {
      console.error('Error fetching activities:', error)
      return []
    }
  }

  // Get system health
  async getSystemHealth() {
    try {
      const response = await axios.get(`${API_BASE}/dashboard/health`)
      return response.data
    } catch (error) {
      console.error('Error fetching system health:', error)
      return { uptime: 99.9 }
    }
  }
}

export default new DashboardService()
