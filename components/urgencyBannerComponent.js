// components/UrgencyBannerComponent.js
const UrgencyBannerComponent = {
    props: ['language'],
    setup(props) {
      const { computed } = Vue;
  
      const translations = {
        es: {
          title: 'Elige tradición, elige calidad, elige confianza. Envíos nacionales desde Bogotá.',
          buttonCatalog: 'Explora nuestro catálogo',
          buttonQuote: 'Cotizar ahora',
        },
      };
  
      const t = computed(() => translations[props.language] || translations.es);
  
      return {
        t,
      };
    },
    template: `
      <section class="hero" id="urgency-banner">
        <div class="hero-content">
          <h1>{{ t.title }}</h1>
          <div class="hero-cta">
            <a href="nuestro_catalogo.html" class="catalogo-btn"><span>{{ t.buttonCatalog }}</span></a>
            <a href="cotizacion.html" class="catalogo-btn"><span>{{ t.buttonQuote }}</span></a>
          </div>
        </div>
      </section>
    `,
  };
