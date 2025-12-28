/**
 * Crea una funcion debounced que retrasa la ejecucion del callback
 * hasta que hayan pasado `delay` milisegundos desde la ultima invocacion.
 *
 * @param {Function} fn - La funcion a ejecutar
 * @param {number} delay - El tiempo de espera en milisegundos
 * @returns {Object} - Objeto con la funcion debounced y un metodo cancel
 */
export function debounce(fn, delay) {
    let timeoutId = null

    const debouncedFn = (...args) => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            fn(...args)
            timeoutId = null
        }, delay)
    }

    debouncedFn.cancel = () => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId)
            timeoutId = null
        }
    }

    return debouncedFn
}
