import { sanArr, inArr, lower } from '..'

const controlKeys: string[] = [
  'Backspace',
  'Tab',
  'Enter',
  'Shift',
  'Escape',
  'ArrowLeft',
  'ArrowUp',
  'ArrowRight',
  'ArrowDown',
  'Delete',
  'Home',
  'End',
  'PageUp',
  'PageDown'
]

const fnKeys: string[] = [
  'Alt',
  'Meta',
  'Control'
]

type ReturnType<T extends boolean> = T extends true ? string[] : string

/**
 * Get information about the pressed keys.
 * Returnes a string like
 *    meta-alt-ctrl-[controlKey] OR
 *    meta-alt-ctrl-[char]
 */
export default function inputKeys<T extends boolean>(
  Event: KeyboardEvent,
  getInput: boolean = true,
  getControl: boolean = true,
  getFn: boolean = true,
  returnArray: T = true as T
): ReturnType<T> {
  const keys: string[] = []
  if (getFn) {
    if (Event.metaKey) {
      keys.push('meta')
    }
    if (Event.altKey) {
      keys.push('alt')
    }
    if (Event.ctrlKey) {
      keys.push('ctrl')
    }
  }
  if (Event.key && !inArr(Event.key, fnKeys)) {
    if (inArr(Event.key, controlKeys)) {
      if (getControl) {
        keys.push(lower(Event.key))
      }
    } else if (getInput) {
      keys.push(Event.key)
    }
  }
  if (returnArray === true) {
    return sanArr(keys) as ReturnType<T>
  }
  return sanArr(keys).join('-') as ReturnType<T>
}
