/**
 * Check, if a value is a HTML element.
 */
export default function isElem(val: any): val is HTMLElement {
  return val && val instanceof HTMLElement
}