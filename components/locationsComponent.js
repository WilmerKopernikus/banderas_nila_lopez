// components/LocationsComponent.js
const LocationsComponent = {
    props: ['language'],
    setup(props) {
      const { computed } = Vue;
  
      const translations = {
        es: {
          title: 'Based in the Chinese Greater Bay Area',
          locations: [
            {
              name: 'Guangzhou',
              description:
                "Study English in one of China's most historic trading cities. Guangzhou blends rich Cantonese heritage with a dynamic business environment — perfect for learners aiming to connect tradition with modern communication.",
              button: 'Book a class here',
              image: 'images/Guangzhou.jpg',
              alt: 'Guangzhou',
            },
            {
              name: 'Shenzhen',
              description:
                "Take English lessons in China's tech capital. Fast-paced, innovative, and global, Shenzhen is the ideal place to level up your language skills for the international workplace or startup scene.",
              button: 'Book a class here',
              image: 'images/Shenzhen.jpg',
              alt: 'Shenzhen',
            },
            {
              name: 'Hong Kong',
              description:
                "Learn English in one of Asia's most vibrant and international cities. Hong Kong’s East-meets-West culture offers the perfect backdrop to improve your fluency and confidence in a global setting.",
              button: 'Book a class here',
              image: 'images/Hong_Kong.webp',
              alt: 'Hong Kong',
            },
          ],
        },
      };
  
      const t = computed(() => translations[props.language] || translations.es);
  
      return { t };
    },
    template: `
      <section id="courses">
        <h2 class="section-title">{{ t.title }}</h2>
        <div class="courses-grid">
          <div class="course-card" v-for="(location, index) in t.locations" :key="index">
            <img :src="location.image" :alt="location.alt" />
            <div class="course-content">
              <h3>{{ location.name }}</h3>
              <p>{{ location.description }}</p>
              <a href="#!" class="btn-primary">{{ location.button }}</a>
            </div>
          </div>
        </div>
      </section>
    `,
  };
  