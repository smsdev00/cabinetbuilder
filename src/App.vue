<template>
    <div class="container-fluid">
        <div class="main-card">
            <div class="header-section">
                <h1>Calculadora Optimizada de Corte MDF</h1>
                <div class="version">Version 2.1 - Con Marco Interno Opcional</div>
            </div>

            <div class="p-4">
                <div class="row g-4 mb-4">
                    <div class="col-lg-4">
                        <div class="input-card card">
                            <div class="card-header">
                                Dimensiones del Mueble
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="largo" class="form-label">Largo (cm)</label>
                                        <input type="number" id="largo" class="form-control" v-model.number="largo" min="1" step="0.1">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="ancho" class="form-label">Ancho/Profundidad (cm)</label>
                                        <input type="number" id="ancho" class="form-control" v-model.number="ancho" min="1" step="0.1">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="alto" class="form-label">Alto (cm)</label>
                                        <input type="number" id="alto" class="form-control" v-model.number="alto" min="1" step="0.1">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="espesor" class="form-label">Espesor Material (mm)</label>
                                        <select id="espesor" class="form-select" v-model.number="espesor">
                                            <option :value="5.5">5.5mm (Fino)</option>
                                            <option :value="9">9mm (Estandar)</option>
                                            <option :value="12">12mm (Medio)</option>
                                            <option :value="15">15mm (Grueso)</option>
                                            <option :value="18">18mm (Extra Grueso)</option>
                                        </select>
                                    </div>
                                    <div class="col-12">
                                        <label for="luzPuertas" class="form-label">Separacion entre Puertas (cm)</label>
                                        <input type="number" id="luzPuertas" class="form-control" v-model.number="luzPuertas" min="0" max="5" step="0.1">
                                        <small class="text-muted">Espacio entre las dos puertas frontales</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="input-card card">
                            <div class="card-header">
                                Marco Interno (Opcional)
                            </div>
                            <div class="card-body">
                                <div class="form-check-modern form-check form-switch mb-3">
                                    <input class="form-check-input" type="checkbox" id="incluirMarco" v-model="incluirMarco">
                                    <label class="form-check-label" for="incluirMarco">
                                        Incluir Marco Interno
                                    </label>
                                </div>

                                <div v-if="incluirMarco" class="row g-3">
                                    <div class="col-12">
                                        <label for="anchoMarco" class="form-label">Ancho del Marco (cm)</label>
                                        <input type="number" id="anchoMarco" class="form-control" v-model.number="anchoMarco" min="1" max="10" step="0.1">
                                        <small class="text-muted">Ancho de las tiras del marco perimetral</small>
                                    </div>
                                    <div class="col-12">
                                        <div class="alert alert-info mb-0">
                                            <strong>Nota:</strong> El marco incluye:
                                            <ul class="mb-0 mt-2 small">
                                                <li>Tiras laterales (2)</li>
                                                <li>Tira superior (1)</li>
                                                <li>Tira inferior (1)</li>
                                                <li>Barra divisoria central (1)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div v-else class="text-center text-muted py-4">
                                    <p>Active esta opcion para agregar un marco donde apoyaran las puertas</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="input-card card">
                            <div class="card-header">
                                Datos de la Placa MDF
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="sheetHeight" class="form-label">Alto Placa (cm)</label>
                                        <input type="number" id="sheetHeight" class="form-control" v-model.number="sheetHeight" min="1">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="sheetWidth" class="form-label">Ancho Placa (cm)</label>
                                        <input type="number" id="sheetWidth" class="form-control" v-model.number="sheetWidth" min="1">
                                    </div>
                                    <div class="col-12">
                                        <label for="boardPrice" class="form-label">Precio por Placa ($)</label>
                                        <input type="number" id="boardPrice" class="form-control" v-model.number="boardPrice" min="0" step="any">
                                    </div>
                                    <div class="col-12">
                                        <label for="kerfWidth" class="form-label">Ancho de Corte/Kerf (mm)</label>
                                        <input type="number" id="kerfWidth" class="form-control" v-model.number="kerfWidth" min="0" max="10" step="0.1">
                                        <small class="text-muted">Perdida de material por corte de sierra</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div :class="['results-banner', resultadoCorte.error ? 'error' : '']">
                    <div class="text-center">
                        <div v-if="!resultadoCorte.error">
                            <div class="stat-box">
                                <span class="stat-label">Placas:</span>
                                <span class="stat-value">{{ resultadoCorte.count }}</span>
                            </div>
                            <div class="stat-box">
                                <span class="stat-label">Costo:</span>
                                <span class="stat-value">{{ formatCurrency(resultadoCorte.totalPrice) }}</span>
                            </div>
                            <div class="stat-box">
                                <span class="stat-label">Eficiencia:</span>
                                <span class="stat-value">{{ efficiency }}%</span>
                            </div>
                        </div>
                        <div v-else class="text-white">
                            <strong>Error:</strong> {{ resultadoCorte.error }}
                        </div>
                    </div>
                </div>

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
                    <div id="renderer-container" ref="rendererContainer">
                        <div v-if="!isRendererReady" class="renderer-placeholder">
                            <div class="loading-spinner mb-2"></div>
                            <div>Cargando visor 3D...</div>
                        </div>
                        <div v-if="isRendererReady && renderError" class="renderer-placeholder text-danger">
                            Error: {{ renderError }}
                        </div>
                    </div>

                    <div class="controls-panel">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="control-section">
                                    <h4>Visibilidad de Piezas</h4>
                                    <div v-if="!isRendererReady" class="text-center text-muted">
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
                                    <div v-if="!isRendererReady" class="text-center text-muted">
                                        Esperando modelo 3D...
                                    </div>
                                    <div v-else class="door-controls">
                                        <button @click="toggleDoorLeft" class="btn btn-modern btn-primary-modern" :disabled="!pieceTypeVisibility['Puerta']">
                                            {{ isDoorLeftOpen ? 'Cerrar' : 'Abrir' }} Puerta Izq.
                                        </button>
                                        <button @click="toggleDoorRight" class="btn btn-modern btn-primary-modern" :disabled="!pieceTypeVisibility['Puerta']">
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

                <div class="mb-4">
                    <h3 class="text-center mb-3 fw-bold">Despiece Detallado</h3>
                    <div class="table-responsive">
                        <table class="table table-modern table-striped table-hover">
                            <thead class="text-white">
                                <tr>
                                    <th>Pieza</th>
                                    <th>Cod.</th>
                                    <th>Cant.</th>
                                    <th>Medida 1 (cm)</th>
                                    <th>Medida 2 (cm)</th>
                                    <th>Color</th>
                                    <th>Area (cm2)</th>
                                    <th>Notas</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="piezasCalculadas.length === 0 || piezasCalculadas[0].etiqueta === 'Error'">
                                    <td colspan="8" class="text-center fst-italic text-muted">
                                        {{ piezasCalculadas.length > 0 ? piezasCalculadas[0].dim1 : 'Ingrese dimensiones validas.' }}
                                    </td>
                                </tr>
                                <tr v-else v-for="pieza in piezasCalculadas" :key="pieza.etiqueta + pieza.dim1 + pieza.dim2">
                                    <td class="fw-bold">{{ pieza.etiqueta }}</td>
                                    <td><span class="badge bg-secondary">{{ pieza.shortCode }}</span></td>
                                    <td>{{ pieza.cantidad }}</td>
                                    <td>{{ formatDecimal(pieza.dim1) }}</td>
                                    <td>{{ formatDecimal(pieza.dim2) }}</td>
                                    <td><span class="piece-color-indicator" :style="{ backgroundColor: pieza.color }"></span></td>
                                    <td>{{ formatDecimal(pieza.dim1 * pieza.dim2 * pieza.cantidad) }}</td>
                                    <td class="small">{{ pieza.nota || '-' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="section-divider"></div>

                <div class="mb-4">
                    <h3 class="text-center mb-3 fw-bold">Planos de Corte Optimizados</h3>
                    <p v-if="resultadoCorte.count > 0 && !resultadoCorte.error" class="text-center text-muted mb-4">
                        Distribucion optimizada de piezas en las placas MDF
                    </p>
                    <div v-if="resultadoCorte.boardData && resultadoCorte.boardData.length > 0 && !resultadoCorte.error" class="row">
                        <div v-for="board in resultadoCorte.boardData" :key="board.id" class="col-lg-6 mb-4">
                            <div class="board-header">
                                Placa #{{ board.id }}
                                <small class="text-muted">({{ board.pieces.length }} piezas)</small>
                            </div>
                            <div class="sheet-layout-container" :style="{ aspectRatio: sheetWidth / sheetHeight, maxWidth: '600px' }">
                                <div v-for="piece in board.pieces" :key="piece.id"
                                     class="placed-piece"
                                     :style="getPieceStyle(piece, sheetWidth, sheetHeight)"
                                     :title="getPieceTooltip(piece)">
                                    {{ piece.shortCode }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="!resultadoCorte.error && piezasCalculadas.length > 0 && piezasCalculadas[0].etiqueta !== 'Error'"
                         class="text-center text-muted fst-italic">
                        No se generaron planos de corte. Verifique las dimensiones.
                    </div>
                </div>

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
            </div>
        </div>

        <p class="text-center text-white mt-4 small">
            Desarrollado por smsdev00 | v2.1 Mejorada con IA | Licencia MIT
        </p>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { defaults } from './config/constants'
import { usePiezas } from './composables/usePiezas'
import { useCorte } from './composables/useCorte'
import { useThreeRenderer } from './composables/useThreeRenderer'
import { formatDecimal, formatCurrency, getPieceStyle, getPieceTooltip, getPieceLabel } from './utils/formatters'

// Refs de entrada - dimensiones del mueble
const largo = ref(defaults.largo)
const ancho = ref(defaults.ancho)
const alto = ref(defaults.alto)
const espesor = ref(defaults.espesor)
const luzPuertas = ref(defaults.luzPuertas)

// Refs de entrada - marco
const incluirMarco = ref(defaults.incluirMarco)
const anchoMarco = ref(defaults.anchoMarco)

// Refs de entrada - placa MDF
const sheetHeight = ref(defaults.sheetHeight)
const sheetWidth = ref(defaults.sheetWidth)
const boardPrice = ref(defaults.boardPrice)
const kerfWidth = ref(defaults.kerfWidth)

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

// Composable para renderizado 3D
const {
    rendererContainer,
    isRendererReady,
    renderError,
    pieceTypeVisibility,
    isDoorLeftOpen,
    isDoorRightOpen,
    resetCamera,
    toggleDoorLeft,
    toggleDoorRight
} = useThreeRenderer(
    { largo, ancho, alto, espesor, luzPuertas },
    incluirMarco,
    anchoMarco
)
</script>
