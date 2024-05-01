import { inArr, isBool, isInt, isObj, isStr, isTrue, objToAttr, toKey, has, round } from '../fn'
import type { IImageOptions, ImageCropOptions, Object, IImage, IImageDimensions } from '../types'

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
class KirbyImage { // name Image is reservated by JS

  /**
   * Thumb options
   * 
   * {object}
   */
  options: {
    image: IImage|null,
    width: number|null,
    height: number|null,
    crop: ImageCropOptions|boolean,
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
  croppingOptions: any[] = [
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
    image: IImage,
    width: number|null = null,
    height: number|null = null,
    options: IImageOptions = {}
  ) {
    if (
      has(image, 'host') &&
      has(image, 'dir') &&
      has(image, 'name') &&
      has(image, 'ext') &&
      has(image, 'width') &&
      has(image, 'height')
    ) {
      this.options.image = image
      this.options.title = image.title ?? ''
      this.options.hires = window.devicePixelRatio > 1
      this.dim(width ?? options?.width, height ?? options?.height)
      if (has(options, 'crop')) {
        this.crop(options.crop!)
      }
      if (has(options, 'blur')) {
        this.blur(options.blur!)
      }
      if (isTrue(options.bw)) {
        this.bw()
      }
      if (has(options, 'blur')) {
        this.blur(options.blur!)
      }
    }
  }

  /**
   * Chaining function to set dimension
   */
  dim(width: number|null|undefined, height: number|null|undefined): this {
    if (isObj(this.options.image)) {
      this.options.width = isInt(width, 1, this.options.image!.width) ? width : null
      this.options.height = isInt(height, 1, this.options.image!.height) ? height : null
    } else {
      this.options.width = isInt(width, 1) ? width : null
      this.options.height = isInt(height, 1) ? height : null
    }
    return this
  }

  /**
   * Chaining function to set crop
   */
  crop(crop: ImageCropOptions|boolean): this {
    if (isBool(crop)) {
      this.options.crop = isTrue(crop) ? 'center' : false
    } else if (isStr(crop)) {
      const val = toKey(crop)
      if (inArr(val, this.croppingOptions)) {
        this.options.crop = crop
      }
    }
    return this
  }

  /**
   * Chaining function to set blur.
   */
  blur(blur: number): this {
    if (isInt(blur, 0)) {
      this.options.blur = blur
    }
    return this
  }

  /**
   * Chaining function to set image to black/white.
   */
  bw(): this {
    this.options.bw = true
    return this
  }

  /**
   * Chaining function to set JPEG quality (between 1 and 100).
   */
  quality(quality: number): this {
    if (isInt(quality, 1, 100)) {
      this.options.quality = quality
    }
    return this
  }

  /**
   * Getter for thumb-tag attributes, optionally as object or string.
   */
  attr(asString: boolean = false): string|Object {
    if (!isObj(this.options.image)) {
      return isTrue(asString) ? '' : []
    }
    const attr: Object = this.calculateThumb()
    if (isStr(this.options.title, 1)) {
      attr.alt = this.options.title
    }
    return isTrue(asString) ? objToAttr(attr) : attr
  }

  /**
   * Preload the image.
   */
  async preload(): Promise<any> {
    if (!isObj(this.options.image)) {
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
    if (!isObj(this.options.image)) {
      return {}
    }
    const res: Object = this.calculateDimensions()
    const ext = this.options.image.ext.toLowerCase().replace(/jpeg/, 'jpg')
    const src = []
    if (window.location.origin !== this.options.image.host) {
      src.push(this.options.image.host)
    }
    src.push(this.options.image.dir)
    src.push('/')
    src.push(this.options.image.name)
    src.push(`-${res.width}x${res.height}`)
    if (isStr(this.options.crop)) {
      src.push(`-crop-${this.options.crop}`)
    }
    if (this.options.blur !== null && this.options.blur > 0) {
      src.push(`-blur${this.options.blur}`)
    }
    if (this.options.bw === true) {
      src.push('-bw')
    }
    if (this.options.quality !== null && this.options.quality > 0) {
      src.push(`-q${this.options.quality}`)
    }
    res.src = `${src.join('')}.${ext}`
    res.crossorigin = null
    return res
  }

  /**
   * Helper to calculate the dimensions for the thumb-url.
   */
  calculateDimensions(): IImageDimensions {
    const res: IImageDimensions = {
      width: 0,
      height: 0
    }
    if (!isObj(this.options.image)) {
      return res
    }
    const ratio = this.options.image.width / this.options.image.height

    // width and height given
    if (isInt(this.options.width, 1) && isInt(this.options.height, 1)) {

      // crop to fit in width and height
      if (isStr(this.options.crop)) {
        res.width = this.options.width!
        res.height = this.options.height!
      }
      
      // fit either width or height, keep ratio
      else {
        res.width = round(this.options.height! * ratio, 0)
        if (res.width <= this.options.width!) {
          res.height = this.options.height!
        } else {
          res.width = this.options.width!
          res.height = round(this.options.width! / ratio, 0)
        }
      }
    }

    // only width given: keep ratio, calculate height
    else if (isInt(this.options.width, 1)) {
      res.width = this.options.width!
      res.height = round(this.options.width! / ratio, 0)
    }

    // only height given: keep ratio, calculate width
    else if (isInt(this.options.height, 1)) {
      res.width = round(this.options.height! * ratio, 0)
      res.height = this.options.height!
    }

    // nothing given, use original dimensions
    else {
      res.width = this.options.image.width
      res.height = this.options.image.height
    }

    // double resolution for hiRes displays
    if (
      this.options.hires &&
      isInt(res.width * 2, 1, this.options.image.width) &&
      isInt(res.height * 2, 1, this.options.image.height)
    ) {
      res.width *= 2
      res.height *= 2
    }
    return res
  }

  toString() {
    return 'Instance of class Image'
  }
}

export default KirbyImage
