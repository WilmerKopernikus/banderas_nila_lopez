// components/LocationsComponent.js
const LocationsComponent = {
    props: ['language'],
    setup(props) {
      const { computed } = Vue;
  
      const translations = {
        en: {
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
        zh: {
          title: '位于中国大湾区',
          locations: [
            {
              name: '广州',
              description:
                '在中国最具历史的贸易城市之一学习英语。广州融合了丰富的粤文化和充满活力的商业环境，非常适合希望连接传统与现代沟通的学习者。',
              button: '在这里预约课程',
              image: 'images/Guangzhou.jpg',
              alt: '广州',
            },
            {
              name: '深圳',
              description:
                '在中国的科技之都学习英语。深圳节奏快、创新力强、国际化，是提升语言技能的理想之地。',
              button: '在这里预约课程',
              image: 'images/Shenzhen.jpg',
              alt: '深圳',
            },
            {
              name: '香港',
              description:
                '在亚洲最具活力和国际化的城市之一学习英语。香港东西方文化交融，为提升流利度和自信心提供理想环境。',
              button: '在这里预约课程',
              image: 'images/Hong_Kong.webp',
              alt: '香港',
            },
          ],
        },
        fr: {
          title: 'Situé dans la région de la Grande Baie de Chine',
          locations: [
            {
              name: 'Canton',
              description:
                'Apprenez l’anglais dans l’une des villes commerçantes les plus historiques de Chine. Canton allie patrimoine cantonais et environnement commercial dynamique — idéal pour relier tradition et communication moderne.',
              button: 'Réservez un cours ici',
              image: 'images/Guangzhou.jpg',
              alt: 'Canton',
            },
            {
              name: 'Shenzhen',
              description:
                'Prenez des cours d’anglais dans la capitale technologique de la Chine. Shenzhen est rapide, innovante et mondiale — un endroit parfait pour perfectionner votre anglais professionnel.',
              button: 'Réservez un cours ici',
              image: 'images/Shenzhen.jpg',
              alt: 'Shenzhen',
            },
            {
              name: 'Hong Kong',
              description:
                'Étudiez l’anglais dans l’une des villes les plus internationales d’Asie. La culture Est-Ouest de Hong Kong est le cadre idéal pour améliorer votre aisance.',
              button: 'Réservez un cours ici',
              image: 'images/Hong_Kong.webp',
              alt: 'Hong Kong',
            },
          ],
        },
        ru: {
          title: 'Основаны в регионе Большого залива Китая',
          locations: [
            {
              name: 'Гуанчжоу',
              description:
                'Учите английский в одном из старейших торговых городов Китая. Гуанчжоу сочетает кантонское наследие с деловой атмосферой.',
              button: 'Записаться на курс',
              image: 'images/Guangzhou.jpg',
              alt: 'Гуанчжоу',
            },
            {
              name: 'Шэньчжэнь',
              description:
                'Изучайте английский в технологической столице Китая. Шэньчжэнь — это инновации, международность и отличное место для языковой практики.',
              button: 'Записаться на курс',
              image: 'images/Shenzhen.jpg',
              alt: 'Шэньчжэнь',
            },
            {
              name: 'Гонконг',
              description:
                'Улучшайте английский в одном из самых интернациональных городов Азии. Гонконг — идеальное место для общения на английском в глобальной среде.',
              button: 'Записаться на курс',
              image: 'images/Hong_Kong.webp',
              alt: 'Гонконг',
            },
          ],
        },
      };
  
      const t = computed(() => translations[props.language] || translations.en);
  
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
  