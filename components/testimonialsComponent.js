// components/TestimonialsComponent.js
const TestimonialsComponent = {
    props: ['language'],
    setup(props) {
      const { ref, computed, onMounted } = Vue;
  
      const translations = {
        en: {
          title: 'What our students say',
          testimonials: [
            {
              text: 'The Business English course helped me feel confident speaking with international clients. I use what I learned every day at work.',
              author: '— Wei Zhang, Shanghai',
            },
            {
              text: 'I always struggled with pronunciation, but this course made it fun and effective. My colleagues immediately noticed the difference.',
              author: '— Yi-Ting Shi, Guangzhou',
            },
            {
              text: 'The debate classes improved my critical thinking and public speaking. I now participate in conferences without fear.',
              author: '— Anastasia Ivanova, Saint Petersburg',
            },
          ],
        },
        zh: {
          title: '我们的学生怎么说',
          testimonials: [
            {
              text: '商务英语课程让我在与国际客户交流时更加自信。我每天都在工作中运用所学。',
              author: '— 张伟，上海',
            },
            {
              text: '我以前总是发音不准，但这个课程既有趣又有效。我的同事立刻注意到了变化。',
              author: '— 施怡婷，广州',
            },
            {
              text: '辩论课程提升了我的批判性思维和公众演讲能力。我现在可以自信地参加会议了。',
              author: '— 阿娜斯塔西娅·伊万诺娃，圣彼得堡',
            },
          ],
        },
        fr: {
          title: 'Ce que disent nos étudiants',
          testimonials: [
            {
              text: "Le cours d'anglais des affaires m'a aidé à me sentir à l'aise avec des clients internationaux. J’utilise ce que j’ai appris tous les jours.",
              author: '— Wei Zhang, Shanghai',
            },
            {
              text: "J'avais du mal avec la prononciation, mais ce cours était ludique et efficace. Mes collègues ont immédiatement remarqué la différence.",
              author: '— Yi-Ting Shi, Guangzhou',
            },
            {
              text: "Les cours de débat ont amélioré ma pensée critique et mes compétences oratoires. Je participe maintenant aux conférences sans crainte.",
              author: '— Anastasia Ivanova, Saint-Pétersbourg',
            },
          ],
        },
        ru: {
          title: 'Отзывы наших студентов',
          testimonials: [
            {
              text: 'Курс делового английского помог мне уверенно общаться с международными клиентами. Я использую знания каждый день на работе.',
              author: '— Вэй Чжан, Шанхай',
            },
            {
              text: 'У меня всегда были трудности с произношением, но этот курс сделал обучение увлекательным и эффективным. Коллеги сразу заметили прогресс.',
              author: '— И-Тин Ши, Гуанчжоу',
            },
            {
              text: 'Занятия по дебатам улучшили мои навыки критического мышления и публичных выступлений. Теперь я без страха участвую в конференциях.',
              author: '— Анастасия Иванова, Санкт-Петербург',
            },
          ],
        },
      };
  
      const t = computed(() => translations[props.language] || translations.en);
      const activeIndex = ref(0);
      const testimonialsLength = computed(() => t.value.testimonials.length);
  
      onMounted(() => {
        if (testimonialsLength.value > 1) {
          setInterval(() => {
            activeIndex.value =
              (activeIndex.value + 1) % testimonialsLength.value;
          }, 7000);
        }
      });
  
      return {
        t,
        activeIndex,
      };
    },
    template: `
      <section id="testimonials" style="background: linear-gradient(to right, #81d9ff, #009fe3);">
        <h2 class="section-title">{{ t.title }}</h2>
        <div class="testimonial-wrapper">
          <blockquote
            v-for="(item, index) in t.testimonials"
            :key="index"
            class="testimonial"
            :class="{ active: index === activeIndex }"
          >
            <p>"{{ item.text }}"</p><br />
            <cite>{{ item.author }}</cite>
          </blockquote>
        </div>
      </section>
    `,
  };
  