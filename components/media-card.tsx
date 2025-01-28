import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Media } from "@/types"
import { Star } from "lucide-react"

interface MediaCardProps {
  media: Media
  onClick: () => void
  index: number
}

export function MediaCard({ media, onClick, index }: MediaCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Card
        className={`overflow-hidden cursor-pointer transition-transform hover:scale-95 ${
          media.category === "Wishlist" ? "border-white" : media.category === "Streaming" ? "border-purple-500" : ""
        } h-full`}
        onClick={onClick}
      >
        <div className="aspect-[2/3] relative">
          <img
            src={`https://image.tmdb.org/t/p/w500${media.posterPath}`}
            alt={media.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {media.category === "Streaming" || media.category === "Wishlist" ? (
              <Badge className="bg-black/20 hover:bg-black/30 backdrop-blur-lg text-white flex items-center gap-1">
                <Star className="w-3 h-3 text-blue-400 fill-current" />
                <span>{media.tmdbRating.toFixed(1)}</span>
              </Badge>
            ) : (
              <Badge className="bg-black/20 hover:bg-black/30 backdrop-blur-lg text-white flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span>{media.rating.toFixed(1)}</span>
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="p-2 sm:p-4">
          <h3 className="font-semibold truncate text-sm sm:text-base">{media.title}</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            <Badge variant="outline" className="text-xs">
              {media.type === "tv" ? `TV` : `Movie`}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {media.type === "tv"
                ? `${media.seasons || 0} Season${media.seasons !== 1 ? "s" : ""}`
                : `${media.customDuration || media.runtime} mins`}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
