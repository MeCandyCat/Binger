"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface ReviewCardProps {
  review: any
}

export function ReviewCard({ review }: ReviewCardProps) {
  const date = new Date(review.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Truncate long reviews
  const MAX_LENGTH = 500
  const [expanded, setExpanded] = useState(false)
  const isLong = review.content.length > MAX_LENGTH
  const displayContent = expanded || !isLong ? review.content : `${review.content.slice(0, MAX_LENGTH)}...`

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage
            src={
              review.author_details.avatar_path
                ? review.author_details.avatar_path.startsWith("/")
                  ? `https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`
                  : review.author_details.avatar_path
                : null
            }
          />
          <AvatarFallback>{review.author.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{review.author}</div>
          <div className="text-sm text-muted-foreground">{date}</div>
        </div>
        {review.author_details.rating && (
          <div className="ml-auto flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span>{review.author_details.rating}/10</span>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{displayContent}</p>
      {isLong && (
        <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show Less" : "Read More"}
        </Button>
      )}
    </div>
  )
}
