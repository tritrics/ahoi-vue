import { createThumb as createThumbInstance } from '../../images'
import type { Object, JSONObject, ParserModel, ImageParams, ImageCropParams } from '../../types'

/**
 * Model for thumb, used by model Image
 */
export default function createThumb(
  image: JSONObject,
  width: number|null = null,
  height: number|null = null,
  params: ImageParams = {}
): ParserModel {
  const thumb: Object = {
    $type: 'thumb',
    $value: createThumbInstance(image, width, height, params),
    $val() {
      return this.$value.params
    },

    // Option-Functions are chainable
    $dim(width: number|null, height: number|null|undefined) {
      this.$value.dim(width, height)
      return this
    },
    $crop(crop: ImageCropParams|boolean) {
      this.$value.crop(crop)
      return this
    },
    $blur(blur: number) {
      this.$value.blur(blur)
      return this
    },
    $bw() {
      this.$value.bw()
      return this
    },
    $quality(quality: number) {
      this.$value.quality(quality)
      return this
    },
    $attr(asString: boolean = false): string|Object {
      return this.$value.attr(asString)
    },
    $tag(): string {
      return this.$value.tag()
    },
    async $preload(): Promise<any> {
      return this.$value.preload()
    },
    $str(): string {
      return this.$tag()
    },
  }
  return Object.create(thumb) as ParserModel
}
