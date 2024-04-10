import { isStr, has } from '../'

/**
 * Tries to find an HTML element.
 */
export default function getElem(mixed: any): HTMLElement | null {
  if (mixed instanceof HTMLElement || mixed === window) {
    return mixed
  } else if (isStr(mixed)) {
    return document.getElementById(mixed)
  } else if (has(mixed, '$el')) {
    return mixed.$el
  }
  return null
}