// components/HeroComponent.js
const HeroComponent = {
    props: ['language'],
    setup(props) {
      const { computed } = Vue;
  
      const translations = {
        en: {
          title: 'Cada hilo cuenta una historia, elige calidad, elige nuestras banderas.',
          description: '',
          button: 'Explora nuestros productos',
        },
        zh: {
          title: '在中国学习英语',
          description: '通过我们的语言课程探索世界，开启改变人生的旅程。',
          button: '探索课程',
        },
        fr: {
          title: 'Étudiez l’anglais en Chine',
          description: 'Découvrez le monde grâce à nos cours de langues et vivez une aventure inoubliable.',
          button: 'Découvrir les cours',
        },
        ru: {
          title: 'Изучайте английский в Китае',
          description: 'Откройте для себя мир с нашими языковыми курсами и начните захватывающее путешествие.',
          button: 'Посмотреть курсы',
        },
      };
  
      const t = computed(() => translations[props.language] || translations.en);
  
      return {
        t,
      };
    },
    template: `
      <section class="hero" id="home">
        <div class="hero-content">
          <h1>{{ t.title }}</h1>
          <p>{{ t.description }}</p>
          <a href="#courses" class="btn-primary">{{ t.button }}</a>
        </div>
      </section>
    `,
  };
  