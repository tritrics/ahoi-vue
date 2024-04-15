import { round, docHeight, winHeight } from '../'
import type { Object } from '../types'

/**
 * Get information of scroll position.
 */
export default function scrollPos() {
  const doc: number = docHeight()
  const win: number = winHeight()
  const res: Object = {
    top: window.scrollY,
    bottom: window.scrollY + win,
    relative: 100 - round((100 * (doc - (window.scrollY + win)) / (doc - win)), 2)
  }
  return res
}