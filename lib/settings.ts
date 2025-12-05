import type { Settings, StatsPreferences } from "@/types"

const SETTINGS_KEY = "binger-settings"

const DEFAULT_STATS_PREFERENCES: StatsPreferences = {
  layout: "grid",
  compactView: false,
  showIcons: true,
  timeFormat: "days",
  colorTheme: "default",
  stats: {
    totalWatchTime: { enabled: true, order: 0 },
    tvShows: { enabled: true, order: 1 },
    movies: { enabled: true, order: 2 },
    totalMedia: { enabled: false, order: 3 },
    averageRating: { enabled: false, order: 4 },
    favorites: { enabled: false, order: 5 },
    wishlist: { enabled: false, order: 6 },
    completionRate: { enabled: false, order: 7 },
    topGenre: { enabled: false, order: 8 },
    recentActivity: { enabled: false, order: 9 },
  },
}

export const DEFAULT_SETTINGS: Settings = {
  showMovieLogos: true,
  animateCards: true,
  autoplayTrailers: true,
  showListsInCollection: false,
  discoverDetailsPreview: true,
  statsPreferences: DEFAULT_STATS_PREFERENCES,
}

export function getStoredSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS

  const stored = localStorage.getItem(SETTINGS_KEY)
  if (!stored) return DEFAULT_SETTINGS

  try {
    const parsedSettings = JSON.parse(stored)
    return {
      ...DEFAULT_SETTINGS,
      ...parsedSettings,
      statsPreferences: {
        ...DEFAULT_STATS_PREFERENCES,
        ...parsedSettings.statsPreferences,
        stats: {
          ...DEFAULT_STATS_PREFERENCES.stats,
          ...parsedSettings.statsPreferences?.stats,
        },
      },
    } as Settings
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function storeSettings(settings: Settings) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error("Error storing settings in localStorage:", error)
  }
}
