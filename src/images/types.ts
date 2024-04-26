/**
 * Image options for thumbs
 */
export interface ImageOptions {
  width?: number,
  height?: number,
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

export interface ImageDimensions {
  width: number
  height: number
}

/**
 * Image crop options
 */
export type ImageCropOptions =
  'top-left' |
  'top' |
  'top-right' |
  'left' |
  'center' |
  'right' |
  'bottom-left' |
  'bottom' |
  'bottom-right'