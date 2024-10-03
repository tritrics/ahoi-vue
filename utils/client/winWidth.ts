/**
 * Get the window width, including or excluding vertical scroll bar.
 * With scrollbar = value used in @media queries.
 * Get from document is safer for mobile, where especially the window-property changes with
 * showing/hiding the adressbar.
 */
export default function winWidth(withScrollbar: boolean = true): number {
  return withScrollbar ?  window.innerWidth : document.documentElement.clientWidth
}