import { ref, watch } from 'vue'

/**
 * Composable para sincronizar un ref con localStorage
 * @param {string} key - Clave para localStorage
 * @param {any} defaultValue - Valor por defecto si no existe en localStorage
 * @param {number} debounceMs - Tiempo de debounce en milisegundos (default: 500)
 * @returns {import('vue').Ref} - Ref sincronizado con localStorage
 */
export function useLocalStorage(key, defaultValue, debounceMs = 500) {
    // Intentar leer el valor inicial desde localStorage
    const storedValue = getStoredValue(key, defaultValue)
    const data = ref(storedValue)

    let debounceTimeout = null

    // Observar cambios y guardar en localStorage con debounce
    watch(
        data,
        (newValue) => {
            // Limpiar timeout anterior si existe
            if (debounceTimeout) {
                clearTimeout(debounceTimeout)
            }

            // Crear nuevo timeout para escritura con debounce
            debounceTimeout = setTimeout(() => {
                saveToStorage(key, newValue)
            }, debounceMs)
        },
        { deep: true }
    )

    return data
}

/**
 * Obtiene el valor almacenado en localStorage
 * Maneja errores de JSON.parse graciosamente
 * @param {string} key - Clave de localStorage
 * @param {any} defaultValue - Valor por defecto si hay error o no existe
 * @returns {any} - Valor parseado o el valor por defecto
 */
function getStoredValue(key, defaultValue) {
    try {
        const item = localStorage.getItem(key)

        // Si no existe el item, retornar valor por defecto
        if (item === null) {
            return defaultValue
        }

        // Intentar parsear el JSON
        const parsed = JSON.parse(item)

        // Validar que el tipo coincida con el valor por defecto
        // Esto previene problemas si el tipo almacenado es diferente
        if (typeof parsed !== typeof defaultValue && defaultValue !== null) {
            console.warn(
                `[useLocalStorage] Tipo incompatible para "${key}". ` +
                `Esperado: ${typeof defaultValue}, Encontrado: ${typeof parsed}. ` +
                `Usando valor por defecto.`
            )
            return defaultValue
        }

        return parsed
    } catch (error) {
        // Manejar errores de JSON.parse graciosamente
        console.warn(
            `[useLocalStorage] Error al leer "${key}" desde localStorage:`,
            error.message,
            '- Usando valor por defecto.'
        )
        return defaultValue
    }
}

/**
 * Guarda un valor en localStorage
 * Maneja errores graciosamente (ej: quota exceeded)
 * @param {string} key - Clave de localStorage
 * @param {any} value - Valor a guardar
 */
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        console.error(
            `[useLocalStorage] Error al guardar "${key}" en localStorage:`,
            error.message
        )
    }
}
