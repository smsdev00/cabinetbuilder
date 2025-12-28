<template>
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
</template>

<script setup>
import { formatDecimal } from '../utils/formatters'

defineProps({
    piezasCalculadas: {
        type: Array,
        required: true
    }
})
</script>
