import type { CoreModel } from '../../types'
import type { IThumbOptions, IThumbImage } from '../types'

export interface Props {
  model: CoreModel|IThumbImage
  width?: number
  height?: number
  options?: IThumbOptions
  background?: boolean
}