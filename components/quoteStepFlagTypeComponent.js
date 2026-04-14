// components/quoteStepFlagTypeComponent.js
// Renders Step 1 of the quote form: flag type selection, dimensions, and preview.
// Requires js/quoteFlagData.js to be loaded first (provides QUOTE_FLAG_* globals).
const QuoteStepFlagTypeComponent = {
  props: ['items', 'errors', 't', 'validateItemField', 'clearItemError', 'addItem', 'removeItem'],
  setup(props) {
    const { ref, onMounted, onUnmounted } = Vue;

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
    };
  },
  template: `
    <div style="display: contents;">
      <div v-for="(item, index) in items" :key="item.id" class="quote-item-card">
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
          <div class="flag-preview" :style="itemPreviewStyle(item)">
            <img v-if="isColombiaType(item)" src="images/banderas/Flag_of_Colombia.svg#svgView(preserveAspectRatio(none))" alt="" class="flag-display" :ref="el => { if (el && el.complete && el.naturalWidth) onFlagImageLoad({ target: el }, item); }" @load="onFlagImageLoad($event, item)" />
            <img v-else-if="isDepartmentType(item) && item.department" :src="departmentFlagSrc(item)" alt="" class="flag-display" :ref="el => { if (el && el.complete && el.naturalWidth) onFlagImageLoad({ target: el }, item); }" @error="$event.target.style.display='none'" @load="onFlagImageLoad($event, item)" />
            <img v-else-if="isMunicipalityType(item) && item.municipality" :src="municipalityFlagSrc(item)" alt="" class="flag-display" :ref="el => { if (el && el.complete && el.naturalWidth) onFlagImageLoad({ target: el }, item); }" @error="$event.target.style.display='none'" @load="onFlagImageLoad($event, item)" />
            <img v-else-if="isCountryType(item) && item.country" :src="countryFlagSrc(item)" alt="" class="flag-display" :ref="el => { if (el && el.complete && el.naturalWidth) onFlagImageLoad({ target: el }, item); }" @error="$event.target.style.display='none'" @load="onFlagImageLoad($event, item)" />
          </div>
        </div>

        <button v-if="items.length > 1" type="button" class="btn-secondary quote-remove-item" @click="removeItem(index)">{{ t.removeFlag }}</button>
      </div>

      <button type="button" class="btn-primary quote-add-item" @click="addItem">{{ t.addFlag }}</button>
    </div>
  `,
};
