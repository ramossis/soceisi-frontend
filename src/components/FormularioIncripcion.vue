<template>
  <v-container>
    <v-card class="mx-auto mt-5 elevation-10" max-width="800" rounded="lg" border="primary thin">
      <v-toolbar color="primary" dark height="auto" class="py-3 px-2">
        <v-avatar size="45" class="ml-2 mr-3 bg-white pa-1">
          <v-img src="../assets/Logo-SoCiE-ISII.png" alt="SOCIE-ISII"></v-img>
        </v-avatar>

        <div class="d-flex flex-column justify-center">
          <div class="text-h6 font-weight-bold titulo-adaptable line-height-tight">
            Registro de Pre Inscripción
          </div>
          <div class="text-caption text-uppercase font-weight-medium opacity-80">
            SOCIE-ISII 2026
          </div>
        </div>
      </v-toolbar>

      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="isFormValid" @submit.prevent="submitForm">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Nombres"
                v-model="miembro.nombres"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => !!v || 'El nombre es obligatorio']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Apellidos"
                v-model="miembro.apellidos"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => !!v || 'El apellido es obligatorio']"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                label="CI"
                v-model="miembro.ci"
                type="number"
                prepend-inner-icon="mdi-card-account-details"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => !!v || 'El CI es obligatorio']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                label="Fecha de Nacimiento"
                v-model="miembro.fecha_nacimiento"
                type="date"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => !!v || 'Fecha requerida']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                label="Ciudad"
                v-model="miembro.ciudad"
                prepend-inner-icon="mdi-map-marker"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => !!v || 'Ciudad obligatoria']"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="8">
              <v-text-field
                label="Dirección"
                v-model="miembro.direccion"
                prepend-inner-icon="mdi-home"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => !!v || 'Dirección requerida']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                label="Celular"
                v-model="miembro.celular"
                type="tel"
                prepend-inner-icon="mdi-phone"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => !!v || 'Celular requerido']"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                label="Email"
                v-model="miembro.email"
                type="email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => /.+@.+\..+/.test(v) || 'Email no válido']"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                label="Facultad"
                v-model="miembro.facultad"
                :items="['Facultad Nacional de Ingeniería']"
                prepend-inner-icon="mdi-domain"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                label="Carrera"
                v-model="miembro.carrera"
                :items="['Ingeniería de Sistemas', 'Ingeniería Informática']"
                prepend-inner-icon="mdi-school"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => !!v || 'Selecciona tu carrera']"
              ></v-select>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                label="Matrícula Universitaria"
                v-model="miembro.matriuula_univ"
                type="number"
                prepend-inner-icon="mdi-identifier"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                label="Semestre"
                v-model="miembro.semestre"
                :items="['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>

            <v-col cols="12" md="8">
              <v-textarea
                label="Motivo de Inscripción"
                v-model="miembro.descripcion"
                prepend-inner-icon="mdi-comment-text"
                variant="outlined"
                density="comfortable"
                rows="2"
              ></v-textarea>
            </v-col>

            <v-col cols="12">
              <v-divider class="my-4"></v-divider>
              <p class="text-subtitle-1 font-weight-bold text-primary mb-4">
                <v-icon icon="mdi-attachment" class="mr-2"></v-icon>
                Documentación Requerida (Imágenes)
              </p>
            </v-col>

            <v-col cols="12" md="4">
              <v-file-input
                label="Foto de C.I."
                prepend-inner-icon="mdi-camera"
                v-model="miembro.foto_ci"
                variant="outlined"
                accept="image/*"
                density="comfortable"
                :rules="[(v) => !!v || 'La foto del CI es obligatoria']"
              ></v-file-input>
            </v-col>

            <v-col cols="12" md="4">
              <v-file-input
                label="Matrícula Vigente"
                v-model="miembro.matricula"
                prepend-inner-icon="mdi-card-account-details-star"
                variant="outlined"
                accept="image/*"
                density="comfortable"
                :rules="[(v) => !!v || 'Sube tu matrícula']"
              ></v-file-input>
            </v-col>

            <v-col cols="12" md="4">
              <v-file-input
                label="Registro de Materias"
                v-model="miembro.registro_materia"
                prepend-inner-icon="mdi-file-document-check"
                variant="outlined"
                accept="image/*"
                density="comfortable"
                :rules="[(v) => !!v || 'Sube tu registro']"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4 justify-end">
        <v-btn color="grey-darken-1" variant="text" @click="resetForm" class="mr-2">
          Limpiar
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          size="large"
          min-width="150"
          :disabled="!isFormValid"
          @click="submitForm"
        >
          Registrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useEstudianteStore } from '../stores/estudiante.store'
import { storeToRefs } from 'pinia'

const estudianteStore = useEstudianteStore()

const { subimtFormMiembro } = estudianteStore
const { miembro } = storeToRefs(estudianteStore)
const isFormValid = ref(false)
const formRef = ref(null)
const resetForm = () => {
  formRef.value.reset()
}

const submitForm = () => {
  if (isFormValid.value) {
    subimtFormMiembro()
    resetForm()
  }
}
</script>

<style scoped>
.line-height-tight {
  line-height: 1.2 !important;
}

.titulo-adaptable {
  white-space: normal !important;
  word-wrap: break-word;
  max-width: 100%;
}

@media (max-width: 600px) {
  .titulo-adaptable {
    font-size: 1.1rem !important;
  }
}
</style>
