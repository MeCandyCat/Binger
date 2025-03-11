"use client"

import { useState } from "react"
import { Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Media } from "@/types"
import { motion } from "framer-motion"

interface ListViewItemProps {
  item: Media
  index: number
  libraryItem?: Media
  onRemove: () => void
  onUpdate?: (updates: Partial<Media>) => void
  onSelect: (item: Media) => void
}

export function ListViewItem({ item, index, libraryItem, onRemove, onUpdate, onSelect }: ListViewItemProps) {
  const [isHovering, setIsHovering] = useState(false)

  const displayItem = libraryItem || item
  const releaseYear = displayItem.releaseDate
    ? new Date(displayItem.releaseDate).getFullYear()
    : displayItem.first_air_date
      ? new Date(displayItem.first_air_date).getFullYear()
      : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => onSelect(displayItem)}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center font-medium">
        {index + 1}
      </div>

      <div className="flex-shrink-0 w-14 h-20 rounded overflow-hidden">
        <img
          src={
            displayItem.posterPath
              ? `https://image.tmdb.org/t/p/w92${displayItem.posterPath}`
              : "/placeholder.svg?height=180&width=120"
          }
          alt={displayItem.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium truncate">{displayItem.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="capitalize">{displayItem.type}</span>
              {releaseYear && (
                <>
                  <span>•</span>
                  <span>{releaseYear}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {displayItem.tmdbRating > 0 && (
              <Badge variant="outline" className="flex items-center gap-1 border-blue-400">
                <Star className="w-3 h-3 text-blue-400 fill-current" />
                <span>{displayItem.tmdbRating.toFixed(1)}</span>
              </Badge>
            )}
            {(libraryItem?.rating || displayItem.rating) > 0 && (
              <Badge variant="outline" className="flex items-center gap-1 border-yellow-400">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span>{(libraryItem?.rating || displayItem.rating).toFixed(1)}</span>
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className={`flex-shrink-0 transition-opacity ${isHovering ? "opacity-100" : "opacity-0"}`}>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}

