import type { IUserStore } from "../types"

export interface IMetaStore extends IUserStore {}

export interface IMetaConfigFields {
  [ key: string ]: IMetaConfigField
}

export interface IMetaConfigField {
  site?: string
  page?: string
}