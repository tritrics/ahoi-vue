import { isStr, isBool, isNull } from '../'

interface Colors {
  number: string
  string: string
  boolean: string
  null: string
  key: string
}

/**
 * Default style
 * 
 * {object}
 */
const defaultColors: Colors = {
  number: 'darkorange',
  string: 'green',
  boolean: 'blue',
  null: 'magenta',
  key: 'red',
}

/**
 * RegEx to parse code
 * from https://github.com/highlightjs/highlight.js
 * {reg}
 */
const reg = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g

/**
 * Helper function which adds styles to a code-snippet
 */
function colorize(match: string, colors: Colors): string {
  let color = colors.number
  if (/^"/.test(match)) {
    if (/:$/.test(match)) {
      color = colors.key
    } else {
      color = colors.string
      match = match.replace(/\\"/g, '"')
    }
  } else if (isBool(match, false)) {
    color = colors.boolean
  } else if (isNull(match)) {
    color = colors.null
  }
  return `<span style="color:${color}">${match}</span>`
}

/**
 * Highlight code
 */
export default function highlight(str: string, colors?: Colors): string {
  if (isStr(str)) {
    return str.replace(reg, (match) => colorize(match, colors || defaultColors))
  }
  return ''
}