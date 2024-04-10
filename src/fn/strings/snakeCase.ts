import { wordsToArr } from '../'

/**
 * Creates a snakeCase from one or more strings.
 * Example: foo_bar
 */
export default function snakeCase(...args: any[]): string {
  const words: string[] = wordsToArr(...args).map(word => word.toLowerCase())
  return words.join('_')
}