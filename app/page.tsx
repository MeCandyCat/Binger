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
import { AlertCircle, User } from "lucide-react"
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
} from "@/components/ui/dropdown-menu"
import { PlusCircleIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function EmptyMediaState({}) {
  return (
    <Card className="w-full max-w-[150vh] mx-auto">
      <CardHeader className="items-center text-center">
        <PlusCircleIcon className="w-12 h-12 text-muted-foreground mb-4" />
        <CardTitle>Get Started</CardTitle>
        <CardDescription>
          Add Media to expand your collection
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
      </CardContent>
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
  }, [])

  const stats = {
    totalMinutes: media.reduce((acc, item) => acc + (item.customDuration || item.runtime), 0),
    totalShows: media.filter((item) => item.type === "tv").length,
    totalMovies: media.filter((item) => item.type === "movie").length,
  }

  async function handleAddMedia(
    tmdbId: number,
    type: "movie" | "tv",
    rating: number,
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

  async function handleUpdateMedia(id: string, note: string, duration: number) {
    try {
      const updatedMedia = media.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            note,
            customDuration: duration || item.runtime,
          }
        }
        return item
      })

      if (isSupabaseReady && session) {
        const { error } = await supabase!
          .from("media")
          .update({ note, customDuration: duration || undefined })
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

            <h2 className="text-2xl font-bold mt-12 mb-4">Your Collection</h2>
            {isLoading ? (
              <p>Loading your media library...</p>
            ) : (
              media.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {media.map((item) => (
                    <MediaCard key={item.id} media={item} onClick={() => setSelectedMedia(item)} />
                  ))}
                </div>
              ) : (
                <EmptyMediaState />
              )
            )}

            <MediaSheet
              media={selectedMedia}
              onClose={() => setSelectedMedia(null)}
              onDelete={handleDeleteMedia}
              onUpdate={handleUpdateMedia}
            />
          </div>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

