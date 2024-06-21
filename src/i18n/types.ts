import type { IAddonStore } from "../types"

export interface II18nStore extends IAddonStore {
  load(lang: string): Promise<void>
}