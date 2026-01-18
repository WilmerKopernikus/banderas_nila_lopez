// components/ContactComponent.js
const ContactComponent = {
  props: ['language'],
  setup(props) {
    const { computed, ref, onMounted } = Vue;

    // Translations for each language
    const translations = {
      es: {
        title: 'Solicita una Cotización',
        namePlaceholder: 'Nombre',
        emailPlaceholder: 'Correo Electrónico',
        questionPlaceholder: 'Tu solicitud de Cotización',
        submit: 'Enviar',
        thankYou: "¡Gracias! Nos pondremos en contacto contigo pronto.",
      },
    };

    const t = computed(() => translations[props.language] || translations.es);

    // Bind questionMessage to the textarea
    const questionMessage = ref('');

    // Check localStorage when component is mounted
    onMounted(() => {
      const storedMessage = localStorage.getItem('prefilledMessage');
      if (storedMessage) {
        questionMessage.value = storedMessage;
        localStorage.removeItem('prefilledMessage');
      }
    });

    const handleSubmit = () => {
      alert(t.value.thankYou);
      // Optionally clear the form after submission
      questionMessage.value = '';
    };

    return {
      t,
      handleSubmit,
      questionMessage,
    };
  },
  template: `
    <section id="contact">
      <h2 class="section-title">{{ t.title }}</h2>
      <form @submit.prevent="handleSubmit">
        <input type="text" :placeholder="t.namePlaceholder" required />
        <input type="email" :placeholder="t.emailPlaceholder" required />
        <textarea
          rows="4"
          :placeholder="t.questionPlaceholder"
          v-model="questionMessage">
        </textarea>
        <button type="submit" class="btn-primary">{{ t.submit }}</button>
      </form>
    </section>
  `,
};

