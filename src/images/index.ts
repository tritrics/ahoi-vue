import { has } from '../fn'
import Image from './Image'
import TricImage from './components/TricImage.vue'
import type { ApiPlugin, ImageModel, ImageOptions, JSONObject } from '../types'

/**
 * Create a Thumb instance with handy image resizing and handling methods.
 */
export function createImage(
  image: JSONObject|ImageModel,
  width: number|null = null,
  height: number|null = null,
  options: ImageOptions = {}
): Image
{
  // parser object given
  if (has(image, '$meta')) {
    return new Image(image.$meta, width, height, options)
  }
  
  // raw file object given
  else if (has(image, 'meta')) {
    return new Image(image.meta, width, height, options)
  }

  // image-node given
  return new Image(image as ImageModel, width, height, options)
}

/**
 * Plugin
 */
export function createImages(): ApiPlugin {
  return {
    id: 'tric-vue-images-plugin',
    name: 'images',
    components: {
      'TricImage': TricImage
    },
    export: {
      createImage,
    }
  }
}
