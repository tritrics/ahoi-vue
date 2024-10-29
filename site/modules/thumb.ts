import { isObj, isInt } from '../../utils'
import { Thumb } from '../index'
import FileModel from '../models/File'
import type { IFileModel } from '../types'
import type { Object, IImageModel } from '../../types'

/**
 * Create a Thumb instance with handy image resizing and handling methods.
 */
export function createThumb (
  mixed: IImageModel|IFileModel|Object,
  width: number|null = null,
  height: number|null = null,
  options: Object = {}
): Thumb|undefined
{
  const thumbOptions = { ...options }
  if (isInt(width, 1)) {
    thumbOptions.width = width
  }
  if (isInt(height, 1)) {
    thumbOptions.height = height
  }
  if (mixed instanceof Thumb) {
    return new Thumb(mixed.image(), thumbOptions)
  } else if (mixed instanceof FileModel && mixed.isImage()) {
    return new Thumb(mixed.meta as IImageModel, thumbOptions)
  } else if (isObj(mixed)) {
    return new Thumb(mixed as IImageModel, thumbOptions)
  }
}