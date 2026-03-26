import { reactive } from 'vue'
import { defineStore } from 'pinia'

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
  const subimtFormMiembro = () => {
    console.log('Holaaaa')
    console.log({ ...miembro })
    alert('Exito!!!')
  }
  return { subimtFormMiembro, miembro }
})
