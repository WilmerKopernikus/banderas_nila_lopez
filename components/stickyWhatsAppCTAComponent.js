const StickyWhatsAppCTAComponent = {
  props: ['language'],
  setup(props) {
    const { computed, ref, onMounted, onBeforeUnmount } = Vue;

    const phoneNumber = '573156299918';
    const defaultMessage =
      'Buenos días, estoy interesado en sus productos ¿Me podrías dar más información porfavor?';

    const selectedProduct = ref('');

    const buildMessage = () => {
      if (!selectedProduct.value) {
        return defaultMessage;
      }

      return `Buenos días, estoy interesado en ${selectedProduct.value}. ¿Me podrías dar más información, por favor?`;
    };

    const whatsappHref = computed(() => {
      const encodedMessage = encodeURIComponent(buildMessage());
      return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    });

    const loadSelectedProduct = () => {
      selectedProduct.value = localStorage.getItem('selectedProduct') || '';
    };

    const handleClick = () => {
      const payload = {
        channel: 'whatsapp',
        source: 'sticky_cta',
        language: props.language || 'es',
        selectedProduct: selectedProduct.value || null,
        message: buildMessage(),
        timestamp: new Date().toISOString(),
      };

      window.dispatchEvent(new CustomEvent('whatsapp_cta_click', { detail: payload }));

      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event: 'whatsapp_cta_click', ...payload });
      }

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'whatsapp_cta_click', payload);
      }
    };

    onMounted(() => {
      loadSelectedProduct();
      window.addEventListener('selected-product-updated', loadSelectedProduct);
      window.addEventListener('storage', loadSelectedProduct);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('selected-product-updated', loadSelectedProduct);
      window.removeEventListener('storage', loadSelectedProduct);
    });

    return {
      whatsappHref,
      handleClick,
    };
  },
  template: `
    <a
      class="sticky-whatsapp-cta"
      :href="whatsappHref"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      @click="handleClick"
    >
      <img src="assets/whatsapp_logo.png" alt="WhatsApp" />
      <span>WhatsApp</span>
    </a>
  `,
};