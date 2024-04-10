import { isStr, isNum } from '../'

/**
 * Converts a number to string and adds 0 to the beginning until the requested length.
 */
export default function pad(val: string | number, places: number): string {
  if (isStr(val) || isNum(val)) {
    const zero: number = places - val.toString().length + 1;
    return `${Array(+(zero > 0 && zero)).join('0')}${val}`;
  }
  return ''
}