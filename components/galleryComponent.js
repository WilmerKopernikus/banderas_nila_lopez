const GalleryComponent = {
  props: ['images'],

  setup(props) {
    const { onMounted, nextTick } = Vue;

    onMounted(async () => {
      await nextTick(); // esperar a que Vue pinte las imágenes

      const grid = document.querySelector('#gallery');

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
