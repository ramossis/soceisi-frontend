import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import soceisiApi from '@/config/api/sociApi'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'

const USER_KEY = 'userData'

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const isLoading = ref(false)
  const user = ref(readStoredUser())
  const token = ref(localStorage.getItem('tokenUser') || null)

  const isAuhenticated = computed(() => !!token.value)

  const credentials = reactive({
    usuario: '',
    password: '',
  })
  const login = async () => {
    isLoading.value = true
    try {
      const { data } = await soceisiApi.post('/login', credentials)
      token.value = data.token
      user.value = { nombre: data.usuario.nombre, rol: data.usuario.rol }
      localStorage.setItem('tokenUser', token.value)
      localStorage.setItem(USER_KEY, JSON.stringify(user.value))
      // TODO(backend): el backend escribe "mesage"; estandarizar a "message".
      toast.success(`${data.message || data.mesage || 'Bienvenido'}`)
      toast.success(`Nombre:${user.value.nombre} Rol:${user.value.rol}`)
      isLoading.value = false
      router.push('/admin')
      return { ok: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error de Conexion '
      toast.error(`${errorMessage}`)
      isLoading.value = false
      return { ok: false, error: errorMessage }
    }
  }
  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('tokenUser')
    localStorage.removeItem(USER_KEY)
    router.push('/login')
  }
  return { credentials, isLoading, isAuhenticated, login, logout, token, user }
})
