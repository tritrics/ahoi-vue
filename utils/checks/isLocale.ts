import { isStr } from '../index'

const regStrict = /^[a-z]{2}[-][A-Z]{2}$/i

const regLoose = /^[a-zA-Z]{2}[-_][a-zA-Z]{2}$/i

/**
 * Check, if a given string is a locale like en_GB
 */
export default function isLocale(val: any, strict: boolean = true): boolean {
  return isStr(val) && (strict ? regStrict.test(val) : regLoose.test(val))
}