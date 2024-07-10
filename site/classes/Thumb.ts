import { inArr, isBool, isInt, isObj, isStr, isTrue, objToAttr, toKey, round, clone } from '../../fn'
import type { IThumbModel, IThumbOptions, IThumbImage, IThumbDimensions, ThumbCropOptions } from '../types'
import type { Object }  from '../../types' 

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
class Thumb implements IThumbModel { // name Image is reservated by JS

  /**
   * The image object with src and dimensions of the original
   */
  _orig: IThumbImage

  /**
   * The requested width of the thumb.
   */
  _width: number|null = null

  /**
   * The requested height of the thumb.
   */
  _height: number|null = null

  /**
   * Cropping function, if dimensions don't fit the original ratio (same as in Kirby).
   */
  _crop: ThumbCropOptions|boolean = false

  /**
   * Blurring factor (same as in Kirby).
   */
  _blur: number|null = null

  /**
   * Flag for black/white (same as in Kirby).
   */
  _bw: boolean = false

  /**
   * JPEG qualitiy setting (same as in Kirby).
   */
  _quality: number|null = null

  /**
   * Title, used as alt-property.
   */
  _title: string = ''

  /**
   * Flat for hires / Retina displays.
   */
  _hires: boolean = false

  /**
   * Cropping options
   */
  _croppingOptions: ThumbCropOptions[] = [
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
    image: IThumbImage,
    width: number|null = null,
    height: number|null = null,
    options: IThumbOptions = {}
  ) {
    this._orig = image
    this._title = image.title ?? ''
    this._hires = window.devicePixelRatio > 1

    const opt = clone(options)
    this.options(opt)
    this.dim(width, height) // manually given width and height overwrite same properties in options
  }

  /**
   * Getter for thumb-tag attributes, optionally as object or string.
   */
  attr(asString: boolean = false): string|Object {
    if (!isObj(this._orig)) {
      return isTrue(asString) ? '' : []
    }
    const attr: Object = this._calculate()
    if (isStr(this._title, 1)) {
      attr.alt = this._title
    }
    return isTrue(asString) ? objToAttr(attr) : attr
  }

  /**
   * Chaining function to set blur.
   */
  blur(blur?: number|null): this {
    if (isInt(blur, 0)) {
      this._blur = blur
    }
    return this
  }

  /**
   * Chaining function to set image to black/white.
   */
  bw(bw?: boolean): this {
    this._bw = isTrue(bw)
    return this
  }

  /**
   * Chaining function to set crop
   */
  crop(crop?: ThumbCropOptions|boolean): this {
    if (isBool(crop)) {
      this._crop = isTrue(crop) ? 'center' : false
    } else if (isStr(crop)) {
      const val = toKey(crop)
      if (inArr(val, this._croppingOptions)) {
        this._crop = crop as ThumbCropOptions
      }
    }
    return this
  }

  /**
   * Chaining function to set dimension
   */
  dim(width?: number|null, height?: number|null): this {
    if (isInt(width, 1) || isInt(height, 1)) { // one of two must be given
      this._width = isInt(width, 1, this._orig.width) ? width : null
      this._height = isInt(height, 1, this._orig.height) ? height : null
    }
    return this
  }

  /**
   * Chaining function to set options from object
   * checks inside setter
   */
  options({
    width = null,
    height = null,
    crop = false,
    blur = null,
    bw = false,
    quality = null
  }: IThumbOptions = {}) {
    this.dim(width, height)
    this.crop(crop)
    this.blur(blur)
    this.bw(bw)
    this.blur(blur)
    this.quality(quality)
    return this
  }

  /**
   * Preload the image.
   */
  async preload(): Promise<any> {
    if (!isObj(this._orig)) {
      return Promise.resolve()
    }
    const attr = this._calculate()
    return new Promise((resolve, reject) => {
      const Preload = new Image()
      Preload.onload = resolve
      Preload.onerror = reject
      Preload.src = attr.src
    })
  }

  /**
   * Chaining function to set JPEG quality (between 1 and 100).
   */
  quality(quality?: number|null): this {
    if (isInt(quality, 1, 100)) {
      this._quality = quality
    }
    return this
  }

  /**
   * Getter for scr/href
   */
  src(): string {
    if (!isObj(this._orig)) {
      return ''
    }
    const attr: Object = this._calculate()
    return attr.src
  }

  toString(): string {
    return 'Instance of class Thumb'
  }

  /**
   * Helper to calculate all options for the thumb-url.
   */
  _calculate(): Object {
    if (!isObj(this._orig)) {
      return {}
    }
    const res: Object = this._calculateDim()
    const ext = this._orig.ext.toLowerCase().replace(/jpeg/, 'jpg')
    const src = []
    if (window.location.origin !== this._orig.host) {
      src.push(this._orig.host)
    }
    src.push(this._orig.dir)
    src.push('/')
    src.push(this._orig.name)
    src.push(`-${res.width}x${res.height}`)
    if (isStr(this._crop)) {
      src.push(`-crop-${this._crop}`)
    }
    if (this._blur !== null && this._blur > 0) {
      src.push(`-blur${this._blur}`)
    }
    if (this._bw === true) {
      src.push('-bw')
    }
    if (this._quality !== null && this._quality > 0) {
      src.push(`-q${this._quality}`)
    }
    res.src = `${src.join('')}.${ext}`
    res.crossorigin = null
    return res
  }

  /**
   * Helper to calculate the dimensions for the thumb-url.
   */
  _calculateDim(): IThumbDimensions {
    const res: IThumbDimensions = {
      width: 0,
      height: 0
    }
    if (!isObj(this._orig)) {
      return res
    }
    const ratio = this._orig.width / this._orig.height

    // width and height given
    if (isInt(this._width, 1) && isInt(this._height, 1)) {

      // crop to fit in width and height
      if (isStr(this._crop)) {
        res.width = this._width!
        res.height = this._height!
      }
      
      // fit either width or height, keep ratio
      else {
        res.width = round(this._height! * ratio, 0)
        if (res.width <= this._width!) {
          res.height = this._height!
        } else {
          res.width = this._width!
          res.height = round(this._width! / ratio, 0)
        }
      }
    }

    // only width given: keep ratio, calculate height
    else if (isInt(this._width, 1)) {
      res.width = this._width!
      res.height = round(this._width! / ratio, 0)
    }

    // only height given: keep ratio, calculate width
    else if (isInt(this._height, 1)) {
      res.width = round(this._height! * ratio, 0)
      res.height = this._height!
    }

    // nothing given, use original dimensions
    else {
      res.width = this._orig.width
      res.height = this._orig.height
    }

    // double resolution for hiRes displays
    if (
      this._hires &&
      isInt(res.width * 2, 1, this._orig.width) &&
      isInt(res.height * 2, 1, this._orig.height)
    ) {
      res.width *= 2
      res.height *= 2
    }
    return res
  }
}

export default Thumb