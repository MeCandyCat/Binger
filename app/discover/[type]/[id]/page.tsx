"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTMDBDetails } from "@/lib/tmdb"
import { useMediaLibrary } from "@/hooks/use-media-library"
import { toast } from "@/components/ui/use-toast"
import { NavBar } from "@/components/nav-bar"
import { AddToLibrary } from "@/components/discover/add-to-library"
import Link from "next/link"
import { ThemeProvider } from "@/components/theme-provider"
import { use } from "react"

import { HeroSection } from "@/components/media-detail/hero-section"
import { ActionButtons } from "@/components/media-detail/action-buttons"
import { OverviewTab } from "@/components/media-detail/overview-tab"
import { CastTab } from "@/components/media-detail/cast-tab"
import { DetailsTab } from "@/components/media-detail/details-tab"
import { ReviewsTab } from "@/components/media-detail/reviews-tab"
import { MediaDetailSkeleton } from "@/components/media-detail/media-detail-skeleton"

interface PageProps {
  params: Promise<{ type: string; id: string }>
}

export default function MediaDetailPage({ params }: PageProps) {
  // Unwrap the params Promise
  const { type, id } = use(params)
  
  const router = useRouter()
  const { media, addMedia } = useMediaLibrary()
  const [details, setDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null)
  const [logo, setLogo] = useState<string | null>(null)
  const [cast, setCast] = useState<any[]>([])
  const [crew, setCrew] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])

  // Validate media type
  const mediaType = type === "tv" || type === "movie" ? type : "movie"
  const mediaId = Number.parseInt(id)

  // Check if media is already in library
  const existingMedia = media.find((m) => m.tmdbId === mediaId && m.type === mediaType)

  useEffect(() => {
    async function fetchDetails() {
      setIsLoading(true)
      try {
        // Fetch media details with credits and reviews
        const result = await getTMDBDetails(mediaId, mediaType as "movie" | "tv", "videos,images,credits,reviews")
        setDetails(result)

        // Set cast and crew
        if (result.credits) {
          setCast(result.credits.cast?.slice(0, 12) || [])
          setCrew(result.credits.crew?.slice(0, 8) || [])
        }

        // Set reviews
        if (result.reviews) {
          setReviews(result.reviews.results?.slice(0, 5) || [])
        }

        // Find trailer
        const videos = result.videos?.results || []
        const trailer = videos.find(
          (video) =>
            video.site === "YouTube" && (video.type === "Trailer" || video.type === "Teaser") && video.official,
        )

        if (trailer) {
          setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`)
        } else {
          setTrailerUrl(null)
        }

        // Find logo
        const englishLogo = result.images?.logos.find((logo) => logo.iso_639_1 === "en")
        if (englishLogo) {
          setLogo(`https://image.tmdb.org/t/p/w500${englishLogo.file_path}`)
        } else {
          setLogo(null)
        }
      } catch (error) {
        console.error("Error fetching details:", error)
        toast({
          title: "Error",
          description: "Failed to load media details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (mediaId) {
      fetchDetails()
    }
  }, [mediaId, mediaType])

  const handleAddToLibrary = async (
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
        logo || undefined,
      )
      toast({
        title: "Success",
        description: "Added to your library",
      })
      setShowAddDialog(false)
    } catch (error) {
      console.error("Error adding media:", error)
      toast({
        title: "Error",
        description: "Failed to add to library",
        variant: "destructive",
      })
    }
  }

  // Define tabs
  const tabs = [
    { name: "Overview", value: "overview" },
    { name: "Cast & Crew", value: "cast" },
    { name: "Details", value: "details" },
    ...(reviews.length > 0 ? [{ name: "Reviews", value: "reviews" }] : []),
  ]

  // Get crew by role
  const directors = crew.filter((person) => person.job === "Director")
  const writers = crew.filter((person) => ["Writer", "Screenplay"].includes(person.job))
  const producers = crew.filter((person) => person.job === "Producer").slice(0, 2)

  // Handle tab switching
  const handleViewAllCast = () => {
    setActiveTab("cast")
  }

  const handleViewAllReviews = () => {
    setActiveTab("reviews")
  }

  if (isLoading || !details) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <div className="min-h-screen bg-background">
          <div className="container py-10">
            <NavBar />
            <div className="mb-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/discover">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Discover
                </Link>
              </Button>
            </div>
            <MediaDetailSkeleton />
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-background">
        <div className="container py-10">
          <NavBar />
          <div className="mb-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/discover">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Discover
              </Link>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Hero Section */}
            <HeroSection details={details} mediaType={mediaType} logo={logo} />

            {/* Action Buttons */}
            <ActionButtons
              trailerUrl={trailerUrl}
              existingMedia={existingMedia}
              mediaId={mediaId}
              mediaType={mediaType}
              onAddClick={() => setShowAddDialog(true)}
            />

            {/* Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="p-0 h-auto bg-background gap-1">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <OverviewTab
                  details={details}
                  cast={cast}
                  directors={directors}
                  writers={writers}
                  producers={producers}
                  reviews={reviews}
                  onViewAllCast={handleViewAllCast}
                  onViewAllReviews={handleViewAllReviews}
                />
              </TabsContent>

              <TabsContent value="cast" className="mt-6">
                <CastTab cast={cast} crew={crew} />
              </TabsContent>

              <TabsContent value="details" className="mt-6">
                <DetailsTab details={details} mediaType={mediaType} />
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <ReviewsTab reviews={reviews} />
              </TabsContent>
            </Tabs>
          </motion.div>

          {showAddDialog && details && (
            <AddToLibrary
              isOpen={showAddDialog}
              onClose={() => setShowAddDialog(false)}
              details={details}
              mediaType={mediaType as "movie" | "tv"}
              onAdd={handleAddToLibrary}
            />
          )}
        </div>
      </div>
    </ThemeProvider>
  )
}