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
    UrgencyBannerComponent,
    TestimonialsComponent,
    FooterComponent,
    StickyWhatsAppCTAComponent,
  },
  setup() {

    // Visibility refs for deferred components
    const showCourses = ref(false);
    const showLocations = ref(false);
    const showAbout = ref(false);
    const showUrgencyBanner = ref(false);
    const showTestimonials = ref(false);
    const showFooter = ref(false);

    // Stagger component loading after mount
    onMounted(() => {
      setTimeout(() => (showCourses.value = true), 300);
      setTimeout(() => (showLocations.value = true), 500);
      setTimeout(() => (showAbout.value = true), 700);
      setTimeout(() => (showUrgencyBanner.value = true), 800);
      setTimeout(() => (showTestimonials.value = true), 900);
      setTimeout(() => (showFooter.value = true), 1300);
    });

    return {
      language: appLanguage,
      showCourses,
      showLocations,
      showAbout,
      showUrgencyBanner,
      showTestimonials,
      showFooter,
    };
  },
}).mount('#app');



  