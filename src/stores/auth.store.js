import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import soceisiApi from '@/config/api/sociApi'
import { toast } from 'vue3-toastify'

export const useAuthStore = defineStore('auth', () => {
  const isLoading = ref(false)
  const credentials = reactive({
    usuario: '',
    password: '',
  })
  const login = async () => {
    try {
      const { data } = await soceisiApi.post('/login', credentials)
      console.log(data)
    } catch (error) {
      console.error(error.response?.data)
    }
    isLoading.value = true
    isLoading.value = false
  }
  return { credentials, isLoading, login }
})
