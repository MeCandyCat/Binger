"use client"

import { Badge } from "@/components/ui/badge"

interface DetailsTabProps {
  details: any
  mediaType: "movie" | "tv"
}

export function DetailsTab({ details, mediaType }: DetailsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Details</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {mediaType === "movie" ? (
              <>
                <div>
                  <h3 className="text-lg font-medium">Title</h3>
                  <p className="text-muted-foreground">{details.title}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Original Title</h3>
                  <p className="text-muted-foreground">{details.original_title}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Release Date</h3>
                  <p className="text-muted-foreground">
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
                  <h3 className="text-lg font-medium">Runtime</h3>
                  <p className="text-muted-foreground">{details.runtime} minutes</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Status</h3>
                  <p className="text-muted-foreground">{details.status}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-medium">Name</h3>
                  <p className="text-muted-foreground">{details.name}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Original Name</h3>
                  <p className="text-muted-foreground">{details.original_name}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">First Air Date</h3>
                  <p className="text-muted-foreground">
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
                  <h3 className="text-lg font-medium">Last Air Date</h3>
                  <p className="text-muted-foreground">
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
                  <h3 className="text-lg font-medium">Number of Seasons</h3>
                  <p className="text-muted-foreground">{details.number_of_seasons}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Number of Episodes</h3>
                  <p className="text-muted-foreground">{details.number_of_episodes}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Status</h3>
                  <p className="text-muted-foreground">{details.status}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Type</h3>
                  <p className="text-muted-foreground">{details.type}</p>
                </div>
              </>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Original Language</h3>
              <p className="text-muted-foreground">
                {details.original_language
                  ? new Intl.DisplayNames(["en"], { type: "language" }).of(details.original_language)
                  : "Unknown"}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Popularity</h3>
              <p className="text-muted-foreground">{details.popularity.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Vote Average</h3>
              <p className="text-muted-foreground">{details.vote_average.toFixed(1)} / 10</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Vote Count</h3>
              <p className="text-muted-foreground">{details.vote_count.toLocaleString()}</p>
            </div>
            {details.budget !== undefined && (
              <div>
                <h3 className="text-lg font-medium">Budget</h3>
                <p className="text-muted-foreground">
                  {details.budget ? `$${details.budget.toLocaleString()}` : "Not available"}
                </p>
              </div>
            )}
            {details.revenue !== undefined && (
              <div>
                <h3 className="text-lg font-medium">Revenue</h3>
                <p className="text-muted-foreground">
                  {details.revenue ? `$${details.revenue.toLocaleString()}` : "Not available"}
                </p>
              </div>
            )}
            {details.homepage && (
              <div>
                <h3 className="text-lg font-medium">Homepage</h3>
                <a
                  href={details.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {details.homepage}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Production Companies */}
      {details.production_companies && details.production_companies.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Production Companies</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {details.production_companies.map((company) => (
              <div key={company.id} className="bg-muted/30 p-4 rounded-lg text-center">
                {company.logo_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w154${company.logo_path}`}
                    alt={company.name}
                    className="h-12 object-contain mx-auto mb-2"
                  />
                ) : (
                  <div className="w-12 h-12 bg-muted flex items-center justify-center rounded-full mx-auto mb-2">
                    <span className="text-lg font-bold">{company.name.charAt(0)}</span>
                  </div>
                )}
                <p className="font-medium">{company.name}</p>
                {company.origin_country && <p className="text-sm text-muted-foreground">{company.origin_country}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Production Countries */}
      {details.production_countries && details.production_countries.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Production Countries</h3>
          <div className="flex flex-wrap gap-2">
            {details.production_countries.map((country) => (
              <Badge key={country.iso_3166_1} variant="secondary">
                {country.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
