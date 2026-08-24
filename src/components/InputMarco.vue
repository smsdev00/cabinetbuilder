<template>
    <div class="input-card card">
        <div class="card-header">
            Marco Interno (Opcional)
        </div>
        <div class="card-body">
            <div class="form-check-modern form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox" id="incluirMarco" v-model="incluirMarco">
                <label class="form-check-label" for="incluirMarco">
                    Incluir Marco Interno
                </label>
            </div>

            <div v-if="incluirMarco" class="row g-3">
                <div class="col-12">
                    <label for="anchoMarco" class="form-label">Ancho del Marco (cm)</label>
                    <input
                        type="number"
                        id="anchoMarco"
                        class="form-control"
                        :class="marcoValidation.validationClass.value"
                        v-model.number="anchoMarco"
                        :min="VALIDATION_LIMITS.MIN_DIMENSION"
                        :max="VALIDATION_LIMITS.MAX_ANCHO_MARCO"
                        step="0.1"
                        aria-describedby="anchoMarco-help"
                    >
                    <small id="anchoMarco-help" class="text-muted">Ancho de las tiras del marco perimetral</small>
                    <div v-if="marcoValidation.hasError.value" class="invalid-feedback">
                        {{ marcoValidation.errorMessage.value }}
                    </div>
                    <div v-else-if="marcoValidation.hasWarning.value" class="warning-feedback">
                        {{ marcoValidation.warningMessage.value }}
                    </div>
                </div>
                <div class="col-12">
                    <div class="alert alert-info mb-0">
                        <strong>Nota:</strong> El marco incluye:
                        <ul class="mb-0 mt-2 small">
                            <li>Tiras laterales (2)</li>
                            <li>Tira superior (1)</li>
                            <li>Tira inferior (1)</li>
                            <li>Barra divisoria central (1)</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div v-else class="text-center text-muted py-4">
                <p>Active esta opcion para agregar un marco donde apoyaran las puertas</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { VALIDATION_LIMITS } from '../config/constants'
import { useValidation } from '../composables/useValidation'

const incluirMarco = defineModel('incluirMarco', { type: Boolean })
const anchoMarco = defineModel('anchoMarco', { type: Number })

// Validacion del ancho del marco
const marcoValidation = useValidation(anchoMarco, {
    type: 'dimension',
    min: VALIDATION_LIMITS.MIN_DIMENSION,
    max: VALIDATION_LIMITS.MAX_ANCHO_MARCO,
    name: 'Ancho del marco'
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
