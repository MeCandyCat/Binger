import { TMDBSearchResult, TMDBDetails } from '../types'

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

export async function searchTMDB(query: string): Promise<TMDBSearchResult[]> {
  try {
    const data = await fetchTMDB("/search/multi", { query, include_adult: "false" })
    return data.results as TMDBSearchResult[]
  } catch (error) {
    console.error("Error searching TMDB:", error)
    throw error
  }
}

export async function getTMDBDetails(id: number, type: "movie" | "tv"): Promise<TMDBDetails> {
  try {
    const data = await fetchTMDB(`/${type}/${id}`)
    return data as TMDBDetails
  } catch (error) {
    console.error("Error getting TMDB details:", error)
    throw error
  }
}