export type Media = {
  id: string
  tmdbId: number
  title: string
  type: "movie" | "tv"
  posterPath: string
  backdropPath?: string
  rating: number
  tmdbRating: number
  watchedAt: Date
  runtime: number
  note?: string
  category: "Watched" | "Wishlist" | "Streaming"
  customDuration?: number
  seasons?: number
  episodesPerSeason?: number
  episodeDuration?: number
  watchedSeasons?: number
  release_date?: string
  first_air_date?: string
  trailerKey?: string | null
  logo?: string
}

export type TMDBSearchResult = {
  id: number
  title?: string
  name?: string
  poster_path: string
  backdrop_path?: string
  media_type: string
  vote_average: number
  overview: string
}

export type TMDBLogo = {
  file_path: string
  iso_639_1: string
}

export type TMDBVideo = {
  id: string
  key: string
  name: string
  site: string
  size: number
  type: string
}

export type TMDBDetails = {
  id: number
  title?: string
  name?: string
  poster_path: string
  backdrop_path?: string
  runtime?: number
  episode_run_time?: number[]
  number_of_seasons?: number
  vote_average: number
  overview: string
  videos?: {
    results: TMDBVideo[]
  }
  images?: {
    logos: TMDBLogo[]
  }
  release_date?: string
  first_air_date?: string
}

export type Settings = {
  showMovieLogos: boolean
  animateCards: boolean
  autoplayTrailers: boolean
  showListsInCollection?: boolean
}

