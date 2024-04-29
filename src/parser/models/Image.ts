import { extend } from '../../fn'
import { createFile } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: image
 */
export default function createImage(obj: JSONObject): ParserModel {
  const inject: Object = {
    type: 'image',
  }
  return extend(createFile(obj), inject) as ParserModel
}