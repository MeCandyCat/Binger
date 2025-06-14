import { NextResponse } from "next/server"
import type { TMDBSearchResult, TMDBDetails } from "@/types"

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

async function fetchTMDB(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB API key is not configured")
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`)
  url.searchParams.append("api_key", TMDB_API_KEY)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")
  const query = searchParams.get("query")
  const id = searchParams.get("id")
  const type = searchParams.get("type") as "movie" | "tv"
  const appendToResponse = searchParams.get("append_to_response")
  const genreId = searchParams.get("genre_id")
  const tmdbId = searchParams.get("tmdbId")
  const page = searchParams.get("page") || "1"

  try {
    let data: any

    switch (action) {
      case "search":
        if (!query) throw new Error("Query parameter is required for search")
        const result = await fetchTMDB("/search/multi", { query, include_adult: "false" })
        data = result.results as TMDBSearchResult[]
        break

      case "details":
        if (!id || !type) throw new Error("ID and type parameters are required for details")
        const params: Record<string, string> = {}
        if (appendToResponse) {
          params.append_to_response = appendToResponse
        } else {
          params.append_to_response = "videos,images"
        }
        data = (await fetchTMDB(`/${type}/${id}`, params)) as TMDBDetails
        break

      case "trending":
        const trending = await fetchTMDB("/trending/all/day")
        data = trending.results as TMDBSearchResult[]
        break

      case "top_rated":
        if (!type) throw new Error("Type parameter is required for top rated")
        const topRated = await fetchTMDB(`/${type}/top_rated`)
        data = topRated.results as TMDBSearchResult[]
        break

      case "genres":
        // Get movie genres
        const movieGenres = await fetchTMDB("/genre/movie/list")
        return NextResponse.json(movieGenres)

      case "by_genre":
        if (!genreId) throw new Error("Genre ID is required for by_genre")
        const mediaType = type || "movie"
        const byGenre = await fetchTMDB(`/discover/${mediaType}`, {
          with_genres: genreId,
          sort_by: "popularity.desc",
          page,
        })
        data = byGenre
        break

      case "upcoming":
        const upcoming = await fetchTMDB("/movie/upcoming", { page })
        data = upcoming
        break

      case "hidden_gems":
        // Get highly rated but less popular movies
        const hiddenGems = await fetchTMDB("/discover/movie", {
          sort_by: "vote_average.desc",
          "vote_count.gte": "100",
          "vote_count.lte": "1000",
          page,
        })
        data = hiddenGems
        break

      case "recommendations":
        if (!tmdbId || !type) throw new Error("TMDB ID and type are required for recommendations")
        const recommendations = await fetchTMDB(`/${type}/${tmdbId}/recommendations`, { page })
        data = recommendations
        break

      case "similar":
        if (!tmdbId || !type) throw new Error("TMDB ID and type are required for similar")
        const similar = await fetchTMDB(`/${type}/${tmdbId}/similar`, { page })
        data = similar
        break

      default:
        throw new Error("Invalid action parameter")
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in TMDB API route:", error)
    return NextResponse.json(
      { error: (error as Error).message || "An error occurred while fetching data from TMDB" },
      { status: 500 },
    )
  }
}
