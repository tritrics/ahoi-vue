/**
 * Wait for given milliseconds
 */
export default async function wait(ms: number = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}