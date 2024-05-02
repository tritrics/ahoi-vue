import { inArr, isBool, isInt, isObj, isStr, isTrue, objToAttr, toKey, round, clone, Options } from '../fn'
import FileModel from './models/File'
import type { IFileModel } from './models/types'
import type { IThumbModel, IThumbOptions, IThumbImage, IThumbDimensions, ThumbCropOptions } from './types'
import type { Object }  from '../types' 

/**
 * Create a Thumb instance with handy image resizing and handling methods.
 */
export function createThumb (
  mixed: IThumbImage|IFileModel|any,
  width: number|null = null,
  height: number|null = null,
  options: IThumbOptions = {}
): Thumb|undefined
{
  // Instance of thumb class is given
  if (mixed instanceof Thumb) {
    return mixed.options(options).dim(width, height)
  } 

  // Instance of file model is given
  else if (mixed instanceof FileModel && mixed.isImage()) {
    return new Thumb(mixed.meta as IThumbImage, width, height, options)
  }

  else if (isObj(mixed)) {
    const image = new Options({
      host: '',
      dir: '',
      name: '',
      ext: '',
      width: null,
      height: null,
      title: ''
    })
    image.set(mixed)
    new Thumb(image.obj() as IThumbImage, width, height, options)
  }
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
class Thumb implements IThumbModel { // name Image is reservated by JS

  /**
   * The image object with src and dimensions of the original
   */
  #orig: IThumbImage

  /**
   * The requested width of the thumb.
   */
  #width: number|null = null

  /**
   * The requested height of the thumb.
   */
  #height: number|null = null

  /**
   * Cropping function, if dimensions don't fit the original ratio (same as in Kirby).
   */
  #crop: ThumbCropOptions|boolean = false

  /**
   * Blurring factor (same as in Kirby).
   */
  #blur: number|null = null

  /**
   * Flag for black/white (same as in Kirby).
   */
  #bw: boolean = false

  /**
   * JPEG qualitiy setting (same as in Kirby).
   */
  #quality: number|null = null

  /**
   * Title, used as alt-property.
   */
  #title: string = ''

  /**
   * Flat for hires / Retina displays.
   */
  #hires: boolean = false

  /**
   * Cropping options
   */
  #croppingOptions: ThumbCropOptions[] = [
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
    this.#orig = image
    this.#title = image.title ?? ''
    this.#hires = window.devicePixelRatio > 1

    const opt = clone(options)
    this.options(opt)
    this.dim(width, height) // manually given width and height overwrite same properties in options
  }

  /**
   * Chaining function to set dimension
   */
  dim(width?: number|null, height?: number|null): this {
    if (isInt(width, 1) || isInt(height, 1)) { // one of two must be given
      this.#width = isInt(width, 1, this.#orig.width) ? width : null
      this.#height = isInt(height, 1, this.#orig.height) ? height : null
    }
    return this
  }

  /**
   * Chaining function to set crop
   */
  crop(crop?: ThumbCropOptions|boolean): this {
    if (isBool(crop)) {
      this.#crop = isTrue(crop) ? 'center' : false
    } else if (isStr(crop)) {
      const val = toKey(crop)
      if (inArr(val, this.#croppingOptions)) {
        this.#crop = crop as ThumbCropOptions
      }
    }
    return this
  }

  /**
   * Chaining function to set blur.
   */
  blur(blur?: number|null): this {
    if (isInt(blur, 0)) {
      this.#blur = blur
    }
    return this
  }

  /**
   * Chaining function to set image to black/white.
   */
  bw(bw?: boolean): this {
    this.#bw = isTrue(bw)
    return this
  }

  /**
   * Chaining function to set JPEG quality (between 1 and 100).
   */
  quality(quality?: number|null): this {
    if (isInt(quality, 1, 100)) {
      this.#quality = quality
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
   * Getter for thumb-tag attributes, optionally as object or string.
   */
  attr(asString: boolean = false): string|Object {
    if (!isObj(this.#orig)) {
      return isTrue(asString) ? '' : []
    }
    const attr: Object = this.#calculate()
    if (isStr(this.#title, 1)) {
      attr.alt = this.#title
    }
    return isTrue(asString) ? objToAttr(attr) : attr
  }

  /**
   * Preload the image.
   */
  async preload(): Promise<any> {
    if (!isObj(this.#orig)) {
      return Promise.resolve()
    }
    const attr = this.#calculate()
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
  #calculate(): Object {
    if (!isObj(this.#orig)) {
      return {}
    }
    const res: Object = this.#calculateDim()
    const ext = this.#orig.ext.toLowerCase().replace(/jpeg/, 'jpg')
    const src = []
    if (window.location.origin !== this.#orig.host) {
      src.push(this.#orig.host)
    }
    src.push(this.#orig.dir)
    src.push('/')
    src.push(this.#orig.name)
    src.push(`-${res.width}x${res.height}`)
    if (isStr(this.#crop)) {
      src.push(`-crop-${this.#crop}`)
    }
    if (this.#blur !== null && this.#blur > 0) {
      src.push(`-blur${this.#blur}`)
    }
    if (this.#bw === true) {
      src.push('-bw')
    }
    if (this.#quality !== null && this.#quality > 0) {
      src.push(`-q${this.#quality}`)
    }
    res.src = `${src.join('')}.${ext}`
    res.crossorigin = null
    return res
  }

  /**
   * Helper to calculate the dimensions for the thumb-url.
   */
  #calculateDim(): IThumbDimensions {
    const res: IThumbDimensions = {
      width: 0,
      height: 0
    }
    if (!isObj(this.#orig)) {
      return res
    }
    const ratio = this.#orig.width / this.#orig.height

    // width and height given
    if (isInt(this.#width, 1) && isInt(this.#height, 1)) {

      // crop to fit in width and height
      if (isStr(this.#crop)) {
        res.width = this.#width!
        res.height = this.#height!
      }
      
      // fit either width or height, keep ratio
      else {
        res.width = round(this.#height! * ratio, 0)
        if (res.width <= this.#width!) {
          res.height = this.#height!
        } else {
          res.width = this.#width!
          res.height = round(this.#width! / ratio, 0)
        }
      }
    }

    // only width given: keep ratio, calculate height
    else if (isInt(this.#width, 1)) {
      res.width = this.#width!
      res.height = round(this.#width! / ratio, 0)
    }

    // only height given: keep ratio, calculate width
    else if (isInt(this.#height, 1)) {
      res.width = round(this.#height! * ratio, 0)
      res.height = this.#height!
    }

    // nothing given, use original dimensions
    else {
      res.width = this.#orig.width
      res.height = this.#orig.height
    }

    // double resolution for hiRes displays
    if (
      this.#hires &&
      isInt(res.width * 2, 1, this.#orig.width) &&
      isInt(res.height * 2, 1, this.#orig.height)
    ) {
      res.width *= 2
      res.height *= 2
    }
    return res
  }

  toString(): string {
    return 'Instance of class Thumb'
  }
}

export default Thumb
