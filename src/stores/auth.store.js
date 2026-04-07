import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import soceisiApi from '@/config/api/sociApi'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const isLoading = ref(false)
  const user = ref(null)
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
      toast.success(`${data.mesage}`)
      toast.success(`Nombre:${user.value.nombre} Rol:${user.value.rol}`)
      isLoading.value = false
      router.push('/admin')
      return { ok: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error de Conexion '
      toast.error(`${errorMessage}`)
      isLoading.value = false
    }
  }
  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('tokenUser')
    router.push('/login')
  }
  return { credentials, isLoading, isAuhenticated, login, logout, token, user }
})
