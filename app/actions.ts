"use server"

import type { Media } from "@/types"
import { getTMDBDetails } from "@/lib/tmdb"

// This would be replaced with your actual database
const mediaList: Media[] = []

export async function addMedia(tmdbId: number, type: "movie" | "tv", rating: number) {
  const details = await getTMDBDetails(tmdbId, type)

  const media: Media = {
    id: Math.random().toString(36).substring(7),
    tmdbId,
    title: details.title || details.name || "",
    overview: details.overview || "",
    type,
    posterPath: details.poster_path || "",
    rating,
    watchedAt: new Date().toISOString(),
    runtime:
      type === "movie" ? details.runtime || 0 : (details.episode_run_time?.[0] || 0) * (details.number_of_seasons || 0),
    watched: false,
    favorite: false,
    watchlist: false,
    dateAdded: new Date().toISOString(),
    ...(type === "tv" ? { seasons: details.number_of_seasons } : {}),
  }

  mediaList.unshift(media)
  return media
}

export function getMedia() {
  return mediaList
}

export function getStats() {
  const totalItems = mediaList.length
  const totalMinutes = mediaList.reduce((acc, item) => acc + (item.runtime || 0), 0)
  const totalShows = mediaList.filter((item) => item.type === "tv").length
  const totalMovies = mediaList.filter((item) => item.type === "movie").length

  return {
    totalItems,
    totalMinutes,
    totalShows,
    totalMovies,
  }
}
