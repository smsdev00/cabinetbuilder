<template>
    <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
    <div class="container-fluid">
        <div class="main-card">
            <div class="header-section">
                <h1>Calculadora Optimizada de Corte MDF</h1>
                <div class="version">Version 2.1 - Con Marco Interno Opcional</div>
            </div>

            <main id="main-content" class="p-4">
                <div class="row g-4 mb-4">
                    <div class="col-lg-4">
                        <InputDimensiones
                            v-model:largo="largo"
                            v-model:ancho="ancho"
                            v-model:alto="alto"
                            v-model:espesor="espesor"
                            v-model:luzPuertas="luzPuertas"
                        />
                    </div>

                    <div class="col-lg-4">
                        <InputMarco
                            v-model:incluirMarco="incluirMarco"
                            v-model:anchoMarco="anchoMarco"
                        />
                    </div>

                    <div class="col-lg-4">
                        <InputPlaca
                            v-model:sheetHeight="sheetHeight"
                            v-model:sheetWidth="sheetWidth"
                            v-model:boardPrice="boardPrice"
                            v-model:kerfWidth="kerfWidth"
                        />
                    </div>
                </div>

                <ResultsBanner
                    :resultadoCorte="resultadoCorte"
                    :efficiency="efficiency"
                />

                <div v-if="!resultadoCorte.error && resultadoCorte.count > 0" class="optimization-info">
                    <h5 class="fw-bold mb-2">Analisis de Aprovechamiento</h5>
                    <p class="mb-2">Material utilizado vs. disponible en las placas</p>
                    <div class="efficiency-bar">
                        <div class="efficiency-fill" :style="{width: efficiency + '%'}">
                            {{ efficiency }}% aprovechado
                        </div>
                    </div>
                    <small class="text-muted d-block mt-2">
                        Area total piezas: {{ totalPiecesArea.toFixed(2) }} cm2 |
                        Area total placas: {{ totalBoardsArea.toFixed(2) }} cm2 |
                        Desperdicio: {{ wasteArea.toFixed(2) }} cm2 ({{ (100 - efficiency).toFixed(1) }}%)
                    </small>
                </div>

                <div class="section-divider"></div>

                <div class="mb-4">
                    <h3 class="text-center mb-3 fw-bold">Visualizacion 3D Interactiva</h3>
                    <div id="renderer-container" ref="rendererContainer" role="img" aria-label="Visualizacion 3D del mueble">
                        <!-- Estado: Cargando Three.js (lazy loading) -->
                        <div v-if="isThreeLoading && !isThreeLoaded" class="renderer-placeholder">
                            <div class="loading-spinner mb-2"></div>
                            <div>Descargando libreria 3D...</div>
                            <small class="text-muted mt-2 d-block">Three.js se carga bajo demanda para mejorar el rendimiento</small>
                        </div>
                        <!-- Estado: Error al cargar Three.js -->
                        <div v-else-if="threeLoadError" class="renderer-placeholder text-danger" role="alert">
                            <div class="mb-2">Error de carga</div>
                            <div>{{ threeLoadError }}</div>
                            <button @click="location.reload()" class="btn btn-sm btn-outline-danger mt-3">
                                Recargar pagina
                            </button>
                        </div>
                        <!-- Estado: Three.js cargado, inicializando renderer -->
                        <div v-else-if="isThreeLoaded && !isRendererReady" class="renderer-placeholder">
                            <div class="loading-spinner mb-2"></div>
                            <div>Inicializando visor 3D...</div>
                        </div>
                        <!-- Estado: Renderer listo pero con error en modelo -->
                        <div v-if="isRendererReady && renderError" class="renderer-placeholder text-danger">
                            Error: {{ renderError }}
                        </div>
                    </div>

                    <div class="controls-panel">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="control-section">
                                    <h4>Visibilidad de Piezas</h4>
                                    <div v-if="isThreeLoading" class="text-center text-muted">
                                        Cargando libreria 3D...
                                    </div>
                                    <div v-else-if="!isRendererReady" class="text-center text-muted">
                                        Generando controles...
                                    </div>
                                    <template v-else>
                                        <div v-for="(visible, type) in pieceTypeVisibility" :key="type" class="form-check-modern form-check form-switch">
                                            <input class="form-check-input" type="checkbox" :id="'check-' + type" v-model="pieceTypeVisibility[type]">
                                            <label class="form-check-label" :for="'check-' + type">
                                                {{ getPieceLabel(type) }}
                                            </label>
                                        </div>
                                    </template>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="control-section">
                                    <h4>Control de Puertas</h4>
                                    <div v-if="isThreeLoading" class="text-center text-muted">
                                        Cargando libreria 3D...
                                    </div>
                                    <div v-else-if="!isRendererReady" class="text-center text-muted">
                                        Esperando modelo 3D...
                                    </div>
                                    <div v-else class="door-controls">
                                        <button @click="toggleDoorLeft" class="btn btn-modern btn-primary-modern" :disabled="!pieceTypeVisibility['Puerta']" :aria-pressed="isDoorLeftOpen">
                                            {{ isDoorLeftOpen ? 'Cerrar' : 'Abrir' }} Puerta Izq.
                                        </button>
                                        <button @click="toggleDoorRight" class="btn btn-modern btn-primary-modern" :disabled="!pieceTypeVisibility['Puerta']" :aria-pressed="isDoorRightOpen">
                                            {{ isDoorRightOpen ? 'Cerrar' : 'Abrir' }} Puerta Der.
                                        </button>
                                        <button @click="resetCamera" class="btn btn-modern btn-success-modern">
                                            Resetear Vista
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section-divider"></div>

                <DesgloseTable :piezasCalculadas="piezasCalculadas" />

                <div class="section-divider"></div>

                <CuttingPlans
                    :resultadoCorte="resultadoCorte"
                    :sheetWidth="sheetWidth"
                    :sheetHeight="sheetHeight"
                    :piezasCalculadas="piezasCalculadas"
                />

                <div class="info-note">
                    <h5 class="fw-bold mb-3">Notas Importantes y Recomendaciones</h5>
                    <ul class="mb-0">
                        <li class="mb-2">
                            <strong>Metodo de Construccion:</strong> Este mueble sigue el diseno estandar donde los laterales tienen la altura total, la base y tapa van entre laterales, y las puertas se montan al frente.
                        </li>
                        <li class="mb-2" v-if="incluirMarco">
                            <strong>Marco Interno:</strong> El marco perimetral se monta en el frente del mueble para dar soporte a las puertas. La barra divisoria central se coloca verticalmente tapando el espacio entre puertas.
                        </li>
                        <li class="mb-2">
                            <strong>Antes de Cortar:</strong> Siempre verifique las medidas calculadas. Esta es una herramienta de estimacion y debe validarse manualmente antes de realizar los cortes.
                        </li>
                        <li class="mb-2">
                            <strong>Servicio de Corte:</strong> Muchas madereras en Argentina (Sodimac, Easy, etc.) ofrecen servicio de corte profesional, a veces gratuito para un numero limitado de cortes rectos. Consulte antes de comprar!
                        </li>
                        <li class="mb-2">
                            <strong>Ensamblado Profesional:</strong> Use sargentos o prensas para sujetar las piezas antes de atornillar. Realice siempre una perforacion guia para evitar que el MDF se raje.
                        </li>
                        <li class="mb-2">
                            <strong>Acabado de Calidad:</strong> Para mejor resultado, aplique una base selladora, lije con lijas progresivas (220-360-600), y use esmalte sintetico o acrilico para el acabado final.
                        </li>
                        <li class="mb-2">
                            <strong>Consideracion del Kerf:</strong> El ancho de corte configurado afecta el aprovechamiento del material. Un valor tipico es 3-4mm para sierras circulares estandar.
                        </li>
                    </ul>
                </div>

                <div class="info-note info-note-warning mt-3">
                    <p class="mb-0">
                        <strong>Descargo de Responsabilidad:</strong> Esta calculadora fue desarrollada como herramienta educativa y de estimacion. Los calculos son aproximaciones y pueden contener errores.
                        <strong class="text-danger">NO debe usarse como plano profesional sin validacion exhaustiva.</strong> El uso es bajo su exclusiva responsabilidad.
                    </p>
                </div>
            </main>
        </div>

        <p class="text-center text-white mt-4 small">
            Desarrollado por smsdev00 | v2.1 Mejorada con IA | Licencia MIT
        </p>
    </div>
