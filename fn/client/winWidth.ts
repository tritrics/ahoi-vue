/**
 * Get the window (inner) width.
 * Get from document is safer for mobile, where especially the window-property changes with
 * showing/hiding the adressbar.
 */
export default function winWidth(fromDocument: boolean = true): number {
  return fromDocument ? document.documentElement.clientWidth : window.innerWidth
}