// components/FooterComponent.js
const FooterComponent = {
    props: ['language'],
    setup(props) {
      const { computed } = Vue;
  
      const translations = {
        en: 'All rights reserved.',
        zh: '版权所有。',
        fr: 'Tous droits réservés.',
        ru: 'Все права защищены.',
      };
  
      const currentYear = new Date().getFullYear();
  
      const text = computed(() => translations[props.language] || translations.en);
  
      return {
        currentYear,
        text,
      };
    },
    template: `
      <footer>
        © {{ currentYear }} JEducation. {{ text }}
      </footer>
    `,
  };
  