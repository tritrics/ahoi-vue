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
  if (res.groups.y) date.setFullYear(toInt(res.groups.y))
  if (res.groups.m) date.setMonth(toInt(res.groups.m) - 1)
  if (res.groups.d) date.setDate(toInt(res.groups.d))
  if (res.groups.h) date.setHours(toInt(res.groups.h))
  if (res.groups.i) date.setMinutes(toInt(res.groups.i))
  if (res.groups.s) date.setSeconds(toInt(res.groups.s))
  if (
    date.toString() !== 'Invalid Date' &&
    (!res.groups.y || date.getFullYear() === toInt(res.groups.y)) &&
    (!res.groups.m || date.getMonth() === toInt(res.groups.m) - 1) &&
    (!res.groups.d || date.getDate() === toInt(res.groups.d)) &&
    (!res.groups.h || date.getHours() === toInt(res.groups.h)) &&
    (!res.groups.i || date.getMinutes() === toInt(res.groups.i)) &&
    (!res.groups.s || date.getSeconds() === toInt(res.groups.s))
  ) {
    return date
  }
  return null
}