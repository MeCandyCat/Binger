"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Star } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { searchTMDB, getTMDBDetails } from "@/lib/tmdb"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import type { Media, TMDBSearchResult } from "@/types"
import { toast } from "@/components/ui/use-toast"

interface ListAddMediaDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddToList: (media: Media) => void
  libraryMedia: Media[]
}

export function ListAddMediaDialog({ isOpen, onClose, onAddToList, libraryMedia }: ListAddMediaDialogProps) {
  const [activeTab, setActiveTab] = useState("library")
  const [searchQuery, setSearchQuery] = useState("")
  const [librarySearchQuery, setLibrarySearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<TMDBSearchResult[]>([])
  const [filteredLibraryMedia, setFilteredLibraryMedia] = useState<Media[]>(libraryMedia)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddingFromSearch, setIsAddingFromSearch] = useState(false)
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab("library")
      setSearchQuery("")
      setLibrarySearchQuery("")
      setSearchResults([])
      setFilteredLibraryMedia(libraryMedia)
    }
  }, [isOpen, libraryMedia])

  // Filter library media when search query changes
  useEffect(() => {
    if (!librarySearchQuery) {
      setFilteredLibraryMedia(libraryMedia)
      return
    }

    const filtered = libraryMedia.filter((item) => item.title.toLowerCase().includes(librarySearchQuery.toLowerCase()))
    setFilteredLibraryMedia(filtered)
  }, [librarySearchQuery, libraryMedia])

  // Search TMDB when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchQuery.trim()) {
        setSearchResults([])
        return
      }

      setIsLoading(true)
      try {
        const results = await searchTMDB(debouncedSearchQuery)
        setSearchResults(results.filter((r) => r.media_type === "movie" || r.media_type === "tv"))
      } catch (error) {
        console.error("Error searching TMDB:", error)
        toast({
          title: "Search Error",
          description: "Failed to search for media",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [debouncedSearchQuery])

  const handleAddFromLibrary = (media: Media) => {
    onAddToList(media)
    toast({
      title: "Success",
      description: "Added to list successfully",
    })
    onClose()
  }

  const handleAddFromSearch = async (result: TMDBSearchResult) => {
    try {
      // Find if this media already exists in the library
      const existingMedia = libraryMedia.find((item) => item.tmdbId === result.id && item.type === result.media_type)

      if (existingMedia) {
        onAddToList(existingMedia)
        toast({
          title: "Success",
          description: "Added to list successfully",
        })
        onClose()
      } else {
        // Convert TMDB result to Media object
        setIsAddingFromSearch(true)
        const details = await getTMDBDetails(result.id, result.media_type)

        // Create a temporary Media object
        const tempMedia: Media = {
          id: Math.random().toString(36).substring(7),
          tmdbId: result.id,
          title: result.title || result.name || "",
          type: result.media_type as "movie" | "tv",
          posterPath: result.poster_path,
          backdropPath: result.backdrop_path,
          rating: 0,
          tmdbRating: result.vote_average,
          watchedAt: new Date(),
          runtime: details.runtime || 0,
          category: "Wishlist",
          overview: result.overview,
          release_date: details.release_date,
          first_air_date: details.first_air_date,
        }

        onAddToList(tempMedia)
        toast({
          title: "Success",
          description: "Added to list successfully",
        })
        onClose()
      }
    } catch (error) {
      console.error("Error adding from search:", error)
      toast({
        title: "Error",
        description: "Failed to add media",
        variant: "destructive",
      })
    } finally {
      setIsAddingFromSearch(false)
    }
  }

  const LibraryCard = ({ media }: { media: Media }) => (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => handleAddFromLibrary(media)}
    >
      <div className="aspect-[2/3] relative">
        {media.posterPath ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${media.posterPath}`}
            alt={media.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button size="sm" variant="secondary">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm line-clamp-1">{media.title}</h3>
        <p className="text-xs text-muted-foreground capitalize">{media.type}</p>
      </CardContent>
    </Card>
  )

  const SearchCard = ({ result }: { result: TMDBSearchResult }) => {
    const isInLibrary = libraryMedia.some((item) => item.tmdbId === result.id && item.type === result.media_type)

    return (
      <Card
        className={`overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${
          isInLibrary ? "border-primary" : ""
        }`}
        onClick={() => handleAddFromSearch(result)}
      >
        <div className="aspect-[2/3] relative">
          {result.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
              alt={result.title || result.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge className="bg-black/20 backdrop-blur-lg text-white flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span>{result.vote_average.toFixed(1)}</span>
            </Badge>
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button size="sm" variant="secondary" disabled={isAddingFromSearch}>
              <Plus className="w-4 h-4 mr-2" />
              Add to List
            </Button>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-sm line-clamp-1">{result.title || result.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs capitalize">
              {result.media_type}
            </Badge>
            {isInLibrary && (
              <Badge variant="secondary" className="text-xs">
                In Library
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Media to List</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="library" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <TabsList className="p-0 h-auto bg-background gap-1 w-full sm:w-auto">
              <TabsTrigger
                value="library"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-initial"
              >
                My Library
              </TabsTrigger>
              <TabsTrigger
                value="search"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-initial"
              >
                Search
              </TabsTrigger>
            </TabsList>

            {activeTab === "library" ? (
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your library..."
                  className="pl-8 w-full"
                  value={librarySearchQuery}
                  onChange={(e) => setLibrarySearchQuery(e.target.value)}
                />
              </div>
            ) : (
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for movies and TV shows..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
          </div>

          <TabsContent value="library" className="flex-1 m-0">
            <ScrollArea className="h-[500px] pr-4">
              {filteredLibraryMedia.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredLibraryMedia.map((media) => (
                    <LibraryCard key={media.id} media={media} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {librarySearchQuery
                      ? `No results found for "${librarySearchQuery}"`
                      : "Your library is empty. Add some media first."}
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="search" className="flex-1 m-0">
            <ScrollArea className="h-[500px] pr-4">
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="aspect-[2/3] w-full" />
                      <CardContent className="p-3">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {searchResults.map((result) => (
                    <SearchCard key={`${result.id}-${result.media_type}`} result={result} />
                  ))}
                </div>
              ) : debouncedSearchQuery ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No results found for "{debouncedSearchQuery}"</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Search for movies and TV shows to add to your list</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

