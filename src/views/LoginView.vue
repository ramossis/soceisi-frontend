<template>
  <v-container fluid class="fill-height bg-grey-lighten-4">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" lg="3">
        <v-card elevation="12" rounded="xl" class="pa-4">
          <v-card-item class="text-center">
            <v-avatar size="80" class="mb-4" bg-white elevation-2>
              <v-img src="/public/Logo-SoCiE-ISII.png" alt="SOCIE-ISII"> </v-img>
            </v-avatar>
            <v-card-title class="text-h5 font-weight-bold"> Panel Administrativo </v-card-title>
            <v-card-subtitle> Inicia sesion para gestionar </v-card-subtitle>
          </v-card-item>
          <v-card-text class="mt-4">
            <v-form ref="loginForm" v-model="isValidForm" @submit.prevent="handleLogin">
              <v-text-field
                v-model="credentials.usuario"
                label="Usuario"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => !!v || 'Requerido']"
                class="mb-2"
              >
              </v-text-field>
              <v-text-field
                v-model="credentials.password"
                label="Contraseña"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                density="comfortable"
                @click:append-inner="showPassword = !showPassword"
                :rules="[(v) => !!v || 'Requerido']"
              >
              </v-text-field>
              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                elevation="2"
                class="m-4 font-weight-bold"
                :loading="isLoading"
                :disabled="!isValidForm"
              >
                Ingresar al Sistema
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn variant="text" size="small" color="grey" to="/">
              Volver al Formulario de Inscripcion
            </v-btn>
          </v-card-actions>
        </v-card>
        <p class="text-center mt-6 text-caption text-grey">
          © 2026 Facultad Nacional de Ingeniería <br />
          Sistemas e Informática
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { storeToRefs } from 'pinia'

const isValidForm = ref(false)
const showPassword = ref(false)
const loginForm = ref(null)

const authStore = useAuthStore()
const { credentials, isLoading } = storeToRefs(authStore)

const handleLogin = async () => {
  const { valid } = await loginForm.value.validate()
  if (valid) {
    authStore.login()
  }
}
</script>

<style lang="scss" scoped></style>
