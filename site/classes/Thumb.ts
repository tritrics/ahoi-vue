import { inArr, isBool, isInt, isNum, isStr, isTrue, objToAttr, toKey, round, toBool, toNum } from '../../utils'
import type { IThumbModel, IThumbOptions, IImageModel, IThumbDimensions, ThumbCropOptions, IImageAttributes } from '../types'
import type { Object }  from '../../types' 

/**
 * Cropping options
 */
const croppingOptions: ThumbCropOptions[] = [
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
   * The thumb attributes
   */
  _attr: IImageAttributes

  /**
   * The image object with src and dimensions of the original
   */
  _image: IImageModel

  /**
   * Thumb options
   */
  _options: IThumbOptions

  /**
   * With the constructor the object of the original image is mandatory.
   * All options of the requested thumb can also be given, if not set
   * one-by-one with the setters.
   */
  constructor(image: IImageModel, options: Object = {}) {
    this._image   = image
    this._options = this._getOptions(options)
    this._attr    = this._getAttributes()
  }
  
  /**
   * Preload the image.
   */
  async preload(): Promise<any> {
    if (isStr(this._attr.src, 1)) {
      return new Promise((resolve, reject) => {
        const Preload = new Image()
        Preload.onload = resolve
        Preload.onerror = reject
        Preload.src = this._attr.src as string
      })
    }
    return Promise.resolve()
  }

  /**
   * Get thumb's attributes.
   */
  attr(asString: boolean = false): IImageAttributes|string {
    return asString ? objToAttr(this._attr) : this._attr
  }

  /**
   * Get the image.
   */
  image(): IImageModel {
    return this._image
  }

  /**
   * Get the options.
   */
  options(): IThumbOptions {
    return this._options
  }

  /**
   * Getter for scr/href
   */
  src(): string {
    return isStr(this._attr.src, 1) ? this._attr.src : ''
  }

  /**
   */
  toString(): string {
    return this.attr(true) as string
  }

  /**
   * Calculate all options for the thumb-url.
   */
  _getAttributes(): IImageAttributes {

    // default
    const res: IImageAttributes = {
      src: null,
      width: null,
      height: null,
      alt: null,
      crossorigin: null
    }
    const { width, height } = this._getDimensions()

    // src
    if (
      isStr(this._image?.host, 1) &&
      isStr(this._image?.dir, 1) &&
      isStr(this._image?.name, 1) &&
      isStr(this._image.ext, 1)
    ) {
      const src = []
      if (window.location.origin !== this._image.host) {
        src.push(this._image.host)
      }
      src.push(this._image.dir)
      src.push('/')
      src.push(this._image.name)
      src.push(`-${width}x${height}`)
      if (isStr(this._options.crop)) {
        src.push(`-crop-${this._options.crop}`)
      }
      if (this._options.blur !== null && this._options.blur > 0) {
        src.push(`-blur${this._options.blur}`)
      }
      if (this._options.bw === true) {
        src.push('-bw')
      }
      if (this._options.quality !== null && this._options.quality > 0) {
        src.push(`-q${this._options.quality}`)
      }
      const ext = this._image.ext.toLowerCase().replace(/jpeg/, 'jpg')
      res.src = `${src.join('')}.${ext}`
    }

    // dimenstions
    res.width = width
    res.height = height

    // title
    if (isStr(this._options.title, 1)) {
      res.alt = this._options.title
    }

    // additional attributes
    res.crossorigin = null
    return res as IImageAttributes
  }

  /**
   * Helper to calculate the dimensions for the thumb-url.
   * ratio represents width/height and is always set, either by options or original ratio
   */
  _getDimensions(): IThumbDimensions {
    const res: IThumbDimensions = {
      width: 0,
      height: 0
    }
    const hasWidth = isInt(this._options.width, 1)
    const hasHeight = isInt(this._options.height, 1)
    const hasCrop = isStr(this._options.crop) && inArr(toKey(this._options.crop), croppingOptions)
    const ratio = this._image.width / this._image.height

    if (hasWidth && hasHeight) {

      // crop to fit in width and height
      if (hasCrop) {
        res.width = this._options.width!
        res.height = this._options.height!
      }
      
      // fit either width or height, keep ratio
      else {
        res.width = round(this._options.height! * ratio, 0)
        if (res.width <= this._options.width!) {
          res.height = this._options.height!
        } else {
          res.width = this._options.width!
          res.height = round(this._options.width! / ratio, 0)
        }
      }
    }
    else if (hasWidth) {
      res.width = this._options.width!
      res.height = round(this._options.width! / ratio, 0)
    }
    else if (hasHeight) {
      res.width = round(this._options.height! * ratio, 0)
      res.height = this._options.height!
    }
    else {
      res.width = this._image.width
      res.height = round(this._options.width! / ratio, 0)
    }

    // double resolution for hiRes displays
    if (
      this._options.hires &&
      isInt(res.width * 2, 1, this._image.width) &&
      isInt(res.height * 2, 1, this._image.height)
    ) {
      res.width *= 2
      res.height *= 2
    }
    return res
  }

  /**
   * Setting options from user-given options.
   */
  _getOptions(options: Object): IThumbOptions {
    const res: Object = {}

    // dimensions
    res.width = isInt(options.width, 1) ? options.width: null
    res.height = isInt(options.height, 1) ? options.height: null

    // ratio
    let ratio: null|number = null
    if (isNum(options.ratio, 0.01)) {
      ratio = options.ratio
    } else if (isStr(options.ratio, 1) && /^[0-9][\s]?\/[\s]?[0-9]$/.test(options.ratio)) {
      const [ n, d ] = options.ratio.split('/').map((a) => toNum(a))
      if (n !== null && d !== null && n > 0 && d > 0) {
        ratio = n / d
      }
    }

    // ratio only relevant, if either height or width are NOT set
    // calculate width/height from ratio, don't add ratio to res
    if (ratio && res.width && !res.height) {
      res.height = round(res.width / ratio, 0)
    } else if (ratio && res.height && !res.width) {
      res.width = round(res.width * ratio, 0)
    } else if (ratio && !res.width && !res.height) {
      res.width = round(this._image.height * ratio, 0)
      if (res.width <= this._image.width) {
        res.height = this._image.height
      } else {
        res.width = this._image.width
        res.height = round(this._image.width / ratio, 0)
      }
    }

    // blur
    res.blur = isInt(options.blur, 0) ? options.blur : null

    // bw
    res.bw = isTrue(options.bw, false)

    // crop
    res.crop = false
    if (isBool(options.crop, false)) {
      res.crop = isTrue(options.crop, false) ? 'center' : false
    } else if (isStr(options.crop)) {
      const val = toKey(options.crop)
      if (inArr(val, croppingOptions)) {
        res.crop = val as ThumbCropOptions
      }
    }
    if (res.crop === false && ratio) {
      res.crop = 'center'
    }

    // hires
    if (isBool(options.hires, false)) {
      res.hires = toBool(options.hires)
    } else {
      res.hires = window.devicePixelRatio > 1
    }

    // quality
    res.quality = isInt(options.quality, 1, 100) ? options.quality : null

    // title
    if (isStr(options.title, 1)) {
      res.title = options.title
    } else if (isStr(this._image?.title, 1)) {
      res.title = this._image.title
    } else {
      res.title = this._image?.title ?? ''
    }

    return res as IThumbOptions
  }
}

export default Thumb