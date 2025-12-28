<template>
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
                    <input type="number" id="kerfWidth" class="form-control" v-model.number="kerfWidth" min="0" max="10" step="0.1" aria-describedby="kerfWidth-help">
                    <small id="kerfWidth-help" class="text-muted">Perdida de material por corte de sierra</small>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const sheetHeight = defineModel('sheetHeight', { type: Number })
const sheetWidth = defineModel('sheetWidth', { type: Number })
const boardPrice = defineModel('boardPrice', { type: Number })
const kerfWidth = defineModel('kerfWidth', { type: Number })
</script>
