import { isElem, toInt } from '..'

/**
 * Get left position of the given HTML element relative to the viewport.
 */
export default function elemLeft(elem: HTMLElement): number {
  return isElem(elem) ? toInt(elem.offsetLeft) : 0
}