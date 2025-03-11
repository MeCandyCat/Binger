import type { TMDBSearchResult, TMDBDetails, Genre } from "../types"

const API_BASE_URL = "/api/tmdb"

export async function searchTMDB(query: string): Promise<TMDBSearchResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}?action=search&query=${encodeURIComponent(query)}`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    return data as TMDBSearchResult[]
  } catch (error) {
    console.error("Error searching TMDB:", error)
    throw error
  }
}

export async function getTMDBDetails(id: number, type: "movie" | "tv"): Promise<TMDBDetails> {
  try {
    const response = await fetch(
      `${API_BASE_URL}?action=details&id=${id}&type=${type}&append_to_response=videos,images`,
    )
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    return data as TMDBDetails
  } catch (error) {
    console.error("Error getting TMDB details:", error)
    throw error
  }
}

export async function getTrending(): Promise<TMDBSearchResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}?action=trending`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    return data as TMDBSearchResult[]
  } catch (error) {
    console.error("Error getting trending:", error)
    throw error
  }
}

export async function getTopRated(type: "movie" | "tv"): Promise<TMDBSearchResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}?action=top_rated&type=${type}`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    return data as TMDBSearchResult[]
  } catch (error) {
    console.error("Error getting top rated:", error)
    throw error
  }
}

export async function getGenres(): Promise<Genre[]> {
  try {
    const response = await fetch(`${API_BASE_URL}?action=genres`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    return data.genres as Genre[]
  } catch (error) {
    console.error("Error getting genres:", error)
    throw error
  }
}

export async function getByGenre(genreId: number): Promise<TMDBSearchResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}?action=by_genre&genre_id=${genreId}`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    return data.results as TMDBSearchResult[]
  } catch (error) {
    console.error("Error getting by genre:", error)
    throw error
  }
}

export async function getUpcoming(): Promise<TMDBSearchResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}?action=upcoming`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    return data.results as TMDBSearchResult[]
  } catch (error) {
    console.error("Error getting upcoming:", error)
    throw error
  }
}

export async function getHiddenGems(page = 1): Promise<TMDBSearchResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}?action=hidden_gems&page=${page}`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    return data.results as TMDBSearchResult[]
  } catch (error) {
    console.error("Error getting hidden gems:", error)
    throw error
  }
}

export async function getRecommendations(tmdbId: number, type: "movie" | "tv"): Promise<TMDBSearchResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}?action=recommendations&tmdbId=${tmdbId}&type=${type}`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    return data.results as TMDBSearchResult[]
  } catch (error) {
    console.error("Error getting recommendations:", error)
    throw error
  }
}

export async function getSimilar(tmdbId: number, type: "movie" | "tv"): Promise<TMDBSearchResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}?action=similar&tmdbId=${tmdbId}&type=${type}`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    return data.results as TMDBSearchResult[]
  } catch (error) {
    console.error("Error getting similar:", error)
    throw error
  }
}

