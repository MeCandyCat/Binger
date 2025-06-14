"use client"

import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Star } from "lucide-react"
import { useSettings } from "@/hooks/use-settings"

interface HeroSectionProps {
  details: any
  mediaType: "movie" | "tv"
  logo: string | null
}

export function HeroSection({ details, mediaType, logo }: HeroSectionProps) {
  const { settings } = useSettings()

  const releaseYear = details.release_date
    ? new Date(details.release_date).getFullYear()
    : details.first_air_date
      ? new Date(details.first_air_date).getFullYear()
      : null

  const runtime =
    mediaType === "movie"
      ? `${details.runtime} min`
      : details.number_of_seasons
        ? `${details.number_of_seasons} Season${details.number_of_seasons !== 1 ? "s" : ""}`
        : null

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="aspect-[21/9] w-full relative">
        <img
          src={`https://image.tmdb.org/t/p/original${details.backdrop_path || details.poster_path}`}
          alt={details.title || details.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-10">
        <div className="flex flex-row items-end gap-4">
          {/* Poster - now visible on all screen sizes but smaller on mobile */}
          <div className="relative w-24 sm:w-28 md:w-32 lg:w-48 rounded-lg shadow-lg flex-shrink-0">
            <img
              src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
              alt={details.title || details.name}
              className="w-full rounded-lg"
            />
          </div>
          <div className="flex-1">
            {settings.showMovieLogos && logo ? (
              <img
                src={logo || "/placeholder.svg"}
                alt={details.title || details.name}
                className="h-12 sm:h-16 md:h-20 lg:h-24 object-contain mb-2 md:mb-4"
              />
            ) : (
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2">
                {details.title || details.name}
              </h1>
            )}
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white/80 mb-2 md:mb-4">
              <Badge variant="secondary" className="capitalize text-xs">
                {mediaType}
              </Badge>
              {releaseYear && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{releaseYear}</span>
                </div>
              )}
              {runtime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{runtime}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                <span>{details.vote_average.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {details.genres?.slice(0, 3).map((genre) => (
                <Badge key={genre.id} variant="outline" className="bg-black/20 text-white border-white/20 text-xs">
                  {genre.name}
                </Badge>
              ))}
              {details.genres && details.genres.length > 3 && (
                <>
                  {details.genres.length === 4 ? (
                    <Badge
                      key={details.genres[3].id}
                      variant="outline"
                      className="bg-black/20 text-white border-white/20 text-xs"
                    >
                      {details.genres[3].name}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-black/20 text-white border-white/20 text-xs">
                      +{details.genres.length - 3} more
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
