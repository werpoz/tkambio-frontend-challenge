import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add request interceptor to handle CSRF token
api.interceptors.request.use(async (config) => {
  // Get CSRF cookie before making authenticated requests
  await axios.get(`${import.meta.env.VITE_API_URL}/sanctum/csrf-cookie`, { withCredentials: true })
  return config
})

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('isAuthenticated')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/login', { email, password })
    const { access_token } = response.data
    localStorage.setItem('token', access_token)
    localStorage.setItem('isAuthenticated', 'true')
    return response.data
  } catch (error) {
    throw error
  }
}

export const logout = async () => {
  try {
    await api.post('/api/logout')
    localStorage.removeItem('token')
    localStorage.removeItem('isAuthenticated')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true'
}

export const fetchUserData = async () => {
  try {
    const response = await api.get('/api/user')
    return response.data
  } catch (error) {
    throw error
  }
}