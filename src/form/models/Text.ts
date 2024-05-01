import { extend } from '../../fn'
import { createString } from './index'
import type { Object, IFormModel } from '../../types'

/**
 * Text field (multisingle line)
 * Kirby: Textarea, Writer
 */
export default function createText(def: Object): IFormModel {
  const inject: Object = {
    type: 'text',
    linebreaks: true,
  }
  return extend(createString(def), inject) as IFormModel
}