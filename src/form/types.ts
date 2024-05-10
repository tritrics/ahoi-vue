export interface IFormParams {
  [ key: string ]: FormPostValue
}

export interface IFormOptions {
  action?: string
  lang?: string
  immediate?: boolean
}

export type FormPostValue =
  string |
  number |
  (string|number)[]

