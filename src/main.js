import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'soceisiTheme',
    themes: {
      soceisiTheme: {
        dark: false,
        colors: {
          background: '#FFFFFF',
          surface: '#FFFFFF',
          primary: '#0056D2', // Azul del Escudo SOCEISI
          'primary-darken-1': '#003B94', // Azul oscuro (martillos)
          secondary: '#FFEB3B', // Amarillo (círculo)
          'secondary-darken-1': '#FBC02D',
          error: '#B00020',
          info: '#0056D2',
          success: '#4CAF50', // Verde (círculo)
          warning: '#FB8C00',
        },
      },
    },
  },
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(Vue3Toastify, {
  autoClose: 2000,
})
app.mount('#app')
