import { pieceLabels } from '../config/constants'

export function formatDecimal(value) {
    return typeof value === 'number' ? value.toFixed(1) : value
}

export function formatCurrency(value) {
    if (typeof value !== 'number' || isNaN(value)) return '$ --.--'
    return `$ ${value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function getPieceLabel(type) {
    return pieceLabels[type] || type
}

export function getPieceStyle(piece, currentSheetW, currentSheetH) {
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

export function getPieceTooltip(piece) {
    return `${piece.etiqueta}\n` +
           `Dimensiones: ${formatDecimal(piece.originalDim1)} x ${formatDecimal(piece.originalDim2)} cm\n` +
           `Posicion: (${formatDecimal(piece.x)}, ${formatDecimal(piece.y)})\n` +
           `Colocada: ${formatDecimal(piece.w)} x ${formatDecimal(piece.h)} cm\n` +
           `ID: ${piece.id}`
}
