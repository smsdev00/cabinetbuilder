import { pieceLabels } from '../config/constants'
import type { PiezaColocada, PieceStyle } from '../types'

/**
 * @description Formatea un valor numerico a una cadena con un decimal de precision.
 * Si el valor ya es string, lo retorna sin modificar.
 * @param {number | string} value - Valor numerico o string a formatear
 * @returns {string} Valor formateado con un decimal (ej: "12.5") o el string original
 * @example
 * formatDecimal(12.456) // "12.5"
 * formatDecimal(10) // "10.0"
 * formatDecimal("N/A") // "N/A"
 */
export function formatDecimal(value: number | string): string {
    return typeof value === 'number' ? value.toFixed(1) : String(value)
}

/**
 * @description Formatea un valor numerico como moneda argentina (ARS).
 * Incluye el simbolo de peso y formato con separadores de miles y dos decimales.
 * @param {number} value - Valor numerico a formatear como moneda
 * @returns {string} Valor formateado como moneda argentina (ej: "$ 1.234,56") o "$ --.--" si es invalido
 * @example
 * formatCurrency(1234.5) // "$ 1.234,50"
 * formatCurrency(0) // "$ 0,00"
 * formatCurrency(NaN) // "$ --.--"
 */
export function formatCurrency(value: number): string {
    if (typeof value !== 'number' || isNaN(value)) return '$ --.--'
    return `$ ${value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * @description Obtiene la etiqueta legible en espanol para un tipo de pieza del mueble.
 * Busca en el mapa de etiquetas predefinido y retorna el tipo original si no encuentra coincidencia.
 * @param {string} type - Identificador del tipo de pieza (ej: "Base", "Tapa", "Lateral")
 * @returns {string} Etiqueta legible para mostrar al usuario
 * @example
 * getPieceLabel("Base") // "Base"
 * getPieceLabel("Marco Lateral") // "Marco Lateral"
 * getPieceLabel("unknown") // "unknown"
 */
export function getPieceLabel(type: string): string {
    return pieceLabels[type] || type
}

/**
 * @description Calcula el objeto de estilos CSS para posicionar visualmente una pieza
 * dentro del diagrama de corte de la placa. Convierte las coordenadas absolutas
 * a porcentajes relativos al tamano de la placa.
 * @param {PiezaColocada} piece - Objeto de pieza con coordenadas (x, y) y dimensiones (w, h)
 * @param {number} currentSheetW - Ancho actual de la placa en cm
 * @param {number} currentSheetH - Alto actual de la placa en cm
 * @returns {PieceStyle} Objeto con propiedades CSS: position, left, top, width, height, backgroundColor
 * @example
 * const style = getPieceStyle(
 *   { x: 10, y: 20, w: 50, h: 30, color: '#ff0000', ... },
 *   200, // ancho placa
 *   100  // alto placa
 * )
 * // { position: 'absolute', left: '5%', top: '20%', width: '25%', height: '30%', backgroundColor: '#ff0000' }
 */
export function getPieceStyle(piece: PiezaColocada, currentSheetW: number, currentSheetH: number): PieceStyle {
    const safeSheetW = currentSheetW > 0 ? currentSheetW : 1
    const safeSheetH = currentSheetH > 0 ? currentSheetH : 1
    const widthPerc = Math.max((piece.w / safeSheetW) * 100, 0.1)
    const heightPerc = Math.max((piece.h / safeSheetH) * 100, 0.1)

    return {
        position: 'absolute',
        left: (piece.x / safeSheetW) * 100 + '%',
        top: (piece.y / safeSheetH) * 100 + '%',
        width: widthPerc + '%',
        height: heightPerc + '%',
        backgroundColor: piece.color
    }
}

/**
 * @description Genera el texto informativo para mostrar en el tooltip al pasar
 * el cursor sobre una pieza en el diagrama de corte. Incluye etiqueta, dimensiones
 * originales, posicion en la placa, tamano colocado e identificador unico.
 * @param {PiezaColocada} piece - Objeto de pieza con toda su informacion
 * @returns {string} Texto multilínea formateado para tooltip
 * @example
 * const tooltip = getPieceTooltip({
 *   id: 1,
 *   etiqueta: 'Base',
 *   originalDim1: 100,
 *   originalDim2: 40,
 *   x: 0, y: 0, w: 100, h: 40,
 *   ...
 * })
 * // "Base\nDimensiones: 100.0 x 40.0 cm\nPosicion: (0.0, 0.0)\nColocada: 100.0 x 40.0 cm\nID: 1"
 */
export function getPieceTooltip(piece: PiezaColocada): string {
    return `${piece.etiqueta}\n` +
           `Dimensiones: ${formatDecimal(piece.originalDim1)} x ${formatDecimal(piece.originalDim2)} cm\n` +
           `Posicion: (${formatDecimal(piece.x)}, ${formatDecimal(piece.y)})\n` +
           `Colocada: ${formatDecimal(piece.w)} x ${formatDecimal(piece.h)} cm\n` +
           `ID: ${piece.id}`
}
