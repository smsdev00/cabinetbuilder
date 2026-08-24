<template>
    <div class="input-card card">
        <div class="card-header">
            Dimensiones del Mueble
        </div>
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-6">
                    <label for="largo" class="form-label">Largo (cm)</label>
                    <input
                        type="number"
                        id="largo"
                        class="form-control"
                        :class="largoValidation.validationClass.value"
                        v-model.number="largo"
                        :min="VALIDATION_LIMITS.MIN_DIMENSION"
                        :max="VALIDATION_LIMITS.MAX_DIMENSION"
                        step="0.1"
                    >
                    <div v-if="largoValidation.hasError.value" class="invalid-feedback">
                        {{ largoValidation.errorMessage.value }}
                    </div>
                    <div v-else-if="largoValidation.hasWarning.value" class="warning-feedback">
                        {{ largoValidation.warningMessage.value }}
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="ancho" class="form-label">Ancho/Profundidad (cm)</label>
                    <input
                        type="number"
                        id="ancho"
                        class="form-control"
                        :class="anchoValidation.validationClass.value"
                        v-model.number="ancho"
                        :min="VALIDATION_LIMITS.MIN_DIMENSION"
                        :max="VALIDATION_LIMITS.MAX_DIMENSION"
                        step="0.1"
                    >
                    <div v-if="anchoValidation.hasError.value" class="invalid-feedback">
                        {{ anchoValidation.errorMessage.value }}
                    </div>
                    <div v-else-if="anchoValidation.hasWarning.value" class="warning-feedback">
                        {{ anchoValidation.warningMessage.value }}
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="alto" class="form-label">Alto (cm)</label>
                    <input
                        type="number"
                        id="alto"
                        class="form-control"
                        :class="altoValidation.validationClass.value"
                        v-model.number="alto"
                        :min="VALIDATION_LIMITS.MIN_DIMENSION"
                        :max="VALIDATION_LIMITS.MAX_DIMENSION"
                        step="0.1"
                    >
                    <div v-if="altoValidation.hasError.value" class="invalid-feedback">
                        {{ altoValidation.errorMessage.value }}
                    </div>
                    <div v-else-if="altoValidation.hasWarning.value" class="warning-feedback">
                        {{ altoValidation.warningMessage.value }}
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="espesor" class="form-label">Espesor Material (mm)</label>
                    <select id="espesor" class="form-select" v-model.number="espesor">
                        <option :value="5.5">5.5mm (Fino)</option>
                        <option :value="9">9mm (Estandar)</option>
                        <option :value="12">12mm (Medio)</option>
                        <option :value="15">15mm (Grueso)</option>
                        <option :value="18">18mm (Extra Grueso)</option>
                    </select>
                </div>
                <div class="col-12">
                    <label for="luzPuertas" class="form-label">Separacion entre Puertas (cm)</label>
                    <input
                        type="number"
                        id="luzPuertas"
                        class="form-control"
                        :class="luzValidation.validationClass.value"
                        v-model.number="luzPuertas"
                        min="0"
                        :max="VALIDATION_LIMITS.MAX_LUZ_PUERTAS"
                        step="0.1"
                        aria-describedby="luzPuertas-help"
                    >
                    <small id="luzPuertas-help" class="text-muted">Espacio entre las dos puertas frontales</small>
                    <div v-if="luzValidation.hasError.value" class="invalid-feedback">
                        {{ luzValidation.errorMessage.value }}
                    </div>
                    <div v-else-if="luzValidation.hasWarning.value" class="warning-feedback">
                        {{ luzValidation.warningMessage.value }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { VALIDATION_LIMITS } from '../config/constants'
import { useValidation } from '../composables/useValidation'

const largo = defineModel('largo', { type: Number })
const ancho = defineModel('ancho', { type: Number })
const alto = defineModel('alto', { type: Number })
const espesor = defineModel('espesor', { type: Number })
const luzPuertas = defineModel('luzPuertas', { type: Number })

// Validaciones
const largoValidation = useValidation(largo, {
    type: 'dimension',
    min: VALIDATION_LIMITS.MIN_DIMENSION,
    max: VALIDATION_LIMITS.MAX_DIMENSION,
    name: 'Largo'
})

const anchoValidation = useValidation(ancho, {
    type: 'dimension',
    min: VALIDATION_LIMITS.MIN_DIMENSION,
    max: VALIDATION_LIMITS.MAX_DIMENSION,
    name: 'Ancho'
})

const altoValidation = useValidation(alto, {
    type: 'dimension',
    min: VALIDATION_LIMITS.MIN_DIMENSION,
    max: VALIDATION_LIMITS.MAX_DIMENSION,
    name: 'Alto'
})

const luzValidation = useValidation(luzPuertas, {
    type: 'range',
    min: 0,
    max: VALIDATION_LIMITS.MAX_LUZ_PUERTAS,
    name: 'Separacion',
    allowZero: true
})
</script>

<style scoped>
.is-warning {
    border-color: #ffc107;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23ffc107'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23ffc107' stroke='none'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right calc(0.375em + 0.1875rem) center;
    background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
    padding-right: calc(1.5em + 0.75rem);
}

.warning-feedback {
    display: block;
    width: 100%;
    margin-top: 0.25rem;
    font-size: 0.875em;
    color: #997404;
}

.invalid-feedback {
    display: block;
}
</style>
