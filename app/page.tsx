"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ThemeProvider } from "@/components/theme-provider"
import { Stats } from "@/components/stats"
import { storeMedia } from "@/lib/storage"
import type { Media } from "@/types"
import ErrorBoundary from "@/components/error-boundary"
import { toast } from "@/components/ui/use-toast"
import { NavBar } from "@/components/nav-bar"
import { MediaFilters } from "@/components/media-filters"
import { ImportDialog } from "@/components/import-dialog"
import { MediaReorganizer } from "@/components/media-reorganizer"
import { useMediaLibrary } from "@/hooks/use-media-library"
import { useLists } from "@/hooks/use-lists"
import { useSettings } from "@/hooks/use-settings"
import { ListSheet } from "@/components/lists/list-sheet"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ListIcon } from "lucide-react"
import { MediaCard } from "@/components/media-card"
import { MediaSheet } from "@/components/media-sheet"
import { ListPoster } from "@/components/lists/list-poster"

const fadeInAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
    },
  }),
}

export function EmptyMediaState() {
  return (
    <div className="text-center p-8">
      <h2 className="text-2xl font-semibold mb-4">Your collection is empty</h2>
      <p>Start adding media to your collection!</p>
    </div>
  )
}

export default function Home() {
  const { media, addMedia, updateMedia, deleteMedia, reorderMedia } = useMediaLibrary()
  const { lists } = useLists()
  const { settings } = useSettings()
  const [isLoading, setIsLoading] = useState(true)
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([])
  const [activeFilters, setActiveFilters] = useState({
    tmdbRating: "",
    userRating: "",
    dateAdded: "",
  })
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [isReorganizerOpen, setIsReorganizerOpen] = useState(false)
  const [selectedList, setSelectedList] = useState(null)
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)

  // Load initial media and handle loading state
  useEffect(() => {
    setIsLoading(false)
  }, [])

  // Update filtered media whenever the main media array changes
  useEffect(() => {
    if (activeFilters.tmdbRating || activeFilters.userRating || activeFilters.dateAdded) {
      applyFilters(activeFilters)
    }
  }, [activeFilters]) // Updated dependency

  const applyFilters = (newFilters) => {
    setActiveFilters(newFilters)
    const filtered = [...media] // Use the current media array

    if (newFilters.tmdbRating) {
      filtered.sort((a, b) =>
        newFilters.tmdbRating === "Top Rated" ? b.tmdbRating - a.tmdbRating : a.tmdbRating - b.tmdbRating,
      )
    }

    if (newFilters.userRating) {
      filtered.sort((a, b) => (newFilters.userRating === "Top Rated" ? b.rating - a.rating : a.rating - b.rating))
    }

    if (newFilters.dateAdded) {
      filtered.sort((a, b) =>
        newFilters.dateAdded === "Latest"
          ? new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime()
          : new Date(a.watchedAt).getTime() - new Date(b.watchedAt).getTime(),
      )
    }

    setFilteredMedia(filtered)
  }

  const clearFilters = () => {
    setActiveFilters({
      tmdbRating: "",
      userRating: "",
      dateAdded: "",
    })
    setFilteredMedia([])
  }

  const exportMedia = () => {
    const dataStr = JSON.stringify(media)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "binger_media_export.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const handleImportMedia = async (mediaToImport: Media[]) => {
    try {
      const newMedia = mediaToImport.filter(
        (importedItem) => !media.some((existingItem) => existingItem.id === importedItem.id),
      )
      const updatedMedia = [...media, ...newMedia]
      storeMedia(updatedMedia)

      toast({
        title: "Import Successful",
        description: `Added ${newMedia.length} new items to your library.`,
      })
    } catch (error) {
      console.error("Error importing media:", error)
      toast({
        title: "Import Failed",
        description: "There was an error importing the media. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredMediaBySearch = (mediaToFilter: Media[]) => {
    if (!searchQuery) return mediaToFilter
    return mediaToFilter.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const displayedMedia = filteredMedia.length > 0 ? filteredMediaBySearch(filteredMedia) : filteredMediaBySearch(media)

  const handleSaveReorganizedMedia = (newOrder: Media[]) => {
    reorderMedia(newOrder)
    toast({
      title: "Success",
      description: "Media order updated successfully.",
    })
  }

  // Filter lists by search query
  const filteredLists = lists.filter(
    (list) => !searchQuery || list.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Render a list card for the collection view
  const ListCard = ({ list, index }) => {
    return (
      <div key={`list-${list.id}`}>
        <Card
          className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-95 hover:shadow-xl h-full border-2"
          style={{ borderColor: list.color }}
          onClick={() => setSelectedList(list)}
        >
          <div className="aspect-[2/3] relative">
            {list.poster && !list.poster.includes("placeholder.svg") ? (
              <img src={list.poster || "/placeholder.svg"} alt={list.name} className="object-cover w-full h-full" />
            ) : (
              <ListPoster
                title={list.name}
                color={list.color}
                itemCount={list.items.length}
                className="w-full h-full"
              />
            )}
            <div className="absolute top-2 right-2 z-20">
              <Badge className="bg-black/20 hover:bg-black/30 backdrop-blur-lg text-white flex items-center gap-1">
                <ListIcon className="w-3 h-3" />
                <span>{list.items.length}</span>
              </Badge>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-semibold text-white text-lg mb-2">{list.name}</h3>
                <div className="mt-2 text-xs text-white/60">
                  {list.items.length} item{list.items.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
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
            <NavBar onAddMedia={addMedia} />

            <Stats media={media} />

            <MediaFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              activeFilters={activeFilters}
              applyFilters={applyFilters}
              clearFilters={clearFilters}
              setShowImportDialog={setShowImportDialog}
              exportMedia={exportMedia}
              setIsReorganizerOpen={setIsReorganizerOpen}
            />

            {isLoading ? (
              <p>Loading your media library...</p>
            ) : (
              <>
                {media.length === 0 && !settings.showListsInCollection ? (
                  <EmptyMediaState />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {/* Show media items */}
                    {displayedMedia
                      .filter((item) => selectedCategory === "All" || item.category === selectedCategory)
                      .map((item, index) => (
                        <MediaCard key={item.id} media={item} onClick={() => setSelectedMedia(item)} index={index} />
                      ))}

                    {/* Show lists if setting is enabled */}
                    {settings.showListsInCollection &&
                      selectedCategory === "All" &&
                      filteredLists.map((list, index) => (
                        <motion.div
                          key={`list-motion-${list.id}`}
                          variants={fadeInAnimation}
                          initial="hidden"
                          animate="visible"
                          custom={index}
                          layoutId={`list-${list.id}`}
                          layout={false}
                        >
                          <ListCard key={list.id} list={list} index={index} />
                        </motion.div>
                      ))}
                  </div>
                )}

                {media.length > 0 &&
                  displayedMedia.filter((item) => selectedCategory === "All" || item.category === selectedCategory)
                    .length === 0 &&
                  !settings.showListsInCollection && (
                    <p className="text-center mt-8">No media found in this category.</p>
                  )}
              </>
            )}

            <ImportDialog
              isOpen={showImportDialog}
              onClose={() => setShowImportDialog(false)}
              onImport={handleImportMedia}
            />

            <ListSheet list={selectedList} onClose={() => setSelectedList(null)} />

            <MediaSheet
              media={selectedMedia}
              onClose={() => setSelectedMedia(null)}
              onDelete={deleteMedia}
              onUpdate={(id, updates) => {
                updateMedia(id, updates)
                setSelectedMedia((prev) => (prev && prev.id === id ? { ...prev, ...updates } : prev))
              }}
            />
          </div>
        </motion.div>
        <MediaReorganizer
          isOpen={isReorganizerOpen}
          onClose={() => setIsReorganizerOpen(false)}
          media={media}
          onSave={handleSaveReorganizedMedia}
        />
      </ThemeProvider>
    </ErrorBoundary>
  )
}

