export interface Media {
  id: string
  tmdbId: number
  title: string
  overview: string
  posterPath: string
  backdropPath?: string
  releaseDate?: string
  runtime?: number
  status?: string
  voteAverage?: number
  type: "movie" | "tv"
  genres?: string[]
  watched: boolean
  favorite: boolean
  watchlist: boolean
  dateAdded: string
  userRating?: number
  notes?: string
  seasons?: number
  episodes?: number
}

export interface TMDBSearchResult {
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  first_air_date?: string
  vote_average: number
  media_type: "movie" | "tv"
  genre_ids: number[]
}

export interface TMDBDetails {
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  first_air_date?: string
  runtime?: number
  episode_run_time?: number[]
  status: string
  vote_average: number
  genres: { id: number; name: string }[]
  videos?: {
    results: {
      id: string
      key: string
      name: string
      site: string
      type: string
    }[]
  }
  images?: {
    backdrops: {
      file_path: string
      width: number
      height: number
    }[]
    posters: {
      file_path: string
      width: number
      height: number
    }[]
    logos: {
      file_path: string
      width: number
      height: number
      iso_639_1: string
    }[]
  }
  number_of_seasons?: number
  number_of_episodes?: number
}

export interface Genre {
  id: number
  name: string
}

export interface Settings {
  theme: "light" | "dark" | "system"
  cardSize: "small" | "medium" | "large"
  showWatched: boolean
  defaultView: "grid" | "list"
  backdropOpacity: number
}

export interface Stats {
  totalMovies: number
  totalTVShows: number
  totalWatched: number
  totalFavorites: number
  totalWatchlist: number
  totalRuntime: number
  genres: { name: string; count: number }[]
}

