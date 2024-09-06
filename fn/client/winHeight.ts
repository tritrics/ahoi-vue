/**
 * Get the window height, including or excluding horizontal scroll bar.
 * Get from document is safer for mobile, where especially the window-property changes with
 * showing/hiding the adressbar.
 */
export default function winHeight(withScrollbar: boolean = true): number {
  return withScrollbar ? window.innerHeight : document.documentElement.clientHeight
}