<template>
  <v-container fluid class="pa-6 bg-grey-lighten-4 fill-height">
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card color="indigo-darken-4" class="rounded-xl pa-5 elevation-1">
          <v-list-item class="text-white">
            <v-list-item-title class="text-h4 font-weight-black mb-1">
              Bienvenido, {{ user?.rol || 'Rol' }} {{ user?.nombre || 'Usuario' }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-subtitle-1 text-indigo-lighten-4 mb-2">
              Panel de gestión SOCIE-ISII 2026
            </v-list-item-subtitle>
            <template v-slot:append>
              <v-icon
                size="60"
                icon="mdi-shield-check-outline"
                class="text-indigo-lighten-3"
              ></v-icon>
            </template>
          </v-list-item>

          <div class="d-flex flex-wrap ga-2 mt-3">
            <v-btn
              to="/admin"
              variant="text"
              :color="route.name === 'Dashboard' ? 'secondary' : 'white'"
              prepend-icon="mdi-account-group"
            >
              Aspirantes
            </v-btn>
            <v-btn
              to="/admin/eventos"
              variant="text"
              :color="route.name === 'Eventos' ? 'secondary' : 'white'"
              prepend-icon="mdi-calendar-star"
            >
              Eventos y QR
            </v-btn>
            <v-btn
              to="/"
              target="_blank"
              variant="text"
              color="white"
              prepend-icon="mdi-open-in-new"
            >
              Formulario público
            </v-btn>
          </div>

          <div class="d-flex justify-end mt-2">
            <v-btn
              prepend-icon="mdi-logout-variant"
              variant="flat"
              color="indigo-lighten-4"
              class="rounded-lg"
              @click="handleLogout"
            >
              Cerrar Sesión
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <router-view />
  </v-container>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'

const route = useRoute()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const handleLogout = () => {
  authStore.logout()
}
</script>

<style lang="scss" scoped></style>
