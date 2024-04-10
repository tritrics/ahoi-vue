import { wordsToArr } from '../'

/**
 * Creates a pascalCase from one or more strings.
 * Example: FooBar
 */
export default function pascalCase(...args: any[]): string {
  const words: string[] = wordsToArr(...args).map(word => word.toLowerCase())
  return words.map((val) => val.charAt(0).toUpperCase() + val.slice(1)).join('')
}