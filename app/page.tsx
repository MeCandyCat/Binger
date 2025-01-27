"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Stats } from "@/components/stats"
import { MediaCard } from "@/components/media-card"
import { AddMediaDialog } from "@/components/add-media-dialog"
import { MediaSheet } from "@/components/media-sheet"
import { getTMDBDetails, searchTMDB } from "@/lib/tmdb"
import { getStoredMedia, storeMedia } from "@/lib/storage"
import type { Media } from "@/types"
import ErrorBoundary from "@/components/error-boundary"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, User, MoreHorizontal, Filter, ArrowUpDown, FileJson, Download } from "lucide-react"
import { supabase, isSupabaseConfigured, getSupabaseErrorMessage } from "@/lib/supabase"
import type { Session } from "@supabase/supabase-js"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircleIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { ImportDialog } from "@/components/import-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function EmptyMediaState({}) {
  return (
    <Card className="w-full max-w-[150vh] mx-auto">
      <CardHeader className="items-center text-center">
        <PlusCircleIcon className="w-12 h-12 text-muted-foreground mb-4" />
        <CardTitle>Get Started</CardTitle>
        <CardDescription>Add Media to expand your collection</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center"></CardContent>
    </Card>
  )
}

export default function Home() {
  const [media, setMedia] = useState<Media[]>([])
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [configError, setConfigError] = useState<string | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isSupabaseReady, setIsSupabaseReady] = useState(false)
  const [isReorganizing, setIsReorganizing] = useState(false)
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([])
  const [activeFilters, setActiveFilters] = useState({
    tmdbRating: "",
    userRating: "",
    dateAdded: "",
  })
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const router = useRouter()

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true)
      setConfigError(null)

      // Check Supabase configuration
      const isConfigured = isSupabaseConfigured()
      setIsSupabaseReady(isConfigured)

      if (!isConfigured) {
        const errorMessage = getSupabaseErrorMessage()
        setConfigError(errorMessage || "Failed to initialize Supabase client.")
        setIsLoading(false)
        return
      }

      // Check session
      try {
        const { data, error } = await supabase!.auth.getSession()
        if (error) throw error
        setSession(data.session)
      } catch (error) {
        console.error("Error fetching session:", error)
        setConfigError("Failed to fetch user session. Please try logging in again.")
      }

      // Load initial data
      try {
        let mediaData: Media[]
        if (session) {
          const { data, error } = await supabase!.from("media").select("*").order("created_at", { ascending: false })
          if (error) throw error
          mediaData = data
        } else {
          mediaData = getStoredMedia()
        }
        setMedia(mediaData)

        // Test TMDB API configuration
        await searchTMDB("test")
      } catch (error) {
        console.error("Error loading initial data:", error)
        if (error instanceof Error && error.message.includes("TMDB API key is not configured")) {
          setConfigError("TMDB API key is not configured. Please check your environment variables.")
        } else {
          setConfigError("Failed to load your media library. Please try refreshing the page.")
        }
      }

      setIsLoading(false)
    }

    initializeApp()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase?.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    }) || { data: { subscription: { unsubscribe: () => {} } } }

    return () => subscription.unsubscribe()
  }, [session]) // Added session to the dependency array

  const stats = {
    totalMinutes: media.reduce((acc, item) => acc + (item.customDuration || item.runtime), 0),
    totalShows: media.filter((item) => item.type === "tv").length,
    totalMovies: media.filter((item) => item.type === "movie").length,
  }

  async function handleAddMedia(
    tmdbId: number,
    type: "movie" | "tv",
    rating: number,
    category: "Watched" | "Wishlist" | "Streaming",
    note?: string,
    customDuration?: number,
  ) {
    try {
      const details = await getTMDBDetails(tmdbId, type)

      const newMedia: Media = {
        id: Math.random().toString(36).substring(7),
        tmdbId,
        title: details.title || details.name || "",
        type,
        posterPath: details.poster_path,
        rating,
        tmdbRating: details.vote_average,
        watchedAt: new Date(),
        runtime:
          type === "movie"
            ? details.runtime || 0
            : (details.episode_run_time?.[0] || 0) * (details.number_of_seasons || 0),
        customDuration,
        note,
        overview: details.overview,
        category,
        ...(type === "tv" ? { seasons: details.number_of_seasons } : {}),
      }

      if (isSupabaseReady && session) {
        const { error } = await supabase!.from("media").insert(newMedia)
        if (error) throw error
      }

      const updatedMedia = [newMedia, ...media]
      setMedia(updatedMedia)
      if (!isSupabaseReady || !session) storeMedia(updatedMedia)
      toast({
        title: "Success",
        description: `Added ${newMedia.title} to your library.`,
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

  async function handleDeleteMedia(id: string) {
    try {
      if (isSupabaseReady && session) {
        const { error } = await supabase!.from("media").delete().eq("id", id)
        if (error) throw error
      }

      const updatedMedia = media.filter((item) => item.id !== id)
      setMedia(updatedMedia)
      if (!isSupabaseReady || !session) storeMedia(updatedMedia)
      setSelectedMedia(null)
      toast({
        title: "Success",
        description: "Media deleted from your library.",
      })
    } catch (error) {
      console.error("Error deleting media:", error)
      toast({
        title: "Error",
        description: "Failed to delete media. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleUpdateMedia(
    id: string,
    note: string,
    duration: number,
    rating: number,
    category: "Watched" | "Wishlist" | "Streaming",
  ) {
    try {
      const updatedMedia = media.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            note,
            customDuration: duration || item.runtime,
            rating,
            category,
          }
        }
        return item
      })

      if (isSupabaseReady && session) {
        const { error } = await supabase!
          .from("media")
          .update({ note, customDuration: duration || undefined, rating, category })
          .eq("id", id)
        if (error) throw error
      }

      setMedia(updatedMedia)
      if (!isSupabaseReady || !session) storeMedia(updatedMedia)
      setSelectedMedia(updatedMedia.find((item) => item.id === id) || null)
      toast({
        title: "Success",
        description: "Media updated successfully.",
      })
    } catch (error) {
      console.error("Error updating media:", error)
      toast({
        title: "Error",
        description: "Failed to update media. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filterOptions = [
    { name: "TMDB Rating", key: "tmdbRating", options: ["Top Rated", "Lowest Rated"] },
    { name: "Your Rating", key: "userRating", options: ["Top Rated", "Lowest Rated"] },
    { name: "Date Added", key: "dateAdded", options: ["Latest", "Oldest"] },
  ]

  function applyFilters(newFilters) {
    setActiveFilters(newFilters)
    const filtered = [...media]

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

  function clearFilters() {
    const clearedFilters = {
      tmdbRating: "",
      userRating: "",
      dateAdded: "",
    }
    setActiveFilters(clearedFilters)
    setFilteredMedia([])
  }

  function onDragEnd(result) {
    if (!result.destination) return

    const items = Array.from(media)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setMedia(items)
    if (isSupabaseReady && session) {
      // Update the order in Supabase
      items.forEach((item, index) => {
        supabase!.from("media").update({ order: index }).eq("id", item.id)
      })
    } else {
      storeMedia(items)
    }
  }

  function exportMedia() {
    const dataStr = JSON.stringify(media)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "binger_media_export.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  async function handleImportMedia(mediaToImport: Media[]) {
    try {
      console.log("Importing media:", mediaToImport)
      const newMedia = mediaToImport.filter(
        (importedItem) => !media.some((existingItem) => existingItem.id === importedItem.id),
      )
      const updatedMedia = [...media, ...newMedia]
      setMedia(updatedMedia)

      if (isSupabaseReady && session) {
        const { error } = await supabase!.from("media").insert(newMedia)
        if (error) throw error
      }

      // Always store in localStorage (cookies)
      storeMedia(updatedMedia)

      toast({
        title: "Import Successful",
        description: `Added ${newMedia.length} new items to your library.`,
      })
    } catch (error) {
      console.error("Error importing media:", error)
      console.log("Error details:", JSON.stringify(error, null, 2))
      toast({
        title: "Import Failed",
        description: "There was an error importing the media. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <div className="min-h-screen bg-background">
          <div className="container py-10">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold">Binger</h1>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                {isSupabaseReady && session ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Avatar>
                        <AvatarImage src={session.user.user_metadata.avatar_url} />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>{session.user.email}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={async () => {
                          await supabase?.auth.signOut()
                          router.push("/login")
                        }}
                      >
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button onClick={() => router.push("/login")}>Login</Button>
                )}
                <AddMediaDialog onAdd={handleAddMedia} />
              </div>
            </div>

            {configError && (
              <Alert variant="destructive" className="mb-8">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Configuration Error</AlertTitle>
                <AlertDescription>{configError}</AlertDescription>
              </Alert>
            )}

            <Stats totalMinutes={stats.totalMinutes} totalShows={stats.totalShows} totalMovies={stats.totalMovies} />

            <div className="flex justify-between items-center py-4">
              <h2 className="text-2xl font-bold">Collection</h2>
              <div className="flex items-center gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Watched">Watched</SelectItem>
                    <SelectItem value="Wishlist">Wishlist</SelectItem>
                    <SelectItem value="Streaming">Streaming</SelectItem>
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Filter className="mr-2 h-4 w-4" />
                        <span>Filter</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <ScrollArea className="h-[300px]">
                          {filterOptions.map((filterGroup) => (
                            <div key={filterGroup.key}>
                              <DropdownMenuLabel>{filterGroup.name}</DropdownMenuLabel>
                              <DropdownMenuRadioGroup
                                value={activeFilters[filterGroup.key]}
                                onValueChange={(value) => {
                                  const newFilters = { ...activeFilters, [filterGroup.key]: value }
                                  applyFilters(newFilters)
                                }}
                              >
                                <DropdownMenuRadioItem value="">All {filterGroup.name}</DropdownMenuRadioItem>
                                {filterGroup.options.map((option) => (
                                  <DropdownMenuRadioItem key={option} value={option}>
                                    {option}
                                  </DropdownMenuRadioItem>
                                ))}
                              </DropdownMenuRadioGroup>
                              <DropdownMenuSeparator />
                            </div>
                          ))}
                        </ScrollArea>
                        <DropdownMenuItem onSelect={clearFilters}>Clear Filters</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuItem onSelect={() => setIsReorganizing(!isReorganizing)}>
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                      <span>{isReorganizing ? "Save Order" : "Re-Organize"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setShowImportDialog(true)}>
                      <FileJson className="mr-2 h-4 w-4" />
                      <span>Import</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={exportMedia}>
                      <Download className="mr-2 h-4 w-4" />
                      <span>Export</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {isLoading ? (
              <p>Loading your media library...</p>
            ) : (
              <>
                {media.length === 0 ? (
                  <EmptyMediaState />
                ) : (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="media-list">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
                        >
                          {(filteredMedia.length > 0 ? filteredMedia : media)
                            .filter((item) => selectedCategory === "All" || item.category === selectedCategory)
                            .map((item, index) => (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                                isDragDisabled={!isReorganizing}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <MediaCard media={item} onClick={() => setSelectedMedia(item)} />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
                {media.length > 0 &&
                  (filteredMedia.length > 0 ? filteredMedia : media).filter(
                    (item) => selectedCategory === "All" || item.category === selectedCategory,
                  ).length === 0 && <p className="text-center mt-8">No media added in this category.</p>}
              </>
            )}

            <MediaSheet
              media={selectedMedia}
              onClose={() => setSelectedMedia(null)}
              onDelete={handleDeleteMedia}
              onUpdate={handleUpdateMedia}
            />
            <ImportDialog
              isOpen={showImportDialog}
              onClose={() => setShowImportDialog(false)}
              onImport={handleImportMedia}
            />
          </div>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

