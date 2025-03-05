"use client"

import { useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Film, Tv } from "lucide-react"
import type { Media } from "@/types"

interface StatsProps {
  media: Media[]
}

const CountUp = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }, [end, duration])

  return <>{count}</>
}

export function Stats({ media }: StatsProps) {
  const [totalWatchTime, setTotalWatchTime] = useState(0)

  useEffect(() => {
    const calculateTotalMinutes = (mediaList: Media[]) => {
      return mediaList.reduce((acc, item) => {
        // If there's a custom duration, use that regardless of media type
        if (item.customDuration) {
          return acc + item.customDuration
        }

        if (item.type === "movie") {
          // For movies, use runtime
          return acc + (item.runtime || 0)
        } else if (item.type === "tv") {
          // For TV shows, ensure we have all required values
          if (item.episodesPerSeason && item.episodeDuration) {
            if (item.category === "Streaming") {
              // For streaming shows, only count watched seasons
              const watchedSeasons = item.watchedSeasons || 0
              return acc + watchedSeasons * item.episodesPerSeason * item.episodeDuration
            } else if (item.category === "Watched") {
              // For watched shows, count all seasons
              const totalSeasons = item.seasons || 0
              return acc + totalSeasons * item.episodesPerSeason * item.episodeDuration
            }
          }
        }
        return acc
      }, 0)
    }

    // Calculate total watch time for both watched and streaming media
    const watchedMedia = media.filter((item) => item.category === "Watched")
    const streamingMedia = media.filter((item) => item.category === "Streaming")

    const watchedTime = calculateTotalMinutes(watchedMedia)
    const streamingTime = calculateTotalMinutes(streamingMedia)

    const newTotalWatchTime = watchedTime + streamingTime
    setTotalWatchTime(newTotalWatchTime)
  }, [media]) // This will re-run whenever media array changes

  const totalShows = media.filter((item) => item.type === "tv" && item.category !== "Wishlist").length
  const totalMovies = media.filter((item) => item.type === "movie" && item.category !== "Wishlist").length

  const hours = Math.floor(totalWatchTime / 60)
  const days = Math.floor(hours / 24)

  const controls = useAnimation()

  useEffect(() => {
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 },
    }))
  }, [controls])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid gap-4 md:grid-cols-3"
    >
      <motion.div custom={0} initial={{ opacity: 0, y: 20 }} animate={controls}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Watch Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountUp end={days} /> days
            </div>
            <p className="text-xs text-muted-foreground">
              <CountUp end={hours} /> hours (<CountUp end={totalWatchTime} /> minutes)
            </p>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div custom={1} initial={{ opacity: 0, y: 20 }} animate={controls}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TV Shows</CardTitle>
            <Tv className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountUp end={totalShows} />
            </div>
            <p className="text-xs text-muted-foreground">Watched/Streaming shows</p>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div custom={2} initial={{ opacity: 0, y: 20 }} animate={controls}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Movies</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountUp end={totalMovies} />
            </div>
            <p className="text-xs text-muted-foreground">Watched/Streaming movies</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

