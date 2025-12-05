"use client"

import type React from "react"

import { useRef } from "react"
import { motion } from "framer-motion"
import { MediaCard } from "@/components/discover/media-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { TMDBSearchResult } from "@/types"

interface HorizontalSectionProps {
  title: string
  icon?: React.ReactNode
  items: TMDBSearchResult[]
  isLoading: boolean
  onLoadMore?: () => void
  hasMore?: boolean
  isLoadingMore?: boolean
}

export function HorizontalSection({
  title,
  icon,
  items,
  isLoading,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}: HorizontalSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  const handleScroll = () => {
    if (scrollContainerRef.current && onLoadMore && hasMore && !isLoadingMore) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      const isNearEnd = scrollLeft + clientWidth >= scrollWidth - 200

      if (isNearEnd) {
        onLoadMore()
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {icon}
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48 space-y-3">
              <Skeleton className="aspect-[2/3] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-2xl font-semibold">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => scroll("left")} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll("right")} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          onScroll={handleScroll}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className="flex-shrink-0 w-48"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <MediaCard item={item} />
            </motion.div>
          ))}
          {isLoadingMore && (
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`loading-${i}`} className="flex-shrink-0 w-48 space-y-3">
                  <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
