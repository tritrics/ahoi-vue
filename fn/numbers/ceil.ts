import { isNum, isInt } from '../'

/**
 * Round up a float to a given decimal length.
 */
export default function ceil(val: number, dec: number): number {
  if (isNum(val)) {
    const i: number = isInt(dec, 1) ? 10 ** dec : 1
    return Math.ceil(val * i) / i
  }
  return 0
}