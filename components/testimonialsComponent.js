// components/TestimonialsComponent.js
const TestimonialsComponent = {
    props: ['language'],
    setup(props) {
      const { ref, computed, onMounted } = Vue;
  
      const translations = {
        es: {
          title: 'What our students say',
          testimonials: [
            {
              text: 'The Business English course helped me feel confident speaking with international clients. I use what I learned every day at work.',
              author: '— Wei Zhang, Shanghai',
            },
            {
              text: 'I always struggled with pronunciation, but this course made it fun and effective. My colleagues immediately noticed the difference.',
              author: '— Yi-Ting Shi, Guangzhou',
            },
            {
              text: 'The debate classes improved my critical thinking and public speaking. I now participate in conferences without fear.',
              author: '— Anastasia Ivanova, Saint Petersburg',
            },
          ],
        },
      };
  
      const t = computed(() => translations[props.language] || translations.en);
      const activeIndex = ref(0);
      const testimonialsLength = computed(() => t.value.testimonials.length);
  
      onMounted(() => {
        if (testimonialsLength.value > 1) {
          setInterval(() => {
            activeIndex.value =
              (activeIndex.value + 1) % testimonialsLength.value;
          }, 7000);
        }
      });
  
      return {
        t,
        activeIndex,
      };
    },
    template: `
      <section id="testimonials" style="background: linear-gradient(to right, #81d9ff, #009fe3);">
        <h2 class="section-title">{{ t.title }}</h2>
        <div class="testimonial-wrapper">
          <blockquote
            v-for="(item, index) in t.testimonials"
            :key="index"
            class="testimonial"
            :class="{ active: index === activeIndex }"
          >
            <p>"{{ item.text }}"</p><br />
            <cite>{{ item.author }}</cite>
          </blockquote>
        </div>
      </section>
    `,
  };
  