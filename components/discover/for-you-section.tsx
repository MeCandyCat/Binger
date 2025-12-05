"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { MediaCard } from "@/components/discover/media-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useMediaLibrary } from "@/hooks/use-media-library"
import { getRecommendations } from "@/lib/tmdb"
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import type { TMDBSearchResult } from "@/types"

export function ForYouSection() {
  const { media } = useMediaLibrary()
  const [recommendations, setRecommendations] = useState<TMDBSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [noRecommendations, setNoRecommendations] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const fetchRecommendations = async (pageNum = 1, append = false) => {
    if (media.length === 0) {
      setNoRecommendations(true)
      setIsLoading(false)
      return
    }

    if (pageNum === 1) {
      setIsLoading(true)
    } else {
      setIsLoadingMore(true)
    }

    try {
      // Get random items from the user's library for variety
      const shuffledMedia = [...media].sort(() => 0.5 - Math.random())
      const selectedMedia = shuffledMedia.slice(0, Math.min(5, media.length))

      // Collect all recommendations
      let allRecommendations: TMDBSearchResult[] = []

      // For each media item, get recommendations
      for (const item of selectedMedia) {
        try {
          const recs = await getRecommendations(item.tmdbId, item.type)
          if (recs.length > 0) {
            allRecommendations = [...allRecommendations, ...recs]
          }
        } catch (error) {
          console.error(`Error fetching recommendations for ${item.title}:`, error)
        }
      }

      // Remove duplicates by ID
      const uniqueRecommendations = Array.from(new Map(allRecommendations.map((item) => [item.id, item])).values())

      // Remove items that are already in the user's library
      const filteredRecommendations = uniqueRecommendations.filter((rec) => !media.some((m) => m.tmdbId === rec.id))

      // Ensure each item has a media_type
      const processedRecommendations = filteredRecommendations.map((item) => ({
        ...item,
        media_type: item.media_type || (item.title ? "movie" : "tv"),
      }))

      // Sort by vote average
      const sortedRecommendations = processedRecommendations.sort((a, b) => b.vote_average - a.vote_average)

      if (append) {
        setRecommendations((prev) => {
          const combined = [...prev, ...sortedRecommendations]
          const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values())
          return unique
        })
      } else {
        setRecommendations(sortedRecommendations)
      }

      if (sortedRecommendations.length === 0 && pageNum === 1) {
        setNoRecommendations(true)
      } else {
        setNoRecommendations(false)
        setHasMore(sortedRecommendations.length >= 10)
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error)
      if (pageNum === 1) {
        setNoRecommendations(true)
      }
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchRecommendations(1, false)
  }, [media])

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchRecommendations(nextPage, true)
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      const isNearEnd = scrollLeft + clientWidth >= scrollWidth - 200

      if (isNearEnd && !isLoadingMore && hasMore) {
        loadMore()
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48 space-y-3">
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

  if (noRecommendations) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">For You</h2>
        </div>
        <div className="text-center py-10 bg-muted/30 rounded-lg">
          <h3 className="text-xl font-medium mb-2">No recommendations yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Add more movies and shows to your library to get personalized recommendations based on your taste.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">For You</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => scroll("left")} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll("right")} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          onScroll={handleScroll}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {recommendations.map((item, index) => (
            <motion.div
              key={item.id}
              className="flex-shrink-0 w-48"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <MediaCard item={item} />
            </motion.div>
          ))}
          {isLoadingMore && (
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`loading-${i}`} className="flex-shrink-0 w-48 space-y-3">
                  <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
