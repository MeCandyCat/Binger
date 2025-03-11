"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MediaCard } from "@/components/discover/media-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useMediaLibrary } from "@/hooks/use-media-library"
import { getRecommendations } from "@/lib/tmdb"
import { Sparkles } from "lucide-react"
import type { TMDBSearchResult } from "@/types"

export function ForYouSection() {
  const { media } = useMediaLibrary()
  const [recommendations, setRecommendations] = useState<TMDBSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [noRecommendations, setNoRecommendations] = useState(false)

  useEffect(() => {
    async function fetchRecommendations() {
      if (media.length === 0) {
        setNoRecommendations(true)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        // Get the 5 most recent items from the user's library
        const recentMedia = media.slice(-5)

        // Collect all recommendations
        let allRecommendations: TMDBSearchResult[] = []

        // For each media item, get recommendations
        for (const item of recentMedia) {
          try {
            const recs = await getRecommendations(item.tmdbId, item.type)
            if (recs.length > 0) {
              allRecommendations = [...allRecommendations, ...recs]
            }
          } catch (error) {
            console.error(`Error fetching recommendations for ${item.title}:`, error)
            // Continue with other items even if one fails
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

        // Sort by vote average and take top 8
        const sortedRecommendations = processedRecommendations
          .sort((a, b) => b.vote_average - a.vote_average)
          .slice(0, 8)

        if (sortedRecommendations.length === 0) {
          setNoRecommendations(true)
        } else {
          setRecommendations(sortedRecommendations)
          setNoRecommendations(false)
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error)
        setNoRecommendations(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [media])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
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
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5" />
        <h2 className="text-2xl font-semibold">For You</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {recommendations.map((item, index) => (
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
    </section>
  )
}
