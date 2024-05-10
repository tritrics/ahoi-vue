import { isStr, toStr, upper, lower } from '../'

/**
 * Normalizes a locale string.
 */
export default function toLocale(val: string, sep: string = '_', def: string = 'en_US'): string {
  const [ language, territory ] = toStr(val).replace('-', '_').split('_')
  if (!isStr(language, 2, 2) || !isStr(territory, 2, 2)) {
    return def
  }
  return `${lower(language)}${sep}${upper(territory)}`
}