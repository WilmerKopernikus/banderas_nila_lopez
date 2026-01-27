// components/HeaderComponent.js
const HeaderComponent = {
  props: ['language'],
  setup(props) {
    const { ref, computed } = Vue;

    const menuOpen = ref(false);

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
    };

    const closeMenu = () => {
      menuOpen.value = false;
    };

    const translations = {
      es: ['Inicio', 'Productos', 'Nuestra Empresa', 'Galería', 'Contacto'],
    };


    const icons = [
      'assets/home.svg',
      'assets/productos.svg',
      'assets/about.svg',
      'assets/contact.svg',
    ];

    const contactItems = [
      {
        icon: 'assets/icon01-negativo.png',
        text: '315 6299918',
        alt: 'Teléfono',
      },
      {
        icon: 'assets/icon02-negativo.png',
        text: 'Calle 75 No 58-51 - 2o. Piso - Bogotá, Colombia',
        alt: 'Ubicación',
      },
      {
        icon: 'assets/icon03-negativo.png',
        text: 'banderasnilalopez@gmail.com',
        alt: 'Correo',
      },
    ];

    const sectionIds = ['home', 'courses', 'about', 'gallery.html', 'contact'];


    const labels = computed(() => translations[props.language] || translations.es);

    return {
      logo: 'assets/logo.svg',
      icons,
      labels,
      sectionIds,
      contactItems,
      menuOpen,
      toggleMenu,
      closeMenu,
    };
  },
  template: `
    <div class="contact-info-bar">
      <div v-for="(item, index) in contactItems" :key="index" class="contact-info-item">
        <img :src="item.icon" :alt="item.alt" />
        <span>{{ item.text }}</span>
      </div>
    </div>
    <header>
      <div class="nav-container">
        <!-- Logo -->
        <div class="logo">
          <a href="#home" @click="closeMenu">
            <img :src="logo" alt="Banderas Nila López" />
          </a>
        </div>
  
        <!-- Hamburger Menu -->
        <div class="hamburger-menu" @click="toggleMenu">
          <div :class="['hamburger', { open: menuOpen }]">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
  
      <!-- Menu Overlay -->
      <div :class="['menu-overlay', { show: menuOpen }]">
        <ul>
          <li v-for="(label, i) in labels" :key="i">
            <a 
              :href="sectionIds[i].includes('.html') ? sectionIds[i] : '#' + sectionIds[i]" 
              @click="closeMenu"
            >
              <img :src="icons[i]" :alt="label + ' icon'" class="menu-icon" />
              {{ label }}
            </a>
          </li>
        </ul>
      </div>
    </header>
    `,
};