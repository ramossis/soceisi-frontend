import { ref } from 'vue'
import { defineStore } from 'pinia'
import { toast } from 'vue3-toastify'
import soceisiApi from '@/config/api/sociApi'

// TODO(backend): agregar GET /api/asistencia?eventoId= para poder listar
// los asistentes de cada evento desde el panel administrativo.
export const useEventoStore = defineStore('evento', () => {
  const eventos = ref([])
  const isLoading = ref(false)

  const getEventos = async () => {
    isLoading.value = true
    try {
      const { data } = await soceisiApi.get('/evento')
      eventos.value = data.data || []
      return { ok: true }
    } catch (error) {
      const message = error.response?.data?.error || 'No se pudieron cargar los eventos'
      toast.error(message)
      return { ok: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  const crearEvento = async (payload) => {
    isLoading.value = true
    try {
      const { data } = await soceisiApi.post('/evento', payload)
      toast.success(data.message || 'Evento creado correctamente')
      await getEventos()
      return { ok: true, evento: data.evento }
    } catch (error) {
      const message = error.response?.data?.error || 'No se pudo crear el evento'
      toast.error(message)
      return { ok: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  const actualizarEvento = async (id, payload) => {
    isLoading.value = true
    try {
      const { data } = await soceisiApi.put(`/evento/${id}`, payload)
      toast.success(data.message || 'Evento actualizado correctamente')
      await getEventos()
      return { ok: true, evento: data.data }
    } catch (error) {
      const message = error.response?.data?.error || 'No se pudo actualizar el evento'
      toast.error(message)
      return { ok: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  const eliminarEvento = async (id) => {
    isLoading.value = true
    try {
      const { data } = await soceisiApi.delete(`/evento/${id}`)
      toast.success(data.message || 'Evento eliminado correctamente')
      await getEventos()
      return { ok: true }
    } catch (error) {
      // TODO(backend): con relationMode="prisma" el backend debe borrar las
      // asistencias del evento antes de eliminarlo, o usar FKs con cascade.
      const message = error.response?.data?.error || 'No se pudo eliminar el evento'
      toast.error(message)
      return { ok: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  return { eventos, isLoading, getEventos, crearEvento, actualizarEvento, eliminarEvento }
})
