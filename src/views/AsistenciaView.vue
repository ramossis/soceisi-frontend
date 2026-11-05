<template>
  <v-container fluid class="fill-height bg-grey-lighten-4 pa-4 pa-md-6">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="6" lg="5">
        <v-card rounded="xl" elevation="12" class="overflow-hidden">
          <v-toolbar color="primary" height="auto" class="py-4 px-2">
            <v-avatar size="48" class="ml-2 mr-3 bg-white pa-1">
              <v-img src="/Logo-SoCiE-ISII.png" alt="SOCIE-ISII"></v-img>
            </v-avatar>
            <div class="d-flex flex-column">
              <span class="text-h6 font-weight-bold">Registro de Asistencia</span>
              <span class="text-caption text-uppercase">SOCIE-ISII 2026</span>
            </div>
          </v-toolbar>

          <v-card-text class="pa-6">
            <div class="text-center mb-6">
              <v-chip v-if="tipo" :color="tipoColor" size="small" label class="mb-2">
                {{ tipo }}
              </v-chip>
              <h2 class="text-h5 font-weight-bold text-indigo-darken-4 mt-2">
                {{ nombreEvento }}
              </h2>
              <p class="text-body-2 text-grey-darken-1 mt-1 mb-0">
                La asistencia se registrará automáticamente para este evento.
              </p>
            </div>

            <v-alert
              v-if="error"
              type="error"
              variant="tonal"
              density="compact"
              closable
              class="mb-4"
              @click:close="error = ''"
            >
              {{ error }}
            </v-alert>

            <div v-if="result" class="text-center py-2">
              <v-icon color="success" size="72" icon="mdi-check-decagram"></v-icon>
              <h3 class="text-h6 font-weight-bold mt-3 mb-2">¡Asistencia registrada!</h3>
              <p class="text-body-2 text-grey-darken-1 mb-6">{{ result }}</p>
              <v-btn color="primary" variant="tonal" block rounded="lg" @click="registrarOtra">
                Registrar otra CI
              </v-btn>
            </div>

            <v-form v-else @submit.prevent="registrar">
              <v-text-field
                v-model="ci"
                label="Carnet de Identidad (CI)"
                prepend-inner-icon="mdi-card-account-details"
                variant="outlined"
                density="comfortable"
                inputmode="text"
                maxlength="20"
                autofocus
                :rules="[(v) => !!v?.trim() || 'Ingresa tu CI']"
              ></v-text-field>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                rounded="lg"
                :loading="isLoading"
                :disabled="!ciValido"
              >
                Registrar asistencia
              </v-btn>
            </v-form>
          </v-card-text>

          <v-divider></v-divider>
          <v-card-actions class="justify-center pa-4">
            <span class="text-caption text-grey text-center">
              Sociedad Científica de Estudiantes de Ingeniería de Sistemas e Informática
            </span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAsistenciaStore } from '@/stores/asistencia.store'

const route = useRoute()
const asistenciaStore = useAsistenciaStore()
const { isLoading } = storeToRefs(asistenciaStore)

// TODO(backend): cuando exista GET /api/evento/public/:id, cargar el evento
// desde la API en lugar de leer nombre/tipo desde el query string del QR.
const nombreEvento = computed(() => route.query.nombre || `Evento #${route.params.eventoId}`)
const tipo = computed(() => route.query.tipo || '')
const tipoColor = computed(
  () =>
    ({
      Curso: 'primary',
      Taller: 'success',
      Charla: 'info',
      Asamblea: 'warning',
    })[tipo.value] || 'grey',
)

const ci = ref('')
const error = ref('')
const result = ref('')
const ciValido = computed(() => ci.value.trim().length >= 4)

const registrar = async () => {
  error.value = ''
  result.value = ''

  const eventoId = Number(route.params.eventoId)
  if (!Number.isInteger(eventoId) || eventoId <= 0) {
    error.value = 'El enlace de asistencia no es válido. Solicita el QR nuevamente.'
    return
  }

  if (!ciValido.value) {
    error.value = 'Ingresa un CI válido (mínimo 4 caracteres).'
    return
  }

  const respuesta = await asistenciaStore.registrarAsistencia({
    eventoId,
    ci: ci.value,
  })

  if (respuesta.ok) {
    result.value = respuesta.message
    ci.value = ''
  } else {
    error.value = respuesta.error
  }
}

const registrarOtra = () => {
  result.value = ''
  error.value = ''
  ci.value = ''
}
</script>

<style scoped>
.text-caption {
  line-height: 1.4;
}
</style>
