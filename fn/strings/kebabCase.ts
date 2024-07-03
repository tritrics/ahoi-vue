import { wordsToArr } from '../'

/**
 * Creates a kebabCase from one or more strings.
 * Example: foo-bar
 */
export default function kebabCase(...args: any[]): string {
  const words: string[] = wordsToArr(...args).map(word => word.toLowerCase())
  return words.join('-')
}