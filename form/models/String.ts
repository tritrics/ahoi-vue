import BaseStringModel from './BaseString'
import type { IFormStringModel, IFormListModel } from '../types'
import type { Object } from '../../types'

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

  /** */
  constructor(def: Object, parent?: IFormListModel) {
    super(def, parent)
  }
}