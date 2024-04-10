/**
 * Image params for thumbs
 */
export interface ImageParams {
  crop?: boolean
  blur?: number
  bw?: boolean
  quality?: number
  title?: string
}

/**
 * The image object with basic properties
 */
export interface ImageModel {
  width: number,
  height: number,
  ext: string,
  dir: string,
  filename: string,
  [ index: string ]: any
}

/**
 * Image crop params
 */
export type ImageCropParams =
  'top-left' |
  'top' |
  'top-right' |
  'left' |
  'center' |
  'right' |
  'bottom-left' |
  'bottom' |
  'bottom-right'