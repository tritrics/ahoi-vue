import BaseStringModel from './BaseString'
import type { IFormTextModel } from '../types'

 /**
  * Model to represent a textarea input
  */
export default class TextModel extends BaseStringModel implements IFormTextModel {

  /**
   * Type
   */
  type: 'text' = 'text'

  /**
   * Allow line breaks, fixed to true
   */
  linebreaks: true = true

  /**
   * Maximum length for text
   */
  maxlength: number = 1024
}