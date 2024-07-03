/**
 * Get the HTML's document height (including invisible parts).
 */
export default function docHeight(): number {
  return Math.max(
    document.documentElement['clientHeight'],
    document.body['scrollHeight'],
    document.documentElement['scrollHeight'],
    document.body['offsetHeight'],
    document.documentElement['offsetHeight']
  )
}