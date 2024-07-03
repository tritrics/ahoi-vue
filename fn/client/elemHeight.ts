import { isElem, toInt } from '..'

/**
 * Get the height of the given HTML element.
 */
export default function elemHeight(elem: any): number {
  return isElem(elem) ? toInt(getComputedStyle(elem).height.split('px')[0]) : 0
}