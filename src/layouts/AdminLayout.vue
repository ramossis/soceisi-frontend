<template>
  <v-container fluid class="pa-6 bg-grey-lighten-4 fill-height">
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card color="indigo-darken-4" class="rounded-xl pa-5 elevation-1">
          <v-list-item class="text-white">
            <v-list-item-title class="text-h4 font-weight-black mb-1">
              Bienvenido, Presidente
            </v-list-item-title>
            <v-list-item-subtitle class="text-subtitle-1 text-indigo-lighten-4">
              Resumen en tiempo real de las pre-inscripciones SOCIE-ISII 2026
            </v-list-item-subtitle>
            <template v-slot:append>
              <v-icon
                size="60"
                icon="mdi-shield-check-outline"
                class="text-indigo-lighten-3"
              ></v-icon>
            </template>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-card rounded="xl" elevation="3" class="pa-3" border="primary thin">
          <v-list-item subtitle="Total Regisrados">
            <!-- :title="totalInscritos.toString()" -->
            <template v-slot:prepend>
              <v-avatar color="primary-lighten-4" class="mt-3">
                <v-icon color="primary" icon="mdi-account-group"></v-icon>
              </v-avatar>
            </template>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card rounded="xl" elevation="3" class="pa-3" border="success thin">
          <v-list-item subtitle="Sistemas">
            <template v-slot:prepend>
              <v-avatar color="success-lighten-4" class="mt-3">
                <v-icon color="success" icon="mdi-laptop"></v-icon>
              </v-avatar>
            </template>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card rounded="xl" elevation="3" class="pa-3" border="info thin">
          <v-list-item subtitle="Informatica">
            <template v-slot:prepend>
              <v-avatar color="info-lighten-4" class="mt-3">
                <v-icon color="info" icon="mdi-code-braces"></v-icon>
              </v-avatar>
            </template>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-8">
      <v-col cols="12">
        <v-card rounded="xl" elevation="5">
          <v-toolbar color="white" class="pa-4 rounded-t-xl" flat>
            <v-toolbar-title class="text-h5 font-weight-bold"> Lisa de Aspirantes </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Buscar por C.I o Apellido"
              variant="solo-filled"
              flat
              hide-details
              density="compact"
              style="max-width: 300px"
              class="rounded-pill"
            >
            </v-text-field>
          </v-toolbar>
          <v-divider></v-divider>
          <v-data-table
            :headers="headers"
            :items="listaEstudiantes"
            :search="search"
            :loading="isLoading"
            class="elevation-0 pa-2"
            hover
          >
            <template v-slot:item.nombres="{ item }">
              <span class="font-weight-bold">
                {{ item.nombres }}
              </span>
            </template>
            <template v-slot:item.apellidos="{ item }">
              <span class="font-weigth-medium">
                {{ item.apellidos }}
              </span>
            </template>
            <template v-slot:item.estado_inscripcion="{ item }">
              <v-chip
                :color="getEstadoColor(item.estado_inscripcion)"
                size="small"
                label
                class="font-weight-medium"
              >
                {{ item.estado_inscripcion }}
              </v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <div class="d-flex justify-center gap-1">
                <v-btn
                  icon="mdi-file-eye-outline"
                  size="small"
                  variant="text"
                  color="indigo"
                  @click="verDatos(item)"
                  title="Revisar Datos"
                ></v-btn>
                <v-btn
                  icon="mdi-image-outline"
                  size="small"
                  variant="text"
                  color="indigo"
                  @click="verDocumentos(item)"
                  title="Revisar Documentos"
                ></v-btn>
                <v-btn
                  icon="mdi-check-decagram-outline"
                  size="small"
                  variant="text"
                  color="success"
                  @click="inscribirMembresia(item)"
                  title="Aprobar Inscripción"
                ></v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogDatos" max-width="700">
      <v-card v-if="selectStudent" rounded="xl">
        <v-toolbar color="indigo-darken-3" title="Ficha Completa del Estudiante" flat></v-toolbar>

        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="6"
              ><v-list-item subtitle="Nombres" :title="selectStudent?.nombres"></v-list-item
            ></v-col>
            <v-col cols="6"
              ><v-list-item subtitle="Apellidos" :title="selectStudent?.apellidos"></v-list-item
            ></v-col>
            <v-col cols="6"
              ><v-list-item subtitle="C.I." :title="selectStudent?.ci"></v-list-item
            ></v-col>
            <v-col cols="6"
              ><v-list-item
                subtitle="Fecha Nacimiento"
                :title="selectStudent?.fecha_nacimiento"
              ></v-list-item
            ></v-col>
            <v-col cols="6"
              ><v-list-item subtitle="Cuidad" :title="selectStudent?.cuidad"></v-list-item
            ></v-col>
            <v-col cols="6"
              ><v-list-item subtitle="Direccion" :title="selectStudent?.direcion"></v-list-item
            ></v-col>
            <v-col cols="6"
              ><v-list-item subtitle="Celular" :title="selectStudent?.celular"></v-list-item
            ></v-col>
            <v-col cols="6"
              ><v-list-item
                subtitle="Correo Electronico"
                :title="selectStudent?.email"
              ></v-list-item
            ></v-col>
            <v-col cols="6"
              ><v-list-item subtitle="Facultad" :title="selectStudent?.facultad"></v-list-item
            ></v-col>
            <v-col cols="6"
              ><v-list-item subtitle="Carrera" :title="selectStudent?.carrera"></v-list-item
            ></v-col>
            <v-col cols="6"
              ><v-list-item
                subtitle="Matricula Universitaria"
                :title="selectStudent?.matricula_univ"
              ></v-list-item
            ></v-col>
            <v-col cols="6"
              ><v-list-item subtitle="Semestre" :title="selectStudent?.semestre"></v-list-item
            ></v-col>
            <v-col cols="6"
              ><v-list-item
                subtitle="Nombre Sociedad"
                :title="selectStudent?.nombre_soce"
              ></v-list-item
            ></v-col>
            <v-col cols="6"
              ><v-list-item
                subtitle="Motivo Inscripcion"
                :title="selectStudent?.descripcion"
              ></v-list-item
            ></v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="tonal" color="grey" @click="dialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDocumentos" max-width="700">
      <v-card v-if="selectStudent" rounded="xl">
        <v-toolbar color="primary" title="Verificación de Datos" flat></v-toolbar>

        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12" md="6">
              <p class="text-overline font-weight-bold mb-2">
                Cédula de Identidad C.I.:{{ selectStudent.ci }}
              </p>
              <v-img
                :src="selectStudent.documentos[0].foto_ci || 'https://via.placeholder.com/300'"
                aspect-ratio="16/9"
                cover
                class="rounded-lg bg-grey-lighten-2"
              ></v-img>
            </v-col>
            <v-col cols="12" md="6">
              <p class="text-overline font-weight-bold mb-2">
                Matrícula Universitaria {{ selectStudent.matricula_univ }}
              </p>
              <v-img
                :src="selectStudent.documentos[0].matricula || 'https://via.placeholder.com/300'"
                aspect-ratio="16/9"
                cover
                class="rounded-lg bg-grey-lighten-2"
              ></v-img>
            </v-col>
            <v-col cols="12" md="6">
              <p class="text-overline mb-2">
                Registro de Materias Semestre : {{ selectStudent.semestre }}
              </p>
              <v-img
                :src="
                  selectStudent.documentos[0].registro_materia || 'https://via.placeholder.com/300'
                "
                aspect-ratio="16/9"
                cover
                class="rounded-lg bg-grey-lighten-2"
              ></v-img>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="tonal" color="grey" @click="dialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogMembresia">
      <v-card v-if="selectStudent" rounded="xl">
        <v-toolbar color="indigo-darken-3" title="Inscribir Miembro" flat></v-toolbar>
        <v-card-text class="text-center">
          <v-avatar color="green-lighten-5" size="80" class="mb-4">
            <v-icon color="green-darken-2" size="40" icon="mdi-cash-check"></v-icon>
          </v-avatar>
          <h2 class="text-h5 font-weight-bold mb-1">Registrar Pago</h2>
          <p class="text-body-2 text-grey-darken-1 mb-6">
            Estudiante: <span class="font-weight-bold text-black">{{ estudiante?.nombres }}</span>
          </p>

          <v-form ref="formPago" @submit.prevent="confirmar">
            <v-text-field
              v-model.number="monto"
              label="Monto de Inscripción (BS)"
              variant="outlined"
              prefix="Bs."
              type="number"
              rounded="lg"
              color="success"
              bg-color="green-lighten-5"
              autofocus
              :rules="[(v) => !!v || 'El monto es obligatorio']"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-4 pb-2">
          <v-btn variant="text" color="grey" @click="show = false">Cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            variant="elevated"
            min-width="120"
            rounded="lg"
            :disabled="!monto || monto <= 0"
            @click="confirmar"
          >
            INSCRIBIR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useEstudianteStore } from '@/stores/estudiante.store'
