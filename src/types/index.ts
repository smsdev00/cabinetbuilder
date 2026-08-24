/**
 * Interfaces para el proyecto CabinetBuilder
 */

/** Tipos de pieza disponibles */
export type PieceType = 'Base' | 'Tapa' | 'Lateral' | 'Puerta' | 'Trasera' | 'Marco' | 'Marco Lateral' | 'Marco Superior' | 'Marco Inferior' | 'Barra Divisoria' | 'Error'

/** Pieza calculada con sus dimensiones */
export interface Pieza {
  etiqueta: string
  cantidad: number
  dim1: number
  dim2: number
  color: string
  shortCode: string
  nota?: string
}

/** Espacio disponible en una hoja/placa */
export interface Espacio {
  x: number
  y: number
  w: number
  h: number
}

/** Pieza colocada en una hoja - extiende las propiedades de posicion */
export interface PiezaColocada {
  id: number
  x: number
  y: number
  w: number
  h: number
  etiqueta: string
  color: string
  shortCode: string
  originalDim1: number
  originalDim2: number
  rotated?: boolean
}

/** Hoja/Placa con piezas colocadas y espacios disponibles */
export interface Hoja {
  id: number
  ocupados: PiezaColocada[]
  espacios: Espacio[]
}

/** Datos de una placa para visualizacion */
export interface BoardData {
  id: number
  pieces: PiezaColocada[]
}

/** Resultado del algoritmo de corte */
export interface ResultadoCorte {
  count: number
  totalPrice: number
  boardData: BoardData[]
  error: string | null
}

/** Configuracion por defecto del sistema */
export interface Defaults {
  largo: number
  ancho: number
  alto: number
  espesor: number
  sheetHeight: number
  sheetWidth: number
  boardPrice: number
  luzPuertas: number
  kerfWidth: number
  anchoMarco: number
  incluirMarco: boolean
}

/** Mapa de colores por tipo de pieza */
export type ColorMap = Record<string, string>

/** Mapa de codigos cortos por tipo de pieza */
export type ShortCodeMap = Record<string, string>

/** Mapa de etiquetas por tipo de pieza */
export type PieceLabelsMap = Record<string, string>

/** Pieza interna usada durante el proceso de packing */
export interface PiezaInterna {
  id: number
  w: number
  h: number
  area: number
  etiqueta: string
  color: string
  shortCode: string
  originalDim1: number
  originalDim2: number
  kerf: number
}

/** Resultado de verificacion de colocacion */
export interface ResultadoColocacion {
  cabe: boolean
  necesitaRotar: boolean
}

/** Estilo CSS para una pieza en el plano de corte */
export interface PieceStyle {
  position: string
  left: string
  top: string
  width: string
  height: string
  backgroundColor: string
}
