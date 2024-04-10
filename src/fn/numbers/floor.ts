import { isNum, isInt } from '../'

/**
 * Round down a float to a given decimal length.
 */
export default function floor(val: number, dec: number): number {
  if (isNum(val)) {
    const i: number = isInt(dec, 1) ? 10 ** dec : 1
    return Math.floor(val * i) / i
  }
  return 0
}