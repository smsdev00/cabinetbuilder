<template>
    <div class="input-card card">
        <div class="card-header">
            Datos de la Placa MDF
        </div>
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-6">
                    <label for="sheetHeight" class="form-label">Alto Placa (cm)</label>
                    <input
                        type="number"
                        id="sheetHeight"
                        class="form-control"
                        :class="sheetHeightValidation.validationClass.value"
                        v-model.number="sheetHeight"
                        :min="VALIDATION_LIMITS.MIN_DIMENSION"
                        :max="VALIDATION_LIMITS.MAX_SHEET_DIMENSION"
                    >
                    <div v-if="sheetHeightValidation.hasError.value" class="invalid-feedback">
                        {{ sheetHeightValidation.errorMessage.value }}
                    </div>
                    <div v-else-if="sheetHeightValidation.hasWarning.value" class="warning-feedback">
                        {{ sheetHeightValidation.warningMessage.value }}
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="sheetWidth" class="form-label">Ancho Placa (cm)</label>
                    <input
                        type="number"
                        id="sheetWidth"
                        class="form-control"
                        :class="sheetWidthValidation.validationClass.value"
                        v-model.number="sheetWidth"
                        :min="VALIDATION_LIMITS.MIN_DIMENSION"
                        :max="VALIDATION_LIMITS.MAX_SHEET_DIMENSION"
                    >
                    <div v-if="sheetWidthValidation.hasError.value" class="invalid-feedback">
                        {{ sheetWidthValidation.errorMessage.value }}
                    </div>
                    <div v-else-if="sheetWidthValidation.hasWarning.value" class="warning-feedback">
                        {{ sheetWidthValidation.warningMessage.value }}
                    </div>
                </div>
                <div class="col-12">
                    <label for="boardPrice" class="form-label">Precio por Placa ($)</label>
                    <input
                        type="number"
                        id="boardPrice"
                        class="form-control"
                        v-model.number="boardPrice"
                        min="0"
                        :max="VALIDATION_LIMITS.MAX_PRICE"
                        step="any"
                    >
                    <div v-if="priceValidation.hasError.value" class="invalid-feedback">
                        {{ priceValidation.errorMessage.value }}
                    </div>
                </div>
                <div class="col-12">
                    <label for="kerfWidth" class="form-label">Ancho de Corte/Kerf (mm)</label>
                    <input
                        type="number"
                        id="kerfWidth"
                        class="form-control"
                        v-model.number="kerfWidth"
                        min="0"
                        :max="VALIDATION_LIMITS.MAX_KERF"
                        step="0.1"
                        aria-describedby="kerfWidth-help"
                    >
                    <small id="kerfWidth-help" class="text-muted">Perdida de material por corte de sierra</small>
                    <div v-if="kerfValidation.hasError.value" class="invalid-feedback">
                        {{ kerfValidation.errorMessage.value }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { VALIDATION_LIMITS } from '../config/constants'
import { useValidation } from '../composables/useValidation'

const sheetHeight = defineModel('sheetHeight', { type: Number })
const sheetWidth = defineModel('sheetWidth', { type: Number })
const boardPrice = defineModel('boardPrice', { type: Number })
const kerfWidth = defineModel('kerfWidth', { type: Number })

// Validaciones
const sheetHeightValidation = useValidation(sheetHeight, {
    type: 'dimension',
    min: VALIDATION_LIMITS.MIN_DIMENSION,
    max: VALIDATION_LIMITS.MAX_SHEET_DIMENSION,
    name: 'Alto de placa'
})

const sheetWidthValidation = useValidation(sheetWidth, {
    type: 'dimension',
    min: VALIDATION_LIMITS.MIN_DIMENSION,
    max: VALIDATION_LIMITS.MAX_SHEET_DIMENSION,
    name: 'Ancho de placa'
})

const priceValidation = useValidation(boardPrice, {
    type: 'range',
    min: 0,
    max: VALIDATION_LIMITS.MAX_PRICE,
    name: 'Precio',
    allowZero: true
})

const kerfValidation = useValidation(kerfWidth, {
    type: 'range',
    min: 0,
    max: VALIDATION_LIMITS.MAX_KERF,
    name: 'Ancho de corte',
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
