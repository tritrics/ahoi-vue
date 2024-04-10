import { has } from '../fn'
import Thumb from './Thumb'
import type { ApiPlugin, ImageModel, ImageParams, JSONObject } from '../types'

/**
 * Create a Thumb instance with handy image resizing and handling methods.
 */
export function createThumb(
  image: JSONObject|ImageModel,
  width: number|null = null,
  height: number|null = null,
  params: ImageParams = {}
): Thumb
{
  // parser object given
  if (has(image, '$meta')) {
    return new Thumb(image.$meta, width, height, params)
  }
  
  // raw file object given
  else if (has(image, 'meta')) {
    return new Thumb(image.meta, width, height, params)
  }

  // image-node given
  return new Thumb(image as ImageModel, width, height, params)
}

/**
 * Plugin
 */
export function createImages(): ApiPlugin {
  return {
    id: 'avlevere-api-vue-images-plugin',
    name: 'images',
    export: {
      createThumb,
    }
  }
}