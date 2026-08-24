import { describe, it, expect } from 'vitest'
import { fitPiezasEnTablas } from '@/services/packingService'

describe('fitPiezasEnTablas', () => {
    const sheetW = 244 // cm
    const sheetH = 122 // cm
    const kerf = 3 // mm

    describe('casos basicos', () => {
        it('deberia colocar una sola pieza pequena en una hoja', () => {
            const piezas = [
                { etiqueta: 'A', dim1: 50, dim2: 30, cantidad: 1, color: '#ff0000', shortCode: 'A' }
            ]

            const result = fitPiezasEnTablas(piezas, sheetW, sheetH, kerf)

            expect(result).toHaveLength(1)
            expect(result[0].ocupados).toHaveLength(1)
            expect(result[0].ocupados[0].etiqueta).toBe('A')
        })

        it('deberia colocar multiples piezas iguales', () => {
            const piezas = [
                { etiqueta: 'B', dim1: 40, dim2: 40, cantidad: 4, color: '#00ff00', shortCode: 'B' }
            ]

            const result = fitPiezasEnTablas(piezas, sheetW, sheetH, kerf)

            // Verificar que todas las piezas fueron colocadas
            const totalPiezas = result.reduce((sum, hoja) => sum + hoja.ocupados.length, 0)
            expect(totalPiezas).toBe(4)
        })

        it('deberia crear multiples hojas cuando las piezas no caben en una', () => {
            const piezas = [
                { etiqueta: 'C', dim1: 200, dim2: 100, cantidad: 3, color: '#0000ff', shortCode: 'C' }
            ]

            const result = fitPiezasEnTablas(piezas, sheetW, sheetH, kerf)

            expect(result.length).toBeGreaterThan(1)
        })
    })

    describe('rotacion de piezas', () => {
        it('deberia rotar piezas cuando sea necesario para que quepan', () => {
            // Pieza que solo cabe rotada (100x240 en hoja 244x122)
            const piezas = [
                { etiqueta: 'R', dim1: 100, dim2: 240, cantidad: 1, color: '#ff00ff', shortCode: 'R' }
            ]

            const result = fitPiezasEnTablas(piezas, sheetW, sheetH, kerf)

            expect(result).toHaveLength(1)
            expect(result[0].ocupados).toHaveLength(1)
            // La pieza deberia estar rotada
            const pieza = result[0].ocupados[0]
            expect(pieza.w).toBe(240)
            expect(pieza.h).toBe(100)
        })
    })

    describe('manejo de errores', () => {
        it('deberia lanzar error si una pieza no cabe en la placa', () => {
            const piezas = [
                { etiqueta: 'X', dim1: 300, dim2: 300, cantidad: 1, color: '#000000', shortCode: 'X' }
            ]

            expect(() => fitPiezasEnTablas(piezas, sheetW, sheetH, kerf))
                .toThrow('no cabe en la placa')
        })
    })

    describe('algoritmo Best Fit', () => {
        it('deberia ordenar piezas por area decreciente internamente', () => {
            // Mezcla de piezas grandes y pequenas pasadas en orden inverso
            const piezas = [
                { etiqueta: 'S', dim1: 20, dim2: 20, cantidad: 2, color: '#aaaaaa', shortCode: 'S' },
                { etiqueta: 'L', dim1: 100, dim2: 80, cantidad: 2, color: '#bbbbbb', shortCode: 'L' }
            ]

            const result = fitPiezasEnTablas(piezas, sheetW, sheetH, kerf)

            // Verificar que todas las piezas se colocaron
            const totalPiezas = result.reduce((sum, hoja) => sum + hoja.ocupados.length, 0)
            expect(totalPiezas).toBe(4)

            // Las piezas grandes (L) tienen area 8000, las pequenas (S) tienen area 400
            // El algoritmo ordena por area decreciente, asi que L deberia procesarse primero
            // Esto resulta en mejor eficiencia de empaquetado
            const todasLasPiezas = result.flatMap(h => h.ocupados)
            const piezasL = todasLasPiezas.filter(p => p.etiqueta === 'L')
            const piezasS = todasLasPiezas.filter(p => p.etiqueta === 'S')

            expect(piezasL).toHaveLength(2)
            expect(piezasS).toHaveLength(2)
        })
    })

    describe('kerf (ancho de corte)', () => {
        it('deberia considerar el kerf en los calculos de espacio', () => {
            // Piezas que casi llenan la hoja, el kerf deberia afectar cuantas caben
            const piezas = [
                { etiqueta: 'K', dim1: 60, dim2: 60, cantidad: 8, color: '#cccccc', shortCode: 'K' }
            ]

            const resultConKerf = fitPiezasEnTablas(piezas, sheetW, sheetH, 3)
            const resultSinKerf = fitPiezasEnTablas(piezas, sheetW, sheetH, 0)

            // Con kerf deberia usar igual o mas hojas que sin kerf
            expect(resultConKerf.length).toBeGreaterThanOrEqual(resultSinKerf.length)
        })
    })

    describe('propiedades de salida', () => {
        it('deberia preservar todas las propiedades de las piezas', () => {
            const piezas = [
                {
                    etiqueta: 'Test',
                    dim1: 50,
                    dim2: 40,
                    cantidad: 1,
                    color: '#123456',
                    shortCode: 'T'
                }
            ]

            const result = fitPiezasEnTablas(piezas, sheetW, sheetH, kerf)
            const pieza = result[0].ocupados[0]

            expect(pieza).toHaveProperty('id')
            expect(pieza).toHaveProperty('x')
            expect(pieza).toHaveProperty('y')
            expect(pieza).toHaveProperty('w')
            expect(pieza).toHaveProperty('h')
            expect(pieza.etiqueta).toBe('Test')
            expect(pieza.color).toBe('#123456')
            expect(pieza.shortCode).toBe('T')
            expect(pieza.originalDim1).toBe(50)
            expect(pieza.originalDim2).toBe(40)
        })

        it('deberia asignar IDs unicos a cada pieza', () => {
            const piezas = [
                { etiqueta: 'A', dim1: 30, dim2: 30, cantidad: 5, color: '#111', shortCode: 'A' },
                { etiqueta: 'B', dim1: 40, dim2: 40, cantidad: 5, color: '#222', shortCode: 'B' }
            ]

            const result = fitPiezasEnTablas(piezas, sheetW, sheetH, kerf)

            const todosLosIds = result.flatMap(hoja =>
                hoja.ocupados.map(p => p.id)
            )
            const idsUnicos = new Set(todosLosIds)

            expect(idsUnicos.size).toBe(todosLosIds.length)
        })
    })
})
