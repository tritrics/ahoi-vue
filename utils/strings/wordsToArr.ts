import { toStr, isArr } from '../'

/**
 * Return words in a string as array.
 * Splits also FooBar, fooBar, foo-bar, foo_bar.
 */
export default function wordsToArr (...args: any[]): string[] {
  const str: string = args.filter(n => toStr(n)).join(' ')
  const res: string[] | null = str.replace(/([A-Z])/g, ' $1').match(/\b(\w+)\b/g)
  return isArr(res) ? res: []
}