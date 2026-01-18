// components/AboutComponent.js
const AboutComponent = {
    props: ['language'],
    setup(props) {
      const { computed } = Vue;
  
      const translations = {
        es: {
          title: 'Nuestra Empresa',
          sections: [
            {
              heading: 'Alrededor de 30 años en el mercado de las banderas',
              description: `Somos una de las mejores empresas de Colombia en la fabricación de banderas, reconocidos por nuestra calidad, cumplimiento y amplia trayectoria. Contamos con una sólida experiencia trabajando para embajadas, instituciones públicas y privadas de gran importancia a nivel nacional e internacional. Cada proyecto refleja nuestro compromiso con la excelencia, el respeto por los protocolos oficiales y la satisfacción de nuestros clientes. Nuestra experiencia respalda cada detalle de nuestro trabajo.`,
              image: 'images/about.jpg',
              alt: 'JBanderas Nila López',
              id: 'about-jane',
            },
          ],
        },
      };
  
      const t = computed(() => translations[props.language] || translations.es);
  
      return { t };
    },
    template: `
      <section id="about">
        <h2 class="section-title">{{ t.title }}</h2>
        <div class="courses-grid" id="about-section">
          <div
            class="course-card"
            v-for="(section, index) in t.sections"
            :key="index"
          >
            <img :src="section.image" :alt="section.alt" :id="section.id" />
            <div class="course-content">
              <h3>{{ section.heading }}</h3>
              <p v-html="section.description.replace(/\\n/g, '<br>')"></p>
              <a
                v-if="section.button"
                href="#!"
                class="btn-primary"
              >{{ section.button }}</a>
            </div>
          </div>
        </div>
      </section>
    `,
  };
