// cotizacion-main.js
const { createApp, ref } = Vue;

const appLanguage = ref('es');

createApp({
  components: {
    HeaderComponent,
    CotizacionComponent,
    StickyWhatsAppCTAComponent,
  },
  setup() {
    return {
      language: appLanguage,
    };
  },
}).mount('#app');
