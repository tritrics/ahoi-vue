import type { IBaseStore } from "../types"

export interface IMetaStore extends IBaseStore {}

export interface IMetaConfigFields {
  [ key: string ]: IMetaConfigField
}

export interface IMetaConfigField {
  site?: string
  page?: string
}