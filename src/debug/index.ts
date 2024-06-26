import type { IApiAddon } from '../types'

let level = 0

function init() {
  window.log = log
}

function log(...args: any) {
  let start: boolean = false
  if (args.length > 1) {
    if (args[0] === '>') {
      //args.shift()
      start = true
    }
    if (args[0] === '<') {
      //args.shift()
      level = level > 0 ? level - 1 : level
    }
  }
  console.log(' |'.repeat(level), ...args)
  if (start) {
      level++
  }
}

export function createDebug(): IApiAddon {
  return {
    name: 'debug',
    export: {
      log
    },
    init
  }
}