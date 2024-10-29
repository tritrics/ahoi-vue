import { toStr } from '../'

type Map = {
  [index: string]: string
}

const map: Map = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
}

/**
 * opposite of php's addslashes
 */
export default function escape(val: string): string {
  return toStr(val).replace(/[&<>"']/g, (m: string) => (map[m] ?? ''))
}