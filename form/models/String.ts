import BaseStringModel from './BaseString'
import type { IFormStringModel } from '../types'

 /**
  * Model to represent a text input
  */
export default class StringModel extends BaseStringModel implements IFormStringModel {

  /**
   * Type
   */
  type: 'string' = 'string'

  /**
   * Allow line breaks, fixed to false
   */
  linebreaks: false = false

  /**
   * Maximum length for string
   */
  maxlength: number = 64
}