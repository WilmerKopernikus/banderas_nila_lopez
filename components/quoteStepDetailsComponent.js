// components/quoteStepDetailsComponent.js
// Renders Step 2 of the quote form: material, pole/base, delivery city, and custom logo.
// Receives the reactive `form` object directly — mutations propagate to the parent automatically.
const QuoteStepDetailsComponent = {
  props: ['form', 'errors', 't', 'validateField', 'onFileChange'],
  template: `
    <div style="display: contents;">
      <div class="quote-item-card">
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
      </div>
    </div>
  `,
};
