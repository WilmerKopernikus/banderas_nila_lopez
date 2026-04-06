// cotizacion-main.js
const { createApp, ref } = Vue;

const appLanguage = ref('es');

createApp({
  components: {
    HeaderComponent,
    CotizacionComponent,
  },
  setup() {
    return {
      language: appLanguage,
    };
  },
}).mount('#app');