</template>

<script setup>
import { defaults } from './config/constants'
import { usePiezas } from './composables/usePiezas'
import { useCorte } from './composables/useCorte'
import { useThreeRenderer } from './composables/useThreeRenderer'
import { useLocalStorage } from './composables/useLocalStorage'
import { getPieceLabel } from './utils/formatters'

// Componentes
import InputDimensiones from './components/InputDimensiones.vue'
import InputMarco from './components/InputMarco.vue'
import InputPlaca from './components/InputPlaca.vue'
import ResultsBanner from './components/ResultsBanner.vue'
import DesgloseTable from './components/DesgloseTable.vue'
import CuttingPlans from './components/CuttingPlans.vue'

// Refs de entrada - dimensiones del mueble (persistidos en localStorage)
const largo = useLocalStorage('cabinet_largo', defaults.largo)
const ancho = useLocalStorage('cabinet_ancho', defaults.ancho)
const alto = useLocalStorage('cabinet_alto', defaults.alto)
const espesor = useLocalStorage('cabinet_espesor', defaults.espesor)
const luzPuertas = useLocalStorage('cabinet_luzPuertas', defaults.luzPuertas)

// Refs de entrada - marco (persistidos en localStorage)
const incluirMarco = useLocalStorage('cabinet_incluirMarco', defaults.incluirMarco)
const anchoMarco = useLocalStorage('cabinet_anchoMarco', defaults.anchoMarco)

// Refs de entrada - placa MDF (persistidos en localStorage)
const sheetHeight = useLocalStorage('cabinet_sheetHeight', defaults.sheetHeight)
const sheetWidth = useLocalStorage('cabinet_sheetWidth', defaults.sheetWidth)
const boardPrice = useLocalStorage('cabinet_boardPrice', defaults.boardPrice)
const kerfWidth = useLocalStorage('cabinet_kerfWidth', defaults.kerfWidth)

// Composable para calculo de piezas
const { piezasCalculadas } = usePiezas({
    largo,
    ancho,
    alto,
    espesor,
    luzPuertas,
    incluirMarco,
    anchoMarco
})

// Composable para calculo de corte
const { resultadoCorte, totalPiecesArea, totalBoardsArea, wasteArea, efficiency } = useCorte(
    piezasCalculadas,
    { sheetHeight, sheetWidth, boardPrice, kerfWidth }
)

// Composable para renderizado 3D (con lazy loading de Three.js)
const {
    rendererContainer,
    isRendererReady,
    renderError,
    pieceTypeVisibility,
    isDoorLeftOpen,
    isDoorRightOpen,
    resetCamera,
    toggleDoorLeft,
    toggleDoorRight,
    // Estados de lazy loading
    isThreeLoaded,
    isThreeLoading,
    threeLoadError
} = useThreeRenderer(
    { largo, ancho, alto, espesor, luzPuertas },
    incluirMarco,
    anchoMarco
)
</script>
