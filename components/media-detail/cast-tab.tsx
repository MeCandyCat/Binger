"use client"

interface CastTabProps {
  cast: any[]
  crew: any[]
}

export function CastTab({ cast, crew }: CastTabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Cast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {cast.map((person) => (
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

      <div>
        <h2 className="text-2xl font-semibold mb-6">Crew</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {crew.map((person) => (
            <div key={`${person.id}-${person.job}`} className="p-3 bg-muted/30 rounded-lg">
              <h4 className="font-medium">{person.name}</h4>
              <p className="text-sm text-muted-foreground">{person.job}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
