// components/cotizacionComponent.js
const CotizacionComponent = {
  components: {
    QuoteStepFlagType: QuoteStepFlagTypeComponent,
    QuoteStepDetails: QuoteStepDetailsComponent,
  },
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
        itemLabel: 'Bandera',
        addFlag: 'Agregar otra bandera',
        removeFlag: 'Eliminar bandera',
        banderaTypes: [
          'De Colombia',
          'De un departamento de Colombia',
          'De una ciudad o Municipio de Colombia',
          'De un país',
          'Empresarial o institucional',
          'Otra',
        ],
        otherFlagType: '¿Qué tipo de bandera necesitas?',
        otherFlagTypePlaceholder: 'Escribe el tipo de bandera que necesitas',
        country: 'País',
        countryPlaceholder: 'Escribe o selecciona un país',
        department: 'Departamento',
        departmentPlaceholder: 'Escribe o selecciona un departamento',
        municipality: 'Ciudad o Municipio',
        municipalityPlaceholder: 'Escribe o selecciona una ciudad o municipio',
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
        flagRatioLabel: 'Proporción de la bandera',
        flagRatioOficial: 'Proporción oficial',
        flagRatioPersonalizada: 'Proporción personalizada',
      },
    };

    const t = computed(() => translations[props.language] || translations.es);

    const totalSteps = 4;
    const step = ref(1);
    const formRef = ref(null);
    const successCanvasRef = ref(null);
    const submitStatus = ref('idle');
    let confettiSketch = null;

    let _itemIdCounter = 0;
    const createEmptyItem = () => ({
      id: ++_itemIdCounter,
      banderaType: '',
      country: '',
      department: '',
      municipality: '',
      quantity: '',
      widthCm: '',
      heightCm: '',
      otherFlagType: '',
      flagRatio: 'oficial',
      flagNaturalRatio: null,
    });

    const form = reactive({
      items: [createEmptyItem()],
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
    const getItemErrorKey = (index, field) => `item_${index}_${field}`;
    const isCountryType = (item) => item.banderaType === 'De un país';
    const isDepartmentType = (item) => item.banderaType === 'De un departamento de Colombia';
    const isMunicipalityType = (item) => item.banderaType === 'De una ciudad o Municipio de Colombia';
    const isOtherType = (item) => item.banderaType === 'Otra';
    const isColombiaType = (item) => item.banderaType === 'De Colombia';
    const orderSummaryText = computed(() => form.items.map((item, index) => {
      const details = [`${index + 1}. ${item.banderaType || 'Sin tipo'}`];
      if (isCountryType(item) && item.country) details.push(`País: ${item.country}`);
      if (isDepartmentType(item) && item.department) details.push(`Departamento: ${item.department}`);
      if (isMunicipalityType(item) && item.municipality) details.push(`Municipio: ${item.municipality}`);
      if (isOtherType(item) && item.otherFlagType) details.push(`Otra: ${item.otherFlagType}`);
      details.push(`Cantidad: ${item.quantity || 0}`);
      details.push(`Tamaño: ${item.widthCm || 0}x${item.heightCm || 0} cm`);
      return details.join(' | ');
    }).join('\n'));

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
    });

    watch(
      () => ({ ...form }),
      () => saveDraft(),
      { deep: true }
    );

    watch(step, () => saveDraft());

    const validateField = (field) => {
      errors[field] = '';

      if (['material', 'needsPoleBase', 'city', 'name'].includes(field) && !form[field]) {
        errors[field] = t.value.required;
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

      const clearItemError = (index, field) => {
      errors[getItemErrorKey(index, field)] = '';
    };

    const validateItemField = (item, index, field) => {
      const errorKey = getItemErrorKey(index, field);
      errors[errorKey] = '';

      if (field === 'banderaType' && !item.banderaType) {
        errors[errorKey] = t.value.required;
      }
      if (field === 'country' && isCountryType(item) && !item.country) {
        errors[errorKey] = t.value.required;
      }
      if (field === 'department' && isDepartmentType(item) && !item.department) {
        errors[errorKey] = t.value.required;
      }
      if (field === 'municipality' && isMunicipalityType(item) && !item.municipality) {
        errors[errorKey] = t.value.required;
      }
      if (field === 'otherFlagType' && isOtherType(item) && !item.otherFlagType) {
        errors[errorKey] = t.value.required;
      }
      if (field === 'quantity') {
        const value = Number(item.quantity);
        if (!item.quantity) {
          errors[errorKey] = t.value.required;
        } else if (!value || value <= 0) {
          errors[errorKey] = t.value.positiveNumber;
        }
      }
      if (field === 'widthCm' || field === 'heightCm') {
        const value = Number(item[field]);
        if (!item[field]) {
          errors[errorKey] = t.value.required;
        } else if (!value || value <= 0) {
         errors[errorKey] = t.value.positiveNumber;
        }
      }

      return !errors[errorKey];
    };

    const fieldsByStep = {
      1: [],
      2: ['material', 'needsPoleBase', 'city', 'customLogo', 'logoFile'],
      3: ['name', 'email'],
      4: [],
    };

    const validateStep = () => {
      if (step.value === 1) {
        return form.items.every((item, index) => {
          const baseValid = validateItemField(item, index, 'banderaType')
            && validateItemField(item, index, 'quantity')
            && validateItemField(item, index, 'widthCm')
            && validateItemField(item, index, 'heightCm');

          let conditionalValid = true;
          if (isCountryType(item)) conditionalValid = validateItemField(item, index, 'country') && conditionalValid;
          if (isDepartmentType(item)) conditionalValid = validateItemField(item, index, 'department') && conditionalValid;
          if (isMunicipalityType(item)) conditionalValid = validateItemField(item, index, 'municipality') && conditionalValid;
          if (isOtherType(item)) conditionalValid = validateItemField(item, index, 'otherFlagType') && conditionalValid;
          return baseValid && conditionalValid;
        });
      }

      const fields = fieldsByStep[step.value] || [];
      return fields.every((field) => {
        if (field === 'logoFile' && form.customLogo !== 'si') {
          errors.logoFile = '';
          return true;
        }
        return validateField(field);
      });
    };

    const addItem = () => {
      form.items.push(createEmptyItem());
    };

    const removeItem = (index) => {
      if (form.items.length <= 1) {
        return;
      }
      form.items.splice(index, 1);
      Object.keys(errors)
        .filter((key) => key.startsWith('item_'))
        .forEach((key) => { errors[key] = ''; });
    };

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
        items: [createEmptyItem()],
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
      const payload = new FormData();
      payload.append('form-name', 'contacto-cotizacion');
      payload.append('pedido_detalle', orderSummaryText.value);
      payload.append('material', form.material);
      payload.append('asta_y_base', form.needsPoleBase);
      payload.append('ciudad_entrega', form.city);
      payload.append('bandera_personalizada', form.customLogo);
      payload.append('nombre', form.name);
      payload.append('email', form.email);

      // Agregar todos los ítems de banderas
      form.items.forEach((item, index) => {
        payload.append(`tipo_bandera_${index}`, item.banderaType);
        payload.append(`cantidad_${index}`, item.quantity);
        payload.append(`ancho_cm_${index}`, item.widthCm);
        payload.append(`alto_cm_${index}`, item.heightCm);
        
        if (isCountryType(item)) {
          payload.append(`pais_${index}`, item.country);
        }
        if (isDepartmentType(item)) {
          payload.append(`departamento_${index}`, item.department);
        }
        if (isMunicipalityType(item)) {
          payload.append(`municipio_${index}`, item.municipality);
        }
        if (isOtherType(item)) {
          payload.append(`otro_tipo_${index}`, item.otherFlagType);
        }
      });

      // Agregar el archivo de logo si existe
      if (form.logoFile) {
        payload.append('logo', form.logoFile);
      }

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
      formRef,
      successCanvasRef,
      submitStatus,
      isSubmitting,
      isCountryType,
      isDepartmentType,
      isMunicipalityType,
      isOtherType,
      validateField,
      validateItemField,
      clearItemError,
      nextStep,
      prevStep,
      handleSubmit,
      onFileChange,
      addItem,
      removeItem,
      orderSummaryText,
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

        <input type="hidden" name="pedido_detalle" :value="orderSummaryText" />
        <input type="hidden" name="material" :value="form.material" />
        <input type="hidden" name="asta_y_base" :value="form.needsPoleBase" />
        <input type="hidden" name="ciudad_entrega" :value="form.city" />
        <input type="hidden" name="bandera_personalizada" :value="form.customLogo" />
        <input type="hidden" name="nombre" :value="form.name" />
        <input type="hidden" name="email" :value="form.email" />
        <template v-if="step === 1">
          <quote-step-flag-type
            :items="form.items"
            :errors="errors"
            :t="t"
            :validate-item-field="validateItemField"
            :clear-item-error="clearItemError"
            :add-item="addItem"
            :remove-item="removeItem"
          ></quote-step-flag-type>
        </template>

        <template v-else-if="step === 2">
          <quote-step-details
            :form="form"
            :errors="errors"
            :t="t"
            :validate-field="validateField"
            :on-file-change="onFileChange"
          ></quote-step-details>
        </template>

        <template v-else-if="step === 3">
          <div class="quote-item-card">
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
          </div>
        </template>

        <template v-else>
          <div class="quote-item-card quote-summary">
            <h3>{{ t.summary }}</h3>
            <ul>
              <li v-for="(item, index) in form.items" :key="'summary-' + index">
                <strong>{{ t.itemLabel }} #{{ index + 1 }}:</strong>
                {{ item.banderaType }} |
                <span v-if="isCountryType(item)">{{ t.country }}: {{ item.country }} | </span>
                <span v-if="isDepartmentType(item)">{{ t.department }}: {{ item.department }} | </span>
                <span v-if="isMunicipalityType(item)">{{ t.municipality }}: {{ item.municipality }} | </span>
                <span v-if="isOtherType(item)">{{ t.otherFlagType }}: {{ item.otherFlagType }} | </span>
                {{ t.quantity }}: {{ item.quantity }} |
                {{ t.dimensionsTitle }}: {{ item.widthCm }} x {{ item.heightCm }} cm
              </li>
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
