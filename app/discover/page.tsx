"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingSection } from "@/components/discover/trending-section"
import { TrailerShowcase } from "@/components/discover/trailer-showcase"
import { TopRatedSection } from "@/components/discover/top-rated-section"
import { ThemeProvider } from "@/components/theme-provider"
import { NavBar } from "@/components/nav-bar"
import ErrorBoundary from "@/components/error-boundary"
import { MediaGrid } from "@/components/discover/media-grid"
import { searchTMDB } from "@/lib/tmdb"
import type { TMDBSearchResult } from "@/types"
import { useDebounce } from "@/hooks/use-debounce"
import { useMediaLibrary } from "@/hooks/use-media-library"
import { toast } from "@/components/ui/use-toast"

export default function DiscoverPage() {
  const { media, addMedia } = useMediaLibrary()
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedQuery = useDebounce(searchQuery, 300)
  const [searchResults, setSearchResults] = useState<TMDBSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    async function performSearch() {
      if (!debouncedQuery) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const results = await searchTMDB(debouncedQuery)
        setSearchResults(results.filter((r) => r.media_type === "movie" || r.media_type === "tv"))
      } catch (error) {
        console.error("Error searching:", error)
      } finally {
        setIsSearching(false)
      }
    }

    performSearch()
  }, [debouncedQuery])

  const handleAddMedia = async (
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
  ) => {
    try {
      await addMedia(
        tmdbId,
        type,
        rating,
        category,
        note,
        customDuration,
        seasons,
        episodesPerSeason,
        episodeDuration,
        completedSeasons,
      )

      toast({
        title: "Success",
        description: "Added to your library successfully.",
      })
    } catch (error) {
      console.error("Error adding media:", error)
      toast({
        title: "Error",
        description: "Failed to add media. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <motion.div
          className="min-h-screen bg-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container py-10">
            <NavBar
              onAddMedia={handleAddMedia}
              variant="discover"
              searchQuery={searchQuery}
              onSearchChange={handleSearch}
            />

            {searchQuery ? (
              <MediaGrid items={searchResults} isLoading={isSearching} />
            ) : (
              <>
                <TrendingSection />
                <TrailerShowcase />
                <TopRatedSection />
              </>
            )}
          </div>
        </motion.div>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

