// components/CoursesComponent.js
const CoursesComponent = {
  props: ['language'],
  setup(props) {
    const { computed } = Vue;

    const translations = {
        es: {
          title: 'Nuestros Productos',
          courses: [
            {
              title: 'Banderas de Colombia',
              description:
                'Somos expertos en la fabricación de banderas de Colombia, sus departamentos, ciudades y municipios. Estamos ubicados en Bogotá y ofrecemos envíos nacionales e internacionales. Solicita tu cotización hoy y recibe asesoría personalizada.',
              button: 'Cotizar bandera de Colombia',
              image: 'images/001-Colombia.png',
              alt: 'Banderas de Colombia',
            },
            {
              title: 'Banderas Empresariales',
              description:
                'Contáctanos si necesitas una bandera para tu empresa. Fabricamos banderas personalizadas según el logo y los colores de tu marca. También ofrecemos diseño gráfico para fortalecer tu identidad corporativa. Solicita tu cotización hoy.',
              button: 'Cotizar bandera empresarial',
              image: 'images/Banderas_Empresariales.png',
              alt: 'Banderas Empresariales',
            },
            {
              title: 'Banderas del Mundo',
              description:
                'Fabricamos banderas de países de todo el mundo con altos estándares de calidad. Trabajamos con embajadas reconocidas y entidades oficiales. Contáctanos hoy y solicita tu cotización para banderas diplomáticas y protocolares.',
              button: 'Cotizar bandera internacional',
              image: 'images/Banderas_del_Mundo.png',
              alt: 'Banderas del Mundo',
            },
            {
              title: 'Banderas de Escritorio',
              description:
                'Ofrecemos banderas de escritorio para oficinas, eventos y espacios institucionales. Fabricamos modelos personalizados y de países, con bases elegantes y excelente calidad. Contáctanos hoy y solicita tu cotización.',
              button: 'Cotizar bandera de escritorio',
              image: 'images/Banderas_de_Escritorio.png',
              alt: 'Banderas de Escritorio',
            },
            {
              title: 'Banderas para Exteriores',
              description:
                'Ofrecemos banderas para exteriores resistentes y duraderas, ideales para eventos al aire libre, instituciones y espacios públicos. Fabricamos modelos personalizados y estándar con materiales de alta calidad. Contáctanos hoy y solicita tu cotización.',
              button: 'Cotizar bandera para exteriores',
              image: 'images/Banderas_para_Exteriores.png',
              alt: 'Banderas para Exteriores',
            },
            {
              title: 'Banderas Institucionales',
              description:
                'Elaboramos banderas institucionales para entidades públicas y privadas. Cuidamos que los logos de su institución queden acordes a sus reglas de diseño, garantizando calidad, precisión y excelente presentación. Solicite su cotización hoy.',
              button: 'Cotizar bandera institucional',
              image: 'images/Banderas_Institucionales.png',
              alt: 'Banderas Institucionales',
            }
          ],
        },
      };
  
      const t = computed(() => translations[props.language] || translations.es);

      // Booking logic
      const bookCourse = (courseTitle) => {
        const messageMap = {
          en: `I want to book the course: ${courseTitle}.`,
          zh: `我想报名参加课程：${courseTitle}.`,
          fr: `Je souhaite m’inscrire au cours : ${courseTitle}.`,
          ru: `Я хотел(а) бы записаться на курс: ${courseTitle}.`,
        };
  
        const message = messageMap[props.language] || messageMap.en;
        localStorage.setItem('prefilledMessage', message);
  
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      };
  
      return {
        t,
        bookCourse,
      };
    },
    template: `
      <section id="courses">
        <h2 class="section-title">{{ t.title }}</h2>
        <div class="courses-grid">
          <div class="course-card" v-for="(course, index) in t.courses" :key="index">
            <img :src="course.image" :alt="course.alt" />
            <div class="course-content">
              <h3>{{ course.title }}</h3>
              <p>{{ course.description }}</p>
              <a href="#!" class="btn-primary" @click="bookCourse(course.title)">
                {{ course.button }}
              </a>
            </div>
          </div>
        </div>
      </section>
    `,
  };
