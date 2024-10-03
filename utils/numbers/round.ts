import { isNum, isInt } from '../'

/**
 * Round float to a given decimal length.
 */
export default function round(val: number, dec: number): number {
  if (isNum(val)) {
    const i: number = isInt(dec, 1) ? 10 ** dec : 1
    return Math.round(val * i) / i
  }
  return 0
}