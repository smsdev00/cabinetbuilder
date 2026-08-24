<template>
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
        <div v-else-if="!resultadoCorte.error && showEmptyMessage"
             class="text-center text-muted fst-italic">
            No se generaron planos de corte. Verifique las dimensiones.
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { getPieceStyle, getPieceTooltip } from '../utils/formatters'

const props = defineProps({
    resultadoCorte: {
        type: Object,
        required: true
    },
    sheetWidth: {
        type: Number,
        required: true
    },
    sheetHeight: {
        type: Number,
        required: true
    },
    piezasCalculadas: {
        type: Array,
        default: () => []
    }
})

const showEmptyMessage = computed(() => {
    return props.piezasCalculadas.length > 0 && props.piezasCalculadas[0].etiqueta !== 'Error'
})
</script>
