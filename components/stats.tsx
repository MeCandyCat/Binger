"use client"

import { useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Film, Tv, Star, Heart, Bookmark, TrendingUp, Tag, Activity } from "lucide-react"
import { useSettings } from "@/hooks/use-settings"
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
  const { settings } = useSettings()
  const { statsPreferences } = settings
  const [totalWatchTime, setTotalWatchTime] = useState(0)
  const controls = useAnimation()

  useEffect(() => {
    const calculateTotalMinutes = (mediaList: Media[]) => {
      return mediaList.reduce((acc, item) => {
        if (item.customDuration) {
          return acc + item.customDuration
        }

        if (item.type === "movie") {
          return acc + (item.runtime || 0)
        } else if (item.type === "tv") {
          if (item.episodesPerSeason && item.episodeDuration) {
            if (item.category === "Streaming") {
              const watchedSeasons = item.watchedSeasons || 0
              return acc + watchedSeasons * item.episodesPerSeason * item.episodeDuration
            } else if (item.category === "Watched") {
              const totalSeasons = item.seasons || 0
              return acc + totalSeasons * item.episodesPerSeason * item.episodeDuration
            }
          }
        }
        return acc
      }, 0)
    }

    const watchedMedia = media.filter((item) => item.category === "Watched")
    const streamingMedia = media.filter((item) => item.category === "Streaming")
    const watchedTime = calculateTotalMinutes(watchedMedia)
    const streamingTime = calculateTotalMinutes(streamingMedia)
    setTotalWatchTime(watchedTime + streamingTime)
  }, [media])

  useEffect(() => {
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }))
  }, [controls])

  // Calculate all possible stats
  const totalShows = media.filter((item) => item.type === "tv" && item.category !== "Wishlist").length
  const totalMovies = media.filter((item) => item.type === "movie" && item.category !== "Wishlist").length
  const totalMedia = totalShows + totalMovies
  const favorites = media.filter((item) => item.favorite).length
  const wishlist = media.filter((item) => item.category === "Wishlist").length

  // Calculate average rating
  const ratedMedia = media.filter((item) => item.userRating || item.rating)
  const averageRating =
    ratedMedia.length > 0
      ? ratedMedia.reduce((acc, item) => acc + (item.userRating || item.rating || 0), 0) / ratedMedia.length
      : 0

  // Calculate completion rate for streaming shows
  const streamingShows = media.filter((item) => item.type === "tv" && item.category === "Streaming")
  const completedShows = streamingShows.filter(
    (item) => item.watchedSeasons && item.seasons && item.watchedSeasons >= item.seasons,
  ).length
  const completionRate = streamingShows.length > 0 ? (completedShows / streamingShows.length) * 100 : 0

  // Find top genre
  const genreCounts = {}
  media.forEach((item) => {
    item.genres?.forEach((genre) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1
    })
  })
  const topGenre = Object.entries(genreCounts).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || "None"

  // Recent activity (items added in last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentActivity = media.filter((item) => new Date(item.dateAdded) > thirtyDaysAgo).length

  // Format time based on user preference
  const formatTime = (minutes: number) => {
    switch (statsPreferences.timeFormat) {
      case "minutes":
        return { value: minutes, unit: "minutes", subtext: `${Math.floor(minutes / 60)} hours` }
      case "hours":
        const hours = Math.floor(minutes / 60)
        return { value: hours, unit: "hours", subtext: `${Math.floor(hours / 24)} days` }
      case "days":
      default:
        const days = Math.floor(minutes / 60 / 24)
        const remainingHours = Math.floor((minutes / 60) % 24)
        return { value: days, unit: "days", subtext: `${Math.floor(minutes / 60)} hours total` }
    }
  }

  const timeDisplay = formatTime(totalWatchTime)

  // Define all possible stat cards
  const allStats = {
    totalWatchTime: {
      title: "Total Watch Time",
      icon: Clock,
      value: <CountUp end={timeDisplay.value} />,
      unit: timeDisplay.unit,
      subtext: timeDisplay.subtext,
      color: "text-blue-600 dark:text-blue-400",
    },
    tvShows: {
      title: "TV Shows",
      icon: Tv,
      value: <CountUp end={totalShows} />,
      unit: "",
      subtext: "Watched/Streaming shows",
      color: "text-green-600 dark:text-green-400",
    },
    movies: {
      title: "Movies",
      icon: Film,
      value: <CountUp end={totalMovies} />,
      unit: "",
      subtext: "Watched/Streaming movies",
      color: "text-purple-600 dark:text-purple-400",
    },
    totalMedia: {
      title: "Total Media",
      icon: Film,
      value: <CountUp end={totalMedia} />,
      unit: "",
      subtext: "All movies & shows",
      color: "text-orange-600 dark:text-orange-400",
    },
    averageRating: {
      title: "Average Rating",
      icon: Star,
      value: averageRating.toFixed(1),
      unit: "/10",
      subtext: `Based on ${ratedMedia.length} ratings`,
      color: "text-yellow-600 dark:text-yellow-400",
    },
    favorites: {
      title: "Favorites",
      icon: Heart,
      value: <CountUp end={favorites} />,
      unit: "",
      subtext: "Favorited items",
      color: "text-red-600 dark:text-red-400",
    },
    wishlist: {
      title: "Wishlist",
      icon: Bookmark,
      value: <CountUp end={wishlist} />,
      unit: "",
      subtext: "Items to watch",
      color: "text-indigo-600 dark:text-indigo-400",
    },
    completionRate: {
      title: "Completion Rate",
      icon: TrendingUp,
      value: completionRate.toFixed(0),
      unit: "%",
      subtext: `${completedShows}/${streamingShows.length} shows completed`,
      color: "text-teal-600 dark:text-teal-400",
    },
    topGenre: {
      title: "Top Genre",
      icon: Tag,
      value: topGenre,
      unit: "",
      subtext: `${genreCounts[topGenre] || 0} items`,
      color: "text-pink-600 dark:text-pink-400",
    },
    recentActivity: {
      title: "Recent Activity",
      icon: Activity,
      value: <CountUp end={recentActivity} />,
      unit: "",
      subtext: "Added this month",
      color: "text-cyan-600 dark:text-cyan-400",
    },
  }

  // Get enabled stats in order
  const enabledStats = Object.entries(statsPreferences.stats)
    .filter(([, config]) => config.enabled)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([key]) => ({ key, ...allStats[key] }))

  if (enabledStats.length === 0) {
    return null
  }

  // Apply theme classes
  const getThemeClasses = () => {
    switch (statsPreferences.colorTheme) {
      case "vibrant":
        return "bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20"
      case "minimal":
        return "bg-background border-border shadow-none"
      default:
        return ""
    }
  }

  const layoutClasses =
    statsPreferences.layout === "horizontal"
      ? "flex flex-wrap gap-4"
      : `grid gap-4 ${enabledStats.length === 1 ? "grid-cols-1 max-w-md mx-auto" : enabledStats.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={layoutClasses}
    >
      {enabledStats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.key}
            custom={index}
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            className={statsPreferences.layout === "horizontal" ? "flex-1 min-w-[200px]" : ""}
          >
            <Card className={`${getThemeClasses()} ${statsPreferences.compactView ? "p-3" : ""}`}>
              <CardHeader
                className={`flex flex-row items-center justify-between space-y-0 ${statsPreferences.compactView ? "pb-1" : "pb-2"}`}
              >
                <CardTitle className={`${statsPreferences.compactView ? "text-xs" : "text-sm"} font-medium`}>
                  {stat.title}
                </CardTitle>
                {statsPreferences.showIcons && (
                  <Icon
                    className={`h-4 w-4 ${statsPreferences.colorTheme === "vibrant" ? stat.color : "text-muted-foreground"}`}
                  />
                )}
              </CardHeader>
              <CardContent className={statsPreferences.compactView ? "pt-0" : ""}>
                <div
                  className={`${statsPreferences.compactView ? "text-lg" : "text-2xl"} font-bold flex items-baseline gap-1`}
                >
                  {stat.value}
                  {stat.unit && <span className="text-sm font-normal text-muted-foreground">{stat.unit}</span>}
                </div>
                <p className={`${statsPreferences.compactView ? "text-xs" : "text-xs"} text-muted-foreground mt-1`}>
                  {stat.subtext}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
