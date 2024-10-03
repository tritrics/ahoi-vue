export interface Object {
  [ key: string ]: any
}

export type Iterable = Object | Array<any>

/**
 * JSON
 * @TODO: make more precise, not working: https://dev.to/ankittanna/how-to-create-a-type-for-complex-json-object-in-typescript-d81
 */
export interface JSONObject {
    [ key: string]: any
}

// @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#params
export type DateTimeFormat = {
  year?: 'numeric' | '2-digit',
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow',
  day?: 'numeric' | '2-digit',
  hour?: 'numeric' | '2-digit',
  minute?: 'numeric' | '2-digit',
  second?: 'numeric' | '2-digit',
  weekday?: 'long' | 'short' | 'narrow',
  era?: 'long' | 'short' | 'narrow',
  dayPeriod?: 'long' | 'short' | 'narrow',
  fractionalSecondDigits?: 1 | 2 | 3,
  timeZoneName?: 'long' | 'short' | 'shortOffset' | 'longOffset' | 'shortGeneric' | 'longGeneric'
  formatMatcher?: 'basic' | 'best fit'
}