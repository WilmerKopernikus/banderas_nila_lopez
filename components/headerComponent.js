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
        es: ['Inicio', 'Productos', 'Nuestra Empresa', 'Contacto'],
      };
  
      const icons = [
        'assets/home.svg',
        'assets/productos.svg',
        'assets/about.svg',
        'assets/contact.svg',
      ];
  
      const sectionIds = ['home', 'courses', 'about', 'contact'];
  
      const labels = computed(() => translations[props.language] || translations.es);
  
      return {
        logo: 'assets/logo.svg',
        icons,
        labels,
        sectionIds,
        menuOpen,
        toggleMenu,
        closeMenu,
      };
    },
    template: `
    <header>
      <div class="nav-container">
        <!-- Logo -->
        <div class="logo">
          <a href="#"><img :src="logo" alt="Logo" /></a>
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
            <a :href="'#' + sectionIds[i]" @click="closeMenu">
              <img :src="icons[i]" :alt="label + ' icon'" class="menu-icon" />
              {{ label }}
            </a>
          </li>
        </ul>
      </div>
    </header>
    `,
  };