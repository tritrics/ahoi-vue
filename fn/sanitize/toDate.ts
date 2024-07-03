import { isStr, isArr, isObj, toInt, dateRegExp } from '../'

/**
 * Converts string to date.
 * [ yyyy, yy, mm, m, dd, d, hh, h, ii, i, ss, s ]
 */
export default function toDate(val: string|Date, format: RegExp|string = 'yyyy-mm-dd'): Date | null {
  if (val instanceof Date) { // if (Object.prototype.toString.call(val) === "[object Date]") {
    return val.toString() !== 'Invalid Date' ? val : null
  } else if(!isStr(val)) {
    return null
  }
  let regExp: RegExp
  if (format instanceof RegExp) {
    regExp = format
  } else if (isStr(format)) {
    regExp = dateRegExp(format)
  } else {
    return null
  }
  const res = regExp.exec(val)
  if (!isArr(res) || !isObj(res.groups)) {
    return null
  }
  const date = new Date()
  if (res.groups.y) {
    date.setUTCFullYear(toInt(res.groups.y))
  }
  if (res.groups.m) {
    date.setUTCMonth(toInt(res.groups.m) - 1)
  }
  if (res.groups.d) {
    date.setUTCDate(toInt(res.groups.d))
  }
  if (res.groups.h) {
    date.setUTCHours(toInt(res.groups.h))
  }
  if (res.groups.i) {
    date.setUTCMinutes(toInt(res.groups.i))
  }
  if (res.groups.s) {
    date.setUTCSeconds(toInt(res.groups.s))
  }
  date.setUTCMilliseconds(0)
  if (
    date.toString() !== 'Invalid Date' &&
    (!res.groups.y || date.getUTCFullYear() === toInt(res.groups.y)) &&
    (!res.groups.m || date.getUTCMonth() === toInt(res.groups.m) - 1) &&
    (!res.groups.d || date.getUTCDate() === toInt(res.groups.d)) &&
    (!res.groups.h || date.getUTCHours() === toInt(res.groups.h)) &&
    (!res.groups.i || date.getUTCMinutes() === toInt(res.groups.i)) &&
    (!res.groups.s || date.getUTCSeconds() === toInt(res.groups.s))
  ) {
    return date
  }
  return null
}