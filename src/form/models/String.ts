import BaseStringModel from './BaseString'
import type { IStringModel, IListModel } from './types'
import type { Object } from '../../types'

export default class StringModel extends BaseStringModel implements IStringModel {
  type: 'string' = 'string'

  linebreaks: false = false

  constructor(def: Object, parent?: IListModel) {
    super(def, parent)
  }
}