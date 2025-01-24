import { Card, CardContent } from "@/components/ui/card"
import type { Media } from "@/types"
import { Star } from "lucide-react"

interface MediaCardProps {
  media: Media
  onClick: () => void
}

export function MediaCard({ media, onClick }: MediaCardProps) {
  return (
    <Card className="overflow-hidden cursor-pointer transition-transform hover:scale-95" onClick={onClick}>
      <div className="aspect-[2/3] relative">
        <img
          src={`https://image.tmdb.org/t/p/w500${media.posterPath}`}
          alt={media.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-xl text-white px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span>{media.rating.toFixed(1)}</span>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{media.title}</h3>
        <p className="text-sm text-muted-foreground">
          {media.type === "tv" ? `${media.seasons} Seasons` : `${media.customDuration || media.runtime} mins`}
        </p>
      </CardContent>
    </Card>
  )
}

