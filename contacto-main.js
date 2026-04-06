const { createApp, ref } = Vue;

createApp({
  components: {
    HeaderComponent,
    StickyWhatsAppCTAComponent,
  },
  setup() {
    const language = ref('es');

    return {
      language,
    };
  },
}).mount('#app');