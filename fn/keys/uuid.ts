/**
 * Creates a random hexadecimal string.
 * Not very strong, but good enough for most cases and short.
 */
export default function uuid(): string {
  const time: number = new Date().getTime()
  const rand: number = Math.floor(Math.random() * 8999) + 1000
  const num: number = time * 1000 + rand
  return num.toString(16)
}