// components/LocationsComponent.js
const LocationsComponent = {
  props: ['language'],
  setup(props) {
    const { computed } = Vue;

    const translations = {
      es: {
        title: 'El amor por Colombia ondea en cada una de nuestras banderas.',
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
      <section class="locations-hero" id="locations">
        <div class="hero-content">
          <h1>{{ t.title }}</h1>
          <p>{{ t.description }}</p>
          <a href="#courses" class="btn-primary">{{ t.button }}</a>
        </div>
      </section>
    `,
};
