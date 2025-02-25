import { ThemeToggle } from "@/components/theme-toggle"
import { AddMediaDialog } from "@/components/add-media-dialog"

interface NavBarProps {
  onAddMedia: (
    tmdbId: number,
    type: "movie" | "tv",
    rating: number,
    category: "Watched" | "Wishlist" | "Streaming",
    note?: string,
    customDuration?: number,
    seasons?: number,
    episodesPerSeason?: number,
    episodeDuration?: number,
    completedSeasons?: number,
  ) => Promise<void>
}

export function NavBar({ onAddMedia }: NavBarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
      <h1 className="text-3xl sm:text-4xl font-bold">Binger</h1>
      <div className="flex flex-wrap items-center gap-4">
        <ThemeToggle />
        <AddMediaDialog onAdd={onAddMedia} />
      </div>
    </div>
  )
}

