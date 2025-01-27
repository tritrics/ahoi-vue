import type { CoreModel } from '../../types'
import type { IThumbOptions, IImageModel } from '../types'

export interface Props {
  model: CoreModel|IImageModel
  width?: number
  height?: number
  options?: IThumbOptions
  background?: boolean
}