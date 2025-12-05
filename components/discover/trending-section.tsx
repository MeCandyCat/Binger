"use client"

import { useState, useEffect } from "react"
import { HorizontalSection } from "@/components/discover/horizontal-section"
import { getTrending } from "@/lib/tmdb"
import { TrendingUp } from "lucide-react"
import type { TMDBSearchResult } from "@/types"

export function TrendingSection() {
  const [items, setItems] = useState<TMDBSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchTrending = async (pageNum = 1, append = false) => {
    if (pageNum === 1) {
      setIsLoading(true)
    } else {
      setIsLoadingMore(true)
    }

    try {
      const results = await getTrending()
      const processedResults = results.map((item) => ({
        ...item,
        media_type: item.media_type || (item.title ? "movie" : "tv"),
      }))

      if (append) {
        setItems((prev) => [...prev, ...processedResults])
      } else {
        setItems(processedResults)
      }

      setHasMore(processedResults.length >= 20)
    } catch (error) {
      console.error("Error fetching trending:", error)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchTrending(1, false)
  }, [])

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchTrending(nextPage, true)
    }
  }

  return (
    <HorizontalSection
      title="Trending Now"
      icon={<TrendingUp className="h-5 w-5" />}
      items={items}
      isLoading={isLoading}
      onLoadMore={loadMore}
      hasMore={hasMore}
      isLoadingMore={isLoadingMore}
    />
  )
}
