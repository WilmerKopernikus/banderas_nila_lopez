// components/LocationsComponent.js
const LocationsComponent = {
  props: ['language'],
  setup(props) {
    const { computed } = Vue;

    const translations = {
      es: {
        title: 'El amor por Colombia ondea en cada una de nuestras banderas.',
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
        </div>
      </section>
    `,
};
