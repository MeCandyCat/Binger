"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { useMediaQuery } from "@/hooks/use-media-query"
import { searchTMDB } from "@/lib/tmdb"
import type { TMDBSearchResult } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddMediaDialogProps {
  onAdd: (
    tmdbId: number,
    type: "movie" | "tv",
    rating: number,
    category: "Watched" | "Wishlist" | "Streaming",
    note?: string,
    customDuration?: number,
  ) => Promise<void>
}

export function AddMediaDialog({ onAdd }: AddMediaDialogProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<TMDBSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<TMDBSearchResult | null>(null)
  const [rating, setRating] = useState([5])
  const [note, setNote] = useState("")
  const [duration, setDuration] = useState("")
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [category, setCategory] = useState<"Watched" | "Wishlist" | "Streaming">("Watched")

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query) return

    setLoading(true)
    const results = await searchTMDB(query)
    setResults(results.filter((r) => r.media_type === "movie" || r.media_type === "tv"))
    setLoading(false)
  }

  async function handleAdd() {
    if (!selected) return

    await onAdd(
      selected.id,
      selected.media_type,
      rating[0],
      category,
      note,
      duration ? Number.parseInt(duration) : undefined,
    )

    resetForm()
  }

  function resetForm() {
    setSelected(null)
    setNote("")
    setDuration("")
    setQuery("")
    setResults([])
    setOpen(false)
  }

  const dialogContent = (
    <div className="grid gap-4 py-4 max-h-[600px]">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search for a movie or TV show..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </form>

      <ScrollArea className="h-[400px] pr-4">
        {!selected ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setSelected(result)}
                  >
                    <div className="aspect-[2/3] relative">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                        alt={result.title || result.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{result.title || result.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{result.media_type}</p>
                    </CardContent>
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

            <div className="space-y-2">
              <Label>Your Rating</Label>
              <div className="text-center mb-2">Rating: {rating[0].toFixed(1)}/10</div>
              <Slider max={10} step={0.1} value={rating} onValueChange={setRating} />
            </div>

            <div className="space-y-2">
              <Label>Custom Duration (minutes)</Label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter custom duration..."
              />
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
