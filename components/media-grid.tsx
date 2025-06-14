"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { MediaCard } from "@/components/media-card"
import { MediaSheet } from "@/components/media-sheet"
import type { Media } from "@/types"

interface MediaGridProps {
  media: Media[]
  onUpdate: (id: string, updates: Partial<Media>) => void
  onDelete: (id: string) => void
}

export function MediaGrid({ media, onUpdate, onDelete }: MediaGridProps) {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <AnimatePresence>
          {media.map((item, index) => (
            <MediaCard key={item.id} media={item} onClick={() => setSelectedMedia(item)} index={index} />
          ))}
        </AnimatePresence>
      </div>
      <MediaSheet
        media={selectedMedia}
        onClose={() => setSelectedMedia(null)}
        onDelete={onDelete}
        onUpdate={(id, updates) => {
          onUpdate(id, updates)
          setSelectedMedia((prev) => (prev && prev.id === id ? { ...prev, ...updates } : prev))
        }}
      />
    </>
  )
}
