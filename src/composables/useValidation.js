import { ref, watch, computed } from 'vue'
import { validateDimension, validatePositiveNumber, checkWarningState } from '../utils/validators'

/**
 * Composable para validacion reactiva de inputs
 * Proporciona estado de validacion y mensajes de error/advertencia de forma no intrusiva
 *
 * @param {Ref} valueRef - Referencia reactiva al valor a validar
 * @param {Object} rules - Reglas de validacion
 * @param {string} rules.type - Tipo de validacion: 'dimension', 'positive', 'range'
 * @param {number} rules.min - Valor minimo (opcional, default segun tipo)
 * @param {number} rules.max - Valor maximo (opcional, default segun tipo)
 * @param {string} rules.name - Nombre del campo para mensajes de error
 * @param {boolean} rules.allowZero - Permitir cero para tipo 'positive' (default: false)
 * @param {boolean} rules.required - Si el campo es requerido (default: true)
 *
 * @returns {Object} Estado de validacion
 * @returns {ComputedRef<boolean>} isValid - Si el valor actual es valido
 * @returns {ComputedRef<boolean>} hasError - Si hay un error
 * @returns {ComputedRef<boolean>} hasWarning - Si hay una advertencia
 * @returns {ComputedRef<string|null>} errorMessage - Mensaje de error
 * @returns {ComputedRef<string|null>} warningMessage - Mensaje de advertencia
 * @returns {ComputedRef<string>} validationClass - Clase CSS para el input
 * @returns {Function} validate - Funcion para forzar validacion
 */
export function useValidation(valueRef, rules = {}) {
    const {
        type = 'dimension',
        min = 1,
        max = 500,
        name = 'Campo',
        allowZero = false,
        required = true
    } = rules

    // Estado interno
    const touched = ref(false)
    const validationResult = ref({ isValid: true, error: null, value: null })
    const warningResult = ref({ isWarning: false, message: null })

    /**
     * Ejecuta la validacion segun el tipo especificado
     */
    function runValidation(value) {
        // Si no es requerido y esta vacio, es valido
        if (!required && (value === '' || value === null || value === undefined)) {
            validationResult.value = { isValid: true, error: null, value: null }
            warningResult.value = { isWarning: false, message: null }
            return
        }

        let result

        switch (type) {
            case 'dimension':
                result = validateDimension(value, min, max, name)
                break
            case 'positive':
                result = validatePositiveNumber(value, name, allowZero)
                break
            case 'range':
                result = validateDimension(value, min, max, name)
                break
            default:
                result = validateDimension(value, min, max, name)
        }

        validationResult.value = result

        // Verificar advertencias solo si el valor es valido
        if (result.isValid && typeof result.value === 'number') {
            warningResult.value = checkWarningState(result.value, min, max)
        } else {
            warningResult.value = { isWarning: false, message: null }
        }
    }

    // Observar cambios en el valor
    watch(
        () => valueRef.value,
        (newValue) => {
            touched.value = true
            runValidation(newValue)
        },
        { immediate: true }
    )

    // Propiedades computadas
    const isValid = computed(() => validationResult.value.isValid)
    const hasError = computed(() => touched.value && !validationResult.value.isValid)
    const hasWarning = computed(() => touched.value && validationResult.value.isValid && warningResult.value.isWarning)
    const errorMessage = computed(() => hasError.value ? validationResult.value.error : null)
    const warningMessage = computed(() => hasWarning.value ? warningResult.value.message : null)

    // Clase CSS segun estado de validacion
    const validationClass = computed(() => {
        if (!touched.value) return ''
        if (hasError.value) return 'is-invalid'
        if (hasWarning.value) return 'is-warning'
        return 'is-valid'
    })

    // Funcion para forzar validacion
    function validate() {
        touched.value = true
        runValidation(valueRef.value)
        return validationResult.value.isValid
    }

    // Funcion para resetear estado touched
    function reset() {
        touched.value = false
        validationResult.value = { isValid: true, error: null, value: null }
        warningResult.value = { isWarning: false, message: null }
    }

    return {
        isValid,
        hasError,
        hasWarning,
        errorMessage,
        warningMessage,
        validationClass,
        validate,
        reset,
        touched
    }
}

/**
 * Composable para validar multiples campos a la vez
 *
 * @param {Object} fieldsConfig - Configuracion de campos { fieldName: { ref, rules } }
 * @returns {Object} Estado de validacion agregado
 */
export function useFormValidation(fieldsConfig) {
    const validations = {}

    for (const [fieldName, config] of Object.entries(fieldsConfig)) {
        validations[fieldName] = useValidation(config.ref, config.rules)
    }

    const allValid = computed(() => {
        return Object.values(validations).every(v => v.isValid.value)
    })

    const allErrors = computed(() => {
        const errors = {}
        for (const [fieldName, validation] of Object.entries(validations)) {
            if (validation.hasError.value) {
                errors[fieldName] = validation.errorMessage.value
            }
        }
        return errors
    })

    function validateAll() {
        let isValid = true
        for (const validation of Object.values(validations)) {
            if (!validation.validate()) {
                isValid = false
            }
        }
        return isValid
    }

    function resetAll() {
        for (const validation of Object.values(validations)) {
            validation.reset()
        }
    }

    return {
        fields: validations,
        allValid,
        allErrors,
        validateAll,
        resetAll
    }
}
