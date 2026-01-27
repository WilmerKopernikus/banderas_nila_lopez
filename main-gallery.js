import { galleryImages } from './components/data/galleryImages.js';

const { createApp, ref } = Vue;

const appLanguage = ref('es');

createApp({
  components: {
    HeaderComponent,
    GalleryComponent
  },
  setup() {
    return {
      language: appLanguage,
      galleryImages
    };
  }
}).mount('#app');
