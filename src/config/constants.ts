import type { ColorMap, ShortCodeMap, Defaults, PieceLabelsMap } from '../types'

/**
 * Limites de validacion para inputs numericos
 */
export const VALIDATION_LIMITS = {
    MIN_DIMENSION: 1,
    MAX_DIMENSION: 500,
    MAX_SHEET_DIMENSION: 400,
    MAX_PRICE: 1000000,
    MIN_ESPESOR: 3,
    MAX_ESPESOR: 50,
    MAX_LUZ_PUERTAS: 10,
    MAX_ANCHO_MARCO: 20,
    MAX_KERF: 10
} as const

export type ValidationLimits = typeof VALIDATION_LIMITS

export const colorMap: ColorMap = {
    'Base': '#dc3545',
    'Tapa': '#fd7e14',
    'Lateral': '#ffc107',
    'Puerta': '#6f42c1',
    'Trasera': '#0d6efd',
    'Marco': '#20c997',
    'Error': '#6c757d'
}

export const shortCodeMap: ShortCodeMap = {
    'Base': 'B',
    'Tapa': 'T',
    'Lateral': 'L',
    'Puerta': 'P',
    'Trasera': 'R',
    'Marco Lateral': 'ML',
    'Marco Superior': 'MS',
    'Marco Inferior': 'MI',
    'Barra Divisoria': 'BD',
    'Error': 'ERR'
}

export const defaults: Defaults = {
    largo: 89,
    ancho: 89,
    alto: 180,
    espesor: 9,
    sheetHeight: 275,
    sheetWidth: 183,
    boardPrice: 35000,
    luzPuertas: 0.2,
    kerfWidth: 3,
    anchoMarco: 3,
    incluirMarco: true
}

export const pieceLabels: PieceLabelsMap = {
    'Base': 'Base',
    'Tapa': 'Tapa',
    'Lateral': 'Laterales',
    'Puerta': 'Puertas',
    'Trasera': 'Trasera',
    'Marco': 'Marco Interno'
}
