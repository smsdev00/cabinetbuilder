/**
 * @description Interfaz para la funcion debounced con metodo cancel.
 * Permite invocar la funcion con sus argumentos originales y cancelar
 * ejecuciones pendientes.
 * @template T - Tipo de la funcion original
 */
export interface DebouncedFunction<T extends (...args: unknown[]) => void> {
    (...args: Parameters<T>): void
    cancel: () => void
}

/**
 * @description Crea una version "debounced" de una funcion que retrasa su ejecucion
 * hasta que hayan pasado `delay` milisegundos desde la ultima invocacion.
 * Util para optimizar eventos frecuentes como resize, scroll o input.
 * Incluye un metodo `cancel()` para cancelar ejecuciones pendientes.
 * @template T - Tipo de la funcion a envolver
 * @param {T} fn - La funcion callback a ejecutar despues del delay
 * @param {number} delay - Tiempo de espera en milisegundos antes de ejecutar
 * @returns {DebouncedFunction<T>} Funcion debounced con metodo cancel() adicional
 * @example
 * // Debounce de busqueda mientras el usuario escribe
 * const buscarDebounced = debounce((termino: string) => {
 *   console.log('Buscando:', termino)
 * }, 300)
 *
 * input.addEventListener('input', (e) => buscarDebounced(e.target.value))
 *
 * // Cancelar si el componente se desmonta
 * buscarDebounced.cancel()
 */
export function debounce<T extends (...args: unknown[]) => void>(
    fn: T,
    delay: number
): DebouncedFunction<T> {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const debouncedFn = ((...args: Parameters<T>) => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            fn(...args)
            timeoutId = null
        }, delay)
    }) as DebouncedFunction<T>

    debouncedFn.cancel = () => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId)
            timeoutId = null
        }
    }

    return debouncedFn
}
