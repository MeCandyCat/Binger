"use client"

import { Button } from "@/components/ui/button"

interface OverviewTabProps {
  details: any
  cast: any[]
  directors: any[]
  writers: any[]
  producers: any[]
  reviews: any[]
  onViewAllCast: () => void
  onViewAllReviews: () => void
}

export function OverviewTab({
  details,
  cast,
  directors,
  writers,
  producers,
  reviews,
  onViewAllCast,
  onViewAllReviews,
}: OverviewTabProps) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-muted-foreground leading-relaxed">{details.overview}</p>
        </div>

        {/* Key People */}
        {(directors.length > 0 || writers.length > 0 || producers.length > 0) && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Key People</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {directors.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Director</h4>
                  <p>{directors.map((d) => d.name).join(", ")}</p>
                </div>
              )}
              {writers.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Writer</h4>
                  <p>{writers.map((w) => w.name).join(", ")}</p>
                </div>
              )}
              {producers.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Producer</h4>
                  <p>{producers.map((p) => p.name).join(", ")}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Top Cast Preview */}
        {cast.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Top Cast</h3>
              <Button variant="ghost" size="sm" onClick={onViewAllCast} className="text-primary">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cast.slice(0, 4).map((person) => (
                <div key={person.id} className="text-center">
                  <div className="aspect-square relative mb-2 overflow-hidden rounded-lg">
                    <img
                      src={
                        person.profile_path
                          ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                          : "/placeholder.svg?height=185&width=185"
                      }
                      alt={person.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h4 className="font-medium text-sm">{person.name}</h4>
                  <p className="text-xs text-muted-foreground">{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Media Info */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold">Media Info</h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
              <p>{details.status}</p>
            </div>
            {details.type === "movie" ? (
              <>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Release Date</h4>
                  <p>
                    {details.release_date
                      ? new Date(details.release_date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Unknown"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Runtime</h4>
                  <p>{details.runtime} minutes</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Budget</h4>
                  <p>{details.budget ? `$${details.budget.toLocaleString()}` : "Not available"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Revenue</h4>
                  <p>{details.revenue ? `$${details.revenue.toLocaleString()}` : "Not available"}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">First Air Date</h4>
                  <p>
                    {details.first_air_date
                      ? new Date(details.first_air_date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Unknown"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Last Air Date</h4>
                  <p>
                    {details.last_air_date
                      ? new Date(details.last_air_date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Unknown"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Number of Seasons</h4>
                  <p>{details.number_of_seasons}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Number of Episodes</h4>
                  <p>{details.number_of_episodes}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Episode Runtime</h4>
                  <p>
                    {details.episode_run_time && details.episode_run_time.length > 0
                      ? `${details.episode_run_time[0]} minutes`
                      : "Unknown"}
                  </p>
                </div>
              </>
            )}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Original Language</h4>
              <p>
                {details.original_language
                  ? new Intl.DisplayNames(["en"], { type: "language" }).of(details.original_language)
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>

        {/* Production Companies */}
        {details.production_companies && details.production_companies.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Production</h3>
            <div className="space-y-3">
              {details.production_companies.slice(0, 3).map((company: { id: number; logo_path: string | null; name: string }) => (
                <div key={company.id} className="flex items-center gap-3">
                  {company.logo_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                      alt={company.name}
                      className="h-8 object-contain"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-muted flex items-center justify-center rounded">
                      <span className="text-xs">{company.name.charAt(0)}</span>
                    </div>
                  )}
                  <span>{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
