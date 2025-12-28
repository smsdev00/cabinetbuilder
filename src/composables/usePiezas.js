import { computed } from 'vue'
import { colorMap, shortCodeMap } from '../config/constants'
import { formatDecimal } from '../utils/formatters'

export function usePiezas(refs) {
    const { largo, ancho, alto, espesor, luzPuertas, incluirMarco, anchoMarco } = refs

    const piezasCalculadas = computed(() => {
        const L = parseFloat(largo.value)
        const A = parseFloat(ancho.value)
        const H = parseFloat(alto.value)
        const E_mm = parseFloat(espesor.value)
        const luz = parseFloat(luzPuertas.value)
        const marco = incluirMarco.value
        const anchoM = parseFloat(anchoMarco.value)

        if (isNaN(L) || isNaN(A) || isNaN(H) || isNaN(E_mm) ||
            L <= 0 || A <= 0 || H <= 0 || E_mm <= 0 || isNaN(luz) || luz < 0) {
            return []
        }

        const E_cm = E_mm / 10

        if (L <= 2 * E_cm) {
            return [{
                etiqueta: 'Error',
                cantidad: '-',
                dim1: 'Largo insuficiente para el espesor seleccionado',
                dim2: '-',
                nota: 'Ajuste medidas',
                color: colorMap['Error'],
                shortCode: shortCodeMap['Error']
            }]
        }

        if (H <= 2 * E_cm) {
            return [{
                etiqueta: 'Error',
                cantidad: '-',
                dim1: 'Alto insuficiente para el espesor seleccionado',
                dim2: '-',
                nota: 'Ajuste medidas',
                color: colorMap['Error'],
                shortCode: shortCodeMap['Error']
            }]
        }

        const anchoTotalFrente = L - (2 * E_cm)
        const anchoDisponibleParaPuertas = anchoTotalFrente - luz
        const anchoPuerta = anchoDisponibleParaPuertas / 2

        if (anchoPuerta <= 0.1) {
            return [{
                etiqueta: 'Error',
                cantidad: '-',
                dim1: 'Ancho de puertas insuficiente',
                dim2: '-',
                nota: 'Ajuste Largo, Espesor o Separacion',
                color: colorMap['Error'],
                shortCode: shortCodeMap['Error']
            }]
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
