/**
 * Funciones de validacion para inputs numericos
 * Estas validaciones son no intrusivas - permiten al usuario escribir pero retornan errores descriptivos
 */

import { VALIDATION_LIMITS } from '../config/constants'

/**
 * Valida que un valor de dimension este dentro de un rango valido
 * @param {number|string} value - Valor a validar
 * @param {number} min - Valor minimo permitido
 * @param {number} max - Valor maximo permitido
 * @param {string} name - Nombre del campo para mensajes de error
 * @returns {{ isValid: boolean, error: string|null, value: number }}
 */
export function validateDimension(value, min, max, name) {
    const numValue = typeof value === 'string' ? parseFloat(value) : value

    if (value === '' || value === null || value === undefined) {
        return {
            isValid: false,
            error: `${name} es requerido`,
            value: numValue
        }
    }

    if (isNaN(numValue)) {
        return {
            isValid: false,
            error: `${name} debe ser un numero valido`,
            value: NaN
        }
    }

    if (numValue < min) {
        return {
            isValid: false,
            error: `${name} debe ser mayor o igual a ${min}`,
            value: numValue
        }
    }

    if (numValue > max) {
        return {
            isValid: false,
            error: `${name} debe ser menor o igual a ${max}`,
            value: numValue
        }
    }

    return {
        isValid: true,
        error: null,
        value: numValue
    }
}

/**
 * Valida que un valor sea un numero positivo
 * @param {number|string} value - Valor a validar
 * @param {string} name - Nombre del campo para mensajes de error
 * @param {boolean} allowZero - Si se permite el valor cero (default: false)
 * @returns {{ isValid: boolean, error: string|null, value: number }}
 */
export function validatePositiveNumber(value, name, allowZero = false) {
    const numValue = typeof value === 'string' ? parseFloat(value) : value

    if (value === '' || value === null || value === undefined) {
        return {
            isValid: false,
            error: `${name} es requerido`,
            value: numValue
        }
    }

    if (isNaN(numValue)) {
        return {
            isValid: false,
            error: `${name} debe ser un numero valido`,
            value: NaN
        }
    }

    if (allowZero) {
        if (numValue < 0) {
            return {
                isValid: false,
                error: `${name} no puede ser negativo`,
                value: numValue
            }
        }
    } else {
        if (numValue <= 0) {
            return {
                isValid: false,
                error: `${name} debe ser mayor a 0`,
                value: numValue
            }
        }
    }

    return {
        isValid: true,
        error: null,
        value: numValue
    }
}

/**
 * Sanitiza un valor y retorna un numero valido o el valor por defecto
 * @param {number|string} value - Valor a sanitizar
 * @param {number} defaultValue - Valor por defecto si el input es invalido
 * @returns {number}
 */
export function sanitizeNumber(value, defaultValue = 0) {
    if (value === '' || value === null || value === undefined) {
        return defaultValue
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value

    if (isNaN(numValue) || !isFinite(numValue)) {
        return defaultValue
    }

    return numValue
}

/**
 * Valida un precio (numero positivo con limite maximo)
 * @param {number|string} value - Valor a validar
 * @param {string} name - Nombre del campo para mensajes de error
 * @returns {{ isValid: boolean, error: string|null, value: number }}
 */
export function validatePrice(value, name = 'Precio') {
    const result = validatePositiveNumber(value, name, true)

    if (!result.isValid) {
        return result
    }

    if (result.value > VALIDATION_LIMITS.MAX_PRICE) {
        return {
            isValid: false,
            error: `${name} excede el limite maximo de ${VALIDATION_LIMITS.MAX_PRICE.toLocaleString()}`,
            value: result.value
        }
    }

    return result
}

/**
 * Valida dimension de mueble usando limites predeterminados
 * @param {number|string} value - Valor a validar
 * @param {string} name - Nombre del campo
 * @returns {{ isValid: boolean, error: string|null, value: number }}
 */
export function validateCabinetDimension(value, name) {
    return validateDimension(
        value,
        VALIDATION_LIMITS.MIN_DIMENSION,
        VALIDATION_LIMITS.MAX_DIMENSION,
        name
    )
}

/**
 * Valida dimension de placa usando limites predeterminados
 * @param {number|string} value - Valor a validar
 * @param {string} name - Nombre del campo
 * @returns {{ isValid: boolean, error: string|null, value: number }}
 */
export function validateSheetDimension(value, name) {
    return validateDimension(
        value,
        VALIDATION_LIMITS.MIN_DIMENSION,
        VALIDATION_LIMITS.MAX_SHEET_DIMENSION,
        name
    )
}

/**
 * Valida que un valor este dentro de un rango especificado
 * @param {number|string} value - Valor a validar
 * @param {number} min - Valor minimo permitido
 * @param {number} max - Valor maximo permitido
 * @returns {{ isValid: boolean, message: string|null }}
 */
export function validateRange(value, min, max) {
    const numValue = typeof value === 'string' ? parseFloat(value) : value

    if (value === '' || value === null || value === undefined) {
        return {
            isValid: false,
            message: 'El valor es requerido'
        }
    }

    if (isNaN(numValue) || !isFinite(numValue)) {
        return {
            isValid: false,
            message: 'Debe ser un numero valido'
        }
    }

    if (numValue < min) {
        return {
            isValid: false,
            message: `El valor debe ser mayor o igual a ${min}`
        }
    }

    if (numValue > max) {
        return {
            isValid: false,
            message: `El valor debe ser menor o igual a ${max}`
        }
    }

    return {
        isValid: true,
        message: null
    }
}

/**
 * Verifica si un valor esta en estado de advertencia (cerca de los limites)
 * @param {number} value - Valor a verificar
 * @param {number} min - Limite minimo
 * @param {number} max - Limite maximo
 * @param {number} warningThreshold - Porcentaje del rango para advertencia (default: 0.1 = 10%)
 * @returns {{ isWarning: boolean, message: string|null }}
 */
export function checkWarningState(value, min, max, warningThreshold = 0.1) {
    if (isNaN(value) || value < min || value > max) {
        return { isWarning: false, message: null }
    }

    const range = max - min
    const warningRange = range * warningThreshold

    if (value <= min + warningRange) {
        return {
            isWarning: true,
            message: `Valor cercano al minimo permitido (${min})`
        }
    }

    if (value >= max - warningRange) {
        return {
            isWarning: true,
            message: `Valor cercano al maximo permitido (${max})`
        }
    }

    return { isWarning: false, message: null }
}
