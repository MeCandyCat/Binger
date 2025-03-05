"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Lock, Unlock, Star, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { useMediaQuery } from "@/hooks/use-media-query"
import { searchTMDB, getTMDBDetails } from "@/lib/tmdb"
import type { TMDBSearchResult } from "@/types"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useDebounce } from "@/hooks/use-debounce"
import { useMediaLibrary } from "@/hooks/use-media-library"
import { toast } from "@/components/ui/use-toast"

export function AddMediaDialog({
  onAdd,
}: {
  onAdd: (
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
    logo?: string,
  ) => Promise<void>
}) {
  const { media } = useMediaLibrary()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<TMDBSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<TMDBSearchResult | null>(null)
  const [rating, setRating] = useState([5])
  const [note, setNote] = useState("")
  const [duration, setDuration] = useState<number | null>(null)
  const [isCustomDuration, setIsCustomDuration] = useState(false)
  const [seasons, setSeasons] = useState<number | null>(null)
  const [episodesPerSeason, setEpisodesPerSeason] = useState<number | null>(null)
  const [episodeDuration, setEpisodeDuration] = useState<number | null>(null)
  const [completedSeasons, setCompletedSeasons] = useState<number>(0)
  const [isCustomTVDetails, setIsCustomTVDetails] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [category, setCategory] = useState<"Watched" | "Wishlist" | "Streaming">("Watched")
  const [searchQuery, setSearchQuery] = useState("")
  const [logo, setLogo] = useState<string | undefined>(undefined)
  const debouncedQuery = useDebounce(searchQuery, 300)

  // Search for media when query changes
  useEffect(() => {
    async function performSearch() {
      if (!debouncedQuery) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const results = await searchTMDB(debouncedQuery)
        setResults(results.filter((r) => r.media_type === "movie" || r.media_type === "tv"))
      } catch (error) {
        console.error("Error searching for media:", error)
        toast({
          title: "Search Error",
          description: "Failed to search for media. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery])

  // Fetch details when media is selected
  useEffect(() => {
    async function fetchDetails() {
      if (!selected) return
      try {
        const details = await getTMDBDetails(selected.id, selected.media_type)

        // Set movie or TV show details
        if (selected.media_type === "movie") {
          setDuration(details.runtime || 0)
        } else {
          setSeasons(details.number_of_seasons || 0)
          setEpisodesPerSeason(
            details.number_of_episodes ? Math.ceil(details.number_of_episodes / (details.number_of_seasons || 1)) : 0,
          )
          setEpisodeDuration(details.episode_run_time?.[0] || 0)
        }

        // Find and set logo
        const englishLogo = details.images?.logos.find((logo) => logo.iso_639_1 === "en")
        if (englishLogo) {
          setLogo(`https://image.tmdb.org/t/p/w500${englishLogo.file_path}`)
        }
      } catch (error) {
        console.error("Error fetching details:", error)
        toast({
          title: "Error",
          description: "Failed to fetch media details. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchDetails()
  }, [selected])

  async function handleAdd() {
    if (!selected) return

    try {
      // Check if media already exists
      const exists = media.some((item) => item.tmdbId === selected.id && item.type === selected.media_type)

      if (exists) {
        toast({
          title: "Already in Library",
          description: "This title is already in your library.",
          variant: "destructive",
        })
        return
      }

      // Calculate duration for TV shows
      let finalDuration = duration
      if (selected.media_type === "tv" && seasons && episodesPerSeason && episodeDuration) {
        finalDuration = seasons * episodesPerSeason * episodeDuration
      }

      await onAdd(
        selected.id,
        selected.media_type,
        rating[0],
        category,
        note,
        finalDuration || undefined,
        seasons || undefined,
        episodesPerSeason || undefined,
        episodeDuration || undefined,
        category === "Streaming" ? completedSeasons : undefined,
        logo,
      )

      resetForm()
      setOpen(false)

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

  function resetForm() {
    setSelected(null)
    setNote("")
    setDuration(null)
    setIsCustomDuration(false)
    setSeasons(null)
    setEpisodesPerSeason(null)
    setEpisodeDuration(null)
    setCompletedSeasons(0)
    setIsCustomTVDetails(false)
    setQuery("")
    setResults([])
    setOpen(false)
    setSearchQuery("")
    setLogo(undefined)
    setRating([5])
    setCategory("Watched")
  }

  const dialogContent = (
    <div className="grid gap-4 py-4 max-h-[600px]">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for a movie or TV show..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        {!selected ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
            <AnimatePresence>
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-95 hover:shadow-xl h-full"
                    onClick={() => setSelected(result)}
                  >
                    <div className="aspect-[2/3] relative">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                        alt={result.title || result.name}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 right-2 z-20">
                        <Badge className="bg-black/20 hover:bg-black/30 backdrop-blur-lg text-white flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span>{result.vote_average.toFixed(1)}</span>
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-2 z-20">
                        <Badge variant="secondary" className="capitalize">
                          {result.media_type}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2">
                            {result.title || result.name}
                          </h3>
                          <p className="text-xs text-white/80 line-clamp-3">{result.overview}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex gap-4">
              <img
                src={`https://image.tmdb.org/t/p/w500${selected.poster_path}`}
                alt={selected.title || selected.name}
                className="w-32 rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-lg">{selected.title || selected.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{selected.media_type}</p>
                <p className="text-sm mt-2">{selected.overview}</p>
              </div>
            </div>
            {logo && (
              <img
                src={logo || "/placeholder.svg"}
                alt={`${selected.title || selected.name} logo`}
                className="w-32 rounded-lg mt-4"
              />
            )}
            <div className="space-y-2">
              <Label>Your Rating</Label>
              <div className="text-center mb-2">Rating: {rating[0].toFixed(1)}/10</div>
              <Slider max={10} step={0.1} value={rating} onValueChange={setRating} />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(value: "Watched" | "Wishlist" | "Streaming") => setCategory(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Watched">Watched</SelectItem>
                  <SelectItem value="Wishlist">Wishlist</SelectItem>
                  <SelectItem value="Streaming">Streaming</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selected.media_type === "movie" ? (
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <div className="flex items-center">
                  <Input
                    type="number"
                    value={duration || ""}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    disabled={!isCustomDuration}
                    className="mr-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setIsCustomDuration(!isCustomDuration)}
                  >
                    {isCustomDuration ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>TV Show Details</Label>
                    <Button variant="outline" size="sm" onClick={() => setIsCustomTVDetails(!isCustomTVDetails)}>
                      {isCustomTVDetails ? <Unlock className="h-4 w-4 mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                      {isCustomTVDetails ? "Unlock" : "Edit"}
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Seasons</Label>
                      <Input
                        type="number"
                        value={seasons || ""}
                        onChange={(e) => setSeasons(Number(e.target.value))}
                        disabled={!isCustomTVDetails}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Episodes/Season</Label>
                      <Input
                        type="number"
                        value={episodesPerSeason || ""}
                        onChange={(e) => setEpisodesPerSeason(Number(e.target.value))}
                        disabled={!isCustomTVDetails}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Episode Duration</Label>
                      <Input
                        type="number"
                        value={episodeDuration || ""}
                        onChange={(e) => setEpisodeDuration(Number(e.target.value))}
                        disabled={!isCustomTVDetails}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
                {category === "Streaming" && (
                  <div className="space-y-2">
                    <Label>Completed Seasons</Label>
                    <Input
                      type="number"
                      value={completedSeasons}
                      onChange={(e) => setCompletedSeasons(Number(e.target.value))}
                      max={seasons || undefined}
                    />
                  </div>
                )}
              </>
            )}

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add your thoughts..." />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="w-full">
                Add to Library
              </Button>
              <Button
                variant="outline"
                className="w-full hover:bg-red-500/20 transition-colors"
                onClick={() => setSelected(null)}
              >
                Discard
              </Button>
            </div>
          </motion.div>
        )}
      </ScrollArea>
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Media
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Add to Your Library</DialogTitle>
          </DialogHeader>
          {dialogContent}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Media
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>Add to Your Library</DrawerTitle>
        </DrawerHeader>
        {dialogContent}
      </DrawerContent>
    </Drawer>
  )
}

