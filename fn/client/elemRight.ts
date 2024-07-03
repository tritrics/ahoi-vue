import { isElem, elemWidth, elemLeft } from '..'

/**
 * Get right position of the given HTML element relative to the viewport.
 */
export default function elemRight(elem: HTMLElement): number {
  return isElem(elem) ? elemLeft(elem) + elemWidth(elem) : 0
}