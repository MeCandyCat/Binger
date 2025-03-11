"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getTrending } from "@/lib/tmdb"
import { MediaCard } from "@/components/discover/media-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Award } from "lucide-react"
import type { TMDBSearchResult } from "@/types"

function MediaSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

export function WeeklyPicks() {
  const [items, setItems] = useState<TMDBSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchWeeklyPicks() {
      try {
        setIsLoading(true)
        const results = await getTrending()
        // Get 4 random items from the trending results
        const shuffled = [...results].sort(() => 0.5 - Math.random())

        // Ensure each item has a media_type
        const processedResults = shuffled.slice(0, 4).map((item) => ({
          ...item,
          media_type: item.media_type || (item.title ? "movie" : "tv"),
        }))

        setItems(processedResults)
      } catch (error) {
        console.error("Error fetching weekly picks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeeklyPicks()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <MediaSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Award className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Weekly Picks</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MediaCard item={item} variant="featured" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
