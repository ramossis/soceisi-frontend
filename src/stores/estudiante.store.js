import { reactive } from 'vue'
import { defineStore } from 'pinia'
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
    nombre_soce: '',
    semestre: '',
    matriuula_univ: '',
    descripcion: '',
    foto_ci: '',
    matricula: '',
    registro_materia: '',
  })
  const isLoading = ref(false)
  const subimtFormMiembro = async () => {
    isLoading.value = true
    try {
      const fromData = new FormData()
      Object.keys(miembro).forEach((key) => {
        if (!['foto_ci', 'matrciula', 'registro_materia'].includes(key)) {
          fromData.append(key, miembro[key] || '')
        }
      })
      if (miembro.foto_ci?.[0]) {
        formData.append('foto_ci', miembro.foto_ci[0])
      }
      if (miembro.matricula?.[0]) {
        formData.append('matricula', miembro.matricula[0])
      }
      if (miembro.registro_materia?.[0]) {
        formData.append('registro_materia', miembro.registro_materia[0])
      }

      const { data } = await soceisiApi.post('/registro', formData)
      alert(`${data}`)
      return { ok: true, data }
    } catch (error) {
      console.log(error)
      return { ok: false, error }
    } finally {
      isLoading.value = false
    }
  }
  return { subimtFormMiembro, isLoading, miembro }
})
