"use client"

import { ReviewCard } from "./review-card"

interface ReviewsTabProps {
  reviews: any[]
}

export function ReviewsTab({ reviews }: ReviewsTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-muted/30 rounded-lg">
          <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
          <p className="text-muted-foreground">Be the first to review this title!</p>
        </div>
      )}
    </div>
  )
}
