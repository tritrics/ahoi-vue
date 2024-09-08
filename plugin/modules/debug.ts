import { isInt } from '../../fn'

/**
 * Provide a simple logging function to display async start/stop overview.
 * Disabled in production.
 */

/**
 * 0: off
 * 1: error
 * 2: warn
 * 3: log
 * 4: verbose
 */
let level = 0

let indent = 0

/**
 * Helper to get the log row
 */
function getLogRow(args: any[]): any[] {
  let add: number = 0
  if (args[0] === '>') {
    add = 1
    args.shift()
    args[0] = '%c' + args[0] + '%c'
    args.push('font-weight: bold')
    args.push('font-weight: normal')
    console.log(args)
  }
  if (args[0] === '<') {
    indent = indent > 0 ? indent - 1 : indent
    args.shift()
  }
  if (indent > 0) {
    args[0] = '|' + ' |'.repeat(indent-1) + ' ' + args[0]
  }
  indent = indent + add
  return args
}

const debug = {
  verbose(...args: any): void {
    if (level < 4) return
    console.log(...getLogRow(args))
  },
  log(...args: any): void {
    if (level < 3) return
    console.log(...getLogRow(args))
  },
  warn(...args: any): void {
    if (level < 2) return
    console.warn(...getLogRow(args))
  },
  error(...args: any): void {
    if (level < 1) return
    console.error(...getLogRow(args))
  },
  level(set: number|undefined): void {
    level = isInt(set, 0, 4) ? set : 0
  }
}

export default debug