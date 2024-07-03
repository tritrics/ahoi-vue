import BaseStringModel from './BaseString'
import type { ITextModel } from './types'
import type { Object } from '../../types'

export default class TextModel extends BaseStringModel implements ITextModel {
  type: 'text' = 'text'

  linebreaks: true = true

  constructor(def: Object) {
    super(def)
  }
}