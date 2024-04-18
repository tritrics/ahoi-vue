import { inArr, isBool, isInt, isObj, isStr, isTrue, objToAttr, toKey, has, round } from '../fn'
import type { ImageParams, ImageCropParams, Object, ImageModel } from '../types'

interface CalulatedImageDimensions {
  width: number
  height: number
}

/**
 * Representation of an image with helper functions to create scaled thumbs.
 * This class creates an URL with the scaling options while the thumb is
 * created by the Kirby-plugin. The Kirby-plugin creates and stores the thumb
 * only the first time it's requested.
 * 
 * URL-schema created by this class:
 * 
 * filename[-(width)x(height)][-crop-(option)][-blur(integer)][-bw][-q(integer)].extension
 *
 * - width
 * - height
 * - cropping position
 * - blur (default false)
 * - greyscale (default false)
 * - quality (default 90)
 */
class Thumb {

  /**
   * Thumb options
   * 
   * {object}
   */
  params: {
    image: ImageModel|null,
    width: number|null,
    height: number|null,
    crop: ImageCropParams|boolean,
    blur: number,
    bw: boolean,
    quality: number|null,
    title: string,
    hires: boolean
  } = {
    image: null,
    width: null,
    height: null,
    crop: false,
    blur: 0,
    bw: false,
    quality: null,
    title: '',
    hires: false, // Intern flag for hires scaling (retina displays)
  }

  /**
   * Cropping options
   */
  croppingParams: any[] = [
    'top-left',
    'top',
    'top-right',
    'left',
    'center',
    'right',
    'bottom-left',
    'bottom',
    'bottom-right'
  ]

  /**
   * With the constructor the object of the original image is mandatory.
   * All options of the requested thumb can also be given, if not set
   * one-by-one with the setters.
   */
  constructor(
    image: ImageModel,
    width: number|null = null,
    height: number|null = null,
    params: ImageParams = {}
  ) {
    if (
      has(image, 'width') &&
      has(image, 'height') &&
      has(image, 'ext') &&
      has(image, 'dir') &&
      has(image, 'filename')
    ) {
      this.params.image = image
      this.params.title = image.title ?? ''
      this.params.hires = window.devicePixelRatio > 1
      this.dim(width, height)
      if (has(params, 'crop')) {
        this.crop(params.crop!)
      }
      if (has(params, 'blur')) {
        this.blur(params.blur!)
      }
      if (isTrue(params.bw)) {
        this.bw()
      }
      if (has(params, 'blur')) {
        this.blur(params.blur!)
      }
    }
  }

  /**
   * Chaining function to set dimension
   */
  dim(width: number|null, height: number|null|undefined): this {
    if (isObj(this.params.image)) {
      this.params.width = isInt(width, 1, this.params.image!.width) ? width : null
      this.params.height = isInt(height, 1, this.params.image!.height) ? height : null
    } else {
      this.params.width = isInt(width, 1) ? width : null
      this.params.height = isInt(height, 1) ? height : null
    }
    return this
  }

  /**
   * Chaining function to set crop
   */
  crop(crop: ImageCropParams|boolean): this {
    if (isBool(crop)) {
      this.params.crop = isTrue(crop) ? 'center' : false
    } else if (isStr(crop)) {
      const val = toKey(crop)
      if (inArr(val, this.croppingParams)) {
        this.params.crop = crop
      }
    }
    return this
  }

  /**
   * Chaining function to set blur.
   */
  blur(blur: number): this {
    if (isInt(blur, 0)) {
      this.params.blur = blur
    }
    return this
  }

  /**
   * Chaining function to set image to black/white.
   */
  bw(): this {
    this.params.bw = true
    return this
  }

  /**
   * Chaining function to set JPEG quality (between 1 and 100).
   */
  quality(quality: number): this {
    if (isInt(quality, 1, 100)) {
      this.params.quality = quality
    }
    return this
  }

  /**
   * Getter for thumb-tag attributes, optionally as object or string.
   */
  attr(asString: boolean = false): string|Object {
    if (!isObj(this.params.image)) {
      return isTrue(asString) ? '' : []
    }
    const attr: Object = this.calculateThumb()
    if (isStr(this.params.title, 1)) {
      attr.alt = this.params.title
    }
    return isTrue(asString) ? objToAttr(attr) : attr
  }

  /**
   * Getter for the thumb html-tag.
   */
  tag(): string {
    return `<img ${this.attr(true)} />`
  }

  /**
   * Preload the image.
   */
  async preload(): Promise<any> {
    if (!isObj(this.params.image)) {
      return Promise.resolve()
    }
    const attr = this.calculateThumb()
    return new Promise((resolve, reject) => {
      const Preload = new Image()
      Preload.onload = resolve
      Preload.onerror = reject
      Preload.src = attr.src
    })
  }

  /**
   * Helper to calculate all options for the thumb-url.
   */
  calculateThumb(): Object {
    if (!isObj(this.params.image)) {
      return {}
    }
    const res: Object = this.calculateDimensions()
    const ext = this.params.image.ext.toLowerCase().replace(/jpeg/, 'jpg')
    const src = []
    src.push(this.params.image.dir + this.params.image.filename)
    src.push(`${res.width}x${res.height}`)
    if (isStr(this.params.crop)) {
      src.push(`crop-${this.params.crop}`)
    }
    if (this.params.blur !== null && this.params.blur > 0) {
      src.push(`blur${this.params.blur}`)
    }
    if (this.params.bw === true) {
      src.push('bw')
    }
    if (this.params.quality !== null && this.params.quality > 0) {
      src.push(`q${this.params.quality}`)
    }
    res.src = `${src.join('-')}.${ext}`
    res.crossorigin = null
    return res
  }

  /**
   * Helper to calculate the dimensions for the thumb-url.
   */
  calculateDimensions(): CalulatedImageDimensions {
    const res: CalulatedImageDimensions = {
      width: 0,
      height: 0
    }
    if (!isObj(this.params.image)) {
      return res
    }
    const ratio = this.params.image.width / this.params.image.height

    // width and height given
    if (isInt(this.params.width, 1) && isInt(this.params.height, 1)) {

      // crop to fit in width and height
      if (isStr(this.params.crop)) {
        res.width = this.params.width!
        res.height = this.params.height!
      }
      
      // fit either width or height, keep ratio
      else {
        res.width = round(this.params.height! * ratio, 0)
        if (res.width <= this.params.width!) {
          res.height = this.params.height!
        } else {
          res.width = this.params.width!
          res.height = round(this.params.width! / ratio, 0)
        }
      }
    }

    // only width given: keep ratio, calculate height
    else if (isInt(this.params.width, 1)) {
      res.width = this.params.width!
      res.height = round(this.params.width! / ratio, 0)
    }

    // only height given: keep ratio, calculate width
    else if (isInt(this.params.height, 1)) {
      res.width = round(this.params.height! * ratio, 0)
      res.height = this.params.height!
    }

    // nothing given, use original dimensions
    else {
      res.width = this.params.image.width
      res.height = this.params.image.height
    }

    // double resolution for hiRes displays
    if (
      this.params.hires &&
      isInt(res.width * 2, 1, this.params.image.width) &&
      isInt(res.height * 2, 1, this.params.image.height)
    ) {
      res.width *= 2
      res.height *= 2
    }
    return res
  }

  toString() {
    return 'Instance of class Thumb'
  }
}

export default Thumb
