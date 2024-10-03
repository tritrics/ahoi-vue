import type { IImmutableStore } from "../types"

export interface II18nStore extends IImmutableStore {
  load(lang: string): Promise<void>
}