# Calculadora de Mueble y Plano de Corte v1.3 (Packer Simplificado)

## Descripción

Esta es una aplicación web simple diseñada para ayudar en la planificación de la construcción de muebles tipo caja (rectangulares y vacíos). Permite al usuario ingresar las dimensiones deseadas del mueble, el espesor del material (por defecto MDF de 9mm), y las dimensiones de las tablas de material estándar. La aplicación calcula:

1.  El **despiece detallado**: Una lista de todas las partes necesarias (Base, Tapa, Laterales, **2 Puertas con luz intermedia**, Trasera) con sus dimensiones exactas.
2.  La **estimación de tablas**: Calcula cuántas tablas de material (ej. MDF) se necesitarán para cortar todas las piezas, utilizando un algoritmo de empaquetado simplificado.
3.  El **costo total estimado**: Basado en el número de tablas y el precio por tabla ingresado.
4.  Un **plano de corte visual estimado**: Para cada tabla necesaria, muestra una representación gráfica de cómo podrían distribuirse las piezas cortadas, según el algoritmo simplificado.

La aplicación está desarrollada principalmente en español.

## Características Principales

* **Entrada de Dimensiones Flexibles:** Permite ingresar Largo, Ancho, Alto del mueble y Espesor del material (en cm y mm).
* **Configuración de Tabla Fuente:** Permite definir las dimensiones (Alto, Ancho) y el Precio de las tablas de material estándar (ej. MDF).
* **Cálculo de Despiece Automático:** Genera la lista de partes necesarias (Base, Tapa, Laterales, **2 Puertas [P] con una luz intermedia de 0.3cm**, Trasera [R]) según un método de construcción estándar definido.
* **Estimación de Tablas con Packer Simplificado:** Utiliza una función **personalizada** (`fitPiezasEnTablas`) con un algoritmo de empaquetado 2D heurístico y simplificado para estimar el número de tablas necesarias. Considera la **rotación básica** de piezas.
* **Cálculo de Costo:** Multiplica el número de tablas por el precio unitario.
* **Visualización del Plano de Corte:** Genera un diagrama visual para cada tabla, mostrando la ubicación estimada de cada pieza (según el packer simplificado) con un código corto identificatorio (B, T, L, P, R) y colores distintivos. Pasa el mouse sobre una pieza para ver más detalles.
* **Interfaz Reactiva:** Construida con Vue.js 3, los cálculos y la interfaz se actualizan automáticamente al cambiar los valores de entrada.
* **Diseño Responsivo:** Utiliza Bootstrap 5 para una visualización adaptable en diferentes dispositivos.
* **Independiente:** Funciona como un único archivo HTML sin necesidad de instalación (usa CDNs para Vue y Bootstrap).

## Pila Tecnológica

* **HTML5**
* **CSS3**
    * **Bootstrap 5:** Framework CSS para diseño y responsividad (vía CDN).
* **JavaScript (ES6+)**
    * **Vue.js 3:** Framework JavaScript progresivo para la interfaz y reactividad (vía CDN).
* **(Sin librerías externas de packing)**

## Cómo Usar

1.  Guarda el código HTML proporcionado como un archivo (ej. `calculadora_mueble_v1.3.html`).
2.  Ábrelo directamente en tu navegador web moderno (Chrome, Firefox, Edge, Safari).
3.  **Ingresa los datos:**
    * En la sección "Dimensiones del Mueble y Material": Define Largo, Ancho, Alto y Espesor.
    * En la sección "Datos de la Tabla de MDF": Define Alto, Ancho y Precio de tus tablas de material.
4.  **Revisa los Resultados:**
    * **Resumen:** Verás la cantidad estimada de tablas y el costo total.
    * **Nota de Construcción:** Verifica el método asumido, incluyendo la **luz de 0.3cm entre puertas**.
    * **Despiece Detallado:** Una tabla listará cada tipo de pieza (incluyendo las 2 'Puerta' [P]), su código corto, cantidad, dimensiones, color de referencia y notas.
    * **Planos de Corte Estimados:** Se mostrarán diagramas visuales para cada tabla necesaria, con las piezas ubicadas según el algoritmo interno. Pasa el mouse sobre una pieza para ver más detalles.

## Estructura del Código (v1.3)

El proyecto consiste en un único archivo HTML que contiene:

