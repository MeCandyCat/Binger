"use client"

import { useState, useEffect } from "react"
import { HorizontalSection } from "@/components/discover/horizontal-section"
import { getTopRated } from "@/lib/tmdb"
import { Gem } from "lucide-react"
import type { TMDBSearchResult } from "@/types"

export function HiddenGems() {
  const [items, setItems] = useState<TMDBSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchHiddenGems = async (pageNum = 1, append = false) => {
    if (pageNum === 1) {
      setIsLoading(true)
    } else {
      setIsLoadingMore(true)
    }

    try {
      // Get top rated movies and TV shows with lower popularity (hidden gems)
      const [movies, tvShows] = await Promise.all([getTopRated("movie"), getTopRated("tv")])

      // Filter for items with high rating but lower popularity (hidden gems)
      const hiddenGems = [...movies, ...tvShows]
        .filter((item) => item.vote_average >= 7.5 && (item.vote_count ?? 0) >= 100 && (item.vote_count ?? 0) <= 5000)
        .map((item) => ({
          ...item,
          media_type: (item.title ? "movie" : "tv") as "movie" | "tv",
        }))
        .sort(() => 0.5 - Math.random()) // Shuffle for variety
        .slice(0, 20)

      if (append) {
        setItems((prev) => [...prev, ...hiddenGems])
      } else {
        setItems(hiddenGems)
      }

      setHasMore(hiddenGems.length >= 20)
    } catch (error) {
      console.error("Error fetching hidden gems:", error)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchHiddenGems(1, false)
  }, [])

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchHiddenGems(nextPage, true)
    }
  }

  return (
    <HorizontalSection
      title="Hidden Gems"
      icon={<Gem className="h-5 w-5" />}
      items={items}
      isLoading={isLoading}
      onLoadMore={loadMore}
      hasMore={hasMore}
      isLoadingMore={isLoadingMore}
    />
  )
}
