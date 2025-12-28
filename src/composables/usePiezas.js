import { computed } from 'vue'
import { colorMap, shortCodeMap, VALIDATION_LIMITS } from '../config/constants'
import { formatDecimal } from '../utils/formatters'
import { sanitizeNumber, validateCabinetDimension } from '../utils/validators'

/**
 * @description Crea un objeto de error para mostrar en la tabla de piezas
 * @param {string} mensaje - Mensaje de error descriptivo
 * @returns {Array} Array con un solo objeto de error formateado para la tabla
 */
function crearError(mensaje) {
    return [{
        etiqueta: 'Error',
        cantidad: '-',
        dim1: mensaje,
        dim2: '-',
        nota: 'Ajuste medidas',
        color: colorMap['Error'],
        shortCode: shortCodeMap['Error']
    }]
}

/**
 * @description Composable que calcula las piezas necesarias para construir un mueble tipo gabinete.
 * Genera automaticamente las dimensiones de base, tapa, laterales, puertas, trasera y marco opcional.
 * Valida las dimensiones ingresadas y retorna errores descriptivos si son invalidas.
 * @param {Object} refs - Objeto con refs reactivos de las dimensiones del mueble
 * @param {import('vue').Ref<number>} refs.largo - Largo del mueble en cm
 * @param {import('vue').Ref<number>} refs.ancho - Ancho/profundidad del mueble en cm
 * @param {import('vue').Ref<number>} refs.alto - Alto del mueble en cm
 * @param {import('vue').Ref<number>} refs.espesor - Espesor del material en mm
 * @param {import('vue').Ref<number>} refs.luzPuertas - Separacion entre las dos puertas en cm
 * @param {import('vue').Ref<boolean>} refs.incluirMarco - Si se debe incluir marco interno
 * @param {import('vue').Ref<number>} refs.anchoMarco - Ancho del marco en cm
 * @returns {Object} - Objeto con propiedad piezasCalculadas (computed ref con array de piezas)
 * @example
 * const refs = {
 *   largo: ref(100),
 *   ancho: ref(40),
 *   alto: ref(80),
 *   espesor: ref(18),
 *   luzPuertas: ref(0.3),
 *   incluirMarco: ref(false),
 *   anchoMarco: ref(5)
 * }
 * const { piezasCalculadas } = usePiezas(refs)
 * // piezasCalculadas.value contiene array de piezas con etiqueta, cantidad, dim1, dim2, color, etc.
 */
export function usePiezas(refs) {
    const { largo, ancho, alto, espesor, luzPuertas, incluirMarco, anchoMarco } = refs

    const piezasCalculadas = computed(() => {
        // Sanitizar todos los valores para evitar NaN
        const L = sanitizeNumber(largo.value, 0)
        const A = sanitizeNumber(ancho.value, 0)
        const H = sanitizeNumber(alto.value, 0)
        const E_mm = sanitizeNumber(espesor.value, 0)
        const luz = sanitizeNumber(luzPuertas.value, 0)
        const marco = incluirMarco.value
        const anchoM = sanitizeNumber(anchoMarco.value, 0)

        // Validar que los valores basicos sean positivos
        if (L <= 0 || A <= 0 || H <= 0 || E_mm <= 0) {
            return []
        }

        // Validar luz de puertas no negativa
        if (luz < 0) {
            return crearError('La separacion entre puertas no puede ser negativa')
        }

        // Validar rangos de dimensiones
        const validacionLargo = validateCabinetDimension(L, 'Largo')
        if (!validacionLargo.isValid) {
            return crearError(validacionLargo.error)
        }

        const validacionAncho = validateCabinetDimension(A, 'Ancho')
        if (!validacionAncho.isValid) {
            return crearError(validacionAncho.error)
        }

        const validacionAlto = validateCabinetDimension(H, 'Alto')
        if (!validacionAlto.isValid) {
            return crearError(validacionAlto.error)
        }

        // Validar espesor en rango razonable
        if (E_mm < VALIDATION_LIMITS.MIN_ESPESOR || E_mm > VALIDATION_LIMITS.MAX_ESPESOR) {
            return crearError(`Espesor debe estar entre ${VALIDATION_LIMITS.MIN_ESPESOR}mm y ${VALIDATION_LIMITS.MAX_ESPESOR}mm`)
        }

        // Validar luz de puertas
        if (luz > VALIDATION_LIMITS.MAX_LUZ_PUERTAS) {
            return crearError(`Separacion entre puertas excede el maximo de ${VALIDATION_LIMITS.MAX_LUZ_PUERTAS}cm`)
        }

        const E_cm = E_mm / 10

        if (L <= 2 * E_cm) {
            return crearError('Largo insuficiente para el espesor seleccionado')
        }

        if (H <= 2 * E_cm) {
            return crearError('Alto insuficiente para el espesor seleccionado')
        }

        const anchoTotalFrente = L - (2 * E_cm)
        const anchoDisponibleParaPuertas = anchoTotalFrente - luz
        const anchoPuerta = anchoDisponibleParaPuertas / 2

        if (anchoPuerta <= 0.1) {
            return crearError('Ancho de puertas insuficiente. Ajuste Largo, Espesor o Separacion')
        }

        // Validar ancho de marco si esta incluido
        if (marco && anchoM > 0) {
            if (anchoM > VALIDATION_LIMITS.MAX_ANCHO_MARCO) {
                return crearError(`Ancho del marco excede el maximo de ${VALIDATION_LIMITS.MAX_ANCHO_MARCO}cm`)
            }
        }

        const piezasBase = [
            { etiqueta: 'Base', cantidad: 1, dim1: L, dim2: A, nota: 'Pieza inferior' },
            { etiqueta: 'Tapa', cantidad: 1, dim1: L, dim2: A, nota: 'Pieza superior' },
            { etiqueta: 'Lateral', cantidad: 2, dim1: H, dim2: A, nota: 'Caras laterales' },
            { etiqueta: 'Puerta', cantidad: 2, dim1: H, dim2: anchoPuerta, nota: `Frontal (${formatDecimal(luz)}cm separacion)` },
            { etiqueta: 'Trasera', cantidad: 1, dim1: H, dim2: L - (2 * E_cm), nota: 'Posterior (entre laterales)' }
        ]

        if (marco && anchoM > 0 && !isNaN(anchoM)) {
            const anchoInternoFrente = L - (2 * E_cm)
            const altoMarco = H - (2 * E_cm)

            piezasBase.push(
                { etiqueta: 'Marco Lateral', cantidad: 2, dim1: altoMarco, dim2: anchoM, nota: 'Laterales del marco' },
                { etiqueta: 'Marco Superior', cantidad: 1, dim1: anchoInternoFrente - (2 * anchoM), dim2: anchoM, nota: 'Superior del marco' },
                { etiqueta: 'Marco Inferior', cantidad: 1, dim1: anchoInternoFrente - (2 * anchoM), dim2: anchoM, nota: 'Inferior del marco' },
                { etiqueta: 'Barra Divisoria', cantidad: 1, dim1: altoMarco - (2 * anchoM), dim2: anchoM, nota: 'Barra central vertical' }
            )
        }

        return piezasBase
            .filter(p => p.dim1 > 0.1 && p.dim2 > 0.1)
            .map(p => ({
                ...p,
                color: p.etiqueta.includes('Marco') || p.etiqueta.includes('Barra') ? colorMap['Marco'] : (colorMap[p.etiqueta] || '#6c757d'),
                shortCode: shortCodeMap[p.etiqueta] || '?'
            }))
    })

    return { piezasCalculadas }
}
