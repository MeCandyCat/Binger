import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Film, Tv } from "lucide-react"

interface StatsProps {
  totalMinutes: number
  totalShows: number
  totalMovies: number
}

export function Stats({ totalMinutes, totalShows, totalMovies }: StatsProps) {
  const hours = Math.floor(totalMinutes / 60)
  const days = Math.floor(hours / 24)

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Watch Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{days} days</div>
          <p className="text-xs text-muted-foreground">
            {hours} hours ({totalMinutes} minutes)
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">TV Shows</CardTitle>
          <Tv className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalShows}</div>
          <p className="text-xs text-muted-foreground">Completed shows</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Movies</CardTitle>
          <Film className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMovies}</div>
          <p className="text-xs text-muted-foreground">Watched movies</p>
        </CardContent>
      </Card>
    </div>
  )
}

