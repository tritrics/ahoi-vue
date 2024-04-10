import { toStr, sanArr } from '../'

/**
 * Split a path to an array of nodes.
 */
export default function pathToArr(val: string): string[] {
  return sanArr(toStr(val).split('/'))
}