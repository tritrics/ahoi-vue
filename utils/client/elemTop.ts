import { isElem, toInt } from '..'

/**
 * Get top position of the given HTML element relative to the viewport.
 */
export default function elemTop(elem: HTMLElement): number {
  return isElem(elem) ? toInt(elem.getBoundingClientRect().top)  : 0
}