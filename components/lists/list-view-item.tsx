"use client"

import { Star, Calendar, Clock, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import type { Media } from "@/types"

interface ListViewItemProps {
  item: Media
  libraryItem?: Media | null
  onRemove: (id: string) => void
}

export function ListViewItem({ item, libraryItem, onRemove }: ListViewItemProps) {
  const isInLibrary = !!libraryItem
  const displayItem = isInLibrary ? libraryItem : item

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Image section with improved responsiveness */}
          <div className="w-full md:w-48 shrink-0">
            <img
              src={`https://image.tmdb.org/t/p/w500${displayItem.posterPath}`}
              alt={displayItem.title}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          
          {/* Content section with refined mobile layout */}
          <div className="p-4 flex-1 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start space-y-3 sm:space-y-0">
              <div className="w-full">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{displayItem.title}</h3>
                
                {/* Badges and metadata with better mobile wrapping */}
                <div className="flex flex-wrap gap-2 mb-3 items-center">
                  <Badge variant="outline" className="capitalize">
                    {displayItem.type}
                  </Badge>
                  {isInLibrary && displayItem.category && (
                    <Badge
                      variant="secondary"
                      className={`
                        ${displayItem.category === "Watched" ? "border-gray-400/50 bg-gray-500/50 hover:bg-gray-500/60 dark:bg-gray-500/30 dark:hover:bg-gray-500/40" : ""}
                        ${displayItem.category === "Streaming" ? "border-purple-400/50 bg-purple-500/50 hover:bg-purple-500/60 dark:bg-purple-500/30 dark:hover:bg-purple-500/40" : ""}
                        ${displayItem.category === "Wishlist" ? "border-blue-400/50 bg-blue-500/50 hover:bg-blue-500/60 dark:bg-blue-500/30 dark:hover:bg-blue-500/40" : ""}
                        text-white dark:text-white
                      `}
                    >
                      {displayItem.category}
                    </Badge>
                  )}
                  
                  {/* Metadata with more compact mobile display */}
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    {displayItem.release_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(displayItem.release_date).getFullYear()}</span>
                      </div>
                    )}
                    {displayItem.first_air_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(displayItem.first_air_date).getFullYear()}</span>
                      </div>
                    )}
                    {displayItem.type === "movie" && displayItem.runtime > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{displayItem.runtime} min</span>
                      </div>
                    )}
                    {displayItem.type === "tv" && displayItem.seasons && (
                      <div className="flex items-center gap-1">
                        <span>
                          {displayItem.seasons} season{displayItem.seasons !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Ratings section with vertical layout on small screens */}
              <div className="flex flex-wrap justify-start sm:justify-end items-center gap-2">
                {isInLibrary && displayItem.rating > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-yellow-400/20 hover:bg-yellow-400/30 border-yellow-400">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span>{displayItem.rating.toFixed(1)}</span>
                  </Badge>
                )}
                {displayItem.tmdbRating > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-blue-400/20 hover:bg-blue-400/30 border-blue-400">
                    <Star className="w-3 h-3 text-blue-400 fill-current" />
                    <span>{displayItem.tmdbRating.toFixed(1)}</span>
                  </Badge>
                )}
              </div>
            </div>

            {/* Overview with improved scroll area and mobile layout */}
            {displayItem.overview && (
              <ScrollArea className="h-24 md:h-auto md:max-h-32 mt-3">
                <p className="text-sm text-muted-foreground">{displayItem.overview}</p>
              </ScrollArea>
            )}

            {/* Remove button with responsive positioning */}
            <div className="flex justify-start sm:justify-end mt-4 sm:mt-0 sm:absolute sm:bottom-4 sm:right-4">
              <Button
                variant="outline"
                size="icon"
                className="bg-destructive/40 hover:bg-destructive/60"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(item.id)
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
