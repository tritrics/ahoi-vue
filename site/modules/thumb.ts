import { isObj } from '../../utils'
import { Thumb } from '../index'
import FileModel from '../models/File'
import type { IFileModel } from '../types'
import type { IThumbOptions, IThumbImage } from '../../types'

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
    const prefs = {
      host: '',
      dir: '',
      name: '',
      ext: '',
      width: 0,
      height: 0,
      title: ''
    }
    const image: IThumbImage = { ...prefs, ...mixed }
    new Thumb(image, width, height, options)
  }
}