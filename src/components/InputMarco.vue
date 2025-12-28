<template>
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
                    <input type="number" id="anchoMarco" class="form-control" v-model.number="anchoMarco" min="1" max="10" step="0.1" aria-describedby="anchoMarco-help">
                    <small id="anchoMarco-help" class="text-muted">Ancho de las tiras del marco perimetral</small>
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
</template>

<script setup>
const incluirMarco = defineModel('incluirMarco', { type: Boolean })
const anchoMarco = defineModel('anchoMarco', { type: Number })
</script>
