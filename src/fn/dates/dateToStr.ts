import { isDate, isStr, toStr, pad } from '../'

/**
 * Converts a date to a string in the given format.
 * 
 * Possible shortcuts:
 * [ yyyy, mm, dd, hh, ii, ss]
 * 
 * Intended for programmatical use, for user-output use functions
 * date.toLocaleDateString() and date.toLocaleTimeString()
 */
export default function dateToStr(date: Date, format: string = 'yyyy-mm-dd hh:ii:ss'): string {
  if (isDate(date) && isStr(format)) {
    return format
      .replace('yyyy', toStr(date.getFullYear()))
      .replace('mm',   pad(date.getMonth() + 1, 2))
      .replace('dd',   pad(date.getDate(), 2))
      .replace('hh',   pad(date.getHours(), 2))
      .replace('ii',   pad(date.getMinutes(), 2))
      .replace('ss',   pad(date.getSeconds(), 2))
  }
  return ''
}