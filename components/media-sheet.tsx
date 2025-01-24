"use client"

import { useState } from "react"
import { Pencil, Star, Trash } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
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

interface MediaSheetProps {
  media: Media | null
  onClose: () => void
  onDelete: (id: string) => void
  onUpdate: (id: string, note: string, duration: number) => void
}

export function MediaSheet({ media, onClose, onDelete, onUpdate }: MediaSheetProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [note, setNote] = useState(media?.note || "")
  const [duration, setDuration] = useState(media?.customDuration?.toString() || "")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  if (!media) return null

  function handleUpdate() {
    onUpdate(media.id, note, duration ? Number.parseInt(duration) : 0)
    setIsEditing(false)
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
              <div className="aspect-video relative">
                <img
                  src={`https://image.tmdb.org/t/p/w500${media.posterPath}`}
                  alt={media.title}
                  className="aspect-video rounded-lg"
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                    <span className="font-semibold">{media.rating.toFixed(1)}/10</span>
                    <span className="text-sm text-muted-foreground ml-1">(Your rating)</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-blue-400 mr-1 fill-current" />
                    <span className="font-semibold">{media.tmdbRating.toFixed(1)}/10</span>
                    <span className="text-sm text-muted-foreground ml-1">(TMDB)</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Overview</h3>
                <p className="text-sm text-muted-foreground">{media.overview}</p>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Custom Duration (minutes)</label>
                    <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} />
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
                  <h3 className="font-semibold mb-2">Your Notes</h3>
                  <p className="text-sm text-muted-foreground">{media.note || "No notes added yet."}</p>
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
              onClick={() => {
                onDelete(media.id)
                setShowDeleteDialog(false)
              }}
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

