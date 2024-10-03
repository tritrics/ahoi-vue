import { isDate, isStr, toStr, pad } from '../'

/**
 * Converts a date to a string in the given format.
 * 
 * Possible shortcuts:
 * [ yyyy, yy, mm, m, dd, d, hh, h, ii, i, ss, s ]
 */
export default function dateToStr(date: Date, format: string = 'yyyy-mm-dd hh:ii:ss'): string {
  if (isDate(date) && isStr(format)) {
    return format
      .replace('yyyy', toStr(date.getFullYear()))
      .replace('yy',   toStr(date.getFullYear()).substring(2, 4))
      .replace('mm',   pad(date.getMonth() + 1, 2))
      .replace('m',    toStr(date.getMonth() + 1))
      .replace('dd',   pad(date.getDate(), 2))
      .replace('d',    toStr(date.getDate()))
      .replace('hh',   pad(date.getHours(), 2))
      .replace('h',    toStr(date.getHours()))
      .replace('ii',   pad(date.getMinutes(), 2))
      .replace('i',    toStr(date.getMinutes()))
      .replace('ss',   pad(date.getSeconds(), 2))
      .replace('s',    toStr(date.getSeconds()))
  }
  return ''
}