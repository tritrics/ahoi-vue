import type { ParserModel } from '../../types'
import type { ImageOptions, ImageModel } from '../types'

export interface Props {
  model: ParserModel|ImageModel,
  width?: number,
  height?: number,
  options?: ImageOptions
}