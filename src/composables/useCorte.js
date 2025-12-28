import { computed } from 'vue'
import { fitPiezasEnTablas } from '../services/packingService'

export function useCorte(piezasCalculadas, refs) {
    const { sheetHeight, sheetWidth, boardPrice, kerfWidth } = refs

    const resultadoCorte = computed(() => {
        const piezas = piezasCalculadas.value
        const sh = parseFloat(sheetHeight.value)
        const sw = parseFloat(sheetWidth.value)
        const price = parseFloat(boardPrice.value)
        const kerf = parseFloat(kerfWidth.value)

        const defaultResult = {
            count: -1,
            totalPrice: 0,
            boardData: [],
            error: null
        }

        if (!piezas || piezas.length === 0) {
            defaultResult.error = "Ingrese dimensiones validas."
            return defaultResult
        }

        if (piezas[0].etiqueta === 'Error') {
            defaultResult.error = piezas[0].dim1
            return defaultResult
        }

        if (isNaN(sh) || isNaN(sw) || sh <= 0 || sw <= 0) {
            defaultResult.error = "Dimensiones de placa invalidas."
            return defaultResult
        }

        if (isNaN(price) || price < 0) {
            defaultResult.error = "Precio por placa invalido."
            return defaultResult
        }

        try {
            const hojasCalculadas = fitPiezasEnTablas(piezas, sw, sh, kerf)
            const numSheets = hojasCalculadas.length
            const totalPrice = numSheets * price

            const boardData = hojasCalculadas.map(hoja => ({
                id: hoja.id,
                pieces: hoja.ocupados.map(p => ({
                    id: p.id,
                    etiqueta: p.etiqueta,
                    color: p.color,
                    shortCode: p.shortCode,
                    originalDim1: p.originalDim1,
                    originalDim2: p.originalDim2,
                    x: p.x,
                    y: p.y,
                    w: p.w,
                    h: p.h
                }))
            }))

            return {
                count: numSheets,
                totalPrice: totalPrice,
                boardData: boardData,
                error: null
            }
        } catch (error) {
            console.error("Error en el packing:", error)
            defaultResult.error = error.message || "Error en calculo de corte."
            defaultResult.count = 0
            defaultResult.boardData = []
            return defaultResult
        }
    })

    const totalPiecesArea = computed(() => {
        return piezasCalculadas.value.reduce((sum, p) => {
            if (p.etiqueta === 'Error') return sum
            return sum + (p.dim1 * p.dim2 * p.cantidad)
        }, 0)
    })

    const totalBoardsArea = computed(() => {
        return resultadoCorte.value.count * sheetHeight.value * sheetWidth.value
    })

    const wasteArea = computed(() => {
        return totalBoardsArea.value - totalPiecesArea.value
    })

    const efficiency = computed(() => {
        if (totalBoardsArea.value === 0) return 0
        return Math.min(100, Math.max(0, (totalPiecesArea.value / totalBoardsArea.value * 100).toFixed(1)))
    })

    return {
        resultadoCorte,
        totalPiecesArea,
        totalBoardsArea,
        wasteArea,
        efficiency
    }
}
