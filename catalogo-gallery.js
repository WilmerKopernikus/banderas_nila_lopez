const { createApp, ref } = Vue;

const appLanguage = ref('es');

// Gallery images array
const galleryImages = [
  'images/catalogo/2025-07-14.jpg',
  'images/catalogo/2024-12-31.jpg',
  'images/catalogo/2024-12-11.jpg',
  'images/catalogo/2026-01-09.jpg',
  'images/catalogo/2025-12-25.jpg',
  'images/catalogo/2025-12-21.jpg',
  'images/catalogo/2025-12-17.jpg',
  'images/catalogo/2025-12-08.jpg',
  'images/catalogo/2025-11-44.jpg',
  'images/catalogo/2025-11-20.jpg',
  'images/catalogo/2025-11-11.jpg',
  'images/catalogo/2025-10-20.jpg',
  'images/catalogo/2025-10-08.jpg',
  'images/catalogo/2025-10-06.jpg',
  'images/catalogo/2025-10-04.jpg',
  'images/catalogo/2025-10-01.jpg',
  'images/catalogo/2025-09-21.jpg',
  'images/catalogo/2025-09-17.jpg',
  'images/catalogo/2025-09-14.jpg',
  'images/catalogo/2025-09-07.jpg',
  'images/catalogo/2025-08-18.jpg',
  'images/catalogo/2025-08-14.jpg',
  'images/catalogo/2025-08-05.jpg',
  'images/catalogo/2025-08-04.jpg',
  'images/catalogo/2025-08-03.jpg',
  'images/catalogo/2025-08-01.jpg',
  'images/catalogo/2025-07-99.jpg',
  'images/catalogo/2025-07-90.jpg',
  'images/catalogo/2025-07-76.jpg',
  'images/catalogo/2025-07-35.jpg',
  'images/catalogo/2025-07-33.jpg',
  'images/catalogo/2025-07-30.jpg',
  'images/catalogo/2025-07-29.jpg',
  'images/catalogo/2025-07-26.jpg',
  'images/catalogo/2025-07-21.jpg',
  'images/catalogo/2025-07-15.jpg',
  'images/catalogo/2025-07-05.jpg',
  'images/catalogo/2025-06-43.jpg',
  'images/catalogo/2025-06-15.jpg',
  'images/catalogo/2025-06-11.jpg',
  'images/catalogo/2025-06-08.jpg',
  'images/catalogo/2025-05-24.jpg',
  'images/catalogo/2025-03-37.jpg',
  'images/catalogo/2025-03-35.jpg',
  'images/catalogo/2025-03-32.jpg',
  'images/catalogo/2025-03-20.jpg',
  'images/catalogo/2025-03-19.jpg',
  'images/catalogo/2025-03-11.jpg',
  'images/catalogo/2025-03-06.jpg',
  'images/catalogo/2025-02-11.jpg',
  'images/catalogo/2025-02-02.jpg',
  'images/catalogo/2024-12-58.jpg',
  'images/catalogo/2024-12-47.jpg',

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
