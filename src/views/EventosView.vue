<template>
  <div>
    <v-card rounded="xl" elevation="3" class="pa-4 pa-md-6">
      <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-4">
        <div>
          <h2 class="text-h5 font-weight-bold text-indigo-darken-4 mb-1">Gestión de Eventos</h2>
          <p class="text-body-2 text-grey-darken-1 mb-0">
            Crea cursos, talleres, charlas o asambleas y comparte su QR de asistencia.
          </p>
        </div>
        <v-btn color="primary" prepend-icon="mdi-plus" rounded="lg" @click="abrirCrear">
          Nuevo Evento
        </v-btn>
      </div>

      <v-data-table
        :headers="headers"
        :items="eventos"
        :loading="isLoading"
        item-value="id"
        class="elevation-0"
        no-data-text="Todavía no hay eventos registrados"
      >
        <template v-slot:item.nombre="{ item }">
          <span class="font-weight-bold">{{ item.nombre }}</span>
        </template>
        <template v-slot:item.tipo="{ item }">
          <v-chip :color="tipoInfo(item.tipo).color" size="small" label>
            <v-icon start size="14">{{ tipoInfo(item.tipo).icon }}</v-icon>
            {{ item.tipo }}
          </v-chip>
        </template>
        <template v-slot:item.fecha="{ item }">
          {{ formatFecha(item.fecha) }}
        </template>
        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-center ga-1">
            <v-btn
              icon="mdi-qrcode"
              size="small"
              variant="text"
              color="primary"
              title="Ver QR de asistencia"
              @click="abrirQr(item)"
            ></v-btn>
            <v-btn
              icon="mdi-pencil-outline"
              size="small"
              variant="text"
              color="indigo"
              title="Editar evento"
              @click="abrirEditar(item)"
            ></v-btn>
            <v-btn
              icon="mdi-trash-can-outline"
              size="small"
              variant="text"
              color="red"
              title="Eliminar evento"
              @click="abrirEliminar(item)"
            ></v-btn>
          </div>
        </template>
      </v-data-table>

      <!--
        TODO(backend): agregar GET /api/asistencia?eventoId=... para mostrar
        el listado de asistentes de cada evento en este panel.
      -->
    </v-card>

    <v-dialog v-model="dialogForm" max-width="560">
      <v-card rounded="xl">
        <v-toolbar color="primary" flat>
          <v-toolbar-title>{{ editando ? 'Editar Evento' : 'Nuevo Evento' }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" @click="dialogForm = false"></v-btn>
        </v-toolbar>

        <v-card-text class="pa-6">
          <v-form ref="formRef" v-model="isValidForm" @submit.prevent="guardar">
            <v-text-field
              v-model="form.nombre"
              label="Nombre del evento"
              prepend-inner-icon="mdi-calendar-text"
              variant="outlined"
              density="comfortable"
              :rules="[(v) => !!v?.trim() || 'El nombre es obligatorio']"
            ></v-text-field>

            <v-select
              v-model="form.tipo"
              label="Tipo de evento"
              prepend-inner-icon="mdi-shape-outline"
              :items="tipos"
              variant="outlined"
              density="comfortable"
              :rules="[(v) => !!v || 'Selecciona el tipo']"
            ></v-select>

            <v-text-field
              v-model="form.fecha"
              label="Fecha"
              type="date"
              prepend-inner-icon="mdi-calendar"
              variant="outlined"
              density="comfortable"
              :rules="[(v) => !!v || 'La fecha es obligatoria']"
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions class="px-6 pb-4">
          <v-btn variant="text" color="grey" @click="dialogForm = false">Cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="elevated"
            rounded="lg"
            :loading="isSaving"
            :disabled="!isValidForm"
            @click="guardar"
          >
            {{ editando ? 'Guardar cambios' : 'Crear evento' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogQr" max-width="540">
      <v-card v-if="eventoSeleccionado" rounded="xl">
        <v-toolbar color="primary" flat>
          <v-toolbar-title>QR de Asistencia</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" @click="dialogQr = false"></v-btn>
        </v-toolbar>

        <v-card-text class="pa-6 text-center">
          <v-chip :color="tipoInfo(eventoSeleccionado.tipo).color" size="small" label class="mb-2">
            {{ eventoSeleccionado.tipo }}
          </v-chip>
          <h3 class="text-h5 font-weight-bold text-indigo-darken-4 mb-1">
            {{ eventoSeleccionado.nombre }}
          </h3>
          <p class="text-body-2 text-grey-darken-1 mb-4">
            {{ formatFecha(eventoSeleccionado.fecha) }}
          </p>

          <v-img
            v-if="qrDataUrl"
            :src="qrDataUrl"
            width="280"
            class="mx-auto my-4 rounded-lg border"
            alt="QR de asistencia"
          ></v-img>

          <v-text-field
            :model-value="qrLink"
            label="Enlace de asistencia"
            readonly
            variant="outlined"
            density="comfortable"
            append-inner-icon="mdi-content-copy"
            @click:append-inner="copiarEnlace"
          ></v-text-field>

          <v-alert type="info" variant="tonal" density="compact" class="text-left">
            El miembro escanea el QR o abre el enlace, escribe su CI y la asistencia queda asociada
            automáticamente a este evento.
          </v-alert>
        </v-card-text>

        <v-card-actions class="px-6 pb-4">
          <v-btn
            variant="tonal"
            color="primary"
            prepend-icon="mdi-content-copy"
            @click="copiarEnlace"
          >
            Copiar enlace
          </v-btn>
          <v-btn variant="tonal" color="indigo" prepend-icon="mdi-download" @click="descargarQr">
            Descargar QR
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" prepend-icon="mdi-open-in-new" @click="abrirPagina">
            Abrir página
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="440">
      <v-card rounded="xl">
        <v-card-title class="text-h6 font-weight-bold pt-6 px-6">
          ¿Eliminar este evento?
        </v-card-title>
        <v-card-text class="px-6 text-grey-darken-1">
          Se eliminará <strong>{{ eventoSeleccionado?.nombre }}</strong
          >. Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions class="px-6 pb-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="grey" @click="dialogDelete = false">Cancelar</v-btn>
          <v-btn color="red" variant="elevated" :loading="isSaving" @click="confirmarEliminar">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import QRCode from 'qrcode'
import { toast } from 'vue3-toastify'
import { useEventoStore } from '@/stores/evento.store'

const eventoStore = useEventoStore()
const { eventos, isLoading } = storeToRefs(eventoStore)
const router = useRouter()

const tipos = ['Curso', 'Taller', 'Charla', 'Asamblea']
const tipoConfig = {
  Curso: { color: 'primary', icon: 'mdi-school' },
  Taller: { color: 'success', icon: 'mdi-tools' },
  Charla: { color: 'info', icon: 'mdi-microphone' },
  Asamblea: { color: 'warning', icon: 'mdi-account-voice' },
}

const dialogForm = ref(false)
const dialogQr = ref(false)
const dialogDelete = ref(false)
const editando = ref(null)
const eventoSeleccionado = ref(null)
const qrDataUrl = ref('')
const qrLink = ref('')
const isSaving = ref(false)
const isValidForm = ref(false)
const formRef = ref(null)

const form = reactive({
  nombre: '',
  tipo: 'Curso',
  fecha: '',
})

const headers = [
  { title: 'Evento', key: 'nombre', sortable: true },
  { title: 'Tipo', key: 'tipo', sortable: true },
  { title: 'Fecha', key: 'fecha', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' },
]

const tipoInfo = (tipo) => tipoConfig[tipo] || { color: 'grey', icon: 'mdi-calendar' }

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const resetForm = () => {
  form.nombre = ''
  form.tipo = 'Curso'
  form.fecha = ''
}

const abrirCrear = async () => {
  editando.value = null
  resetForm()
  dialogForm.value = true
  await nextTick()
  formRef.value?.resetValidation()
}

const abrirEditar = async (evento) => {
  editando.value = evento
  form.nombre = evento.nombre
  form.tipo = evento.tipo
  form.fecha = evento.fecha ? evento.fecha.slice(0, 10) : ''
  dialogForm.value = true
  await nextTick()
  formRef.value?.resetValidation()
}

const guardar = async () => {
  if (!formRef.value) return
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const fecha = new Date(`${form.fecha}T12:00:00`)
  if (Number.isNaN(fecha.getTime())) {
    toast.error('La fecha ingresada no es válida')
    return
  }

  isSaving.value = true
  const payload = {
    nombre: form.nombre.trim(),
    tipo: form.tipo,
    fecha: fecha.toISOString(),
  }

  const resultado = editando.value
    ? await eventoStore.actualizarEvento(editando.value.id, payload)
    : await eventoStore.crearEvento(payload)

  isSaving.value = false
  if (resultado.ok) {
    dialogForm.value = false
  }
}

const abrirEliminar = (evento) => {
  eventoSeleccionado.value = evento
  dialogDelete.value = true
}

const confirmarEliminar = async () => {
  if (!eventoSeleccionado.value) return
  isSaving.value = true
  const resultado = await eventoStore.eliminarEvento(eventoSeleccionado.value.id)
  isSaving.value = false
  if (resultado.ok) {
    dialogDelete.value = false
  }
}

const construirEnlace = (evento) => {
  // TODO(backend): reemplazar los query params por GET /api/evento/public/:id
  // cuando exista un endpoint público que devuelva los datos del evento.
  const href = router.resolve({
    name: 'Asistencia',
    params: { eventoId: evento.id },
    query: { nombre: evento.nombre, tipo: evento.tipo },
  }).href

  return new URL(href, window.location.origin).toString()
}

const abrirQr = async (evento) => {
  eventoSeleccionado.value = evento
  qrLink.value = construirEnlace(evento)
  qrDataUrl.value = ''
  dialogQr.value = true

  try {
    qrDataUrl.value = await QRCode.toDataURL(qrLink.value, {
      width: 360,
      margin: 2,
      color: {
        dark: '#0056D2',
        light: '#FFFFFF',
      },
    })
  } catch {
    toast.error('No se pudo generar el código QR')
  }
}

const copiarEnlace = async () => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(qrLink.value)
    } else {
      const input = document.createElement('textarea')
      input.value = qrLink.value
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
    }
    toast.success('Enlace copiado')
  } catch {
    toast.error('No se pudo copiar el enlace. Cópialo manualmente.')
  }
}

const descargarQr = () => {
  if (!qrDataUrl.value) return
  const nombreArchivo = (eventoSeleccionado.value?.nombre || 'evento')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const enlace = document.createElement('a')
  enlace.href = qrDataUrl.value
  enlace.download = `qr-asistencia-${nombreArchivo || 'evento'}.png`
  enlace.click()
}

const abrirPagina = () => {
  if (qrLink.value) {
    window.open(qrLink.value, '_blank', 'noopener')
  }
}

onMounted(() => {
  eventoStore.getEventos()
})
</script>

<style scoped>
.border {
  border: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
