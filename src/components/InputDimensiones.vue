<template>
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
                    <input type="number" id="luzPuertas" class="form-control" v-model.number="luzPuertas" min="0" max="5" step="0.1" aria-describedby="luzPuertas-help">
                    <small id="luzPuertas-help" class="text-muted">Espacio entre las dos puertas frontales</small>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const largo = defineModel('largo', { type: Number })
const ancho = defineModel('ancho', { type: Number })
const alto = defineModel('alto', { type: Number })
const espesor = defineModel('espesor', { type: Number })
const luzPuertas = defineModel('luzPuertas', { type: Number })
</script>
