/**
 * Get the window (inner) height.
 * Get from document is safer for mobile, where especially the window-property changes with
 * showing/hiding the adressbar.
 */
export default function winHeight(fromDocument: boolean = true): number {
  return fromDocument ? document.documentElement.clientHeight : window.innerHeight
}