const GalleryComponent = {
  props: ['images'],

  setup(props) {
    const {
      computed,
      onBeforeUnmount,
      onMounted,
      nextTick,
      ref,
      watch
    } = Vue;
    const batchSize = 20;
    const visibleImages = ref([]);
    const currentIndex = ref(0);
    const isLoading = ref(false);
    const sentinel = ref(null);
    const hasMore = computed(() => currentIndex.value < props.images.length);
    let masonryInstance = null;
    let observer = null;

    const waitForImages = (grid) => {
      const images = grid.querySelectorAll('img');
      
      const imagePromises = Array.from(images).map(img => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve();
          } else {
                       img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          }
        });
      });

      // Initialize Masonry after all images are loaded
      return Promise.all(imagePromises);
    };

    const layoutMasonry = async () => {
      await nextTick();
      const grid = document.querySelector('#gallery');

      if (!grid) return;

      await waitForImages(grid);

      if (!masonryInstance) {
        masonryInstance = new Masonry(grid, {
          itemSelector: '.item',
          columnWidth: '.item',
          gutter: 16,
          percentPosition: true
        });
      } else {
        masonryInstance.reloadItems();
        masonryInstance.layout();
      }
    };

    const loadMore = async () => {
      if (isLoading.value || !hasMore.value) return;
      isLoading.value = true;

      const nextImages = props.images.slice(
        currentIndex.value,
        currentIndex.value + batchSize
      );
      visibleImages.value = [...visibleImages.value, ...nextImages];
      currentIndex.value += nextImages.length;

      await layoutMasonry();
      isLoading.value = false;
    };

    onMounted(async () => {
      await loadMore();

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              loadMore();
            }
          });
        },
        { rootMargin: '200px' }
      );

      if (sentinel.value) {
        observer.observe(sentinel.value);
      }
    });

    onBeforeUnmount(() => {
      if (observer && sentinel.value) {
        observer.unobserve(sentinel.value);
      }
      if (observer) {
        observer.disconnect();
      }
    });

    watch(
      () => props.images,
      () => {
        visibleImages.value = [];
        currentIndex.value = 0;
        loadMore();
      }
    );

    return {
      hasMore,
      isLoading,
      sentinel,
      visibleImages
    };
  },

  template: `
    <div class="container-fluid">
      <div id="gallery">
        <div 
          class="item" 
          v-for="(img, index) in visibleImages" 
          :key="index"
        >
          <img :src="img" alt="">
        </div>
      </div>
            <div
        v-if="hasMore"
        ref="sentinel"
        class="gallery-sentinel"
        aria-live="polite"
      >
        <span v-if="isLoading" class="gallery-loading">Cargando más...</span>
      </div>
    </div>
  `
};
