// components/TestimonialsComponent.js
const TestimonialsComponent = {
    props: ['language'],
    setup(props) {
      const { ref, computed, onMounted } = Vue;
  
      const translations = {
        es: {
          title: 'Nuestro trabajo',
          testimonials: [
            {
              src: 'images/testimonial01.jpg',
              alt: 'Bandera de Colombia',
            },
            {
              src: 'images/testimonial02.jpg',
              alt: 'Banderas Chinas y de Colombia',
            },
            {
              src: 'images/testimonial03.jpg',
              alt: 'Banderas del Mundo',
            },
            {
              src: 'images/testimonial04.jpg',
              alt: 'Banderas del Mundo',
            },
            {
              src: 'images/testimonial05.jpg',
              alt: 'Banderas de Bogotá',
            },
            {
              src: 'images/testimonial06.jpg',
              alt: 'Banderas de Escritorio',
            },
            {
              src: 'images/testimonial07.jpg',
              alt: 'Banderas Institucionales',
            },
            {
              src: 'images/testimonial08.jpg',
              alt: 'Banderas Institucionales',
            },
            {
              src: 'images/testimonial09.jpg',
              alt: 'Banderas Institucionales',
            },
            {
              src: 'images/testimonial10.jpg',
              alt: 'Bandera de España',
            },
            {
              src: 'images/testimonial11.jpg',
              alt: 'Bandera del Vaticano',
            },
            {
              src: 'images/testimonial12.jpg',
              alt: 'Banderas Institucionales',
            },
            {
              src: 'images/testimonial13.jpg',
              alt: 'Banderas Institucionales',
            },
            {
              src: 'images/testimonial14.jpg',
              alt: 'Banderas de Interior',
            },
            {
              src: 'images/testimonial15.jpg',
              alt: 'Banderas de Escritorio',
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
          }, 3500);
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
  