const { createApp, ref } = Vue;

const appLanguage = ref('es');

// Gallery images array
const galleryImages = [
  'images/catalogo/2024-12-31.jpg',
  'images/catalogo/2024-12-32.jpg',
  'images/catalogo/2024-12-12.jpg',
  'images/catalogo/2024-12-14.jpg',
  'images/catalogo/2024-12-16.jpg',
  'images/catalogo/2024-12-20.jpg',
  'images/catalogo/2024-12-19.jpg',
  'images/catalogo/2024-12-26.jpg',
  'images/catalogo/2024-12-33.jpg',
  'images/catalogo/2024-12-34.jpg',
  'images/catalogo/2024-12-37.jpg',
  'images/catalogo/2024-12-03.jpg',
  'images/catalogo/2024-12-02.jpg',
  'images/catalogo/2024-12-08.jpg',
  'images/catalogo/2024-12-07.jpg',
  'images/catalogo/2024-12-38.jpg',
  'images/catalogo/2024-12-29.jpg',
  'images/catalogo/2024-12-01.jpg',
  'images/catalogo/2024-12-42.jpg',
  'images/catalogo/2024-12-43.jpg',
  'images/catalogo/2024-12-28.jpg',
  'images/catalogo/2024-12-09.jpg',
  'images/catalogo/2024-12-10.jpg',
  'images/catalogo/2024-12-13.jpg',
  'images/catalogo/2024-12-15.jpg',
  'images/catalogo/2024-12-18.jpg',
  'images/catalogo/2024-12-23.jpg',
  'images/catalogo/2024-12-24.jpg',
  'images/catalogo/2024-12-25.jpg',
  'images/catalogo/2024-12-35.jpg',
  'images/catalogo/2024-12-40.jpg',
  'images/catalogo/2024-12-41.jpg',
  'images/catalogo/2024-12-44.jpg',
  'images/catalogo/2024-12-45.jpg',
  'images/catalogo/2024-12-46.jpg',
  'images/catalogo/2024-12-39.jpg',
  'images/catalogo/2024-12-47.jpg',
  'images/catalogo/2024-12-48.jpg',
  'images/catalogo/2024-12-50.jpg',
  'images/catalogo/2024-12-51.jpg',
  'images/catalogo/2024-12-52.jpg',
  'images/catalogo/2024-12-53.jpg',
  'images/catalogo/2024-12-54.jpg',
  'images/catalogo/2024-12-55.jpg',
  'images/catalogo/2024-12-56.jpg',
  'images/catalogo/2024-12-57.jpg',
  'images/catalogo/2025-01-01.jpg',
  'images/catalogo/2025-01-02.jpg',
  'images/catalogo/2025-02-01.jpg',
  'images/catalogo/2025-02-02.jpg',
  'images/catalogo/2025-02-03.jpg',
  'images/catalogo/2025-02-04.jpg',
  'images/catalogo/2025-02-05.jpg',
  'images/catalogo/2025-02-07.jpg',
  'images/catalogo/2025-02-08.jpg',
  'images/catalogo/2025-02-09.jpg',
  'images/catalogo/2025-02-10.jpg',
  'images/catalogo/2025-02-11.jpg',
  'images/catalogo/2025-02-12.jpg',
  'images/catalogo/2025-02-13.jpg',
  'images/catalogo/2025-02-14.jpg',
  'images/catalogo/2025-02-16.jpg',

  'images/catalogo/2025-03-01.jpg',
  'images/catalogo/2025-03-02.jpg',
  'images/catalogo/2025-03-03.jpg',
  'images/catalogo/2025-03-04.jpg',
  'images/catalogo/2025-03-05.jpg',
  'images/catalogo/2025-03-06.jpg',
  'images/catalogo/2025-03-07.jpg',
  'images/catalogo/2025-03-08.jpg',
  'images/catalogo/2025-03-09.jpg',
  'images/catalogo/2025-03-10.jpg',
  'images/catalogo/2025-03-11.jpg',
  'images/catalogo/2025-03-12.jpg',
  'images/catalogo/2025-03-13.jpg',
  'images/catalogo/2025-03-14.jpg',
  'images/catalogo/2025-03-15.jpg',
  'images/catalogo/2025-03-16.jpg',
  'images/catalogo/2025-03-17.jpg',
  'images/catalogo/2025-03-18.jpg',
  'images/catalogo/2025-03-19.jpg',
  'images/catalogo/2025-03-20.jpg',
  'images/catalogo/2025-03-21.jpg',
  'images/catalogo/2025-03-22.jpg',
  'images/catalogo/2025-03-23.jpg',
  'images/catalogo/2025-03-24.jpg',
  'images/catalogo/2025-03-25.jpg',
  'images/catalogo/2025-03-26.jpg',
  'images/catalogo/2025-03-27.jpg',
  'images/catalogo/2025-03-28.jpg',
  'images/catalogo/2025-03-29.jpg',
  'images/catalogo/2025-03-30.jpg',
  'images/catalogo/2025-03-31.jpg',
  'images/catalogo/2025-03-32.jpg',
  'images/catalogo/2025-03-33.jpg',

  'images/catalogo/2025-03-36.jpg',
  'images/catalogo/2025-03-37.jpg',

  'images/catalogo/2025-03-40.jpg',
  'images/catalogo/2025-03-41.jpg',
  
  'images/catalogo/2025-03-34.jpg',
  'images/catalogo/2025-03-35.jpg',
    'images/catalogo/2025-03-38.jpg',
  'images/catalogo/2025-03-39.jpg',







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
