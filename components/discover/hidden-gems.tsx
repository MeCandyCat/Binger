"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getHiddenGems } from "@/lib/tmdb"
import { MediaCard } from "@/components/discover/media-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Gem, Loader2 } from "lucide-react"
import type { TMDBSearchResult } from "@/types"

export function HiddenGems() {
  const [items, setItems] = useState<TMDBSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    async function fetchHiddenGems() {
      try {
        setIsLoading(true)
        const results = await getHiddenGems()

        // Ensure each item has a media_type
        const processedResults = results.slice(0, 8).map((item) => ({
          ...item,
          media_type: item.media_type || (item.title ? "movie" : "tv"),
        }))

        setItems(processedResults)
        setHasMore(results.length > 8)
      } catch (error) {
        console.error("Error fetching hidden gems:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHiddenGems()
  }, [])

  const handleLoadMore = async () => {
    if (isLoadingMore) return

    try {
      setIsLoadingMore(true)
      const nextPage = page + 1
      const results = await getHiddenGems(nextPage)

      if (results.length === 0) {
        setHasMore(false)
      } else {
        // Ensure each item has a media_type
        const processedResults = results.map((item) => ({
          ...item,
          media_type: item.media_type || (item.title ? "movie" : "tv"),
        }))

        setItems((prevItems) => [...prevItems, ...processedResults])
        setPage(nextPage)
      }
    } catch (error) {
      console.error("Error loading more hidden gems:", error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Gem className="h-5 w-5" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[2/3] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Gem className="h-5 w-5" />
        <h2 className="text-2xl font-semibold">Hidden Gems</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <MediaCard item={item} />
          </motion.div>
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button onClick={handleLoadMore} disabled={isLoadingMore} className="min-w-[150px]">
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </section>
  )
}
