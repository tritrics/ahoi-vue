import { has, each, isStr, extend } from '../../fn'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: languages
 */
export default function createLanguages(obj: JSONObject): ParserModel {
  const inject: Object = {
    $type: 'languages',
    $value: obj.value,
    $has(code: string): boolean {
      return isStr(code) && has(this.$value, code)
    },
    $get(code: string): any {
      return this.$value[code] ?? null
    },
    $codes(defaultFirst: boolean = true): string[] {
      const codes: string[] = []
      each(this.$value, (lang: ParserModel) => {
        if (defaultFirst && lang.$isDefault()) {
          codes.unshift(lang.code())
        } else {
          codes.push(lang.$code())
        }
      })
      return codes
    },
    $default(): ParserModel|never {
      for (let i = 0; i < this.$value.length; i++) {
        if (this.$value[i].$isDefault()) {
          return this.$value[i]
        }
      }
      return {} as never
    }
  }
  return extend(createBase(), inject) as ParserModel
}