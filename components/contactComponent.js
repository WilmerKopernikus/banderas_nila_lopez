// components/ContactComponent.js
const ContactComponent = {
  props: ['language'],
  setup(props) {
    const { computed, reactive, ref, watch, onMounted, onUnmounted, nextTick } = Vue;

    const translations = {
      es: {
        title: 'Solicita una Cotización',
        subtitle: 'Completa estos pasos para enviarnos una solicitud guiada.',
        stepLabel: 'Paso',
        next: 'Siguiente',
        back: 'Atrás',
        submit: 'Enviar cotización',
        processing: 'Espera mientras procesamos tu solicitud...',
        thankYouTitle: '¡Gracias por tu mensaje!',
        thankYou: 'Recibimos tu solicitud y te contactaremos pronto.',
        errorSending: 'Hubo un error enviando el formulario. Intenta nuevamente.',
        required: 'Este campo es obligatorio.',
        positiveNumber: 'Ingresa un número mayor a 0.',
        emailInvalid: 'Ingresa un correo válido.',
        banderaType: 'Tipo de Bandera',
        banderaTypes: [
          'Colombia',
          'De un país',
          'empresarial',
          'institucional',
          'escritorio',
          'exterior',
          'nacional',
        ],
        country: 'País',
        countryPlaceholder: 'Escribe o selecciona un país',
        quantity: 'Cantidad',
        dimensionsTitle: 'Dimensiones (cm)',
        width: 'Ancho (cm)',
        height: 'Alto (cm)',
        material: 'Material',
        materialOptions: ['Vendaval impermeable', 'seda poliester', 'briggite o satin'],
        needsPoleBase: '¿Requiere asta y base?',
        yes: 'Sí',
        no: 'No',
        city: 'Ciudad para entregar',
        name: 'Nombre',
        email: 'Correo electrónico',
        customLogo: '¿Bandera personalizada con logo?',
        uploadLogo: 'Subir logo (PNG/JPG/SVG)',
        summary: 'Resumen',
        preview: 'Vista proporcional aproximada',
      },
    };

    const t = computed(() => translations[props.language] || translations.es);

    const totalSteps = 4;
    const step = ref(1);
    const formRef = ref(null);
    const successCanvasRef = ref(null);
    const countryDropdownRef = ref(null);
    const submitStatus = ref('idle');
    const showCountryOptions = ref(false);
    let confettiSketch = null;

    const form = reactive({
      banderaType: '',
      country: '',
      quantity: '',
      widthCm: '',
      heightCm: '',
      material: '',
      needsPoleBase: '',
      city: '',
      name: '',
      email: '',
      customLogo: 'no',
      logoFile: null,
    });

    const errors = reactive({});

    const progressPct = computed(() => Math.round((step.value / totalSteps) * 100));
    const isSubmitting = computed(() => submitStatus.value === 'submitting');
    const showCountryField = computed(() => form.banderaType === 'De un país');
    const aspectRatio = computed(() => {
      const width = Number(form.widthCm);
      const height = Number(form.heightCm);
      if (!width || !height || width <= 0 || height <= 0) {
        return '3 / 2';
      }
      return `${width} / ${height}`;
    });

    const saveDraft = () => {
      const serializable = {
        ...form,
        logoFile: null,
      };
      localStorage.setItem('quoteFormDraft', JSON.stringify(serializable));
      localStorage.setItem('quoteFormStep', String(step.value));
    };

    onMounted(() => {
      const storedDraft = localStorage.getItem('quoteFormDraft');
      const storedStep = Number(localStorage.getItem('quoteFormStep'));

      if (storedDraft) {
        const parsed = JSON.parse(storedDraft);
        Object.assign(form, parsed);
      }

      if (storedStep >= 1 && storedStep <= totalSteps) {
        step.value = storedStep;
      }

      document.addEventListener('click', onDocumentClick);
    });

    watch(
      () => ({ ...form }),
      () => saveDraft(),
      { deep: true }
    );

    watch(step, () => saveDraft());

    const validateField = (field) => {
      errors[field] = '';

      if (['banderaType', 'material', 'needsPoleBase', 'city', 'name'].includes(field) && !form[field]) {
        errors[field] = t.value.required;
      }

      if (field === 'country' && showCountryField.value && !form.country) {
        errors[field] = t.value.required;
      }

      if (field === 'quantity') {
        const value = Number(form.quantity);
        if (!form.quantity) {
          errors[field] = t.value.required;
        } else if (!value || value <= 0) {
          errors[field] = t.value.positiveNumber;
        }
      }

      if (field === 'widthCm' || field === 'heightCm') {
        const value = Number(form[field]);
        if (!form[field]) {
          errors[field] = t.value.required;
        } else if (!value || value <= 0) {
          errors[field] = t.value.positiveNumber;
        }
      }

      if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email) {
          errors[field] = t.value.required;
        } else if (!emailRegex.test(form.email)) {
          errors[field] = t.value.emailInvalid;
        }
      }

      if (field === 'logoFile' && form.customLogo === 'si' && !form.logoFile) {
        errors[field] = t.value.required;
      }

      return !errors[field];
    };

    const fieldsByStep = {
      1: ['banderaType', 'country', 'quantity', 'widthCm', 'heightCm'],
      2: ['material', 'needsPoleBase', 'city', 'customLogo', 'logoFile'],
      3: ['name', 'email'],
      4: [],
    };

    const validateStep = () => {
      const fields = fieldsByStep[step.value] || [];
      return fields.every((field) => {
        if (field === 'logoFile' && form.customLogo !== 'si') {
          errors.logoFile = '';
          return true;
        }
        if (field === 'country' && !showCountryField.value) {
          errors.country = '';
          return true;
        }
        return validateField(field);
      });
    };

    const countries = [
      'Afganistán', 'Albania', 'Alemania', 'Andorra', 'Angola', 'Antigua y Barbuda', 'Arabia Saudita', 'Argelia',
      'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaiyán', 'Bahamas', 'Bangladés', 'Barbados', 'Baréin',
      'Bélgica', 'Belice', 'Benín', 'Bielorrusia', 'Birmania', 'Bolivia', 'Bosnia y Herzegovina', 'Botsuana',
      'Brasil', 'Brunéi', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Bután', 'Cabo Verde', 'Camboya', 'Camerún',
      'Canadá', 'Catar', 'Chad', 'Chile', 'China', 'Chipre', 'Colombia', 'Comoras', 'Corea del Norte',
      'Corea del Sur', 'Costa de Marfil', 'Costa Rica', 'Croacia', 'Cuba', 'Dinamarca', 'Dominica', 'Ecuador',
      'Egipto', 'El Salvador', 'Emiratos Árabes Unidos', 'Eritrea', 'Eslovaquia', 'Eslovenia', 'España',
      'Estados Unidos', 'Estonia', 'Esuatini', 'Etiopía', 'Filipinas', 'Finlandia', 'Fiyi', 'Francia', 'Gabón',
      'Gambia', 'Georgia', 'Ghana', 'Granada', 'Grecia', 'Guatemala', 'Guyana', 'Guinea', 'Guinea-Bisáu',
      'Guinea Ecuatorial', 'Haití', 'Honduras', 'Hungría', 'India', 'Indonesia', 'Irak', 'Irán', 'Irlanda',
      'Islandia', 'Islas Marshall', 'Islas Salomón', 'Israel', 'Italia', 'Jamaica', 'Japón', 'Jordania',
      'Kazajistán', 'Kenia', 'Kirguistán', 'Kiribati', 'Kuwait', 'Laos', 'Lesoto', 'Letonia', 'Líbano', 'Liberia',
      'Libia', 'Liechtenstein', 'Lituania', 'Luxemburgo', 'Macedonia del Norte', 'Madagascar', 'Malasia', 'Malaui',
      'Maldivas', 'Malí', 'Malta', 'Marruecos', 'Mauricio', 'Mauritania', 'México', 'Micronesia', 'Moldavia',
      'Mónaco', 'Mongolia', 'Montenegro', 'Mozambique', 'Namibia', 'Nauru', 'Nepal', 'Nicaragua', 'Níger',
      'Nigeria', 'Noruega', 'Nueva Zelanda', 'Omán', 'Países Bajos', 'Pakistán', 'Palaos', 'Panamá',
      'Papúa Nueva Guinea', 'Paraguay', 'Perú', 'Polonia', 'Portugal', 'Reino Unido',
      'República Centroafricana', 'República Checa', 'República del Congo', 'República Democrática del Congo',
      'República Dominicana', 'Ruanda', 'Rumanía', 'Rusia', 'Samoa', 'San Cristóbal y Nieves', 'San Marino',
      'San Vicente y las Granadinas', 'Santa Lucía', 'Santo Tomé y Príncipe', 'Senegal', 'Serbia', 'Seychelles',
      'Sierra Leona', 'Singapur', 'Siria', 'Somalia', 'Sri Lanka', 'Sudáfrica', 'Sudán', 'Sudán del Sur', 'Suecia',
      'Suiza', 'Surinam', 'Tailandia', 'Tanzania', 'Tayikistán', 'Timor Oriental', 'Togo', 'Tonga',
      'Trinidad y Tobago', 'Túnez', 'Turkmenistán', 'Turquía', 'Tuvalu', 'Ucrania', 'Uganda', 'Uruguay',
      'Uzbekistán', 'Vanuatu', 'Vaticano', 'Venezuela', 'Vietnam', 'Yemen', 'Yibuti', 'Zambia', 'Zimbabue',
    ];

    const normalizeText = (value) => value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const filteredCountries = computed(() => {
      const query = normalizeText(form.country || '').trim();
      if (!query) {
        return countries;
      }
      return countries.filter((country) => normalizeText(country).includes(query));
    });

    const openCountryOptions = () => {
      if (!showCountryField.value) {
        return;
      }
      showCountryOptions.value = true;
    };

    const closeCountryOptions = () => {
      showCountryOptions.value = false;
    };

    const onCountryInput = () => {
      validateField('country');
      openCountryOptions();
    };

    const selectCountry = (country) => {
      form.country = country;
      errors.country = '';
      closeCountryOptions();
    };

    const onDocumentClick = (event) => {
      if (!countryDropdownRef.value) {
        return;
      }
      if (!countryDropdownRef.value.contains(event.target)) {
        closeCountryOptions();
      }
    };

    watch(
      () => form.banderaType,
      (value) => {
        if (value !== 'De un país') {
          form.country = '';
          errors.country = '';
          closeCountryOptions();
        }
      }
    );

    const nextStep = () => {
      if (validateStep() && step.value < totalSteps) {
        step.value += 1;
      }
    };

    const prevStep = () => {
      if (step.value > 1) {
        step.value -= 1;
      }
    };

    const onFileChange = (event) => {
      form.logoFile = event.target.files?.[0] || null;
      validateField('logoFile');
    };

    const resetForm = () => {
      Object.assign(form, {
        banderaType: '',
        country: '',
        quantity: '',
        widthCm: '',
        heightCm: '',
        material: '',
        needsPoleBase: '',
        city: '',
        name: '',
        email: '',
        customLogo: 'no',
        logoFile: null,
      });

      Object.keys(errors).forEach((key) => {
        errors[key] = '';
      });

      step.value = 1;
      localStorage.removeItem('quoteFormDraft');
      localStorage.removeItem('quoteFormStep');
      if (formRef.value) {
        formRef.value.reset();
      }
    };

    const destroyConfetti = () => {
      if (confettiSketch) {
        confettiSketch.remove();
        confettiSketch = null;
      }
    };

    const startConfetti = () => {
      if (!successCanvasRef.value || typeof window.p5 === 'undefined') {
        return;
      }

      destroyConfetti();

      confettiSketch = new window.p5((p) => {
        const particles = [];
        const confettiColors = ['#FCD116', '#003893', '#CE1126'];

        const spawnParticle = (x = p.random(p.width), y = p.random(-80, -10)) => {
          particles.push({
            x,
            y,
            w: p.random(8, 16),
            h: p.random(14, 24),
            vx: p.random(-1, 1),
            vy: p.random(1.5, 4),
            angle: p.random(p.TWO_PI),
            spin: p.random(-0.1, 0.1),
            color: p.random(confettiColors),
          });
        };

        p.setup = () => {
          const { width } = successCanvasRef.value.getBoundingClientRect();
          p.createCanvas(Math.max(260, width), 220);
          p.clear();
          for (let i = 0; i < 90; i += 1) {
            spawnParticle();
          }
        };

        p.windowResized = () => {
          const { width } = successCanvasRef.value.getBoundingClientRect();
          p.resizeCanvas(Math.max(260, width), 220);
        };

        p.draw = () => {
          p.clear();
          if (particles.length < 110) {
            for (let i = 0; i < 3; i += 1) {
              spawnParticle(p.random(p.width), p.random(-30, 0));
            }
          }

          for (let i = particles.length - 1; i >= 0; i -= 1) {
            const item = particles[i];
            item.x += item.vx;
            item.y += item.vy;
            item.angle += item.spin;

            p.push();
            p.translate(item.x, item.y);
            p.rotate(item.angle);
            p.noStroke();
            p.fill(item.color);
            p.rectMode(p.CENTER);
            p.rect(0, 0, item.w, item.h, 2);
            p.pop();

            if (item.y > p.height + 30) {
              particles.splice(i, 1);
              spawnParticle();
            }
          }
        };
      }, successCanvasRef.value);
    };

    const wait = (ms) => new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

    const submitToNetlify = async () => {
      const payload = new FormData(formRef.value);
      payload.set('form-name', 'contacto-cotizacion');

      const response = await fetch('/', {
        method: 'POST',
        body: payload,
      });

      if (!response.ok) {
        throw new Error(`Netlify form submission failed with status ${response.status}`);
      }
    };

    const handleSubmit = async () => {
      if (isSubmitting.value) {
        return;
      }
      if (!validateStep()) {
        return;
      }

      try {
        submitStatus.value = 'submitting';


        const maxAttempts = 2;
        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
          try {
            await submitToNetlify();
            break;
          } catch (error) {
            console.error('Error enviando formulario de cotización:', error);
            if (attempt === maxAttempts) {
              throw error;
            }
            await wait(700);
          }
        }

        submitStatus.value = 'success';
        await nextTick();
        startConfetti();
        resetForm();
      } catch (error) {
        submitStatus.value = 'error';
      }
    };

    onUnmounted(() => {
      destroyConfetti();
      document.removeEventListener('click', onDocumentClick);
    });

    watch(submitStatus, async (status) => {
      if (status === 'success') {
        await nextTick();
        startConfetti();
      } else {
        destroyConfetti();
      }
    });

    return {
      t,
      form,
      errors,
      step,
      totalSteps,
      progressPct,
      aspectRatio,
      countries,
      filteredCountries,
      showCountryField,
      showCountryOptions,
      formRef,
      successCanvasRef,
      countryDropdownRef,
      submitStatus,
      isSubmitting,
      validateField,
      onCountryInput,
      openCountryOptions,
      closeCountryOptions,
      selectCountry,
      nextStep,
      prevStep,
      handleSubmit,
      onFileChange,
    };
  },
  template: `
    <section id="contact">
      <h2 class="section-title">{{ t.title }}</h2>
            <p class="section-subtitle">{{ t.subtitle }}</p>

      <div class="quote-progress" role="progressbar" :aria-valuenow="progressPct" aria-valuemin="0" aria-valuemax="100">
        <div class="quote-progress-bar" :style="{ width: progressPct + '%' }"></div>
      </div>
      <p class="quote-step-label">{{ t.stepLabel }} {{ step }} / {{ totalSteps }}</p>

      <form
        v-if="submitStatus !== 'success'"
        ref="formRef"
        class="quote-form"
        name="contacto-cotizacion"
        method="POST"
        enctype="multipart/form-data"
        data-netlify="true"
        netlify-honeypot="bot-field"
        @submit.prevent="handleSubmit"
      >
        <fieldset :disabled="isSubmitting" class="quote-form-fields">
        <input type="hidden" name="form-name" value="contacto-cotizacion" />
        <p style="display:none;">
        <label>No llenar si eres humano: <input name="bot-field" /></label>
        </p>

        <input type="hidden" name="tipo_bandera" :value="form.banderaType" />
        <input type="hidden" name="pais_bandera" :value="form.country" />
        <input type="hidden" name="cantidad" :value="form.quantity" />
        <input type="hidden" name="ancho_cm" :value="form.widthCm" />
        <input type="hidden" name="alto_cm" :value="form.heightCm" />
        <input type="hidden" name="material" :value="form.material" />
        <input type="hidden" name="asta_y_base" :value="form.needsPoleBase" />
        <input type="hidden" name="ciudad_entrega" :value="form.city" />
        <input type="hidden" name="bandera_personalizada" :value="form.customLogo" />
        <input type="hidden" name="nombre" :value="form.name" />
        <input type="hidden" name="email" :value="form.email" />
        <template v-if="step === 1">
          <label>
            {{ t.banderaType }}
            <select name="tipo_bandera" v-model="form.banderaType" @blur="validateField('banderaType')" required>
              <option disabled value="">Selecciona una opción</option>
              <option v-for="type in t.banderaTypes" :key="type" :value="type">{{ type }}</option>
            </select>
            <small v-if="errors.banderaType" class="field-error">{{ errors.banderaType }}</small>
          </label>

          <label v-if="showCountryField">
            {{ t.country }}
            <div ref="countryDropdownRef" class="country-autocomplete">
              <input
                type="text"
                name="pais_bandera"
                v-model="form.country"
                :placeholder="t.countryPlaceholder"
                autocomplete="off"
                @focus="openCountryOptions"
                @input="onCountryInput"
                @blur="validateField('country')"
                required
              />
              <ul v-if="showCountryOptions" class="country-options" role="listbox" aria-label="Lista de países">
                <li
                  v-for="country in filteredCountries"
                  :key="country"
                  class="country-option"
                  role="option"
                  @mousedown.prevent="selectCountry(country)"
                >
                  {{ country }}
                </li>
                <li v-if="!filteredCountries.length" class="country-option-empty">
                  No se encontraron países.
                </li>
              </ul>
            </div>
            <small v-if="errors.country" class="field-error">{{ errors.country }}</small>
          </label>

          <label>
            {{ t.quantity }}
            <input type="number" min="1" step="1" name="cantidad" v-model="form.quantity" @input="validateField('quantity')" required />
            <small v-if="errors.quantity" class="field-error">{{ errors.quantity }}</small>
          </label>

          <div class="dimensions-grid">
            <label>
              {{ t.width }}
              <input type="number" min="1" step="1" name="ancho_cm" v-model="form.widthCm" @input="validateField('widthCm')" required />
              <small v-if="errors.widthCm" class="field-error">{{ errors.widthCm }}</small>
            </label>
            <label>
              {{ t.height }}
              <input type="number" min="1" step="1" name="alto_cm" v-model="form.heightCm" @input="validateField('heightCm')" required />
              <small v-if="errors.heightCm" class="field-error">{{ errors.heightCm }}</small>
            </label>
          </div>

          <div class="flag-preview-wrap">
            <p>{{ t.preview }}</p>
            <div class="flag-preview" :style="{ aspectRatio: aspectRatio }"></div>
          </div>
        </template>

        <template v-else-if="step === 2">
          <label>
            {{ t.material }}
            <select name="material" v-model="form.material" @blur="validateField('material')" required>
              <option disabled value="">Selecciona una opción</option>
              <option v-for="option in t.materialOptions" :key="option" :value="option">{{ option }}</option>
            </select>
            <small v-if="errors.material" class="field-error">{{ errors.material }}</small>
          </label>

          <label>
            {{ t.needsPoleBase }}
            <select name="asta_y_base" v-model="form.needsPoleBase" @blur="validateField('needsPoleBase')" required>
              <option disabled value="">Selecciona una opción</option>
              <option value="si">{{ t.yes }}</option>
              <option value="no">{{ t.no }}</option>
            </select>
            <small v-if="errors.needsPoleBase" class="field-error">{{ errors.needsPoleBase }}</small>
          </label>

          <label>
            {{ t.city }}
            <input type="text" name="ciudad_entrega" v-model="form.city" @input="validateField('city')" required />
            <small v-if="errors.city" class="field-error">{{ errors.city }}</small>
          </label>

          <label>
            {{ t.customLogo }}
            <select name="bandera_personalizada" v-model="form.customLogo">
              <option value="no">{{ t.no }}</option>
              <option value="si">{{ t.yes }}</option>
            </select>
          </label>

          <label v-if="form.customLogo === 'si'">
            {{ t.uploadLogo }}
            <input type="file" name="logo" accept=".png,.jpg,.jpeg,.svg" @change="onFileChange" />
            <small v-if="errors.logoFile" class="field-error">{{ errors.logoFile }}</small>
          </label>
        </template>

        <template v-else-if="step === 3">
          <label>
            {{ t.name }}
            <input type="text" name="nombre" v-model="form.name" @input="validateField('name')" required />
            <small v-if="errors.name" class="field-error">{{ errors.name }}</small>
          </label>

          <label>
            {{ t.email }}
            <input type="email" name="email" v-model="form.email" @input="validateField('email')" required />
            <small v-if="errors.email" class="field-error">{{ errors.email }}</small>
          </label>
        </template>

        <template v-else>
          <div class="quote-summary">
            <h3>{{ t.summary }}</h3>
            <ul>
              <li><strong>{{ t.banderaType }}:</strong> {{ form.banderaType }}</li>
              <li v-if="showCountryField"><strong>{{ t.country }}:</strong> {{ form.country }}</li>
              <li><strong>{{ t.quantity }}:</strong> {{ form.quantity }}</li>
              <li><strong>{{ t.dimensionsTitle }}:</strong> {{ form.widthCm }} x {{ form.heightCm }} cm</li>
              <li><strong>{{ t.material }}:</strong> {{ form.material }}</li>
              <li><strong>{{ t.needsPoleBase }}:</strong> {{ form.needsPoleBase }}</li>
              <li><strong>{{ t.city }}:</strong> {{ form.city }}</li>
              <li><strong>{{ t.customLogo }}:</strong> {{ form.customLogo }}</li>
            </ul>
          </div>
        </template>

        <div class="step-actions">
           <button v-if="step > 1" type="button" class="btn-secondary" @click="prevStep" :disabled="isSubmitting">{{ t.back }}</button>
          <button v-if="step < totalSteps" type="button" class="btn-primary" @click="nextStep" :disabled="isSubmitting">{{ t.next }}</button>
          <button v-else type="submit" class="btn-primary" :disabled="isSubmitting">{{ isSubmitting ? t.processing : t.submit }}</button>
        </div>
        </fieldset>

        <div v-if="isSubmitting" class="quote-processing" role="status" aria-live="polite">
          <span class="quote-processing-spinner" aria-hidden="true"></span>
          <p>{{ t.processing }}</p>
        </div>
      </form>

        <div v-else class="quote-success" role="status" aria-live="polite">
        <img src="/assets/logo.svg" alt="Logo Banderas Nila López" class="quote-success-logo" />
        <h3>{{ t.thankYouTitle }}</h3>
        <p>{{ t.thankYou }}</p>
        <div ref="successCanvasRef" class="quote-confetti-canvas" aria-hidden="true"></div>
      </div>

      <p v-if="submitStatus === 'error'" class="submit-error">{{ t.errorSending }}</p>
    </section>
  `,
};