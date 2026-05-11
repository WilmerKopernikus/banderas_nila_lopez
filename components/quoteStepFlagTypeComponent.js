// components/quoteStepFlagTypeComponent.js
// Renders Step 1 of the quote form: flag type selection, dimensions, and preview.
// Requires js/quoteFlagData.js to be loaded first (provides QUOTE_FLAG_* globals).
const QuoteStepFlagTypeComponent = {
  props: ['items', 'errors', 't', 'validateItemField', 'clearItemError', 'addItem', 'removeItem', 'openItemIdOverride'],
  setup(props) {
    const { ref, computed, watch, nextTick, onMounted, onUnmounted, onBeforeUnmount } = Vue;

    // Dropdown UI state
    const showCountryOptions = ref(false);
    const showDepartmentOptions = ref(false);
    const showMunicipalityOptions = ref(false);
    const countrySearch = ref('');
    const departmentSearch = ref('');
    const municipalitySearch = ref('');
    const countryDropdownRef = ref(null);
    const departmentDropdownRef = ref(null);
    const municipalityDropdownRef = ref(null);

    // Error key helper (mirrors parent's version)
    const getItemErrorKey = (index, field) => `item_${index}_${field}`;

    // Flag type checkers
    const isCountryType = (item) => item.banderaType === 'De un país';
    const isDepartmentType = (item) => item.banderaType === 'De un departamento de Colombia';
    const isMunicipalityType = (item) => item.banderaType === 'De una ciudad o Municipio de Colombia';
    const isOtherType = (item) => item.banderaType === 'Otra';
    const isColombiaType = (item) => item.banderaType === 'De Colombia';
    const hasOfficialRatio = (item) => item.flagRatio === 'oficial'
      && (isColombiaType(item) || isCountryType(item) || isDepartmentType(item) || isMunicipalityType(item));

    const itemNaturalRatio = (item) => {
      if (isColombiaType(item)) return 3 / 2;
      return item.flagNaturalRatio || null;
    };

    // Flag image sources
    const departmentFlagSrc = (item) => {
      if (!item.department) return '';
      return `images/banderas/departamentos_colombia/${item.department}.svg#svgView(preserveAspectRatio(none))`;
    };

    const municipalityFlagSrc = (item) => {
      if (!item.municipality) return '';
      return `images/banderas/municipios_colombia/${item.municipality}.svg#svgView(preserveAspectRatio(none))`;
    };

    const countryFlagSrc = (item) => {
      if (!item.country) return '';
      return `images/banderas/banderas_del_mundo/${item.country}.svg#svgView(preserveAspectRatio(none))`;
    };

    // Preview helpers
    const itemAspectRatio = (item) => {
      if (hasOfficialRatio(item)) {
        const r = itemNaturalRatio(item);
        if (r) return `${r} / 1`;
      }
      const width = Number(item.widthCm);
      const height = Number(item.heightCm);
      if (!width || !height || width <= 0 || height <= 0) return '3 / 2';
      return `${width} / ${height}`;
    };

    const itemFlagSrc = (item) => {
      if (isColombiaType(item)) return 'images/banderas/Flag_of_Colombia.svg';
      if (isDepartmentType(item) && item.department) return departmentFlagSrc(item);
      if (isMunicipalityType(item) && item.municipality) return municipalityFlagSrc(item);
      if (isCountryType(item) && item.country) return countryFlagSrc(item);
      return null;
    };

    const itemPreviewStyle = (item) => {
      return { aspectRatio: itemAspectRatio(item) };
    };

    // Dimension / ratio handlers
    const onWidthInput = (item, index) => {
      if (hasOfficialRatio(item) && item.widthCm) {
        const w = Number(item.widthCm);
        const r = itemNaturalRatio(item);
        if (w > 0 && r) item.heightCm = String(Math.round(w / r));
      }
      props.validateItemField(item, index, 'widthCm');
      props.validateItemField(item, index, 'heightCm');
    };

    const onHeightInput = (item, index) => {
      if (hasOfficialRatio(item) && item.heightCm) {
        const h = Number(item.heightCm);
        const r = itemNaturalRatio(item);
        if (h > 0 && r) item.widthCm = String(Math.round(h * r));
      }
      props.validateItemField(item, index, 'heightCm');
      props.validateItemField(item, index, 'widthCm');
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
      item.flagNaturalRatio = naturalWidth / naturalHeight;
      if (item.flagRatio === 'oficial') {
        item.heightCm = '100';
        item.widthCm = String(Math.round(100 * naturalWidth / naturalHeight));
      }
    };

    // Data and filter helpers (using shared globals from js/quoteFlagData.js)
    const normalizeText = (value) => value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const filterCountries = (queryValue = '') => {
      const query = normalizeText(queryValue).trim();
      if (!query) return QUOTE_FLAG_COUNTRIES;
      return QUOTE_FLAG_COUNTRIES.filter((c) => normalizeText(c).includes(query));
    };

    const filterDepartments = (queryValue = '') => {
      const query = normalizeText(queryValue).trim();
      if (!query) return QUOTE_FLAG_DEPARTMENTS;
      return QUOTE_FLAG_DEPARTMENTS.filter((d) => normalizeText(d).includes(query));
    };

    const filterMunicipalities = (queryValue = '') => {
      const query = normalizeText(queryValue).trim();
      if (!query) return QUOTE_FLAG_MUNICIPALITIES;
      return QUOTE_FLAG_MUNICIPALITIES.filter((m) => normalizeText(m).includes(query));
    };

    // Country dropdown
    const openCountryOptions = (item) => {
      if (!isCountryType(item)) return;
      countrySearch.value = item.country;
      showCountryOptions.value = true;
    };
    const closeCountryOptions = () => { showCountryOptions.value = false; };
    const onCountryInput = (item, index) => {
      countrySearch.value = item.country;
      props.validateItemField(item, index, 'country');
      openCountryOptions(item);
    };
    const selectCountry = (item, index, country) => {
      item.country = country;
      item.flagRatio = 'oficial';
      item.flagNaturalRatio = null;
      item.widthCm = '';
      item.heightCm = '';
      countrySearch.value = '';
      props.clearItemError(index, 'country');
      closeCountryOptions();
    };

    // Department dropdown
    const openDepartmentOptions = (item) => {
      if (!isDepartmentType(item)) return;
      departmentSearch.value = item.department;
      showDepartmentOptions.value = true;
    };
    const closeDepartmentOptions = () => { showDepartmentOptions.value = false; };
    const onDepartmentInput = (item, index) => {
      departmentSearch.value = item.department;
      props.validateItemField(item, index, 'department');
      openDepartmentOptions(item);
    };
    const selectDepartment = (item, index, department) => {
      item.department = department;
      item.flagRatio = 'oficial';
      item.flagNaturalRatio = null;
      item.widthCm = '';
      item.heightCm = '';
      departmentSearch.value = '';
      props.clearItemError(index, 'department');
      closeDepartmentOptions();
    };

    // Municipality dropdown
    const openMunicipalityOptions = (item) => {
      if (!isMunicipalityType(item)) return;
      municipalitySearch.value = item.municipality;
      showMunicipalityOptions.value = true;
    };
    const closeMunicipalityOptions = () => { showMunicipalityOptions.value = false; };
    const onMunicipalityInput = (item, index) => {
      municipalitySearch.value = item.municipality;
      props.validateItemField(item, index, 'municipality');
      openMunicipalityOptions(item);
    };
    const selectMunicipality = (item, index, municipality) => {
      item.municipality = municipality;
      item.flagRatio = 'oficial';
      item.flagNaturalRatio = null;
      item.widthCm = '';
      item.heightCm = '';
      municipalitySearch.value = '';
      props.clearItemError(index, 'municipality');
      closeMunicipalityOptions();
    };

    // Reset fields on banner type change
    const onItemBanderaTypeChange = (item, index) => {
      item.flagRatio = 'oficial';
      item.flagNaturalRatio = null;
      item.widthCm = '';
      item.heightCm = '';
      if (!isCountryType(item)) {
        item.country = '';
        props.clearItemError(index, 'country');
        closeCountryOptions();
      }
      if (!isDepartmentType(item)) {
        item.department = '';
        props.clearItemError(index, 'department');
        closeDepartmentOptions();
      }
      if (!isMunicipalityType(item)) {
        item.municipality = '';
        props.clearItemError(index, 'municipality');
        closeMunicipalityOptions();
      }
      if (!isOtherType(item)) {
        item.otherFlagType = '';
        props.clearItemError(index, 'otherFlagType');
      }
      props.validateItemField(item, index, 'banderaType');
    };

    // Close dropdowns when clicking outside
    const onDocumentClick = (event) => {
      const containsTarget = (refValue) => {
        if (!refValue) return false;
        if (Array.isArray(refValue)) {
          return refValue.some((el) => el?.contains?.(event.target));
        }
        return refValue.contains?.(event.target);
      };
      if (!containsTarget(countryDropdownRef.value)) closeCountryOptions();
      if (!containsTarget(departmentDropdownRef.value)) closeDepartmentOptions();
      if (!containsTarget(municipalityDropdownRef.value)) closeMunicipalityOptions();
    };

    onMounted(() => { document.addEventListener('click', onDocumentClick); });
    onUnmounted(() => { document.removeEventListener('click', onDocumentClick); });

    // Accordion state — only one item open at a time; first item open by default
    const openItemId = ref(props.items.length > 0 ? props.items[0].id : null);

    const toggleItem = (id) => {
      openItemId.value = openItemId.value === id ? null : id;
    };

    const itemSummaryLabel = (item) => {
      if (!item.banderaType) return '';
      let label = item.banderaType;
      if (item.country) label += ` · ${item.country}`;
      else if (item.department) label += ` · ${item.department}`;
      else if (item.municipality) label += ` · ${item.municipality}`;
      return label;
    };

    // When parent forces an item open (e.g. after failed validation), open it and scroll to it
    watch(() => props.openItemIdOverride, (id) => {
      if (!id) return;
      openItemId.value = id;
      nextTick(() => {
        const cards = document.querySelectorAll('.quote-item-card');
        const index = props.items.findIndex((item) => item.id === id);
        if (cards[index]) cards[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Auto-open the newest item; if the open item is removed, fall back to the last one
    watch(() => props.items.length, (newLen, oldLen) => {
      if (newLen > oldLen) {
        openItemId.value = props.items[props.items.length - 1].id;
      } else if (newLen < oldLen) {
        const stillOpen = props.items.some((item) => item.id === openItemId.value);
        if (!stillOpen) {
          openItemId.value = props.items.length > 0 ? props.items[props.items.length - 1].id : null;
        }
      }
    });

    // ── Three.js waving-flag preview ──────────────────────────────────────────
    const _flagCanvasRefs = {};
    const setFlagCanvasRef = (el, id) => {
      if (el) _flagCanvasRefs[id] = el;
      else delete _flagCanvasRefs[id];
    };

    let _renderer = null;
    let _scene = null;
    let _camera = null;
    let _mesh = null;
    let _clock = null;
    let _animId = null;
    let _resizeObserver = null;

    const teardownThree = () => {
      if (_animId !== null) { cancelAnimationFrame(_animId); _animId = null; }
      if (_resizeObserver) { _resizeObserver.disconnect(); _resizeObserver = null; }
      if (_mesh) {
        _mesh.geometry.dispose();
        if (_mesh.material.map) _mesh.material.map.dispose();
        _mesh.material.dispose();
        _mesh = null;
      }
      if (_renderer) { _renderer.dispose(); _renderer = null; }
      _scene = null;
      _camera = null;
      _clock = null;
    };

    let _shaderMaterial = null;  // Reference to shader material for uniform updates

    const _animate = () => {
      if (!_renderer || !_scene || !_camera) return;
      _animId = requestAnimationFrame(_animate);
      if (_mesh) {
        const t = _clock.getElapsedTime();
        const pos = _mesh.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i); // -1 (pole/left) to 1 (free/right)
          const xNorm = (x + 1) / 2; // 0..1
          pos.setZ(i, 0.12 * xNorm * Math.sin(x * 3.5 + t * 3.0));
        }
        pos.needsUpdate = true;
        
        // Update shader time uniform for wave lighting
        if (_shaderMaterial && _shaderMaterial.uniforms.time) {
          _shaderMaterial.uniforms.time.value = t;
        }
      }
      _renderer.render(_scene, _camera);
    };

    const initThreeForItem = (item) => {
      if (!window.THREE) return;
      const src = itemFlagSrc(item);
      if (!src) return;
      const canvas = _flagCanvasRefs[item.id];
      if (!canvas) return;

      teardownThree();

      // Size the renderer to the canvas itself, not its container
      const rect = canvas.getBoundingClientRect();
      const W = Math.max(rect.width, 60);
      const H = Math.max(rect.height, 40);

      _renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      _renderer.setSize(W, H, false);
      _renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      _scene = new THREE.Scene();
      _camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
      _camera.position.z = 1.85;
      _clock = new THREE.Clock();

      const fitMeshToCamera = () => {
        if (!_mesh || !_camera) return;
        const vH = 2 * _camera.position.z * Math.tan(THREE.MathUtils.degToRad(_camera.fov / 2));
        const vW = vH * _camera.aspect;
        // 0.90: less padding, flag fills more space
        _mesh.scale.set(vW / 2 * 0.90, vH / 2 * 0.90, 1);
        // Shift left by 40% of the equal padding so the pole side has less gap
        _mesh.position.x = -(vW / 2) * 0.18 * 0.2;
      };

      const geom = new THREE.PlaneGeometry(2, 2, 32, 20);
      const cleanSrc = src.replace(/#.*$/, '');
      const loader = new THREE.TextureLoader();

      // Shader to boost saturation and add wave-based lighting
      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;

      const fragmentShader = `
        uniform sampler2D map;
        uniform float saturation;
        uniform float time;
        varying vec2 vUv;

        void main() {
          vec4 texColor = texture2D(map, vUv);
          vec3 gray = vec3(dot(texColor.rgb, vec3(0.299, 0.587, 0.114)));
          vec3 result = mix(gray, texColor.rgb, saturation);
          
          // Wave-based lighting: brighten where the wave is moving left
          // Use X coordinate mapped to -1..1, simulate the same sine wave as vertex displacement
          float x = vUv.x * 2.0 - 1.0;  // Map 0..1 to -1..1
          float xNorm = (x + 1.0) / 2.0;  // Back to 0..1
          float waveHeight = 0.35 * xNorm * sin(x * 3.5 + time * 3.0);
          float brightness = 0.5 + 0.5 * (waveHeight + 0.35) / 0.7;  // Map wave to 0..1 brightness
          brightness = clamp(brightness, 0.5, 1.5);  // Keep in reasonable range
          
          result *= brightness;
          gl_FragColor = vec4(result, texColor.a);
        }
      `;

      const onTextureLoad = (texture) => {
        if (texture.image && !item.flagNaturalRatio) {
          const iw = texture.image.naturalWidth || texture.image.width;
          const ih = texture.image.naturalHeight || texture.image.height;
          if (iw && ih) {
            item.flagNaturalRatio = iw / ih;
            if (item.flagRatio === 'oficial' && (!item.widthCm || !item.heightCm)) {
              item.heightCm = '100';
              item.widthCm = String(Math.round(100 * iw / ih));
            }
          }
        }
        const mat = new THREE.ShaderMaterial({
          uniforms: {
            map: { value: texture },
            saturation: { value: 1.4 },
            time: { value: 0 },
          },
          vertexShader,
          fragmentShader,
          side: THREE.DoubleSide,
        });
        _mesh = new THREE.Mesh(geom, mat);
        _shaderMaterial = mat;  // Store reference for time uniform updates
        _scene.add(_mesh);
        fitMeshToCamera();
        _animate();
      };

      const onTextureError = () => {
        const mat = new THREE.MeshBasicMaterial({ color: 0xcccccc });
        _mesh = new THREE.Mesh(geom, mat);
        _scene.add(_mesh);
        fitMeshToCamera();
        _animate();
      };

      loader.load(cleanSrc, onTextureLoad, undefined, onTextureError);

      _resizeObserver = new ResizeObserver(() => {
        if (!_renderer || !_camera) return;
        const r2 = canvas.getBoundingClientRect();
        const nW = Math.max(r2.width, 60);
        const nH = Math.max(r2.height, 40);
        _renderer.setSize(nW, nH, false);
        _camera.aspect = nW / nH;
        _camera.updateProjectionMatrix();
        fitMeshToCamera();
      });
      _resizeObserver.observe(canvas);
    };

    const openItemFlagSrc = computed(() => {
      const item = props.items.find(i => i.id === openItemId.value);
      return item ? itemFlagSrc(item) : null;
    });

    watch([openItemId, openItemFlagSrc], async ([newId, newSrc]) => {
      teardownThree();
      if (!newId || !newSrc) return;
      await nextTick();
      const item = props.items.find(i => i.id === newId);
      if (item) initThreeForItem(item);
    });

    onBeforeUnmount(() => teardownThree());
    // ─────────────────────────────────────────────────────────────────────────

    return {
      getItemErrorKey,
      isCountryType,
      isDepartmentType,
      isMunicipalityType,
      isOtherType,
      isColombiaType,
      hasOfficialRatio,
      departmentFlagSrc,
      municipalityFlagSrc,
      countryFlagSrc,
      itemPreviewStyle,
      onFlagImageLoad,
      onWidthInput,
      onHeightInput,
      onFlagRatioChange,
      filterCountries,
      filterDepartments,
      filterMunicipalities,
      showCountryOptions,
      showDepartmentOptions,
      showMunicipalityOptions,
      countrySearch,
      departmentSearch,
      municipalitySearch,
      countryDropdownRef,
      departmentDropdownRef,
      municipalityDropdownRef,
      openCountryOptions,
      onCountryInput,
      selectCountry,
      openDepartmentOptions,
      onDepartmentInput,
      selectDepartment,
      openMunicipalityOptions,
      onMunicipalityInput,
      selectMunicipality,
      onItemBanderaTypeChange,
      openItemId,
      toggleItem,
      itemSummaryLabel,
      itemFlagSrc,
      setFlagCanvasRef,
    };
  },
  template: `
    <div style="display: contents;">
      <div v-for="(item, index) in items" :key="item.id" class="quote-item-card" :class="{ 'quote-item-open': openItemId === item.id }">
        <button type="button" class="quote-item-header" @click="toggleItem(item.id)" :aria-expanded="String(openItemId === item.id)">
          <span class="quote-item-header-title">
            {{ t.itemLabel }} #{{ index + 1 }}
            <span v-if="itemSummaryLabel(item)" class="quote-item-summary">— {{ itemSummaryLabel(item) }}</span>
          </span>
          <span class="quote-item-chevron" :class="{ open: openItemId === item.id }">&#9662;</span>
        </button>
        <div v-show="openItemId === item.id" class="quote-item-body">
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
          <div class="flag-preview" :style="itemPreviewStyle(item)">
            <canvas
              v-if="itemFlagSrc(item)"
              :ref="el => setFlagCanvasRef(el, item.id)"
              class="flag-canvas-3d"
            ></canvas>
          </div>
        </div>

          <button v-if="items.length > 1" type="button" class="btn-secondary quote-remove-item" @click="removeItem(index)">{{ t.removeFlag }}</button>
        </div>
      </div>

      <button type="button" class="btn-primary quote-add-item" @click="addItem">{{ t.addFlag }}</button>
    </div>
  `,
};
