import { extend } from '../../fn'
import { createString } from './index'
import type { Object, FormModel } from '../../types'

/**
 * Text field (multisingle line)
 * Kirby: Textarea, Writer
 */
export default function createText(def: Object): FormModel {
  const inject: Object = {
    type: 'text',
    linebreaks: true,
  }
  return extend(createString(def), inject) as FormModel
}