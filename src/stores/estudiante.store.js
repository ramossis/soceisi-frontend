import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { toast } from 'vue3-toastify'
import soceisiApi from '../config/api/sociApi'

//orm ''
export const useEstudianteStore = defineStore('estudiante', () => {
  const miembro = reactive({
    ci: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    ciudad: '',
    direccion: '',
    email: '',
    facultad: '',
    carrera: '',
    nombre_soce: 'SOCIEISII',
    semestre: '',
    matricula_univ: '',
    descripcion: '',
    foto_ci: null,
    matricula: null,
    registro_materia: null,
  })
  const isLoading = ref(false)
  const subimtFormMiembro = async () => {
    isLoading.value = true
    try {
      const formData = new FormData()
      console.log('Estado actual del miembro', { ...miembro })

      Object.keys(miembro).forEach((key) => {
        if (!['foto_ci', 'matricula', 'registro_materia'].includes(key)) {
          let valor = miembro[key]

          if (key === 'fecha_nacimiento' && valor) {
            valor = new Date(valor).toISOString()
          }
          formData.append(key, valor || '')
        }
      })
      const procesarArchivo = (campo) => {
        if (!campo) return null
        // Si es un array (común en Vuetify), tomamos el primero. Si no, el objeto mismo.
        return Array.isArray(campo) ? campo[0] : campo
      }

      const fileCi = procesarArchivo(miembro.foto_ci)
      const fileMat = procesarArchivo(miembro.matricula)
      const fileReg = procesarArchivo(miembro.registro_materia)

      if (fileCi) formData.append('foto_ci', fileCi)
      if (fileMat) formData.append('matricula', fileMat)
      if (fileReg) formData.append('registro_materia', fileReg)

      const { data } = await soceisiApi.post('/estudiante', formData)
      toast.success('Registro enviado a la SOCEIISI correctamente')
      resetForm()
      return { ok: true, data }
    } catch (error) {
      console.log(error)
      const errorMsg = error.response?.data?.error || 'Error al conectar con el servidor'
      toast.error(errorMsg)
      return { ok: false, error }
    } finally {
      isLoading.value = false
    }
  }
  const resetForm = () => {
    Object.keys(miembro).forEach((key) => {
      if (typeof miembro[key] === 'string') {
        miembro[key] = ' '
      } else {
        miembro[key] = null
      }
    })
  }
  return { subimtFormMiembro, isLoading, resetForm, miembro }
})
