import { useAuthStore } from '@/stores/auth.store'
import axios from 'axios'

// La URL de producción se mantiene por defecto. Para probar contra el backend
// local: VITE_API_URL=http://localhost:3600/api (puerto definido en ../backend/.env)
const soceisiApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://soceisi-incsripcion-backend.vercel.app/api',
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
})

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
    const status = error.response?.status
    // El backend devuelve 403 cuando el JWT expira; el estándar es 401.
    // TODO(backend): devolver 401 para token ausente/expirado y 403 solo para permisos.
    if (status === 401 || status === 403) {
      localStorage.removeItem('tokenUser')
      localStorage.removeItem('userData')
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

export default soceisiApi
