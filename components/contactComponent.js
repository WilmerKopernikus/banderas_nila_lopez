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
    const userName = ref('');
    const userEmail = ref('');

    // Check localStorage when component is mounted
    onMounted(() => {
      const storedMessage = localStorage.getItem('prefilledMessage');
      if (storedMessage) {
        questionMessage.value = storedMessage;
        localStorage.removeItem('prefilledMessage');
      }
    });

    const encode = (data) =>
      Object.keys(data)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&');

    const handleSubmit = async () => {
      try {
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encode({
            'form-name': 'contacto',
            name: userName.value,
            email: userEmail.value,
            message: questionMessage.value,
          }),
        });

        alert(t.value.thankYou);
        userName.value = '';
        userEmail.value = '';
        questionMessage.value = '';
      } catch (error) {
        alert('Hubo un error enviando el formulario. Intenta nuevamente.');
      }
    };

    return {
      t,
      handleSubmit,
      questionMessage,
      userName,
      userEmail,
    };
  },
  template: `
    <section id="contact">
      <h2 class="section-title">{{ t.title }}</h2>
      <form name="contacto" method="POST" data-netlify="true" @submit.prevent="handleSubmit">
        <input type="hidden" name="form-name" value="contacto" />
        <input type="text" name="name" v-model="userName" :placeholder="t.namePlaceholder" required />
        <input type="email" name="email" v-model="userEmail" :placeholder="t.emailPlaceholder" required />
        <textarea
          rows="4"
          name="message"
          :placeholder="t.questionPlaceholder"
          v-model="questionMessage">
        </textarea>
        <button type="submit" class="btn-primary">{{ t.submit }}</button>
      </form>
    </section>
  `,
};

