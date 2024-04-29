import { toStr } from '../../fn'
import type { Object, ParserModel } from '../../types'

/**
 * Base object for all models
 */
export default function createBase(): ParserModel {
  const base: ParserModel = {
    type: 'string',
    value: '',
    str(): string {
      return toStr(this.value)
    },
    toString(): string {
      return this.str()
    },
  }
  return Object.create(base)
}