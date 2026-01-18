// components/FooterComponent.js
const FooterComponent = {
    props: ['language'],
    setup(props) {
      const { computed } = Vue;
  
      const translations = {
        es: 'Todos los derechos reservados.',
      };
  
      const currentYear = new Date().getFullYear();
  
      const t = computed(() => translations[props.language] || translations.es);
  
      return {
        currentYear,
        t,
      };
    },
    template: `
      <footer>
        © {{ currentYear }} Banderas Nila López. {{ t }}
      </footer>
    `,
  };
