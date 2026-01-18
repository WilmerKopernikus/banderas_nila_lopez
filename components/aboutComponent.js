// components/AboutComponent.js
const AboutComponent = {
    props: ['language'],
    setup(props) {
      const { computed } = Vue;
  
      const translations = {
        es: {
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
