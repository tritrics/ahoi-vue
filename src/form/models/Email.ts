import { isEmpty, isEmail } from '../../fn'
import BaseModel from './Base'
import type { IEmailModel } from './types'
import type { Object } from '../../types'

export default class EmailModel extends BaseModel implements IEmailModel {
  type: 'email' = 'email'

  constructor(def: Object) {
    super(def)
  }

  validate() {
    if (isEmpty(this.value)) {
      if (this.required) {
        return this.setValid('required')
      }
    } else if(!isEmail(this.value)) {
      return this.setValid('type')
    }
    return this.setValid()
  }
}