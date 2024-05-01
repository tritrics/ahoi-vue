import { watchEffect } from 'vue'
import { toStr, isEmpty, uuid } from '../../fn'
import type { IFormModel, FormPostValue } from '../../types'

/**
 * Base object for all fields
 */
export default function createBase(): IFormModel {
  const base: IFormModel = {
    type: 'string',
    id: uuid(),
    value: '',
    required: false,
    valid: true,
    msg: '',
    validate(): void {},
    setValid(msg: string = ''): void {
      this.valid = isEmpty(msg)
      this.msg = msg
    },
    watch(start: boolean = true): void {
      if (start) {
        if(this.stop === null) {
          this.stop = watchEffect(() => {
            this.validate(this.value) // important to kick off the watchEffect
          })
        }
      } else if (this.stop !== null) {
        this.stop()
        this.stop = null
      }
    },
    data(): FormPostValue {
      return toStr(this.value)
    },
    toString(): string {
      return toStr(this.data())
    },
    stop: null,
  }
  return Object.create(base)
}