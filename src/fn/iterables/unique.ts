import { isArr } from '../'

/**
 * Makes an array unique.
 */
export default function unique(arr: any[]): any[] {
  return isArr(arr) ? [...new Set(arr)] : []
}