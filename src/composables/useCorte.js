import { computed } from 'vue'
import { fitPiezasEnTablas } from '../services/packingService'

/**
 * @description Composable que gestiona el calculo de corte de piezas en placas/tableros.
 * Utiliza el algoritmo de bin packing para distribuir las piezas de forma eficiente
 * y calcula metricas como cantidad de placas, costo total, area de desperdicio y eficiencia.
 * @param {import('vue').ComputedRef<Array>} piezasCalculadas - Computed ref con las piezas a cortar
 * @param {Object} refs - Objeto con refs reactivos de configuracion de placas
 * @param {import('vue').Ref<number>} refs.sheetHeight - Alto de la placa en cm
 * @param {import('vue').Ref<number>} refs.sheetWidth - Ancho de la placa en cm
 * @param {import('vue').Ref<number>} refs.boardPrice - Precio por placa
 * @param {import('vue').Ref<number>} refs.kerfWidth - Ancho del corte de sierra en mm
 * @returns {Object} - Objeto con computed refs para resultados del corte
 * @returns {import('vue').ComputedRef<Object>} returns.resultadoCorte - Resultado principal con count, totalPrice, boardData, error
 * @returns {import('vue').ComputedRef<number>} returns.totalPiecesArea - Area total de todas las piezas en cm2
 * @returns {import('vue').ComputedRef<number>} returns.totalBoardsArea - Area total de las placas usadas en cm2
 * @returns {import('vue').ComputedRef<number>} returns.wasteArea - Area de desperdicio en cm2
 * @returns {import('vue').ComputedRef<number>} returns.efficiency - Porcentaje de eficiencia del corte (0-100)
 * @example
 * const { piezasCalculadas } = usePiezas(dimensionRefs)
 * const {
 *   resultadoCorte,
 *   totalPiecesArea,
 *   wasteArea,
 *   efficiency
 * } = useCorte(piezasCalculadas, { sheetHeight, sheetWidth, boardPrice, kerfWidth })
 *
 * // Acceder a resultados
 * console.log(resultadoCorte.value.count) // Numero de placas necesarias
 * console.log(efficiency.value) // "85.5" (porcentaje)
 */
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
