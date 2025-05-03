# Calculadora de Mueble y Plano de Corte v0.1 (Packer Simplificado)

## Descripción

Esta es una aplicación web simple diseñada para ayudar en la planificación de la construcción de muebles tipo caja (rectangulares y vacíos). Permite al usuario ingresar las dimensiones deseadas del mueble, el espesor del material (por defecto MDF de 9mm), y las dimensiones de las tablas de material estándar. La aplicación calcula:

1.  El **despiece detallado**: Una lista de todas las partes necesarias (Base, Tapa, Laterales, Puertas, Trasera) con sus dimensiones exactas.
2.  La **estimación de tablas**: Calcula cuántas tablas de material (ej. MDF) se necesitarán para cortar todas las piezas, utilizando un algoritmo de empaquetado simplificado.
3.  El **costo total estimado**: Basado en el número de tablas y el precio por tabla ingresado.
4.  Un **plano de corte visual estimado**: Para cada tabla necesaria, muestra una representación gráfica de cómo podrían distribuirse las piezas cortadas, según el algoritmo simplificado.

La aplicación está desarrollada principalmente en español.

## Características Principales

* **Entrada de Dimensiones Flexibles:** Permite ingresar Largo, Ancho, Alto del mueble y Espesor del material (en cm y mm).
* **Configuración de Tabla Fuente:** Permite definir las dimensiones (Alto, Ancho) y el Precio de las tablas de material estándar (ej. MDF).
* **Cálculo de Despiece Automático:** Genera la lista de partes necesarias (Base, Tapa, Laterales, 2 Puertas con luz intermedia, Trasera) según un método de construcción estándar definido.
* **Estimación de Tablas con Packer Simplificado:** Utiliza una función **personalizada** (`fitPiezasEnTablas`) con un algoritmo de empaquetado 2D heurístico y simplificado para estimar el número de tablas necesarias. Considera la **rotación básica** de piezas.
* **Cálculo de Costo:** Multiplica el número de tablas por el precio unitario.
* **Visualización del Plano de Corte:** Genera un diagrama visual para cada tabla, mostrando la ubicación estimada de cada pieza (según el packer simplificado) con un código corto identificatorio (B, T, L, P, R) y colores distintivos.
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

1.  Descarga el archivo `index.html` correspondiente a esta versión.
2.  Ábrelo directamente en tu navegador web moderno (Chrome, Firefox, Edge, Safari).
3.  **Ingresa los datos:**
    * En la sección "Dimensiones del Mueble y Material": Define Largo, Ancho, Alto y Espesor.
    * En la sección "Datos de la Tabla de MDF": Define Alto, Ancho y Precio de tus tablas de material.
4.  **Revisa los Resultados:**
    * **Resumen:** Verás la cantidad estimada de tablas y el costo total.
    * **Despiece Detallado:** Una tabla listará cada tipo de pieza, su código corto, cantidad, dimensiones, color de referencia y notas.
    * **Planos de Corte Estimados:** Se mostrarán diagramas visuales para cada tabla necesaria, con las piezas ubicadas según el algoritmo interno. Pasa el mouse sobre una pieza para ver más detalles.

## Estructura del Código (v1.3)

El proyecto consiste en un único archivo `index.html` que contiene:

1.  **HTML:** La estructura de la página, formularios de entrada y contenedores para los resultados y visualizaciones.
2.  **CSS:** Estilos básicos y personalizados dentro de etiquetas `<style>`, complementando a Bootstrap.
3.  **JavaScript:**
    * Inclusión de librerías (Vue, Bootstrap JS) vía CDN.
    * Instancia principal de Vue.js (`createApp({...}).mount('#app')`).
    * **`setup()`:** Utiliza la API de Composición de Vue 3.
        * **`ref()`:** Define las variables reactivas para los inputs (largo, ancho, etc.) y otros datos.
        * **`computed`:**
            * `piezasCalculadas`: Calcula la lista de piezas y sus dimensiones basándose en los inputs y el método de construcción asumido. Añade color y código corto.
            * `resultadoCorte`: Orquesta el proceso de empaquetado. Expande las piezas, las prepara y **llama a la función local `fitPiezasEnTablas`**, procesa los resultados para obtener el conteo, costo y `boardData` (con coordenadas), y maneja errores.
        * **Función `fitPiezasEnTablas`:** Contiene la lógica del algoritmo de packing 2D simplificado (descrito más abajo).
        * **Métodos Auxiliares:** `formatDecimal`, `formatCurrency`, `getPieceStyle`, `getPieceTooltip` para ayudar en la presentación de datos en el template.
        * **Mapeos:** `colorMap` y `shortCodeMap`.

## Método de Construcción Asumido

Los cálculos del despiece se basan en el siguiente método constructivo para una caja simple:

* **Laterales:** Cubren toda la altura y profundidad (Ancho) del mueble.
* **Base/Tapa:** Cubren el área externa total (Largo x Ancho).
* **Puertas (2):** Cubren la altura total. Su ancho combinado (más una pequeña luz de `0.3cm`) encaja *entre* las caras internas de los Laterales.
* **Trasera:** Cubre la altura total y encaja *entre* las caras internas de los Laterales.

## Notas sobre el Algoritmo de Packing Simplificado (v1.3)

* Esta versión utiliza una función **personalizada `fitPiezasEnTablas`** para estimar la ubicación de las piezas.
* **Algoritmo:**
* Ordena las piezas (generalmente por área descendente).
* Intenta colocar cada pieza en la primera hoja existente donde quepa ('First Fit').
* **Considera Rotación:** Verifica si la pieza cabe en su orientación original o rotada 90 grados.
* **Gestión de Espacio:** Utiliza una **guillotina muy simplificada**. Cuando se coloca una pieza, el espacio libre restante se divide (generalmente) en dos nuevos rectángulos. **Limitación:** Esta gestión de espacio es básica, no fusiona espacios libres adyacentes ni utiliza técnicas avanzadas (como Maximal Rectangles), lo que puede llevar a una subutilización del espacio (fragmentación) y a un cálculo de tablas potencialmente mayor al óptimo.
* **Visualización:** El plano de corte visual refleja las coordenadas calculadas por este algoritmo simple. Puede que no represente el layout más eficiente posible.
* La visualización **no descuenta el ancho del corte** (kerf) de la sierra.

## Posibles Mejoras Futuras

* **Reemplazar el packer simple** por un algoritmo más avanzado o una librería especializada (ej. `potpack`, algoritmos basados en MaxRects, etc.) para mejorar la eficiencia del empaquetado y la calidad del layout visual.
* Añadir opción para considerar el **ancho del corte (kerf)**.
* Permitir al usuario **seleccionar diferentes métodos de construcción**.
* Añadir opción para **exportar la lista de cortes** o el plano visual.
* Guardar/Cargar configuraciones de muebles.
* Mejorar la interfaz de usuario y la visualización (ej. zoom).