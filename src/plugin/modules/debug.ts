/**
 * Provide a simple logging function to display async start/stop overview.
 * ahoi.log('>', [start message])
 * ahoi.log('<', [end message])
 * Disabled in production.
 */
let logLevel: number = 0

/**
 * normal logging
 */
export function log(...args: any): void {
  if (logLevel < 0) return
  console.log(...getLogRow(args))
}

/**
 * warning
 */
export function warn(...args: any): void {
  if (logLevel < 0) return
  console.warn(...getLogRow(args))
}

/**
 * error
 */
export function error(...args: any): void {
  if (logLevel < 0) return
  console.error(...getLogRow(args))
}

/**
 * Helper to get the log row
 */
function getLogRow(args: any[]): any[] {
  const add: number = args[0] === '>' ? 1 : 0
  if (args[0] === '<') {
    logLevel = logLevel > 0 ? logLevel - 1 : logLevel
  }
  if (logLevel > 0) {
    args.unshift('|' + ' |'.repeat(logLevel-1))
  }
  logLevel = logLevel + add
  return args
}

/**
 * activate/deactivate logging
 */
export function activateLog(activate: boolean = true): void {
  logLevel = activate ? 0 : -1
  window.ahoi = { log, warn, error }
}