<template>
  <v-main class="bg-grey-lighten-4">
    <v-app-bar color="primary" flat>
      <v-avatar class="ml-4" rounded="0">
        <v-img :src="LogoSoce"> </v-img>
      </v-avatar>
      <v-app-bar-title>SOCIE-ISII Inscripciones</v-app-bar-title>
    </v-app-bar>
    <v-container>
      <router-view />
    </v-container>
  </v-main>
</template>

<script setup>
import LogoSoce from '../assets/Logo-SoCiE-ISII.png'
</script>

<style lang="scss" scoped></style>
