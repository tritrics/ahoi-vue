import { wordsToArr } from '../'

/**
 * Creates a camelCase from one or more strings.
 * Example: fooBar
 */
export default function camelCase(...args: any[]): string {
  const words: string[] = wordsToArr(...args).map(word => word.toLowerCase())
  if (words.length > 0) {
    return `${words[0]}${words.slice(1).map((val) => val.charAt(0).toUpperCase() + val.slice(1)).join('')}`
  }
  return ''
}