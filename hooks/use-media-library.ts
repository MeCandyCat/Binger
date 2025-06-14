"use client"

import { useState, useEffect } from "react"
import { getStoredMedia, storeMedia } from "@/lib/storage"
import { getTMDBDetails } from "@/lib/tmdb"
import type { Media } from "@/types"

export function useMediaLibrary() {
  const [media, setMedia] = useState<Media[]>([])

  useEffect(() => {
    const storedMedia = getStoredMedia()
    setMedia(storedMedia)
  }, [])

  const addMedia = async (
    tmdbId: number,
    type: "movie" | "tv",
    rating: number,
    category: "Watched" | "Wishlist" | "Streaming",
    note?: string,
    customDuration?: number,
    seasons?: number,
    episodesPerSeason?: number,
    episodeDuration?: number,
    completedSeasons?: number,
    providedLogo?: string, // Make logo parameter optional
  ) => {
    const existingMedia = media.find((item) => item.tmdbId === tmdbId && item.type === type)
    if (existingMedia) {
      throw new Error("Media already exists in library")
    }

    const details = await getTMDBDetails(tmdbId, type)

    // Find trailer
    const videos = details.videos?.results || []
    const trailer = videos.find(
      (video) => video.site === "YouTube" && (video.type === "Trailer" || video.type === "Teaser") && video.official,
    )

    // Find logo if not provided
    let logo = providedLogo
    if (!logo) {
      const englishLogo = details.images?.logos.find((logo) => logo.iso_639_1 === "en")
      if (englishLogo) {
        logo = `https://image.tmdb.org/t/p/w500${englishLogo.file_path}`
      }
    }

    // Calculate duration for TV shows if not provided
    let duration = customDuration
    if (type === "tv" && !customDuration && seasons && episodesPerSeason && episodeDuration) {
      duration = seasons * episodesPerSeason * episodeDuration
    }

    const newMedia: Media = {
      id: Math.random().toString(36).substring(7),
      tmdbId,
      title: details.title || details.name || "",
      type,
      posterPath: details.poster_path,
      backdropPath: details.backdrop_path,
      rating,
      tmdbRating: details.vote_average,
      watchedAt: new Date(),
      runtime: type === "movie" ? details.runtime || 0 : 0,
      customDuration: duration,
      note,
      overview: details.overview,
      category,
      watchedSeasons: category === "Streaming" && type === "tv" ? completedSeasons : undefined,
      seasons: type === "tv" ? seasons : undefined,
      episodesPerSeason: type === "tv" ? episodesPerSeason : undefined,
      episodeDuration: type === "tv" ? episodeDuration : undefined,
      release_date: details.release_date,
      first_air_date: details.first_air_date,
      trailerKey: trailer?.key || null,
      logo, // Add the logo
    }

    // Update state immediately
    const updatedMedia = [newMedia, ...media]
    setMedia(updatedMedia)

    // Store in localStorage
    storeMedia(updatedMedia)

    return newMedia
  }

  const updateMedia = async (id: string, updates: Partial<Media>) => {
    const updatedMedia = media.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          ...updates,
          // Ensure TV show stats are properly updated
          ...(item.type === "tv" && {
            seasons: updates.seasons || item.seasons,
            episodesPerSeason: updates.episodesPerSeason || item.episodesPerSeason,
            episodeDuration: updates.episodeDuration || item.episodeDuration,
            watchedSeasons: updates.category === "Streaming" ? updates.watchedSeasons || 0 : undefined,
          }),
        }
      }
      return item
    })
    setMedia(updatedMedia)
    storeMedia(updatedMedia)
  }

  const deleteMedia = async (id: string) => {
    const updatedMedia = media.filter((item) => item.id !== id)
    setMedia(updatedMedia)
    storeMedia(updatedMedia)
  }

  const reorderMedia = async (newOrder: Media[]) => {
    setMedia(newOrder)
    storeMedia(newOrder)
  }

  return {
    media,
    setMedia,
    addMedia,
    updateMedia,
    deleteMedia,
    reorderMedia,
  }
}
