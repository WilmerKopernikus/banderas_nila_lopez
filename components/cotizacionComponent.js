// components/cotizacionComponent.js
const CotizacionComponent = {
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
    const countryDropdownRef = ref(null);
    const departmentDropdownRef = ref(null);
    const municipalityDropdownRef = ref(null);
    const submitStatus = ref('idle');
    const showCountryOptions = ref(false);
    const showDepartmentOptions = ref(false);
    const showMunicipalityOptions = ref(false);
    const departmentSearch = ref('');
    const countrySearch = ref('');
    const municipalitySearch = ref('');
    let confettiSketch = null;

    const createEmptyItem = () => ({
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
    const hasOfficialRatio = (item) => item.flagRatio === 'oficial' && (isColombiaType(item) || isCountryType(item) || isDepartmentType(item) || isMunicipalityType(item));

    const itemNaturalRatio = (item) => {
      if (isColombiaType(item)) return 3 / 2;
      return item.flagNaturalRatio || null;
    };

    const departmentFlagSrc = (item) => {
      if (!item.department) return '';
      return `images/banderas/departamentos_colombia/${item.department}.svg`;
    };

    const municipalityFlagSrc = (item) => {
      if (!item.municipality) return '';
      return `images/banderas/municipios_colombia/${item.municipality}.svg`;
    };

    const countryFlagSrc = (item) => {
      if (!item.country) return '';
      return `images/banderas/banderas_del_mundo/${item.country}.svg`;
    };

    const itemAspectRatio = (item) => {
      if (hasOfficialRatio(item)) {
        const r = itemNaturalRatio(item);
        if (r) return `${r} / 1`;
      }
      const width = Number(item.widthCm);
      const height = Number(item.heightCm);
      if (!width || !height || width <= 0 || height <= 0) {
        return '3 / 2';
      }
      return `${width} / ${height}`;
    };

    const onWidthInput = (item, index) => {
      if (hasOfficialRatio(item) && item.widthCm) {
        const w = Number(item.widthCm);
        const r = itemNaturalRatio(item);
        if (w > 0 && r) item.heightCm = String(Math.round(w / r));
      }
      validateItemField(item, index, 'widthCm');
      validateItemField(item, index, 'heightCm');
    };

    const onHeightInput = (item, index) => {
      if (hasOfficialRatio(item) && item.heightCm) {
        const h = Number(item.heightCm);
        const r = itemNaturalRatio(item);
        if (h > 0 && r) item.widthCm = String(Math.round(h * r));
      }
      validateItemField(item, index, 'heightCm');
      validateItemField(item, index, 'widthCm');
    };

    const onFlagRatioChange = (item, index) => {
      if (hasOfficialRatio(item) && item.widthCm) {
        const w = Number(item.widthCm);
        const r = itemNaturalRatio(item);
        if (w > 0 && r) item.heightCm = String(Math.round(w / r));
      }
    };

    const onFlagImageLoad = (event, item) => {
      const img = event.target;
      const { naturalWidth, naturalHeight } = img;
      if (!naturalWidth || !naturalHeight) return;
      img.style.display = 'block';
      item.flagNaturalRatio = naturalWidth / naturalHeight;
      if (item.flagRatio === 'oficial') {
        item.heightCm = '100';
        item.widthCm = String(Math.round(100 * naturalWidth / naturalHeight));
      }
    };

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

    const filterCountries = (queryValue = '') => {
      const query = normalizeText(queryValue).trim();
      if (!query) {
        return countries;
      }
      return countries.filter((country) => normalizeText(country).includes(query));
    };

    const departments = [
      'Amazonas', 'Antioquia', 'Arauca', 'Atlántico','Bogotá Distrito Capital', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá', 'Casanare',
      'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira',
      'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda',
      'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada',
    ];

    const filterDepartments = (queryValue = '') => {
      const query = normalizeText(queryValue).trim();
      if (!query) {
        return departments;
      }
      return departments.filter((department) => normalizeText(department).includes(query));
    };

    const municipalities = [
  'Abejorral, Antioquia',
  'Ábrego, Norte de Santander',
  'Abriaquí, Antioquia',
  'Acacías, Meta',
  'Acandí, Chocó',
  'Acevedo, Huila',
  'Achí, Bolívar',
  'Agrado, Huila',
  'Agua de Dios, Cundinamarca',
  'Aguachica, Cesar',
  'Aguada, Santander',
  'Aguadas, Caldas',
  'Aguazul, Casanare',
  'Agustín Codazzi, Cesar',
  'Aipe, Huila',
  'Albán, Cundinamarca',
  'Albania, Caquetá',
  'Albania, La Guajira',
  'Albania, Santander',
  'Alcalá, Valle del Cauca',
  'Aldana, Nariño',
  'Alejandría, Antioquia',
  'Algarrobo, Magdalena',
  'Algeciras, Huila',
  'Almaguer, Cauca',
  'Almeida, Boyacá',
  'Alpujarra, Tolima',
  'Altamira, Huila',
  'Alto Baudó, Chocó',
  'Altos del Rosario, Bolívar',
  'Alvarado, Tolima',
  'Amagá, Antioquia',
  'Amalfi, Antioquia',
  'Ambalema, Tolima',
  'Anapoima, Cundinamarca',
  'Ancuya, Nariño',
  'Andalucía, Valle del Cauca',
  'Andes, Antioquia',
  'Angelópolis, Antioquia',
  'Angostura, Antioquia',
  'Anolaima, Cundinamarca',
  'Anorí, Antioquia',
  'Anserma, Caldas',
  'Ansermanuevo, Valle del Cauca',
  'Anzá, Antioquia',
  'Anzoátegui, Tolima',
  'Apartadó, Antioquia',
  'Apía, Risaralda',
  'Apulo, Cundinamarca',
  'Aquitania, Boyacá',
  'Aracataca, Magdalena',
  'Aranzazu, Caldas',
  'Aratoca, Santander',
  'Arauca, Arauca',
  'Arauquita, Arauca',
  'Arbeláez, Cundinamarca',
  'Arboleda, Nariño',
  'Arboledas, Norte de Santander',
  'Arboletes, Antioquia',
  'Arcabuco, Boyacá',
  'Arenal, Bolívar',
  'Argelia, Antioquia',
  'Argelia, Cauca',
  'Argelia, Valle del Cauca',
  'Ariguaní, Magdalena',
  'Arjona, Bolívar',
  'Armenia, Antioquia',
  'Armenia, Quindío',
  'Armero, Tolima',
  'Arroyohondo, Bolívar',
  'Astrea, Cesar',
  'Ataco, Tolima',
  'Ayapel, Córdoba',
  'Bagadó, Chocó',
  'Bahía Solano, Chocó',
  'Bajo Baudó, Chocó',
  'Balboa, Cauca',
  'Balboa, Risaralda',
  'Baranoa, Atlántico',
  'Baraya, Huila',
  'Barbacoas, Nariño',
  'Barbosa, Antioquia',
  'Barbosa, Santander',
  'Barichara, Santander',
  'Barranca de Upía, Meta',
  'Barrancabermeja, Santander',
  'Barrancas, La Guajira',
  'Barranco de Loba, Bolívar',
  'Barrancominas, Guainía',
  'Barranquilla, Atlántico',
  'Becerril, Cesar',
  'Belalcázar, Caldas',
  'Belén, Boyacá',
  'Belén, Nariño',
  'Belén de Bajirá, Chocó',
  'Belén de los Andaquíes, Caquetá',
  'Belén de Umbría, Risaralda',
  'Bello, Antioquia',
  'Belmira, Antioquia',
  'Beltrán, Cundinamarca',
  'Berbeo, Boyacá',
  'Betania, Antioquia',
  'Betéitiva, Boyacá',
  'Betulia, Antioquia',
  'Betulia, Santander',
  'Bituima, Cundinamarca',
  'Boavita, Boyacá',
  'Bochalema, Norte de Santander',
  'Bogotá, Cundinamarca',
  'Bojacá, Cundinamarca',
  'Bojayá, Chocó',
  'Bolívar, Antioquia',
  'Bolívar, Cauca',
  'Bolívar, Santander',
  'Bolívar, Valle del Cauca',
  'Bosconia, Cesar',
  'Boyacá, Boyacá',
  'Briceño, Antioquia',
  'Briceño, Boyacá',
  'Bucaramanga, Santander',
  'Bucarasica, Norte de Santander',
  'Buenaventura, Valle del Cauca',
  'Buenavista, Boyacá',
  'Buenavista, Córdoba',
  'Buenavista, Quindío',
  'Buenavista, Sucre',
  'Buenos Aires, Cauca',
  'Buesaco, Nariño',
  'Buga, Valle del Cauca',
  'Bugalagrande, Valle del Cauca',
  'Buriticá, Antioquia',
  'Busbanzá, Boyacá',
  'Cabrera, Cundinamarca',
  'Cabrera, Santander',
  'Cabuyaro, Meta',
  'Cáceres, Antioquia',
  'Cachipay, Cundinamarca',
  'Cáchira, Norte de Santander',
  'Cácota, Norte de Santander',
  'Caicedo, Antioquia',
  'Caicedonia, Valle del Cauca',
  'Caimito, Sucre',
  'Cajamarca, Tolima',
  'Cajibío, Cauca',
  'Cajicá, Cundinamarca',
  'Calamar, Bolívar',
  'Calamar, Guaviare',
  'Calarcá, Quindío',
  'Caldas, Antioquia',
  'Caldas, Boyacá',
  'Caldono, Cauca',
  'Cali, Valle del Cauca',
  'California, Santander',
  'Calima, Valle del Cauca',
  'Caloto, Cauca',
  'Campamento, Antioquia',
  'Campo de la Cruz, Atlántico',
  'Campoalegre, Huila',
  'Campohermoso, Boyacá',
  'Canalete, Córdoba',
  'Candelaria, Atlántico',
  'Candelaria, Valle del Cauca',
  'Cantagallo, Bolívar',
  'Cantón de San Pablo, Chocó',
  'Cañasgordas, Antioquia',
  'Caparrapí, Cundinamarca',
  'Capitanejo, Santander',
  'Cáqueza, Cundinamarca',
  'Caracolí, Antioquia',
  'Caramanta, Antioquia',
  'Carcasí, Santander',
  'Carepa, Antioquia',
  'Carmen de Apicalá, Tolima',
  'Carmen de Carupa, Cundinamarca',
  'Carolina del Príncipe, Antioquia',
  'Cartagena de Indias, Bolívar',
  'Cartagena del Chairá, Caquetá',
  'Cartago, Valle del Cauca',
  'Carurú, Vaupés',
  'Casabianca, Tolima',
  'Castilla la Nueva, Meta',
  'Caucasia, Antioquia',
  'Cepitá, Santander',
  'Cereté, Córdoba',
  'Cerinza, Boyacá',
  'Cerrito, Santander',
  'Cerro de San Antonio, Magdalena',
  'Cértegui, Chocó',
  'Chachagüí, Nariño',
  'Chaguaní, Cundinamarca',
  'Chalán, Sucre',
  'Chámeza, Casanare',
  'Chaparral, Tolima',
  'Charalá, Santander',
  'Charta, Santander',
  'Chía, Cundinamarca',
  'Chibolo, Magdalena',
  'Chigorodó, Antioquia',
  'Chima, Santander',
  'Chimá, Córdoba',
  'Chimichagua, Cesar',
  'Chinácota, Norte de Santander',
  'Chinavita, Boyacá',
  'Chinchiná, Caldas',
  'Chinú, Córdoba',
  'Chipaque, Cundinamarca',
  'Chipatá, Santander',
  'Chiquinquirá, Boyacá',
  'Chíquiza, Boyacá',
  'Chiriguaná, Cesar',
  'Chiscas, Boyacá',
  'Chita, Boyacá',
  'Chitagá, Norte de Santander',
  'Chitaraque, Boyacá',
  'Chivatá, Boyacá',
  'Chivor, Boyacá',
  'Choachí, Cundinamarca',
  'Chocontá, Cundinamarca',
  'Cicuco, Bolívar',
  'Ciénaga, Magdalena',
  'Ciénaga de Oro, Córdoba',
  'Ciénega, Boyacá',
  'Cimitarra, Santander',
  'Circasia, Quindío',
  'Cisneros, Antioquia',
  'Clemencia, Bolívar',
  'Cocorná, Antioquia',
  'Coello, Tolima',
  'Cogua, Cundinamarca',
  'Colombia, Huila',
  'Colón, Nariño',
  'Colón, Putumayo',
  'Colosó, Sucre',
  'Cómbita, Boyacá',
  'Concepción, Antioquia',
  'Concepción, Santander',
  'Concordia, Antioquia',
  'Concordia, Magdalena',
  'Condoto, Chocó',
  'Confines, Santander',
  'Consacá, Nariño',
  'Contadero, Nariño',
  'Contratación, Santander',
  'Convención, Norte de Santander',
  'Copacabana, Antioquia',
  'Coper, Boyacá',
  'Córdoba, Bolívar',
  'Córdoba, Nariño',
  'Córdoba, Quindío',
  'Corinto, Cauca',
  'Coromoro, Santander',
  'Corozal, Sucre',
  'Corrales, Boyacá',
  'Cota, Cundinamarca',
  'Cotorra, Córdoba',
  'Covarachía, Boyacá',
  'Coveñas, Sucre',
  'Coyaima, Tolima',
  'Cravo Norte, Arauca',
  'Cuaspud, Nariño',
  'Cubará, Boyacá',
  'Cubarral, Meta',
  'Cucaita, Boyacá',
  'Cucunubá, Cundinamarca',
  'Cúcuta, Norte de Santander',
  'Cucutilla, Norte de Santander',
  'Cuítiva, Boyacá',
  'Cumaral, Meta',
  'Cumaribo, Vichada',
  'Cumbal, Nariño',
  'Cumbitara, Nariño',
  'Cunday, Tolima',
  'Curillo, Caquetá',
  'Curití, Santander',
  'Curumaní, Cesar',
  'Dabeiba, Antioquia',
  'Dagua, Valle del Cauca',
  'Dibulla, La Guajira',
  'Distracción, La Guajira',
  'Dolores, Tolima',
  'Donmatías, Antioquia',
  'Dosquebradas, Risaralda',
  'Duitama, Boyacá',
  'Duranía, Norte de Santander',
  'Ebéjico, Antioquia',
  'El Águila, Valle del Cauca',
  'El Atrato, Chocó',
  'El Bagre, Antioquia',
  'El Banco, Magdalena',
  'El Cairo, Valle del Cauca',
  'El Calvario, Meta',
  'El Carmen, Norte de Santander',
  'El Carmen de Atrato, Chocó',
  'El Carmen de Bolívar, Bolívar',
  'El Carmen de Chucurí, Santander',
  'El Carmen de Viboral, Antioquia',
  'El Carmen del Darién, Chocó',
  'El Castillo, Meta',
  'El Cerrito, Valle del Cauca',
  'El Charco, Nariño',
  'El Cocuy, Boyacá',
  'El Colegio, Cundinamarca',
  'El Copey, Cesar',
  'El Doncello, Caquetá',
  'El Dorado, Meta',
  'El Dovio, Valle del Cauca',
  'El Espinal, Tolima',
  'El Espino, Boyacá',
  'El Guacamayo, Santander',
  'El Guamo, Bolívar',
  'El Molino, La Guajira',
  'El Paso, Cesar',
  'El Paujil, Caquetá',
  'El Peñol, Antioquia',
  'El Peñol, Nariño',
  'El Peñón, Bolívar',
  'El Peñón, Cundinamarca',
  'El Peñón, Santander',
  'El Piñón, Magdalena',
  'El Pital, Huila',
  'El Playón, Santander',
  'El Retén, Magdalena',
  'El Retiro, Antioquia',
  'El Retorno, Guaviare',
  'El Roble, Sucre',
  'El Rosal, Cundinamarca',
  'El Rosario, Nariño',
  'El Santuario, Antioquia',
  'El Socorro, Santander',
  'El Tablón, Nariño',
  'El Tambo, Cauca',
  'El Tambo, Nariño',
  'El Tarra, Norte de Santander',
  'El Zulia, Norte de Santander',
  'Elías, Huila',
  'Encino, Santander',
  'Entrerríos, Antioquia',
  'Envigado, Antioquia',
  'Facatativá, Cundinamarca',
  'Falán, Tolima',
  'Filadelfia, Caldas',
  'Filandia, Quindío',
  'Firavitoba, Boyacá',
  'Flandes, Tolima',
  'Florencia, Cauca',
  'Florencia, Caquetá',
  'Floresta, Boyacá',
  'Florián, Santander',
  'Florida, Valle del Cauca',
  'Floridablanca, Santander',
  'Fómeque, Cundinamarca',
  'Fonseca, La Guajira',
  'Fortul, Arauca',
  'Fosca, Cundinamarca',
  'Francisco Pizarro, Nariño',
  'Fredonia, Antioquia',
  'Fresno, Tolima',
  'Frontino, Antioquia',
  'Fuente de Oro, Meta',
  'Fundación, Magdalena',
  'Funes, Nariño',
  'Funza, Cundinamarca',
  'Fúquene, Cundinamarca',
  'Fusagasugá, Cundinamarca',
  'Gachalá, Cundinamarca',
  'Gachancipá, Cundinamarca',
  'Gachantivá, Boyacá',
  'Gachetá, Cundinamarca',
  'Galán, Santander',
  'Galapa, Atlántico',
  'Galeras, Sucre',
  'Gama, Cundinamarca',
  'Gamarra, Cesar',
  'Gámbita, Santander',
  'Gámeza, Boyacá',
  'Garagoa, Boyacá',
  'Garzón, Huila',
  'Génova, Quindío',
  'Gigante, Huila',
  'Ginebra, Valle del Cauca',
  'Giraldo, Antioquia',
  'Girardot, Cundinamarca',
  'Girardota, Antioquia',
  'Girón, Santander',
  'Gómez Plata, Antioquia',
  'González, Cesar',
  'Gramalote, Norte de Santander',
  'Granada, Antioquia',
  'Granada, Cundinamarca',
  'Granada, Meta',
  'Guaca, Santander',
  'Guacamayas, Boyacá',
  'Guacarí, Valle del Cauca',
  'Guachené, Cauca',
  'Guachetá, Cundinamarca',
  'Guachucal, Nariño',
  'Guadalupe, Antioquia',
  'Guadalupe, Huila',
  'Guadalupe, Santander',
  'Guaduas, Cundinamarca',
  'Guaitarilla, Nariño',
  'Gualmatán, Nariño',
  'Guamal, Magdalena',
  'Guamal, Meta',
  'Guamo, Tolima',
  'Guapí, Cauca',
  'Guapotá, Santander',
  'Guaranda, Sucre',
  'Guarne, Antioquia',
  'Guasca, Cundinamarca',
  'Guatapé, Antioquia',
  'Guataquí, Cundinamarca',
  'Guatavita, Cundinamarca',
  'Guateque, Boyacá',
  'Guática, Risaralda',
  'Guavatá, Santander',
  'Guayabal de Síquima, Cundinamarca',
  'Guayabetal, Cundinamarca',
  'Guayatá, Boyacá',
  'Güepsa, Santander',
  'Güicán, Boyacá',
  'Gutiérrez, Cundinamarca',
  'Hacarí, Norte de Santander',
  'Hatillo de Loba, Bolívar',
  'Hato Corozal, Casanare',
  'Hato, Santander',
  'Hatonuevo, La Guajira',
  'Heliconia, Antioquia',
  'Herrán, Norte de Santander',
  'Herveo, Tolima',
  'Hispania, Antioquia',
  'Hobo, Huila',
  'Honda, Tolima',
  'Ibagué, Tolima',
  'Icononzo, Tolima',
  'Iles, Nariño',
  'Imués, Nariño',
  'Inírida, Guainía',
  'Inzá, Cauca',
  'Ipiales, Nariño',
  'Íquira, Huila',
  'Isnos, Huila',
  'Itagüí, Antioquia',
  'Istmina, Chocó',
  'Ituango, Antioquia',
  'Iza, Boyacá',
  'Jambaló, Cauca',
  'Jamundí, Valle del Cauca',
  'Jardín, Antioquia',
  'Jenesano, Boyacá',
  'Jericó, Antioquia',
  'Jericó, Boyacá',
  'Jerusalén, Cundinamarca',
  'Jesús María, Santander',
  'Jordán, Santander',
  'Juan de Acosta, Atlántico',
  'Junín, Cundinamarca',
  'Juradó, Chocó',
  'La Apartada, Córdoba',
  'La Argentina, Huila',
  'La Belleza, Santander',
  'La Calera, Cundinamarca',
  'La Capilla, Boyacá',
  'La Ceja, Antioquia',
  'La Celia, Risaralda',
  'La Cruz, Nariño',
  'La Cumbre, Valle del Cauca',
  'La Dorada, Caldas',
  'La Esperanza, Norte de Santander',
  'La Estrella, Antioquia',
  'La Florida, Nariño',
  'La Gloria, Cesar',
  'La Jagua de Ibirico, Cesar',
  'La Jagua del Pilar, La Guajira',
  'La Llanada, Nariño',
  'La Macarena, Meta',
  'La Merced, Caldas',
  'La Mesa, Cundinamarca',
  'La Montañita, Caquetá',
  'La Palma, Cundinamarca',
  'La Paz, Cesar',
  'La Paz, Santander',
  'La Peña, Cundinamarca',
  'La Pintada, Antioquia',
  'La Plata, Huila',
  'La Playa de Belén, Norte de Santander',
  'La Primavera, Vichada',
  'La Salina, Casanare',
  'La Sierra, Cauca',
  'La Tebaida, Quindío',
  'La Tola, Nariño',
  'La Unión, Antioquia',
  'La Unión, Nariño',
  'La Unión, Sucre',
  'La Unión, Valle del Cauca',
  'La Uribe, Meta',
  'La Uvita, Boyacá',
  'La Vega, Cauca',
  'La Vega, Cundinamarca',
  'La Victoria, Boyacá',
  'La Victoria, Valle del Cauca',
  'La Virginia, Risaralda',
  'Labateca, Norte de Santander',
  'Labranzagrande, Boyacá',
  'Landázuri, Santander',
  'Lebrija, Santander',
  'Leiva, Nariño',
  'Lejanías, Meta',
  'Lenguazaque, Cundinamarca',
  'Lérida, Tolima',
  'Leticia, Amazonas',
  'Líbano, Tolima',
  'Liborina, Antioquia',
  'Linares, Nariño',
  'Litoral de San Juan, Chocó',
  'Lloró, Chocó',
  'López de Micay, Cauca',
  'Lorica, Córdoba',
  'Los Andes, Nariño',
  'Los Córdobas, Córdoba',
  'Los Palmitos, Sucre',
  'Los Patios, Norte de Santander',
  'Los Santos, Santander',
  'Lourdes, Norte de Santander',
  'Luruaco, Atlántico',
  'Macanal, Boyacá',
  'Macaravita, Santander',
  'Maceo, Antioquia',
  'Machetá, Cundinamarca',
  'Madrid, Cundinamarca',
  'Magangué, Bolívar',
  'Magüí Payán, Nariño',
  'Mahates, Bolívar',
  'Maicao, La Guajira',
  'Majagual, Sucre',
  'Málaga, Santander',
  'Malambo, Atlántico',
  'Mallama, Nariño',
  'Manatí, Atlántico',
  'Manaure Balcón del Cesar, Cesar',
  'Manaure, La Guajira',
  'Maní, Casanare',
  'Manizales, Caldas',
  'Manta, Cundinamarca',
  'Manzanares, Caldas',
  'Mapiripán, Meta',
  'Margarita, Bolívar',
  'María la Baja, Bolívar',
  'Marinilla, Antioquia',
  'Maripí, Boyacá',
  'Mariquita, Tolima',
  'Marmato, Caldas',
  'Marquetalia, Caldas',
  'Marsella, Risaralda',
  'Marulanda, Caldas',
  'Matanza, Santander',
  'Medellín, Antioquia',
  'Medina, Cundinamarca',
  'Medio Atrato, Chocó',
  'Medio Baudó, Chocó',
  'Medio San Juan, Chocó',
  'Melgar, Tolima',
  'Mercaderes, Cauca',
  'Mesetas, Meta',
  'Miraflores, Boyacá',
  'Miraflores, Guaviare',
  'Miranda, Cauca',
  'Mistrató, Risaralda',
  'Mitú, Vaupés',
  'Mocoa, Putumayo',
  'Mogotes, Santander',
  'Molagavita, Santander',
  'Momil, Córdoba',
  'Mompós, Bolívar',
  'Mongua, Boyacá',
  'Monguí, Boyacá',
  'Moniquirá, Boyacá',
  'Montebello, Antioquia',
  'Montecristo, Bolívar',
  'Montelíbano, Córdoba',
  'Montenegro, Quindío',
  'Montería, Córdoba',
  'Monterrey, Casanare',
  'Moñitos, Córdoba',
  'Morales, Bolívar',
  'Morales, Cauca',
  'Morelia, Caquetá',
  'Morroa, Sucre',
  'Mosquera, Cundinamarca',
  'Mosquera, Nariño',
  'Motavita, Boyacá',
  'Murillo, Tolima',
  'Murindó, Antioquia',
  'Mutatá, Antioquia',
  'Mutiscua, Norte de Santander',
  'Muzo, Boyacá',
  'Nariño, Antioquia',
  'Nariño, Cundinamarca',
  'Nariño, Nariño',
  'Nátaga, Huila',
  'Natagaima, Tolima',
  'Nechí, Antioquia',
  'Necoclí, Antioquia',
  'Neira, Caldas',
  'Neiva, Huila',
  'Nemocón, Cundinamarca',
  'Nilo, Cundinamarca',
  'Nimaima, Cundinamarca',
  'Nobsa, Boyacá',
  'Nocaima, Cundinamarca',
  'Norcasia, Caldas',
  'Norosí, Bolívar',
  'Nóvita, Chocó',
  'Nueva Granada, Magdalena',
  'Nuevo Colón, Boyacá',
  'Nunchía, Casanare',
  'Nuquí, Chocó',
  'Obando, Valle del Cauca',
  'Ocamonte, Santander',
  'Ocaña, Norte de Santander',
  'Oiba, Santander',
  'Oicatá, Boyacá',
  'Olaya, Antioquia',
  'Olaya Herrera, Nariño',
  'Onzaga, Santander',
  'Oporapa, Huila',
  'Orito, Putumayo',
  'Orocué, Casanare',
  'Ortega, Tolima',
  'Ospina, Nariño',
  'Otanche, Boyacá',
  'Ovejas, Sucre',
  'Pachavita, Boyacá',
  'Pacho, Cundinamarca',
  'Pácora, Caldas',
  'Padilla, Cauca',
  'Páez, Cauca',
  'Páez, Boyacá',
  'Paicol, Huila',
  'Pailitas, Cesar',
  'Paime, Cundinamarca',
  'Paipa, Boyacá',
  'Pajarito, Boyacá',
  'Palermo, Huila',
  'Palestina, Caldas',
  'Palestina, Huila',
  'Palmar de Varela, Atlántico',
  'Palmar, Santander',
  'Palmas del Socorro, Santander',
  'Palmira, Valle del Cauca',
  'Palocabildo, Tolima',
  'Pamplona, Norte de Santander',
  'Pamplonita, Norte de Santander',
  'Pandi, Cundinamarca',
  'Panqueba, Boyacá',
  'Páramo, Santander',
  'Paratebueno, Cundinamarca',
  'Pasca, Cundinamarca',
  'Pasto, Nariño',
  'Patía, Cauca',
  'Pauna, Boyacá',
  'Paya, Boyacá',
  'Paz de Ariporo, Casanare',
  'Paz del Río, Boyacá',
  'Pedraza, Magdalena',
  'Pelaya, Cesar',
  'Pensilvania, Caldas',
  'Peque, Antioquia',
  'Pereira, Risaralda',
  'Pesca, Boyacá',
  'Piamonte, Cauca',
  'Piedecuesta, Santander',
  'Piedras, Tolima',
  'Piendamó, Cauca',
  'Pijao, Quindío',
  'Pijiño del Carmen, Magdalena',
  'Pinchote, Santander',
  'Pinillos, Bolívar',
  'Piojó, Atlántico',
  'Pisba, Boyacá',
  'Pitalito, Huila',
  'Pivijay, Magdalena',
  'Planadas, Tolima',
  'Planeta Rica, Córdoba',
  'Plato, Magdalena',
  'Policarpa, Nariño',
  'Polonuevo, Atlántico',
  'Ponedera, Atlántico',
  'Popayán, Cauca',
  'Pore, Casanare',
  'Potosí, Nariño',
  'Pradera, Valle del Cauca',
  'Prado, Tolima',
  'Providencia, Nariño',
  'Providencia y Santa Catalina Islas, San Andrés y Providencia',
  'Pueblo Viejo, Magdalena',
  'Pueblo Bello, Cesar',
  'Pueblo Nuevo, Córdoba',
  'Pueblo Rico, Risaralda',
  'Pueblorrico, Antioquia',
  'Puente Nacional, Santander',
  'Puerres, Nariño',
  'Puerto Asís, Putumayo',
  'Puerto Berrío, Antioquia',
  'Puerto Boyacá, Boyacá',
  'Puerto Caicedo, Putumayo',
  'Puerto Carreño, Vichada',
  'Puerto Colombia, Atlántico',
  'Puerto Concordia, Meta',
  'Puerto Escondido, Córdoba',
  'Puerto Gaitán, Meta',
  'Puerto Guzmán, Putumayo',
  'Puerto Leguízamo, Putumayo',
  'Puerto Libertador, Córdoba',
  'Puerto Lleras, Meta',
  'Puerto López, Meta',
  'Puerto Milán, Caquetá',
  'Puerto Nare, Antioquia',
  'Puerto Nariño, Amazonas',
  'Puerto Parra, Santander',
  'Puerto Rico, Caquetá',
  'Puerto Rico, Meta',
  'Puerto Rondón, Arauca',
  'Puerto Salgar, Cundinamarca',
  'Puerto Santander, Norte de Santander',
  'Puerto Tejada, Cauca',
  'Puerto Triunfo, Antioquia',
  'Puerto Wilches, Santander',
  'Pulí, Cundinamarca',
  'Pupiales, Nariño',
  'Puracé, Cauca',
  'Purificación, Tolima',
  'Purísima, Córdoba',
  'Quebradanegra, Cundinamarca',
  'Quetame, Cundinamarca',
  'Quibdó, Chocó',
  'Quimbaya, Quindío',
  'Quinchía, Risaralda',
  'Quípama, Boyacá',
  'Quipile, Cundinamarca',
  'Ragonvalia, Norte de Santander',
  'Ramiriquí, Boyacá',
  'Ráquira, Boyacá',
  'Recetor, Casanare',
  'Regidor, Bolívar',
  'Remedios, Antioquia',
  'Remolino, Magdalena',
  'Repelón, Atlántico',
  'Restrepo, Meta',
  'Restrepo, Valle del Cauca',
  'Ricaurte, Cundinamarca',
  'Ricaurte, Nariño',
  'Río de Oro, Cesar',
  'Río Iró, Chocó',
  'Río Quito, Chocó',
  'Río Viejo, Bolívar',
  'Rioblanco, Tolima',
  'Riofrío, Valle del Cauca',
  'Riohacha, La Guajira',
  'Rionegro, Antioquia',
  'Rionegro, Santander',
  'Riosucio, Caldas',
  'Riosucio, Chocó',
  'Risaralda, Caldas',
  'Rivera, Huila',
  'Roberto Payán, Nariño',
  'Roldanillo, Valle del Cauca',
  'Roncesvalles, Tolima',
  'Rondón, Boyacá',
  'Rosas, Cauca',
  'Rovira, Tolima',
  'Sabana de Torres, Santander',
  'Sabanas de San Ángel, Magdalena',
  'Sabanagrande, Atlántico',
  'Sabanalarga, Antioquia',
  'Sabanalarga, Atlántico',
  'Sabanalarga, Casanare',
  'Sabaneta, Antioquia',
  'Saboyá, Boyacá',
  'Sácama, Casanare',
  'Sáchica, Boyacá',
  'Sahagún, Córdoba',
  'Saladoblanco, Huila',
  'Salamina, Caldas',
  'Salamina, Magdalena',
  'Salazar de Las Palmas, Norte de Santander',
  'Saldaña, Tolima',
  'Salento, Quindío',
  'Salgar, Antioquia',
  'Samacá, Boyacá',
  'Samaná, Caldas',
  'Samaniego, Nariño',
  'Sampués, Sucre',
  'San Agustín, Huila',
  'San Alberto, Cesar',
  'San Andrés, San Andrés y Providencia',
  'San Andrés, Santander',
  'San Andrés de Cuerquia, Antioquia',
  'San Andrés de Sotavento, Córdoba',
  'San Antero, Córdoba',
  'San Antonio, Tolima',
  'San Antonio de Palmito, Sucre',
  'San Antonio del Tequendama, Cundinamarca',
  'San Benito, Santander',
  'San Benito Abad, Sucre',
  'San Bernardo, Cundinamarca',
  'San Bernardo, Nariño',
  'San Bernardo del Viento, Córdoba',
  'San Calixto, Norte de Santander',
  'San Carlos, Antioquia',
  'San Carlos, Córdoba',
  'San Carlos de Guaroa, Meta',
  'San Cayetano, Cundinamarca',
  'San Cayetano, Norte de Santander',
  'San Cristóbal, Bolívar',
  'San Diego, Cesar',
  'San Eduardo, Boyacá',
  'San Estanislao, Bolívar',
  'San Fernando, Bolívar',
  'San Francisco, Antioquia',
  'San Francisco, Cundinamarca',
  'San Francisco, Putumayo',
  'San Gil, Santander',
  'San Jacinto, Bolívar',
  'San Jacinto del Cauca, Bolívar',
  'San Jerónimo, Antioquia',
  'San Joaquín, Santander',
  'San José, Caldas',
  'San José de Albán, Nariño',
  'San José de Miranda, Santander',
  'San José de Pare, Boyacá',
  'San José de Uré, Córdoba',
  'San José de la Montaña, Antioquia',
  'San José del Fragua, Caquetá',
  'San José del Guaviare, Guaviare',
  'San José del Palmar, Chocó',
  'San Juan de Arama, Meta',
  'San Juan de Betulia, Sucre',
  'San Juan de Rioseco, Cundinamarca',
  'San Juan de Urabá, Antioquia',
  'San Juan del Cesar, La Guajira',
  'San Juan Nepomuceno, Bolívar',
  'San Juanito, Meta',
  'San Lorenzo, Nariño',
  'San Luis, Antioquia',
  'San Luis, Tolima',
  'San Luis de Gaceno, Boyacá',
  'San Luis de Palenque, Casanare',
  'San Marcos, Sucre',
  'San Martín, Cesar',
  'San Martín, Meta',
  'San Martín de Loba, Bolívar',
  'San Mateo, Boyacá',
  'San Miguel, Putumayo',
  'San Miguel, Santander',
  'San Miguel de Sema, Boyacá',
  'San Onofre, Sucre',
  'San Pablo, Bolívar',
  'San Pablo, Nariño',
  'San Pablo de Borbur, Boyacá',
  'San Pedro, Sucre',
  'San Pedro, Valle del Cauca',
  'San Pedro de Cartago, Nariño',
  'San Pedro de Urabá, Antioquia',
  'San Pedro de los Milagros, Antioquia',
  'San Pelayo, Córdoba',
  'San Rafael, Antioquia',
  'San Roque, Antioquia',
  'San Sebastián, Cauca',
  'San Sebastián de Buenavista, Magdalena',
  'San Vicente, Antioquia',
  'San Vicente de Chucurí, Santander',
  'San Vicente del Caguán, Caquetá',
  'San Zenón, Magdalena',
  'Sandoná, Nariño',
  'Santa Ana, Magdalena',
  'Santa Bárbara, Antioquia',
  'Santa Bárbara, Nariño',
  'Santa Bárbara, Santander',
  'Santa Bárbara de Pinto, Magdalena',
  'Santa Catalina, Bolívar',
  'Santa Fe de Antioquia, Antioquia',
  'Santa Helena del Opón, Santander',
  'Santa Isabel, Tolima',
  'Santa Lucía, Atlántico',
  'Santa María, Boyacá',
  'Santa María, Huila',
  'Santa Marta, Magdalena',
  'Santa Rosa, Bolívar',
  'Santa Rosa, Cauca',
  'Santa Rosa de Cabal, Risaralda',
  'Santa Rosa de Osos, Antioquia',
  'Santa Rosa de Viterbo, Boyacá',
  'Santa Rosa del Sur, Bolívar',
  'Santa Rosalía, Vichada',
  'Santa Sofía, Boyacá',
  'Santacruz, Nariño',
  'Santana, Boyacá',
  'Santander de Quilichao, Cauca',
  'Santiago, Norte de Santander',
  'Santiago, Putumayo',
  'Santo Domingo, Antioquia',
  'Santo Domingo de Silos, Norte de Santander',
  'Santo Tomás, Atlántico',
  'Santuario, Risaralda',
  'Sapuyes, Nariño',
  'Saravena, Arauca',
  'Sardinata, Norte de Santander',
  'Sasaima, Cundinamarca',
  'Sativanorte, Boyacá',
  'Sativasur, Boyacá',
  'Segovia, Antioquia',
  'Sesquilé, Cundinamarca',
  'Sevilla, Valle del Cauca',
  'Siachoque, Boyacá',
  'Sibaté, Cundinamarca',
  'Sibundoy, Putumayo',
  'Silvania, Cundinamarca',
  'Silvia, Cauca',
  'Simacota, Santander',
  'Simijaca, Cundinamarca',
  'Simití, Bolívar',
  'Sincé, Sucre',
  'Sincelejo, Sucre',
  'Sipí, Chocó',
  'Sitionuevo, Magdalena',
  'Soacha, Cundinamarca',
  'Soatá, Boyacá',
  'Socha, Boyacá',
  'Socotá, Boyacá',
  'Sogamoso, Boyacá',
  'Solano, Caquetá',
  'Soledad, Atlántico',
  'Solita, Caquetá',
  'Somondoco, Boyacá',
  'Sonsón, Antioquia',
  'Sopetrán, Antioquia',
  'Soplaviento, Bolívar',
  'Sopó, Cundinamarca',
  'Sora, Boyacá',
  'Soracá, Boyacá',
  'Sotaquirá, Boyacá',
  'Sotará, Cauca',
  'Suaita, Santander',
  'Suán, Atlántico',
  'Suárez, Cauca',
  'Suárez, Tolima',
  'Suaza, Huila',
  'Subachoque, Cundinamarca',
  'Sucre, Cauca',
  'Sucre, Santander',
  'Sucre, Sucre',
  'Suesca, Cundinamarca',
  'Supatá, Cundinamarca',
  'Supía, Caldas',
  'Suratá, Santander',
  'Susa, Cundinamarca',
  'Susacón, Boyacá',
  'Sutamarchán, Boyacá',
  'Sutatausa, Cundinamarca',
  'Sutatenza, Boyacá',
  'Tabio, Cundinamarca',
  'Tadó, Chocó',
  'Talaigua Nuevo, Bolívar',
  'Tamalameque, Cesar',
  'Támara, Casanare',
  'Tame, Arauca',
  'Támesis, Antioquia',
  'Taminango, Nariño',
  'Tangua, Nariño',
  'Taraira, Vaupés',
  'Tarazá, Antioquia',
  'Tarquí, Huila',
  'Tarso, Antioquia',
  'Tasco, Boyacá',
  'Tauramena, Casanare',
  'Tausa, Cundinamarca',
  'Tello, Huila',
  'Tena, Cundinamarca',
  'Tenerife, Magdalena',
  'Tenjo, Cundinamarca',
  'Tenza, Boyacá',
  'Teorama, Norte de Santander',
  'Teruel, Huila',
  'Tesalia, Huila',
  'Tibacuy, Cundinamarca',
  'Tibaná, Boyacá',
  'Tibasosa, Boyacá',
  'Tibirita, Cundinamarca',
  'Tibú, Norte de Santander',
  'Tierralta, Córdoba',
  'Timaná, Huila',
  'Timbío, Cauca',
  'Timbiquí, Cauca',
  'Tinjacá, Boyacá',
  'Tipacoque, Boyacá',
  'Tiquisio, Bolívar',
  'Titiribí, Antioquia',
  'Toca, Boyacá',
  'Tocaima, Cundinamarca',
  'Tocancipá, Cundinamarca',
  'Togüí, Boyacá',
  'Toledo, Antioquia',
  'Toledo, Norte de Santander',
  'Tolú, Sucre',
  'Tolú Viejo, Sucre',
  'Tona, Santander',
  'Tópaga, Boyacá',
  'Topaipí, Cundinamarca',
  'Toribío, Cauca',
  'Toro, Valle del Cauca',
  'Tota, Boyacá',
  'Totoró, Cauca',
  'Trinidad, Casanare',
  'Trujillo, Valle del Cauca',
  'Tubará, Atlántico',
  'Tuchín, Córdoba',
  'Tuluá, Valle del Cauca',
  'Tumaco, Nariño',
  'Tunja, Boyacá',
  'Tununguá, Boyacá',
  'Túquerres, Nariño',
  'Turbaco, Bolívar',
  'Turbaná, Bolívar',
  'Turbo, Antioquia',
  'Turmequé, Boyacá',
  'Tuta, Boyacá',
  'Tutazá, Boyacá',
  'Ubalá, Cundinamarca',
  'Ubaque, Cundinamarca',
  'Ubaté, Cundinamarca',
  'Ulloa, Valle del Cauca',
  'Úmbita, Boyacá',
  'Une, Cundinamarca',
  'Unión Panamericana, Chocó',
  'Unguía, Chocó',
  'Uramita, Antioquia',
  'Uribia, La Guajira',
  'Urrao, Antioquia',
  'Urumita, La Guajira',
  'Usiacurí, Atlántico',
  'Útica, Cundinamarca',
  'Valdivia, Antioquia',
  'Valencia, Córdoba',
  'Valle de San José, Santander',
  'Valle de San Juan, Tolima',
  'Valle del Guamuez, Putumayo',
  'Valledupar, Cesar',
  'Valparaíso, Antioquia',
  'Valparaíso, Caquetá',
  'Vegachí, Antioquia',
  'Vélez, Santander',
  'Venadillo, Tolima',
  'Venecia, Antioquia',
  'Venecia, Cundinamarca',
  'Ventaquemada, Boyacá',
  'Vergara, Cundinamarca',
  'Versalles, Valle del Cauca',
  'Vetas, Santander',
  'Vianí, Cundinamarca',
  'Victoria, Caldas',
  'Vigía del Fuerte, Antioquia',
  'Vijes, Valle del Cauca',
  'Villa Caro, Norte de Santander',
  'Villa de Leyva, Boyacá',
  'Villa del Rosario, Norte de Santander',
  'Villa Rica, Cauca',
  'Villagarzón, Putumayo',
  'Villagómez, Cundinamarca',
  'Villahermosa, Tolima',
  'Villamaría, Caldas',
  'Villanueva, Bolívar',
  'Villanueva, Casanare',
  'Villanueva, La Guajira',
  'Villanueva, Santander',
  'Villapinzón, Cundinamarca',
  'Villarrica, Tolima',
  'Villavicencio, Meta',
  'Villavieja, Huila',
  'Villeta, Cundinamarca',
  'Viotá, Cundinamarca',
  'Viracachá, Boyacá',
  'Vista Hermosa, Meta',
  'Viterbo, Caldas',
  'Yacopí, Cundinamarca',
  'Yacuanquer, Nariño',
  'Yaguará, Huila',
  'Yalí, Antioquia',
  'Yarumal, Antioquia',
  'Yolombó, Antioquia',
  'Yondó, Antioquia',
  'Yopal, Casanare',
  'Yotoco, Valle del Cauca',
  'Yumbo, Valle del Cauca',
  'Zambrano, Bolívar',
  'Zapatoca, Santander',
  'Zapayán, Magdalena',
  'Zaragoza, Antioquia',
  'Zarzal, Valle del Cauca',
  'Zetaquirá, Boyacá',
  'Zipacón, Cundinamarca',
  'Zipaquirá, Cundinamarca',
  'Zona Bananera, Magdalena',
];
    const filterMunicipalities = (queryValue = '') => {
      const query = normalizeText(queryValue).trim();
      if (!query) {
        return municipalities;
      }
      return municipalities.filter((municipality) => normalizeText(municipality).includes(query));
    };

    const openCountryOptions = (item) => {
      if (!isCountryType(item)) {
        return;
      }
      countrySearch.value = item.country;
      showCountryOptions.value = true;
    };

    const closeCountryOptions = () => {
      showCountryOptions.value = false;
    };

    const onCountryInput = (item, index) => {
      countrySearch.value = item.country;
      validateItemField(item, index, 'country');
      openCountryOptions(item);
    };

    const selectCountry = (item, index, country) => {
      item.country = country;
      item.flagRatio = 'oficial';
      item.flagNaturalRatio = null;
      item.widthCm = '';
      item.heightCm = '';
      countrySearch.value = '';
      clearItemError(index, 'country');
      closeCountryOptions();
    };

    const openDepartmentOptions = (item) => {
      if (!isDepartmentType(item)) {
        return;
      }
      departmentSearch.value = item.department;
      showDepartmentOptions.value = true;
    };

    const closeDepartmentOptions = () => {
      showDepartmentOptions.value = false;
    };

    const onDepartmentInput = (item, index) => {
      departmentSearch.value = item.department;
      validateItemField(item, index, 'department');
      openDepartmentOptions(item);
    };

    const selectDepartment = (item, index, department) => {
      item.department = department;
      item.flagRatio = 'oficial';
      item.flagNaturalRatio = null;
      item.widthCm = '';
      item.heightCm = '';
      departmentSearch.value = '';
      clearItemError(index, 'department');
      closeDepartmentOptions();
    };

    const openMunicipalityOptions = (item) => {
      if (!isMunicipalityType(item)) {
        return;
      }
      municipalitySearch.value = item.municipality;
      showMunicipalityOptions.value = true;
    };

    const closeMunicipalityOptions = () => {
      showMunicipalityOptions.value = false;
    };

    const onMunicipalityInput = (item, index) => {
      municipalitySearch.value = item.municipality;
      validateItemField(item, index, 'municipality');
      openMunicipalityOptions(item);
    };

    const selectMunicipality = (item, index, municipality) => {
      item.municipality = municipality;
      item.flagRatio = 'oficial';
      item.flagNaturalRatio = null;
      item.widthCm = '';
      item.heightCm = '';
      municipalitySearch.value = '';
      clearItemError(index, 'municipality');
      closeMunicipalityOptions();
    };

    const onDocumentClick = (event) => {
      const containsTarget = (refValue) => {
        if (!refValue) return false;
        if (Array.isArray(refValue)) {
          return refValue.some((item) => item?.contains?.(event.target));
        }
        return refValue.contains?.(event.target);
      };

      const clickedCountry = containsTarget(countryDropdownRef.value);
      const clickedDepartment = containsTarget(departmentDropdownRef.value);
      const clickedMunicipality = containsTarget(municipalityDropdownRef.value);
      if (!clickedCountry) {
        closeCountryOptions();
      }
      if (!clickedDepartment) {
        closeDepartmentOptions();
      }
      if (!clickedMunicipality) {
        closeMunicipalityOptions();
      }
    };

const onItemBanderaTypeChange = (item, index) => {
      item.flagRatio = 'oficial';
      item.flagNaturalRatio = null;
      item.widthCm = '';
      item.heightCm = '';
      if (!isCountryType(item)) {
        item.country = '';
        clearItemError(index, 'country');
        closeCountryOptions();
      }
      if (!isDepartmentType(item)) {
        item.department = '';
        clearItemError(index, 'department');
        closeDepartmentOptions();
      }
      if (!isMunicipalityType(item)) {
        item.municipality = '';
        clearItemError(index, 'municipality');
        closeMunicipalityOptions();
      }
      if (!isOtherType(item)) {
        item.otherFlagType = '';
        clearItemError(index, 'otherFlagType');
      }
      validateItemField(item, index, 'banderaType');
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
      itemAspectRatio,
      isColombiaType,
      hasOfficialRatio,
      departmentFlagSrc,
      municipalityFlagSrc,
      countryFlagSrc,
      onWidthInput,
      onHeightInput,
      onFlagRatioChange,
      onFlagImageLoad,
      countries,
      filterCountries,
      departments,
      filterDepartments,
      municipalities,
      filterMunicipalities,
      showCountryOptions,
      showDepartmentOptions,
      showMunicipalityOptions,
      departmentSearch,
      countrySearch,
      municipalitySearch,
      formRef,
      successCanvasRef,
      countryDropdownRef,
      departmentDropdownRef,
      municipalityDropdownRef,
      submitStatus,
      isSubmitting,
      isCountryType,
      isDepartmentType,
      isMunicipalityType,
      isOtherType,
      validateField,
      validateItemField,
      getItemErrorKey,
      onItemBanderaTypeChange,
      onCountryInput,
      openCountryOptions,
      closeCountryOptions,
      selectCountry,
      onDepartmentInput,
      openDepartmentOptions,
      closeDepartmentOptions,
      selectDepartment,
      onMunicipalityInput,
      openMunicipalityOptions,
      closeMunicipalityOptions,
      selectMunicipality,
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
         <div v-for="(item, index) in form.items" :key="index" class="quote-item-card">
            <h3>{{ t.itemLabel }} #{{ index + 1 }}</h3>
            <label>
              {{ t.banderaType }}
              <select v-model="item.banderaType" @change="onItemBanderaTypeChange(item, index)" @blur="validateItemField(item, index, 'banderaType')" required>
                <option disabled value="">Selecciona una opción</option>
                <option v-for="type in t.banderaTypes" :key="type" :value="type">{{ type }}</option>
              </select>
              <small v-if="errors[getItemErrorKey(index, 'banderaType')]" class="field-error">{{ errors[getItemErrorKey(index, 'banderaType')] }}</small>
            </label>

            <label v-if="isCountryType(item)">
              {{ t.country }}
              <div ref="countryDropdownRef" class="country-autocomplete">
                <input type="text" v-model="item.country" :placeholder="t.countryPlaceholder" autocomplete="off" @focus="openCountryOptions(item)" @click="openCountryOptions(item)" @input="onCountryInput(item, index)" @blur="validateItemField(item, index, 'country')" required />
                <ul v-if="showCountryOptions" class="country-options" role="listbox" aria-label="Lista de países">
                  <li v-for="country in filterCountries(countrySearch)" :key="country" class="country-option" role="option" @mousedown.prevent="selectCountry(item, index, country)">{{ country }}</li>
                  <li v-if="!filterCountries(countrySearch).length" class="country-option-empty">No se encontraron países.</li>
                </ul>
              </div>
              <small v-if="errors[getItemErrorKey(index, 'country')]" class="field-error">{{ errors[getItemErrorKey(index, 'country')] }}</small>
            </label>

          <label v-if="isDepartmentType(item)">
              {{ t.department }}
              <div ref="departmentDropdownRef" class="country-autocomplete">
                <input type="text" v-model="item.department" :placeholder="t.departmentPlaceholder" autocomplete="off" @focus="openDepartmentOptions(item)" @click="openDepartmentOptions(item)" @input="onDepartmentInput(item, index)" @blur="validateItemField(item, index, 'department')" required />
                <ul v-if="showDepartmentOptions" class="country-options" role="listbox" aria-label="Lista de departamentos">
                  <li v-for="department in filterDepartments(departmentSearch)" :key="department" class="country-option" role="option" @mousedown.prevent="selectDepartment(item, index, department)">{{ department }}</li>
                  <li v-if="!filterDepartments(departmentSearch).length" class="country-option-empty">No se encontraron departamentos.</li>
                </ul>
              </div>
              <small v-if="errors[getItemErrorKey(index, 'department')]" class="field-error">{{ errors[getItemErrorKey(index, 'department')] }}</small>
            </label>

          <label v-if="isMunicipalityType(item)">
              {{ t.municipality }}
              <div ref="municipalityDropdownRef" class="country-autocomplete">
                <input type="text" v-model="item.municipality" :placeholder="t.municipalityPlaceholder" autocomplete="off" @focus="openMunicipalityOptions(item)" @click="openMunicipalityOptions(item)" @input="onMunicipalityInput(item, index)" @blur="validateItemField(item, index, 'municipality')" required />
                <ul v-if="showMunicipalityOptions" class="country-options" role="listbox" aria-label="Lista de ciudades y municipios">
                  <li v-for="municipality in filterMunicipalities(municipalitySearch)" :key="municipality" class="country-option" role="option" @mousedown.prevent="selectMunicipality(item, index, municipality)">{{ municipality }}</li>
                  <li v-if="!filterMunicipalities(municipalitySearch).length" class="country-option-empty">No se encontraron ciudades o municipios.</li>
                </ul>
              </div>
              <small v-if="errors[getItemErrorKey(index, 'municipality')]" class="field-error">{{ errors[getItemErrorKey(index, 'municipality')] }}</small>
            </label>

          <label v-if="isOtherType(item)">
              {{ t.otherFlagType }}
              <input type="text" v-model="item.otherFlagType" :placeholder="t.otherFlagTypePlaceholder" @input="validateItemField(item, index, 'otherFlagType')" required />
              <small v-if="errors[getItemErrorKey(index, 'otherFlagType')]" class="field-error">{{ errors[getItemErrorKey(index, 'otherFlagType')] }}</small>
            </label>

            <label>
              {{ t.quantity }}
              <input type="number" min="1" step="1" v-model="item.quantity" @input="validateItemField(item, index, 'quantity')" required />
              <small v-if="errors[getItemErrorKey(index, 'quantity')]" class="field-error">{{ errors[getItemErrorKey(index, 'quantity')] }}</small>
            </label>
          
         <div class="dimensions-grid">
              <label>
                {{ t.width }}
                <input type="number" min="1" step="1" v-model="item.widthCm" @input="onWidthInput(item, index)" required />
                <small v-if="errors[getItemErrorKey(index, 'widthCm')]" class="field-error">{{ errors[getItemErrorKey(index, 'widthCm')] }}</small>
              </label>
              <label>
                {{ t.height }}
                <input type="number" min="1" step="1" v-model="item.heightCm" @input="onHeightInput(item, index)" :readonly="hasOfficialRatio(item)" required />
                <small v-if="errors[getItemErrorKey(index, 'heightCm')]" class="field-error">{{ errors[getItemErrorKey(index, 'heightCm')] }}</small>
              </label>
            </div>

            <div v-if="isColombiaType(item) || isCountryType(item) || (isDepartmentType(item) && item.department) || (isMunicipalityType(item) && item.municipality)" class="flag-ratio-options">
              <p class="flag-ratio-label">{{ t.flagRatioLabel }}</p>
              <label class="flag-ratio-option">
                <input type="radio" v-model="item.flagRatio" value="oficial" @change="onFlagRatioChange(item, index)" />
                {{ t.flagRatioOficial }}
              </label>
              <label class="flag-ratio-option">
                <input type="radio" v-model="item.flagRatio" value="personalizada" @change="onFlagRatioChange(item, index)" />
                {{ t.flagRatioPersonalizada }}
              </label>
            </div>

            <div class="flag-preview-wrap">
              <p>{{ t.preview }}</p>
              <div class="flag-preview" :style="{ aspectRatio: itemAspectRatio(item) }">
                <img v-if="item.banderaType === 'De Colombia'" src="images/banderas/Flag_of_Colombia.svg" alt="Bandera de Colombia" class="flag-preview--image" @load="onFlagImageLoad($event, item)" />
                <img v-else-if="isDepartmentType(item) && item.department" :src="departmentFlagSrc(item)" :alt="'Bandera de ' + item.department" class="flag-preview--image" @error="$event.target.style.display='none'" @load="onFlagImageLoad($event, item)" />
                <img v-else-if="isMunicipalityType(item) && item.municipality" :src="municipalityFlagSrc(item)" :alt="'Bandera de ' + item.municipality" class="flag-preview--image" @error="$event.target.style.display='none'" @load="onFlagImageLoad($event, item)" />
                <img v-else-if="isCountryType(item) && item.country" :src="countryFlagSrc(item)" :alt="'Bandera de ' + item.country" class="flag-preview--image" @error="$event.target.style.display='none'" @load="onFlagImageLoad($event, item)" />
              </div>
            </div>
            <button v-if="form.items.length > 1" type="button" class="btn-secondary quote-remove-item" @click="removeItem(index)">{{ t.removeFlag }}</button>
          </div>

          <button type="button" class="btn-primary quote-add-item" @click="addItem">{{ t.addFlag }}</button>
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