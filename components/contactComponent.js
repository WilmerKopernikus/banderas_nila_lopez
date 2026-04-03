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
    let confettiSketch = null;

    const form = reactive({
      banderaType: '',
      country: '',
      department: '',
      municipality: '',
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
      otherFlagType: '',
    });

    const errors = reactive({});

    const progressPct = computed(() => Math.round((step.value / totalSteps) * 100));
    const isSubmitting = computed(() => submitStatus.value === 'submitting');
    const showCountryField = computed(() => form.banderaType === 'De un país');
    const showDepartmentField = computed(() => form.banderaType === 'De un departamento de Colombia');
    const showMunicipalityField = computed(() => form.banderaType === 'De una ciudad o Municipio de Colombia');
    const showOtherFlagTypeField = computed(() => form.banderaType === 'Otra');
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

      if (field === 'department' && showDepartmentField.value && !form.department) {
        errors[field] = t.value.required;
      }

      if (field === 'otherFlagType' && showOtherFlagTypeField.value && !form.otherFlagType) {
        errors[field] = t.value.required;
      }

      if (field === 'municipality' && showMunicipalityField.value && !form.municipality) {
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
      1: ['banderaType', 'country', 'department', 'municipality', 'otherFlagType', 'quantity', 'widthCm', 'heightCm'],
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
        if (field === 'department' && !showDepartmentField.value) {
          errors.department = '';
          return true;
        }
        if (field === 'otherFlagType' && !showOtherFlagTypeField.value) {
          errors.otherFlagType = '';
          return true;
        }
        if (field === 'municipality' && !showMunicipalityField.value) {
          errors.municipality = '';
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

    const departments = [
      'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá', 'Casanare',
      'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira',
      'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda',
      'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada',
    ];

    const filteredDepartments = computed(() => {
      const query = normalizeText(form.department || '').trim();
      if (!query) {
        return departments;
      }
      return departments.filter((department) => normalizeText(department).includes(query));
    });

    const municipalities = [
      'Abejorral', 'Ábrego', 'Abriaquí', 'Acacías', 'Acandí', 'Acevedo', 'Achí', 'Agrado', 'Agua de Dios', 'Aguachica', 'Aguada', 'Aguadas', 'Aguazul', 'Agustín Codazzi', 'Aipe', 'Albán', 'Albania, Caquetá', 'Albania, La Guajira', 'Albania, Santander',
      'Alcalá', 'Aldana', 'Alejandría', 'Algarrobo', 'Algeciras', 'Almaguer', 'Almeida', 'Alpujarra', 'Altamira', 'Alto Baudó', 'Altos del Rosario', 'Alvarado', 'Amagá', 'Amalfi', 'Ambalema', 'Anapoima', 'Ancuya', 'Andalucía', 'Andes',
      'Angelópolis', 'Angostura', 'Anolaima', 'Anorí', 'Anserma', 'Ansermanuevo', 'Anzá', 'Anzoátegui', 'Apartadó', 'Apía', 'Apulo', 'Aquitania', 'Aracataca', 'Aranzazu', 'Aratoca', 'Arauca', 'Arauquita', 'Arbeláez', 'Arboleda', 'Arboledas',
      'Arboletes', 'Arcabuco', 'Arenal', 'Argelia, Antioquia', 'Argelia, Cauca', 'Argelia, Valle del Cauca', 'Ariguaní', 'Arjona', 'Armenia, Antioquia', 'Armenia, Quindío', 'Armero', 'Arroyohondo', 'Astrea', 'Ataco', 'Ayapel', 'Bagadó', 'Bahía Solano', 'Bajo Baudó', 'Balboa, Cauca',
      'Balboa, Risaralda', 'Baranoa', 'Baraya', 'Barbacoas', 'Barbosa, Antioquia', 'Barbosa, Santander', 'Barichara', 'Barranca de Upía', 'Barrancabermeja', 'Barrancas', 'Barranco de Loba', 'Barrancominas', 'Barranquilla', 'Becerril', 'Belalcázar', 'Belén, Boyacá', 'Belén, Nariño', 'Belén de Bajirá',
      'Belén de los Andaquíes', 'Belén de Umbría', 'Bello', 'Belmira', 'Beltrán', 'Berbeo', 'Betania', 'Betéitiva', 'Betulia, Antioquia', 'Betulia, Santander', 'Bituima', 'Boavita', 'Bochalema', 'Bogotá', 'Bojacá', 'Bojayá', 'Bolívar, Antioquia', 'Bolívar, Cauca', 'Bolívar, Santander',
      'Bolívar, Valle del Cauca', 'Bosconia', 'Boyacá', 'Briceño, Antioquia', 'Briceño, Boyacá', 'Bucaramanga', 'Bucarasica', 'Buenaventura', 'Buenavista, Boyacá', 'Buenavista, Córdoba', 'Buenavista, Quindío', 'Buenavista, Sucre', 'Buenos Aires', 'Buesaco', 'Buga', 'Bugalagrande', 'Buriticá', 'Busbanzá',
      'Cabrera, Cundinamarca', 'Cabrera, Santander', 'Cabuyaro', 'Cáceres', 'Cachipay', 'Cáchira', 'Cácota', 'Caicedo', 'Caicedonia', 'Caimito', 'Cajamarca', 'Cajibío', 'Cajicá', 'Calamar, Bolívar', 'Calamar, Guaviare', 'Calarcá', 'Caldas, Antioquia', 'Caldas, Boyacá', 'Caldono',
      'Cali', 'California', 'Calima', 'Caloto', 'Campamento', 'Campo de la Cruz', 'Campoalegre', 'Campohermoso', 'Canalete', 'Candelaria, Atlántico', 'Candelaria, Valle del Cauca', 'Cantagallo', 'Cantón de San Pablo', 'Cañasgordas', 'Caparrapí', 'Capitanejo', 'Cáqueza', 'Caracolí',
      'Caramanta', 'Carcasí', 'Carepa', 'Carmen de Apicalá', 'Carmen de Carupa', 'Carolina del Príncipe', 'Cartagena de Indias', 'Cartagena del Chairá', 'Cartago', 'Carurú', 'Casabianca', 'Castilla la Nueva', 'Caucasia', 'Cepitá', 'Cereté', 'Cerinza', 'Cerrito',
      'Cerro de San Antonio', 'Cértegui', 'Chachagüí', 'Chaguaní', 'Chalán', 'Chámeza', 'Chaparral', 'Charalá', 'Charta', 'Chía', 'Chibolo', 'Chigorodó', 'Chima', 'Chimá', 'Chimichagua', 'Chinácota', 'Chinavita', 'Chinchiná',
      'Chinú', 'Chipaque', 'Chipatá', 'Chiquinquirá', 'Chíquiza', 'Chiriguaná', 'Chiscas', 'Chita', 'Chitagá', 'Chitaraque', 'Chivatá', 'Chivor', 'Choachí', 'Chocontá', 'Cicuco', 'Ciénaga', 'Ciénaga de Oro', 'Ciénega',
      'Cimitarra', 'Circasia', 'Cisneros', 'Clemencia', 'Cocorná', 'Coello', 'Cogua', 'Colombia', 'Colón, Nariño', 'Colón, Putumayo', 'Colosó', 'Cómbita', 'Concepción, Antioquia', 'Concepción, Santander', 'Concordia, Antioquia', 'Concordia, Magdalena', 'Condoto', 'Confines',
      'Consacá', 'Contadero', 'Contratación', 'Convención', 'Copacabana', 'Coper', 'Córdoba, Bolívar', 'Córdoba, Nariño', 'Córdoba, Quindío', 'Corinto', 'Coromoro', 'Corozal', 'Corrales', 'Cota', 'Cotorra', 'Covarachía', 'Coveñas', 'Coyaima',
      'Cravo Norte', 'Cuaspud', 'Cubará', 'Cubarral', 'Cucaita', 'Cucunubá', 'Cúcuta', 'Cucutilla', 'Cuítiva', 'Cumaral', 'Cumaribo', 'Cumbal', 'Cumbitara', 'Cunday', 'Curillo', 'Curití', 'Curumaní', 'Dabeiba',
      'Dagua', 'Dibulla', 'Distracción', 'Dolores', 'Donmatías', 'Dosquebradas', 'Duitama', 'Duranía', 'Ebéjico', 'El Águila', 'El Atrato', 'El Bagre', 'El Banco', 'El Cairo', 'El Calvario', 'El Carmen', 'El Carmen de Atrato', 'El Carmen de Bolívar',
      'El Carmen de Chucurí', 'El Carmen de Viboral', 'El Carmen del Darién', 'El Castillo', 'El Cerrito', 'El Charco', 'El Cocuy', 'El Colegio', 'El Copey', 'El Doncello', 'El Dorado', 'El Dovio', 'El Espinal', 'El Espino', 'El Guacamayo', 'El Guamo', 'El Molino', 'El Paso', 'El Paujil', 'El Peñol, Antioquia', 'El Peñol, Nariño', 'El Peñón, Bolívar', 'El Peñón, Cundinamarca', 'El Peñón, Santander', 'El Piñón',
      'El Pital', 'El Playón', 'El Retén', 'El Retiro', 'El Retorno', 'El Roble', 'El Rosal', 'El Rosario', 'El Santuario', 'El Socorro', 'El Tablón', 'El Tambo, Cauca', 'El Tambo, Nariño', 'El Tarra', 'El Zulia', 'Elías', 'Encino', 'Entrerríos', 'Envigado',
      'Facatativá', 'Falán', 'Filadelfia', 'Filandia', 'Firavitoba', 'Flandes', 'Florencia, Cauca', 'Florencia, Caquetá', 'Floresta', 'Florián', 'Florida', 'Floridablanca', 'Fómeque', 'Fonseca', 'Fortul', 'Fosca', 'Francisco Pizarro', 'Fredonia', 'Fresno',
      'Frontino', 'Fuente de Oro', 'Fundación', 'Funes', 'Funza', 'Fúquene', 'Fusagasugá', 'Gachalá', 'Gachancipá', 'Gachantivá', 'Gachetá', 'Galán', 'Galapa', 'Galeras', 'Gama', 'Gamarra', 'Gámbita', 'Gámeza', 'Garagoa',
      'Garzón', 'Génova', 'Gigante', 'Ginebra', 'Giraldo', 'Girardot', 'Girardota', 'Girón', 'Gómez Plata', 'González', 'Gramalote', 'Granada, Antioquia', 'Granada, Cundinamarca', 'Granada, Meta', 'Guaca', 'Guacamayas', 'Guacarí', 'Guachené', 'Guachetá',
      'Guachucal', 'Guadalupe, Antioquia', 'Guadalupe, Huila', 'Guadalupe, Santander', 'Guaduas', 'Guaitarilla', 'Gualmatán', 'Guamal, Magdalena', 'Guamal, Meta', 'Guamo', 'Guapí', 'Guapotá', 'Guaranda', 'Guarne', 'Guasca', 'Guatapé', 'Guataquí', 'Guatavita', 'Guateque',
      'Guática', 'Guavatá', 'Guayabal de Síquima', 'Guayabetal', 'Guayatá', 'Güepsa', 'Güicán', 'Gutiérrez', 'Hacarí', 'Hatillo de Loba', 'Hato Corozal', 'Hato', 'Hatonuevo', 'Heliconia', 'Herrán', 'Herveo', 'Hispania', 'Hobo',
      'Honda', 'Ibagué', 'Icononzo', 'Iles', 'Imués', 'Inírida', 'Inzá', 'Ipiales', 'Íquira', 'Isnos', 'Itagüí', 'Istmina', 'Ituango', 'Iza', 'Jambaló', 'Jamundí', 'Jardín', 'Jenesano', 'Jericó, Antioquia', 'Jericó, Boyacá',
      'Jerusalén', 'Jesús María', 'Jordán', 'Juan de Acosta', 'Junín', 'Juradó', 'La Apartada', 'La Argentina', 'La Belleza', 'La Calera', 'La Capilla', 'La Ceja', 'La Celia', 'La Cruz', 'La Cumbre', 'La Dorada', 'La Esperanza', 'La Estrella',
      'La Florida', 'La Gloria', 'La Jagua de Ibirico', 'La Jagua del Pilar', 'La Llanada', 'La Macarena', 'La Merced', 'La Mesa', 'La Montañita', 'La Palma', 'La Paz, Cesar', 'La Paz, Santander', 'La Peña', 'La Pintada', 'La Plata', 'La Playa de Belén', 'La Primavera', 'La Salina',
      'La Sierra', 'La Tebaida', 'La Tola', 'La Unión, Antioquia', 'La Unión, Nariño', 'La Unión, Sucre', 'La Unión, Valle del Cauca', 'La Uribe', 'La Uvita', 'La Vega, Cauca', 'La Vega, Cundinamarca', 'La Victoria, Boyacá', 'La Victoria, Valle del Cauca', 'La Virginia', 'Labateca', 'Labranzagrande', 'Landázuri', 'Lebrija',
      'Leiva', 'Lejanías', 'Lenguazaque', 'Lérida', 'Leticia', 'Líbano', 'Liborina', 'Linares', 'Litoral de San Juan', 'Lloró', 'López de Micay', 'Lorica', 'Los Andes', 'Los Córdobas', 'Los Palmitos', 'Los Patios', 'Los Santos', 'Lourdes',
      'Luruaco', 'Macanal', 'Macaravita', 'Maceo', 'Machetá', 'Madrid', 'Magangué', 'Magüí Payán', 'Mahates', 'Maicao', 'Majagual', 'Málaga', 'Malambo', 'Mallama', 'Manatí', 'Manaure Balcón del Cesar', 'Manaure', 'Maní',
      'Manizales', 'Manta', 'Manzanares', 'Mapiripán', 'Margarita', 'María la Baja', 'Marinilla', 'Maripí', 'Mariquita', 'Marmato', 'Marquetalia', 'Marsella', 'Marulanda', 'Matanza', 'Medellín', 'Medina', 'Medio Atrato', 'Medio Baudó',
      'Medio San Juan', 'Melgar', 'Mercaderes', 'Mesetas', 'Miraflores, Boyacá', 'Miraflores, Guaviare', 'Miranda', 'Mistrató', 'Mitú', 'Mocoa', 'Mogotes', 'Molagavita', 'Momil', 'Mompós', 'Mongua', 'Monguí', 'Moniquirá', 'Montebello',
      'Montecristo', 'Montelíbano', 'Montenegro', 'Montería', 'Monterrey', 'Moñitos', 'Morales, Bolívar', 'Morales, Cauca', 'Morelia', 'Morroa', 'Mosquera, Cundinamarca', 'Mosquera, Nariño', 'Motavita', 'Murillo', 'Murindó', 'Mutatá', 'Mutiscua', 'Muzo',
      'Nariño, Antioquia', 'Nariño, Cundinamarca', 'Nariño, Nariño', 'Nátaga', 'Natagaima', 'Nechí', 'Necoclí', 'Neira', 'Neiva', 'Nemocón', 'Nilo', 'Nimaima', 'Nobsa', 'Nocaima', 'Norcasia', 'Norosí', 'Nóvita', 'Nueva Granada', 'Nuevo Colón', 'Nunchía', 'Nuquí', 'Obando', 'Ocamonte',
      'Ocaña', 'Oiba', 'Oicatá', 'Olaya', 'Olaya Herrera', 'Onzaga', 'Oporapa', 'Orito', 'Orocué', 'Ortega', 'Ospina', 'Otanche', 'Ovejas', 'Pachavita', 'Pacho', 'Pácora', 'Padilla', 'Páez, Cauca', 'Páez, Boyacá', 'Paicol',
      'Pailitas', 'Paime', 'Paipa', 'Pajarito', 'Palermo', 'Palestina, Caldas', 'Palestina, Huila', 'Palmar de Varela', 'Palmar', 'Palmas del Socorro', 'Palmira', 'Palocabildo', 'Pamplona', 'Pamplonita', 'Pandi', 'Panqueba', 'Páramo', 'Paratebueno', 'Pasca',
      'Pasto', 'Patía', 'Pauna', 'Paya', 'Paz de Ariporo', 'Paz del Río', 'Pedraza', 'Pelaya', 'Pensilvania', 'Peque', 'Pereira', 'Pesca', 'Piamonte', 'Piedecuesta', 'Piedras', 'Piendamó', 'Pijao', 'Pijiño del Carmen', 'Pinchote',
      'Pinillos', 'Piojó', 'Pisba', 'Pitalito', 'Pivijay', 'Planadas', 'Planeta Rica', 'Plato', 'Policarpa', 'Polonuevo', 'Ponedera', 'Popayán', 'Pore', 'Potosí', 'Pradera', 'Prado', 'Providencia', 'Providencia y Santa Catalina Islas', 'Pueblo Viejo',
      'Pueblo Bello', 'Pueblo Nuevo', 'Pueblo Rico', 'Pueblorrico', 'Puente Nacional', 'Puerres', 'Puerto Asís', 'Puerto Berrío', 'Puerto Boyacá', 'Puerto Caicedo', 'Puerto Carreño', 'Puerto Colombia', 'Puerto Concordia', 'Puerto Escondido', 'Puerto Gaitán', 'Puerto Guzmán', 'Puerto Leguízamo', 'Puerto Libertador', 'Puerto Lleras',
      'Puerto López', 'Puerto Milán', 'Puerto Nare', 'Puerto Nariño', 'Puerto Parra', 'Puerto Rico, Caquetá', 'Puerto Rico, Meta', 'Puerto Rondón', 'Puerto Salgar', 'Puerto Santander', 'Puerto Tejada', 'Puerto Triunfo', 'Puerto Wilches', 'Pulí', 'Pupiales', 'Puracé', 'Purificación', 'Purísima', 'Quebradanegra',
      'Quetame', 'Quibdó', 'Quimbaya', 'Quinchía', 'Quípama', 'Quipile', 'Ragonvalia', 'Ramiriquí', 'Ráquira', 'Recetor', 'Regidor', 'Remedios', 'Remolino', 'Repelón', 'Restrepo, Meta', 'Restrepo, Valle del Cauca', 'Ricaurte, Cundinamarca', 'Ricaurte, Nariño', 'Río de Oro',
      'Río Iró', 'Río Quito', 'Río Viejo', 'Rioblanco', 'Riofrío', 'Riohacha', 'Rionegro, Antioquia', 'Rionegro, Santander', 'Riosucio, Caldas', 'Riosucio, Chocó', 'Risaralda', 'Rivera', 'Roberto Payán', 'Roldanillo', 'Roncesvalles', 'Rondón', 'Rosas', 'Rovira', 'Sabana de Torres',
      'Sabanas de San Ángel', 'Sabanagrande', 'Sabanalarga, Antioquia', 'Sabanalarga, Atlántico', 'Sabanalarga, Casanare', 'Sabaneta', 'Saboyá', 'Sácama', 'Sáchica', 'Sahagún', 'Saladoblanco', 'Salamina, Caldas', 'Salamina, Magdalena', 'Salazar de Las Palmas', 'Saldaña', 'Salento', 'Salgar', 'Samacá', 'Samaná',
      'Samaniego', 'Sampués', 'San Agustín', 'San Alberto', 'San Andrés, San Andrés y Providencia', 'San Andrés, Santander', 'San Andrés de Cuerquia', 'San Andrés de Sotavento', 'San Antero', 'San Antonio', 'San Antonio de Palmito', 'San Antonio del Tequendama', 'San Benito', 'San Benito Abad', 'San Bernardo, Cundinamarca', 'San Bernardo, Nariño', 'San Bernardo del Viento', 'San Calixto', 'San Carlos, Antioquia',
      'San Carlos, Córdoba', 'San Carlos de Guaroa', 'San Cayetano, Cundinamarca', 'San Cayetano, Norte de Santander', 'San Cristóbal', 'San Diego', 'San Eduardo', 'San Estanislao', 'San Fernando', 'San Francisco, Antioquia', 'San Francisco, Cundinamarca', 'San Francisco, Putumayo', 'San Gil', 'San Jacinto', 'San Jacinto del Cauca', 'San Jerónimo', 'San Joaquín', 'San José', 'San José de Albán',
      'San José de Miranda', 'San José de Pare', 'San José de Uré', 'San José de la Montaña', 'San José del Fragua', 'San José del Guaviare', 'San José del Palmar', 'San Juan de Arama', 'San Juan de Betulia', 'San Juan de Rioseco', 'San Juan de Urabá', 'San Juan del Cesar', 'San Juan Nepomuceno', 'San Juanito', 'San Lorenzo', 'San Luis, Antioquia', 'San Luis, Tolima', 'San Luis de Gaceno', 'San Luis de Palenque',
      'San Marcos', 'San Martín, Cesar', 'San Martín, Meta', 'San Martín de Loba', 'San Mateo', 'San Miguel, Putumayo', 'San Miguel, Santander', 'San Miguel de Sema', 'San Onofre', 'San Pablo, Bolívar', 'San Pablo, Nariño', 'San Pablo de Borbur', 'San Pedro, Sucre', 'San Pedro, Valle del Cauca', 'San Pedro de Cartago', 'San Pedro de Urabá', 'San Pedro de los Milagros', 'San Pelayo', 'San Rafael',
      'San Roque', 'San Sebastián', 'San Sebastián de Buenavista', 'San Vicente', 'San Vicente de Chucurí', 'San Vicente del Caguán', 'San Zenón', 'Sandoná', 'Santa Ana', 'Santa Bárbara, Antioquia', 'Santa Bárbara, Nariño', 'Santa Bárbara, Santander', 'Santa Bárbara de Pinto', 'Santa Catalina', 'Santa Fe de Antioquia', 'Santa Helena del Opón', 'Santa Isabel', 'Santa Lucía', 'Santa María, Boyacá',
      'Santa María, Huila', 'Santa Marta', 'Santa Rosa, Bolívar', 'Santa Rosa, Cauca', 'Santa Rosa de Cabal', 'Santa Rosa de Osos', 'Santa Rosa de Viterbo', 'Santa Rosa del Sur', 'Santa Rosalía', 'Santa Sofía', 'Santacruz', 'Santana', 'Santander de Quilichao', 'Santiago, Norte de Santander', 'Santiago, Putumayo', 'Santo Domingo', 'Santo Domingo de Silos', 'Santo Tomás', 'Santuario', 'Sapuyes', 'Saravena', 'Sardinata', 'Sasaima', 'Sativanorte', 'Sativasur', 'Segovia', 'Sesquilé', 'Sevilla', 'Siachoque', 'Sibaté', 'Sibundoy', 'Silvania',
      'Silvia', 'Simacota', 'Simijaca', 'Simití', 'Sincé', 'Sincelejo', 'Sipí', 'Sitionuevo', 'Soacha', 'Soatá', 'Socha', 'Socotá', 'Sogamoso', 'Solano', 'Soledad', 'Solita', 'Somondoco', 'Sonsón', 'Sopetrán', 'Soplaviento',
      'Sopó', 'Sora', 'Soracá', 'Sotaquirá', 'Sotará', 'Suaita', 'Suán', 'Suárez, Cauca', 'Suárez, Tolima', 'Suaza', 'Subachoque', 'Sucre, Cauca', 'Sucre, Santander', 'Sucre, Sucre', 'Suesca', 'Supatá', 'Supía', 'Suratá', 'Susa', 'Susacón', 'Sutamarchán', 'Sutatausa', 'Sutatenza',
      'Tabio', 'Tadó', 'Talaigua Nuevo', 'Tamalameque', 'Támara', 'Tame', 'Támesis', 'Taminango', 'Tangua', 'Taraira', 'Tarazá', 'Tarquí', 'Tarso', 'Tasco', 'Tauramena', 'Tausa', 'Tello', 'Tena', 'Tenerife',
      'Tenjo', 'Tenza', 'Teorama', 'Teruel', 'Tesalia', 'Tibacuy', 'Tibaná', 'Tibasosa', 'Tibirita', 'Tibú', 'Tierralta', 'Timaná', 'Timbío', 'Timbiquí', 'Tinjacá', 'Tipacoque', 'Tiquisio', 'Titiribí', 'Toca',
      'Tocaima', 'Tocancipá', 'Togüí', 'Toledo, Antioquia', 'Toledo, Norte de Santander', 'Tolú', 'Tolú Viejo', 'Tona', 'Tópaga', 'Topaipí', 'Toribío', 'Toro', 'Tota', 'Totoró', 'Trinidad', 'Trujillo', 'Tubará', 'Tuchín', 'Tuluá',
      'Tumaco', 'Tunja', 'Tununguá', 'Túquerres', 'Turbaco', 'Turbaná', 'Turbo', 'Turmequé', 'Tuta', 'Tutazá', 'Ubalá', 'Ubaque', 'Ubaté', 'Ulloa', 'Úmbita', 'Une', 'Unión Panamericana', 'Unguía', 'Uramita',
      'Uribia', 'Urrao', 'Urumita', 'Usiacurí', 'Útica', 'Valdivia', 'Valencia', 'Valle de San José', 'Valle de San Juan', 'Valle del Guamuez', 'Valledupar', 'Valparaíso, Antioquia', 'Valparaíso, Caquetá', 'Vegachí', 'Vélez', 'Venadillo', 'Venecia, Antioquia', 'Venecia, Cundinamarca', 'Ventaquemada',
      'Vergara', 'Versalles', 'Vetas', 'Vianí', 'Victoria', 'Vigía del Fuerte', 'Vijes', 'Villa Caro', 'Villa de Leyva', 'Villa del Rosario', 'Villa Rica', 'Villagarzón', 'Villagómez', 'Villahermosa', 'Villamaría', 'Villanueva, Bolívar', 'Villanueva, Casanare', 'Villanueva, La Guajira', 'Villanueva, Santander',
      'Villapinzón', 'Villarrica', 'Villavicencio', 'Villavieja', 'Villeta', 'Viotá', 'Viracachá', 'Vista Hermosa', 'Viterbo', 'Yacopí', 'Yacuanquer', 'Yaguará', 'Yalí', 'Yarumal', 'Yolombó', 'Yondó', 'Yopal', 'Yotoco', 'Yumbo',
      'Zambrano', 'Zapatoca', 'Zapayán', 'Zaragoza', 'Zarzal', 'Zetaquirá', 'Zipacón', 'Zipaquirá', 'Zona Bananera',
    ];

    const filteredMunicipalities = computed(() => {
      const query = normalizeText(form.municipality || '').trim();
      if (!query) {
        return municipalities;
      }
      return municipalities.filter((municipality) => normalizeText(municipality).includes(query));
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

    const openDepartmentOptions = () => {
      if (!showDepartmentField.value) {
        return;
      }
      showDepartmentOptions.value = true;
    };

    const closeDepartmentOptions = () => {
      showDepartmentOptions.value = false;
    };

    const onDepartmentInput = () => {
      validateField('department');
      openDepartmentOptions();
    };

    const selectDepartment = (department) => {
      form.department = department;
      errors.department = '';
      closeDepartmentOptions();
    };

    const openMunicipalityOptions = () => {
      if (!showMunicipalityField.value) {
        return;
      }
      showMunicipalityOptions.value = true;
    };

    const closeMunicipalityOptions = () => {
      showMunicipalityOptions.value = false;
    };

    const onMunicipalityInput = () => {
      validateField('municipality');
      openMunicipalityOptions();
    };

    const selectMunicipality = (municipality) => {
      form.municipality = municipality;
      errors.municipality = '';
      closeMunicipalityOptions();
    };

    const onDocumentClick = (event) => {
      const clickedCountry = countryDropdownRef.value?.contains(event.target);
      const clickedDepartment = departmentDropdownRef.value?.contains(event.target);
      const clickedMunicipality = municipalityDropdownRef.value?.contains(event.target);
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

    watch(
      () => form.banderaType,
      (value) => {
        if (value !== 'De un país') {
          form.country = '';
          errors.country = '';
          closeCountryOptions();
        }
        if (value !== 'De un departamento de Colombia') {
          form.department = '';
          errors.department = '';
          closeDepartmentOptions();
        }
        if (value !== 'De una ciudad o Municipio de Colombia') {
          form.municipality = '';
          errors.municipality = '';
          closeMunicipalityOptions();
        }
        if (value !== 'Otra') {
          form.otherFlagType = '';
          errors.otherFlagType = '';
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
        department: '',
        municipality: '',
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
        otherFlagType: '',
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
      departments,
      filteredDepartments,
      municipalities,
      filteredMunicipalities,
      showCountryField,
      showDepartmentField,
      showMunicipalityField,
      showOtherFlagTypeField,
      showCountryOptions,
      showDepartmentOptions,
      showMunicipalityOptions,
      formRef,
      successCanvasRef,
      countryDropdownRef,
      departmentDropdownRef,
      municipalityDropdownRef,
      submitStatus,
      isSubmitting,
      validateField,
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
        <input type="hidden" name="departamento_bandera" :value="form.department" />
        <input type="hidden" name="municipio_bandera" :value="form.municipality" />
        <input type="hidden" name="cantidad" :value="form.quantity" />
        <input type="hidden" name="ancho_cm" :value="form.widthCm" />
        <input type="hidden" name="alto_cm" :value="form.heightCm" />
        <input type="hidden" name="material" :value="form.material" />
        <input type="hidden" name="asta_y_base" :value="form.needsPoleBase" />
        <input type="hidden" name="ciudad_entrega" :value="form.city" />
        <input type="hidden" name="bandera_personalizada" :value="form.customLogo" />
        <input type="hidden" name="nombre" :value="form.name" />
        <input type="hidden" name="email" :value="form.email" />
        <input type="hidden" name="otra_bandera" :value="form.otherFlagType" />
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

          <label v-if="showDepartmentField">
            {{ t.department }}
            <div ref="departmentDropdownRef" class="country-autocomplete">
              <input
                type="text"
                name="departamento_bandera"
                v-model="form.department"
                :placeholder="t.departmentPlaceholder"
                autocomplete="off"
                @focus="openDepartmentOptions"
                @input="onDepartmentInput"
                @blur="validateField('department')"
                required
              />
              <ul v-if="showDepartmentOptions" class="country-options" role="listbox" aria-label="Lista de departamentos">
                <li
                  v-for="department in filteredDepartments"
                  :key="department"
                  class="country-option"
                  role="option"
                  @mousedown.prevent="selectDepartment(department)"
                >
                  {{ department }}
                </li>
                <li v-if="!filteredDepartments.length" class="country-option-empty">
                  No se encontraron departamentos.
                </li>
              </ul>
            </div>
            <small v-if="errors.department" class="field-error">{{ errors.department }}</small>
          </label>

          <label v-if="showMunicipalityField">
            {{ t.municipality }}
            <div ref="municipalityDropdownRef" class="country-autocomplete">
              <input
                type="text"
                name="municipio_bandera"
                v-model="form.municipality"
                :placeholder="t.municipalityPlaceholder"
                autocomplete="off"
                @focus="openMunicipalityOptions"
                @input="onMunicipalityInput"
                @blur="validateField('municipality')"
                required
              />
              <ul v-if="showMunicipalityOptions" class="country-options" role="listbox" aria-label="Lista de ciudades y municipios">
                <li
                  v-for="municipality in filteredMunicipalities"
                  :key="municipality"
                  class="country-option"
                  role="option"
                  @mousedown.prevent="selectMunicipality(municipality)"
                >
                  {{ municipality }}
                </li>
                <li v-if="!filteredMunicipalities.length" class="country-option-empty">
                  No se encontraron ciudades o municipios.
                </li>
              </ul>
            </div>
            <small v-if="errors.municipality" class="field-error">{{ errors.municipality }}</small>
          </label>

          <label v-if="showOtherFlagTypeField">
            {{ t.otherFlagType }}
            <input
              type="text"
              name="otra_bandera"
              v-model="form.otherFlagType"
              :placeholder="t.otherFlagTypePlaceholder"
              @input="validateField('otherFlagType')"
              required
            />
            <small v-if="errors.otherFlagType" class="field-error">{{ errors.otherFlagType }}</small>
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
              <li v-if="showDepartmentField"><strong>{{ t.department }}:</strong> {{ form.department }}</li>
              <li v-if="showOtherFlagTypeField"><strong>{{ t.otherFlagType }}:</strong> {{ form.otherFlagType }}</li>
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