// components/AboutComponent.js
const AboutComponent = {
    props: ['language'],
    setup(props) {
      const { computed } = Vue;
  
      const translations = {
        en: {
          title: 'About',
          sections: [
            {
              heading: 'About Me - English Teacher & IELTS Specialist',
              description: `Hello! I'm Jane, a dedicated English language instructor with over 10 years of experience helping students achieve their academic and professional dreams through English proficiency.
              \n\nBased in China, I specialize in preparing learners for high-stakes exams like IELTS and TOEFL. Over the years, I’ve had the honor of guiding more than 100 students to a band score of 7.0 or higher—a milestone that opens doors to international universities, scholarships, and global careers.`,
              image: 'images/04.jpg',
              alt: 'JEducation',
              id: 'about-jane',
            },
            {
              heading: 'My Teaching Vision',
              description: `I believe that learning English goes beyond grammar and vocabulary—it's about confidence, clarity, and connection. My mission is to empower students to speak fluently, write persuasively, and think critically in English, no matter where they start.
              \n\nWith personalized instruction, proven strategies, and a motivating learning environment, I help my students reach their full potential—whether their goal is to study abroad, build an international career, or simply speak English with confidence.`,
              button: 'Book a class here',
              image: 'images/08.jpg',
              alt: 'JEducation',
              id: 'about-jane2',
            },
          ],
        },
        zh: {
          title: '关于',
          sections: [
            {
              heading: '关于我 - 英语教师与雅思专家',
              description: `你好！我是Jane，一位经验丰富的英语教师，十多年来帮助学生通过英语实现学术和职业梦想。
              \n\n我常驻中国，专注于雅思和托福等高水平考试的备考指导。多年来，我帮助超过100位学生取得7.0分或以上的雅思成绩，打开了通往国际大学、奖学金与全球职业的通道。`,
              image: 'images/04.jpg',
              alt: 'JEducation',
              id: 'about-jane',
            },
            {
              heading: '我的教学理念',
              description: `我相信，学习英语不仅是掌握语法和词汇，更是培养自信、表达清晰、建立联系。我的使命是让学生无论起点如何，都能流利地说英语、有说服力地写作，并具备批判性思维能力。
              \n\n通过个性化教学、实用策略和积极学习环境，我帮助学生实现出国留学、发展国际职业，或仅仅是自信地说英语的目标。`,
              button: '在这里预约课程',
              image: 'images/08.jpg',
              alt: 'JEducation',
              id: 'about-jane2',
            },
          ],
        },
        fr: {
          title: 'À propos',
          sections: [
            {
              heading: 'À propos de moi - Professeure d’anglais & Spécialiste IELTS',
              description: `Bonjour ! Je suis Jane, professeure d’anglais dévouée avec plus de 10 ans d’expérience à aider les étudiants à atteindre leurs objectifs académiques et professionnels grâce à la maîtrise de l’anglais.
              \n\nBasée en Chine, je suis spécialisée dans la préparation aux examens tels que l’IELTS et le TOEFL. J’ai aidé plus de 100 étudiants à obtenir un score de 7.0 ou plus, ouvrant ainsi les portes des universités internationales, bourses et carrières mondiales.`,
              image: 'images/04.jpg',
              alt: 'JEducation',
              id: 'about-jane',
            },
            {
              heading: 'Ma vision de l’enseignement',
              description: `Je crois que l’apprentissage de l’anglais va au-delà de la grammaire et du vocabulaire — c’est une question de confiance, de clarté et de connexion. Ma mission est de permettre aux étudiants de s’exprimer avec aisance, d’écrire avec persuasion et de penser de manière critique en anglais, quel que soit leur niveau de départ.
              \n\nAvec un enseignement personnalisé, des stratégies éprouvées et un environnement motivant, j’aide mes étudiants à atteindre leur plein potentiel, que ce soit pour étudier à l’étranger, travailler à l’international ou simplement parler anglais avec assurance.`,
              button: 'Réservez un cours ici',
              image: 'images/08.jpg',
              alt: 'JEducation',
              id: 'about-jane2',
            },
          ],
        },
        ru: {
          title: 'Обо мне',
          sections: [
            {
              heading: 'Обо мне — преподаватель английского и специалист по IELTS',
              description: `Здравствуйте! Я Джейн, преподаватель английского языка с более чем 10-летним опытом, помогающая студентам достигать академических и профессиональных целей через владение английским.
              \n\nЯ работаю в Китае и специализируюсь на подготовке к экзаменам IELTS и TOEFL. Я помогла более 100 студентам получить балл 7.0 и выше — важный шаг к университетам, стипендиям и международной карьере.`,
              image: 'images/04.jpg',
              alt: 'JEducation',
              id: 'about-jane',
            },
            {
              heading: 'Моя педагогическая философия',
              description: `Я считаю, что изучение английского — это не только грамматика и лексика. Это уверенность, ясность и умение устанавливать контакт. Моя цель — помочь студентам говорить бегло, писать убедительно и мыслить критически на английском языке.
              \n\nС помощью индивидуального подхода, проверенных методик и вдохновляющей среды я помогаю студентам раскрыть потенциал — для учебы за границей, международной карьеры или просто уверенного общения на английском.`,
              button: 'Записаться на курс',
              image: 'images/08.jpg',
              alt: 'JEducation',
              id: 'about-jane2',
            },
          ],
        },
      };
  
      const t = computed(() => translations[props.language] || translations.en);
  
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
  