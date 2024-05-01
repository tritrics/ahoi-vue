import type { CoreModel } from '../../types'
import type { IImageOptions, IImage } from '../types'

export interface Props {
  model: CoreModel|IImage,
  width?: number,
  height?: number,
  options?: IImageOptions
}