import { isElem, getElemWidth, getElemLeft } from '../'

/**
 * Get right position of the given HTML element relative to the viewport.
 */
export default function getElemRight(elem: HTMLElement): number {
  return isElem(elem) ? getElemLeft(elem) + getElemWidth(elem) : 0
}