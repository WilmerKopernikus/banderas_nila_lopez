// components/CoursesComponent.js
const CoursesComponent = {
  props: ['language'],
  setup(props) {
    const { computed } = Vue;

    const translations = {
        en: {
          title: 'Nuestros Productos',
          courses: [
            {
              title: 'Banderas de Colombia',
              description:
                'Somos expertos en la fabricación de banderas de Colombia, sus departamentos, ciudades y municipios. Estamos ubicados en Bogotá y ofrecemos envíos nacionales e internacionales. Solicita tu cotización hoy y recibe asesoría personalizada.',
              button: 'Solicitar Cotización',
              image: 'images/001-Colombia.png',
              alt: 'Public Speaking Course',
            },
            {
              title: 'Banderas Empresariales',
              description:
                'Master the language of international business. This course focuses on effective communication in meetings, emails, presentations, and negotiations — all tailored for the global workplace.',
              button: 'Solicitar Cotización',
              image: 'images/Banderas_Empresariales.png',
              alt: 'Business English',
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
        zh: {
          title: '我们的课程',
          courses: [
            {
              title: '公众演讲',
              description: '提升在观众面前讲话的自信和表达能力。通过实践练习和实时反馈，学习身体语言、语音技巧、说服策略和应对舞台焦虑的方法。',
              button: '预订此课程',
              image: 'images/01.jpg',
              alt: '公众演讲课程',
            },
            {
              title: '商务英语',
              description: '掌握国际商务语言。课程涵盖会议、邮件、演讲和谈判中的高效沟通技巧，专为全球职场设计。',
              button: '预订此课程',
              image: 'images/03.jpg',
              alt: '商务英语',
            },
            {
              title: '辩论',
              description: '通过实用的辩论策略提升你的表达能力。学习清晰表达观点、捍卫立场，并自信地参与结构化讨论。',
              button: '预订此课程',
              image: 'images/05.jpg',
              alt: '辩论与批判性思维',
            },
            {
              title: '雅思备考课程',
              description: '通过专家指导和针对性练习掌握雅思考试。课程涵盖听力、阅读、写作和口语四个部分，助你达成留学、签证或职业目标。',
              button: '预订此课程',
              image: 'images/01.avif',
              alt: '雅思备考课程',
            },
            {
              title: '托福备考课程',
              description: '通过有针对性的备考课程，为托福考试做好准备。掌握每个部分的策略，提升成绩与信心。',
              button: '预订此课程',
              image: 'images/01.png',
              alt: '托福备考课程',
            },
            {
              title: '中级英语',
              description: '通过实用课程加强英语基础技能。提升语法、扩展词汇，并在日常交流中建立信心，适合 B1–B2 水平学习者。',
              button: '预订此课程',
              image: 'images/07.jpg',
              alt: '中级英语课程',
            },
            {
              title: '高级英语',
              description: '通过高级英语课程提升流利度、词汇量与语法水平，适用于专业人士、学者及备考 C1/C2 的学习者。',
              button: '预订此课程',
              image: 'images/06.jpg',
              alt: '高级英语课程',
            },
          ],
        },
        fr: {
          title: 'Nos cours',
          courses: [
            {
              title: 'Prise de parole en public',
              description: 'Gagnez en confiance en parlant devant un public. Ce cours couvre le langage corporel, la voix, les techniques de persuasion et la gestion du trac avec des exercices pratiques.',
              button: 'Réserver ce cours',
              image: 'images/01.jpg',
              alt: 'Cours de prise de parole en public',
            },
            {
              title: 'Anglais des affaires',
              description: 'Maîtrisez le langage des affaires internationales. Apprenez à communiquer efficacement lors de réunions, courriels, présentations et négociations.',
              button: 'Réserver ce cours',
              image: 'images/03.jpg',
              alt: 'Anglais des affaires',
            },
            {
              title: 'Débat',
              description: 'Améliorez votre aisance à l’oral grâce aux techniques de débat. Exprimez vos idées clairement, défendez-les et participez avec confiance à des discussions structurées.',
              button: 'Réserver ce cours',
              image: 'images/05.jpg',
              alt: 'Débat et pensée critique',
            },
            {
              title: 'Préparation IELTS',
              description: 'Préparez-vous à l’examen IELTS avec un encadrement expert. Travaillez les quatre compétences pour atteindre vos objectifs académiques ou professionnels.',
              button: 'Réserver ce cours',
              image: 'images/01.avif',
              alt: 'Cours IELTS',
            },
            {
              title: 'Préparation TOEFL',
              description: 'Maîtrisez l’examen TOEFL avec des stratégies ciblées et des exercices pratiques basés sur des exemples réels.',
              button: 'Réserver ce cours',
              image: 'images/01.png',
              alt: 'Cours TOEFL',
            },
            {
              title: 'Anglais intermédiaire',
              description: 'Renforcez vos bases avec ce cours pratique. Améliorez votre grammaire, enrichissez votre vocabulaire et gagnez en fluidité.',
              button: 'Réserver ce cours',
              image: 'images/07.jpg',
              alt: 'Anglais intermédiaire',
            },
            {
              title: 'Anglais avancé',
              description: 'Atteignez un niveau avancé avec notre cours de maîtrise. Idéal pour les professionnels, les universitaires ou les examens C1/C2.',
              button: 'Réserver ce cours',
              image: 'images/06.jpg',
              alt: 'Anglais avancé',
            },
          ],
        },
        ru: {
          title: 'Наши курсы',
          courses: [
            {
              title: 'Ораторское искусство',
              description: 'Уверенно выступайте перед аудиторией. Изучите язык тела, голосовые техники и преодоление волнения на сцене через практику.',
              button: 'Забронировать этот курс',
              image: 'images/01.jpg',
              alt: 'Курс ораторского искусства',
            },
            {
              title: 'Деловой английский',
              description: 'Овладейте языком международного бизнеса. Научитесь эффективно общаться на встречах, в письмах и презентациях.',
              button: 'Забронировать этот курс',
              image: 'images/03.jpg',
              alt: 'Деловой английский',
            },
            {
              title: 'Дебаты',
              description: 'Развивайте навыки аргументации и уверенного выступления. Участвуйте в структурированных обсуждениях с уверенностью.',
              button: 'Забронировать этот курс',
              image: 'images/05.jpg',
              alt: 'Дебаты и критическое мышление',
            },
            {
              title: 'Подготовка к IELTS',
              description: 'Получите высокий балл на IELTS с помощью экспертных советов и практики по всем разделам экзамена.',
              button: 'Забронировать этот курс',
              image: 'images/01.avif',
              alt: 'Курс IELTS',
            },
            {
              title: 'Подготовка к TOEFL',
              description: 'Развивайте стратегии и готовьтесь к TOEFL с помощью реальных заданий и тренировки.',
              button: 'Забронировать этот курс',
              image: 'images/01.png',
              alt: 'Курс TOEFL',
            },
            {
              title: 'Английский — средний уровень',
              description: 'Укрепите свои знания грамматики и словарный запас. Подходит для уровня B1–B2.',
              button: 'Забронировать этот курс',
              image: 'images/07.jpg',
              alt: 'Средний уровень английского',
            },
            {
              title: 'Английский — продвинутый уровень',
              description: 'Повышайте уровень владения английским. Идеально для подготовки к экзаменам C1/C2.',
              button: 'Забронировать этот курс',
              image: 'images/06.jpg',
              alt: 'Продвинутый английский',
            },
          ],
        },
      };
  
      const t = computed(() => translations[props.language] || translations.en);

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
