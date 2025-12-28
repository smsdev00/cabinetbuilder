import { formatDecimal } from '../utils/formatters'

export function fitPiezasEnTablas(piezasInput, sheetW, sheetH, kerf) {
    const hojas = []
    let globalPieceIdCounter = 1
    const kerfCm = kerf / 10

    function crearHoja(id) {
        return {
            id: id,
            ocupados: [],
            espacios: [{ x: 0, y: 0, w: sheetW, h: sheetH }]
        }
    }

    function puedeColocar(pw, ph, sp) {
        const wWithKerf = pw + kerfCm
        const hWithKerf = ph + kerfCm
        const normal = wWithKerf <= sp.w && hWithKerf <= sp.h
        const rotated = hWithKerf <= sp.w && wWithKerf <= sp.h
        return { cabe: normal || rotated, necesitaRotar: !normal && rotated }
    }

    function colocarPiezaEnHoja(hoja, pOrig) {
        hoja.espacios.sort((a, b) => {
            const areaA = a.w * a.h
            const areaB = b.w * b.h
            return areaA - areaB
        })

        for (let i = 0; i < hoja.espacios.length; i++) {
            const sp = hoja.espacios[i]
            const { cabe, necesitaRotar } = puedeColocar(pOrig.w, pOrig.h, sp)

            if (cabe) {
                const rotar = necesitaRotar
                const w = rotar ? pOrig.h : pOrig.w
                const h = rotar ? pOrig.w : pOrig.h

                hoja.ocupados.push({
                    id: pOrig.id,
                    x: sp.x,
                    y: sp.y,
                    w: w,
                    h: h,
                    etiqueta: pOrig.etiqueta,
                    color: pOrig.color,
                    shortCode: pOrig.shortCode,
                    originalDim1: pOrig.originalDim1,
                    originalDim2: pOrig.originalDim2
                })

                hoja.espacios.splice(i, 1)

                const kerfCmLocal = pOrig.kerf / 10
                const remainW = sp.w - w - kerfCmLocal
                const remainH = sp.h - h - kerfCmLocal

                if (remainW > 0.1) {
                    hoja.espacios.push({
                        x: sp.x + w + kerfCmLocal,
                        y: sp.y,
                        w: remainW,
                        h: h
                    })
                }

                if (remainH > 0.1) {
                    hoja.espacios.push({
                        x: sp.x,
                        y: sp.y + h + kerfCmLocal,
                        w: sp.w,
                        h: remainH
                    })
                }

                return true
            }
        }
        return false
    }

    let todas = []
    for (const pIn of piezasInput) {
        const pw = pIn.dim1
        const ph = pIn.dim2
        const kerfCmLocal = kerf / 10

        if (!((pw + kerfCmLocal <= sheetH && ph + kerfCmLocal <= sheetW) ||
              (pw + kerfCmLocal <= sheetW && ph + kerfCmLocal <= sheetH))) {
            throw new Error(`Pieza ${pIn.etiqueta} (${formatDecimal(pw)}x${formatDecimal(ph)}) no cabe en la placa.`)
        }

        for (let i = 0; i < pIn.cantidad; i++) {
            todas.push({
                id: globalPieceIdCounter++,
                w: pw,
                h: ph,
                area: pw * ph,
                etiqueta: pIn.etiqueta,
                color: pIn.color,
                shortCode: pIn.shortCode,
                originalDim1: pw,
                originalDim2: ph,
                kerf: kerf
            })
        }
    }

    todas.sort((a, b) => b.area - a.area)

    for (const p of todas) {
        let colocada = false

        for (const h of hojas) {
            if (colocarPiezaEnHoja(h, p)) {
                colocada = true
                break
            }
        }

        if (!colocada) {
            const nH = crearHoja(hojas.length + 1)
            if (colocarPiezaEnHoja(nH, p)) {
                hojas.push(nH)
            } else {
                throw new Error(`No se pudo colocar pieza ${p.etiqueta}`)
            }
        }
    }

    return hojas
}
