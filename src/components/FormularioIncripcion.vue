<template>
  <v-container>
    <v-card class="mx-auto mt-5 elevation-10" max-width="600" rounded="lg" border="primary thin">
      <v-toolbar color="primary" dark>
        <v-toolbar-title class="font-weight-bold">
          Registro de Pre Inscripcion SOCEIISI 2026
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="isFormValid">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Nombres"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                :rules="[(v) => !!v || 'El Nombre es obligatorio']"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Apellidos"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                :rules="[(v) => !!v || 'El Apellido es obligatorio']"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup></script>

<style lang="scss" scoped></style>
