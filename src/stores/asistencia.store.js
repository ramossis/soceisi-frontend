import { ref } from 'vue'
import { defineStore } from 'pinia'
import soceisiApi from '@/config/api/sociApi'

const normalizarError = (raw, status) => {
  if (!raw) return 'No se pudo registrar la asistencia'
  if (/undefined/i.test(raw) || /Ya registraste/i.test(raw)) {
    return 'Ya registraste tu asistencia a este evento.'
  }
  if (status === 404 || /No se encontro un registro/i.test(raw)) {
    return 'No se encontró un miembro registrado con ese CI.'
  }
  return raw
}

export const useAsistenciaStore = defineStore('asistencia', () => {
  const isLoading = ref(false)

  // TODO(backend): corregir el controlador de asistencia (id_evento, await,
  // miembro.nombres) y devolver 409 para duplicados.
  const registrarAsistencia = async ({ eventoId, ci }) => {
    isLoading.value = true
    try {
      const { data } = await soceisiApi.post('/asistencia', {
        eventoId: Number(eventoId),
        ci: ci.trim(),
      })
      return { ok: true, message: data.message, data: data.data }
    } catch (error) {
      const raw = error.response?.data?.error
      const message = normalizarError(raw, error.response?.status)
      return { ok: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, registrarAsistencia }
})
