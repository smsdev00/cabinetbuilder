import { ref, watch, onMounted, onBeforeUnmount, nextTick, markRaw } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { colorMap } from '../config/constants'
import { debounce } from '../utils/debounce'

export function useThreeRenderer(dimensionRefs, incluirMarco, anchoMarco) {
    const { largo, ancho, alto, espesor, luzPuertas } = dimensionRefs

    const rendererContainer = ref(null)
    const scene = ref(null)
    const camera = ref(null)
    const renderer = ref(null)
    const controls = ref(null)
    const furnitureGroup = ref(null)
    const isRendererReady = ref(false)
    const renderError = ref(null)
    const doorLeftPivotRef = ref(null)
    const doorRightPivotRef = ref(null)
    const pieceTypeVisibility = ref({
        Base: true,
        Tapa: true,
        Lateral: true,
        Puerta: true,
        Trasera: true,
        Marco: true
    })
    const isDoorLeftOpen = ref(false)
    const isDoorRightOpen = ref(false)

    let animationFrameId = null
    const doorOpenAngle = Math.PI / 1.8

    // Debounced version of updateFurnitureModel to prevent excessive renders
    const debouncedUpdateModel = debounce(() => {
        if (isRendererReady.value) {
            updateFurnitureModel()
        }
    }, 250)

    function fitCameraToObject(cam, object, ctrl, offset = 1.5) {
        const boundingBox = new THREE.Box3()
        boundingBox.setFromObject(object)

        const center = new THREE.Vector3()
        boundingBox.getCenter(center)

        const size = new THREE.Vector3()
        boundingBox.getSize(size)

        const maxDim = Math.max(size.x, size.y, size.z)
        const fov = cam.fov * (Math.PI / 180)
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))
        cameraZ *= offset

        cam.position.x = center.x + cameraZ * 0.7
        cam.position.y = center.y + cameraZ * 0.5
        cam.position.z = center.z + cameraZ

        const minZ = boundingBox.min.z
        const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ
        cam.far = cameraToFarEdge * 3
        cam.updateProjectionMatrix()

        if (ctrl) {
            ctrl.target.copy(center)
            ctrl.saveState()
            ctrl.update()
        }
    }

    function onWindowResize() {
        if (!camera.value || !renderer.value || !rendererContainer.value) return
        const container = rendererContainer.value
        camera.value.aspect = container.clientWidth / container.clientHeight
        camera.value.updateProjectionMatrix()
        renderer.value.setSize(container.clientWidth, container.clientHeight)
    }

    const resetCamera = () => {
        if (furnitureGroup.value && camera.value && controls.value) {
            fitCameraToObject(camera.value, furnitureGroup.value, controls.value)
        }
    }

    const toggleDoorLeft = () => {
        isDoorLeftOpen.value = !isDoorLeftOpen.value
    }

    const toggleDoorRight = () => {
        isDoorRightOpen.value = !isDoorRightOpen.value
    }

    function initThreeJS() {
        if (!rendererContainer.value || !THREE) return

        try {
            const _scene = new THREE.Scene()
            _scene.background = new THREE.Color(0x1e293b)
            scene.value = markRaw(_scene)

            const container = rendererContainer.value
            const aspect = container.clientWidth / container.clientHeight
            const _camera = new THREE.PerspectiveCamera(50, aspect, 1, 2000)
            _camera.position.set(100, 100, 150)
            camera.value = markRaw(_camera)

            scene.value.add(new THREE.AmbientLight(0xffffff, 0.7))
            const dirLight = new THREE.DirectionalLight(0xffffff, 0.9)
            dirLight.position.set(0.5, 1, 1)
            scene.value.add(dirLight)

            const _renderer = new THREE.WebGLRenderer({ antialias: true })
            _renderer.setSize(container.clientWidth, container.clientHeight)
            _renderer.setPixelRatio(window.devicePixelRatio)
            renderer.value = markRaw(_renderer)
            container.appendChild(renderer.value.domElement)

            const _controls = new OrbitControls(camera.value, renderer.value.domElement)
            _controls.enableDamping = true
            _controls.dampingFactor = 0.1
            _controls.screenSpacePanning = false
            controls.value = markRaw(_controls)

            const _furnitureGroup = new THREE.Group()
            furnitureGroup.value = markRaw(_furnitureGroup)
            scene.value.add(furnitureGroup.value)

            animate()
            isRendererReady.value = true
            renderError.value = null
            window.addEventListener('resize', onWindowResize)
        } catch (error) {
            console.error("Error inicializando Three.js:", error)
            renderError.value = "No se pudo iniciar el visor 3D."
            isRendererReady.value = false
        }
    }

    function animate() {
        if (!renderer.value || !scene.value || !camera.value) return
        animationFrameId = requestAnimationFrame(animate)
        controls.value.update()

        const targetRotLeft = isDoorLeftOpen.value ? -doorOpenAngle : 0
        const targetRotRight = isDoorRightOpen.value ? doorOpenAngle : 0
        const lerpFactor = 0.1

        if (doorLeftPivotRef.value) {
            doorLeftPivotRef.value.rotation.y = THREE.MathUtils.lerp(
                doorLeftPivotRef.value.rotation.y,
                targetRotLeft,
                lerpFactor
            )
        }

        if (doorRightPivotRef.value) {
            doorRightPivotRef.value.rotation.y = THREE.MathUtils.lerp(
                doorRightPivotRef.value.rotation.y,
                targetRotRight,
                lerpFactor
            )
        }

        renderer.value.render(scene.value, camera.value)
    }

    function updateFurnitureModel() {
        if (!isRendererReady.value || !furnitureGroup.value) return

        while (furnitureGroup.value.children.length > 0) {
            const object = furnitureGroup.value.children[0]
            if (object instanceof THREE.Mesh && object.geometry) {
                object.geometry.dispose()
            }
            furnitureGroup.value.remove(object)
        }

        doorLeftPivotRef.value = null
        doorRightPivotRef.value = null
        renderError.value = null

        const L = parseFloat(largo.value)
        const A = parseFloat(ancho.value)
        const H = parseFloat(alto.value)
        const E_mm = parseFloat(espesor.value)
        const luz = parseFloat(luzPuertas.value)
        const marco = incluirMarco.value
        const anchoM = parseFloat(anchoMarco.value)

        if (isNaN(L) || isNaN(A) || isNaN(H) || isNaN(E_mm) ||
            L <= 0 || A <= 0 || H <= 0 || E_mm <= 0 || isNaN(luz) || luz < 0) {
            renderError.value = "Dimensiones invalidas."
            return
        }

        const E_cm = E_mm / 10

        if (L <= 2 * E_cm || H <= 2 * E_cm) {
            renderError.value = "Dimensiones insuficientes."
            return
        }

        const anchoTotalFrente = L - (2 * E_cm)
        const anchoDisponibleParaPuertas = anchoTotalFrente - luz
        const anchoPuerta = anchoDisponibleParaPuertas / 2

        if (anchoPuerta <= 0.1) {
            renderError.value = "Ancho puertas insuficiente."
            return
        }

        try {
            const materials = {}
            for (const key in colorMap) {
                materials[key] = new THREE.MeshStandardMaterial({
                    color: colorMap[key],
                    roughness: 0.7,
                    metalness: 0.2,
                    side: THREE.DoubleSide
                })
            }

            const addMesh = (pieceType, geometry, position) => {
                const material = materials[pieceType] || materials['Error']
                const mesh = new THREE.Mesh(geometry, material)
                mesh.position.copy(position)
                mesh.userData.pieceType = pieceType
                mesh.visible = pieceTypeVisibility.value[pieceType]
                furnitureGroup.value.add(mesh)
                return mesh
            }

            const baseGeo = new THREE.BoxGeometry(L, E_cm, A)
            addMesh('Base', baseGeo, new THREE.Vector3(0, E_cm / 2, 0))

            const tapaGeo = new THREE.BoxGeometry(L, E_cm, A)
            addMesh('Tapa', tapaGeo, new THREE.Vector3(0, H - E_cm / 2, 0))

            const latGeo = new THREE.BoxGeometry(E_cm, H, A)
            addMesh('Lateral', latGeo, new THREE.Vector3(-L / 2 + E_cm / 2, H / 2, 0))
            addMesh('Lateral', latGeo.clone(), new THREE.Vector3(L / 2 - E_cm / 2, H / 2, 0))

            const traseraW = L - 2 * E_cm
            if (traseraW > 0.1) {
                const traseraGeo = new THREE.BoxGeometry(traseraW, H, E_cm)
                addMesh('Trasera', traseraGeo, new THREE.Vector3(0, H / 2, -A / 2 + E_cm / 2))
            }

            if (marco && anchoM > 0 && !isNaN(anchoM)) {
                const anchoInternoFrente = L - (2 * E_cm)
                const altoMarco = H - (2 * E_cm)
                const profundidadMarco = E_cm
                const zPosMarco = A / 2 - E_cm - profundidadMarco / 2

                const marcoLatGeo = new THREE.BoxGeometry(anchoM, altoMarco, profundidadMarco)
                addMesh('Marco', marcoLatGeo, new THREE.Vector3(-anchoInternoFrente / 2 + anchoM / 2, H / 2, zPosMarco))
                addMesh('Marco', marcoLatGeo.clone(), new THREE.Vector3(anchoInternoFrente / 2 - anchoM / 2, H / 2, zPosMarco))

                const marcoHorizGeo = new THREE.BoxGeometry(anchoInternoFrente - (2 * anchoM), anchoM, profundidadMarco)
                addMesh('Marco', marcoHorizGeo, new THREE.Vector3(0, H - E_cm - anchoM / 2, zPosMarco))
                addMesh('Marco', marcoHorizGeo.clone(), new THREE.Vector3(0, E_cm + anchoM / 2, zPosMarco))

                const barraDivGeo = new THREE.BoxGeometry(anchoM, altoMarco - (2 * anchoM), profundidadMarco)
                addMesh('Marco', barraDivGeo, new THREE.Vector3(0, H / 2, zPosMarco))
            }

            const puertaGeo = new THREE.BoxGeometry(anchoPuerta, H, E_cm)

            const pivotLeft = new THREE.Group()
            pivotLeft.position.set(-L / 2 + E_cm / 2, H / 2, A / 2 - E_cm / 2)
            const puertaIzqMesh = new THREE.Mesh(puertaGeo, materials['Puerta'])
            puertaIzqMesh.position.set(anchoPuerta / 2, 0, 0)
            pivotLeft.add(puertaIzqMesh)
            pivotLeft.userData.pieceType = 'Puerta'
            pivotLeft.visible = pieceTypeVisibility.value['Puerta']
            furnitureGroup.value.add(pivotLeft)
            doorLeftPivotRef.value = markRaw(pivotLeft)

            const pivotRight = new THREE.Group()
            pivotRight.position.set(L / 2 - E_cm / 2, H / 2, A / 2 - E_cm / 2)
            const puertaDerMesh = new THREE.Mesh(puertaGeo.clone(), materials['Puerta'])
            puertaDerMesh.position.set(-anchoPuerta / 2, 0, 0)
            pivotRight.add(puertaDerMesh)
            pivotRight.userData.pieceType = 'Puerta'
            pivotRight.visible = pieceTypeVisibility.value['Puerta']
            furnitureGroup.value.add(pivotRight)
            doorRightPivotRef.value = markRaw(pivotRight)

            if (pivotLeft.visible) {
                pivotLeft.rotation.y = isDoorLeftOpen.value ? -doorOpenAngle : 0
            } else {
                pivotLeft.rotation.y = 0
            }

            if (pivotRight.visible) {
                pivotRight.rotation.y = isDoorRightOpen.value ? doorOpenAngle : 0
            } else {
                pivotRight.rotation.y = 0
            }

            fitCameraToObject(camera.value, furnitureGroup.value, controls.value)
        } catch (error) {
            console.error("Error al generar piezas 3D:", error)
            renderError.value = "Error al generar piezas 3D."
            while (furnitureGroup.value.children.length > 0) {
                furnitureGroup.value.remove(furnitureGroup.value.children[0])
            }
            doorLeftPivotRef.value = null
            doorRightPivotRef.value = null
        }
    }

    function cleanup() {
        cancelAnimationFrame(animationFrameId)
        window.removeEventListener('resize', onWindowResize)

        if (renderer.value) {
            if (scene.value) {
                scene.value.traverse(object => {
                    if (object.geometry) object.geometry.dispose()
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(material => material.dispose())
                        } else {
                            object.material.dispose()
                        }
                    }
                })
            }
            renderer.value.dispose()
            if (rendererContainer.value && renderer.value.domElement) {
                rendererContainer.value.removeChild(renderer.value.domElement)
            }
        }

        if (controls.value) {
            controls.value.dispose()
        }

        isRendererReady.value = false
        doorLeftPivotRef.value = null
        doorRightPivotRef.value = null
    }

    onMounted(() => {
        nextTick(() => {
            initThreeJS()
            if (isRendererReady.value) {
                updateFurnitureModel()
            }
        })
    })

    onBeforeUnmount(() => {
        debouncedUpdateModel.cancel()
        cleanup()
    })

    watch([largo, ancho, alto, espesor, luzPuertas, incluirMarco, anchoMarco], () => {
        debouncedUpdateModel()
    }, { immediate: false })

    watch(pieceTypeVisibility, (newVisibility) => {
        if (!isRendererReady.value || !furnitureGroup.value) return

        furnitureGroup.value.children.forEach(child => {
            const pieceType = child.userData.pieceType
            if (pieceType && newVisibility.hasOwnProperty(pieceType)) {
                const shouldBeVisible = newVisibility[pieceType]

                if (child.visible !== shouldBeVisible) {
                    child.visible = shouldBeVisible

                    if (pieceType === 'Puerta' && !shouldBeVisible) {
                        if (child === doorLeftPivotRef.value || child === doorRightPivotRef.value) {
                            child.rotation.y = 0
                        }
                    }
                }
            }
        })
    }, { deep: true, flush: 'post' })

    return {
        rendererContainer,
        isRendererReady,
        renderError,
        pieceTypeVisibility,
        isDoorLeftOpen,
        isDoorRightOpen,
        resetCamera,
        toggleDoorLeft,
        toggleDoorRight
    }
}
