// components/HeroComponent.js
const HeroComponent = {
    props: ['language'],
    setup(props) {
      const { computed } = Vue;
  
      const translations = {
        es: {
          title: 'Cada hilo cuenta una historia, elige calidad, elige nuestras banderas.',
          description: '',
          button: 'Explora nuestros productos',
        },
      };
  
      const t = computed(() => translations[props.language] || translations.es);
  
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
