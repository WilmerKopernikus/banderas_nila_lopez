// components/HeaderComponent.js
const HeaderComponent = {
    props: ['language', 'setLanguage'],
    setup(props) {
      const { ref, computed, onMounted } = Vue;
  
      const menuOpen = ref(false);
      const langOpen = ref(false);
  
      const toggleMenu = () => {
        menuOpen.value = !menuOpen.value;
      };
  
      const closeMenu = () => {
        menuOpen.value = false;
      };
  
      const toggleLang = () => {
        langOpen.value = !langOpen.value;
      };
  
      const closeLang = () => {
        langOpen.value = false;
      };
  
      const translations = {
        en: ['Inicio', 'Productos', 'Nuestra Empresa', 'Contacto'],
        zh: ['首页', '课程', '关于', '联系'],
        fr: ['Accueil', 'Cours', 'À propos', 'Contact'],
        ru: ['Главная', 'Курсы', 'О проекте', 'Контакты'],
      };
  
      const icons = [
        'assets/home.svg',
        'assets/productos.svg',
        'assets/about.svg',
        'assets/contact.svg',
      ];
  
      const flags = {
        en: 'assets/uk.svg',
        fr: 'assets/france.svg',
        zh: 'assets/china.svg',
        ru: 'assets/russia.svg',
      };
  
      const languages = ['en', 'zh', 'fr', 'ru'];
      const sectionIds = ['home', 'courses', 'about', 'contact'];
  
      const labels = computed(() => translations[props.language] || translations.en);
      const otherLanguages = computed(() =>
        languages.filter((lang) => lang !== props.language)
      );
  
      const currentLanguage = computed(() => props.language); // ✅ reactive reference
  
      const changeLanguage = (lang) => {
        props.setLanguage(lang);
        closeLang(); // hide language menu after selection
      };
  
      // Close language menu if user clicks outside
      onMounted(() => {
        document.addEventListener('click', (e) => {
          const selector = document.querySelector('.language-selector');
          if (selector && !selector.contains(e.target)) {
            closeLang();
          }
        });
      });
  
      return {
        logo: 'assets/logo.svg',
        flags,
        icons,
        labels,
        sectionIds,
        menuOpen,
        toggleMenu,
        closeMenu,
        langOpen,
        toggleLang,
        closeLang,
        otherLanguages,
        changeLanguage,
        currentLanguage, // ✅ use this in template
      };
    },
    template: `
    <header>
      <div class="nav-container">
        <!-- Logo -->
        <div class="logo">
          <a href="#"><img :src="logo" alt="Logo" /></a>
        </div>
  
        <!-- Language Selector -->
        <div class="language-selector">
          <div class="current-lang" @click="toggleLang">
            <img :src="flags[currentLanguage]" :alt="currentLanguage + ' flag'" class="flag-icon" />
            {{ currentLanguage.toUpperCase() }} ▼
          </div>
          <ul class="language-options" :class="{ show: langOpen }">
            <li v-for="lang in otherLanguages" :key="lang">
              <button @click="changeLanguage(lang)" class="lang-button">
                <img :src="flags[lang]" :alt="lang + ' flag'" class="flag-icon" />
                {{ lang.toUpperCase() }}
              </button>
            </li>
          </ul>
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
  