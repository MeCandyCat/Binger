"use client"

import { useState } from "react"
import { Grid, ListIcon, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MediaGrid } from "@/components/media-grid"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListViewItem } from "./list-view-item"
import { MediaSheet } from "@/components/media-sheet"
import type { List } from "@/types/list"
import type { Media } from "@/types"

interface ListContentProps {
  list: List
  libraryMedia: Media[]
  onUpdateItem: (id: string, updates: Partial<Media>) => void
  onRemoveItem: (id: string) => void
  onAddMedia: () => void
}

function EmptyState({ onAddMedia }: { onAddMedia: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12 border-2 border-dashed rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-2">No Items Yet</h2>
      <p className="text-muted-foreground mb-4">Start adding media to your list</p>
      <Button onClick={onAddMedia}>
        <Plus className="w-4 h-4 mr-2" />
        Add Your First Item
      </Button>
    </motion.div>
  )
}

export function ListContent({ list, libraryMedia, onUpdateItem, onRemoveItem, onAddMedia }: ListContentProps) {
  const [viewMode, setViewMode] = useState<"gallery" | "list">("gallery")
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)

  const handleSelectMedia = (media: Media) => {
    setSelectedMedia(media)
  }

  const handleCloseMediaSheet = () => {
    setSelectedMedia(null)
  }

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-xl font-semibold">List Items</h2>
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "gallery" | "list")}>
          <TabsList className="p-0 h-auto bg-background gap-1">
            <TabsTrigger
              value="gallery"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-1"
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Gallery</span>
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-1"
            >
              <ListIcon className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {list.items.length > 0 ? (
        viewMode === "gallery" ? (
          <MediaGrid media={list.items} onUpdate={onUpdateItem} onDelete={onRemoveItem} />
        ) : (
          <div className="space-y-1 rounded-lg border overflow-hidden">
            {list.items.map((item, index) => (
              <ListViewItem
                key={item.id}
                item={item}
                index={index}
                libraryItem={libraryMedia.find((m) => m.tmdbId === item.tmdbId && m.type === item.type)}
                onRemove={() => onRemoveItem(item.id)}
                onUpdate={(updates) => onUpdateItem(item.id, updates)}
                onSelect={handleSelectMedia}
              />
            ))}
          </div>
        )
      ) : (
        <EmptyState onAddMedia={onAddMedia} />
      )}

      {selectedMedia && (
        <MediaSheet
          media={selectedMedia}
          isOpen={!!selectedMedia}
          onClose={handleCloseMediaSheet}
          onUpdate={(updates) => {
            const item = list.items.find((i) => i.id === selectedMedia.id)
            if (item) {
              onUpdateItem(item.id, updates)
            }
          }}
        />
      )}
    </div>
  )
}

