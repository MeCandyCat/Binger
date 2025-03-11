"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getTrending, getTMDBDetails } from "@/lib/tmdb"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Check, Film } from "lucide-react"
import { MediaDetailsDialog } from "@/components/discover/media-details-dialog"
import { useMediaLibrary } from "@/hooks/use-media-library"
import type { TMDBSearchResult } from "@/types"

function MediaSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

export function TrailerShowcase() {
  const [items, setItems] = useState<TMDBSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [itemsWithLogos, setItemsWithLogos] = useState<Map<number, string>>(new Map())
  const { media } = useMediaLibrary()

  useEffect(() => {
    async function fetchTrailers() {
      try {
        const results = await getTrending()
        const withBackdrops = results.filter((item) => item.backdrop_path)
        const itemsToShow = withBackdrops.slice(0, 6)
        setItems(itemsToShow)

        // Fetch logos for each item
        const logoMap = new Map()

        for (const item of itemsToShow) {
          try {
            const mediaType = item.media_type || (item.title ? "movie" : "tv")
            const details = await getTMDBDetails(item.id, mediaType)

            // Get the English logo if available
            const logoPath = details.images?.logos?.find((logo: any) => logo.iso_639_1 === "en")?.file_path

            if (logoPath) {
              logoMap.set(item.id, `https://image.tmdb.org/t/p/w500${logoPath}`)
            }
          } catch (error) {
            console.error(`Error fetching logo for item ${item.id}:`, error)
          }
        }

        setItemsWithLogos(logoMap)
      } catch (error) {
        console.error("Error fetching trailers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrailers()
  }, [])

  return (
    <section className="py-6 space-y-4">
      <div className="flex items-center gap-2">
        <Film className="h-5 w-5" />
        <h2 className="text-2xl font-semibold">Featured Trailers</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <MediaSkeleton key={i} />
            ))}
          </>
        ) : (
          items.map((item, index) => (
            <TrailerCard key={item.id} item={item} logoUrl={itemsWithLogos.get(item.id)} index={index} />
          ))
        )}
      </div>
    </section>
  )
}

function TrailerCard({ item, logoUrl, index }: { item: TMDBSearchResult; logoUrl?: string; index: number }) {
  const [showDetails, setShowDetails] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { media } = useMediaLibrary()

  // Ensure media_type is always defined
  const mediaType = item.media_type || (item.title ? "movie" : "tv")

  // Check if the item is already in the user's library
  const isInLibrary = media.some((m) => m.tmdbId === item.id && m.type === mediaType)

  const rating = item.vote_average?.toFixed(1) || "N/A"

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
        <Card
          className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-95 hover:shadow-xl"
          onClick={() => setShowDetails(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="aspect-video relative">
            <img
              src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
              alt={item.title || item.name}
              className={`object-cover w-full h-full transition-all duration-300 ${
                isHovered ? "blur-sm scale-105" : ""
              }`}
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=300&width=500"
              }}
            />

            {/* Rating badge - top right */}
            <div className="absolute top-2 right-2 z-20">
              <Badge className="bg-black/20 hover:bg-black/30 backdrop-blur-lg text-white flex items-center gap-1">
                <Star className="w-3 h-3 text-blue-400 fill-current" />
                <span>{rating}</span>
              </Badge>
            </div>

            {/* Title and info overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <motion.div
                className="absolute bottom-4 left-4"
                animate={{
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              >
                {logoUrl ? (
                  <img
                    src={logoUrl || "/placeholder.svg"}
                    alt={item.title || item.name || "Movie logo"}
                    className="object-contain h-12 max-w-[200px]"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=50&width=150"
                      e.currentTarget.style.display = "none"
                      // Show the title instead
                      const parent = e.currentTarget.parentElement
                      if (parent) {
                        const titleEl = document.createElement("h3")
                        titleEl.className = "font-semibold text-white text-lg uppercase"
                        titleEl.textContent = item.title || item.name || ""
                        parent.appendChild(titleEl)
                      }
                    }}
                  />
                ) : (
                  <h3 className="font-semibold text-white text-lg uppercase">{item.title || item.name}</h3>
                )}
              </motion.div>

              {isInLibrary && (
                <div className="absolute bottom-4 right-4">
                  <Badge variant="outline" className="bg-white/10 border-none text-white">
                    <Check className="w-3 h-3 mr-1" />
                    In Library
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      <MediaDetailsDialog
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        mediaId={item.id}
        mediaType={mediaType}
      />
    </>
  )
}
