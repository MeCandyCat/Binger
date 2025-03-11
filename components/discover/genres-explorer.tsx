"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getGenres, getByGenre } from "@/lib/tmdb"
import { MediaCard } from "@/components/discover/media-card"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import type { TMDBSearchResult, Genre } from "@/types"
import { WandSparkles } from "lucide-react"

function MediaSkeleton() {
  return (
    <div className="w-[200px] flex-none">
      <div className="space-y-3">
        <Skeleton className="aspect-[2/3] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  )
}

export function GenresExplorer() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null)
  const [items, setItems] = useState<TMDBSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingGenres, setIsLoadingGenres] = useState(true)

  useEffect(() => {
    async function fetchGenres() {
      try {
        const genreResults = await getGenres()
        setGenres(genreResults)
        if (genreResults.length > 0) {
          setSelectedGenre(genreResults[0])
        }
      } catch (error) {
        console.error("Error fetching genres:", error)
      } finally {
        setIsLoadingGenres(false)
      }
    }

    fetchGenres()
  }, [])

  useEffect(() => {
    async function fetchByGenre() {
      if (!selectedGenre) return

      setIsLoading(true)
      try {
        const results = await getByGenre(selectedGenre.id)
        // Ensure each item has a media_type
        const processedResults = results.slice(0, 10).map((item) => ({
          ...item,
          // If media_type is missing, determine it based on whether title or name is present
          media_type: item.media_type || (item.title ? "movie" : "tv"),
        }))
        setItems(processedResults)
      } catch (error) {
        console.error("Error fetching by genre:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchByGenre()
  }, [selectedGenre])

  return (
    <section className="py-6 space-y-4">
      <div className="flex items-center gap-2">
        <WandSparkles className="h-5 w-5" />
        <h2 className="text-2xl font-semibold">Explore by Genre</h2>
      </div>

      <ScrollArea className="pb-4">
        <div className="flex space-x-2">
          {isLoadingGenres ? (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-full" />
              ))}
            </>
          ) : (
            genres.map((genre) => (
              <Button
                key={genre.id}
                variant={selectedGenre?.id === genre.id ? "default" : "outline"}
                className="rounded-full flex-none"
                onClick={() => setSelectedGenre(genre)}
              >
                {genre.name}
              </Button>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <ScrollArea>
        <div className="flex space-x-4 pb-4">
          {isLoading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <MediaSkeleton key={i} />
              ))}
            </>
          ) : (
            items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="w-[200px] flex-none"
              >
                <MediaCard item={item} />
              </motion.div>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  )
}
