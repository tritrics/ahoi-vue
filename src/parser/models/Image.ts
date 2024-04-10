import { extend } from '../../fn'
import { createFile, createThumb } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: image
 */
export default function createImage(obj: JSONObject): ParserModel {
  const inject: Object = {
    $type: 'image',
    $thumb(
      width: number|null = null,
      height: number|null = null,
      options: Object = {}
    ): ParserModel
    {
      return createThumb(obj.meta, width, height, options)
    },
  }
  return extend(createFile(obj), inject) as ParserModel
}