import type { Media } from "@/types"

const STORAGE_KEY = "binger-media"

export function getStoredMedia(): Media[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []

  try {
    const parsed = JSON.parse(stored)
    return parsed.map((item: any) => ({
      ...item,
      watchedAt: new Date(item.watchedAt),
    }))
  } catch {
    return []
  }
}

export function storeMedia(media: Media[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(media))
  } catch (error) {
    console.error("Error storing media in localStorage:", error)
  }
}