1.  **HTML:** La estructura de la página, formularios de entrada y contenedores para los resultados y visualizaciones.
2.  **CSS:** Estilos básicos y personalizados dentro de etiquetas `<style>`, complementando a Bootstrap.
3.  **JavaScript:**
    * Inclusión de librerías (Vue, Bootstrap JS) vía CDN.
    * Instancia principal de Vue.js (`createApp({...}).mount('#app')`).
    * **`setup()`:** Utiliza la API de Composición de Vue 3.
        * **`ref()`:** Define las variables reactivas para los inputs (largo, ancho, etc.), la constante `LUZ_ENTRE_PUERTAS_CM` (0.3) y otros datos.
        * **`computed`:**
            * `piezasCalculadas`: Calcula la lista de piezas y sus dimensiones basándose en los inputs, el método de construcción asumido y la constante `LUZ_ENTRE_PUERTAS_CM`. Reemplaza la pieza 'Frente' por dos piezas 'Puerta'. Añade color y código corto. Realiza validaciones de dimensiones.
            * `resultadoCorte`: Orquesta el proceso de empaquetado. Obtiene las piezas de `piezasCalculadas`, valida entradas y **llama a la función local `fitPiezasEnTablas`**, procesa los resultados para obtener el conteo, costo y `boardData` (con coordenadas de las piezas empaquetadas), y maneja errores del packer.
        * **Función `fitPiezasEnTablas`:** Contiene la lógica del algoritmo de packing 2D simplificado (descrito más abajo). Recibe las piezas calculadas (incluyendo las 'Puerta') y las distribuye en hojas virtuales.
        * **Métodos Auxiliares:** `formatDecimal`, `formatCurrency`, `getPieceStyle`, `getPieceTooltip` para ayudar en la presentación de datos en el template.
        * **Mapeos:** `colorMap` y `shortCodeMap` (incluyendo entradas para 'Puerta').

## Método de Construcción Asumido (v1.3)

Los cálculos del despiece se basan en el siguiente método constructivo para una caja simple:

* **Laterales (L):** Cubren toda la altura y profundidad (Ancho) del mueble.
* **Base (B) / Tapa (T):** Cubren el área externa total (Largo x Ancho).
* **Puertas (P - x2):** Cubren la altura total. Su ancho individual se calcula para que, juntas, cubran el espacio *entre* las caras internas de los Laterales, dejando una **luz estándar de 0.3cm** en el medio.
* **Trasera (R):** Cubre la altura total y encaja *entre* las caras internas de los Laterales.

## Notas sobre el Algoritmo de Packing Simplificado (v1.3)

* Esta versión utiliza una función **personalizada `fitPiezasEnTablas`** para estimar la ubicación de las piezas.
* **Algoritmo:**
    * Prepara una lista de todas las piezas individuales requeridas (ej. 2 Laterales se convierten en dos piezas separadas en la lista).
    * Ordena las piezas (generalmente por dimensión mayor descendente, luego área descendente) para intentar colocar las más grandes primero.
    * Intenta colocar cada pieza en la primera hoja existente donde quepa ('First Fit'). Si no cabe en ninguna, crea una hoja nueva.
    * **Considera Rotación:** Verifica si la pieza cabe en su orientación original o rotada 90 grados.
    * **Gestión de Espacio:** Utiliza una **estrategia de división de espacios libres muy simple (tipo guillotina básica)**. Cuando se coloca una pieza, el espacio libre rectangular donde se colocó se divide (generalmente) en dos nuevos rectángulos libres más pequeños.
    * **Limitaciones:** Esta gestión de espacio es básica. No fusiona espacios libres adyacentes que podrían formar un área utilizable mayor, ni utiliza técnicas avanzadas (como Best Fit, MaxRects, etc.). Esto puede llevar a una subutilización del espacio (fragmentación) y, por lo tanto, el número de tablas calculado es una **estimación** que podría ser mayor al óptimo real.
* **Visualización:** El plano de corte visual refleja las coordenadas calculadas por este algoritmo simple. **No representa necesariamente el layout más eficiente posible** y sirve como una guía estimada.
* La visualización y el cálculo **no descuentan el ancho del corte** (kerf) de la sierra.

## Posibles Mejoras Futuras

* **Reemplazar el packer simple** por un algoritmo más avanzado o una librería especializada (ej. `potpack`, `packer-growing-bin`, algoritmos basados en MaxRects, etc.) para mejorar la eficiencia del empaquetado, reducir el número estimado de tablas y obtener un layout visual más realista/eficiente.
* Añadir opción para configurar y considerar el **ancho del corte (kerf)** en los cálculos y la visualización.
* Permitir al usuario **seleccionar diferentes métodos de construcción** (ej. laterales entre base/tapa).
* Añadir opción para **configurar la luz entre puertas**.
* Añadir opción para **exportar la lista de cortes** (CSV, TXT) o el plano visual (SVG, PNG).
* Guardar/Cargar configuraciones de muebles o proyectos.
* Mejorar la interfaz de usuario y la visualización (ej. zoom/pan en el plano, arrastrar piezas - *esto requeriría un cambio significativo*).