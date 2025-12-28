<template>
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
            <div v-else class="text-white" role="alert" aria-live="assertive">
                <strong>Error:</strong> {{ resultadoCorte.error }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatCurrency } from '../utils/formatters'

defineProps({
    resultadoCorte: {
        type: Object,
        required: true
    },
    efficiency: {
        type: Number,
        required: true
    }
})
</script>
