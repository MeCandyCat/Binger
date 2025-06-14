import type { Media } from "./index"

export interface List {
  id: string
  name: string
  description: string
  color: string
  poster: string
  items: Media[]
  createdAt: Date
  updatedAt: Date
}

export type CreateListInput = Omit<List, "id" | "items" | "createdAt" | "updatedAt">
