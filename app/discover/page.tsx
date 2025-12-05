"use client"

import { useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { TrendingSection } from "@/components/discover/trending-section"
import { TrailerShowcase } from "@/components/discover/trailer-showcase"
import { GenresExplorer } from "@/components/discover/genres-explorer"
import { HiddenGems } from "@/components/discover/hidden-gems"
import { ForYouSection } from "@/components/discover/for-you-section"
import { ThemeProvider } from "@/components/theme-provider"
import { NavBar } from "@/components/nav-bar"
import ErrorBoundary from "@/components/error-boundary"
import { MediaGrid } from "@/components/discover/media-grid"
import { searchTMDB } from "@/lib/tmdb"
import type { TMDBSearchResult } from "@/types"
import { useDebounce } from "@/hooks/use-debounce"
import { useMediaLibrary } from "@/hooks/use-media-library"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
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

export default function DiscoverPage() {
  const { media, addMedia } = useMediaLibrary()
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedQuery = useDebounce(searchQuery, 300)
  const [searchResults, setSearchResults] = useState<TMDBSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasRecommendations, setHasRecommendations] = useState(false)

  // Check if user has media for recommendations
  useEffect(() => {
    setHasRecommendations(media.length > 0)
  }, [media])

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
              variant="discover"
              searchQuery={searchQuery}
              onSearchChange={handleSearch}
            />

            {searchQuery ? (
              <MediaGrid items={searchResults} isLoading={isSearching} />
            ) : (
              <div className="space-y-8">
                {/* #1: Explore by Genre */}
                <Suspense fallback={<SectionSkeleton />}>
                  <GenresExplorer />
                </Suspense>

                {/* #2: For You (if available) */}
                {hasRecommendations && (
                  <Suspense fallback={<SectionSkeleton />}>
                    <ForYouSection />
                  </Suspense>
                )}

                {/* #3: Featured Trailers */}
                <Suspense fallback={<div className="h-[400px] w-full rounded-xl bg-muted animate-pulse" />}>
                  <TrailerShowcase />
                </Suspense>

                {/* #4: Trending Now */}
                <Suspense fallback={<SectionSkeleton />}>
                  <TrendingSection />
                </Suspense>

                {/* #5: Hidden Gems */}
                <Suspense fallback={<SectionSkeleton />}>
                  <HiddenGems />
                </Suspense>

                {/* For You at the end if not available earlier */}
                {!hasRecommendations && (
                  <Suspense fallback={<SectionSkeleton />}>
                    <ForYouSection />
                  </Suspense>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
