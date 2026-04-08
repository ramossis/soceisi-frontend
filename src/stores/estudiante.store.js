import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { toast } from 'vue3-toastify'
import soceisiApi from '../config/api/sociApi'
import { reportFactura } from '@/utils/reportfactura'
import { generarFichaOficial } from '@/utils/fichaIncripcion'

//orm ''
export const useEstudianteStore = defineStore('estudiante', () => {
  const estudianteMsg = ref(null)
  const listaEstudiantes = ref([])
  const miembro = reactive({
    ci: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    cuidad: '',
    direccion: '',
    email: '',
    facultad: '',
    carrera: '',
    nombre_soce: '',
    semestre: '',
    matricula_univ: '',
    descripcion: '',
    foto_ci: null,
    matricula: null,
    registro_materia: null,
  })
  const inscripcion = reactive({
    monto: null,
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
      console.log('Datas backned', data.estudiante)
      toast.success('Registro enviado a la SOCEIISI correctamente')
      reportFactura(data.estudiante)
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
  const getEstudiantes = async () => {
    isLoading.value = true
    try {
      const { data } = await soceisiApi.get('/estudiante')
      listaEstudiantes.value = data
      isLoading.value = false
    } catch (error) {
      toast.error('Por Favor Cierra Sesion y vuelve a entrar')
      isLoading.value = false
    }
  }
  const inscribitMiembro = async (id) => {
    try {
      const { data } = await soceisiApi.post('/estudiante/confirmar-pago', {
        id_estudiante: id,
        monto: inscripcion.monto,
      })
      estudianteMsg.value = data.message
      toast.success(estudianteMsg.value)
    } catch (error) {
      console.log(error)
    }
  }
  const generarFicha = async (data) => {
    try {
      await generarFichaOficial(data)
    } catch (error) {
      toast.error(error)
    }
  }
  return {
    subimtFormMiembro,
    getEstudiantes,
    listaEstudiantes,
    inscribitMiembro,
    generarFicha,
    resetForm,
    isLoading,
    miembro,
    inscripcion,
    estudianteMsg,
  }
})
