import { useState, useEffect } from "react"
import { Pencil, Star, Trash } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Media } from "@/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MediaSheetProps {
  media: Media | null
  onClose: () => void
  onDelete: (id: string) => void
  onUpdate: (id: string, note: string, duration: number, rating: number, category: "Watched" | "Wishlist" | "Streaming") => void
}

export function MediaSheet({ media, onClose, onDelete, onUpdate }: MediaSheetProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [note, setNote] = useState("")
  const [duration, setDuration] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [rating, setRating] = useState(0)
  const [category, setCategory] = useState<"Watched" | "Wishlist" | "Streaming">("Watched")


  useEffect(() => {
    if (media) {
      setNote(media.note || "")
      
      setDuration(media.customDuration ? media.customDuration.toString() : "")
      
      setRating(media.rating || media.rating === 0 ? media.rating : 0)
      
      setCategory(media.category || "Watched")
    }
  }, [media])

  if (!media) return null

  function handleUpdate() {
    onUpdate(
      media.id,
      note,
      duration ? Number(duration) : media.runtime,
      rating,
      category
    )
    setIsEditing(false)
  }

  function handleDelete() {
    onDelete(media.id)
    setShowDeleteDialog(false)
    onClose()
  }

  return (
    <Sheet open={!!media} onOpenChange={() => onClose()}>
      <SheetContent className="sm:max-w-[500px] p-0">
        <div className="relative h-full flex flex-col">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={`https://image.tmdb.org/t/p/w500${media.posterPath}`}
              alt={media.title}
              className="w-full h-full object-cover blur-3xl opacity-20 pointer-events-none"
            />
          </div>

          {/* Scrollable Content */}
          <div className="relative z-10 flex-1 overflow-y-auto">
            <SheetHeader className="p-4 pb-0">
              <SheetTitle className="flex items-center justify-between">
                <span>{media.title}</span>
              </SheetTitle>
            </SheetHeader>

            <div className="p-4 space-y-4">
              <div className="w-full aspect-video relative">
                <img
                  src={`https://image.tmdb.org/t/p/w500${media.posterPath}`}
                  alt={media.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{media.type === "movie" ? "Movie" : "TV Show"}</Badge>
                <Badge variant="secondary">
                  {new Date(media.type === "movie" ? media.release_date : media.first_air_date).getFullYear()}
                </Badge>
                <Badge variant="secondary">
                  {media.type === "movie"
                    ? `${media.runtime} min`
                    : `${media.number_of_seasons} season${media.number_of_seasons > 1 ? "s" : ""}`}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {media.rating && !isNaN(media.rating) && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                      <span className="font-semibold">{(media.rating || 0).toFixed(1)}/10</span>
                      <span className="text-sm text-muted-foreground ml-1">(Your rating)</span>
                    </div>
                  )}
                  {media.tmdbRating && !isNaN(media.tmdbRating) && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-blue-400 mr-1 fill-current" />
                      <span className="font-semibold">{(media.tmdbRating || 0).toFixed(1)}/10</span>
                      <span className="text-sm text-muted-foreground ml-1">(TMDB)</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Overview</h3>
                <p className="text-sm text-muted-foreground">{media.overview}</p>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Your Rating</label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={rating}
                      onChange={(e) => setRating(Number.parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Custom Duration (minutes)</label>
                    <Input
                      type="number"
                      value={duration || ""}
                      onChange={(e) => setDuration(e.target.value ? Number.parseInt(e.target.value) : undefined)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select value={category} onValueChange={(value: "Watched" | "Wishlist" | "Streaming") => setCategory(value)}>
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
                  <div className="flex gap-2">
                    <Button onClick={handleUpdate}>Save</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground">{media.note || "No notes added yet."}</p>
                  <h3 className="font-semibold mb-2 mt-4">Category</h3>
                  <p className="text-sm text-muted-foreground">{media.category}</p>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Bottom Actions */}
          <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 border-t z-20">
            <div className="flex gap-2">
              <Button className="flex-1" variant="outline" onClick={() => setIsEditing(!isEditing)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button className="flex-1" variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {media.title} from your library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-red-500/80 transition-colors text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  )
}
