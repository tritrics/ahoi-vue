/**
 * Provide a simple logging function to display async start/stop overview.
 * Disabled in production.
 */

let level = 0

/**
 * Helper to get the log row
 */
function getLogRow(args: any[]): any[] {
  const add: number = args[0] === '>' ? 1 : 0
  if (args[0] === '<') {
    level = level > 0 ? level - 1 : level
  }
  if (level > 0) {
    args.unshift('|' + ' |'.repeat(level-1))
  }
  level = level + add
  return args
}

const debug = {
  log(...args: any): void {
    if (level < 0) return
    console.log(...getLogRow(args))
  },
  warn(...args: any): void {
    if (level < 0) return
    console.warn(...getLogRow(args))
  },
  error(...args: any): void {
    if (level < 0) return
    console.error(...getLogRow(args))
  },
  activate(activate: boolean = true): void {
    level = activate ? 0 : -1
  }
}

export default debug