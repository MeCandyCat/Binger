"use client"

import { Button } from "@/components/ui/button"
import { Play, Plus, Check, Copy } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ActionButtonsProps {
  trailerUrl: string | null
  existingMedia: any
  mediaId: number
  mediaType: string
  onAddClick: () => void
}

export function ActionButtons({ trailerUrl, existingMedia, mediaId, mediaType, onAddClick }: ActionButtonsProps) {
  const copyLinkToClipboard = () => {
    const url = `${window.location.origin}/discover/${mediaType}/${mediaId}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Link copied",
      description: "Media link copied to clipboard",
    })
  }

  return (
    <div className="flex flex-wrap gap-3">
      {trailerUrl && (
        <Button variant="destructive" onClick={() => window.open(trailerUrl, "_blank")}>
          <Play className="w-4 h-4 mr-2" />
          Watch Trailer
        </Button>
      )}

      {existingMedia ? (
        <Button variant="outline" disabled>
          <Check className="w-4 h-4 mr-2" />
          In Library
        </Button>
      ) : (
        <Button onClick={onAddClick}>
          <Plus className="w-4 h-4 mr-2" />
          Add to Library
        </Button>
      )}

      <Button variant="outline" onClick={copyLinkToClipboard}>
        <Copy className="w-4 h-4 mr-2" />
        Copy Link
      </Button>
    </div>
  )
}
