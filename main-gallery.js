const { createApp, ref } = Vue;

const appLanguage = ref('es');

// Gallery images array
const galleryImages = [
  'images/catalogo/2026-01-01.jpg',
  'images/catalogo/2026-01-02.jpg',
  'images/catalogo/2026-01-03.jpg',
  'images/catalogo/2026-01-04.jpg',
  'images/catalogo/2026-01-05.jpg',
  'images/catalogo/2026-01-06.jpg',
  'images/catalogo/2026-01-07.jpg',
  'images/catalogo/2026-01-08.jpg',
  'images/catalogo/2026-01-09.jpg',
  'images/catalogo/2026-01-10.jpg',
  'images/catalogo/2026-01-11.jpg',
  'images/catalogo/2026-01-12.jpg',
  'images/catalogo/2026-01-13.jpg',
  'images/catalogo/2026-01-14.jpg',
  'images/catalogo/2026-01-15.jpg',
  'images/catalogo/2026-01-16.jpg',
  'images/catalogo/2026-01-17.jpg',
  'images/catalogo/2026-01-18.jpg'
];

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
