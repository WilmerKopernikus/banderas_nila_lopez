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
              button: 'Solicitar Cotización',
              image: 'images/001-Colombia.png',
              alt: 'Banderas de Colombia',
            },
            {
              title: 'Banderas Empresariales',
              description:
                'Contáctanos si necesitas una bandera para tu empresa. Fabricamos banderas personalizadas según el logo y los colores de tu marca. También ofrecemos diseño gráfico para fortalecer tu identidad corporativa. Solicita tu cotización hoy.',
              button: 'Solicitar Cotización',
              image: 'images/Banderas_Empresariales.png',
              alt: 'Banderas Empresariales',
            },
            {
              title: 'Banderas del Mundo',
              description:
                'Boost your speaking skills with practical debate strategies. Learn to express opinions clearly, defend your ideas, and engage in structured discussions with confidence.',
              button: 'Solicitar Cotización',
              image: 'images/Banderas_del_Mundo.png',
              alt: 'Debating and Critical Thinking',
            },
            {
              title: 'Banderas de Escritorio',
              description:
                'Master the IELTS exam with expert guidance and targeted practice. This course covers all four components—Listening, Reading, Writing, and Speaking—helping you achieve the score you need for university admission, visas, or professional purposes.',
              button: 'Solicitar Cotización',
              image: 'images/Banderas_de_Escritorio.png',
              alt: 'IELTS Preparation Course',
            },
            {
              title: 'Banderas para Exteriores',
              description:
                'Get ready to succeed on the TOEFL exam with this focused preparation course. Develop strategies for each section—Reading, Listening, Speaking, and Writing—and practice with real test materials to boost your score and confidence.',
              button: 'Solicitar Cotización',
              image: 'images/Banderas_para_Exteriores.png',
              alt: 'TOEFL Preparation Course',
            },
            {
              title: 'Banderas Institucionales',
              description:
                'Strengthen your core English skills with this practical course. Improve your grammar, build a wider vocabulary, and gain confidence in everyday conversations, writing, and listening. Perfect for learners at B1–B2 levels.',
              button: 'Solicitar Cotización',
              image: 'images/Banderas_Institucionales.png',
              alt: 'Intermediate English Course',
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
