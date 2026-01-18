// main.js
const { createApp, ref, onMounted } = Vue;

const appLanguage = ref('en');

createApp({
  components: {
    HeaderComponent,
    HeroComponent,
    CoursesComponent,
    LocationsComponent,
    AboutComponent,
    TestimonialsComponent,
    ContactComponent,
    FooterComponent,
  },
  setup() {
    const setLanguage = (lang) => {
      appLanguage.value = lang;
    };

    // Visibility refs for deferred components
    const showCourses = ref(false);
    const showLocations = ref(false);
    const showAbout = ref(false);
    const showTestimonials = ref(false);
    const showContact = ref(false);
    const showFooter = ref(false);

    // Stagger component loading after mount
    onMounted(() => {
      setTimeout(() => (showCourses.value = true), 300);
      setTimeout(() => (showLocations.value = true), 500);
      setTimeout(() => (showAbout.value = true), 700);
      setTimeout(() => (showTestimonials.value = true), 900);
      setTimeout(() => (showContact.value = true), 1100);
      setTimeout(() => (showFooter.value = true), 1300);
    });

    return {
      language: appLanguage,
      setLanguage,
      showCourses,
      showLocations,
      showAbout,
      showTestimonials,
      showContact,
      showFooter,
    };
  },
}).mount('#app');



  