import { isEmpty, isUrl } from '../../fn'
import BaseModel from './Base'
import type { IUrlModel } from './types'
import type { Object } from '../../types'

export default class UrlModel extends BaseModel implements IUrlModel {
  type: 'url' = 'url'

  constructor(def: Object) {
    super(def)
  }

  validate() {
    if (isEmpty(this.value)) {
      if (this.required) {
        return this.setValid('required')
      }
    } else if(!isUrl(this.value)) {
      return this.setValid('type')
    }
    return this.setValid()
  }
}