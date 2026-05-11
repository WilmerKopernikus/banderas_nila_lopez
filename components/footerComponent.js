// components/FooterComponent.js
const FooterComponent = {
  props: ['language'],
  setup(props) {
    const { computed } = Vue;

    const translations = {
      es: {
        allRights: 'Todos los derechos reservados.',
        aboutTitle: 'Sobre Nosotros',
        aboutText: 'Especialistas en fabricación y diseño de banderas institucionales, empresariales y personalizadas con más de 20 años de experiencia.',
        quickLinks: 'Enlaces Rápidos',
        home: 'Inicio',
        products: 'Productos',
        catalog: 'Catálogo',
        quote: 'Solicita Cotización',
        contact: 'Contáctanos',
        contactTitle: 'Contacto',
        phone: 'Teléfono',
        location: 'Ubicación',
        email: 'Correo',
        legalLinks: 'Legal',
        privacy: 'Política de Privacidad',
        terms: 'Términos y Condiciones',
        followUs: 'Síguenos',
      },
    };

    const currentYear = new Date().getFullYear();
    const t = computed(() => translations[props.language] || translations.es);

    const contactInfo = [
      { label: 'phone', icon: 'assets/icon01-negativo.png', value: '315 6299918' },
      { label: 'location', icon: 'assets/icon02-negativo.png', value: 'Calle 75 No 58-51 - 2o. Piso - Bogotá, Colombia' },
      { label: 'email', icon: 'assets/icon03-negativo.png', value: 'banderasnilalopez@gmail.com' },
    ];

    return {
      currentYear,
      t,
      contactInfo,
    };
  },
  template: `
    <footer class="footer">
      <div class="footer-content">
        <!-- About Section -->
        <div class="footer-section">
          <h3>{{ t.aboutTitle }}</h3>
          <p>{{ t.aboutText }}</p>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h3>{{ t.quickLinks }}</h3>
          <ul>
            <li><a href="#home">{{ t.home }}</a></li>
            <li><a href="#courses">{{ t.products }}</a></li>
            <li><a href="nuestro_catalogo.html">{{ t.catalog }}</a></li>
            <li><a href="cotizacion.html">{{ t.quote }}</a></li>
            <li><a href="contacto.html">{{ t.contact }}</a></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="footer-section">
          <h3>{{ t.contactTitle }}</h3>
          <ul class="contact-list">
            <li v-for="item in contactInfo" :key="item.label" class="contact-item">
              <img :src="item.icon" :alt="t[item.label]" />
              <span>{{ item.value }}</span>
            </li>
          </ul>
        </div>

        <!-- Legal Links -->
        <!-- <div class="footer-section">
          <h3>{{ t.legalLinks }}</h3>
          <ul>
            <li><a href="#">{{ t.privacy }}</a></li>
            <li><a href="#">{{ t.terms }}</a></li>
          </ul>
        </div> -->
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Banderas Nila López. {{ t.allRights }}</p>
      </div>
    </footer>
  `,
};
