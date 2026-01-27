const GalleryComponent = {
  props: ['images'],

  setup(props) {
    const { onMounted, nextTick } = Vue;

    onMounted(async () => {
      await nextTick(); // esperar a que Vue pinte las imágenes

      const grid = document.querySelector('#gallery');
      const images = grid.querySelectorAll('img');
      
      // Wait for all images to load
      const imagePromises = Array.from(images).map(img => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve); // resolve even on error to prevent hanging
          }
        });
      });

      // Initialize Masonry after all images are loaded
      await Promise.all(imagePromises);
      
      new Masonry(grid, {
        itemSelector: '.item',
        columnWidth: '.item',
        gutter: 16,
        percentPosition: true
      });
    });

    return {};
  },

  template: `
    <div class="container-fluid">
      <div id="gallery">
        <div 
          class="item" 
          v-for="(img, index) in images" 
          :key="index"
        >
          <img :src="img" alt="">
        </div>
      </div>
    </div>
  `
};
