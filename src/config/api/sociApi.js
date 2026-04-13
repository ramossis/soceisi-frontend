import { useAuthStore } from '@/stores/auth.store'
import axios from 'axios'

const soceisiApi = axios.create({
  baseURL: 'https://soceisi-incsripcion-backend.vercel.app/api',
  timeOut: 1000,
  Headers: {
    Accept: 'application/json',
  },
})

// soceisiApi.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.log(`Error en la peticion:`, error.response?.data || error.message)
//     return Promise.reject(error)
//   },
// )

soceisiApi.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
soceisiApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href('/login')
    }
    return Promise.reject(error)
  },
)
export default soceisiApi
