// components/TestimonialsComponent.js
const TestimonialsComponent = {
    props: ['language'],
    setup(props) {
      const { ref, computed, onMounted } = Vue;
  
      const translations = {
        es: {
          title: 'Imagenes de nuestro trabajo',
          testimonials: [
            {
              src: 'images/testimonial01.jpg',
              alt: 'Student testimonial 1',
            },
            {
              src: 'images/testimonial02.jpg',
              alt: 'Student testimonial 2',
            },
            {
              src: 'images/testimonial03.jpg',
              alt: 'Student testimonial 3',
            },
            {
              src: 'images/testimonial04.jpg',
              alt: 'Student testimonial 4',
            },
            {
              src: 'images/testimonial05.jpg',
              alt: 'Student testimonial 5',
            },
            {
              src: 'images/testimonial06.jpg',
              alt: 'Student testimonial 6',
            },
            {
              src: 'images/testimonial07.jpg',
              alt: 'Student testimonial 7',
            },
          ],
        },
      };
  
      const t = computed(() => translations[props.language] || translations.es);
      const activeIndex = ref(0);
      const testimonialsLength = computed(() => t.value.testimonials.length);
  
      onMounted(() => {
        if (testimonialsLength.value > 1) {
          setInterval(() => {
            activeIndex.value =
              (activeIndex.value + 1) % testimonialsLength.value;
          }, 3000);
        }
      });
  
      return {
        t,
        activeIndex,
      };
    },
    template: `
      <section id="testimonials" style="background: linear-gradient(to right, #ffffff, #ffffff);">
        <h2 class="section-title">{{ t.title }}</h2>
        <div class="testimonial-wrapper">
          <div
            v-for="(item, index) in t.testimonials"
            :key="index"
            class="testimonial"
            :class="{ active: index === activeIndex }"
          >
          <img class="testimonial-image" :src="item.src" :alt="item.alt" />
          </div>
        </div>
      </section>
    `,
  };
  