import { storeToRefs } from 'pinia'

const estudianteStore = useEstudianteStore()
const { listaEstudiantes, isLoading } = storeToRefs(estudianteStore)

const search = ref('')
const dialogDatos = ref(false)
const dialogDocumentos = ref(false)
const dialogMembresia = ref(false)
const selectStudent = ref(null)

const headers = [
  { title: 'C.I.', key: 'ci' },
  { title: 'Nombres', key: 'nombres', sortable: true },
  { title: 'Apellidos', key: 'apellidos', sortable: true },
  { title: 'Estado', key: 'estado_inscripcion', sortable: true },
  { title: 'Acciones', key: 'actions', sorable: false, align: 'center' },
]
const verDatos = (estudiante) => {
  selectStudent.value = estudiante
  dialogDatos.value = true
}
const verDocumentos = (estudiante) => {
  selectStudent.value = estudiante
  dialogDocumentos.value = true
}
const inscribirMembresia = (estudiante) => {
  selectStudent.value = estudiante
  dialogMembresia.value = true
}
const getEstadoColor = (estado) => {
  switch (estado?.toLowerCase()) {
    case 'pendiente':
      return 'warning'
    case 'activo':
      return 'success'
    case 'rechazado':
      return 'error'
    default:
      return 'grey'
  }
}
onMounted(async () => {
  await estudianteStore.getEstudiantes()
})
</script>

<style lang="scss" scoped></style>
