import { isElem, toInt } from '../'

/**
 * Get bottom position of the given HTML element relative to the viewport.
 */
export default function getElemBottom(elem: any): number {
  return isElem(elem) ? toInt(elem.getBoundingClientRect().bottom) : 0
}